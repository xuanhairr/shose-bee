setTabsHeader('pages');
let provinceName, districtName, wardName;
let provinceId, districtId, wardCode;
let provinceArr, districtArr, wardArr;
let province = $('#tinhTP');
printAddress();

function printAddress() {
    $.ajax({
        type: "GET",
        url: "/assets/address-json/province.json",
        contentType: "application/json",
        success: function (response) {
            provinceArr = response;
            console.log(response)
            province.html('<option value="">Chọn Tỉnh/TP</option>');
            $.each(response, function (index, item) {
                let html = `<option value="${item.ProvinceID}">${String(item.ProvinceName)}</option>`;
                province.append(html);
            });
            province.niceSelect('update');
        },
        error: function (error) {
            console.error('Xảy ra lỗi: ', error);
        }
    });

    $.ajax({
        type: "GET",
        url: "/assets/address-json/district.json",
        contentType: "application/json",
        success: function (response) {
            districtArr = response;
        },
        error: function (error) {
            console.error('Xảy ra lỗi: ', error);
        }
    });

    $.ajax({
        type: "GET",
        url: "/assets/address-json/ward.json",
        contentType: "application/json",
        success: function (response) {
            wardArr = response;
        },
        error: function (error) {
            console.error('Xảy ra lỗi: ', error);
        }
    })
}

function convertPhoneNumber(phoneNumber) {
    if (isNaN(phoneNumber)) {
        return "Số điện thoại không hợp lệ";
    }
    let firstPart = phoneNumber.substring(0, 3);
    let lastPart = phoneNumber.substring(7);
    let middlePart = "****";
    return firstPart + middlePart + lastPart;
}

function extracAddress(str) {
    let parts = str.toString().split(',');
    parts.reverse();
    let thanhPhoTinh = parts.shift().trim(); // Thành phố/tỉnh
    let quanHuyen = parts.shift().trim(); // Quận/huyện
    let phuongXa = parts.shift().trim(); // Phường/xã
    parts.reverse()
    let soNha = parts.join(',');
    return {quanHuyen: quanHuyen, phuongXa: phuongXa, tinhTP: thanhPhoTinh, soNha: soNha}
}

function getAddressInArray(nameTinh, nameHyen, nameXa) {
    let quanHuyenSelected;
    let phuongXaSelected;
    let tinh = provinceArr.find(tinh => tinh.ProvinceName == nameTinh);
    if (tinh) {
        let huyen = districtArr.find(huyen => huyen.ProvinceID == tinh.ProvinceID && huyen.DistrictName == nameHyen);
        if (huyen) {
            quanHuyenSelected = huyen
            let xa = wardArr.find(xa => xa.DistrictID == huyen.DistrictID && xa.Name == nameXa);
            if (xa) {
                phuongXaSelected = xa
            }
        }
    }
    return {tinh: tinh, quanHuyen: quanHuyenSelected, phuongXa: phuongXaSelected}
}

async function getShippingFee(quantity) {
    let addres = extracAddress($('#invAddress').text())
    let formad = getAddressInArray(addres.tinhTP, addres.quanHuyen, addres.phuongXa)
    let wei = 500 * Number(quantity);
    try {
        const response = await new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create",
                contentType: "application/json",
                headers: {
                    "Token": "68b8b44f-a88d-11ee-8bfa-8a2dda8ec551"
                },
                data: JSON.stringify(
                    {
                        shop_id: "190713",
                        from_name: "LightBee Shop",
                        from_phone: "0359966461",
                        from_address: "Trường Cao Đẳng FPT Polytechnic",
                        from_ward_name: "Phường Xuân Phương",
                        from_district_name: "Nam Từ Liêm",
                        from_province_name: "Hà Nội",
                        to_name: "test",
                        to_phone: "0359966461",
                        to_address: "Nam Đinh",
                        to_ward_code: formad.phuongXa.Code,
                        to_district_id: formad.quanHuyen.DistrictID,
                        service_id: 55320,
                        service_type_id: 2,
                        payment_type_id: 2,
                        cod_amount: parseInt(200000),
                        required_note: "CHOXEMHANGKHONGTHU",
                        items: [
                            {
                                name: "Áo Polo",
                                code: "Polo123",
                                quantity: 1,
                                price: 200000,
                                length: 12,
                                width: 12,
                                height: 12,
                                weight: 1200,
                                category:
                                    {
                                        level1: "Áo"
                                    }
                            }
                        ],
                        weight: wei,
                        length: 1,
                        width: 19,
                        height: 10
                    }
                ),
                success: function (response) {
                    resolve(response);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
        return response;
    } catch (error) {
        console.error('Xảy ra lỗi: ', error);
        ToastError('Không hỗ trợ giao');
        return null;
    }
}

async function updateShippingFee(id, shippingFee) {
    try {
        const response = await new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/hoa-don/update-shipping-fee',
                type: 'POST',
                data: {
                    id: id,
                    shippingfee: shippingFee,
                },
                success: function (data) {
                    console.log(data)
                    resolve(data)
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(xhr)
                    reject(errorThrown)
                }
            })
        })
        return response;
    } catch (error) {
        console.log(error);
    }
}

