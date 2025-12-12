

'use strict';
let dataShop = [];
let username = $('#authentication_username').val();
let dataShopingCart = [];

/**
 * hàm kiểm tra xem có đăng nhập không , nếu đăng nhập thì hỏi khách hàng
 * có cập nhật dữ liệu giỏ hàng từ local về server
 * */

startUp()

let worker = new Worker('/assets/customer/js/work_get_all_product.js');
window.onload = function () {
    worker.postMessage('start');
};

worker.onmessage = function (e) {
    console.log(e.data);
    dataShop = e.data;
    if (typeof printAllData === 'function') {
        printAllData();
    }
};
// window.onload = function () {
//     // ToastSuccess('Tải hoàn tất !')
//     $.ajax({
//         url: '/api/get-all-san-pham',
//         type: 'GET',
//         success: function (data) {
//             dataShop = data;
//             console.log(dataShop)
//             if (typeof printAllData === 'function') {
//                 printAllData();
//             }
//         },
//         error: function (jqXHR, textStatus, errorThrown) {
//             console.error("Lỗi khi gọi API: " + textStatus, errorThrown);
//         }
//     })
// };

function getAllProductPrintToCart() {
    $.ajax({
        url: '/api/get-product-in-cart',
        type: 'GET',
        success: function (data) {
            dataShopingCart = data;
            printDataInServerResponse(data);
        },
        error: function (xhr) {
            console.log(xhr)
        }
    })
}

function avatarError(element, event) {
    $.ajax({
        url: '/api/get-avatar',
        type: 'GET',
        success: function (res) {
            $(element).attr('src', res);
        }, error: function (e) {
            console.log(e)
        }
    })
}

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

// window.addEventListener('devtoolschange', function(event) {
//     if (event.detail.isOpen) {
//         // Xử lý khi DevTools được mở
//         console.log('DevTools đã được mở.');
//     } else {
//         // Xử lý khi DevTools đã đóng
//         console.log('DevTools đã được đóng.');
//     }
// });
function pushDataToArray(data) {
    let data_cart = getProductInLocalStorage();
    let index = null;
    if (data_cart !== null && Array.isArray(data_cart)) {
        let found = false;
        for (let i = 0; i < data_cart.length; i++) {
            if (Number(data_cart[i].pro.id) === Number(data.pro.id)) {
                data_cart[i].quantity = Number(data_cart[i].quantity) + Number(data.quantity);
                found = true;
                index = i;
                break;
            }
        }
        if (!found) {
            data_cart.push(data);
        }
    } else {
        data_cart = []
        data_cart.push(data);
    }
    let check = true;
    for (let i = 0; i < dataShop.length; i++) {
        let arrDT = dataShop[i].chiTietSanPham;
        for (let j = 0; j < arrDT.length; j++) {
            if (index !== null) {
                if (Number(arrDT[j].id) === Number(data_cart[index].pro.id)) {
                    if (Number(data_cart[index].quantity) > Number(arrDT[j].soLuongTon)) {
                        check = false;
                        break;
                    } else {
                        saveProductTolocalStorage(data_cart);
                        break;
                    }
                }
            } else {
                if (Number(arrDT[j].id) === Number(data.pro.id)) {
                    if (Number(data.quantity) > Number(arrDT[j].soLuongTon)) {
                        check = false;
                        break;
                    } else {
                        saveProductTolocalStorage(data_cart);
                        break;
                    }
                }
            }
        }
    }
    if (!check) {
        ToastError('Số lượng chọn lớn hơn số lượng tồn.');
    }
    return check;
}

