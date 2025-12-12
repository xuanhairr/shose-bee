let province = $('#updatedCusProvince');
let district = $('#updatedCusDistrict');
let ward = $('#updatedCusWard');
let provinceName, districtName, wardName;
let provinceId, districtId, wardCode;
let provinceArr, districtArr, wardArr;
let dataShop = [];
let worker = new Worker('/assets/customer/js/work_get_all_product.js');
window.onload = function () {
    worker.postMessage('start');
};
activeSiderbar1EXXP("quan_ly_don_hang");
worker.onmessage = function (e) {
    dataShop = e.data;
    let dataS = [...dataShop];
    let element = $('#tenSanPham');
    element.html('<option value="#" selected>Chọn Sản Phẩm</option>')
    if (Array.isArray(dataS)) {
        dataS.forEach((item) => {
            element.append(`<option value="${item.id}">${item.ten}</option>`)
        })
    }
};

$.ajax({
    type: "GET",
    url: "/assets/address-json/province.json",
    contentType: "application/json",
    success: function (response) {
        provinceArr = response;
        $.each(response, function (index, item) {
            let html = `<option value="${item.ProvinceID}">${String(item.ProvinceName)}</option>`;
            province.append(html);
        });
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
})

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

function showLoader() {
    Swal.fire({
        title: 'Đang xử lý...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading()
        }
    });
}

function hideLoader() {
    Swal.close();
}

// print
function printTimeline(status, type, action) {
    let ul = $('#myTimeline');
    let li = document.createElement('li');
    li.className = 'timeline-item';
    let html = `<div class="timeline-badge ${type}"><i class="tio-checkmark-square-outlined"></i></div>
                        <div class="timeline-panel">
                            <div class="timeline-heading">
                            <p><small class="text-muted">${action}</small></p>
                                <h4 class="timeline-title">${status}</h4>
                            </div>
                        </div>`;
    li.innerHTML = html;
    ul.append(li);
}

function printHistory(thoiGian, nguoiThucHien, hanhDong) {
    let ul = $('#myHistory');
    let li = document.createElement('li');
    li.className = 'step-item';
    let html = `<div class="step-content-wrapper">
                <span class="step-icon step-icon-soft-dark step-icon-pseudo"></span>
                <div class="step-content">
                    <h5 class="mb-1">
                        <a class="text-dark" href="#">${hanhDong}</a>
                    </h5>
                    <p class="font-size-sm mb-0">Thực hiện bởi: <h6>${nguoiThucHien}</h6> Thời gian thực hiện: <h6>${thoiGian}</h6></p>
                </div>
            </div>`;
    li.innerHTML = html;
    ul.prepend(li);
}

function printStatusHeader(typeOfColor, status) {
    let div = $('.trangThaiHeader');
    let html = `<span class="badge badge-soft-${typeOfColor}">Trạng Thái: ${status}
                  <span class="legend-indicator bg-${typeOfColor}"></span>
                </span>`;
    div.html('');
    div.append(html);
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
        }).then((result) => {
            resolve(result.isConfirmed);
        });
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