function printHistory(times, message) {
    let element = document.getElementById('history-oder');
    let firstChild = element.firstChild;
    let div = document.createElement('div');
    div.className = 'w-100 row justify-content-center';
    let ht = `
                    <div class="col-3 times">
                        ${formatServerTime(times)}
                    </div>
                    <div class="col-9 actions">
                        ${message}
                    </div>`;
    div.innerHTML = ht;
    element.insertBefore(div, firstChild);
    let hr = document.createElement('hr');
    div.insertAdjacentElement('afterend', hr);
}

function UpdateQuantity(id, calcu, num) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/hoa-don/update-quantity',
            type: 'POST',
            data: {
                id: id,
                calcu: calcu,
                num: num
            }, success: async function (data) {
                console.log(data);
                printHistory(data[0].times, data[0].message)
                $('#total-money').text(addCommasToNumber(data[0].tongTien) + 'đ')
                $('#shipping-money').text(Number(data[0].phiShip) > 1 ? addCommasToNumber(data[0].phiShip) + 'đ' : 'Miễn Phí');
                $('#payment-money').text(addCommasToNumber(data[0].thucThu) + 'đ')
                $('#discount-money').text(addCommasToNumber(data[0].giamGia == null ? 0 : data[0].giamGia) + 'đ')
                let count = 0;
                for (let i = 0; i < data.length; i++) {
                    count += Number(data[i].soLuong);
                    let wrapper = $(`#product-detail-${data[i].idHDCT}`);
                    if (wrapper.length === 0) {
                        let html = `
                        <li class="row" data-id-hdct="${data[i].idHDCT}">
                            <div class="col-2 p-0">
                                <img class="product_img" src="${data[i].img}">
                            </div>
                            <div id="product-detail-${data[i].idHDCT}" class="content_product p-0 col-6">
                                <div>
                                    <h6 class="product_name mb-2">${data[i].ten}</h6>
                                    <div class="w-100">
                                        Màu :<label>${data[i].tenMau}</label>,
                                        Kích Cỡ :<label>${data[i].kichCo}</label>
                                    </div>
                                    <label class="quantity-product">Số Lượng :${data[i].soLuong}</label>
                                    <div class="pro-qty"><span class="fa fa-angle-up dec qtybtn"></span>
                                       <input class="input-quantity" id="quantity-selected-${data[i].idHDCT}" type="text" value="${data[i].soLuong}" readonly>
                                                <span class="fa fa-angle-down inc qtybtn"></span>
                                                </div>
                                </div>
                            </div>
                            <div class="col-3 d-flex align-items-center">
                                <h5 class="product_price_cu">${addCommasToNumber(data[i].giaGoc)}đ</h5>
                                <h5 class="product_price">${addCommasToNumber(data[i].giaBan)}đ</h5>
                            </div>
                            <div class="col-1 align-items-center btn-del-group d-flex">
                                <button class="btn-delete" data-toggle="tooltip" title="Xóa Sản Phẩm" data-id-hdct="${data[i].idHDCT}">
                                    <i class="fa fa-close"></i>
                                </button>
                            </div>
                        </li>`;
                        $('#show-all-product').append(html);
                    } else {
                        wrapper.find(`input.input-quantity`).val(data[i].soLuong);
                        console.log(wrapper.find(`input.input-quantity`))
                        wrapper.find('label.quantity-product').text(`Số Lượng :${data[i].soLuong}`);
                    }
                }
                ToastSuccess('Lưu thành công.');
                if (Number(data[0].tongTien) < 2000000) {
                    let response = await getShippingFee(count);
                    let idHD = data[0].idHD;
                    let total_fee = response.data.total_fee;
                    let newTotal = await updateShippingFee(idHD, total_fee)
                    $('#shipping-money').text(Number(newTotal.shippingfee) > 1 ? addCommasToNumber(newTotal.shippingfee) + 'đ' : 'Miễn Phí');
                    $('#payment-money').text(addCommasToNumber(newTotal.thucThu) + 'đ');
                }
                resolve(data);
            }, error: function (xhr) {
                console.log(xhr.getResponseHeader('status'));
                switch (xhr.getResponseHeader('status')) {
                    case 'NotAuth':
                        ToastError('Vui lòng đăng nhập.')
                        break;
                    case 'maxMoney':
                        ToastError('Tổng tiền quá lớn cho đơn online.')
                        break;
                    case 'HDCTisNull':
                        ToastError('Vui lòng chọn lại sản phẩm.')
                        break;
                    case 'NotAcceptStatus':
                        ToastError('Trạng thái hiện không thể sửa.')
                        break;
                    case 'minQuantity':
                        ToastError('Số lượng không được nhỏ hơn 0.')
                        break;
                    case 'maxQuantity':
                        ToastError('Số lượng lớn hơn số lượng tồn.')
                        break;
                    default:
                        ToastError('Lỗi.');
                }
                resolve(null);
            }
        })
    })
}

