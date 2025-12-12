import {initializeApp} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAfK7SCIGsZsPcW3Gd3yZsITl2sZw1jBxY",
    authDomain: "datn-lightbe.firebaseapp.com",
    databaseURL:
        "https://datn-lightbe-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "datn-lightbe",
    storageBucket: "datn-lightbe.appspot.com",
    messagingSenderId: "398434574666",
    appId: "1:398434574666:web:40ab20f1a11cfbad5521b3",
    measurementId: "G-B520DWQ9L0",
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
let fileInStorages = [];
let fileImgCurent = [];
let trDataInDatatable = [];

function randomString(n) {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = "";
    for (var i = 0; i < n; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

function renameFile(file) {
    var name = file.name; // lấy tên file
    var dotIndex = name.lastIndexOf("."); // lấy vị trí dấu chấm cuối cùng
    var ext = name.substring(dotIndex); // lấy đuôi file
    var newName = randomString(10) + ext; // tạo tên file mới bằng cách thêm chuỗi ngẫu nhiên vào trước đuôi file
    return new File([file], newName, {type: file.type}); // trả về file mới có tên mới
}

async function ClearImg(url) {
    const parsedUrl = new URL(url);
    parsedUrl.search = '';
    const urlImg = parsedUrl.toString();
    const startIndex = urlImg.indexOf('images%2F');
    const imagePathWithToken = urlImg.slice(startIndex);
    const imagePath = imagePathWithToken.replace(/%2F/g, '/');
    try {
        await deleteObject(ref(storage, imagePath));
        console.log(`Đã xóa ảnh ${imagePath} thành công`);
    } catch (error) {
        console.error(`Lỗi khi xóa ảnh ${imagePath}:`, error);
    }
}

async function ClearMultipleImages(imagePaths) {
    try {
        const deletionPromises = imagePaths.map(async (imagePath) => {
            if (imagePath.path == null) {
                await deleteObject(ref(storage, imagePath.path));
                console.log(`Đã xóa ảnh ${imagePath} thành công`);
            } else {
                await ClearImg(imagePath.url);
            }
        });
        await Promise.all(deletionPromises);
        console.log("Tất cả ảnh đã được xóa thành công.");
    } catch (error) {
        console.error("Lỗi khi xóa ảnh:", error);
    }
}

function Confirm(title, message, txt_cancel, txt_confirm) {
    return new Promise((resolve, reject) => {
        Swal.fire({
            title: title,
            text: message,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: txt_cancel,
            confirmButtonText: txt_confirm,
        }).then((result) => {
            resolve(result.isConfirmed);
        });
    })
}

window.addEventListener('beforeunload', function (event) {
    if (fileInStorages.length > 0) {
        ClearMultipleImages(fileInStorages).then(r => {
            console.log(r)
            event.preventDefault();
        });
    }
});

$(document).ready(function () {
    // INITIALIZATION OF DATATABLES
    // =======================================================
    var dataArray = [];
    $('#datatableGetdata tr').each(function () {
        let dataObject = {};
        $(this).find('[name]').each(function () {
            var name = $(this).attr('name');
            var value = $(this).text();
            dataObject[name] = value;
        });
        dataArray.push(dataObject);
    });

    var datatable = $.HSCore.components.HSDatatables.init($('#datatable'), {
        columnDefs: [
            {targets: 0, data: 'id', orderable: false, searchable: false},
            {targets: 1, data: 'img', orderable: false, searchable: false},
            {targets: 2, data: 'kichCo', orderable: false, searchable: true},
            {targets: 3, data: 'maMauSac', orderable: false, searchable: true},
            {targets: 4, data: 'giaGoc', orderable: false, searchable: true},
            {targets: 5, data: 'giaBan', orderable: false, searchable: true},
            {targets: 6, data: 'soLuong', orderable: false, searchable: true},
            {targets: 7, data: 'tenMau', orderable: false, searchable: false},
        ],
        select: {
            style: 'multi', selector: 'td:first-child input[type="checkbox"]',
            classMap: {
                checkAll: '#datatableCheckAll', counter: '#datatableCounter', counterInfo: '#datatableCounterInfo'
            }
        },
        language: {
            zeroRecords: '<div class="text-center p-4">' + '<img class="mb-3" src="/assets/cms/svg/illustrations/sorry.svg" alt="Image Description" style="width: 7rem;">' + '<p class="mb-0">Không có dữ liệu</p>' + '</div>'
        },
        createdRow: function (row, data, dataIndex) {
            let customHTML = `
                                <th class="table-column-pr-0 id-version-shoe" data-colum-index="0" data-color-code-id="${data.maMauSac}">
                                    <div class="custom-control custom-checkbox">
                                        <input type="text" class="form-control" name="id"
                                               value="${data.id}" hidden="">
                                        <input type="checkbox" class="custom-control-input"
                                               id="productVariationsCheck${data.id}">
                                        <label class="custom-control-label"
                                               for="productVariationsCheck${data.id}"></label>
                                    </div>
                                </th>
                                <th class="width-100 row-show-img position-relative" data-colum-index="1" data-color="${data.maMauSac}" style="width: 100px !important;">
                                    <div class="background-spinner">
                                       <div class="spinner-border text-primary d-none" role="status">
                                           <span class="sr-only">Loading...</span>
                                       </div>
                                    </div>
                                    <label for="fileimgselected${data.id}">
                                        <img class="img-shoe" data-color-code-img="${data.maMauSac}"
                                        src="${data.img.length === 0 ? '/assets/cms/img/400x400/img2.jpg' : data.img}"
                                             alt="Image Description">
                                    </label>
                                    <i class="tio-delete btn-del-img"></i>
                                    <input class="formAddImg form-control" data-color-code-input="${data.maMauSac}" type="file" name="img" id="fileimgselected${data.id}" hidden="">
                                </th>
                                <th class="table-column-pl-0 width-100 " data-colum-index="2">
                                 <input type="text" class="form-control" name="kichCo" value="${data.kichCo}" disabled>
                                </th>
                                <th class="table-column-pl-0 width-100 " data-colum-index="3">
                                    <input type="text" class="form-control" name="mauSac" value="${data.maMauSac}" style="background-color:${data.maMauSac}" disabled>
                                </th>
                                <th class="table-column-pl-0 " data-colum-index="4">
                                    <input type="text" class="form-control money-input-mask-num" name="giaGoc"
                                           value="${data.giaGoc}">
                                </th>
                                <th class="table-column-pl-0 " data-colum-index="5">
                                    <input type="text" class="form-control money-input-mask-num" name="giaBan" value="${data.giaBan}">
                                </th>
                                <th class="table-column-pl-0 " data-colum-index="6">
                                    <!-- Quantity Counter -->
                                    <div class="js-quantity-counter input-group-quantity-counter">
                                        <input type="number" name="soLuong"
                                               class="js-result form-control input-group-quantity-counter-control"
                                               value="${data.soLuong}">
                                        <div class=" input-group-quantity-counter-toggle">
                                            <a class="js-minus input-group-quantity-counter-btn">
                                                <i class="tio-remove"></i>
                                            </a>
                                            <a class="js-plus input-group-quantity-counter-btn">
                                                <i class="tio-add"></i>
                                            </a>
                                        </div>
                                    </div>
                                </th>
                                <th class="table-column-pr-0 pl-lg-7 " data-colum-index="7">
                                    <div class="btn-group" role="group" aria-label="Edit group">
                                        <a class="btn btn-white remove-item" data-id="${data.id}" data-color-code-remove="${data.maMauSac}" data-size-remove="${data.kichCo}" href="javascript:;">
                                            <i class="tio-delete-outlined"></i>
                                        </a>
                                    </div>
                                </th>`;
            $(row).html(customHTML);
        }
    });
    datatable.rows.add(dataArray).draw();
    $('#sanPham').on('change', function () {
        let selectedText = $(this).find('option:selected').text();
        $('#sanPham_input').val(selectedText)
        $('#kichCo').val(null).trigger('change');
        $('#mauSac').val(null).trigger('change');
        datatable.clear().draw();
    })
    let selectedText = $('#sanPham').find('option:selected').text();
    $('#sanPham_input').val(selectedText)

    function getArrIndex() {
        let arrIndexRow = [];
        $('.custom-control-input:checked').each(function () {
            let index = datatable.row($(this).closest('tr')).index();
            if (index !== undefined) {
                let object = {index: index, tr: $(this).closest('tr')}
                arrIndexRow.push(object);
            }
        });
        return arrIndexRow;
    }

    $('#datatable').on('change', 'input', function () {
        let rowIndex = datatable.row($(this).closest('tr')).index();
        let name = $(this).attr('name');
        let columnIndex = $(this).closest('th').data('colum-index');
        var newValue = $(this).val();
        let arr = getArrIndex();
        if (columnIndex > 1) {
            let st = arr.some(function (item) {
                return item.index === rowIndex;
            });
            if (st) {
                arr.forEach((item) => {
                    datatable.cell(item.index, columnIndex).data(newValue);
                    let inputElement = $(item.tr).find('th[data-colum-index=' + columnIndex + ']')
                        .find('input[name=' + name + ']');
                    inputElement.val(newValue);
                })
            } else {
                datatable.cell(rowIndex, columnIndex).data(newValue);
            }
        }
    });
    setIMG();

    function setIMG() {
        let mauSac = null;
        let arr = [];
        let oj = {};
        let img = $('.row-show-img');
        for (let i = 0; i < img.length; i++) {
            let color = $(img[i]).attr('data-color');
            $(img[i]).closest('tr').attr('color-code', color);
            if (mauSac == null) {
                mauSac = color;
                let oj = {color: color, ele: img[i]};
                arr.push(oj)
            } else if (color == mauSac) {
                $(img[i]).attr('status-remove', true);
            } else {
                mauSac = color
                let oj = {color: color, ele: img[i]};
                arr.push(oj)
            }
        }
        $("th.row-show-img[status-remove='true']").each(function (index, element) {
            $(element).addClass('d-none');
        });
        img.removeAttr('status-remove');
        for (let i = 0; i < arr.length; i++) {
            $(arr[i].ele).attr('rowspan', $('tr[color-code=' + arr[i].color + ']').length).removeClass('d-none');
        }
    }

    function resetRowData() {
        let data = datatable.data();
        let currentPage = datatable.page.info().page;
        datatable.clear().draw();
        datatable.rows.add(data).draw();
        datatable.page(currentPage).draw('page');
        setIMG();
    }

    datatable.on('draw.dt', function () {
        updateShowNum();
        setIMG();
    });


    $('#datatableSearch').on('mouseup', function (e) {
        var $input = $(this), oldValue = $input.val();

        if (oldValue == "") return;

        setTimeout(function () {
            var newValue = $input.val();

            if (newValue == "") {
                // Gotcha
                datatable.search('').draw();
            }
        }, 1);
    });

    function checkColorAndSize(mau, co) {
        let foundItem = trDataInDatatable.find(function (item) {
            return item.maMauSac === mau && item.kichCo === co;
        });
        return foundItem !== undefined ? foundItem : null;
    }

    function getImgByColor(color) {
        let img = null;
        datatable.rows().data().each(function (rowData) {
            if (rowData.maMauSac === color) {
                img = rowData.img;
                return false;
            }
        });

        if (!img) {
            img = '/assets/cms/img/400x400/img2.jpg';
        }
        return img;
    }


    $('#mauSac, #kichCo').on('change', function () {
        let mausac = $('#mauSac').val();
        let kichco = $('#kichCo').val();
        let newData = [];
        trDataInDatatable = datatable.data().toArray();
        mausac.forEach((mau) => {
            kichco.forEach((co) => {
                let data = checkColorAndSize(mau, co);
                if (data === null) {
                    let tr = {
                        id: randomString(10),
                        img: getImgByColor(mau),
                        kichCo: co,
                        maMauSac: mau,
                        tenMau: "",
                        giaGoc: "",
                        giaBan: "",
                        soLuong: "",
                    };
                    newData.push(tr);
                } else {
                    newData.push(data);
                }
            })
        })
        datatable.clear();
        datatable.rows.add(newData);
        trDataInDatatable = datatable.data().toArray();
        datatable.order([3, 'asc']).draw();
        resetRowData();
    });
    $(document).on('click', '#wraperKichCo .select2-selection__choice__remove', function (e) {
        e.preventDefault();
        let removeElement = $(this);
        Confirm('Bạn chắc chứ ?', 'Bạn đang xóa một phiên bản sản phẩm.', 'Hủy', 'Xác Nhận').then((check) => {
            if (check) {
                removeElement.trigger('click');
            }
        });
    });

    function containsAlphabetic(str) {
        return /[a-zA-Z]/.test(str);
    }

    function updateShowNum() {
        let pageInfo = datatable.page.info();
        let displayedRows = pageInfo.end - pageInfo.start;
        let show = $('#datatableEntries')
        if (Number(show.val()) < 10) {
            show.find('option:selected').remove();
            show.append(`<option value="${displayedRows}" selected>${displayedRows}</option>`)
        } else {
            if (show.find('option[value="10"]').length === 0) {
                show.append(`<option value="10" selected>10</option>`)
            }
            if (show.val()>displayedRows){
                if (show.find(`option[value="${displayedRows}"]`).length === 0){
                    show.append(`<option value="${displayedRows}" selected>${displayedRows}</option>`)
                }else{
                    show.val(displayedRows);
                }
            }
        }
    }
    $(document).on('click', '.remove-item', async function () {
        let element = $(this);
        Swal.fire({
            title: "Bạn chắc chứ?",
            text: "Sau khi xóa sẽ không thể khôi phục lại!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Xác Nhận"
        }).then((result) => {
            if (result.isConfirmed) {
                let id = element.data('id');
                let dtColor = element.data('color-code-remove');
                let dtSize = element.data('size-remove');
                DeleteCTSP(id, dtColor, dtSize).then((check) => {
                    if (check) {
                        let rowIndex = element.closest('tr')[0]._DT_RowIndex
                        let currentPage = datatable.page.info().page;
                        datatable.row(rowIndex).remove().draw();
                        datatable.page(currentPage).draw('page');
                    }
                })
                resetRowData()
            }
        });
    });

    function DeleteCTSP(id, color, size) {
        return new Promise((resolve, reject) => {
            let id_sp = $('#sanPham').val();
            $.ajax({
                url: "/api/xoa-chi-tiet-san-pham",
                type: "DELETE",
                data: {
                    sanPham: id_sp,
                    id: id,
                    color: color,
                    size: size
                },
                success: function () {
                    ToastSuccess("Xóa thành công.")
                    resolve(true)
                }, error: function (e) {
                    console.log(e.getResponseHeader('status'))
                    switch (e.getResponseHeader('status')) {
                        case "IdNull":
                            ToastError("ID không được trống.")
                            break;
                        case "NotExits":
                            ToastError("CTSP không tồn tại.")
                            break;
                        case "constraint":
                            ToastError("Không thể xóa phiên bản đã phát sinh hóa đơn.")
                            break;
                        default:
                            ToastError("Lỗi !")
                    }
                    resolve(false);
                }
            })
        })
    }

    $('#addVariantsContainer').on('change', '.formAddImg', async function (e) {
        const files = e.target.files;
        let img = $(this).parent().find('.img-shoe')[0];
        let snip = $(this).parent().find('.spinner-border')[0];
        const imgUrlSrc = $(img).attr('src')
        if (imgUrlSrc !== '/assets/cms/img/400x400/img2.jpg') {
            let Object = {path: null, url: imgUrlSrc}
            fileImgCurent.push(Object);
        }
        $(img).addClass('d-none')
        $(snip).removeClass('d-none');
        $(snip).parent().removeClass('d-none');
        let del = $(this).parent().find('.btn-del-img')[0];
        const file = renameFile(files[0]);
        const tempUrl = URL.createObjectURL(file);
        img.src = tempUrl;
        const storageRef = ref(storage, `images/${file.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            let imgOJ = {path: storageRef._location.path_, url: url}
            fileInStorages.push(imgOJ);
            let rowIndex = datatable.row($(this).closest('tr')).index();
            let ColumnIndex = 1;
            let mauSacToUpdate = $(this).closest('th').attr('data-color');
            datatable.cell(rowIndex, ColumnIndex).data(url);
            datatable.rows().eq(0).each(function (index) {
                var currentMauSac = datatable.cell(index, 3).data();
                if (currentMauSac === mauSacToUpdate) {
                    datatable.cell(index, 1).data(url);
                    datatable.draw();
                }
            });
            img.src = url;
            $(snip).addClass('d-none')
            $(img).removeClass('d-none');
            $(snip).parent().addClass('d-none');
        } catch (error) {
            console.error(error);
        }
        $(del).on('click', async function () {
            try {
                await deleteObject(storageRef);
                for (let i = 0; i < fileInStorages.length; i++) {
                    if (fileInStorages[i].path === storageRef._location.path_) {
                        fileInStorages.splice(i, 1);
                        break;
                    }
                }
                console.log("Deleted", storageRef.name);
                img.src = '/assets/cms/img/400x400/img2.jpg';
            } catch (error) {
                console.error(error);
            }
        });
    });

    function containsLetter(str) {
        return /[a-zA-Z]/.test(str);
    }

    function checkString(str) {
        let firstChar = str.charAt(0);
        let check = false;
        if (firstChar !== '#' && !/^[a-zA-Z0-9]+$/.test(firstChar)) {
            check = true;
        }

        let restOfString = str.slice(1);
        if (str.includes(" ")) {
            check = true;
        }
        let specialChars = /[^A-Za-z0-9]/;
        if (specialChars.test(restOfString)) {
            check = true;
        }
        return check;
    }

    function redirectToProductPage() {
        setTimeout(() => {
            window.location.href = "/cms/product";
        }, 3000);
    }

    $('#save-product-detail').on('click', function () {
        Swal.fire({
            title: "Bạn chắc chứ?",
            text: "Các thay đổi sẽ được áp dụng !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Xác Nhận"
        }).then((result) => {
            if (result.isConfirmed) {
                let sanPham = $('#sanPham').val();
                let tenSanPham = $('#sanPham_input').val();
                let theLoai = $('#theLoai').val();
                let thuongHieu = $('#thuongHieu').val();
                let chatLieu = $('#chatLieu').val();
                let deGiay = $('#deGiay').val();
                let coGiay = $('#coGiay').val();
                let muiGiay = $('#muiGiay').val();
                let giaGoc = $('#giaGoc').val();
                let mota = $('.ql-editor').html();
                let tags = $('#lstTags').find('option:selected').map(function () {
                    return $(this).text();
                }).get();
                let product_details = datatable.rows().data().toArray();

                if (sanPham === '#') {
                    ToastError("Vui lòng chọn Sản Phẩm !")
                    $('#sanPham').focus();
                    return;
                }
                if (isEmpty(tenSanPham)) {
                    ToastError("Vui lòng nhập tên sản phẩm !")
                    $('#sanPham_input').focus();
                    return;
                }
                if (theLoai === '#') {
                    ToastError("Vui lòng chọn Thể Loại !")
                    $('#theLoai').focus();
                    return;
                }
                if (thuongHieu === '#') {
                    ToastError("Vui lòng chọn Thương Hiệu !")
                    $('#thuongHieu').focus();
                    return;
                }
                if (chatLieu === '#') {
                    ToastError("Vui lòng chọn Chất Liệu !")
                    $('#chatLieu').focus();
                    return;
                }
                if (deGiay === '#') {
                    ToastError("Vui lòng chọn Đế Giày !")
                    $('#deGiay').focus();
                    return;
                }
                if (coGiay === '#') {
                    ToastError("Vui lòng chọn Cổ Giày !")
                    $('#coGiay').focus();
                    return;
                }
                if (muiGiay === '#') {
                    ToastError("Vui lòng nhập Mũi Giày !")
                    $('#muiGiay').focus();
                    return;
                }
                if (isEmpty(sanPham)) {
                    ToastError("Vui lòng chọn Sản Phẩm !")
                    $('#sanPham').focus();
                    return;
                }
                if (isEmpty(tenSanPham)) {
                    ToastError("Vui lòng nhập tên sản phẩm !")
                    $('#sanPham_input').focus();
                    return;
                }
                if (isEmpty(theLoai)) {
                    ToastError("Vui lòng chọn Thể Loại !")
                    $('#theLoai').focus();
                    return;
                }
                if (isEmpty(thuongHieu)) {
                    ToastError("Vui lòng chọn Thương Hiệu !")
                    $('#thuongHieu').focus();
                    return;
                }
                if (isEmpty(chatLieu)) {
                    ToastError("Vui lòng chọn Chất Liệu !")
                    $('#chatLieu').focus();
                    return;
                }
                if (isEmpty(deGiay)) {
                    ToastError("Vui lòng chọn Đế Giày !")
                    $('#deGiay').focus();
                    return;
                }
                if (isEmpty(coGiay)) {
                    ToastError("Vui lòng chọn Cổ Giày !")
                    $('#coGiay').focus();
                    return;
                }
                if (isEmpty(muiGiay)) {
                    ToastError("Vui lòng nhập Mũi Giày !")
                    $('#muiGiay').focus();
                    return;
                }
                if (Number($('#soLuong').val()) <= 0) {
                    ToastError("Vui lòng nhập Số Lượng !")
                    $('#soLuong').focus();
                    return;
                }
                if (isEmpty(mota) || mota == '<p><br></p>') {
                    ToastError("Vui lòng nhập Giới Thiệu Sản Phẩm !")
                    return;
                }
                if (product_details.length === 0) {
                    ToastError('Vui lòng chọn các option sản phẩm');
                    return;
                }
                for (let i = 0; i < tags.length; i++) {
                    if (checkString(tags[i])) {
                        ToastError('Tags "' + tags[i] + '" không hợp lệ !')
                        return;
                    }
                }
                let message = '';
                let check = true;
                for (let i = 0; i < product_details.length; i++) {
                    if (containsLetter(product_details[i].id)) {
                        product_details[i].id = 0;
                    }
                    if (product_details[i].img == '/assets/cms/img/400x400/img2.jpg') {
                        product_details[i].img = null;
                        message = "Vui lòng chọn ảnh !";
                        check = false;
                        break;
                    }
                    if (isEmpty(product_details[i].kichCo)) {
                        message = "Vui lòng nhập Size !";
                        check = false;
                        break;
                    }
                    if (isEmpty(product_details[i].maMauSac)) {
                        message = "Vui lòng chọn Màu Sắc !";
                        check = false;
                        break;
                    }
                    if (convertToNumber(product_details[i].giaBan) < 0) {
                        message = "Vui lòng nhập của Cỡ :" + product_details[i].kichCo + " Màu :" + product_details[i].maMauSac;
                        check = false;
                        break;
                    }
                    if (convertToNumber(product_details[i].giaGoc) < 0) {
                        message = "Vui lòng nhập giá gốc của Cỡ :" + product_details[i].kichCo + " Màu :" + product_details[i].maMauSac;
                        check = false;
                        break;
                    }
                    if (isEmpty(product_details[i].soLuong) || Number(product_details[i].soLuong) < 1) {
                        message = "Vui lòng nhập Số Lượng !";
                        check = false;
                        break;
                    }
                }
                if (check) {
                    // post data lên thôi
                    $.ajax({
                        type: "POST",
                        url: "/api/chi-tiet-san-pham",
                        data: {
                            sanPham: sanPham,
                            tenSanPham: tenSanPham,
                            theLoai: theLoai,
                            thuongHieu: thuongHieu,
                            chatLieu: chatLieu,
                            deGiay: deGiay,
                            coGiay: coGiay,
                            moTa: mota,
                            muiGiay: muiGiay,
                            giaNhap: 100,
                            giaGoc: giaGoc,
                            tags: tags,
                            product_details: JSON.stringify(product_details)
                        }, success: (data, status, xhr) => {
                            ToastSuccess('Lưu Thành Công !')
                            fileInStorages = fileInStorages.filter((storage) => {
                                return !product_details.some((pro) => pro.img === storage.url);
                            });
                            let arr = fileInStorages.concat(fileImgCurent);
                            ClearMultipleImages(arr).then(r => {
                                redirectToProductPage()
                            });

                        }, error: (e) => {
                            console.log(e.getResponseHeader('error'))
                            switch (e.getResponseHeader('error')) {
                                case "GiaBanNull":
                                    ToastError('Giá bán không được để trống.')
                                    break;
                                case "GiaGocNull":
                                    ToastError('Giá gốc không được để trống.')
                                    break;
                                case "QuantityNull":
                                    ToastError('Số lượng không được để trống.')
                                    break;
                                case "OptionNull":
                                    ToastError('Vui lòng chọn phiên bản.')
                                    break;
                                case "SizeNull":
                                    ToastError('Kích cỡ không được để trống.')
                                    break;
                                case "IMGNull":
                                    ToastError('Màu sắc không được để trống.')
                                    break;
                                case "ColorNull":
                                    ToastError('Màu sắc không được để trống.')
                                    break;
                                case "MaxLenghtMota":
                                    ToastError('Màu sắc không được để trống.')
                                    break;
                                default:
                                    ToastError('Lỗi !')
                            }

                        }
                    })
                } else (
                    ToastError(message)
                )
            }
        });
    })


})