function startUp() {
    if (username !== undefined) {
        getAllProductPrintToCart();
        let data = getProductInLocalStorage();
        if (data === null) {
            return;
        }
        if (Array.isArray(data)) {
            Confirm('Giỏ hàng tạm thời có sản phẩm?', 'Bạn có muốn cập nhật vào giỏ hàng cá nhân không ?', 'Không', 'Có').then((check) => {
                if (check) {
                    let response = [];
                    data.forEach((item) => {
                        response = saveProductToServer(item.pro.id, item.quantity, true);
                    });
                    dataShopingCart = response;
                    printDataInServerResponse(response);
                    localStorage.removeItem('shopping_carts')
                } else {
                    localStorage.removeItem('shopping_carts')
                }
            })
        }
    } else {
        let data = getProductInLocalStorage();
        let arrayDelete = []
        if (data !== null && Array.isArray(data)) {
            let promises = data.map(product => {
                return new Promise((resolve, reject) => {
                    $.ajax({
                        url: '/api/update-product-cart',
                        type: 'POST',
                        data: {
                            id: product.pro.id,
                        },
                        success: function (data) {
                            product.pro.gia_ban = addCommasToNumber(data.giaBan);
                            if (data.soLuong < 1) {
                                arrayDelete.push(data.id)
                            }
                            resolve();
                        },
                        error: function (xhr) {
                            console.log(xhr);
                            reject(xhr);
                        }
                    });
                });
            });
            Promise.all(promises).then(() => {
                saveProductTolocalStorage(data);
                let element = $('input#listData')
                if (element.length !== 0) {
                    let list = element.val();
                    let numbers = list.split(",").map(Number);
                    console.log(numbers)
                    numbers.forEach(item => {
                        deleteByIdProductLocal(item);
                    });
                }
                if (arrayDelete.length > 0) {
                    Confirm("Tạm hết hàng !", `Có ${arrayDelete.length} sản phẩm trong giỏ hàng hiện đang hết hàng.`, "Không", "Xóa").then((res) => {
                        if (res) {
                            arrayDelete.forEach(item => {
                                deleteByIdProductLocal(item);
                            });
                        }
                    })
                }
                printProductwithStartup();
            }).catch(error => {
                console.error('Có lỗi xảy ra khi cập nhật dữ liệu sản phẩm:', error);
            });
        }
    }
}

function isEmpty(str) {
    return (!str || str.length === 0);
}

//hàm gửi dữ liệu khi thêm sản phẩm vào giỏ hàng về server nếu đăng nhập và trả về danh sách sản phẩm trong giỏ hàng của user đó
//có 2 trạng thái true là cập nhật , sô lượng ở đây sẽ cập nhật lên server | trạng thái false số lượng sẽ công dồn với server
function saveProductToServer(product_id, quantity, update) {
    let data = [];
    if (isEmpty(product_id) || isEmpty(quantity)) {
        return;
    }
    $.ajax({
        url: '/api/add-product-to-cart',
        type: 'POST',
        data: {
            update: update == undefined ? false : update,
            quantity: quantity,
            product: product_id,
        },
        success: function (datas) {
            data = datas
            printDataInServerResponse(datas)
            dataShopingCart = datas;
            ToastSuccess('Thêm thành công.');
        },
        error: function (xhr) {
            switch (xhr.getResponseHeader('status')) {
                case 'ProductNull':
                    ToastError('Sản phẩm trống.');
                    break;
                case 'NotAuth':
                    ToastError('Vui lòng đăng nhập để thực hiện.');
                    break;
                case 'MinQuantity':
                    ToastError('Số lượng phải lớn hơn 0.');
                    break;
                case 'ProductDetailNull':
                    ToastError('Phiên bản không tồn tại.');
                    break;
                case 'MaxQuantity':
                    ToastError('Số lượng vượt quá Số lượng tồn.');
                    break;
                case '0Quantity':
                    ToastError('Phiên bản hiện tại đang hết hàng.');
                    break;
                default:
                    ToastError('Lỗi.');
            }
        }
    })
    return data;
}

//hàm in dữ liệu nhận về từ server
function printDataInServerResponse(datas) {
    let cart = $('#list_product_items_cart');
    cart.empty();
    let total = 0;
    let html = '';
    datas.forEach((data) => {
        html += `
    <div class="cart_product_item row" data-id-product="${data.chitietSanPham.id}">
        <div class="thumb col-3">
            <img src="${data.chitietSanPham.anh}" alt="product img">
        </div>
        <div class="cart_content col-9 ">
            <h5 class="title col-12 w_100">${data.chitietSanPham.ten}</h5>
            <div class="product_quantity col-12 w_100 mt-1 " >
                <label class="mb-0" id="quantyti_${data.chitietSanPham.id}" >SL:${data.soLuong}</label>
            </div>
            <div class="col-12 height-mid">
                <label class="small mb-0">MS:${data.chitietSanPham.mauSac}</label>
                <label class="small mb-0">KT:${data.chitietSanPham.kichCo}</label>
            </div>
            <h6 class="product_price col-sm-12 w_100">${addCommasToNumber(data.chitietSanPham.giaBan)}đ</h6>
            <a class="cart_trash" data-id-ghct="${data.id}" data-id-delete="${data.chitietSanPham.id}"><i class="fa fa-trash"></i></a>
        </div>
    </div>
    `;
        total += data.chitietSanPham.giaBan * data.soLuong;
    })
    cart.append(html);
    total = addCommasToNumber(total) + 'đ';
    $('#total-money-cart').text(total);
    $('#quantity__item_carts').text(datas.length);
}

