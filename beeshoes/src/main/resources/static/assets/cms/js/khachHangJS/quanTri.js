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

// function formValidate() {
//     var title1 = $('#title1').val();
//     var title2 = $('#title2').val();
//     var moTa1 = $('#moTa1').val();
//     var moTa2 = $('#moTa2').val();
//     var title_sp1 = $('#title_sp1').val();
//     var title_sp2 = $('#title_sp2').val();
//     var title_sp3 = $('#title_sp3').val();
//     var title_sp_sale = $('#title_sp_sale').val();
//
//     if (isEmpty(title1)) {
//         ToastError("Title1 không được để trống.");
//         return false;
//     }
//
//     if (isEmpty(title2)) {
//         ToastError("Title2 không được để trống.");
//         return false;
//
//         if (isEmpty(moTa1)) {
//             ToastError("Mô tả 1 không được để trống.");
//             return false;
//         }
//
//         if (isEmpty(moTa2)) {
//             ToastError("Mô tả 2 không được để trống.");
//             return false;
//         }
//
//         if (isEmpty(title_sp1)) {
//             ToastError("Title sp 1 sinh không được để trống.");
//             return false;
//         }
//
//         if (isEmpty(title_sp2)) {
//             ToastError("Title sp 2 sinh không được để trống.");
//             return false;
//         }
//
//         if (isEmpty(title_sp3)) {
//             ToastError("Title sp 3 sinh không được để trống.");
//             return false;
//         }
//
//         if (isEmpty(title_sp_sale)) {
//             ToastError('Title sp sale khng được trống.')
//             return false;
//         }
//         return true;
//     }
// }


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