$(document).on('ready', function () {
    $('.js-fancybox-item').each(function () {
        var fancybox = $.HSCore.components.HSFancyBox.init($(this));
    })
});

function updateCounterInfo() {
    var checkedCount = $('.custom-control-input:checked').length;
    $('#datatableCounterInfo').text(checkedCount + ' Selected');
}

updateCounterInfo()
$(document).on('ready', function () {
    $('#datatableCheckAll').on('change', function () {
        let isChecked = $(this).prop('checked');
        if (isChecked) {
            $('#datatableCounterInfo').show();
        } else {
            $('#datatableCounterInfo').hide();
        }
        updateCounterInfo()
        $('.custom-control-input').prop('checked', isChecked);
    });

    $('.custom-control-input').on('change', function () {
        if (!$(this).prop('checked')) {
            $('#datatableCheckAll').prop('checked', false);
        } else {
            let allChecked = $('.custom-control-input:checked').length === $('.custom-control-input').length;
            $('#datatableCheckAll').prop('checked', allChecked);
        }
        updateCounterInfo()
    });
    // BUILDER TOGGLE INVOKER
    // =======================================================
    $('.js-navbar-vertical-aside-toggle-invoker').click(function () {
        $('.js-navbar-vertical-aside-toggle-invoker i').tooltip('hide');
    });


    // INITIALIZATION OF MEGA MENU
    // =======================================================
    let megaMenu = new HSMegaMenu($('.js-mega-menu'), {
        desktop: {
            position: 'left'
        }
    }).init();


    // INITIALIZATION OF NAVBAR VERTICAL NAVIGATION
    // =======================================================
    let sidebar = $('.js-navbar-vertical-aside').hsSideNav();


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
        let unfold = new HSUnfold($(this)).init();
    });


    // INITIALIZATION OF FORM SEARCH
    // =======================================================
    $('.js-form-search').each(function () {
        new HSFormSearch($(this)).init()
    });

    // INITIALIZATION OF SELECT2
    // =======================================================
    $('.js-select2-custom').each(function () {
        var select2 = $.HSCore.components.HSSelect2.init($(this));
    });


    // INITIALIZATION OF QUILLJS EDITOR
    // =======================================================
    var quill = $.HSCore.components.HSQuill.init('.js-quill');

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


    // INITIALIZATION OF TAGIFY
    // =======================================================
    $('.js-tagify').each(function () {
        var tagify = $.HSCore.components.HSTagify.init($(this));
    });
    // INITIALIZATION OF DROPZONE FILE ATTACH MODULE
    // =======================================================
    $('.js-dropzone').each(function () {
        var dropzone = $.HSCore.components.HSDropzone.init('#' + $(this).attr('id'));
    });
});
