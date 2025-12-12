function printHtmlToCart(product, quantity, totalMoney) {
    console.log(product)
    let element = $('#list_product_items_cart').find(`div.cart_product_item[data-id-product="${product.id}"]`);
    if (element.length === 1) {
        let num = element.find(`#quantyti_${product.id}`).text().replace('SL:', '')
        let allNum = Number(num) + Number(quantity);
        console.log(allNum)
        element.find(`#quantyti_${product.id}`).text('SL:' + allNum)
    } else {
        let html = `
    <div class="cart_product_item row" data-id-product="${product.id}">
        <div class="thumb col-3">
            <img src="${product.product_img}" alt="product img">
        </div>
        <div class="cart_content col-9 ">
            <h5 class="title col-12 w_100">${product.name}</h5>
            <div class="product_quantity col-12 w_100 mt-1 " >
                <label class="mb-0" id="quantyti_${product.id}" >SL:${quantity}</label>
            </div>
            <div class="col-12 height-mid">
                <label class="small mb-0">MS:${product.color_name}</label>
                <label class="small mb-0">KT:${product.size}</label>
            </div>
            <h6 class="product_price col-sm-12 w_100">${product.gia_ban}đ</h6>
            <a class="cart_trash" data-id-delete="${product.id}"><i class="fa fa-trash"></i></a>
        </div>
    </div>
    `;
        $('#list_product_items_cart').append(html);
    }
    $('#total-money-cart').text(totalMoney);
}

function removeNonNumericCharacters(str) {
    return str.toString().replace(/\D/g, '');
}

