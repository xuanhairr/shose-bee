let data_oder_yesterday_in_store = [];
let data_oder_today_in_store = [];
let data_oder_today = [];
let data_oder_yesterday = [];
let data_oder_yesterday_online = [];
let data_oder_today_online = [];
let total_money_online = 0;
let total_money_in_store = 0;
let quantity_online = 0;
let quantity_in_store = 0;
let data_month = [];
let data_week = [];
let data_day = [];
activeSiderbar1EXXP("dashboards");
function getData() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/get-detail-arr-count',
            type: 'GET',
            success: function (response) {
                resolve(response)
            }, error: function (error) {
                reject(error)
            }
        })
    })
}

function convertDataToArray(data, name) {
    let dataArray = [];
    for (let key in data[name]) {
        dataArray.push(data[name][key]);
    }
    return dataArray;
}


function getRevenueToday(total_revenue) {
    const today = moment().format('DD-MM-YYYY');
    $.ajax({
        url: '/api/get-revenue-option',
        type: 'GET',
        data: {
            start: today,
            end: today
        },
        success: function (response) {
            $('#total-money-today').text(addCommasToNumber(response.total_money) + 'đ')
            updateChartRevenue(response.data, total_revenue, response.yesterday_data)
        },
        error: function (error) {
            console.log(error)
        }
    })
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

function printTopProduct(data) {
    let tr = '';
    if (data.length === 0) {
        tr = `<tr class="odd">
            <td valign="top" colspan="8" class="dataTables_empty">
            <div class="text-center p-4">
            <img class="mb-3" src="/assets/cms/svg/illustrations/sorry.svg" alt="Image Description" style="width: 7rem;">
            <p class="mb-0">Chưa có dữ liệu.</p>
            </div>
            </td>
            </tr>`;
    }
    data.forEach((item, index) => {
        tr +=
            `<tr>
                <td>${index + 1}</td>
                <td>
                    <a class="media align-items-center" href="/cms/view-product?id=${item.id}">
                        <img class="avatar mr-3" src="${item.anh}" alt="Image Description">
                        <div class="media-body">
                            <h5 class="text-hover-primary mb-0">${item.ten}</h5>
                        </div>
                    </a>
                </td>
                <td>${addCommasToNumber(item.giaBan)}đ</td>
                <td>${item.soLuong}</td>
                <td>
                    <h4 class="mb-0">${addCommasToNumber(item.tongTien)}đ</h4>
                </td>
            </tr>`;
    })
    $('#show-top-product').html(tr)
}

function sumArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        console.log("Độ dài của hai mảng không bằng nhau");
        return null;
    }
    let result = [];
    for (let i = 0; i < arr1.length; i++) {
        result.push(arr1[i] + arr2[i]);
    }
    return result;
}

let optionsDomainChart = {
    scales: {
        yAxes: [{
            gridLines: {
                color: "#e7eaf3",
                drawBorder: false,
                zeroLineColor: "#e7eaf3"
            },
            ticks: {
                beginAtZero: true,
                stepSize: 10,
                fontSize: 12,
                fontColor: "#97a4af",
                fontFamily: "Open Sans, sans-serif",
                padding: 10,
                postfix: ""
            }
        }],
        xAxes: [{
            gridLines: {
                display: false,
                drawBorder: false
            },
            ticks: {
                fontSize: 12,
                fontColor: "#97a4af",
                fontFamily: "Open Sans, sans-serif",
                padding: 5
            }
        }]
    },
    tooltips: {
        postfix: "",
        hasIndicator: true,
        mode: "index",
        intersect: false,
        lineMode: true,
        lineWithLineColor: "rgba(19, 33, 68, 0.075)"
    },
    hover: {
        mode: "nearest",
        intersect: true
    }
};