function setQuantity(id, num) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/hoa-don/set-quantity',
            type: 'POST',
            data: {
                id: id,
                quantity: num
            }, success: async function (response) {
                let money = Number(response.giaBan) * Number(response.soLuong);
                $(`.wrapper_product_detail[data-id-hdct="${response.idHDCT}"]`).find('.text-quantity-product').text(addCommasToNumber(money));
                $('#shippingFee').text(addCommasToNumber(response.phiShip));
                $('#total-money').text(addCommasToNumber(response.tongTien));
                $('#payment-money').text(addCommasToNumber(response.thucThu));
                if (Number(response.giamGia) > 0) {
                    let dis = $('#discount-money');
                    if (dis.length === 0) {
                        let html =
                            `<dt class="col-sm-6" >Giảm giá:</dt>
                                     <dd class="col-sm-6" id="discount-money"">${addCommasToNumber(response.giamGia)}</dd>`;

                    } else {
                        dis.text(addCommasToNumber(response.giamGia));
                    }
                }
                if (Number(response.tongTien) < 2000000) {
                    let res = await getShippingFee(response.count);
                    if (res !== null) {
                        let fee = res.data.total_fee;
                        let total = await updateShippingFee(response.idHD, fee)
                        $('#shippingFee').text(addCommasToNumber(total.shippingfee))
                        $('#payment-money').text(addCommasToNumber(total.thucThu))
                    }
                }
                printHistory(formatDateTime(response.times), response.user, response.message)
                resolve(response);
            }, error: function (xhr) {
                console.log(xhr.getResponseHeader('status'));
                switch (xhr.getResponseHeader('status')) {
                    case 'NotAuth':
                        ToastError('Vui lòng đăng nhập.')
                        break;
                    case 'quantityZero':
                        ToastError('Số lượng phải lớn hơn 0.')
                        break;
                    case 'NotAcceptStatus':
                        ToastError('Trạng thái hiện không thể sửa.')
                        break;
                    case 'HDCTisNull':
                        ToastError('Vui lòng chọn lại sản phẩm.')
                        break;
                    case 'ChangePrice':
                        ToastError('Dữ liệu sản phẩm bị thay đổi.')
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
                let count = 0;
                let id_hd = null;
                for (let i = 0; i < data.length; i++) {
                    id_hd = data[0].idHD;
                    count += Number(data[i].soLuong);
                    let tong = Number(data[i].soLuong) * Number(data[i].giaBan);
                    let wrapper = $(`.wrapper_product_detail[data-id-hdct=${data[i].idHDCT}]`);
                    if (wrapper.length === 0) {
                        let html = `
                        <div class="media mb-1 product" data-productid="0">
                            <div class="avatar avatar-xl mr-3">
                                <img class="img-fluid" src="${data[i].img}" alt="Image Description">
                            </div>
                            <div class="media-body">
                                <div class="row">
                                    <div class="col-md-6 mb-3 mb-md-0">
                                        <a class="h5 d-block productName" href="/cms/view-product?id=${data[i].idCTSP}">${data[i].ten}</a>
                                        <div class="font-size-sm text-body">
                                            <span>Color:</span>
                                            <span class="font-weight-bold productColor">${data[i].tenMau}</span>
                                        </div>
                                        <div class="font-size-sm text-body">
                                            <span>Size:</span>
                                            <span class="font-weight-bold productSize">${data[i].kichCo}</span>
                                        </div>
                                    </div>
                                    <div class="col col-md-2 align-self-center">
                                        <h6 class="productPrice">${addCommasToNumber(data[i].giaBan)}</h6>
                                    </div>
                                    <div class="wrapper-quantity col align-self-center p-0 col-md-1">
                                        <h6 class="productQuantity text-center d-none">4</h6>
                                        <div class="position-relative w-100 form-edit-quantity" data-id="88">
                                            <span class="btn-quantity plus"><i class="tio-caret-up"></i></span>
                                            <input type="number" class="form-control" value="${data[i].soLuong}">
                                            <span class="btn-quantity minus"><i class="tio-caret-down"></i></span>
                                        </div>
                                    </div>
                                    <div class="col col-md-2 align-self-center text-center">
                                        <h6 class="text-quantity-product">${addCommasToNumber(tong)}</h6>
                                    </div>
                                    <div class="col col-md-1 align-self-center text-right wrapper-btn-delete">
                                        <button class="btn pointer btn-delete-product" data-id="${data[i].idHDCT}" data-id-hd="${data[i].idHD}"><i class="tio-delete"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                        $('#show-list-data').append(html);
                    } else {
                        wrapper.find('.form-edit-quantity input').val(data[i].soLuong);
                        wrapper.find('.wrapper-quantity .productQuantity').text(data[i].soLuong);
                        let money = Number(data[i].giaBan) * Number(data[i].soLuong);
                        wrapper.find('.text-quantity-product').text(addCommasToNumber(money))
                    }
                    printHistory(formatDateTime(data[0].times), data[0].user, data[0].mesage);
                }
                if (Number(data[0].giamGia) > 0) {
                    let dis = $('#discount-money');
                    if (dis.length === 0) {
                        let html =
                            `<dt class="col-sm-6" >Giảm giá:</dt>
                                     <dd class="col-sm-6" id="discount-money"">${addCommasToNumber(data[0].giamGia)}</dd>`;

                    } else {
                        dis.text(addCommasToNumber(data[0].giamGia));
                    }
                }
                ToastSuccess('Lưu thành công.');
                $('#shippingFee').text(addCommasToNumber(data[0].phiShip))
                $('#total-money').text(addCommasToNumber(data[0].tongTien))
                $('#payment-money').text(addCommasToNumber(data[0].thucThu))
                if (Number(data[0].tongTien) < 2000000) {
                    let res = await getShippingFee(count);
                    if (res !== null) {
                        let fee = res.data.total_fee;
                        let total = await updateShippingFee(id_hd, fee)
                        $('#shippingFee').text(addCommasToNumber(total.shippingfee))
                        $('#payment-money').text(addCommasToNumber(total.thucThu))
                    }
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
                        ToastError('Trạng thái hiện tại không thể sửa.')
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
    let addres = extracAddress($('.receiveAddress').text())
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
        ToastError(error.responseJSON.code_message_value);
        return null;
    }
}

function initSelect2(element) {
    $.HSCore.components.HSSelect2.init(element);
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

function formatDateTime(inputDateString) {
    const date = new Date(inputDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateString;
}

$(document).on('ready', function () {

    $(document).on('click', '#btn-refund', function () {
        let btn = $(this);
        Confirm("Xác Nhận Hoàn Tiền?", "Bạn đã hoàn tiền cho đơn hàng trên?", "Chưa", "Đã Hoàn").then(check => {
            if (check) {
                let id = btn.data('id-hd');
                $.ajax({
                    url: '/api/hoa-don/refunded',
                    type: 'POST',
                    data: {
                        id: id
                    },
                    success: function (response) {
                        console.log(response)
                        printHistory(formatDateTime(response.time), response.user, response.message);
                        printTimeline(response.status, 'success', response.message)
                        btn.remove();
                        $('#xacNhanFromDetail').hide();
                        $('#getAttrToHuyFromDetail').hide();
                        $('#hoanTacFromDetail').hide();
                    }, error: function (e) {
                        console.log(e.getResponseHeader('status'))
                        switch (e.getResponseHeader('status')) {
                            case 'NotAuth':
                                ToastError('Vui lòng đăng nhập.');
                                break;
                            case 'oderIsNull':
                                ToastError('Hóa đơn không tồn tại.');
                                break;
                            case 'invalidOder':
                                ToastError('Hóa đơn không hợp lệ.');
                                break;
                            default:
                                ToastError('Lỗi , Vui lòng thử lại sau.')
                                console.log(e);
                        }
                    }
                })
                ToastSuccess('Lưu Thành Công.')
            } else {
                ToastError("Vui lòng hoàn tiền rồi thực hiện lại.")
            }
        })
    })

    $('.js-select2-custom').each(function () {
        initSelect2($(this));
    });
    $(document).on('click', '#btn-select', function () {
        let sanPham = $('#tenSanPham').val();
        let mauSac = $('#mauSac').val();
        let kicCo = $('#kichCo').val();
        let soLuong = $('#soLuong').val();
        let id = $('#oder-id-update').val();
        if (sanPham === '#' || sanPham.length === 0) {
            ToastError('Vui lòng chọn sản phẩm.')
            return;
        }
        if (mauSac === '#' || mauSac.length === 0) {
            ToastError('Vui lòng chọn màu.')
            return;
        }
        if (kicCo.length === 0 || kicCo === '#') {
            ToastError('Vui lòng chọn cỡ.')
            return;
        }
        if (soLuong.length === 0 || Number(soLuong) < 1) {
            ToastError('Vui lòng nhập số lượng lớn hơn 0.')
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
                let wrapper = $('#show-list-data');
                if (data.sale) {
                    let html =
                        `<div class="media mb-1 wrapper_product_detail product" data-productid="${data.id_hdct}" data-id-hdct="${data.id_hdct}">
                            <div class="avatar avatar-xl mr-3">
                                <img class="img-fluid" src="${data.anh}" alt="Image Description">
                            </div>
                            <div class="media-body">
                                <div class="row">
                                    <div class="col-md-6 mb-3 mb-md-0">
                                        <a class="h5 d-block productName" href="/cms/view-product?id=${data.id}">${data.ten}</a>
                                        <div class="font-size-sm text-body">
                                            <span>Color:</span>
                                            <span class="font-weight-bold productColor">${data.mauSac}</span>
                                        </div>
                                        <div class="font-size-sm text-body">
                                            <span>Size:</span>
                                            <span class="font-weight-bold productSize">${data.kichCo}</span>
                                        </div>
                                    </div>

                                    <div class="col col-md-2 align-self-center">
                                        <h6 class="productPrice">${addCommasToNumber(data.giaBan)}</h6>
                                    </div>

                                    <div class="wrapper-quantity col col-md-2 align-self-center p-0">
                                        <h6 class="productQuantity text-center d-none">${data.soLuong}</h6>
                                        <div class="js-quantity-counter form-edit-quantity input-group-quantity-counter " data-id="${data.id_hdct}">
                                            <input type="number" class="js-result form-quantity form-control input-group-quantity-counter-control" value="${data.soLuong}">
                                            <div class="input-group-quantity-counter-toggle">
                                                <a class="js-minus minus btn-quantity input-group-quantity-counter-btn" href="javascript:;">
                                                    <i class="tio-remove"></i>
                                                </a>
                                                <a class="js-plus plus btn-quantity input-group-quantity-counter-btn" href="javascript:;">
                                                    <i class="tio-add"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col col-md-2 align-self-center text-left position-relative">
                                        <h6 class="text-quantity-product">${addCommasToNumber(Number(data.giaBan) * Number(data.soLuong))}</h6>
                                        <div class="wrapper-btn-delete">
                                            <button class="btn pointer btn-delete-product" data-id="${data.id_hdct}" data-id-hd="${data.idHD}"><i class="tio-delete"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    wrapper.append(html);
                } else {
                    let element = $(`.wrapper_product_detail[data-id-hdct="${data.id_hdct}"]`);
                    element.find('.productQuantity').text(data.soLuong)
                    element.find('.form-edit-quantity').find('input').val(data.soLuong)
                }
                printHistory(formatDateTime(data.times), data.user, data.message);
                $('#total-money').text(addCommasToNumber(data.tongTien) + 'đ')
                $('#discount-money').text(addCommasToNumber(data.giamGia == null ? 0 : data.giamGia) + 'đ')
                $('#shippingFee').text(Number(data.phiShip) > 1 ? addCommasToNumber(data.phiShip) + 'đ' : 'Miễn Phí');
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
            }
        })
    })
    $(document).on('change', '#mauSac', function () {
        let id = $('#tenSanPham').val();
        let mau = $(this).val();
        let dataS = dataShop;
        let kichCo = $('#kichCo');
        let url = '';
        kichCo.html('<option value="#" selected>Chọn Cỡ</option>');
        let product = dataS.find(item => {
            return Number(item.id) === Number(id)
        })
        product.chiTietSanPham.filter((obj) => {
            if (mau == obj.mauSac) {
                url = obj.anh;
                let size = product.kichCo.find((item) => item.ten == obj.kichCo);
                kichCo.append(`<option value="${size.id}">${size.ten}</option>`)
            }
        });
        if ($(this).val() === '#') {
            $('#preview-img').attr('src', '/assets/customer/img/icon/user.png');
        } else {
            $('#preview-img').attr('src', url);
        }
    })
    $(document).on('change', '#tenSanPham', function () {
        let id = $(this).val();
        let dataS = dataShop;
        let mauSac = $('#mauSac');
        mauSac.html('<option value="#">Chọn Màu</option>');
        let kichCo = $('#kichCo');
        kichCo.html('<option value="#">Chọn Cỡ</option>');
        let uniqueMauSac = [];
        let product = dataS.find(item => Number(item.id) === Number(id));
        if (product) {
            let uniqueMauSacSet = new Set();
            product.chiTietSanPham.forEach(obj => {
                uniqueMauSacSet.add(obj.mauSac);
            });
            uniqueMauSac = Array.from(uniqueMauSacSet).map(mauSacValue => {
                return product.chiTietSanPham.find(obj => obj.mauSac === mauSacValue);
            });
        }
        uniqueMauSac.forEach(obj => {
            mauSac.append(`<option value="${obj.mauSac}">${obj.tenMau}</option>`);
        });
        $('#preview-img').attr('src', '/assets/customer/img/icon/user.png');
    })
    $('#select_product').on('show.bs.modal', function () {
        let element = $('#tenSanPham');
        element.val('#').trigger('change');
        $('#soLuong').val(1);

    });
    $(document).on('change', '.form-edit-quantity input', function () {
        let id = $(this).closest('.form-edit-quantity').data('id');
        let val = $(this).val();
        let element = $(this);
        if (Number(val) < 1 || val.length === 0) {
            ToastError('Vui lòng nhập số lớn hơn 0.')
            $(this).val(1).trigger('change');
            return;
        }
        setQuantity(id, val).then((res) => {
            element.val(res.quantity);
            $(this).closest('.wrapper-quantity').find('h6.productQuantity').text(res.quantity);
        });
    })
    $(document).on('click', '.wrapper-quantity .btn-quantity', function () {
        let ele = $(this);
        let id = ele.closest('.form-edit-quantity').data('id');
        if (ele.hasClass('plus')) {
            UpdateQuantity(id, 'plus', 1).then((res) => {
                let item = res.find(item => Number(item.idHDCT) === Number(id));
                $(ele).siblings('input').val(item.soLuong)
            })
        } else {
            UpdateQuantity(id, 'minus', 1).then((res) => {
                let item = res.find(item => Number(item.idHDCT) === Number(id));
                $(ele).siblings('input').val(item.soLuong)
            })
        }
    })
    $(document).on('click', '.btn-delete-product', function () {
        let id = $(this).data('id');
        let id_hd = $(this).data('id-hd');
        let element = $(this);
        Confirm('Xác Nhận Xóa !', 'Thao tác không thể hoàn tác.', 'Hủy', 'Xác Nhận').then((check) => {
            if (check) {
                $.ajax({
                    url: '/api/hoa-don/delete-product',
                    type: 'POST',
                    data: {
                        id: id
                    }, success: async function (data) {
                        ToastSuccess('Xóa thành công.')
                        element.closest('div.product').remove()
                        $('#total-money').text(addCommasToNumber(data.tongTien))
                        $('#shippingFee').text(Number(data.phiShip) > 0 ? addCommasToNumber(data.phiShip) : 'Miễn Phí')
                        $('#payment-money').text(addCommasToNumber(data.thucThu))
                        if (Number(data.giamGia) > 0) {
                            let dis = $('#discount-money');
                            if (dis.length === 0) {
                                let html =
                                    `<dt class="col-sm-6" >Giảm giá:</dt>
                                     <dd class="col-sm-6" id="discount-money"">${addCommasToNumber(data.giamGia)}</dd>`;

                            } else {
                                dis.text(addCommasToNumber(data.giamGia));
                            }
                        }
                        if (Number(data.tongTien) < 2000000) {
                            let res = await getShippingFee(data.soLuong);
                            let total = await updateShippingFee(id_hd, res.data.total_fee)
                            $('#shippingFee').text(addCommasToNumber(total.shippingfee))
                            $('#payment-money').text(addCommasToNumber(total.thucThu))
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
    $(document).on('click', '#btn-edit-product', function () {
        let element = $(this);
        if (element.hasClass('select')) {
            element.removeClass('select');
            $('#btn-add-product').addClass('d-none')
            $('.form-edit-quantity').addClass('d-none')
            $('.wrapper-btn-delete').addClass('d-none')
            $('.productQuantity').removeClass('d-none')
            element.text('Chỉnh Sửa')
        } else {
            element.addClass('select');
            element.text('Xong')
            $('.form-edit-quantity').removeClass('d-none')
            $('#btn-add-product').removeClass('d-none')
            $('.wrapper-btn-delete').removeClass('d-none')
            $('.productQuantity').addClass('d-none')
        }
    })
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
    var sidebar = $('.js-navbar-vertical-aside');
    sidebar.hsSideNav({
        mobileOverlayClass: 'd-print-none'
    });

    $('.js-navbar-vertical-aside').addClass('d-print-none');


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
});

$(document).on('ready', function () {

    // handle timeline
    $('#xacNhanFromDetail').on('click', function () {
        var idHoaDon = String($(this).closest("div").attr("id-hoa-don"));
        Swal.fire({
            title: "Bạn chắc chứ?",
            text: "Bạn đang xác nhận đơn hàng!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Xác Nhận"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "/api/hoa-don/xac-nhan-detail",
                    contentType: "application/json",
                    data: JSON.stringify(idHoaDon),
                    success: function (response) {
                        ToastSuccess('Xác nhận đơn hàng thành công');
                        let type = 'success';
                        let status = response.trangThaiSauUpdate;
                        let action = response.hanhDong;
                        let typeOfColor = 'success';
                        if (status != 'Chờ Xác Nhận' && status != 'Hủy') {
                            $('printOrder').removeClass('d-none');
                        } else {
                            $('printOrder').addClass('d-none');
                        }
                        if (status == 'Hủy') {
                            type = 'danger';
                            typeOfColor = 'danger';
                            $('#btn-edit-product').addClass('d-none');
                            $('#btn-add-product').addClass('d-none');
                            $('#btn-edit-address').addClass('d-none');
                            $('#xacNhanFromDetail').hide();
                            $('#getAttrToHuyFromDetail').hide();
                            $('#printOrder').removeClass('d-none');
                            if ($('#isShowBtnRefund').text() == 'false') {
                                $('#btn-refund').removeClass('d-none');
                            }
                        } else if (status == 'Chờ Xác Nhận') {
                            typeOfColor = 'danger';
                            $('#btn-edit-product').removeClass('d-none');
                            $('#btn-add-product').removeClass('d-none');
                            $('#btn-edit-address').removeClass('d-none');
                            $('#hoanTacFromDetail').hide();
                        } else if (status == 'Chuẩn Bị Hàng') {
                            typeOfColor = 'warning';
                            $('#btn-edit-product').addClass('d-none');
                            $('#btn-add-product').addClass('d-none');
                            $('#btn-edit-address').addClass('d-none');
                            $('#getAttrToHuyFromDetail').removeClass('d-none');
                            $('#hoanTacFromDetail').removeClass('d-none');
                            $('#printOrder').removeClass('d-none');
                        } else if (status == 'Chờ Giao') {
                            typeOfColor = 'danger';
                            $('#btn-edit-product').addClass('d-none');
                            $('#btn-add-product').addClass('d-none');
                            $('#btn-edit-address').addClass('d-none');
                            $('#getAttrToHuyFromDetail').addClass('d-none');
                            $('#hoanTacFromDetail').hide();
                            $('.fixInvoice').hide();
                        } else if (status == 'Đang Giao') {
                            typeOfColor = 'danger';
                            $('#btn-edit-product').addClass('d-none');
                            $('#btn-add-product').addClass('d-none');
                            $('#btn-edit-address').addClass('d-none');
                            $('#hoanTacFromDetail').hide();
                        } else if (status == 'Thành Công') {
                            $('#btn-edit-product').addClass('d-none');
                            $('#btn-add-product').addClass('d-none');
                            $('#btn-edit-address').addClass('d-none');
                            $('#xacNhanFromDetail').hide();
                            $('#getAttrToHuyFromDetail').hide();
                            $('#hoanTacFromDetail').hide();
                            $('#printOrder').removeClass('d-none');
                        }
                        printStatusHeader(typeOfColor, status);
                        printTimeline(status, type, action);
                        printHistory(response.thoiGian, response.nguoiThucHien, response.hanhDong);
                    },
                    error: function (error) {
                        ToastError('Xác nhận đơn hàng thất bại');
                        console.error('Xảy ra lỗi: ', error);
                    }
                });
            }
        });
    });

    // reverse status
    $('#hoanTacFromDetail').on('click', function () {
        var idHoaDon = String($(this).closest("div").attr("id-hoa-don"));
        Swal.fire({
            title: "Bạn chắc chứ?",
            text: "Bạn đang hoàn tác đơn hàng!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Xác Nhận"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "/api/hoa-don/hoan-tac-detail",
                    contentType: "application/json",
                    data: JSON.stringify(idHoaDon),
                    success: function (response) {
                        ToastSuccess('Hoàn tác đơn hàng thành công');
                        $('#getAttrToHuyFromDetail').removeClass('d-none');
                        let type = 'success';
                        let status = response.trangThaiSauUpdate;
                        let action = response.hanhDong;
                        $('#hoanTacFromDetail').hide();
                        $('#printOrder').hide();
                        $('#btn-edit-product').removeClass('d-none');
                        $('#btn-add-product').removeClass('d-none');
                        $('#btn-edit-address').removeClass('d-none');
                        printStatusHeader(type, status);
                        printTimeline(status, type, action);
                        printHistory(response.thoiGian, response.nguoiThucHien, response.hanhDong);
                    },
                    error: function (error) {
                        ToastError('Xảy ra lỗi khi hoàn tác đơn hàng, vui lòng thử lại!');
                        console.error('Xảy ra lỗi: ', error);
                    }
                });
            }
        });
    })

    $('#printOrder').on('click', function () {
        showLoader();
        var items = [];
        var codAmount = 0;
        var customerName = document.querySelector('.customerName').textContent;
        var customerPhone = document.querySelector('.customerPhone').textContent;
        var customerAddress = document.querySelector('.customerAddress').textContent;
        var productElements = document.querySelectorAll('.product');
        productElements.forEach(function (productElement) {
            var productName = productElement.querySelector('.productName').textContent;
            var productColor = productElement.querySelector('.productColor').textContent;
            var productSize = productElement.querySelector('.productSize').textContent;
            var productPrice = productElement.querySelector('.productPrice').textContent.replace(/[,.]/g, '');
            var productQuantity = productElement.querySelector('.productQuantity').textContent;

            codAmount += (parseFloat(productPrice) * productQuantity);
            productName = productName + ", " + productColor + ", size " + productSize;

            var gItem = {
                name: productName,
                code: "Giày",
                quantity: parseInt(productQuantity),
                price: parseInt(productPrice),
                length: 12,
                width: 12,
                height: 12,
                weight: 1200,
                category: {
                    level2: "Giày"
                }
            }
            items.push(gItem);
        })

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
                    to_name: customerName,
                    to_phone: customerPhone,
                    to_address: customerAddress,
                    to_ward_code: "250318",
                    to_district_id: 3323,
                    service_id: 5,
                    service_type_id: 2,
                    payment_type_id: 2,
                    cod_amount: parseInt(codAmount),
                    required_note: "CHOXEMHANGKHONGTHU",
                    items: items,
                    weight: 2000,
                    length: 1,
                    width: 19,
                    height: 10
                }
            ),
            success: function (responseFirst) {
                $.ajax({
                    type: "POST",
                    url: "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/a5/gen-token",
                    contentType: "application/json",
                    headers: {
                        "Token": "68b8b44f-a88d-11ee-8bfa-8a2dda8ec551"
                    },
                    data: JSON.stringify(
                        {
                            "order_codes": [responseFirst.data.order_code]
                        }
                    ),
                    success: function (responseSecond) {
                        hideLoader();
                        var token = responseSecond.data.token;
                        $.ajax({
                            type: "GET",
                            url: "/api/hoa-don/printOrder?token=" + token,
                            contentType: "application/json",
                            success: function (responseThird) {
                                printHTML(responseThird);
                            },
                            error: function (error) {
                                console.error('Xảy ra lỗi: ', error);
                            }
                        })
                    },
                    error: function (error) {
                        console.error('Xảy ra lỗi: ', error);
                    }
                })
            },
            error: function (error) {
                console.error('Xảy ra lỗi: ', error);
            }
        })
    })

    function printHTML(htmlContent) {
        // Tạo một cửa sổ mới hoặc một tab mới
        var newWindow = window.open("", "_blank");

        // Kiểm tra xem cửa sổ đã được tạo thành công chưa
        if (newWindow) {
            // Chèn nội dung HTML vào cửa sổ mới
            newWindow.document.write(htmlContent);
            // Đóng luôn trong trường hợp nội dung rỗng
            newWindow.document.close();
        } else {
            // Nếu không tạo được cửa sổ mới, thông báo lỗi
            alert("Không thể mở cửa sổ mới.");
        }
    }

})