function ToastSuccess(message) {
    Toast('success', message)
}

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

function showLoader() {
    $('#preloder').css('display', 'block').find('.loader').css('display', 'block');
}

function closeLoader() {
    $('#preloder').css('display', 'none').find('.loader').css('display', 'none');
}

function showLoading() {
    Swal.fire({
        title: 'Đang xử lý...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading()
        }
    });
}

function hideLoading() {
    Swal.close();
}

function ToastError(message) {
    Toast('error', message)
}

function getProductInLocalStorage() {
    return JSON.parse(localStorage.getItem('shopping_carts'));
}

function saveProductTolocalStorage(data) {
    localStorage.setItem('shopping_carts', JSON.stringify(data));
}

// hàm xóa sản phẩm trong giỏ hàng
$(document).on('click', '.cart_trash', function () {
    Confirm('Xóa sản phẩm?', 'Xóa sản phẩm khỏi giỏ hàng?', 'Hủy', 'Xác Nhận').then((result) => {
        if (result) {
            if (username === undefined) {
                let id = $(this).data('id-delete');
                if (id === undefined) {
                    return;
                }
                let data_in_cart = getProductInLocalStorage();
                if (data_in_cart === null) {
                    return;
                }
                let total = 0;
                let updatedCart = [];
                for (let i = 0; i < data_in_cart.length; i++) {
                    if (data_in_cart[i].pro.id === `${id}`) {
                        continue;
                    }
                    updatedCart.push(data_in_cart[i]);
                    total += extractNumberFromString(data_in_cart[i].pro.gia_ban) * data_in_cart[i].quantity;
                    console.log(total)
                    console.log(data_in_cart[i].pro)
                }

                ToastSuccess('Xóa thành công.')
                saveProductTolocalStorage(updatedCart);
                $('#total-money-cart').text(addCommasToNumber(total) + 'đ');
                $('#quantity__item_carts').text(updatedCart.length);
                $(`.cart_product_item[data-id-product="${id}"]`).remove();
            } else {
                let id = $(this).data('id-ghct');
                deleteGHCT(id);
            }
        }
    });
})

function deleteGHCT(id) {
    let bool = false;
    $.ajax({
        url: '/api/del-shopping-cart-detail',
        type: 'DELETE',
        data: {
            id: id
        },
        success: () => {
            bool = true;
            ToastSuccess('Xoá thành công.')
            if (dataShopingCart !== null && Array.isArray(dataShopingCart)) {
                for (let i = 0; i < dataShopingCart.length; i++) {
                    let data = dataShopingCart[i];
                    if (data.id == id) {
                        dataShopingCart.splice(i, 1);
                        break;
                    }

                }
                printDataInServerResponse(dataShopingCart)
            }
        },
        error: (err) => {
            console.log(err)
        }
    })
    return bool;
}

function deleteByIdProductLocal(id) {
    let data = getProductInLocalStorage();
    if (data !== null && Array.isArray(data)) {
        const index = data.findIndex(item => Number(item.pro.id) === Number(id));
        if (index !== -1) {
            data.splice(index, 1);
            saveProductTolocalStorage(data);
        }
    }
}

