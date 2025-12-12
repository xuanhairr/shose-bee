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

function isEmpty(str) {
    return (!str || str.length === 0);
}

function isValidPhoneNumber(phoneNumber) {
    let phone = /^(0\d{9,10})$/;
    // Kiểm tra xem số điện thoại có bắt đầu bằng số 0 và có đúng 10 số không
    return phone.test(phoneNumber);
}

function isValidEmail(email) {
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
function isValidCccd(id) {
    let idPattern = /^[0-9]{12}$/;
    // Kiểm tra xem số căn cước có đúng 12 chữ số không
    return idPattern.test(id);
}

function formValidate() {
    var hoTen = $('#hoTen').val();
    var email = $('#email').val();
    var sdt = $('#sdt').val();
    var cccd = $('#cccd').val();
    var ngaySinh = $('#ngaySinh').val();
    var soNha = $('#soNha').val();
    var phuongXa = $('#phuongXa').val();
    var quanHuyen = $('#quanHuyen').val();
    var tinhTP = $('#tinhTP').val();

    if (isEmpty(hoTen)) {
        ToastError("Họ tên không được để trống.");
        return false;
    }

    if (isEmpty(email)) {
        ToastError("Email không được để trống.");
        return false;
    } else if (!isValidEmail(email)) {
        ToastError("Email không đúng định dạng.");
        return false;
    }

    if (isEmpty(sdt)) {
        ToastError("Số điện thoại không được để trống.");
        return false;
    } else if (!isValidPhoneNumber(sdt)) {
        ToastError("Sdt không đúng định dạng(0359xxxxxx)");
        return false;
    }

    if (isEmpty(cccd)) {
        ToastError("CCCD không được để trống.");
        return false;
    }else if(!isValidCccd(cccd)){
        ToastError("CCCD không đúng định dang(đúng 12 số)");
        return false;
    }

    // Kiểm tra ngày sinh phải trước ngày hiện tại
    var ngaySinhDate = new Date(ngaySinh);
    var ngayHienTai = new Date();
    if (ngaySinhDate >= ngayHienTai) {
        ToastError("Ngày sinh phải trước ngày hiện tại.");
        return false;
    } else if (isEmpty(ngaySinh)) {
        ToastError("Ngày sinh không được để trống.");
        return false;
    }

    if (isEmpty(soNha)) {
        ToastError("Số nhà không được để trống.");
        return false;
    }

    if (isEmpty(tinhTP)) {
        ToastError('Vui lòng chọn tỉnh.')
        return false;
    }
    if (isEmpty(quanHuyen)) {
        ToastError('Vui lòng chọn quận huyện.')
        return false;
    }
    if (isEmpty(phuongXa)) {
        ToastError('Vui lòng chọn phường xã.')
        return false;
    }
    return true;
}

function checkDuplicate1() {
    return new Promise(function(resolve, reject) {
        let email = $('#email').val();
        let phone = $('#sdt').val();
        let cccd = $('#cccd').val();
        let id = $('#idNhanVien').val();
        $.ajax({
            url: '/cms/nhan-vien/check-duplicate',
            type: 'POST',
            data: {email: email, phoneNumber: phone, cccd: cccd, id: id},
            success: function(response) {
                if (response.email) {
                    ToastError('Email đã tồn tại.');
                }
                if (response.phoneNumber) {
                    ToastError('Số điện thoại đã tồn tại.');
                }
                if (response.cccd) {
                    ToastError('Số cccd đã tồn tại.');
                }
                resolve(response);
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}

// =============api diaCHi
let province_list = [];
let district_list = [];
let ward_list = [];
let quan_huyen = $('#quanHuyen');
let tinh_TP = $('#tinhTP');
let phuong_xa = $('#phuongXa');
tinh_TP.on('change',async function () {
   await fillAllHuyen();
})
quan_huyen.on('change',async function () {
    await fillAllXa();
})

function fillAllTinh() {
    return new Promise((resolve, reject) => {
        let element = tinh_TP;
        let select = $('#tinhTP_input').val();
        province_list.forEach(data => {
            element.append(`<option data-value="${data.Id}" value="${data.Name}" ${select === data.Name ? 'selected' : ''}>${data.Name}</option>`);
        });
        resolve();
    });
}

function fillAllHuyen() {
    return new Promise((resolve, reject) => {
        let element = quan_huyen;
        let select = $('#quanHuyen_input').val();
        let idTinh = $('#tinhTP option:selected').data('value');
        district_list.forEach(data => {
            if (data.ProvinceId == idTinh) {
                element.append(`<option data-value="${data.Id}" value="${data.Name}" ${select === data.Name ? 'selected' : ''}>${data.Name}</option>`);
            }
        });
        resolve();
    });
}
function fillAllXa() {
    return new Promise((resolve, reject) => {
        let element = phuong_xa;
        let select = $('#phuongXa_input').val();
        let idPhuong = $('#quanHuyen option:selected').data('value');
        ward_list.forEach(data => {
            if (data.DistrictId == idPhuong) {
                element.append(`<option value="${data.Name}" ${select === data.Name ? 'selected' : ''}>${data.Name}</option>`);
            }
        });
        resolve();
    });
}
fetch('/assets/cms/json/TinhTP.json')
    .then(response => response.json())
    .then(data => {
        province_list = data;
        return fillAllTinh();
    })
    .then(() => {
        return fetch('/assets/cms/json/QuanHuyen.json')
            .then(response => response.json())
            .then(data => {
                district_list = data;
                return fillAllHuyen();
            });
    })
    .then(() => {
        return fetch('/assets/cms/json/PhuongXa.json')
            .then(response => response.json())
            .then(data => {
                ward_list = data;
                return fillAllXa();
            });
    })
    .catch(error => console.error('Error:', error));


$(document).on('ready', function () {
    if (window.localStorage.getItem('hs-builder-popover') === null) {
        $('#builderPopover').popover('show')
            .on('shown.bs.popover', function () {
                $('.popover').last().addClass('popover-dark')
            });

        $(document).on('click', '#closeBuilderPopover', function () {
            window.localStorage.setItem('hs-builder-popover', true);
            $('#builderPopover').popover('dispose');
        });
    } else {
        $('#builderPopover').on('show.bs.popover', function () {
            return false
        });
    }

    // END ONLY DEV
    // =======================================================
    // $('.tinhTP').on('change', function () {
    //     $(this).closest('.form-address').find('select.phuong_xa').html('')
    //     return fillAllHuyen()
    // })
    // $('.quanHuyen').on('change', function () {
    //     return fillAllXa();
    // })


    $('.js-masked-input').each(function () {
        var mask = $.HSCore.components.HSMask.init($(this));
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


    // INITIALIZATION OF FILE ATTACH
    // =======================================================
    $('.js-file-attach').each(function () {
        var customFile = new HSFileAttach($(this)).init();
    });


    // INITIALIZATION OF STEP FORM
    // =======================================================
    $('.js-step-form').each(function () {
        var stepForm = new HSStepForm($(this), {
            finish: function () {
                $("#addUserStepFormProgress").hide();
                $("#addUserStepFormContent").hide();
                $("#successMessageContent").show();
            }
        }).init();
    });


    // INITIALIZATION OF MASKED INPUT
    // =======================================================
    $('.js-masked-input').each(function () {
        var mask = $.HSCore.components.HSMask.init($(this));
    });


    // INITIALIZATION OF SELECT2
    // =======================================================
    $('.js-select2-custom').each(function () {
        var select2 = $.HSCore.components.HSSelect2.init($(this));
    });


    // INITIALIZATION OF ADD INPUT FILED
    // =======================================================
    $('.js-add-field').each(function () {
        new HSAddField($(this), {
            addedField: function () {
                $('.js-add-field .js-select2-custom-dynamic').each(function () {
                    var select2dynamic = $.HSCore.components.HSSelect2.init($(this));
                });
            }
        }).init();
    });
});