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
    var name = file.name;
    var dotIndex = name.lastIndexOf(".");
    var ext = name.substring(dotIndex);
    var newName = randomString(10) + ext;
    return new File([file], newName, {type: file.type});
}

let provinceArr = [];
let districtArr = [];
let wardArr = [];
let tinh = $('#tinhTP');
let quanHuyen = $('#quanHuyen');
let phuongXa = $('#phuongXa')
let tinh_selected;
let huyen_selected;
let arrHoaDon = [];
fetch('/assets/address-json/province.json')
    .then(response => response.json())
    .then(data => {
        provinceArr = data;
        // console.log(data)
        return fillAllTinh(data);
    })
    .then(() => {
        return fetch('/assets/address-json/district.json')
            .then(response => response.json())
            .then(data => {
                districtArr = data;
                // console.log(data)
            });
    })
    .then(() => {
        return fetch('/assets/address-json/ward.json')
            .then(response => response.json())
            .then(data => {
                wardArr = data;
                // console.log(data)
            });
    })
    .catch(error => console.error('Error:', error));

function fillAllTinh(data) {
    $.each(data, function (index, item) {
        let html = `<option value="${item.ProvinceID}">${String(item.ProvinceName)}</option>`;
        tinh.append(html);
    });
    $(tinh).niceSelect('update');
}

tinh.on('change', function () {
    tinh_selected = tinh.val();
    quanHuyen.html('<option value="">Quận/Huyện</option>');
    phuongXa.html('<option value="">Phường/Xã</option>');
    if (tinh_selected) {
        districtArr.forEach(function (item) {
            if (item.ProvinceID == tinh_selected) {
                let html = `<option value="${item.DistrictID}">${String(item.DistrictName)}</option>`;
                quanHuyen.append(html);
            }
        })
        $(quanHuyen).niceSelect('update');
    }
})

quanHuyen.on('change', function () {
    huyen_selected = quanHuyen.val();
    phuongXa.html('<option value="">Phường/Xã</option>');
    wardArr.forEach((item) => {
        if (item.DistrictID == huyen_selected) {
            let html = `<option value="${item.Code}">${String(item.Name)}</option>`;
            phuongXa.append(html);
        }
    })
    $(phuongXa).niceSelect('update');
})

// let worker = new Worker('/assets/customer/js/profile/worker.js');
// document.addEventListener("DOMContentLoaded", function () {
//     worker.postMessage('start');
// });
//
// worker.onmessage = function (e) {
//     arrHoaDon = e.data;
// };