$(document).ready(function () {
    let district = $('#quanHuyen');
    let ward = $('#phuongXa');
    province.on('change', function () {
        district.html('<option value="">Quận/Huyện</option>');
        ward.html('<option value="">Phường/Xã</option>');
        provinceId = province.val();
        provinceName = province.find('option:selected').text();
        districtArr.forEach(function (item) {
            if (item.ProvinceID == provinceId) {
                let html = `<option value="${item.DistrictID}">${String(item.DistrictName)}</option>`;
                district.append(html);
            }
        })
        district.niceSelect('update');
    })

    district.on('change', function () {
        ward.html('<option value="">Phường/Xã</option>');
        districtId = district.val();
        districtName = district.find('option:selected').text();
        wardArr.forEach(function (item) {
            if (item.DistrictID == districtId) {
                let html = `<option value="${item.Code}">${String(item.Name)}</option>`;
                ward.append(html);
            }
        })
        ward.niceSelect('update')
    })


    let numberPhone = $('#numberPhone');
    let phoneNumber = numberPhone.text();
    numberPhone.text(convertPhoneNumber(phoneNumber));
    let invAddress = '';
    $(document).on('change', '.body-form-update input[name="diaChi"]', function () {
        let val = $(this).val();
        invAddress = $(this).val();
        let dcK = $('.diaChiKhac');
        console.log(val)
        if (val === '#') {
            dcK.removeClass('d-none').addClass('showF').on('animationend', function () {
                $(this).removeClass('showF').removeClass('d-none');
            });
            console.log('hiển thị');
        } else {
            if (!dcK.hasClass('d-none')) {
                dcK.removeClass('showF').addClass('hideF');
                dcK.on('animationend', function () {
                    $(this).addClass('d-none').removeClass('hideF');
                })
            }
        }
    })
    $(document).on('click', '.qtybtn', function () {
        let ele = $(this);
        let id = ele.closest('li.row').data('id-hdct');
        if (ele.hasClass('dec')) {
            UpdateQuantity(id, 'plus', 1).then((res) => {
                let item = res.find(item => Number(item.idHDCT) === Number(id));
                $(`#quantity-selected-${id}`).siblings('input').val(item.soLuong)
            })
        } else {
            UpdateQuantity(id, 'minus', 1).then((res) => {
                let item = res.find(item => Number(item.idHDCT) === Number(id));
                $(`#quantity-selected-${id}`).siblings('input').val(item.soLuong)
            })
        }
    })
    $(document).on('click', '#btn-show-update', function () {
        if ($(this).data('update') == 0) {
            $('.content_product').removeClass('col-7').addClass('col-6')
            $('.btn-del-group').removeClass('d-none').addClass('d-flex');
            $('#btn-add-product').removeClass('d-none');
            $('.pro-qty').removeClass('d-none')
            $('.quantity-product').addClass('d-none')
            $(this).data('update', 1).text('Xong');
        } else {
            $('.content_product').addClass('col-7').removeClass('col-6')
            $('.btn-del-group').addClass('d-none').removeClass('d-flex');
            $('#btn-add-product').addClass('d-none');
            $('.pro-qty').addClass('d-none')
            $('.quantity-product').removeClass('d-none')
            $(this).data('update', 0).text('Cập Nhật');
        }
    })
    $(document).on('click', '.btn-cancel-oders', function () {
        let id = $(this).data('id');
        $('#id_oders_cancel').val(id);
        $('#staticBackdrop').modal('show');
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
            success: function (data) {
                console.log(data)
                ToastSuccess('Thành công.')
                $(`.show_trang_thai`).text('Đã Hủy');
                $(`.btn-cancel-oders`).remove();
                $(`#btn-show-update`).remove();
                printHistory(data.thoiGian, data.hanhDong);
                $('.step').each((index, ele) => {
                    if (!$(ele).hasClass('active')) {
                        $(ele).remove();
                    }
                })
                $('.track').append(`
                <div class="step active">
                            <span class="icon">
                                <i class="fa fa-times" aria-hidden="true"></i>
                            </span>
                        <span class="text">Đã Hủy</span>
                    </div>
                `)
                $('#staticBackdrop').modal('hide');
            },
            error: function (e) {
                console.log(e)
                $('#staticBackdrop').modal('hide');
            }
        })
    })
    $(document).on('change', '#tenSanPham', function () {
        let id = $(this).val();
        let dataS = dataShop;
        let arr = [];
        let mauSac = $('#mauSac');
        mauSac.empty();
        let kichCo = $('#kichCo');
        kichCo.empty();
        let url = '';
        dataS.forEach((item) => {
            if (item.id == id) {
                item.chiTietSanPham.forEach((chil, ind) => {
                    if (ind === 0) {
                        url = chil.anh;
                        item.chiTietSanPham.forEach((ctsp, i) => {
                            let kc = item.kichCo.find((k) => k.ten == ctsp.kichCo)
                            kichCo.append(`<option value="${kc.id}" ${i === 0 ? 'selected' : ''}>${kc.ten}</option>`)
                        })
                    }
                    if (!arr.includes(chil.mauSac)) {
                        mauSac.append(`<option value="${chil.mauSac}" ${ind === 0 ? 'selected' : ''}>${chil.tenMau}</option>`)
                        arr.push(chil.mauSac);
                    }
                })
            }
        })
        $('#preview-img').attr('src', url);
        $(mauSac).niceSelect('update');
        $(kichCo).niceSelect('update');
    })
    $('#mauSac').on('change', function () {
        let data = dataShop;
        let id_sp = $('#tenSanPham').val();
        let mauSac = $('#mauSac');
        let kichCo = $('#kichCo');
        let mau = mauSac.val();
        let url = '';
        kichCo.empty();
        let object = {};
        for (let i = 0; i < data.length; i++) {
            if (id_sp == data[i].id) {
                object = data[i];
                break;
            }
        }
        object.chiTietSanPham.forEach((item, i) => {
            if (mau == item.mauSac) {
                url = item.anh;
                let size = object.kichCo.find((oj) => oj.ten == item.kichCo);
                kichCo.append(`<option value="${size.id}" ${i === 0 ? 'selected' : ''}>${size.ten}</option>`)
            }
        })
        $(kichCo).niceSelect('update');
        if (mauSac.val() === '#') {
            $('#preview-img').attr('src', '/assets/customer/img/icon/user.png');
        } else {
            $('#preview-img').attr('src', url);
        }
    })
    $(document).on('click', '.btn-delete', function () {
        let li = $(this).closest('li.row');
        let id = $(this).data('id-hdct');
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
                    url: '/api/hoa-don/delete-product',
                    type: 'POST',
                    data: {
                        id: id
                    }, success: async function (data) {
                        console.log(data);
                        li.remove();
                        printHistory(data.times, data.message)
                        $('#total-money').text(addCommasToNumber(data.tongTien) + 'đ')
                        $('#discount-money').text(addCommasToNumber(data.giamGia == null ? 0 : data.giamGia) + 'đ')
                        $('#payment-money').text(addCommasToNumber(data.thucThu) + 'đ')
                        ToastSuccess('Thành công.')
                        if (Number(data.tongTien) < 2000000) {
                            let response = await getShippingFee(data.soLuong);
                            let idHD = data.id;
                            let total_fee = response.data.total_fee;
                            let newTotal = await updateShippingFee(idHD, total_fee)
                            $('#shipping-money').text(Number(newTotal.shippingfee) > 1 ? addCommasToNumber(newTotal.shippingfee) + 'đ' : 'Miễn Phí');
                            $('#payment-money').text(addCommasToNumber(newTotal.thucThu) + 'đ');
                        }
                    }, error: function (e, x, h) {
                        switch (e.getResponseHeader('status')) {
                            case 'NotAuth':
                                ToastError('Vui lòng đăng nhập.');
                                break;
                            case 'minPro':
                                ToastError('Không thể xóa hết sản phẩm.');
                                break;
                            default:
                                ToastError('Lỗi.')
                        }
                        console.log(e)
                        console.log(x)
                        console.log(h)
                    }
                })
            }
        })

    })
    $('#form-tracking-1,#form-tracking-2').on('submit', function (e) {
        let vl1 = $('#form-value-1').val();
        let vl2 = $('#form-value-2').val();
        if (vl1 !== undefined) {
            if (vl1.length === 0) {
                ToastError('Vui lòng nhập mã hóa đơn.')
                e.preventDefault();
            }
        }
        if (vl2 !== undefined) {
            if (vl2.length === 0) {
                ToastError('Vui lòng nhập mã hóa đơn.')
                e.preventDefault();
            }
        }
    })
    $('#btn-select').on('click', function () {
        let sanPham = $('#tenSanPham').val();
        let mauSac = $('#mauSac').val();
        let kicCo = $('#kichCo').val();
        let soLuong = $('#soLuong').val();
        let id = $('#oder-id-update').val();
        if (mauSac === '#' || mauSac.length === 0) {
            ToastError('Vui lòng chọn màu.')
            return;
        }
        if (kicCo.length === 0 || kicCo === '#') {
            ToastError('Vui lòng chọn cỡ.')
            return;
        }
        if (soLuong.length === 0 || Number(soLuong) < 1) {
            ToastError('Vui lòng nhập số lượng.')
            return;
        }
        if (id.length === 0) {
            ToastError('ID Rỗng.')
            return;
        }
        $.ajax({
            url: '/api/hoa-don/add-product',
            type: 'POST',
            data: {
                id: id,
                mauSac: mauSac,
                sanPham: sanPham,
                kichCo: kicCo,
                soLuong: soLuong
            }, success: function (data) {
                console.log(data)
                if (data.sale) {
                    let html = `
                    <li class="row" data-id-hdct="${data.id_hdct}">
                        <div class="col-2 p-0">
                            <img class="product_img" src="${data.anh}">
                        </div>
                        <div id="product-detail-${data.id_hdct}" class="content_product p-0 col-6">
                            <div>
                                <h6 class="product_name mb-2">${data.ten}</h6>
                                <div class="w-100">
                                    Màu :<label>${data.mauSac}</label>,
                                    Kích Cỡ :<label>${data.kichCo}</label>
                                </div>
                                <label class="quantity-product">Số Lượng :${data.soLuong}</label>
                                 <div class="pro-qty">
                                 <span class="fa fa-angle-up dec qtybtn"></span>
                                                <input class="input-quantity" id="quantity-selected-${data.id_hdct}" type="text" value="${data.soLuong}" readonly="">
                                <span class="fa fa-angle-down inc qtybtn"></span></div>
                            </div>
                        </div>
                        <div class="col-3 d-flex align-items-center">
                            <h5 class="product_price_cu">${addCommasToNumber(data.giaGoc)}đ</h5>
                            <h5 class="product_price">${addCommasToNumber(data.giaBan)}đ</h5>
                        </div>
                        <div class="col-1 align-items-center btn-del-group d-flex">
                            <button class="btn-delete" data-toggle="tooltip" title="Xóa Sản Phẩm" data-id-hdct="${data.id_hdct}">
                                <i class="fa fa-close"></i>
                            </button>
                        </div>
                    </li>
                    `;
                    $('#show-all-product').append(html);
                    printHistory(data.times, data.message)
                } else {
                    let element = $(`#product-detail-${data.id_hdct}`);
                    element.find('.quantity-product').text('Số Lượng :' + data.soLuong)
                    element.find('.input-quantity').val(data.soLuong)
                }
                $('#total-money').text(addCommasToNumber(data.tongTien) + 'đ')
                $('#discount-money').text(addCommasToNumber(data.giamGia == null ? 0 : data.giamGia) + 'đ')
                $('#shipping-money').text(Number(data.phiShip) > 1 ? addCommasToNumber(data.phiShip) + 'đ' : 'Miễn Phí');
                $('#payment-money').text(addCommasToNumber(data.thucThu) + 'đ')
                ToastSuccess('Chọn Thành Công.')
            }, error: function (e, x, h) {
                switch (e.getResponseHeader('status')) {
                    case 'HoaDonNull':
                        ToastError('Hóa đơn không tồn tại.');
                        break;
                    case 'numMin':
                        ToastError('Số lượng phải lớn hơn 1.');
                        break;
                    case 'NotAcceptStatus':
                        ToastError('Trạng thái hiện không thể sửa.');
                        break;
                    case 'MaxQuantity':
                        ToastError('Số lượng sản phẩm lớn hơn số lượng tồn.');
                        break;
                    case 'NotAuth':
                        ToastError('Vui lòng đăng nhập.');
                        break;
                    case 'MinQuantity':
                        ToastError('Số lượng sản phẩm phải lớn hơn 0.');
                        break;
                    case 'CTSPNull':
                        ToastError('Sản phẩm không tồn tại.');
                        break;
                    default:
                        ToastError('Lỗi.');
                }
                console.log(x)
                console.log(h)
            }
        })
        console.log(mauSac, kicCo)
    })

    $('#select_product').on('show.bs.modal', function (e) {
        let dataS = dataShop;
        let element = $('#tenSanPham');
        let mauSac = $('#mauSac');
        let kichCo = $('#kichCo');
        $('#oder-id-update').val($('#btn-show-update').data('id'));
        element.empty();
        kichCo.empty();
        mauSac.html(`<option value="#" selected>Chọn Màu</option>`)
        let arr = [];
        if (dataS !== null && Array.isArray(dataS)) {
            dataS.forEach((item, index) => {
                element.append(`<option value="${item.id}" ${index === 0 ? 'selected' : ''}>${item.ten}</option>`)
                if (index === 0) {
                    item.chiTietSanPham.forEach((chil) => {
                        if (!arr.includes(chil.mauSac)) {
                            mauSac.append(`<option value="${chil.mauSac}">${chil.tenMau}</option>`)
                            arr.push(chil.mauSac);
                        }
                    })
                }
            })
            $(element).niceSelect('update');
            $(mauSac).niceSelect('update');
            $(kichCo).niceSelect('update');
        }
        $('#soLuong').val(1);
        $('#preview-img').attr('src', dataS[0].chiTietSanPham[0].anh);
        // let ms = mauSac.val();
        // let kc = kichCo.find('option:selected').text();

    });

    $(document).on('click', '#btn-save', function () {
        var invCode = $('#oder-code').text();
        var cusName = $('#hoTen').val();
        var cusPhone = $('#soDienThoai').val();
        var invReceiveAddress = $('.body-form-update input[name="diaChi"]:checked').val();
        if (invReceiveAddress === '#') {
            var soNha = $('#soNha').val();
            var tinhTP = $('#tinhTP').find('option:selected').text();
            var quanHuyen = $('#quanHuyen').find('option:selected').text();
            var phuongXa = $('#phuongXa').find('option:selected').text();
            invReceiveAddress = soNha + ',' + phuongXa + ',' + quanHuyen + ',' + tinhTP;
        }
        $.ajax({
            type: "POST",
            url: "/user-profile/update-receive-infor",
            contentType: "application/json",
            data: JSON.stringify({
                invCode: invCode,
                customerName: cusName,
                customerPhone: cusPhone,
                invReceiveAddress: invReceiveAddress
            }),
            success: function (response) {
                console.log(response)
                $('.invCusName').text(response.tenNguoiNhan);
                $('.invCusPhone').text(response.sdtNguoiNhan);
                $('.invAddress').text(response.diaChi);
                printHistory(response.times, response.message);
                $('#updateInformationModal').modal('hide');
                ToastSuccess('Cập nhật thành công thông tin nhận hàng');
            },
            error: function (error) {
                console.error('Xảy ra lỗi: ', error);
            }
        })
    })

    $('.quantity-selected').on('change', function () {
        var qtyChange = $(this).val();
        var prodPrice = $(this).closest('.product-information').find('.product_price').text().replace('đ', '');
        prodPrice = prodPrice.replace(/[,.]/g, '') * qtyChange;
        $(this).closest('.product-information').find('.product_price').text(prodPrice.toLocaleString('en-US') + 'đ');
    })
})

function formatServerTime(serverTimeString) {
    var serverTime = new Date(serverTimeString);
    var day = serverTime.getDate();
    day = (day < 10) ? '0' + day : day;
    var month = serverTime.getMonth() + 1;
    month = (month < 10) ? '0' + month : month;
    var year = serverTime.getFullYear();
    var hours = serverTime.getHours();
    hours = (hours < 10) ? '0' + hours : hours;
    var minutes = serverTime.getMinutes();
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    var seconds = serverTime.getSeconds();
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    var formattedDateTime = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
    return formattedDateTime;
}
