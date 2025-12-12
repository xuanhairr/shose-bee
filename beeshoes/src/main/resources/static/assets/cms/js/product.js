activeSiderbar('san_pham',"",'li_san_pham')
$(document).on('ready', function () {
    // ONLY DEV
    // =======================================================
    $(document).on('input', '.number-input-mask', function () {
        // Sử dụng jQuery Mask Plugin để áp dụng mask
        $(this).mask('0000');
    });

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
        }
    });
    // Tạo số thứ tự || đang lỗi
    // datatable.on('order.dt search.dt', function() {
    //     datatable.columns(1, { search: 'applied', order: 'applied' }).nodes().each(function(cell, i) {
    //         cell.innerHTML = i + 1;
    //     });
    // }).draw();
    $('input[name="status"]').on('change', function () {
        var value = $(this).val();
        if (value === 'active') {
            datatable.columns(9).search('Đang Bán').draw();
        } else if (value === 'noActive') {
            datatable.columns(9).search('Chưa Bán').draw();
        } else {
            datatable.columns(9).search('').draw();
        }
    });
    const quantityFromInput = document.querySelector('#quantity_from');
    const quantityToInput = document.querySelector('#quantity_to');

    var table = $('#datatable').DataTable();

    function applyFilters() {
        const priceSortSlider = document.querySelector('#price_sort');
        let quantityFrom = parseInt(quantityFromInput.value, 10) || 0;
        let quantityTo = parseInt(quantityToInput.value, 10) || Infinity; // Sử dụng Infinity cho giá trị tới vô cực
        let minPrice = 0;
        let maxPrice = Infinity;

        if (priceSortSlider) {
            let priceRange = priceSortSlider.value.split(";");
            minPrice = parseFloat(priceRange[0]) * 1000 || 0;
            maxPrice = parseFloat(priceRange[1]) * 1000 || Infinity;
        }

        // Xóa bất kỳ hàm lọc nào đã được thêm trước đó để tránh việc thêm nhiều lần
        $.fn.dataTable.ext.search.pop();

        // Thêm hàm lọc mới
        $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
            let quantity = parseFloat(data[8]) || 0; // Sử dụng data cho cột số lượng
            let price = parseFloat(data[7].replace(/\./g, '')) || 0; // Xóa dấu chấm và chuyển đổi thành số, cột 8 trong dữ liệu
            return ((isNaN(quantityFrom) && isNaN(quantityTo)) ||
                    (isNaN(quantityFrom) && quantity <= quantityTo) ||
                    (quantityFrom <= quantity && isNaN(quantityTo)) ||
                    (quantityFrom <= quantity && quantity <= quantityTo)) &&
                (price >= minPrice && price <= maxPrice);
        });
        table.draw();
    }

    quantityFromInput.addEventListener('input', applyFilters);
    quantityToInput.addEventListener('input', applyFilters);
    $('#price_sort').on('change', function () {
        setTimeout(() => {
            applyFilters();
        }, 500)
    })


    $('.js-ion-range-slider').each(function () {
        $.HSCore.components.HSIonRangeSlider.init($(this));
    });

    $('#thuongHieuFilter, #theLoaiFilter, #mauSacFilter, #kichCoFilter').on('change', function () {
        var thuongHieuValue = $('#thuongHieuFilter').val();
        var theLoaiValue = $('#theLoaiFilter').val();
        var mau = $('#mauSacFilter').val();
        var co = $('#kichCoFilter').val();

        var thuongHieuFilter = (thuongHieuValue === 'all') ? '' : thuongHieuValue;
        var theLoaiFilter = (theLoaiValue === 'all') ? '' : theLoaiValue;
        var mauF = (mau === 'all') ? '' : mau;
        var coF = (co === 'all') ? '' : co;

        datatable.columns(3).search(mauF).draw();
        datatable.columns(4).search(coF).draw();
        datatable.columns(5).search(theLoaiFilter).draw();
        datatable.columns(6).search(thuongHieuFilter).draw();
    });

    $('#datatableSearch').on('mouseup', function (e) {
        var $input = $(this),
            oldValue = $input.val();

        if (oldValue == "") return;

        setTimeout(function () {
            var newValue = $input.val();

            if (newValue == "") {
                // Gotcha
                datatable.search('').draw();
            }
        }, 1);
    });
    $('#toggleColumn_stt').change(function (e) {
        datatable.columns(1).visible(e.target.checked)
    })
    $('#toggleColumn_product').change(function (e) {
        datatable.columns(2).visible(e.target.checked)
    })
    $('#toggleColumn_color').change(function (e) {
        datatable.columns(3).visible(e.target.checked)
    })
    $('#toggleColumn_size').change(function (e) {
        datatable.columns(4).visible(e.target.checked)
    })
    $('#toggleColumn_type').change(function (e) {
        datatable.columns(5).visible(e.target.checked)
    })
    $('#toggleColumn_vendor').change(function (e) {
        datatable.columns(6).visible(e.target.checked)
    })
    datatable.columns(3).visible(false)
    datatable.columns(4).visible(false)
    $('#toggleColumn_price').change(function (e) {
        datatable.columns(7).visible(e.target.checked)
    })
    $('#toggleColumn_quantity').change(function (e) {
        datatable.columns(8).visible(e.target.checked)
    })
    $('#toggleColumn_variants').change(function (e) {
        datatable.columns(9).visible(e.target.checked)
    })
    // $(window).on('load', function () {
    //     setTimeout(function () {
    //         $('#spinner').addClass('d-none');
    //         $('#dataInTable').removeClass('d-none');
    //     }, 3000);
    // });
    // INITIALIZATION OF TAGIFY
    // =======================================================
    $('.js-tagify').each(function () {
        var tagify = $.HSCore.components.HSTagify.init($(this));
    });


});