$(document).ready(function () {
    $(document).on('input', '#input-search-oder', function () {
        let all = $('#show-all-oder');
        let val = $(this).val();
        let oder_code = all.find('.oder_code_wrapper .oder_code')
        let no_data = true;
        oder_code.each((index, ele) => {
            let code = $(ele).text();
            if (code.toLowerCase().includes(val.toLowerCase())) {
                no_data = false;
                $(ele).closest('.oder_wrapper').removeClass('hidden')
            } else {
                $(ele).closest('.oder_wrapper').addClass('hidden')
            }
        })
        if (no_data) {
            $('#show-no-data-oder').removeClass('hidden')
        } else {
            $('#show-no-data-oder').addClass('hidden')
        }
    })
    $(document).on('input', '#input_search_voucher', function () {
        let all = $('#list-voucher');
        let val = $(this).val();
        let code_voucher = all.find('.wraper_li .voucher_code')
        let no_data = true;
        code_voucher.each((index, ele) => {
            let code = $(ele).text();
            if (code.toLowerCase().includes(val.toLowerCase())) {
                no_data = false;
                $(ele).closest('.wraper_li').removeClass('hidden')
            } else {
                $(ele).closest('.wraper_li').addClass('hidden')
            }
        })
        if (no_data) {
            $('#show-no-data-voucher').removeClass('hidden')
        } else {
            $('#show-no-data-voucher').addClass('hidden')
        }
    })
    $(document).on('change', '#select_status_oder', function () {
        let all = $('#show-all-oder');
        let val = $(this).val();
        let oder_status = all.find('.oder_wrapper .status');
        let no_data = true;
        if (val === 'All') {
            if (oder_status.length > 0) {
                $('#show-no-data-oder').addClass('hidden')
                oder_status.closest('.oder_wrapper').removeClass('hidden');
            }
            return;
        }
        oder_status.each((index, ele) => {
            let status = $(ele).find('label').data('status');
            if (status.includes(val)) {
                no_data = false;
                $(ele).closest('.oder_wrapper').removeClass('hidden')
            } else {
                $(ele).closest('.oder_wrapper').addClass('hidden')
            }
        })
        if (no_data) {
            $('#show-no-data-oder').removeClass('hidden')
        } else {
            $('#show-no-data-oder').addClass('hidden')
        }
    })
    $(document).on('change', '#select_status_voucher', function () {
        let all = $('#list-voucher');
        let val = $(this).val();
        let type = all.find('.wraper_li .voucher_type');
        let no_data = true;
        if (val === 'All') {
            if (type.length > 0) {
                $('#show-no-data-oder').addClass('hidden')
                type.closest('.wraper_li').removeClass('hidden');
            }
            return;
        }
        type.each((index, ele) => {
            let isPhanTram = $(ele).hasClass('phantram') && val === '%';
            let isTienMat = $(ele).hasClass('tienmat') && val === '$';
            if (isPhanTram || isTienMat) {
                no_data = false;
                $(ele).closest('.wraper_li').removeClass('hidden');
            } else {
                $(ele).closest('.wraper_li').addClass('hidden');
            }
        });
        if (no_data) {
            $('#show-no-data-oder').removeClass('hidden')
        } else {
            $('#show-no-data-oder').addClass('hidden')
        }
    })
    $(document).on('click', '.btn-delete-address', function () {
        let id = $(this).data('id');
        Swal.fire({
            title: "Bạn chắc chứ?",
            text: "Thay đổi sẽ không thể hoàn tác !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Xác Nhận",
            customClass: {
                confirmButton: 'btn-custom-black',
                cancelButton: 'btn-custom-info'
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/api/dia-chi/delete',
                    type: 'DELETE',
                    data: {
                        id: id
                    },
                    success: function () {
                        $(`#customer_address_${id}`).closest('.item_address').remove();
                        ToastSuccess('Thành công.')
                    }, error: function (e, h, x) {
                        switch (e.getResponseHeader('status')) {
                            case 'isAddressDefault':
                                ToastError('Không thể xóa địa chỉ mặc định.');
                                break;
                            case 'AddressNull':
                                ToastError('Địa chỉ không tồn tại.');
                                break;
                            default:
                                ToastError('Lỗi.');
                        }
                        console.log(h, x)
                    }
                })
            }
        })
    })
    $('#avatar_selected').change(function () {
        if (this.files && this.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                $('#show_avatar_slected').attr('src', e.target.result);
            }
            reader.readAsDataURL(this.files[0]);
        }
        let btnSave = $('#btn-save');
        if (btnSave.hasClass('d-none')) {
            btnSave.removeClass('d-none');
        }
    });
    $(document).on('click', '.btn-set-address', function () {
        if ($(this).hasClass('disabled')) {
            return;
        }
        let id_customer = $(this).data('customer-id');
        let id_address = $(this).data('id');
        let element = $(this);
        $.ajax({
            url: '/api/set-default-address',
            type: 'POST',
            data: {
                idDiaChi: id_address,
                idKhachHang: id_customer
            },
            success: function () {
                ToastSuccess("Thành công");
                $('.btn-set-address').removeClass('disabled')
                element.addClass('disabled')
            },
            error: function (xhr) {
                ToastError("Thất bại")
            }
        })
    })
    $(document).on('change', '[name="cancel"]', function () {
        let val = $(this).val()
        let element = $('#lydo_cancel');
        if (val == '#') {
            element.css('animation-name', 'showForm');
            element.removeClass('d-none').addClass('showForm');
        } else {
            element.css('animation-name', 'hideForm');
            element.removeClass('showForm').addClass('hideForm');
            setTimeout(function () {
                element.addClass('d-none').removeClass('hideForm');
            }, 400);
        }
    })
    $(document).on('click', '.btn-cancel-oders', function () {
        let id = $(this).data('id');
        $('#id_oders_cancel').val(id);
        $('#staticBackdrop').modal('show');
    })
    $(document).on('click', '.update-address', function () {
        $('#updateAddress').modal('show');
        let id = $(this).data('id');
        $('#id_address').val(id);
        let element = $(`#customer_address_${id}`)
        let ele_tinh = $('#tinhTP');
        let ele_quanHuyen = $('#quanHuyen');
        let ele_phuongXa = $('#phuongXa')
        let soNha = element.find('label.customerHouseNumber').text();
        let phuongXa = element.find('label.customerWard').data('address');
        let quanHuyen = element.find('label.customerDistrict').data('address');
        let tinhTP = element.find('label.customerProvince').data('address');
        $('#soNha').val(soNha)
        ele_quanHuyen.empty()
        ele_phuongXa.empty()
        for (let i = 0; i < provinceArr.length; i++) {
            let item = provinceArr[i];
            if (item.ProvinceName == tinhTP) {
                ele_tinh.val(item.ProvinceID);
                districtArr.forEach(function (dis) {
                    if (dis.ProvinceID == item.ProvinceID) {
                        let html = `<option value="${dis.DistrictID}" ${dis.DistrictName == quanHuyen ? 'selected' : ''}>${String(dis.DistrictName)}</option>`;
                        ele_quanHuyen.append(html);
                        if (dis.DistrictName == quanHuyen) {
                            wardArr.forEach((ward) => {
                                if (ward.DistrictID == dis.DistrictID) {
                                    let prin = `<option value="${ward.Code}" ${phuongXa == ward.Name ? 'selected' : ''}>${String(ward.Name)}</option>`;
                                    ele_phuongXa.append(prin);
                                }
                            })
                        }
                    }
                })
                $(ele_quanHuyen).niceSelect('update');
                $(ele_phuongXa).niceSelect('update');
                break;
            }
        }
    })
    $(document).on('click', '#btn-update', function () {
        let id = $('#id_address').val();
        let soNha = $('#soNha').val();
        let phuongXa = $('#phuongXa').find('option:selected').text();
        let quanHuyen = $('#quanHuyen').find('option:selected').text();
        let tinhTP = $('#tinhTP').find('option:selected').text();
        $.ajax({
            url: '/api/update/update-diachi',
            type: 'POST',
            data: {
                id: id,
                soNhaDto: soNha,
                phuongXaDto: phuongXa,
                quanHuyenDto: quanHuyen,
                tinhThanhPhoDto: tinhTP
            },
            success: () => {
                ToastSuccess('Cập nhật thành công.');
                let element = $(`#customer_address_${id}`);
                element.find('label.customerHouseNumber').text(soNha);
                element.find('label.customerWard').text(phuongXa + ', ')
                element.find('label.customerDistrict').text(quanHuyen + ', ')
                element.find('label.customerProvince').text(tinhTP)
            },
            error: function (e) {
                console.log(e.getResponseHeader('status'))
            }
        })
        // console.log(id, soNha, phuongXa, quanHuyen, tinhTP);
    })
    $(document).on('click', '#btn-huy', function () {
        let id = $('#id_oders_cancel').val();
        let lydo = $('[name="cancel"]:checked').val();
        if (lydo == '#') {
            lydo = $('#lydo_cancel').text();
        }
        $.ajax({
            url: '/api/hoa-don/huy-detail',
            type: 'POST',
            data: {
                id: id,
                lydo: lydo
            },
            success: function () {
                ToastSuccess('Thành công.')
                $(`#trangthai_${id}`).text('Đã Hủy');
                $(`#btn-cancel-${id}`).remove();
                $(`#lydo_${id}`).text('Lý Do: ' + lydo);
                $('#staticBackdrop').modal('hide');
            },
            error: function (e) {
                console.log(e)
                $('#staticBackdrop').modal('hide');
            }
        })
    })
    $('#btn-save-data').click(function () {
        Swal.fire({
            title: "Bạn chắc chứ?",
            text: "Các thay đổi sẽ được áp dụng !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Xác Nhận",
            customClass: {
                confirmButton: 'btn-custom-black',
                cancelButton: 'btn-custom-info'
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                let id = $('#id_user_customer').val();
                let fullName = $('#hoTen').val();
                let email = $('#email').val();
                let phone = $('#soDienThoai').val();
                let gender = $('[name="gioiTinh"]:checked').val();
                let birthDate = $('#ngaySinh').val();
                let currentAvatar = $('#avatar_preview').attr('src');
                let inputFile = document.getElementById('avatar_selected').files[0];
                // console.log(fullName, email, phone, gender, birthDate);
                if (fullName.length === 0) {
                    ToastError('Vui lòng nhập tên.')
                    return;
                }
                if (email.length === 0) {
                    ToastError('Vui lòng nhập email.')
                    return;
                }
                if (phone.length === 0) {
                    ToastError('Vui lòng nhập số điện thoại.')
                    return;
                }
                if (!kiemTraSDT(phone)) {
                    ToastError('Số điện thoại không đúng định dạng.')
                    return;
                }
                if (!kiemTraEmail(email)) {
                    ToastError('Email không đúng định dạng.')
                    return;
                }
                if (Number(gender) !== 0 && Number(gender) !== 1) {
                    ToastError('Vui lòng chọn giới tính.')
                    return;
                }
                if (!kiemTraNgaySinh(birthDate)) {
                    ToastError('Vui lòng chọn ngày sinh.')
                    return;
                }
                let data = await checkDuplicate(email, phone, id);
                if (data.email) {
                    ToastError('email đã tồn tại.');
                    return;
                }
                if (data.phoneNumber) {
                    ToastError('số điện thoại đã tồn tại.');
                    return;
                }
                let avatar = '';
                if (inputFile !== undefined) {
                    showLoading();
                    let file = renameFile(inputFile);
                    const storageRef = ref(storage, "images/" + file.name);
                    await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(storageRef);
                    // console.log(url)
                    avatar = url;
                    await deleteImageFromFirebaseStorage(currentAvatar);
                } else {
                    avatar = currentAvatar;
                }
                $.ajax({
                    url: '/api/update-profile',
                    type: 'POST',
                    data: {
                        hoTen: fullName,
                        email: email,
                        sdt: phone,
                        gioiTinh: gender,
                        ngaySinh: birthDate,
                        avatar: avatar,
                        id: id
                    },
                    success: function () {
                        let current = $('#pro_email').text();
                        if (current == email) {
                            $('#avatar_preview').attr('src', avatar);
                            $('.form_data').each(function (index, ele) {
                                let gen = $(ele).find('.showGender');
                                if (gen.length === 0) {
                                    let date = $(ele).find('input').attr('id');
                                    let input = $(ele).find('input');
                                    let label = $(ele).find('label');
                                    let link = label.find('a');
                                    let val = input.val();
                                    if (date == 'ngaySinh') {
                                        let parts = val.split('-');
                                        if (parts.length === 3) {
                                            val = parts[2] + '/' + parts[1] + '/' + parts[0];
                                        }
                                    }
                                    input.addClass('d-none');
                                    label.removeClass('d-none').empty().prepend(val).append(link);
                                    hideLoading()
                                }
                            });
                            ToastSuccess('Lưu thành công.');
                            let parts = birthDate.split('-');
                            if (parts.length === 3) {
                                birthDate = parts[2] + '/' + parts[1] + '/' + parts[0];
                            }
                            $('#pro_user_name').text(fullName)
                            $('#pro_email').text(email)
                            $('#pro_phone').text(phone)
                            $('#pro_birthdate').text(birthDate)
                            let element = $('.gender');
                            let i = element.find('i');
                            if (gender == 0) {
                                i.removeClass('fa-mars').addClass('fa-venus')
                            } else {
                                i.removeClass('fa-venus').addClass('fa-mars')
                            }
                            element.empty().append(gender == 1 ? 'Nam ' : 'Nữ ').append(i);
                            document.getElementById('avatar_selected').value = '';
                        } else {
                            setTimeout(() => {
                                window.location.reload();
                            }, 3000)
                        }
                    },
                    error: function (e) {
                        ToastError(e.getResponseHeader('error'));
                        hideLoading()
                    }
                })
            }
        })

    })

    $('#searchInv').on('click', function () {
        var invStt = $('.select_status').val();
        var invCode = $('.search_input').val();

        $.ajax({
            url: '/user-profile/search',
            type: 'GET',
            data: {status: invStt, invoiceCode: invCode},
            success: function (response) {

            },
            error: function (xhr, status, error) {
                console.log(error);
            }
        });
    })
});

function checkDuplicate(email, phone, id) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: '/api/check-duplicate',
            type: 'POST',
            data: {email: email, phoneNumber: phone, id: id},
            success: function (response) {
                resolve(response);
            },
            error: function (xhr, status, error) {
                reject(error);
            }
        });
    });
}

async function deleteImageFromFirebaseStorage(imageUrl) {
    try {
        const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1, imageUrl.indexOf('?'));
        const correctedFileName = fileName.replace(/%2F/g, '/');
        const imageRef = ref(storage, correctedFileName);
        await deleteObject(imageRef);
        console.log("Xóa thành công :" + correctedFileName)
    } catch (error) {
        console.error("Error deleting image from Firebase Storage:", error);
    }
}

function kiemTraSDT(sdt) {
    let regexSDT = /^(84|0|\+84)\d{9}$/;
    return regexSDT.test(sdt);

}

function kiemTraNgaySinh(ngaySinh) {
    let regexNgaySinh = /^(19|20)\d\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
    return regexNgaySinh.test(ngaySinh);


}

function kiemTraEmail(email) {
    let regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regexEmail.test(email);

}