// hàm in dữ liệu nếu không đăng nhập
function printProductwithStartup() {
    let products = getProductInLocalStorage();
    if (!Array.isArray(products)) {
        return;
    }
    let total = 0;
    let html = '';
    products.forEach((data) => {
        html += `
    <div class="cart_product_item row" data-id-product="${data.pro.id}">
        <div class="thumb col-3">
            <img src="${data.pro.product_img}" alt="product img">
        </div>
        <div class="cart_content col-9 ">
            <h5 class="title col-12 w_100">${data.pro.name}</h5>
            <div class="product_quantity col-12 w_100 mt-1 " >
                <label class="mb-0" id="quantyti_${data.pro.id}" >SL:${data.quantity}</label>
            </div>
            <div class="col-12 height-mid">
                <label class="small mb-0">MS:${data.pro.color_name}</label>
                <label class="small mb-0">KT:${data.pro.size}</label>
            </div>
            <h6 class="product_price col-sm-12 w_100">${data.pro.gia_ban}đ</h6>
            <a class="cart_trash" data-id-delete="${data.pro.id}"><i class="fa fa-trash"></i></a>
        </div>
    </div>
    `;
        total += extractNumberFromString(data.pro.gia_ban) * data.quantity;
    })
    $('#list_product_items_cart').empty().append(html);
    total = addCommasToNumber(total);

    $('#total-money-cart').text(total + 'đ');
    $('#quantity__item_carts').text(products.length);
}

// hàm xóa ký tự trong chuỗi và convert về Number
function extractNumberFromString(str) {
    str = str.toString();
    let numberStr = str.replace(/\D/g, '');
    let number = parseInt(numberStr);
    return number;
}

// hàm thêm dấu chấm vào số
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

$('#btn-checkout-header').on('click', function () {
    let data = getProductInLocalStorage();
    if (data !== null && Array.isArray(data) && data.length > 0) {
        let datasubmit = [];
        let total = 0;
        data.forEach((product) => {
            total += extractNumberFromString(product.pro.gia_ban) * product.quantity
            datasubmit.push({
                quantity: product.quantity,
                id_product_detail: product.pro.id
            });
        });
        if (total > 50000000) {
            ToastError('Tổng tiền không được lớn hơn 50 triệu !')
            return;
        }

        let jsonData = JSON.stringify(datasubmit);
        let form = $('<form>', {
            action: '/checkout',
            method: 'POST',
            style: 'display: none;'
        });
        $('<input>').attr({
            type: 'hidden',
            name: 'listData',
            value: jsonData
        }).appendTo(form);
        let ma = typeof SelectedVoucher !== 'undefined' ? SelectedVoucher.ma : '';
        $('<input>').attr({
            type: 'hidden',
            name: 'maGiamGia',
            value: ma,
        }).appendTo(form);
        form.appendTo('body');
        form.submit();
    } else {
        ToastError('Vui lòng chọn sản phẩm.')
    }
})

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