$(document).ready(function () {
    let data_product_details = [];

    $(document).on('click', ".product__details__option__size label", function () {
        $(".product__details__option__size label").removeClass('active');
        $(this).addClass('active');
        let size = $(this).find('input').val();
        let parent = $(this).closest('.product__details__option');
        parent.find('.product__details__option__color label').addClass('hidden');
        if (Array.isArray(data_product_details)) {
            data_product_details.forEach((item) => {
                if (size == item.size) {
                    let element = parent.find('.product__details__option__color .label_select_color .select_color').filter(function () {
                        return $(this).val() == item.color_code;
                    })
                    element.closest('label.label_select_color').removeClass('hidden');
                }
            })
            let ele_size = parent.find('.product__details__option__color label.activeSelected');
            if (ele_size.length > 0 && ele_size.hasClass('hidden')) {
                ele_size.removeClass('activeSelected');
                ele_size.find('input').prop('checked', false);
            }
        }
    });

    $('.select_color').on('change', function () {
        $('.select_color').closest('.label_select_color').removeClass('activeSelected')
        $(this).closest('.label_select_color').addClass('activeSelected');
        let color = $(this).val();
        let parent = $(this).closest('.product__details__option');
        parent.find('.product__details__option__size label').addClass('hidden');
        if (Array.isArray(data_product_details)) {
            data_product_details.forEach((item) => {
                if (color == item.color_code) {
                    let element = parent.find('.product__details__option__size label input.size_selected').filter(function () {
                        return Number($(this).val()) === Number(item.size);
                    })
                    element.closest('label').removeClass('hidden');
                }
            })
            let ele_size = parent.find('.product__details__option__size label.active');
            if (ele_size.length > 0 && ele_size.hasClass('hidden')) {
                ele_size.removeClass('active');
                ele_size.find('input').prop('checked', false);
            }
        }
    })

    $('#quantity-selected').inputmask({
        mask: '9',
        repeat: 2,
        greedy: false,
        numericInput: true,
        placeholder: '',
        showMaskOnFocus: false,
        showMaskOnHover: false,
        min: 1,
    });

    // Khi click vào ảnh
    $('#openFancybox').click(function () {
        // Lấy danh sách ảnh từ tất cả các phần tử có thuộc tính data-setbg
        var imageList = $('.product__thumb__pic').map(function () {
            return {
                src: $(this).data('setbg'),
                opts: {
                    caption: $(this).parent().attr('data-caption') // Lấy chú thích nếu có
                }
            };
        }).get();
        // Hiển thị danh sách ảnh trong Fancybox
        $.fancybox.open(imageList, {
            // Các tùy chọn của Fancybox ở đây
            buttons: [
                'close',
                'zoom'
            ],
            wheel: false,
            transitionEffect: "slide",
            thumbs: false,
            // hash: false,
            loop: true,
            // keyboard: true,
            toolbar: false,
            // animationEffect: false,
            arrows: true,
            clickContent: false
        });
    });

    let proQty = $('.pro-qty');
    proQty.prepend('<span class="fa fa-angle-up dec qtybtn"></span>');
    proQty.append('<span class="fa fa-angle-down inc qtybtn"></span>');
    proQty.on('click', '.qtybtn', function () {
        let $button = $(this);
        let oldValue = parseFloat($button.parent().find('input').val());
        let newVal;
        if ($button.hasClass('inc')) {
            newVal = oldValue - 1;
        } else {
            newVal = oldValue + 1;
        }
        newVal = Math.max(newVal, 1);
        if (isNaN(newVal)) {
            newVal = 1;
        }
        $button.parent().find('input').val(newVal);
    });

    $('#table-data tbody tr').each(function () {
        var obj = {};
        $(this).find('td').each(function () {
            let propertyName = $(this).data('name');
            let propertyValue = $(this).text();
            obj[propertyName] = propertyValue;
        });
        data_product_details.push(obj);
    });
    console.log(data_product_details)

    let getItems = getProductInLocalStorage();
    let data_cart = [];
    if (getItems !== null) {
        data_cart = getItems;
    }


    $('input[name="kichthuoc"], input[name="color"]').on('change', function () {
        var kichThuoc = $('input[name="kichthuoc"]:checked').val();
        var color = $('input[name="color"]:checked').val();
        console.log("kích thước :" + kichThuoc)
        console.log("color :" + color)
        if (color === undefined || kichThuoc === undefined) {
            return;
        }
        for (let i = 0; i < data_product_details.length; i++) {
            let product = data_product_details[i];
            if (product.size == kichThuoc && product.color_code == color) {
                console.log(product);
                let giaBan = removeNonNumericCharacters(product.gia_ban)
                let giaGoc = removeNonNumericCharacters(product.gia_goc)
                if (Number(giaBan) >= Number(giaGoc)) {
                    $('#show-price').html(`${product.gia_ban}đ`)
                } else {
                    $('#show-price').html(`${product.gia_ban}đ <span>${product.gia_goc}đ</span>`)
                }
                $('#product-sku').html(`<span>SKU:</span> ${product.detail_code}`);

                $('#total-num-product').html(`Số lượng mẫu : ${Number(product.so_luong_ton) === 0 ? 'TẠM HẾT HÀNG' : product.so_luong_ton}`);
            }

        }
    });
    $('#add-to-cart').on('click', function () {
        data_cart = JSON.parse(localStorage.getItem('shopping_carts'));
        let quantity = $('#quantity-selected').val();

        if (quantity < 1) {
            ToastError('Vui lòng nhập số lượng !');
            $('#quantity-selected').focus();
            return;
        }
        let kichThuoc = $('input[name="kichthuoc"]:checked').val();
        let color = $('input[name="color"]:checked').val();
        if (kichThuoc === undefined || color === undefined) {
            ToastError('Vui lòng chọn Màu Sắc và Kích Cỡ.');
            return;
        }
        let find = false;
        for (let i = 0; i < data_product_details.length; i++) {
            let product = data_product_details[i];
            if (product.size == kichThuoc && product.color_code == color) {
                find = true;
                if (Number(product.so_luong_ton) === 0) {
                    ToastError('Phiên bản hiện tại tạm hết hàng.')
                    break;
                }
                if (Number(quantity) > Number(product.so_luong_ton)) {
                    ToastError('Số lượng vượt quá số lượng tồn.')
                    break;
                }
                if (username === undefined) {
                    let check = pushDataToArray({pro: product, quantity: quantity})
                    if (check) {
                        let total = 0;
                        data_cart = getProductInLocalStorage();
                        data_cart.forEach((data) => {
                            total += extractNumberFromString(data.pro.gia_ban) * data.quantity;
                        })
                        total = addCommasToNumber(total);
                        ToastSuccess('Thêm thành công.');
                        printHtmlToCart(product, quantity, total + 'đ')
                        $('#quantity__item_carts').text(data_cart.length);
                        break;
                    }
                } else {
                    dataShopingCart = saveProductToServer(product.id, quantity)
                }

            }
        }
        if (!find) {
            ToastError('Phiên bản không tồn tại.')
        }
    });

    $('#btn-buy-product').on('click', function () {
        let quantity = $('#quantity-selected').val();

        if (quantity < 1) {
            ToastError('Vui lòng nhập số lượng !');
            $('#quantity-selected').focus();
            return;
        }
        let kichThuoc = $('input[name="kichthuoc"]:checked').val();
        let color = $('input[name="color"]:checked').val();
        if (kichThuoc === undefined || color === undefined) {
            ToastError('Vui lòng chọn Màu Sắc và Kích Cỡ.');
            return;
        }
        for (let i = 0; i < data_product_details.length; i++) {
            let product = data_product_details[i];
            if (product.size == kichThuoc && product.color_code == color) {
                if (Number(product.so_luong_ton) === 0) {
                    ToastError('Phiên bản hiện tại tạm hết hàng.')
                    return;
                }
                if (Number(quantity) > Number(product.so_luong_ton)) {
                    ToastError('Số lượng vượt quá số lượng tồn.')
                    return;
                }

                let Data = {
                    quantity: quantity,
                    id_product_detail: product.id
                }
                let jsonData = [Data]
                let form = $('<form>', {
                    action: '/checkout',
                    method: 'POST',
                    style: 'display: none;'

                });
                $('<input>').attr({
                    type: 'hidden',
                    name: 'listData',
                    value: JSON.stringify(jsonData)
                }).appendTo(form);
                $('<input>').attr({
                    type: 'hidden',
                    name: 'maGiamGia',
                    value: ''
                }).appendTo(form);
                form.appendTo('body');
                form.submit();
            }
        }
    });
});
