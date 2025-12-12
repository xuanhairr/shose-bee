var displayNumShow = 9;
var NumAddShowDisplay = 6;

function reGetImgError(element) {
    element.onerror = function () {
        let originalSrc = this.src;
        this.src = originalSrc;
    };
}

function printAllData() {
    let arr = [];
    $('.product__item').each((index, element) => {
        arr.push($(element).data('product-id'));
    })
    dataShop.forEach((product) => {
        let bool = true;
        for (let i = 0; i < arr.length; i++) {
            if (product.id == arr[i]) {
                bool = false;
            }
        }
        let min_price = 0;
        let max_price = 0;
        for (let i = 0; i < product.chiTietSanPham.length; i++) {
            let ctsp = product.chiTietSanPham[i];
            if (i === 0) {
                min_price = ctsp.giaBan;
                max_price = ctsp.giaGoc;
            } else {
                if (min_price > ctsp.giaBan) {
                    min_price = ctsp.giaBan;
                }
                if (max_price < ctsp.giaGoc) {
                    max_price = ctsp.giaGoc;
                }
            }
        }

        product.max_price = max_price;
        product.min_price = min_price;
        if (bool) {
            let url = ''
            for (let i = 0; i < product.anh.length; i++) {
                if (product.anh[i].main) {
                    url = product.anh[i].url;
                    break;
                }
            }
            min_price = addCommasToNumber(min_price);
            max_price = addCommasToNumber(max_price);
            let color = '';
            for (let i = 0; i < product.maMauSac.length; i++) {
                color += `<label style="background-color:${product.maMauSac[i]}">
                             <input type="radio" id="" value="${product.maMauSac[i]}">
                        </label>`;
            }
            let size = '';
            for (let i = 0; i < product.kichCo.length; i++) {
                size += `<label class="label_select_size mr-3p" for="size_id_${product.kichCo[i].id + '_' + product.id}">
                             ${product.kichCo[i].ten}
                           <input class="size_selected" name="kichthuoc1" value="${product.kichCo[i].ten}" type="radio" id="size_id_${product.kichCo[i].id + '_' + product.id}" value="${product.id}" data-id-size="${product.id}">
                        </label>`
            }
            let sales = '';
            if (product.sale) {
                sales = '<span class="label">SALE</span>'
            }
            let html = `<div class="col-lg-4 col-md-6 col-sm-6 product_wraper mix fadeOut">
                        <div class="product__item sale" data-product-id="${product.id}">
                                <div class="product__item__pic set-bg susor-pointer" data-setbg="${url}" data-href="/shop-detail?product=${product.id}" style="background-image: url('${url}');">
                                <img class="img-main-product" src="${url}" alt="">
                                    ${sales}
                                    <ul class="product__hover">
                                        <li><a href="javascript:;"><img src="/assets/customer/img/icon/heart.png" alt=""></a>
                                        </li>
                                        <li><a class="btn-add-to-cart" href="javascript:;"><img src="/assets/customer/img/icon/shopping-cart-add.svg" alt=""></a></li>
                                        <li><a href="/shop-detail?product=${product.id}"><img src="/assets/customer/img/icon/eye.svg" alt=""></a></li>
                                    </ul>
                                </div>
                            <div class="product__item__text">
                                <h6 class="product_name">${product.ten}</h6>
                                <a href="/shop-detail?product=${product.id}" class="add-cart">Mua Ngay</a>
                                    <div class="rating">
                                        <h6 class="giaGoc">${max_price}đ</h6>
                                    </div>
                                    <h5>${min_price}đ</h5>
                                <div class="product__option__size">
                                        ${size}
                                </div>
                                <div class="product__color__select">
                                ${color}
                                </div>
                            </div>
                        </div>
                    </div>`;
            $('#list_product_items').append(html);
        }
    })
}

function convertToLowerCase(inputString) {
    return inputString.toLowerCase();
}