//=================================================================================================================================

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(100).fadeOut("slow");

        /*------------------
            Gallery filter
        --------------------*/
        $('.filter__controls li').on('click', function () {
            $('.filter__controls li').removeClass('active');
            $(this).addClass('active');
        });
        if ($('.product__filter').length > 0) {
            let containerEl = document.querySelector('.product__filter');
            let mixer = mixitup(containerEl);
        }
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        let bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    //Search Switch
    $('.search-switch').on('click', function () {
        $('.search-model').fadeIn(400);
    });

    $('.search-close-switch').on('click', function () {
        $('.search-model').fadeOut(400, function () {
            $('#search-input').val('');
        });
    });

    /*------------------
		Navigation
	--------------------*/
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });

    /*------------------
        Accordin Active
    --------------------*/
    $('.collapse').on('shown.bs.collapse', function () {
        $(this).prev().addClass('active');
    });

    $('.collapse').on('hidden.bs.collapse', function () {
        $(this).prev().removeClass('active');
    });

    //Canvas Menu
    $(".canvas__open").on('click', function () {
        $(".offcanvas-menu-wrapper").addClass("active");
        $(".offcanvas-menu-overlay").addClass("active");
    });

    $(".offcanvas-menu-overlay").on('click', function () {
        $(".offcanvas-menu-wrapper").removeClass("active");
        $(".offcanvas-menu-overlay").removeClass("active");
    });

    /*-----------------------
        Hero Slider
    ------------------------*/
    $(".hero__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: true,
        navText: ["<span class='arrow_left'><span/>", "<span class='arrow_right'><span/>"],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: false
    });

    /*--------------------------
        Select
    ----------------------------*/
    let select = $("select");
    if (select.length > 0) {
        select.niceSelect();
    }

    /*-------------------
		Radio Btn
	--------------------- */
    let product_id = '';

    $(document).on('click', ".product__color__select label", function () {
        $(".product__color__select label").removeClass('active');
        $(this).addClass('active');
        let id = $(this).closest('.product__item').data('product-id');
        if (product_id !== id) {
            product_id = id;
            $(".label_select_size").removeClass('active');
        }
        let parent = $(this).closest('.product__item');
        parent.find('.product__option__size label').addClass('hidden');
        let product = dataShop.find(item => item.id === id);
        let color = $(this).find('input').val();
        if (Array.isArray(product.chiTietSanPham)) {
            product.chiTietSanPham.forEach((ctsp) => {
                if (ctsp.mauSac == color) {
                    let element = parent.find('.product__option__size label').filter(function () {
                        return $(this).find('input').val() === `${ctsp.kichCo}`;
                    });
                    element.removeClass('hidden');
                }
            })
            let ele_size = parent.find('.label_select_size.active');
            console.log(ele_size)
            if (ele_size.length > 0 && ele_size.hasClass('hidden')) {
                ele_size.removeClass('active');
            }
        }
    });
    $(document).on('click', ".label_select_size", function () {
        $(".label_select_size").removeClass('active');
        $(this).addClass('active');
        let id = $(this).closest('.product__item').data('product-id');
        if (product_id !== id) {
            product_id = id;
            $(".product__color__select label").removeClass('active');
        }
        let parent = $(this).closest('.product__item');
        parent.find('.product__color__select label').addClass('hidden');
        let product = dataShop.find(item => item.id === id);
        let size = $(this).find('input').val();
        if (Array.isArray(product.chiTietSanPham)) {
            product.chiTietSanPham.forEach((ctsp) => {
                if (ctsp.kichCo == size) {
                    let element = parent.find('.product__color__select label').filter(function () {
                        return $(this).find('input').val() === `${ctsp.mauSac}`;
                    });
                    console.log(element)
                    element.removeClass('hidden');
                }
            })
            let ele_color = parent.find('.product__color__select label.active');
            console.log(ele_color)
            if (ele_color.length > 0 && ele_color.hasClass('hidden')) {
                ele_color.removeClass('active');
            }
        }
    });

    $(document).on('click', '.btn-add-to-cart', function () {
        let element = $(this).closest('.product__item');
        let size = element.find('.product__option__size').find('.active')
        let color = element.find('.product__color__select').find('.active')
        if (color.length === 0) {
            ToastError('Vui lòng chọn màu.')
            return;
        }
        if (size.length === 0) {
            ToastError('Vui lòng chọn size.')
            return;
        }
        if (dataShop === null && !Array.isArray(dataShop)) {
            ToastError('Dữ liệu rỗng.')
            return;
        }
        let id = element.data('product-id');
        let kichCo = size.children().val()
        let mauSac = color.children().val()
        let product = dataShop.find(item => item.id === id);
        let product_detail = null;
        for (let i = 0; i < product.chiTietSanPham.length; i++) {
            let ctsp = product.chiTietSanPham[i];
            if (ctsp.kichCo == kichCo && mauSac == ctsp.mauSac) {
                product_detail = ctsp;
                break;
            }
        }
        if (product_detail === null) {
            ToastError('Phiên bản hiện tại tạm dừng bán.');
            return;
        }
        if (Number(product_detail.soLuongTon) === 0) {
            ToastError('Phiên bản hiện tại tạm hết hàng.');
            return;
        }
        if (username !== undefined) {
            dataShopingCart = saveProductToServer(product_detail.id, 1);
            printDataInServerResponse(dataShopingCart);
        } else {
            let data = {
                pro: {
                    product_img: product_detail.anh,
                    name: product_detail.ten.toString(),
                    id: product_detail.id.toString(),
                    gia_goc: addCommasToNumber(product_detail.giaGoc).toString(),
                    gia_ban: addCommasToNumber(product_detail.giaBan).toString(),
                    detail_code: product_detail.maSanPham.toString(),
                    de_giay: '',
                    color_name: product_detail.tenMau.toString(),
                    color_code: product_detail.mauSac.toString(),
                    size: product_detail.kichCo.toString(),
                    co_giay: '',
                    chat_lieu: '',
                    so_luong_ton: product_detail.soLuongTon.toString(),
                },
                quantity: '1'
            };
            console.log(data);
            let check = pushDataToArray(data);
            if (check) {
                ToastSuccess('Thêm thành công.');
                $('#list_product_items_cart').empty();
                printProductwithStartup();
            }
        }
    });
    /*-------------------

		Scroll
	--------------------- */
    $(".nice-scroll").niceScroll({
        cursorcolor: "#0d0d0d",
        cursorwidth: "5px",
        background: "#e5e5e5",
        cursorborder: "",
        autohidemode: true,
        horizrailenabled: false
    });

    /*------------------
        CountDown
    --------------------*/
    // For demo preview start
    let CountDown = $("#countdown");
    let times = CountDown.data('time');
    let today = new Date(times);
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth()).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    if (mm == 12) {
        mm = '01';
        yyyy = yyyy + 1;
    } else {
        mm = parseInt(mm) + 1;
        mm = String(mm).padStart(2, '0');
    }
    let timerdate = mm + '/' + dd + '/' + yyyy;
    // For demo preview end


    // Uncomment below and use your date //

    /* var timerdate = "2020/12/30" */

    CountDown.countdown(timerdate, function (event) {
        $(this).html(event.strftime("<div class='cd-item'><span>%D</span> <p>Ngày</p> </div>" + "<div class='cd-item'><span>%H</span> <p>Giờ</p> </div>" + "<div class='cd-item'><span>%M</span> <p>Phút</p> </div>" + "<div class='cd-item'><span>%S</span> <p>Giây</p> </div>"));
    });

    /*------------------
		Magnific
	--------------------*/
    $('.video-popup').magnificPopup({
        type: 'iframe'
    });

    /*-------------------
		Quantity change
	--------------------- */


    // var proQty = $('.pro-qty-2');
    // proQty.prepend('<span class="fa fa-angle-left dec qtybtn"></span>');
    // proQty.append('<span class="fa fa-angle-right inc qtybtn"></span>');
    // proQty.on('click', '.qtybtn', function () {
    //     var $button = $(this);
    //     var oldValue = $button.parent().find('input').val();
    //     if ($button.hasClass('inc')) {
    //         var newVal = parseFloat(oldValue) + 1;
    //     } else {
    //         // Don't allow decrementing below zero
    //         if (oldValue > 0) {
    //             var newVal = parseFloat(oldValue) - 1;
    //         } else {
    //             newVal = 0;
    //         }
    //     }
    //     $button.parent().find('input').val(newVal);
    // });

    /*------------------
        Achieve Counter
    --------------------*/
    $('.cn_num').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 4000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });

})(jQuery);

