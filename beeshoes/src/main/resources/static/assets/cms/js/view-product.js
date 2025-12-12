function Toast(status, message) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        showCloseButton: true,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
        customClass: {
            popup: 'custom-toast-class', // Thêm lớp CSS tùy chỉnh
        }
    });
    Toast.fire({
        icon: status,
        title: message
    });
}

function ToastSuccess(message) {
    Toast('success', message)
}

function ToastError(message) {
    Toast('error', message)
}

$(document).ready(function () {
    // INITIALIZATION OF FANCYBOX
    // =======================================================
    $('.js-fancybox').each(function () {
        var fancybox = $.HSCore.components.HSFancyBox.init($(this));
    })

    $(document).on('click', '.js-plus, .js-minus', function () {
        var quantityInput = $(this).closest('.js-quantity-counter').find('.js-result');
        if (!quantityInput.prop('disabled')) {
            var currentQuantity = parseInt(quantityInput.val(), 10);
            if ($(this).hasClass('js-plus')) {
                quantityInput.val(currentQuantity + 1);
            } else if ($(this).hasClass('js-minus')) {
                quantityInput.val(Math.max(currentQuantity - 1, 0));
            }
            quantityInput.change();
        }
    });
    $(document).on('input', '.money-input-mask', function () {
        $(this).mask('#.###.###.###đ', {reverse: true});
    });
    $(document).on('input', '.money-input-mask-num', function () {
        $(this).mask('#.###.###.###', {reverse: true});
    });
});
$(document).on('ready', function () {
    // ONLY DEV
    // =======================================================
    var dataArray = [];
    $('#tableData tr').each(function () {
        let dataObject = {};
        $(this).find('[data-name]').each(function () {
            var name = $(this).attr('data-name');
            var value = $(this).text();
            dataObject[name] = value;
        });
        dataArray.push(dataObject);
    });
    // BUILDER TOGGLE INVOKER
    // =======================================================
    $('.js-navbar-vertical-aside-toggle-invoker').click(function () {
        $('.js-navbar-vertical-aside-toggle-invoker i').tooltip('hide');
    });


    // INITIALIZATION OF MEGA MENU
    // =======================================================
    var megaMenu = new HSMegaMenu($('.js-mega-menu'), {
        desktop: {
            position: 'left'
        }
    }).init();


    // INITIALIZATION OF NAVBAR VERTICAL NAVIGATION
    // =======================================================
    var sidebar = $('.js-navbar-vertical-aside').hsSideNav();


    // INITIALIZATION OF TOOLTIP IN NAVBAR VERTICAL MENU
    // =======================================================
    $('.js-nav-tooltip-link').tooltip({boundary: 'window'})

    $(".js-nav-tooltip-link").on("show.bs.tooltip", function (e) {
        if (!$("body").hasClass("navbar-vertical-aside-mini-mode")) {
            return false;
        }
    });


    // INITIALIZATION OF UNFOLD
    // =======================================================
    $('.js-hs-unfold-invoker').each(function () {
        var unfold = new HSUnfold($(this)).init();
    });


    // INITIALIZATION OF FORM SEARCH
    // =======================================================
    $('.js-form-search').each(function () {
        new HSFormSearch($(this)).init()
    });


    // INITIALIZATION OF NAV SCROLLER
    // =======================================================
    $('.js-nav-scroller').each(function () {
        new HsNavScroller($(this)).init()
    });


    // INITIALIZATION OF SELECT2
    // =======================================================
    $('.js-select2-custom').each(function () {
        var select2 = $.HSCore.components.HSSelect2.init($(this));
    });


    // INITIALIZATION OF DATATABLES
    // =======================================================
    var datatable = $.HSCore.components.HSDatatables.init($('#datatable'), {
        columnDefs: [
            {targets: 0, data: 'id', orderable: false, searchable: false},
            {targets: 1, data: 'img', orderable: false, searchable: false},
            {targets: 2, data: 'maMauSac', orderable: true, searchable: true},
            {targets: 3, data: 'maSanPham', orderable: false, searchable: true},
            {targets: 4, data: 'kichCo', orderable: false, searchable: true},
            {targets: 5, data: 'giaGoc', orderable: false, searchable: true},
            {targets: 6, data: 'giaBan', orderable: false, searchable: true},
            {targets: 7, data: 'soLuong', orderable: false, searchable: true},
            {targets: 8, data: 'trangThai', orderable: false, searchable: false},
            {targets: 9, data: 'ngayTao', orderable: false, searchable: false},
        ],
        select: {
            style: 'multi',
            selector: 'td:first-child input[type="checkbox"]',
            classMap: {
                checkAll: '#datatableCheckAll',
                counter: '#datatableCounter',
                counterInfo: '#datatableCounterInfo'
            }
        },
        language: {
            zeroRecords: '<div class="text-center p-4">' +
                '<img class="mb-3" src="/assets/cms/svg/illustrations/sorry.svg" alt="Image Description" style="width: 7rem;">' +
                '<p class="mb-0">Không có dữ liệu</p>' +
                '</div>'
        },
        createdRow: function (row, data, dataIndex) {
            let customHTML = `
                                <td class="table-column-pr-0 id-version-shoe" data-colum-index="0" data-color-code-id="${data.maMauSac}">
                                    <div class="custom-control custom-checkbox">
                                        <input type="text" class="form-control" name="id"
                                               value="${data.id}" hidden="">
                                        <input type="checkbox" class="custom-control-input"
                                               id="productVariationsCheck${data.id}">
                                        <label class="custom-control-label"
                                               for="productVariationsCheck${data.id}"></label>
                                    </div>
                                </td>
                                <td class="table-column-pl-0 width-100 row-show-img position-relative" data-colum-index="1" data-color="${data.maMauSac}">
                                    <label for="fileimgselected${data.id}">
                                        <img class="img-shoe" data-color-code-img="${data.maMauSac}"
                                        src="${data.img.length === 0 ? '/assets/cms/img/400x400/img2.jpg' : data.img}"
                                             alt="Image Description">
                                    </label>
                                    <input class="formAddImg form-control" data-color-code-input="${data.maMauSac}" type="file" name="img" id="fileimgselected${data.id}_" hidden="">
                                </td>
                                <td class="table-column-pl-0 width-100 " data-colum-index="2">
                                    <input type="text" class="form-control" name="mauSac" value="${data.maMauSac}" style="background-color:${data.maMauSac}" disabled>
                                </td>
                                <td class="table-column-pl-0 width-100 " data-colum-index="3">
                                    <label class="form-control d-flex justify-content-between" name="maSanPham">${data.maSanPham}
                                    <a class="btn btn-light p-0 dropdown-toggle show-barcode" data-product-code="${data.maSanPham}" data-id="${data.id}"  role="button" title="Barcode" id="barcodeDropdown${data.id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="tio tio-barcode"></i>
                                    </a>
                                    <div class="dropdown-menu" aria-labelledby="barcodeDropdown${data.id}">
                                        <span class="dropdown-item" id="barcodeSpan${data.id}"><svg id="barcode${data.id}"></svg></span>
                                    </div>
                                    </label>
                                </td>
                                <td class="table-column-pl-0 width-100 " data-colum-index="4">
                                 <label type="text" class="form-control" name="kichCo">${data.kichCo}</label>
                                </td>
                                <td class="table-column-pl-0 form-edit" data-colum-index="5">
                                    <input type="text" class="form-control money-input-mask-num" name="giaGoc"
                                           value="${data.giaGoc}" disabled>
                                </td>
                                <td class="table-column-pl-0 form-edit" data-colum-index="6">
                                    <input type="text" class="form-control money-input-mask-num" name="giaBan" value="${data.giaBan}"  disabled>
                                </td>
                                <td class="table-column-pl-0 form-edit" data-colum-index="7">
                                    <!-- Quantity Counter -->
                                    <div class="js-quantity-counter input-group-quantity-counter">
                                        <input type="number" name="soLuong"
                                               class="js-result form-control input-group-quantity-counter-control"
                                               value="${data.soLuong}"  disabled>
                                        <div class="input-group-quantity-counter-toggle">
                                            <a class="js-minus input-group-quantity-counter-btn">
                                                <i class="tio-remove"></i>
                                            </a>
                                            <a class="js-plus input-group-quantity-counter-btn">
                                                <i class="tio-add"></i>
                                            </a>
                                        </div>
                                    </div>
                                </td>
                                <td data-colum-index="8">
                               <label class="toggle-switch form-edit d-flex align-items-center" for="customSwitch${data.id}">
                                    <input type="checkbox" class="toggle-switch-input" id="customSwitch${data.id}" ${data.trangThai == true ? 'checked' : ''} disabled>
                                         <span class="toggle-switch-label">
                                             <span class="toggle-switch-indicator"></span>
                                         </span>
                                    </label>
                                </td>
                                <td class="table-column-pr-0 pl-0 d-flex justify-content-center" data-colum-index="8">
                                    <div class="btn-group pl-1" role="group" aria-label="Edit group">
                                        <a class="btn btn-white edit-item"  href="javascript:;">
                                            <i class="tio-edit"></i>
                                        </a>
                                    </div>
                                </td>`;
            $(row).html(customHTML);
        }
    });
    datatable.rows.add(dataArray).draw();
    $(document).on('click', '.show-barcode', function () {
        let code = $(this).data('product-code');
        let id = $(this).data('id');
        JsBarcode("#barcode" + id, code);
    })
    $('#datatableSearch').on('mouseup', function (e) {
        let $input = $(this),
            oldValue = $input.val();
        if (oldValue == "") return;
        setTimeout(function () {
            let newValue = $input.val();
            if (newValue == "") {
                // Gotcha
                datatable.search('').draw();
            }
        }, 1);
    });
    $('#kichCoFilter').on('change', function () {
        let value = $(this).val();
        if (value === 'all') {
            datatable.columns(4).search('').draw();
        } else {
            datatable.columns(4).search(value).draw();
        }
    });
    $('#mauSacFilter').on('change', function () {
        let value = $(this).val();
        if (value === 'all') {
            datatable.columns(2).search('').draw();
        } else {
            datatable.columns(2).search(value).draw();
        }
    });

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

    hideFormToedit();

    function hideFormToedit() {
        let ms = $('#mauSacSelectedshow').val();
        let kc = $('#kichCoSelectedshow').val();
        kc.forEach((kc) => {
            let html = `<span class="badge h1 font-size-100 mr-1 badge-secondary">${kc}</span>`;
            $('#showKichCo').append(html);
            $('#editKichCo').append(html);
        })
        ms.forEach((ms) => {
            let html = `<span class="badge h1 font-size-100 mr-1 border-1" style="background-color: ${ms}">${ms}</span>`;
            $('#showMauSac').append(html);
            $('#editMauSac').append(html);
        })
    }

    $('#datatableCheckAll').on('change', function () {
        let ischecked = $(this).is(":checked");

        if (ischecked) {
            $('.form-edit').each(function (index, el) {
                $(el).find('input.form-control').removeAttr('disabled');
                $(el).find('input.toggle-switch-input').removeAttr('disabled');
                $(el).closest('tr').find('i.tio-edit').removeClass('tio-edit').addClass('tio-done');
            });
        } else {
            $('.form-edit').each(function (index, el) {
                $(el).find('input.form-control').attr('disabled', true);
                $(el).find('input.toggle-switch-input').attr('disabled', true);
                $(el).closest('tr').find('i.tio-done').removeClass('tio-done').addClass('tio-edit');
            });
        }
    });

    $('#datatable').on('change', 'input', function () {
        let rowIndex = datatable.row($(this).closest('tr')).index();
        let name = $(this).attr('name');
        let columnIndex = $(this).closest('td').data('colum-index');
        var newValue = $(this).val();
        if (columnIndex == 8) {
            newValue = $(this).prop('checked') == true ? '1' : '0';
        }
        let arr = getArrIndex();
        if (columnIndex > 4) {
            let st = arr.some(function (item) {
                return item.index === rowIndex;
            });
            if (st) {
                arr.forEach((item) => {
                    datatable.cell(item.index, columnIndex).data(newValue);
                    let inputElement = $(item.tr).find('td[data-colum-index=' + columnIndex + ']')
                        .find('input[name=' + name + ']');
                    inputElement.val(newValue);
                })
            }
            datatable.cell(rowIndex, columnIndex).data(newValue).draw();
            $('#btn-save').removeClass('d-none');
        }
    });
    $('.toggle-switch-input').on('change', function () {
        if (getArrIndex() == null) {
            $(this).closest()
        }
    })

    $('.edit-item').on('click', function () {
        var row = $(this).closest('tr');
        var editIcon = row.find('i.tio-edit');
        var doneIcon = row.find('i.tio-done');

        if (editIcon.length) {
            row.find('td.form-edit input.form-control').removeAttr('disabled');
            row.find('input.toggle-switch-input').removeAttr('disabled');
            editIcon.removeClass('tio-edit').addClass('tio-done');
            doneIcon.removeClass('tio-done').addClass('tio-edit');
        } else if (doneIcon.length) {
            row.find('td.form-edit input.form-control').attr('disabled', true);
            row.find('input.toggle-switch-input').attr('disabled', true);
            doneIcon.removeClass('tio-done').addClass('tio-edit');
            editIcon.removeClass('tio-edit').addClass('tio-done');
            row.find('.custom-control-input').prop('checked', false);
        }
    });
    $('.custom-control-input').on('change', function () {
        if ($(this).is(':checked')) {
            $(this).closest('tr').find('td.form-edit input.form-control').removeAttr('disabled');
            $(this).closest('tr').find('input.toggle-switch-input').removeAttr('disabled');
            $(this).closest('tr').find('i.tio-edit').removeClass('tio-edit').addClass('tio-done');
        } else {
            $(this).closest('tr').find('td.form-edit input.form-control').attr('disabled', true);
            $(this).closest('tr').find('input.toggle-switch-input').attr('disabled', true);
            $(this).closest('tr').find('i.tio-done').removeClass('tio-done').addClass('tio-edit');
        }
    })
    $('#btn-edit-product').on('click', function () {
        $('#edit-thuoc-tinh').removeClass('d-none')
        $('#view-thuoc-tinh').addClass('d-none')
        $('#btn-save').removeClass('d-none');
    })
    $('.toggle-switch-input').on('change', function () {
        $('#btn-save').removeClass('d-none');
    })
    setIMG();

    // function setIMG() {
    //     let mauSac = null;
    //     let arr = [];
    //     let oj = {};
    //     let img = $('.row-show-img');
    //     for (let i = 0; i < img.length; i++) {
    //         let color = $(img[i]).attr('data-color');
    //         $(img[i]).closest('tr').attr('color-code', color);
    //         if (mauSac == null) {
    //             mauSac = color;
    //             let oj = {color: color, ele: img[i]};
    //             arr.push(oj)
    //         } else if (color == mauSac) {
    //             $(img[i]).css('opacity', 0);
    //             $(img[i]).attr('status-remove', true);
    //         } else {
    //             mauSac = color
    //             let oj = {color: color, ele: img[i]};
    //             arr.push(oj)
    //         }
    //     }
    //     let elements = [];
    //     for (let i = 0; i < arr.length; i++) {
    //         $("td.row-show-img[status-remove='true']").each(function (index, element) {
    //             let mau = $(element).attr('data-color');
    //             if (mau == arr[i].color) {
    //                 elements.push(element)
    //             }
    //         });
    //         $(arr[i].ele).attr('rowspan', $('tr[color-code=' + arr[i].color + ']').length);
    //     }
    //     $.each(elements, function (index, element) {
    //         $(element).remove();
    //     });
    // }
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
        $("td.row-show-img[status-remove='true']").each(function (index, element) {
            $(element).addClass('d-none');
        });

        img.removeAttr('status-remove');
        for (let i = 0; i < arr.length; i++) {
            $(arr[i].ele).attr('rowspan', $('tr[color-code=' + arr[i].color + ']').length).removeClass('d-none');
        }
    }

    datatable.on('draw.dt', function () {
        setIMG();
    });

    // INITIALIZATION OF QUILLJS EDITOR
    // =======================================================
    var quill = $.HSCore.components.HSQuill.init('.js-quill');

    function containsLetter(str) {
        return /[a-zA-Z]/.test(str);
    }

    function isEmpty(str) {
        return (!str || str.length === 0);
    }

    function convertToNumber(text) {
        text = text.replace(/[.,]/g, "");
        text = text.replace(/[a-zA-Z]/g, "");
        var number = Number(text);
        return number;
    }

    function redirectToProductPage() {
        setTimeout(() => {
            window.location.href = "/cms/product";
        }, 3000);
    }

    $('#btn-save').on('click', function () {
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
                let sanPham = $('#product-id').val();
                let theLoai = $('#theLoai').val();
                let thuongHieu = $('#thuongHieu').val();
                let chatLieu = $('#chatLieuSelected').val();
                let deGiay = $('#deGiaySelect').val();
                let coGiay = $('#coGiaySelect').val();
                let muiGiay = $('#muiGiaySelect').val();
                let sales = $('#isSales').val();
                let trangThai = $('#trangThai').val();
                let mota = $('.ql-editor').html();
                let product_details = datatable.rows().data().toArray();
                if (isEmpty(sanPham)) {
                    ToastError("Vui lòng chọn Sản Phẩm !")
                    $('#product-id').focus();
                    return;
                }
                if (isEmpty(theLoai)) {
                    ToastError("Vui lòng chọn Thể Loại !")
                    $('#theLoai').focus();
                    return;
                }
                if (isEmpty(thuongHieu)) {
                    ToastError("Vui lòng chọn Thể Loại !")
                    $('#thuongHieu').focus();
                    return;
                }
                if (isEmpty(chatLieu)) {
                    ToastError("Vui lòng chọn Chất Liệu !")
                    $('#chatLieuSelected').focus();
                    return;
                }
                if (isEmpty(deGiay)) {
                    ToastError("Vui lòng chọn Đế Giày !")
                    $('#deGiaySelect').focus();
                    return;
                }
                if (isEmpty(coGiay)) {
                    ToastError("Vui lòng chọn Cổ Giày !")
                    $('#coGiaySelect').focus();
                    return;
                }
                if (isEmpty(muiGiay)) {
                    ToastError("Vui lòng nhập Mũi Giày !")
                    $('#muiGiaySelect').focus();
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
                let message = '';
                let check = true;
                for (let i = 0; i < product_details.length; i++) {
                    if (containsLetter(product_details[i].id)) {
                        product_details[i].id = 0;
                    }
                    if (convertToNumber(product_details[i].giaGoc) < 0) {
                        message = "Vui lòng nhập giá gốc của mã :" + product_details[i].maSanPham;
                        check = false;
                        break;
                    }
                    if (convertToNumber(product_details[i].giaBan) < 0) {
                        message = "Vui lòng nhập giá bán của mã :" + product_details[i].maSanPham;
                        check = false;
                        break;
                    }
                    if (isEmpty(product_details[i].soLuong) || Number(product_details[i].soLuong) < 0) {
                        message = "Vui lòng số lượng của mã :" + product_details[i].maSanPham;
                        check = false;
                        break;
                    }
                }
                if (check) {
                    // post data lên thôi
                    $.ajax({
                        type: "POST",
                        url: "/cms/update-quick-product",
                        data: {
                            sanPham: sanPham,
                            theLoai: theLoai,
                            thuongHieu: thuongHieu,
                            chatLieu: chatLieu,
                            deGiay: deGiay,
                            coGiay: coGiay,
                            moTa: mota,
                            muiGiay: muiGiay,
                            sales: sales,
                            trangThai: trangThai,
                            product_details: JSON.stringify(product_details)
                        }, success: (data, status, xhr) => {
                            ToastSuccess('Lưu Thành Công !')
                            redirectToProductPage()
                        }, error: (e) => {
                            ToastError(e.getResponseHeader('error'));
                        }
                    })
                } else (
                    ToastError(message)
                )
            }
        });
    })

});
// function changeNameToColor() {
//     let mausac = $('#mauSacSelected').val();
//     mausac.forEach((mau) => {
//         let ele = $('#selectedMauSac').find('li[title="' + mau + '"]');
//         let tenmau = $('#selectedMauSac').find('option[value="' + mau + '"]').attr('data-name');
//         let span = $(ele[0]).find('span:not(.select2-selection__choice__remove)').eq(0);
//         $(span[0]).text(tenmau);
//         $(ele[0]).css('background-color', mau);
//         $(ele[0]).css('color', '#FFFFFF');
//     });
// }
