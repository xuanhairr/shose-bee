activeSiderbar1EXXP("phieu_giam_giam");

function formatNumberMoney(input) {
    let number = parseInt(input);
    if (number >= 1000 && number < 1000000) {
        let rounded = Math.ceil(number / 1000);
        return rounded >= 1000 ? (Math.floor(rounded / 1000) + "M") : (rounded + "K");
    } else if (number >= 1000000) {
        let rounded = Math.floor(number / 100000) / 10;
        return rounded + "M";
    } else {
        return number;
    }
}

function addCommasToNumber(number) {
    let numberStr = number.toString().replace(/[^\d]/g, '');
    let parts = [];
    for (let i = numberStr.length, j = 0; i >= 0; i--, j++) {
        parts.unshift(numberStr[i]);
        if (j > 0 && j % 3 === 0 && i > 0) {
            parts.unshift('.');
        }
    }
    return parts.join('');
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
            customClass: {
                confirmButton: 'btn-custom-black',
                cancelButton: 'btn-custom-info'
            },
            didRender: () => {
                $('.swal2-select').remove();
            }
        }).then((result) => {
            resolve(result.isConfirmed);
        });
    })
}

$(document).on('ready', function () {
    // ONLY DEV
    // =======================================================

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


    // INITIALIZATION OF SHOW PASSWORD
    // =======================================================
    $('.js-toggle-password').each(function () {
        new HSTogglePassword(this).init()
    });


    // INITIALIZATION OF FILE ATTACH
    // =======================================================
    $('.js-file-attach').each(function () {
        var customFile = new HSFileAttach($(this)).init();
    });


    // INITIALIZATION OF TABS
    // =======================================================
    $('.js-tabs-to-dropdown').each(function () {
        var transformTabsToBtn = new HSTransformTabsToBtn($(this)).init();
    });


    $('.text-discount-value').each(function () {
        let type = $(this).data('type');
        let val = $(this).data('value');
        if (type === '%') {
            $(this).text(val + '%');
        } else {
            $(this).text(formatNumberMoney(val));
        }
    })
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


    // INITIALIZATION OF COUNTERS
    // =======================================================
    $('.js-counter').each(function () {
        var counter = new HSCounter($(this)).init();
    });

    // INITIALIZATION OF QUICK VIEW POPOVER
    // =======================================================
    $('#editUserPopover').popover('show');

    $(document).on('click', '#closeEditUserPopover', function () {
        $('#editUserPopover').popover('dispose');
    });

    $('#editUserModal').on('show.bs.modal', function () {
        $('#editUserPopover').popover('dispose');
    });


    // DARK POPOVER
    // =======================================================
    $('[data-toggle="popover-dark"]').on('shown.bs.popover', function () {
        $('.popover').last().addClass('popover-dark')
    })
    //===============================================================================================
    $('#voucher_type').on('change', function () {
        let val = $(this).val();
        let ele_money = $('#discount_money');
        let ele_percent = $('#discount_percent');
        let money = ele_money.val();
        let percent = ele_percent.val();
        if (val === '%') {
            ele_percent.closest('div.col-sm-12.col-md-6').removeClass('d-none');
            ele_money.closest('div.col-sm-12.col-md-6').addClass('d-none');
            $('.text-discount-value').text(percent + '%');
        } else {
            ele_percent.closest('div.col-sm-12.col-md-6').addClass('d-none');
            ele_money.closest('div.col-sm-12.col-md-6').removeClass('d-none');
            let data = formatNumberMoney(money);
            if (isNaN(data)) {
                $('.text-discount-value').text(0);
            } else {
                $('.text-discount-value').text(data);
            }
        }
    })
    $('#discount_percent').on('input', function () {
        let val = Number($(this).val());
        let text = $('#text_error_discount_percent');
        if (val > 100) {
            text.text('Phần trăm giảm tối đa là 100.')
            return;
        }
        if (val < 0) {
            text.text('Phần trăm giảm tối thiểu là 0.')
            return;
        }
        text.text('')
        if (val > -1 || val < 101) {
            $('.text-discount-value').text(val + '%');
        }
    })
    $('#discount_money').on('input', function () {
        let val = Number($(this).val());
        let text = $('#text_error_discount_money');
        if (val > 1000000000) {
            text.text('Số tiền giảm tối đa là 1 tỷ.')
            return;
        }
        if (val < 1000 || isNaN(val)) {
            text.text('Số tiền giảm tối thiểu là 1.000đ.')
            return;
        }
        text.text('')
        if (val > 0 || !isNaN(val)) {
            $('.text-discount-value').text(formatNumberMoney($(this).val()));
        } else {
            $('.text-discount-value').text('');
        }
    })
    $('#quantity_discount').on('input', function () {
        let val = Number($(this).val());
        let text = $('#text_error_quantity_discount');
        let quantity = $('label.express_date.quantity');
        if (val < 0 || isNaN(val)) {
            text.text('Số lượng không được nhỏ hơn 0.')
            return;
        }
        if ($(this).val().length === 0) {
            text.text('Vui lòng nhập số lượng.')
            return;
        }
        text.text('');
        quantity.text(`Số Lượng: ${addCommasToNumber(val)}`)
    })
    $('#max_discount').on('input', function () {
        let val = Number($(this).val());
        let text = $('#text_error_max_discount');
        let max = $('label.express_date.max_discount');
        if (val > 1000000000) {
            text.text('Số tiền giảm tối đa là 1 tỷ.')
            return;
        }
        if (val < 0 || isNaN(val)) {
            text.text('Số tiền giảm không được nhỏ hơn 0.')
            return;
        }
        if ($(this).val().length === 0) {
            text.text('Vui lòng nhập số tiền giảm.')
            return;
        }
        text.text('');
        max.text(`Tối Đa: ${addCommasToNumber(val)}đ/Khách Hàng`);
    })
    $('#discount_end_time,#discount_start_time').on('change', function () {
        let end = new Date($(this).val());
        let start = new Date($('#discount_start_time').val());
        let text_start = $('#text_error_discount_start_time');
        let text_end = $('#text_error_discount_end_time');
        let voucher = $('label.express_date.end_date');
        if (!end || isNaN(end)) {
            text_end.text("Vui lòng chọn thời gian kết thúc.");
            return;
        }
        if (!start || isNaN(start)) {
            text_start.text("Vui lòng chọn thời gian bắt đầu.");
            return;
        }
        text_start.text('');
        if (end <= start) {
            text_end.text("Thời gian kết thúc phải sau thời gian bắt đầu.");
            return;
        }
        text_end.text('');
        let time = `${end.getHours().toString().padStart(2, '0') + ':' + end.getMinutes().toString().padStart(2, '0')} Ngày ${end.getDay().toString().padStart(2, '0') + '-' + end.getMonth().toString().padStart(2, '0') + '-' + end.getFullYear()}`;
        voucher.text(`Hạn Đến :${time}`);
    })
    $('#discount_condition').on('input', function () {
        let val = Number($(this).val());
        let text = $('#text_error_discount_condition');
        let voucher = $('label.express_date.condition');
        if (val < 0 || isNaN(val)) {
            text.text('Giá trị tối thiểu là 0đ.')
            return;
        }
        if ($(this).val().length === 0) {
            text.text('Vui lòng nhập giá trị đơn.')
            return;
        }
        text.text('');
        voucher.text(`Điều Kiện: Áp dụng cho đơn hàng từ ${addCommasToNumber(val)}đ`)
    })

    $(document).on('click', '.cancel-voucher', function () {
        let id = $(this).data('id');
        Confirm("Kết thúc giảm giá?", "Khi kết thúc phiếu sẽ không thể sử dụng.", "Không", "Đồng Ý").then((check) => {
            if (check) {
                $.ajax({
                    url: '/cms/voucher/cancel-voucher',
                    type: 'POST',
                    data: {
                        id: id
                    }, success: function (data) {
                        ToastSuccess("Thay đổi đã được áp dụng.")
                        $('#show-all-voucher').find(`tr[data-voucher-id="${data.id}"] td.status-voucher`).html('<span class="badge badge-pill badge-warning">Đã Kết Thúc</span>')
                    }, error: function (e) {
                        console.log(e)
                    }
                })
            }
        })
    })

    $('#btn-save-voucher').on('click', function () {
        let id = $('#id-voucher').val();
        let name = $('#voucher_name').val();
        let type = $('#voucher_type').val();
        let condition = $('#discount_condition').val().replace(/\D/g, '');
        let percent = $('#discount_percent').val().replace(/\D/g, '');
        let money = $('#discount_money').val().replace(/\D/g, '');
        let start_time = $('#discount_start_time').val();
        let end_time = $('#discount_end_time').val();
        let description = $('#description').val();
        let quantity = $('#quantity_discount').val().replace(/\D/g, '');
        let status = $('#discount_status').val();
        let max = $('#max_discount').val();

        if (name.replace(/\s/g, '').length === 0) {
            ToastError('Vui lòng nhập tên.');
            return;
        }
        if (type.length === 0) {
            ToastError('Vui lòng chọn loại giảm.');
            return;
        }
        if (condition.length === 0) {
            ToastError('Vui lòng nhập giá trị đơn hàng.');
            return;
        }
        if (type === '%') {
            if (percent.length === 0) {
                ToastError('Vui lòng nhập phần trăm giảm.');
                return;
            }
            if (Number(percent) < 0 || Number(percent) > 100) {
                ToastError('Phần trăm giảm không hợp lệ.');
                return;
            }
        } else {
            if (money.length === 0) {
                ToastError('Vui lòng nhập phần số tiền giảm.');
                return;
            }
            if (Number(money) < 1000 || Number(money) > 1000000000) {
                ToastError('Số tiền giảm không hợp lệ.');
                return;
            }
        }
        if (start_time.length === 0) {
            ToastError("Vui lòng chọn thời gian bắt đầu");
            return;
        }
        if (end_time.length === 0) {
            ToastError("Vui lòng chọn thời gian kết thúc");
            return;
        }
        let start = new Date(start_time);
        let end = new Date(end_time);
        if (start >= end) {
            ToastError("Thời gian không hợp lệ.");
            return;
        }
        if (quantity.replace(/\s/g, '').length === 0) {
            ToastError('Vui lòng nhập số lượng.');
            return;
        }
        if (max.replace(/\s/g, '').length === 0) {
            ToastError('Vui lòng nhập giá trị tối đa.');
            return;
        }
        if (Number(max) > 1000000000 || Number(max) < 0) {
            ToastError('Giá trị tối đa không hợp lệ.');
            return;
        }
        if (id.length !== 0) {
            if (status.length === 0) {
                ToastError('Vui lòng chọn trạng thái.')
                return;
            }
        }

        $.ajax({
            url: '/cms/voucher/add-voucher',
            type: 'POST',
            data: {
                id: id,
                name: name,
                type: type,
                percent: percent,
                money: money,
                condition: condition,
                quantity: quantity,
                status: status,
                start_time: start_time,
                end_time: end_time,
                max_discount: max,
                description: description,
            }, success: function (data) {
                ToastSuccess("Lưu Thành Công.")
                setTimeout(() => {
                    location.href = '/cms/voucher'
                }, 3000)
            }, error: function (e) {
                console.log(e)
                switch (e.getResponseHeader("status")) {
                    case 'NameNull':
                        ToastError("Vui lòng nhập tên.");
                        break;
                    case 'existsByName':
                        ToastError("Tên đã tồn tại.");
                        break;
                    case 'typeNull':
                        ToastError("Loại mã không hợp lệ.");
                        break;
                    case 'presentNull':
                        ToastError("Phần trăm giảm không hợp lệ.");
                        break;
                    case 'moneyNull':
                        ToastError("Số tiền giảm không hợp lệ.");
                        break;
                    case 'startNull':
                        ToastError("Thời gian bắt đầu không hợp lệ.");
                        break;
                    case 'endNull':
                        ToastError("Thời gian kết thúc không hợp lệ.");
                        break;
                    case 'quantityNull':
                        ToastError("Số lượng không hợp lệ.");
                        break;
                    case 'maxNull':
                        ToastError("Giá trị tối đa không hợp lệ.");
                        break;
                    case 'statusNull':
                        ToastError("Trạng thái không hợp lệ.");
                        break;
                    case 'conditionNull':
                        ToastError("Giá trị đơn hàng không hợp lệ.");
                        break;
                    default:
                        ToastError(e.getResponseHeader("status"));
                }
            }
        })
    })

});


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

