import {initializeApp} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
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
// const firebaseConfig = {
//     apiKey: "AIzaSyCXf3-khSubthq5LKJ-xVO1P7JaEqgD3_M",
//     authDomain: "datn-anh-7449e.firebaseapp.com",
//     projectId: "datn-anh-7449e",
//     storageBucket: "datn-anh-7449e.firebasestorage.app",
//     messagingSenderId: "917826628321",
//     appId: "1:917826628321:web:f0212a7f99a9e473eee5a0",
//     measurementId: "G-0E4Y0KR64T"
// };
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function randomString(n) {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (var i = 0; i < n; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

function renameFile(file) {
    let name = file.name;
    let dotIndex = name.lastIndexOf(".");
    let ext = name.substring(dotIndex);
    let newName = randomString(10) + ext;
    return new File([file], newName, {type: file.type});
}

let urlDelete = '';

async function deleteImageFromFirebaseStorage() {
    try {
        const fileName = urlDelete.substring(urlDelete.lastIndexOf('/') + 1, urlDelete.indexOf('?'));
        const correctedFileName = fileName.replace(/%2F/g, '/');
        const imageRef = ref(storage, correctedFileName);
        await deleteObject(imageRef);
        ToastSuccess("Xóa thành công.")
        $('#btn-submit-nhan-vien').submit();
    } catch (error) {
        $('#btn-submit-nhan-vien').submit();
        console.error("Error deleting image from Firebase Storage:", error);
    }
}

function showLoader() {
    Swal.fire({
        title: 'Đang xử lý...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading()
        }
    });
}

function hideLoader() {
    Swal.close();
}

$(document).ready(function () {
    $('#submitBtn').on('click', async function () { // Sử dụng async function để sử dụng await
        let check = true;
        if (validate()) {
            check = await checkDuplicate();
        } else {
            return;
        }
        if (check.email) {
            return;
        }
        if (check.sdt) {
            return;
        }
        if (check.cccd) {
            return;
        }
        showLoader();
        let urlImg = $('#urlImgAvatar').val();
        let form = $('#btn-submit-nhan-vien');
        if (urlImg === undefined) {
            let input = document.getElementById('avatarUploader');
            let img = $('#avatarImg');
            const file = renameFile(input.files[0]);
            const storageRef = ref(storage, `avatars/${file.name}`);
            try {
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                img.attr('src', url);
                form.append(`<input id="urlImgAvatar" type="hidden" name="avatar" value="${url}">`);
            } catch (error) {
                console.error(error);
            }
            await deleteImageFromFirebaseStorage();
        } else {
            form.submit();
        }
        hideLoader();
    })
})