$(document).on('click', '#dataInputReason', function () {
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
$(document).on('click', '#huyFromDetail', function () {
    $('#staticBackdrop').modal('hide');
    var idHoaDon = String($('#getAttrToHuyFromDetail').closest("div").attr("id-hoa-don"));
    let lydo = $('[name="cancel"]:checked').val();
    if (lydo == '#') {
        lydo = $('#lydo_cancel').text();
    }
    $.ajax({
        type: "POST",
        url: "/api/hoa-don/huy-detail",
        data: {
            id: idHoaDon,
            lydo: lydo
        },
        success: function (response) {
            ToastSuccess('Hủy đơn hàng thành công');
            let type = 'danger';
            let status = 'Hủy';
            let nguoiThucHien = response.nguoiThucHien;
            let thoiGian = response.thoiGian;
            let hanhDong = response.hanhDong;
            $('#xacNhanFromDetail').hide();
            $('#getAttrToHuyFromDetail').hide();
            if ($('#isShowBtnRefund').text() == 'false') {
                $('#btn-refund').removeClass('d-none');
            }
            printStatusHeader(type, status);
            printTimeline(status, type, hanhDong);
            printHistory(thoiGian, nguoiThucHien, hanhDong);
        },
        error: function (error) {
            ToastError('Xảy ra lỗi khi hủy đơn hàng, vui lòng thử lại!')
            console.error('Xảy ra lỗi: ', error);
        }
    });
})

$(document).on('click', '.fixInvoice', function () {
    var cusName = $('.nameCusNonLog').text();
    var cusPhone = $('.phoneCusNonLog').text();
    var cusAddress = $('.receiveAddress').text().split(',');
    $('#updatedCusName').val(cusName);
    $('#updatedCusPhone').val(cusPhone);
    $('#updatedCusHouseNumber').val(cusAddress[0]);
    $('#updatedCusProvince option').each(function () {
        if ($(this).text() == cusAddress[3]) {
            $(this).prop('selected', true);
            return false;
        }
    })
    for (let i = 0; i < provinceArr.length; i++) {
        let item = provinceArr[i];
        if (item.ProvinceName == cusAddress[3]) {
            province.val(item.ProvinceID);
            districtArr.forEach(function (dis) {
                if (dis.ProvinceID == item.ProvinceID) {
                    let html = `<option value="${dis.DistrictID}" ${dis.DistrictName == cusAddress[2] ? 'selected' : ''}>${String(dis.DistrictName)}</option>`;
                    district.append(html);
                    if (dis.DistrictName == cusAddress[2]) {
                        wardArr.forEach((wd) => {
                            if (wd.DistrictID == dis.DistrictID) {
                                let print = `<option value="${wd.Code}" ${cusAddress[1] == wd.Name ? 'selected' : ''}>${String(wd.Name)}</option>`;
                                ward.append(print);
                            }
                        })
                    }
                }
            })
            break;
        }
    }
    $('#updateReceiveAddress').modal('show');
})

$('#updateReceiveAddressBtn').on('click', function () {
    showLoader();
    var invoiceId = $('#id-for-attribute').attr('id-for-call-api');
    var customerName = $('#updatedCusName').val();
    var customerPhone = $('#updatedCusPhone').val();
    var customerHouseNumber = $('#updatedCusHouseNumber').val();
    var provinceName = province.find('option:selected').text();
    var provinceId = province.val();
    var districtName = district.find('option:selected').text();
    var districtId = district.val();
    var wardName = ward.find('option:selected').text();
    var wardCode = ward.val();
    var receiveAddressUpdate = wardName + ',' + districtName + ',' + provinceName;
    var shippingFee = 0;

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
                to_name: customerName,
                to_phone: customerPhone,
                to_address: provinceName,
                to_ward_code: wardCode,
                to_district_id: districtId,
                service_id: 55320,
                service_type_id: 2,
                payment_type_id: 2,
                cod_amount: 200000,
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
                weight: 2000,
                length: 1,
                width: 19,
                height: 10
            }
        ),
        success: function (response) {
            shippingFee = parseInt(response.data.total_fee);
            $.ajax({
                type: "POST",
                url: "/api/hoa-don/update-receive-address",
                contentType: "application/json",
                data: JSON.stringify({
                    invoiceId: invoiceId,
                    customerName: customerName,
                    customerPhone: customerPhone,
                    customerHouseNumber: customerHouseNumber,
                    updateAddress: receiveAddressUpdate,
                    shippingFee: shippingFee
                }),
                success: function () {
                    $('#updateReceiveAddress').modal('hide');
                    ToastSuccess('Cập nhật thành công thông tin nhận hàng');
                    $('#shippingFee').text(shippingFee == 0 ? 'Miễn phí' : shippingFee.toLocaleString('en-US'));
                    $('.nameCusNonLog').text(customerName);
                    $('.phoneCusNonLog').text(customerPhone);
                    $('.receiveAddress').text(customerHouseNumber + ',' + receiveAddressUpdate);
                },
                error: function (error) {
                    console.error('Xảy ra lỗi: ', error);
                }
            })
        },
        error: function (error) {
            console.error('Xảy ra lỗi: ', error);
        }
    })
})