let selected_color = '';
let selected_tags = '';
let selected_price = '';
let selected_brand = '';
let selected_size = '';
let selected_cate = '';
let search_data = '';
let fillter_price = '';
$(document).ready(function () {
    $('#selected_filter_price').on('change', function () {
        fillter_price = $(this).val()
        fillterdata(dataShop)
    })
    $(document).on('click', '.select_color', function () {
        if ($(this).closest('.label_select_color').hasClass('activeSelected')) {
            $(this).closest('.label_select_color').removeClass('activeSelected');
            selected_color = '';
        } else {
            $('.select_color').closest('.label_select_color').removeClass('activeSelected');
            $(this).closest('.label_select_color').addClass('activeSelected');
            selected_color = $(this).closest('.label_select_color').data('id')
        }
        fillterdata(dataShop)
    });
    // $(document).on('click', '.product__item__pic', function () {
    //     let url = $(this).data('href');
    //     window.location.href = url;
    // })
    $('.selected_tags').on('click', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            selected_tags = '';
        } else {
            $('.selected_tags').removeClass('active');
            $(this).addClass('active');
            selected_tags = $(this).data('id')
        }
        fillterdata(dataShop)
    });
    $('.selected_price').on('click', function () {
        if ($(this).hasClass('active')) {
            selected_price = '';
            $(this).removeClass('active');
        } else {
            $('.selected_price').removeClass('active');
            $(this).addClass('active');
            selected_price = $(this).data('id')
        }
        fillterdata(dataShop)
    });
    let typingTimer;
    const doneTypingInterval = 500;

    $('#form-search-product').on('input', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function () {
            search_data = $('#form-search-product').val();
            fillterdata(dataShop);
        }, doneTypingInterval);
    });

    $('.selected_size').on('click', function () {
        if ($(this).hasClass('active')) {
            selected_size = '';
            $(this).removeClass('active');
        } else {
            $('.selected_size').removeClass('active')
            $(this).addClass('active')
            selected_size = $(this).data('id')
        }
        fillterdata(dataShop)
    });

    $('.selected_brand').on('click', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            selected_brand = '';
        } else {
            $('.selected_brand').removeClass('active');
            $(this).addClass('active');
            selected_brand = $(this).data('id')
        }
        fillterdata(dataShop)
    });
    $('.selected_cate').on('click', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            selected_cate = '';
        } else {
            $('.selected_cate').removeClass('active');
            $(this).addClass('active');
            selected_cate = $(this).data('id')
        }
        fillterdata(dataShop)
    });

    function sortAndUpdateProducts(data) {
        if (fillter_price === 'cao-den-thap') {
            data.sort((a, b) => b.min_price - a.min_price);
        } else if (fillter_price === 'thap-den-cao') {
            data.sort((a, b) => a.min_price - b.min_price);
        }

        // Sắp xếp lại thứ tự các phần tử hiện có trong container
        const $listProductItems = $('#list_product_items');
        const $products = $listProductItems.children('.product_wraper');
        data.forEach((product, index) => {
            const $productWrapper = $listProductItems.find(`.product__item[data-product-id="${product.id}"]`).closest('.product_wraper');
            $productWrapper.detach().appendTo($listProductItems);
        });
    }

    function fillterdata(originalData) {
        let data = originalData.slice(); // Sao chép dữ liệu gốc để thực hiện lọc

        sortAndUpdateProducts(data);
        let showNum = 0;
        // Lặp qua từng sản phẩm để kiểm tra xem có phù hợp với tất cả các điều kiện lọc không
        data.forEach(item => {
            let shouldDisplay = true; // Giả sử sản phẩm phù hợp với tất cả các điều kiện lọc ban đầu
            // Kiểm tra các điều kiện lọc và cập nhật biến shouldDisplay nếu cần
            let name = convertToLowerCase(item.ten);
            if (search_data && !name.includes(convertToLowerCase(search_data))) {
                shouldDisplay = false;
            }
            if (selected_color && !item.maMauSac.includes(selected_color)) {
                shouldDisplay = false;
            }
            if (selected_size && !item.kichCo.find(size => size.ten === `${selected_size}`)) {
                shouldDisplay = false;
            }
            if (selected_cate && item.theLoai !== selected_cate) {
                shouldDisplay = false;
            }
            if (selected_price) {
                let [from, to] = selected_price.split('->').map(parseFloat);
                if (item.min_price < from || item.min_price > to) {
                    shouldDisplay = false;
                }
            }
            if (selected_brand && item.thuongHieu !== selected_brand) {
                shouldDisplay = false;
            }
            if (selected_tags && !item.tags.includes(selected_tags)) {
                shouldDisplay = false;
            }

            // Hiển thị hoặc ẩn sản phẩm tùy thuộc vào biến shouldDisplay
            const $productWrapper = $(`.product__item[data-product-id="${item.id}"]`).closest('.product_wraper');
            if (!$productWrapper.hasClass('mix')) {
                $productWrapper.addClass('mix');
            }

            if (shouldDisplay) {
                if (showNum < displayNumShow) {
                    const ishave = $productWrapper.hasClass('fadeOut')
                    if (ishave) {
                        $productWrapper.removeClass('fadeOut col-lg-4 col-md-6 col-sm-6').addClass('fadeIn');
                        $($productWrapper).on('animationend', function () {
                            $(this).removeClass('fadeIn')
                            $(this).addClass('col-lg-4 col-md-6 col-sm-6')
                        })
                    }
                    showNum++;
                } else {
                    $productWrapper.removeClass('fadeIn').addClass('fadeOut');
                }
            } else {
                const ishave = $productWrapper.hasClass('fadeOut')
                if (!ishave) {
                    $productWrapper.removeClass('mix col-lg-4 col-md-6 col-sm-6').addClass('fadeOut');
                    $($productWrapper).on('animationend', function () {
                        $(this).addClass('mix col-lg-4 col-md-6 col-sm-6');
                    })
                }
            }
        });
        $('#total-num-show').text(showNum);
        if (showNum < displayNumShow) {
            $('#btn-load-more-product').addClass('d-none')
        } else {
            $('#btn-load-more-product').removeClass('d-none')
        }
        // console.log('=======================')
        // console.log(selected_color)
        // console.log(selected_price)
        // console.log(selected_cate)
        // console.log(selected_size)
        // console.log(selected_brand)
        // console.log(selected_tags)
        // console.log(fillter_price)
    }

    $('#btn-load-more-product').on('click', function () {
        showLoader();
        displayNumShow += NumAddShowDisplay;
        fillterdata(dataShop);
        closeLoader();
    })
// Hàm này cần được gọi lần đầu tiên để lưu trữ dữ liệu gốc
})
