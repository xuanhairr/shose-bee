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

let filesStorage = [];
document.getElementById('chooseImg').addEventListener("change", function (e) {
    let num = $('#fancyboxGallery').find('div[data-index="show-img-in-form"]');
    $('#btn-save-img').removeClass('d-none');
    let files = Array.from(e.target.files);
    files.forEach((file) => {
        const existingFile = filesStorage.find((obj) => obj.file.name === file.name && obj.file.size === file.size);
        if (!existingFile) {
            let obj = {deleted: false, file: file, isMain: false};
            filesStorage.push(obj);
        }
    });
    for (let i = 0; i < files.length; i++) {
        let num = $('#fancyboxGallery').find('div[data-index="show-img-in-form"]');
        const file = files[i];
        if (num.length < 4) {
            let filename = $('a.js-fancybox-item[data-caption]');
            let found = false;
            for (let j = 0; j < filename.length; j++) {
                if (file.name == $(filename[j]).data('caption')) {
                    found = true;
                    break;
                }
            }
            if (found) {
                continue;
            }
            const tempUrl = URL.createObjectURL(file);
            let div = document.createElement('div');
            div.className = "col-6 col-sm-4 col-md-3 mb-3 mb-lg-5 d-flex justify-content-center";
            div.setAttribute('data-index', 'show-img-in-form')
            div.innerHTML = `
            <div class="card card-sm" style="width: 180px;height: 230px">
                <img class="card-img-top"  width="179" height="179"  src="${tempUrl}" alt="Image Description">
                <div class="card-body">
                    <div class="row text-center">
                        <div class="col-4">
                            <a class="js-fancybox-item text-body" href="javascript:;" data-toggle="tooltip"
                                data-placement="top" title="" data-src="${tempUrl}"
                                data-caption="${file.name}" data-original-title="View">
                                <i class="tio-visible-outlined"></i>
                            </a>
                        </div>
                        <div class="col-4 column-divider ">
                            <input type="radio" class="check-main-radio" name="main-img" data-toggle="tooltip"
                                data-placement="top" title="" data-original-title="Main">
                        </div>
                        <div class="col-4 column-divider">
                            <a class="text-danger btn-delete-img" href="javascript:;" data-toggle="tooltip"
                                data-placement="top" title="" data-original-title="Delete">
                                <i class="tio-delete-outlined"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>`;
            document.getElementById("fancyboxGallery").appendChild(div);
            const checkMainRadio = div.querySelector("input.check-main-radio");
            checkMainRadio.addEventListener("change", function () {
                if (checkMainRadio.checked) {
                    const existingFile = filesStorage.find((obj) => obj.file.name === file.name);
                    if (existingFile) {
                        existingFile.isMain = true;
                    }
                    filesStorage.forEach((obj) => {
                        if (obj.file.name !== file.name) {
                            obj.isMain = false;
                        }
                    });
                }
            });
            const deleteButton = div.querySelector(".btn-delete-img");
            deleteButton.addEventListener("click", function () {
                const existingFile = filesStorage.find((obj) => obj.file.name === file.name);
                if (existingFile) {
                    if (existingFile.isMain) {
                        ToastError('Vui lòng thay đổi ảnh chính.')
                    } else {
                        existingFile.deleted = true;
                        div.remove();
                    }
                }

            });
        } else {
            $('label[for="chooseImg"]').addClass('d-none');
            filesStorage = filesStorage.filter((obj) => {
                if (obj.file.name !== file.name) {
                    return true;
                }
                return false;
            });
        }
    }
});

$(document).on('click', '#btn-save-img', function () {
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
            let files = filesStorage;
            if (files.length != 0) {
                showLoader();
            }
            files = files.filter(item => !item.deleted);
            let lstURL = [];
            let promises = []; // Mảng chứa các promise
            let NotExitMain = true;
            for (let i = 0; i < files.length; i++) {
                let file = renameFile(files[i].file)
                const storageRef = ref(storage, "images/" + file.name);
                let promise = uploadBytes(storageRef, file).then((snapshot) => {
                    return getDownloadURL(snapshot.ref).then((url) => {
                        let img = $('a.js-fancybox-item[data-caption="' + files[i].file.name + '"]').closest('div[data-index="show-img-in-form"]').find('img.card-img-top');
                        img.attr('src', url);
                        let object = {url: url, main: false}
                        if (files[i].isMain) {
                            NotExitMain = false;
                            object.main = true;
                        }
                        lstURL.push(object);
                    });
                });
                let index = filesStorage.indexOf(files[i]);
                filesStorage[index].deleted = true;
                promises.push(promise); // Thêm promise vào mảng
            }

            Promise.all(promises).then(() => { // Chờ tất cả các promise hoàn thành
                if (NotExitMain) {
                    let checkedURL = $('input.check-main-radio[name="main-img"]:checked').closest('div[data-index="show-img-in-form"]').find('img.card-img-top').attr("src");
                    let object = {url: checkedURL, main: true}
                    lstURL.push(object)
                }
                let id = $('h1.page-header-title[data-product-id]').data('product-id');
                $.ajax({
                    url: "/cms/upload-img",
                    type: "POST",
                    data: {
                        data: JSON.stringify(lstURL),
                        id: id
                    },
                    success: function () {
                            hideLoader();
                        ToastSuccess("Thành Công.")
                    },
                    error: function () {
                        ToastSuccess("Lỗi !")
                    }
                });
            });
        }
    });
});

async function deleteImageFromFirebaseStorage(imageUrl) {
    try {
        const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1, imageUrl.indexOf('?'));
        const correctedFileName = fileName.replace(/%2F/g, '/');
        const imageRef = ref(storage, correctedFileName);
        await deleteObject(imageRef);
        ToastSuccess("Xóa thành công.")
    } catch (error) {
        ToastError("Ảnh không tồn tại trên Cloud !")
        console.error("Error deleting image from Firebase Storage:", error);
    }
}

$(document).on('click', '.btn-delete-img', function () {
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
            const url = $(this).closest('div[data-index="show-img-in-form"]').find('img.card-img-top').attr("src");
            let element = $(this).closest('div[data-index="show-img-in-form"]');
            if (url.includes('blob')) {
                return;
            }
            $.ajax({
                url: "/api/delete-anh",
                type: "DELETE",
                data: {url: url},
                success: function (data, status, xhr) {
                    deleteImageFromFirebaseStorage(url).then();
                    element.remove();
                    let num = $('#fancyboxGallery').find('div[data-index="show-img-in-form"]').length;
                    if (num > 3) {
                        $('label[for="chooseImg"]').addClass('d-none');
                    } else {
                        $('label[for="chooseImg"]').removeClass('d-none');
                    }
                },
                error: function (xhr) {
                    switch (xhr.getResponseHeader('status')) {
                        case "imgNull":
                            ToastError("Đường dẫn không tồn tại !")
                            break;
                        case "isMain":
                            ToastError("Không được xóa ảnh chính !")
                            break;
                        case "inProDetail":
                            ToastError("Ảnh được gán với màu !")
                            break;

                    }
                }
            })
        }
    });
});
$(document).ready(function () {
    let num = $('#fancyboxGallery').find('div[data-index="show-img-in-form"]').length;
    if (num > 3) {
        $('label[for="chooseImg"]').addClass('d-none');
    } else {
        $('label[for="chooseImg"]').removeClass('d-none');
    }
});