function updateChartRevenue(response, total_revenue, yesterday) {
    let keys = [];
    let values = [];
    let yesterdays = [];

    for (let key in response) {
        if (response.hasOwnProperty(key)) {
            let regex = /\D/;
            if (regex.test(key)) {
                let parts = key.split('-')
                keys.push(parts[2] + '/' + parts[1]);
            } else {
                keys.push(key)
            }
            values.push(response[key]);
        }
    }
    if (yesterday !== undefined) {
        for (let item in yesterday) {
            yesterdays.push(yesterday[item])
        }
    }

    total_revenue.data.labels = keys;
    if (yesterday === undefined || yesterday === null) {
        total_revenue.data.datasets = [{
            data: values,
            backgroundColor: "transparent",
            borderColor: "#377dff",
            borderWidth: 2,
            pointRadius: 0,
            hoverBorderColor: "#377dff",
            pointBackgroundColor: "#377dff",
            pointBorderColor: "#fff",
            pointHoverRadius: 0
        }]
    } else {
        total_revenue.data.datasets = [{
            data: values,
            backgroundColor: "transparent",
            borderColor: "#377dff",
            borderWidth: 2,
            pointRadius: 0,
            hoverBorderColor: "#377dff",
            pointBackgroundColor: "#377dff",
            pointBorderColor: "#fff",
            pointHoverRadius: 0
        },
            {
                data: yesterdays,
                backgroundColor: "transparent",
                borderColor: "#e7eaf3",
                borderWidth: 2,
                pointRadius: 0,
                hoverBorderColor: "#e7eaf3",
                pointBackgroundColor: "#e7eaf3",
                pointBorderColor: "#fff",
                pointHoverRadius: 0
            }]
    }
    total_revenue.update();
}