function setTabsHeader(tab) {
    $('.tabsheader').each(function () {
        var t = $(this).attr('data-web');
        $(this).removeClass("active");
        if (tab == t) {
            $(this).addClass("active");
        }
    });
}

//kiểm tra form đăng ký
$(document).ready(function () {
    var delayTimer;

    function kiemTraMatKhau() {
        var matKhau = $('#password').val();
        var nhapLaiMatKhau = $('#repassword').val();
        if (matKhau.length === 0) {
            $('#txt_error_mk').text('Vui lòng nhập mật khẩu.');
            return false;
        } else {
            $('#txt_error_mk2').remove();
            $('#txt_error_mk').text('');
        }
        if (matKhau === nhapLaiMatKhau && matKhau !== '') {
            // Báo trùng khớp
            $('#txt_nhạp_lai_mk').removeClass("text-danger").addClass("text-success").text('Mật khẩu trùng khớp.');
            return true;
        } else {
            // Báo không trùng khớp
            $('#txt_nhạp_lai_mk').removeClass("text-success").addClass("text-danger").text('Mật khẩu không trùng khớp.');
            return false;
        }
    }

    function kiemTraSDT() {
        var sdt = $('#sdt').val();
        var regexSDT = /^(84|0|\+84)\d{9}$/;
        if (sdt.length === 0) {
            $('#txt_error_sdt').text('Vui lòng nhập số điện thoại.');
            return false;
        } else if (!regexSDT.test(sdt)) {
            $('#txt_error_sdt').text('Số điện thoại không đúng định dạng.');
            return false;
        } else {
            $('#txt_error_sdt').text('');
        }
        return true;
    }

    function kiemTraHo() {
        var ho = $('#ho').val();
        if (ho.length === 0) {
            $('#txt_error_ho').text('Vui lòng nhập họ.');
            return false;
        } else {
            $('#txt_error_ho').text('');
        }
        return true;
    }

    function kiemTraTenDem() {
        var ho = $('#tenDem').val();
        if (ho.length === 0) {
            $('#txt_error_tendem').text('Vui lòng nhập tên đệm.');
            return false;
        } else {
            $('#txt_error_tendem').text('');
        }
        return true;
    }

    function kiemTraTen() {
        var ho = $('#ten').val();
        if (ho.length === 0) {
            $('#txt_error_ten').text('Vui lòng nhập tên.');
            return false;
        } else {
            $('#txt_error_ten').text('');
        }
        return true;
    }

    function kiemTraEmail() {
        var email = $('#email').val();
        var regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (email.length === 0) {
            $('#txt_error_email').text('Vui lòng nhập email.');
            return false;
        } else if (!regexEmail.test(email)) {
            $('#txt_error_email').text('Email không đúng định dạng.');
            return false;
        } else {
            $('#txt_error_email').text('');
        }
        return true;
    }

    function kiemTraNgaySinh() {
        var ngaySinh = $('#ngaySinh').val();
        console.log(ngaySinh)
        var regexNgaySinh = /^(19|20)\d\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
        if (ngaySinh.length === 0) {
            $('#txt_error_ngaysinh').text('Vui lòng chọn ngày sinh.');
            return false;
        } else if (!regexNgaySinh.test(ngaySinh)) {
            $('#txt_error_ngaysinh').text('Ngày sinh không đúng định dạng.');
            return false;
        } else {
            $('#txt_error_ngaysinh').text('');
            return true;
        }
    }

    function kiemTraGioiTinh() {
        if ($('input[name="gioiTinh"]:checked').length > 0) {
            $('#txt_error_gioitinh').text('');
            return true;
        } else {
            $('#txt_error_gioitinh').text('Vui lòng chọn giới tính.');
            return false;
        }
    }

// Thêm sự kiện kiểm tra khi người dùng thay đổi lựa chọn giới tính
    $('input[name="gioiTinh"]').on('change', function () {
        kiemTraGioiTinh();
    });

// Thêm sự kiện kiểm tra khi người dùng nhập vào trường ngày sinh
    $('#ngaySinh').on('change', function () {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(kiemTraNgaySinh, 300); // Độ trễ 300 mili giây
    });
    $('#ho').on('keyup', function () {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(kiemTraHo, 300); // Độ trễ 300 mili giây
    });
    $('#tenDem').on('keyup', function () {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(kiemTraTenDem, 300); // Độ trễ 300 mili giây
    });
    $('#ten').on('keyup', function () {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(kiemTraTen, 300); // Độ trễ 300 mili giây
    });
    $('#email').on('keyup', function () {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(kiemTraEmail, 300); // Độ trễ 300 mili giây
    });
    $('#sdt').on('keyup', function () {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(kiemTraSDT, 300); // Độ trễ 300 mili giây
    });
    $('#password, #repassword').on('keyup', function () {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(kiemTraMatKhau, 300); // Độ trễ 300 mili giây
    });
    $('#form-register').on('submit', function (e) {
        if (!kiemTraHo() || !kiemTraTenDem() || !kiemTraTen() || !kiemTraNgaySinh() || !kiemTraGioiTinh() || !kiemTraEmail() || !kiemTraSDT() || !kiemTraMatKhau()) {
            e.preventDefault(); // Ngăn không cho form được submit
        }
    });
});


//kiểm tra email , password đăng nhập
$(document).ready(function () {
    var delayTimer;
    $('#email').on('keyup', function () {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(function () {
            var email = $('#email').val();
            var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (emailRegex.test(email)) {
                $('#text_error_email').text('');
            } else {
                $('#text_error_email').text('Email không đúng định dạng.');
            }
            if (email.length === 0) {
                $('#text_error_email').text('Vui lòng nhập email.');
            } else {
                let text_df = $('#text_email_default');
                if (text_df.length > 0) {
                    text_df.text('');
                }
            }
        }, 300); // Độ trễ 300 mili giây
    });
});

$(document).ready(function () {
    $('#form-login').on('submit', function (e) {
        var email = $('#email').val();
        var password = $('#password').val();
        var errorMessages = true;
        if (email === '') {
            $('#text_error_email').text('Email không được để trống !')
            errorMessages = false;
        }
        if (password === '') {
            $('#txt_error_password').text('Mật khẩu không được để trống !')
            errorMessages = false;
        }
        if (errorMessages === false) {
            e.preventDefault(); // Dừng submit form
        }
    });
});