$(document).on('ready', function () {
    let chartToday = $.HSCore.components.HSChartJS.init($('#total-data-today'));
    let oderAll = $.HSCore.components.HSChartJS.init($('#total-oder-all'));
    let total_revenue = $.HSCore.components.HSChartJS.init($('#total-revenue-chart'));
    getRevenueToday(total_revenue);
    getData().then((res) => {
        total_money_online = res.data.total_online_revenue;
        total_money_in_store = res.data.total_store_revenue;
        quantity_online = res.data.quantity_online
        quantity_in_store = res.data.quantity_store
        data_oder_today_in_store = convertDataToArray(res, 'storeToday')
        data_oder_yesterday_in_store = convertDataToArray(res, 'storeYesterday')
        data_oder_today_online = convertDataToArray(res, 'onlineToday')
        data_oder_yesterday_online = convertDataToArray(res, 'onlineYesterday')
        data_oder_today = sumArrays(data_oder_today_in_store, data_oder_today_online)
        data_oder_yesterday = sumArrays(data_oder_yesterday_in_store, data_oder_yesterday_online)

        // oderAll.options = optionsDomainChart;
        oderAll.data.datasets = [{
            data: data_oder_today,
            backgroundColor: "transparent",
            borderColor: "#377dff",
            borderWidth: 2,
            pointRadius: 0,
            hoverBorderColor: "#377dff",
            pointBackgroundColor: "#377dff",
            pointBorderColor: "#fff",
            pointHoverRadius: 0
        },
            {
                data: data_oder_yesterday,
                backgroundColor: "transparent",
                borderColor: "#e7eaf3",
                borderWidth: 2,
                pointRadius: 0,
                hoverBorderColor: "#e7eaf3",
                pointBackgroundColor: "#e7eaf3",
                pointBorderColor: "#fff",
                pointHoverRadius: 0
            }]
        oderAll.update();
        chartToday.data.datasets = [
            {
                data: data_oder_today_in_store,
                backgroundColor: "#377dff",
                hoverBackgroundColor: "#377dff",
                borderColor: "#377dff"
            },
            {
                data: data_oder_yesterday_in_store,
                backgroundColor: "#e7eaf3",
                borderColor: "#e7eaf3"
            }
        ];
        chartToday.update();
        $("#show-total-money").text(addCommasToNumber(total_money_in_store) + 'đ');
        $("#text-quantity-oder-today").text(quantity_in_store);
        $("#total-quantity-today").text(quantity_in_store + quantity_online);
        $("#total-money-today").text(addCommasToNumber(total_money_online + total_money_in_store) + 'đ');
    })


    let discount = $('#chart-discount');
    let labels = discount.data('label');
    let value_today = discount.data('value_today');
    let value_yesterday = discount.data('value_yesterday');
    let chartDiscount = $.HSCore.components.HSChartJS.init(discount);
    labels = labels.split("-");
    value_today = value_today.split("-");
    value_yesterday = value_yesterday.split("-");
    chartDiscount.data.labels = labels;
    chartDiscount.data.datasets = [{
        data: value_today,
        backgroundColor: "transparent",
        borderColor: "#377dff",
        borderWidth: 2,
        pointRadius: 0,
        hoverBorderColor: "#377dff",
        pointBackgroundColor: "#377dff",
        pointBorderColor: "#fff",
        pointHoverRadius: 0
    },
        {
            data: value_yesterday,
            backgroundColor: "transparent",
            borderColor: "#e7eaf3",
            borderWidth: 2,
            pointRadius: 0,
            hoverBorderColor: "#e7eaf3",
            pointBackgroundColor: "#e7eaf3",
            pointBorderColor: "#fff",
            pointHoverRadius: 0
        }]
    chartDiscount.update();
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

    $('#top-product-option').on('change', function () {
        let val = $(this).val();
        if (val === 'month') {
            if (data_month.length > 0) {
                printTopProduct(data_month);
                return;
            }
        }
        if (val === 'week') {
            if (data_week.length > 0) {
                printTopProduct(data_week);
                return;
            }
        }
        if (val === 'day') {
            if (data_day.length > 0) {
                printTopProduct(data_day);
                return;
            }
        }
        $.ajax({
            url: '/api/get-top-product',
            type: 'GET',
            data: {
                option: val,
            },
            success: function (response) {
                if (val === 'month') {
                    data_month = response;
                }
                if (val === 'week') {
                    data_week = response;
                }
                if (val === 'day') {
                    data_day = response;
                }
                printTopProduct(response);
            }, error: function (error) {
                console.log(error)
            }
        })
    })

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


    // INITIALIZATION OF SELECT2
    // =======================================================
    $('.js-select2-custom').each(function () {
        var select2 = $.HSCore.components.HSSelect2.init($(this));
    });


    // INITIALIZATION OF CHARTJS
    // =======================================================
    Chart.plugins.unregister(ChartDataLabels);

    $('.js-chart').each(function () {
        $.HSCore.components.HSChartJS.init($(this));
    });


    $(document).on('change', '#total-oder-today-type', function () {
        let val = $(this).val();
        if (val === 'in-website') {
            chartToday.data.datasets = [
                {
                    "data": data_oder_today_online,
                    "backgroundColor": "#377dff",
                    "hoverBackgroundColor": "#377dff",
                    "borderColor": "#377dff"
                },
                {
                    "data": data_oder_yesterday_online,
                    "backgroundColor": "#e7eaf3",
                    "borderColor": "#e7eaf3"
                }
            ];
            $("#show-total-money").text(addCommasToNumber(total_money_online) + 'đ')
            $("#text-quantity-oder-today").text(quantity_online)
        } else {
            chartToday.data.datasets = [
                {
                    "data": data_oder_today_in_store,
                    "backgroundColor": "#377dff",
                    "hoverBackgroundColor": "#377dff",
                    "borderColor": "#377dff"
                },
                {
                    "data": data_oder_yesterday_in_store,
                    "backgroundColor": "#e7eaf3",
                    "borderColor": "#e7eaf3"
                }
            ];
            $("#show-total-money").text(addCommasToNumber(total_money_in_store) + 'đ')
            $("#text-quantity-oder-today").text(quantity_in_store)
        }
        chartToday.update();
    })
    var updatingChart = $.HSCore.components.HSChartJS.init($('#updatingData'));

    // CALL WHEN TAB IS CLICKED
    // =======================================================
    $('[data-toggle="chart-bar"]').click(function (e) {
        let keyDataset = $(e.currentTarget).attr('data-datasets')

        if (keyDataset === 'lastWeek') {
            updatingChart.data.labels = ["Apr 22", "Apr 23", "Apr 24", "Apr 25", "Apr 26", "Apr 27", "Apr 28", "Apr 29", "Apr 30", "Apr 31"];
            updatingChart.data.datasets = [
                {
                    "data": [120, 250, 300, 200, 300, 290, 350, 100, 125, 320],
                    "backgroundColor": "#377dff",
                    "hoverBackgroundColor": "#377dff",
                    "borderColor": "#377dff"
                },
                {
                    "data": [250, 130, 322, 144, 129, 300, 260, 120, 260, 245, 110],
                    "backgroundColor": "#e7eaf3",
                    "borderColor": "#e7eaf3"
                }
            ];
            updatingChart.update();
        } else {
            updatingChart.data.labels = ["May 1", "May 2", "May 3", "May 4", "May 5", "May 6", "May 7", "May 8", "May 9", "May 10"];
            updatingChart.data.datasets = [
                {
                    "data": [200, 300, 290, 350, 150, 350, 300, 100, 125, 220],
                    "backgroundColor": "#377dff",
                    "hoverBackgroundColor": "#377dff",
                    "borderColor": "#377dff"
                },
                {
                    "data": [150, 230, 382, 204, 169, 290, 300, 100, 300, 225, 120],
                    "backgroundColor": "#e7eaf3",
                    "borderColor": "#e7eaf3"
                }
            ]
            updatingChart.update();
        }
    })


    // INITIALIZATION OF BUBBLE CHARTJS WITH DATALABELS PLUGIN
    // =======================================================
    $('.js-chart-datalabels').each(function () {
        $.HSCore.components.HSChartJS.init($(this), {
            plugins: [ChartDataLabels],
            options: {
                plugins: {
                    datalabels: {
                        anchor: function (context) {
                            var value = context.dataset.data[context.dataIndex];
                            return value.r < 20 ? 'end' : 'center';
                        },
                        align: function (context) {
                            var value = context.dataset.data[context.dataIndex];
                            return value.r < 20 ? 'end' : 'center';
                        },
                        color: function (context) {
                            var value = context.dataset.data[context.dataIndex];
                            return value.r < 20 ? context.dataset.backgroundColor : context.dataset.color;
                        },
                        font: function (context) {
                            var value = context.dataset.data[context.dataIndex],
                                fontSize = 25;

                            if (value.r > 50) {
                                fontSize = 35;
                            }

                            if (value.r > 70) {
                                fontSize = 55;
                            }

                            return {
                                weight: 'lighter',
                                size: fontSize
                            };
                        },
                        offset: 2,
                        padding: 0
                    }
                }
            },
        });
    });


    // INITIALIZATION OF DATERANGEPICKER
    // =======================================================
    $('.js-daterangepicker').daterangepicker();

    $('.js-daterangepicker-times').daterangepicker({
        timePicker: true,
        startDate: moment().startOf('hour'),
        endDate: moment().startOf('hour').add(32, 'hour'),
        locale: {
            format: 'M/DD hh:mm A'
        }
    });

    var start = moment();
    var end = moment();

    function cb(start, end) {
        $('#js-daterangepicker-predefined .js-daterangepicker-predefined-preview').html(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
    }

    $('#js-daterangepicker-predefined').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Hôm Nay': [moment(), moment()],
            'Hôm Qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            '7 Ngày Qua': [moment().subtract(6, 'days'), moment()],
            '30 Ngày Qua': [moment().subtract(29, 'days'), moment()],
            'Tháng Này': [moment().startOf('month'), moment().endOf('month')],
            'Tháng Trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        locale: {
            format: 'dd/MM/yyyy'
        }
    }, cb);

    cb(start, end);

    function cbx(start, end) {
        $('#js-option-revenue .js-daterangepicker-predefined-preview').html(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
    }

    $('#js-option-revenue').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Hôm Nay': [moment(), moment()],
            'Hôm Qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            '7 Ngày Qua': [moment().subtract(6, 'days'), moment()],
            '30 Ngày Qua': [moment().subtract(29, 'days'), moment()],
            'Tháng Này': [moment().startOf('month'), moment().endOf('month')],
            'Tháng Trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cbx);

    cbx(start, end);
    $('.js-daterangepicker-predefined-preview').on('click', function () {
        $('li[data-range-key="Custom Range"]').text('Tùy Chỉnh');
    })


    $('#js-option-revenue').on('apply.daterangepicker', function (ev, picker) {
        const startDate = picker.startDate.format('DD-MM-YYYY');
        const endDate = picker.endDate.format('DD-MM-YYYY');

        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const yyyy = today.getFullYear();
        const todayFormatted = dd + '-' + mm + '-' + yyyy;
        const isToday = startDate === todayFormatted;

        $.ajax({
            url: '/api/get-revenue-option',
            type: 'GET',
            data: {
                start: startDate,
                end: endDate
            },
            success: function (response) {
                $('#total-money-today').text(addCommasToNumber(response.total_money) + 'đ')
                updateChartRevenue(response.data, total_revenue, response.yesterday_data)
            },
            error: function (error) {
                console.log(error)
            }
        })
        if (isToday) {
            $('#text-revenue-today').text('Hôm Nay');
            $('#text-revenue-yesterday').text('Hôm Qua');
        } else {
            $('#text-revenue-today').text('');
            $('#text-revenue-yesterday').text('');
        }
    });
    $('#js-daterangepicker-predefined').on('apply.daterangepicker', function (ev, picker) {
        let startDate = picker.startDate.format('DD-MM-YYYY');
        let endDate = picker.endDate.format('DD-MM-YYYY');
        $.ajax({
            url: '/api/get-quantity-oder-option',
            type: 'GET',
            data: {
                start: startDate,
                end: endDate
            },
            success: function (response) {
                if (response.check) {
                    let option = $('#total-oder-today-type').val();
                    let data_online = response.online_today;
                    let data_online_yes = response.online_yesterday;
                    let keys = [];
                    let values_today_online = [];
                    let values_yesterday_online = [];
                    for (let key in data_online) {
                        if (data_online.hasOwnProperty(key)) {
                            keys.push(key)
                            values_today_online.push(data_online[key]);
                        }
                    }
                    for (let key in data_online_yes) {
                        if (data_online_yes.hasOwnProperty(key)) {
                            values_yesterday_online.push(data_online_yes[key]);
                        }
                    }
                    let data_store = response.store_today;
                    let data_store_yes = response.store_yesterday;
                    let values_store_today = [];
                    let values_store_yesterday = [];
                    for (let key in data_store) {
                        if (data_store.hasOwnProperty(key)) {
                            values_store_today.push(data_store[key]);
                        }
                    }
                    for (let key in data_store_yes) {
                        if (data_store_yes.hasOwnProperty(key)) {
                            values_store_yesterday.push(data_store_yes[key]);
                        }
                    }
                    let element_today = $('#text-date-today').parent();
                    let element_yesterday = $('#text-date-yesterday').parent();
                    let span_today = element_today.find('span').clone();
                    let span_yesterday = element_yesterday.find('span').clone();
                    let parts = response.today.split("-");
                    let newDateString = parts[1] + "-" + parts[0] + "-" + parts[2];
                    let date = new Date(newDateString);
                    let today = new Date();
                    if (date.getDate() === today.getDate() &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear()) {
                        element_today.text("Hôm Nay");
                        element_yesterday.text("Hôm Qua");
                        element_today.prepend(span_today);
                        element_yesterday.prepend(span_yesterday);
                    } else {
                        element_today.text(response.today);
                        element_yesterday.text(response.yesterday);
                        element_today.prepend(span_today);
                        element_yesterday.prepend(span_yesterday);
                    }


                    data_oder_today_online = values_today_online;
                    data_oder_yesterday_online = values_yesterday_online;
                    data_oder_today_in_store = values_store_today;
                    data_oder_yesterday_in_store = values_store_yesterday;
                    total_money_online = response.total_online_revenue;
                    total_money_in_store = response.total_store_revenue;
                    quantity_online = response.quantity_online;
                    quantity_in_store = response.quantity_store;
                    if (option === 'in-website') {
                        $('#show-total-money').text(addCommasToNumber(response.total_online_revenue) + 'đ')
                        $('#text-quantity-oder-today').text(addCommasToNumber(response.quantity_online))
                        chartToday.data.labels = keys;
                        chartToday.data.datasets = [
                            {
                                data: data_oder_today_online,
                                backgroundColor: "#377dff",
                                hoverBackgroundColor: "#377dff",
                                borderColor: "#377dff"
                            },
                            {
                                data: data_oder_yesterday_online,
                                backgroundColor: "#e7eaf3",
                                borderColor: "#e7eaf3"
                            }
                        ];
                        chartToday.update();
                    } else {
                        $('#show-total-money').text(addCommasToNumber(response.total_store_revenue) + 'đ')
                        $('#text-quantity-oder-today').text(addCommasToNumber(response.quantity_store))
                        chartToday.data.labels = keys;
                        chartToday.data.datasets = [
                            {
                                data: data_oder_today_in_store,
                                backgroundColor: "#377dff",
                                hoverBackgroundColor: "#377dff",
                                borderColor: "#377dff"
                            },
                            {
                                data: data_oder_yesterday_in_store,
                                backgroundColor: "#e7eaf3",
                                borderColor: "#e7eaf3"
                            }
                        ];
                        chartToday.update();
                    }

                } else {
                    let option = $('#total-oder-today-type').val();
                    let element_today = $('#text-date-today').parent();
                    let element_yesterday = $('#text-date-yesterday').parent();
                    let span_today = element_today.find('span').clone();
                    let span_yesterday = element_yesterday.find('span').clone();
                    element_today.html(span_today);
                    element_yesterday.html(span_yesterday);

                    let data_online = response.online_data;
                    let keys = [];
                    let values_today_online = [];
                    let values_yesterday_online = [];
                    for (let key in data_online) {
                        if (data_online.hasOwnProperty(key)) {
                            let parts = key.split('-')
                            keys.push(parts[2] + '/' + parts[1] + '/' + parts[0]);
                            values_yesterday_online.push(0);
                            values_today_online.push(data_online[key]);
                        }
                    }
                    let data_store = response.store_data;
                    let values_today_store = [];
                    let values_yesterday_store = [];
                    for (let key in data_store) {
                        if (data_store.hasOwnProperty(key)) {
                            values_yesterday_store.push(0);
                            values_today_store.push(data_store[key]);
                        }
                    }

                    data_oder_today_online = values_today_online;
                    data_oder_yesterday_online = values_yesterday_online;
                    data_oder_today_in_store = values_today_store;
                    data_oder_yesterday_in_store = values_yesterday_store;
                    total_money_online = response.total_money_online;
                    total_money_in_store = response.total_money_store;
                    quantity_online = response.count_online;
                    quantity_in_store = response.count_store;
                    if (option === 'in-website') {
                        $('#show-total-money').text(addCommasToNumber(total_money_online) + 'đ')
                        $('#text-quantity-oder-today').text(addCommasToNumber(quantity_online))
                        chartToday.data.labels = keys;
                        chartToday.data.datasets = [
                            {
                                data: data_oder_today_online,
                                backgroundColor: "#377dff",
                                hoverBackgroundColor: "#377dff",
                                borderColor: "#377dff"
                            }
                        ];
                        chartToday.update();
                    } else {
                        $('#show-total-money').text(addCommasToNumber(total_money_in_store) + 'đ')
                        $('#text-quantity-oder-today').text(addCommasToNumber(quantity_in_store))
                        chartToday.data.labels = keys;
                        chartToday.data.datasets = [
                            {
                                data: data_oder_today_in_store,
                                backgroundColor: "#377dff",
                                hoverBackgroundColor: "#377dff",
                                borderColor: "#377dff"
                            }
                        ];
                        chartToday.update();
                    }

                }
            },
            error: function (error) {
                console.log(error)
            }
        })
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
                '<p class="mb-0">No data to show</p>' +
                '</div>'
        }
    });

    $('.js-datatable-filter').on('change', function () {
        var $this = $(this),
            elVal = $this.val(),
            targetColumnIndex = $this.data('target-column-index');

        datatable.column(targetColumnIndex).search(elVal).draw();
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


    // INITIALIZATION OF CLIPBOARD
    // =======================================================
    $('.js-clipboard').each(function () {
        var clipboard = $.HSCore.components.HSClipboard.init(this);
    });
});