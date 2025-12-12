activeSiderbar1EXXP("ban_hang");

function PrintBillOder(data) {
    let elementToPrint = $('#oder-print');
    elementToPrint.find('#full_name_print').text(data.tenNguoiNhan)
    elementToPrint.find('#id_hoa_don_print').text('#' + data.maHoaDon);
    let html = '';
    data.sanPham.forEach((item, index) => {
        html += `
             <tr>
                    <td>${index + 1}</td>
                    <th>${item.ten}</th>
                    <td>${item.soLuong}</td>
                    <td class="table-column-right-aligned">${addCommasToNumber(item.giaBan * item.soLuong)}đ</td>
                </tr>
            `;
    })
    $('#show_product_print').html(html);
    $('#tongtien_print').text(addCommasToNumber(data.tongtien) + 'đ');
    $('#da_thanh_toan_print').text(addCommasToNumber(data.daThanhToan) + 'đ');
    $('#shipping_fee_print').text(addCommasToNumber(data.phiShip) + 'đ');
    $('#discount_money_print').text(addCommasToNumber(data.giamGia) + 'đ');
    const date = new Date(data.ngayTao);
    const options = {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    const formattedDate = date.toLocaleString('en-US', options);
    $('#createdDate').text(formattedDate);
    $('#typePayment').text(data.hinhThucThanhToan);
    $('#thuc_thu_print').text(addCommasToNumber(data.thucthu) + 'đ');
    if (data.type === 'CP') {
        let adress = extracAddress(data.diaChi)
        let html = `${adress.soNha}<br>
            ${adress.phuongXa}, ${adress.quanHuyen}<br>
            ${adress.tinhTP}`;
        $('#customer_address_print').html(html);
    } else {
        $('#customer_address_print').text(data.diaChi)
    }
    let element = document.getElementById('oder-print')
    printElement(element);

}

window.addEventListener('beforeunload', function (event) {
    let data1 = getListProductLocal(1);
    let data2 = getListProductLocal(2);
    let data3 = getListProductLocal(3);
    let data4 = getListProductLocal(4);
    let data5 = getListProductLocal(5);
    // Kiểm tra điều kiện
    if (data1.length > 0 || data2.length > 0 || data3.length > 0 || data4.length > 0 || data5.length > 0) {
        let confirmationMessage = 'Bạn có chắc chắn muốn rời trang này?';
        (event || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
    }
});

function tinhTienGiamGia(voucher, tongTien) {
    if (!voucher || !tongTien) {
        return 0;
    }

    if (voucher.loaiVoucher === '$') {
        if (voucher.giaTriTienMat && voucher.giaTriTienMat <= voucher.giaTriToiDa) {
            return voucher.giaTriTienMat;
        } else {
            return voucher.giaTriToiDa;
        }
    } else {
        let giamGiaPhanTram = (tongTien * voucher.giaTriPhanTram) / 100;
        if (giamGiaPhanTram <= voucher.giaTriToiDa) {
            return giamGiaPhanTram;
        } else {
            return voucher.giaTriToiDa;
        }
    }
}

function showLoader() {
    Swal.fire({
        title: 'Đang lấy phí giao hàng...',
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

resetData();

function initSelect2(element) {
    $.HSCore.components.HSSelect2.init(element);
}

let shippingFees = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
};

function getVariableShipping(oder) {
    if (oder.length === 0) {
        return null;
    }
    return shippingFees[Number(oder)];
}

function setVariableShipping(oder, value) {
    if (oder.length === 0) {
        return;
    }
    shippingFees[Number(oder)] = value;
}

let SelectedVoucher = {
    1: null, 2: null, 3: null, 4: null, 5: null
};

function getVoucher(oder) {
    if (oder.length === 0) {
        return null;
    }
    return SelectedVoucher[Number(oder)];
}

function setVoucher(oder, value) {
    if (oder.length === 0) {
        return;
    }
    SelectedVoucher[Number(oder)] = value;
}

let shippingCode = '';
let canRunDetection = true;
let ListVoucher = [];
let dataShop = [];
let dataProductDetails = [];
let num_oder_add = null;
window.onload = function () {
    // ToastSuccess('Tải hoàn tất !')
    $.ajax({
        url: '/api/get-all-san-pham', type: 'GET', success: function (data) {
            dataShop = [...data];
            dataProductDetails = data.flatMap(obj => obj.chiTietSanPham);
        }, error: function (jqXHR, textStatus, errorThrown) {
            console.error("Lỗi khi gọi API: " + textStatus, errorThrown);
        }
    })
};

function getAllVoucher(id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/get-all-voucher-by-customer',
            type: 'GET',
            data: {
                customer: id === '#' ? 0 : id,
            },
            success: function (data) {
                resolve(data);
            },
            error: function (xhr) {
                reject(xhr);
            }
        });
    });
}

async function getShippingFee(oder, phuongXaSelected, quanHuyenSelected) {
    if (isNaN(parseInt(phuongXaSelected))) {
        ToastError('Phường xã không hợp lệ.')
        return;
    }
    if (isNaN(parseInt(quanHuyenSelected))) {
        ToastError('Quận huyện không hợp lệ.')
        return;
    }
    showLoader();
    setVariableShipping(oder, null)
    let listProduct = getListProductLocal(oder);
    let quantity = 0;
    let total = 0;
    if (listProduct.length === 0) {
        ToastError('Vui lòng chọn sản phẩm.');
        return;
    }
    listProduct.forEach((item) => {
        quantity += item.quantity
        total += Number(item.quantity) * Number(item.giaBan)
    })
    if (quantity === 0) {
        quantity = 1;
    }
    if (total > 2000000) {
        let res = {
            data: {
                total_fee: 0,
            }
        };
        hideLoader();
        return res;
    }
    let wrapper = $(`#oder_content_${oder}`);
    try {
        if (phuongXaSelected === undefined && quanHuyenSelected === undefined) {
            return null;
        }
        let data = {
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
            to_ward_code: phuongXaSelected,
            to_district_id: quanHuyenSelected,
            service_id: 55320,
            service_type_id: 2,
            payment_type_id: 2,
            cod_amount: 200000,
            required_note: "CHOXEMHANGKHONGTHU",
            items: [{
                name: "Áo Polo",
                code: "Polo123",
                quantity: 1,
                price: 200000,
                length: 12,
                width: 12,
                height: 12,
                weight: 1200,
                category: {
                    level1: "Áo"
                }
            }],
            weight: 600 * quantity,
            length: 1,
            width: 19,
            height: 10
        };
        let response = await $.ajax({
            type: "POST",
            url: "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create",
            contentType: "application/json",
            headers: {
                "Token": "68b8b44f-a88d-11ee-8bfa-8a2dda8ec551"
            },
            data: JSON.stringify(data)
        });
        wrapper.find('.show-text-error').text('');
        shippingCode = response.data.order_code;
        hideLoader();
        return response;
    } catch (error) {
        hideLoader();
        console.error('Xảy ra lỗi: ', error);
        if (error.responseJSON.code_message_value === null || error.responseJSON.code_message_value === undefined) {
            ToastError(error.responseJSON.message);
        } else {
            ToastError(error.responseJSON.code_message_value);
        }
        wrapper.find('.show-text-error').text('Không hỗ trợ giao');
        return null;
    }
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

function PrintHtmlOder(product, numOder) {
    let table = $(`#datatable_hd_${numOder}`);
    let totalMoney = addCommasToNumber(Number(product.quantity) * Number(product.giaBan));
    if (table.length > 0) {
        let tbody = table.find('tbody');
        if (table.find('.tr-show-no-data').length > 0) {
            tbody.empty();
        }
        let tr = table.find(`#row_${numOder + '_' + product.id}`);
        if (tr.length > 0) {
            let curentQuantity = tr.find('.input-group-quantity-counter-control').val();
            if (Number(curentQuantity) !== Number(product.quantity)) {
                tr.find('.input-group-quantity-counter-control').val(product.quantity);
                let total = Number(product.quantity) * Number(product.giaBan);
                tr.find('.form-show-total-tr').val(addCommasToNumber(total));

            }
        } else {
            let html = `
                <tr id="row_${numOder + '_' + product.id}" data-id-product="${product.id}" data-id-hd="${numOder}">
                    <td>
                        <a class="media align-items-center" href="/cms/view-product?id=16">
                            <img class="avatar avatar-lg mr-3" src="${product.anh}"
                                 alt="Image Product">
                            <div class="media-body">
                                <h5 class="text-hover-primary mb-0">${product.ten}
                                    (${product.tenMau + '-' + product.kichCo})</h5>
                            </div>
                        </a>
                    </td>
                    <td class="table-column-pl-0">
                        <div class="js-quantity-counter input-group-quantity-counter">
                            <input type="number"
                                   class="js-result form-quantity form-control input-group-quantity-counter-control"
                                   value="${product.quantity}">
                            <div class="input-group-quantity-counter-toggle">
                                <a class="js-minus input-group-quantity-counter-btn"
                                   href="javascript:;">
                                    <i class="tio-remove"></i>
                                </a>
                                <a class="js-plus input-group-quantity-counter-btn"
                                   href="javascript:;">
                                    <i class="tio-add"></i>
                                </a>
                            </div>
                        </div>
                    </td>
                    <td class="table-column-pl-0">
                        <div class="input-group input-group-merge">
                            <input type="text" class="form-control form-show-total-tr" value="${totalMoney}" readonly>
                            <div class="input-group-prepend money-dv">
                                <div class="input-group-text">VND</div>
                            </div>
                        </div>
                    </td>
                    <td class="pl-1 pr-1">
                        <a class="btn btn-white btn-delete-tr-oder" href="javascript:;">
                            <i class="tio-delete-outlined"></i>
                        </a>
                    </td>
                </tr>`;
            tbody.append(html);
        }
    } else {
        ToastError('Lỗi.')
    }
}

function findProductByCode(code) {
    if (!Array.isArray(dataProductDetails)) {
        console.error("dataProductDetails không phải là một mảng.");
        return null;
    }
    let data = [...dataProductDetails];
    let product = data.find(pro => pro.maSanPham.toString().toLowerCase() === code.toString().toLowerCase());
    if (product === undefined) {
        ToastError('Mã sản phẩm không tồn tại.')
        return null;
    }
    return product;
}

function findProductById(id) {
    if (!Array.isArray(dataProductDetails)) {
        console.error("dataProductDetails không phải là một mảng.");
        return null;
    }
    let data = [...dataProductDetails];
    let product = data.find(pro => pro.id === id);
    return product;
}

function saveProductToOder(product, numOder, quantity) {
    product.quantity = Number(quantity);
    let data = getListProductLocal(numOder);
    let index = null;
    let found = false;
    let pro = null;
    if (Number(product.soLuongTon) < 1) {
        ToastError('Sản phẩm tạm hết hàng.');
        return;
    }
    if (data !== null && Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            if (Number(data[i].id) === Number(product.id)) {
                data[i].quantity = Number(data[i].quantity) + Number(quantity);
                pro = data[i]
                found = true;
                index = i;
                break;
            }
        }
        if (!found) {
            pro = product;
            data.push(product);
        }
    } else {
        data = []
        pro = product;
        data.push(product);
    }
    if (index !== null && Number(data[index].quantity) > Number(product.soLuongTon)) {
        ToastError('Số lượng tồn kho đã tối đa.');
        return;
    }
    if (pro !== null) {
        PrintHtmlOder(pro, numOder)
    }
    saveToLocalStorage(data, numOder)
    resetShipping(numOder);
    updateTotalMoney(numOder)

}

function resetShipping(oder) {
    let wrapper = $(`#oder_content_${oder}`);
    let typeNH = $(`input[name="deliveryOptionCheckbox_hd_${oder}"]:checked`).val();
    if (typeNH === 'CP') {
        let option = $(`.option-select-address[name="address_khac_${oder}"]:checked`);
        if (option.val() === undefined || option.val() === null) {
            return;
        }
        let quan = '';
        let xa = '';
        if (option.val() === '#') {
            quan = $(`#quanHuyen_${oder}`).val();
            xa = $(`#phuongXa_${oder}`).val();
        } else {
            let label = wrapper.find(`label[for="${option.attr('id')}"]`);
            let nameXa = label.find('span.phuongXa').text()
            let nameHyen = label.find('span.quanHuyen').text()
            let nameTinh = label.find('span.tinhTP').text()
            let tinh = arrProvince.find(tinh => tinh.ProvinceName == nameTinh);
            if (tinh) {
                let huyen = arrDistrict.find(huyen => huyen.ProvinceID == tinh.ProvinceID && huyen.DistrictName == nameHyen);
                if (huyen) {
                    quan = huyen.DistrictID;
                    let phuong = arrWard.find(xa => xa.DistrictID == huyen.DistrictID && xa.Name == nameXa);
                    if (phuong) {
                        xa = phuong.Code;
                    }
                }
            }
        }
        getShippingFee(oder, xa, quan).then((res) => {
            if (res !== null) {
                setVariableShipping(oder, res.data.total_fee);
                updateTotalMoney(oder)
            } else {
                setVariableShipping(oder, null);
            }
        });
    }
}

function resetData() {
    localStorage.setItem('List_product_oder_1', JSON.stringify([]))
    localStorage.setItem('List_product_oder_2', JSON.stringify([]))
    localStorage.setItem('List_product_oder_3', JSON.stringify([]))
    localStorage.setItem('List_product_oder_4', JSON.stringify([]))
    localStorage.setItem('List_product_oder_5', JSON.stringify([]))
    getAllVoucher(0).then((res) => {
        ListVoucher = res;
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

function saveToLocalStorage(listPro, oder) {
    localStorage.setItem(`List_product_oder_${oder}`, JSON.stringify(listPro))
}

function getListProductLocal(oder) {
    return JSON.parse(localStorage.getItem(`List_product_oder_${oder}`));
}

function formatDate(dateTimeString) {
    let dateTime = new Date(dateTimeString);

    // Lấy các thành phần của ngày và giờ
    let day = dateTime.getDate();
    let month = dateTime.getMonth() + 1;
    let year = dateTime.getFullYear();
    let hours = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let formattedDateTime = hours + 'H' + minutes + ' Ngày ' + day + '/' + month + '/' + year;

    return formattedDateTime;
}

function updateTotalMoney(oder) {
    let data = getListProductLocal(oder);
    let total = 0;
    if (data !== null && Array.isArray(data)) {
        data.forEach((pro) => {
            total += Number(pro.quantity) * Number(pro.giaBan);
        })
    }
    let wrapper = $(`#oder_content_${oder}`);
    let type = wrapper.find(`input[name="deliveryOptionCheckbox_hd_${oder}"]:checked`).val();
    let ship = getVariableShipping(oder) === null ? 0 : getVariableShipping(oder);
    if (type === 'CP') {
        if (total > 2000000) {
            ship = 0;
        }
    }
    let select = getVoucher(oder);
    if (select !== null) {
        if (total < Number(select.giaTriToiThieu)) {
            setVoucher(oder, null);
        }
    }
    let arrVoucher = [];
    let arrNotAccept = [];
    let VoucherNot = null;
    let arr = [...ListVoucher]
    if (arr !== null && Array.isArray(arr)) {
        let html = '';
        arr.forEach((voucher) => {
            let ele = $(`#voucher_${voucher.id}_${oder}`);
            if (Number(total) >= Number(voucher.giaTriToiThieu)) {
                arrVoucher.push(voucher);
                if (ele.length === 0) {
                    let showPr = '';
                    if (voucher.loaiVoucher === '$') {
                        showPr = `<h2 class="text-value-discount">${formatNumberMoney(voucher.giaTriTienMat)}</h2>`;
                    } else {
                        showPr = `<h2 class="text-value-discount">${voucher.giaTriPhanTram}%</h2>`
                    }
                    html += `<li id="item_${voucher.id}_${oder}" class="item-voucher scaleIn">
                                  <div id="voucher_${voucher.id}_${oder}" data-id="${voucher.id}" class="wrapper_voucher row m-0">
                                      <div class="col-9 contents p-2">
                                          <h5 class="text-center voucher_code">${voucher.ma}</h5>
                                          <label class="express_date">Hạn Đến: ${formatDate(voucher.endDate1)}</label>
                                          <label class="express_date">Điều Kiện: Áp dụng cho đơn hàng từ ${addCommasToNumber(voucher.giaTriToiThieu) + 'đ'}</label>
                                          <label class="express_date">Tối Đa:${addCommasToNumber(voucher.giaTriToiDa) + 'đ'}/Khách Hàng</label>
                                          <label class="express_date w-100">Số Lượng : ${voucher.soLuong}</label>
                                      </div>
                                      <div class="col-3 p-2 row m-0 card__discount position-relative">
                                          <label class="text-discount">Mã Giảm Giá</label>
                                          ${showPr}
                                      </div>
                                  </div>
                              </li>`;
                }
            } else {
                if (ele.length !== 0) {
                    ele.parent().removeClass('scaleIn').addClass('scaleOut');
                    ele.parent().on('animationend', function () {
                        ele.parent().remove();
                    });
                }
                arrNotAccept.push(voucher);
            }
        })
        let voucher = $(`#list_show_voucher_hd_${oder}`);
        voucher.prepend(html);
    }
    let discountAmount;
    let selectedVoucher = getVoucher(oder);
    if (selectedVoucher !== null) {
        discountAmount = tinhTienGiamGia(selectedVoucher, total);
    } else {
        discountAmount = 0;
    }
    if (Array.isArray(arrNotAccept)) {
        arrNotAccept.sort((a, b) => a.giaTriToiThieu - b.giaTriToiThieu);
        for (let i = 0; i < arrNotAccept.length; i++) {
            let discount = tinhTienGiamGia(arrNotAccept[i], total);
            if (discount > discountAmount) {
                VoucherNot = arrNotAccept[i];
                break;
            }
        }
    }

    if (VoucherNot !== null) {

        let showPr = '';
        if (VoucherNot.loaiVoucher === '$') {
            showPr = `<h2 class="text-value-discount">${formatNumberMoney(VoucherNot.giaTriTienMat)}</h2>`;
        } else {
            showPr = `<h2 class="text-value-discount">${VoucherNot.giaTriPhanTram}%</h2>`
        }
        let mt = Number(VoucherNot.giaTriToiThieu) - Number(total);
        let li = `<li class="item-voucher">
                                  <div class="wrapper_voucher disabled row m-0">
                                      <div class="col-9 contents p-2">
                                          <h5 class="text-center voucher_code">${VoucherNot.ma}</h5>
                                          <label class="express_date">Hạn Đến: ${formatDate(VoucherNot.endDate1)}</label>
                                          <label class="express_date">Điều Kiện: Áp dụng cho đơn hàng từ ${addCommasToNumber(VoucherNot.giaTriToiThieu) + 'đ'}</label>
                                          <label class="express_date">Tối Đa:${addCommasToNumber(VoucherNot.giaTriToiDa) + 'đ'}/Khách Hàng</label>
                                          <label class="express_date w-100">Số Lượng : ${VoucherNot.soLuong}</label>
                                      </div>
                                      <div class="col-3 p-2 row m-0 card__discount position-relative">
                                          <label class="text-discount">Mã Giảm Giá</label>
                                          ${showPr}
                                      </div>
                                  </div>
                                  <label class="text-danger small w-100 text-voucher-not-accept">Mua thêm ${addCommasToNumber(mt)}đ để sử dụng voucher</label>
                              </li>`;
        $(`#voucher_not_accept_hd_${oder}`).html(li);
    } else {
        $(`#voucher_not_accept_hd_${oder}`).empty();
    }


    let maxDiscountAmount = -Infinity;
    let maxDiscountVoucher = null;
    if (Array.isArray(arrVoucher)) {
        arrVoucher.forEach((voucher) => {
            let discountAmount = tinhTienGiamGia(voucher, total);
            if (discountAmount > maxDiscountAmount) {
                maxDiscountAmount = discountAmount;
                maxDiscountVoucher = voucher;
            }
        });
    }
    if (maxDiscountVoucher !== null) {
        let ele_voucher = $(`#item_${maxDiscountVoucher.id}_${oder}`);
        $(`#best_voucher_voucher_hd_${oder}`).html(ele_voucher);
        ele_voucher.on('animationend', function () {
            $(this).removeClass('scaleIn');
        })
    }
    let payment = total + ship - discountAmount;
    if (ship === 0) {
        wrapper.find('h4.shipping-money').text('Miễn Phí')
    } else {
        wrapper.find('h4.shipping-money').text(addCommasToNumber(ship) + 'đ')
    }
    wrapper.find('h4.total-money').text(addCommasToNumber(total) + 'đ')
    wrapper.find('h4.discount-money').text(addCommasToNumber(discountAmount) + 'đ')
    wrapper.find('h3.payment-money').text(addCommasToNumber(payment) + 'đ')
}

function getTotalMoney(oder) {
    let data = getListProductLocal(oder);
    let total = 0;
    if (data !== null && Array.isArray(data)) {
        data.forEach((pro) => {
            total += Number(pro.quantity) * Number(pro.giaBan);
        })
    }
    let wrapper = $(`#oder_content_${oder}`);
    let type = wrapper.find(`input[name="deliveryOptionCheckbox_hd_${oder}"]:checked`).val();
    let shipFee = getVariableShipping(oder)
    let ship = shipFee === null ? 0 : shipFee;
    if (type === 'CP') {
        if (total > 2000000) {
            ship = 0;
            setVariableShipping(oder, 0);
        }
    }
    if (shipFee == null) {
        ToastError('Vui lòng chọn nơi nhận hàng.')
        return null;
    }
    let discountAmount;
    let selectedVoucher = getVoucher(oder);
    if (selectedVoucher !== null) {
        if (selectedVoucher.loaiVoucher === '%') {
            if (Number(selectedVoucher.giaTriToiDa) < Number(total) * (Number(selectedVoucher.giaTriPhanTram) / 100)) {
                discountAmount = Number(selectedVoucher.giaTriToiDa);
            } else {
                discountAmount = Number(total) * (Number(selectedVoucher.giaTriPhanTram) / 100);
            }
        } else {
            discountAmount = selectedVoucher.giaTriTienMat;
        }
    } else {
        discountAmount = 0;
    }
    return total + ship - discountAmount;
}

let arrProvince = [];
let arrDistrict = [];
let arrWard = [];
fetch('/assets/address-json/province.json')
    .then(response => response.json())
    .then(data => {
        arrProvince = data;
        let tinh = $('#tinhTP');
        let quanHuyen = $('#quanHuyen');
        let phuongXa = $('#phuongXa');
        tinh.append(`<option value="#">Chọn Tỉnh/TP</option>`);
        arrProvince.forEach((item) => {
            tinh.append(`<option value="${item.ProvinceID}">${String(item.ProvinceName)}</option>`)
        })
        quanHuyen.append(`<option value="#">Chọn Quận/Huyện</option>`);
        phuongXa.append(`<option value="#">Chọn Phường/Xã</option>`);
        initSelect2(tinh);
        initSelect2(quanHuyen);
        initSelect2(phuongXa);
    })
    .then(() => {
        return fetch('/assets/address-json/district.json')
            .then(response => response.json())
            .then(data => {
                arrDistrict = data;
            });
    })
    .then(() => {
        return fetch('/assets/address-json/ward.json')
            .then(response => response.json())
            .then(data => {
                arrWard = data;
            });
    })
    .catch(error => console.error('Error:', error));

function printElement(elementToPrint) {
    let iframe = document.getElementById("myFrame");
    let iframeDocument = iframe.contentWindow.document;
    let html = `
               <html>
                   <head>
                       <title>LightBee</title>
                       <link rel="stylesheet" href="/assets/cms/css/vendor.min.css">
                       <link rel="stylesheet" href="/assets/cms/vendor/icon-set/style.css">
                       <link rel="stylesheet" href="/assets/cms/css/custom.css?v=1.0">
                       <link rel="stylesheet" href="/assets/cms/css/cashier.css?v=1.0">
                       <link rel="stylesheet" href="/assets/cms/css/theme.min.css?v=1.0">
                   </head>
                       <body>
                           ${elementToPrint.innerHTML}
                       </body>
                       <script>
                       window.print();
                       </script>
               </html>`
    iframeDocument.open();
    iframeDocument.write(html); // Truyền chuỗi HTML vào phương thức write()
    iframeDocument.close();
    // iframe.contentWindow.print();
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
        icon: status, title: message
    });
}

function ToastSuccess(message) {
    Toast('success', message)
}

function ToastError(message) {
    Toast('error', message)
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

function getOderNum(element) {
    return $(element).closest('.oder-wraper-content').data('id-num-hd');
}

function deleteById(id, oder) {
    let list = getListProductLocal(oder);
    if (list === null) {
        return;
    }
    list = list.filter(item => item.id !== id);
    saveToLocalStorage(list, oder);
    updateTotalMoney(oder);
    ToastSuccess('Xóa thành công.')
}

let Detection = true;

function addProductByBarcode(code) {
    if (Detection) {
        let product = findProductByCode(code);
        if (num_oder_add !== null && product !== null) {
            saveProductToOder(product, num_oder_add, 1);
        }
        Detection = false;
        setTimeout(() => {
            Detection = true;
        }, 2000);
    }
}

function updateQuantityProduct(id, oder, operator, element) {
    let data = getListProductLocal(oder);
    let index = data.findIndex(item => Number(item.id) === Number(id));
    if (index === -1) {
        console.log('K tìm thấy dữ liệu.')
        return;
    }
    if (data[index].quantity === 1 && operator === 'minus') {
        let tr = $(element).closest('tr')
        let tbody = tr.closest('tbody');
        Confirm('Xác Nhận Xóa !', 'Thao tác không thể hoàn tác.', 'Hủy', 'Xác Nhận').then((check) => {
            if (check) {
                deleteById(id, oder);
                if (tbody.find('tr').length === 1) {
                    let html = `<tr class="tr-show-no-data">
                    <td class="table-column-pr-0" rowspan="4">
                        <h5 class="text-center">Chưa có dữ liệu.</h5>
                    </td>
                </tr>`;
                    tbody.append(html)
                }
                tr.remove();
            }
        })
    } else {
        if (operator === 'minus') {
            data[index].quantity = Number(data[index].quantity) - 1;
        } else {
            if (Number(data[index].quantity) + 1 > data[index].soLuongTon) {
                ToastError('Số lượng lớn hơn số lượng tồn.');
                return;
            } else {
                data[index].quantity = Number(data[index].quantity) + 1;
            }
        }
        saveToLocalStorage(data, oder);
        updateTotalMoney(oder);
        PrintHtmlOder(data[index], oder);
    }
    resetShipping(oder);
}

function extractNumberFromString(str) {
    str = str.toString();
    let numberStr = str.replace(/\D/g, '');
    let number = parseInt(numberStr);
    return number;
}

function resetBill(oder) {
    let element = $(`#oder_content_${oder}`);
    saveToLocalStorage([], oder)
    element.find('select.customer-selected[name="khachHang"]').val('#').trigger('change');
    setVariableShipping(oder, 0);
    element.find('table tbody').html(`<tr class="tr-show-no-data">
        <td class="table-column-pr-0" rowSpan="4">
            <h5 class="text-center">Chưa có dữ liệu.</h5>
        </td>
    </tr>`);
    $('input[name="deliveryOptionCheckbox_hd_' + oder + '"][value="TQ"]').prop('checked', true);
    element.find('.wrapper-address-user').addClass('d-none');
    updateTotalMoney(oder);
}

$(document).on('ready', function () {
    $(document).on('click', '.btn-add-customer', function () {
        $('#form-add-customer').modal('show');
        let oder = getOderNum(this);
        $('#id-oder-numnber').val(oder);
        $('#firstName').val('');
        $('#MidName').val('');
        $('#lastName').val('');
        $('#email').val('');
        $('#phone').val('');
        $('#soNha').val('');
        $('#quanHuyen').val('#');
        $('#phuongXa').val('#');
        $('#tinhTP').val('#');
        $('#ngaySinh').val(null);
        $('#text-error-email').text('')
        $('#text-error-phone').text('')
        $('[name="gender_customer"][value="true"]').prop('checked', true);
    })
    $('#body-html').addClass('navbar-vertical-aside-mini-mode');
    $('#styleSwitcherDropdown').addClass('hs-unfold-hidden');
    $(document).on('click', '.input-group-quantity-counter-btn', function () {
        let oder = getOderNum(this);
        let tr = $(this).closest('tr')
        let id = tr.data('id-product')
        if ($(this).hasClass('js-plus')) {
            updateQuantityProduct(id, oder, 'plus', this)
        } else {
            updateQuantityProduct(id, oder, 'minus', this)
        }
        updateTotalMoney(oder)
    })
    $(document).on('change', '.input-group-quantity-counter-control', function () {
        let val = $(this).val();
        if (Number(val) < 1 || isNaN(parseInt(val))) {
            $(this).val(1).trigger('change');
            return;
        }
        let tr = $(this).closest('tr');
        let oder = getOderNum(this)
        let id = tr.data('id-product');
        let data = getListProductLocal(oder);
        let wrapper = $(`#oder_content_${oder}`);
        let i = data.findIndex(item => Number(item.id) === Number(id));
        if (Number(data[i].soLuongTon) < Number(val)) {
            ToastError('Số lượng lớn hơn số lượng tồn.');
        } else {
            data[i].quantity = val;
            saveToLocalStorage(data, oder);
            let giaBan = Number(data[i].giaBan) * Number(val);
            tr.find('input.form-show-total-tr').val(addCommasToNumber(giaBan))
            resetShipping(oder);
            updateTotalMoney(oder);
        }
    })
    $(document).on('click', '.wrapper_voucher', function () {
        if ($(this).hasClass('disabled')) {
            return;
        }
        let oder = getOderNum(this);
        let wrapper = $(`#oder_content_${oder}`)
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            wrapper.find('.input_voucher').val('');
            setVoucher(oder, null);
            updateTotalMoney(oder);
        } else {
            $('.wrapper_voucher').removeClass('active');
            $(this).addClass('active');
            wrapper.find('.input_voucher').val($(this).find('.voucher_code').text())
            let id = $(this).data('id');
            setDiscount(id, oder, updateTotalMoney);
        }
    })
    $(document).on('click', '.btn-apply-voucher', function () {
        let oder = getOderNum(this);
        let wrapper = $(`#oder_content_${oder}`);
        let data = ListVoucher;
        let products = getListProductLocal(oder);
        if (products === null) {
            ToastError('Vui lòng chọn sản phẩm.')
            return;
        }
        let value = wrapper.find('.input_voucher').val();
        if (value.length === 0) {
            ToastError('Vui lòng nhập mã.')
            return;
        }
        if (data !== null && Array.isArray(data)) {
            let voucher = data.find(item => item.ma === value.toUpperCase());
            if (voucher === undefined) {
                ToastError('Mã không tồn tại.');
            } else {
                let totalMoney = 0;
                products.forEach((data) => {
                    totalMoney += Number(data.giaBan) * Number(data.quantity);
                });
                if (totalMoney >= voucher.giaTriToiThieu) {
                    setVoucher(oder, voucher)
                    $('.wrapper_voucher').removeClass('active');
                    $(`#voucher_${voucher.id}_${oder}`).addClass('active');
                    updateTotalMoney(oder);
                    ToastSuccess('Áp dụng thành công.')
                } else {
                    ToastError('Mã không đủ điều kiện áp dụng.');
                }
            }
        }
    })

    function setDiscount(id, oder, callback) {
        let data = ListVoucher;
        if (data !== null && Array.isArray(data)) {
            let voucher = data.find(item => item.id === Number(id));
            if (voucher !== null) {
                setVoucher(oder, voucher);
            } else {
                setVoucher(oder, null);
            }
        } else {
            setVoucher(oder, null);
        }
        callback(oder);
    }

    function TinhTien(oder) {
        if (oder.length === 0) {
            ToastError('oder trống.')
            return false;
        }
        let total = getTotalMoney(oder)
        if (total === null) {
            return false;
        }
        let val = Number($('#pay-cash-money').val().replace(/[^\d]/g, ''));
        let hasTM = $('#payment-type-cash').is(':checked');
        let hasCK = $('#payment-type-card').is(':checked');
        let NH = $('#payment-on-delivery').is(':checked');
        let thua = 0;
        let thieu = total;
        let ck = 0
        if (NH) {
            thieu = total;
            val = 0
            thua = 0
            ck = 0
        }
        if (!hasTM && hasCK) {
            ck = total
            thieu = 0
        }
        if (hasTM && !hasCK) {
            if (val >= total) {
                thua = val - total;
                thieu = 0;
            } else {
                thieu = total - val;
                thua = 0
            }
        }
        if (hasCK && hasTM) {
            if (val < total) {
                ck = total - val;
                thua = 0;
            } else {
                thua = val - total;
            }
            if (val + ck > total) {
                thua = val + ck - total
            } else {
                thua = 0;
            }
            thieu = 0;
        }
        $('#change-money').val(addCommasToNumber(thua))
        $('#pay-chuyen-khoan-money').val(addCommasToNumber(ck))
        $('#lack-of-money').val(addCommasToNumber(thieu))
        return true;
    }

    $(document).on('input', '#pay-cash-money', function () {
        let oder = $('#modal-input-id-oder').val()
        TinhTien(oder);
        let val = $(this).val();
        let money1 = val + '00000';
        let money2 = val + '000000';
        money1 = Number(money1);
        money2 = Number(money2);
        let element = $('#suggests-money');
        if (money1 <= 1000000000 && val.length !== 0) {
            element.html(`<span data-value="${addCommasToNumber(money1)}" class="badge badge-pill badge-light badge-suggests-money mr-2">${addCommasToNumber(money1)}</span>`);
            element.append(`<span data-value="${addCommasToNumber(money2)}" class="badge badge-pill badge-light badge-suggests-money">${addCommasToNumber(money2)}</span>`)
        } else {
            element.html(`<span data-value="100.000" class="badge badge-pill badge-light badge-suggests-money">100.000</span>`);
        }

    });
    $(document).on('click', '.badge-suggests-money', function () {
        let val = $(this).data('value');
        $('#pay-cash-money').val(val);
        let oder = $('#modal-input-id-oder').val()
        TinhTien(oder);
    })

    $(document).on('change', '#payment-type-card', function () {
        let isChecked = $(this).is(':checked');
        let wrap = $('.body-modal-payment');
        let qr = $('.show-qr-payment');
        let size = $('.setup-modal-size');
        let tck = $('.wrapper-money-ck');
        let showcode = $('#pay-card-money').closest('.input-group');
        let oder = $('#modal-input-id-oder').val()
        TinhTien(oder);
        if (isChecked) {
            wrap.addClass('col-4');
            wrap.removeClass('col-6');
            qr.removeClass('d-none');
            tck.removeClass('d-none');
            size.addClass('modal-xl');
            showcode.removeClass('d-none');
            $('#payment-on-delivery').prop('checked', false);
        } else {
            wrap.removeClass('col-4');
            wrap.addClass('col-6');
            qr.addClass('d-none');
            tck.addClass('d-none');
            size.removeClass('modal-xl');
            showcode.addClass('d-none');
        }
        let checkTM = $('#payment-type-cash').is(':checked')
        let tienmat = $('.wrapper-money-tm');
        if (checkTM) {
            tienmat.removeClass('d-none')
        } else {
            tienmat.addClass('d-none');
        }
    })
    $(document).on('change', '#payment-on-delivery', function () {
        let check = $(this).is(':checked');
        let wrap = $('.body-modal-payment');
        let qr = $('.show-qr-payment');
        let size = $('.setup-modal-size');
        let tck = $('.wrapper-money-ck');
        let tm = $('.wrapper-money-tm');
        let showcode = $('#pay-card-money').closest('.input-group');
        if (check) {
            $('#payment-type-card').prop('checked', false);
            $('#payment-type-cash').prop('checked', false);
            wrap.removeClass('col-4');
            wrap.addClass('col-6');
            qr.addClass('d-none');
            tm.addClass('d-none');
            tck.addClass('d-none');
            size.removeClass('modal-xl');
            showcode.addClass('d-none');
        }
        let oder = $('#modal-input-id-oder').val()
        TinhTien(oder);
    })
    $(document).on('change', '#payment-type-cash', function () {
        let check = $(this).is(':checked');
        let tienmat = $('.wrapper-money-tm');
        let oder = $('#modal-input-id-oder').val()
        TinhTien(oder);
        if (check) {
            $('#payment-on-delivery').prop('checked', false);
            tienmat.removeClass('d-none')
        } else {
            tienmat.addClass('d-none');
        }
    })
    $(document).on('click', '.btn-payment-oder', function () {
        let oder = getOderNum(this);
        let bool = TinhTien(oder);
        if (!bool) {
            return;
        }
        let wrapper = $(`#oder_content_${oder}`);
        let typeNH = wrapper.find(`[name="deliveryOptionCheckbox_hd_${oder}"]:checked`).val();
        if (typeNH === null || typeNH === undefined) {
            ToastError('Vui lòng chọn nơi nhận hàng.')
            return;
        }
        let newAddres = wrapper.find('.wrapper-option-address-khac');
        if (typeNH === 'CP') {
            let hoTen = newAddres.find('input.hoTen');
            let soDT = newAddres.find('input.soDienThoai');
            let Email = newAddres.find('input.email');
            let soNha = newAddres.find('input.soNha');
            let regexPhone = /^0[0-9]{9}$/;
            let regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (hoTen.length > 0) {
                if (hoTen.val().length === 0) {
                    ToastError('Vui lòng nhập tên.');
                    return;
                }
                if (hoTen.val().length < 3) {
                    ToastError('Tên phải lớn hơn 3 ký tự.');
                    return;
                }
            }
            if (soDT.length > 0) {
                if (soDT.val().length === 0) {
                    ToastError('Vui lòng nhập số điện thoại.');
                    return;
                }
                if (!regexPhone.test(soDT.val())) {
                    ToastError('Số điện thoại không đúng định dạng.');
                    return;
                }
            }
            if (Email.length > 0) {
                if (Email.val().length === 0) {
                    ToastError('Vui lòng nhập email.');
                    return;
                }
                if (!regexEmail.test(Email.val())) {
                    ToastError('Email không đúng định dạng.');
                    return;
                }
            }
            if (soNha.length > 0) {
                if (soNha.val().length === 0) {
                    ToastError('Vui lòng nhập số nhà.');
                    return;
                }
            }
        }
        let sp = getListProductLocal(oder)
        if (sp.length === 0) {
            ToastError('Vui lòng chọn sản phẩm.')
            return;
        }
        $('#form-modal-payment').modal('show');
        $('#modal-input-id-oder').val(oder);
        $('#total-money').val(addCommasToNumber(getTotalMoney(oder) == null ? 0 : getTotalMoney(oder)))
        let input = $(`input[name="deliveryOptionCheckbox_hd_${oder}"]:checked`).val();
        if (input === 'CP') {
            $('#payment-on-delivery').closest('div.form-group').removeClass('d-none')
        } else {
            $('#payment-on-delivery').closest('div.form-group').addClass('d-none')
        }
        $('#lack-of-money').val(addCommasToNumber(getTotalMoney(oder)))
    })
    $(document).on('shown.bs.modal', '#form-modal-payment', function () {
        $('#pay-cash-money').val('').focus();
    })
    $(document).on('hidden.bs.modal', '#form-modal-payment', function () {
        $('#pay-cash-money').val('');
        $('#change-money').val(0);
        $('#payment-type-card').prop('checked', false);
        $('#payment-on-delivery').prop('checked', false);
        $('#payment-type-cash').prop('checked', true).trigger('change');
    })
    $(document).on('input', '.money-input-mask', function () {
        $(this).mask('#.###.###.###', {reverse: true});
    });

    $(document).on('click', '.btn-delete-tr-oder', function () {
        let tr = $(this).closest('tr');
        let id = tr.data('id-product');
        let oder = tr.data('id-hd');
        let tbody = tr.closest('tbody');
        Confirm('Xác Nhận Xóa !', 'Thao tác không thể hoàn tác.', 'Hủy', 'Xác Nhận').then((check) => {
            if (check) {
                deleteById(id, oder);
                if (tbody.find('tr').length === 1) {
                    let html = `<tr class="tr-show-no-data">
                    <td class="table-column-pr-0" rowspan="4">
                        <h5 class="text-center">Chưa có dữ liệu.</h5>
                    </td>
                </tr>`;
                    tbody.append(html)
                }
                tr.remove();
                resetShipping(oder);
            }
        })
    })

    let typingTimer;
    let doneTypingInterval = 1500;
    $(document).on('input', '#email', function () {
        clearTimeout(typingTimer);
        let email = $(this).val();
        let regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (email.length === 0) {
            $('#text-error-email').text('Vui lòng nhập email.');
        } else if (!regexEmail.test(email)) {
            $('#text-error-email').text('Email không đúng định dạng.');
        } else {
            $('#text-error-email').text('');
            typingTimer = setTimeout(() => {
                $.ajax({
                    url: '/api/check-valid-email',
                    type: 'POST',
                    data: {email: email},
                    success: function (data) {
                        if (data) {
                            $('#text-error-email').text('Email đã tồn tại.');
                        }
                    }
                });
            }, doneTypingInterval);
        }
    });
    let typingPhoneTimer;
    let doneTypingPhoneInterval = 1500;
    $(document).on('input', '#phone', function () {
        clearTimeout(typingPhoneTimer);
        let phone = $(this).val().replace(/\s/g, '');
        let regexPhone = /^0[0-9]{9}$/;
        if (phone.length === 0) {
            $('#text-error-phone').text('Vui lòng nhập số điện thoại.');
        } else if (!regexPhone.test(phone)) {
            $('#text-error-phone').text('Số điện thoại không đúng định dạng.');
        } else {
            $('#text-error-phone').text('');
            typingPhoneTimer = setTimeout(() => {
                $.ajax({
                    url: '/api/check-valid-phone',
                    type: 'POST',
                    data: {phone: phone},
                    success: function (data) {
                        if (data) {
                            $('#text-error-phone').text('Số điện thoại đã tồn tại.');
                        }
                    }
                });
            }, doneTypingPhoneInterval);
        }
    });
    $(document).on('click', '#btn-save-customer', function () {
        let oder = $('#id-oder-numnber').val()
        let wrapper = $(`#oder_content_${oder}`);
        let ho = $('#firstName').val();
        let tenDem = $('#MidName').val();
        let ten = $('#lastName').val();
        let email = $('#email').val();
        let soDT = $('#phone').val().replace(/\s/g, '');
        let soNha = $('#soNha').val();
        let quanHuyen = $('#quanHuyen').find('option:selected').text();
        let phuongXa = $('#phuongXa').find('option:selected').text();
        let tinh = $('#tinhTP').find('option:selected').text();
        let ngaySinh = $('#ngaySinh').val();
        let gender = $('[name="gender_customer"]:checked').val();
        let regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        let regexPhone = /^0[0-9]{9}$/;
        if (ho.replace(/\s/g, "").length === 0) {
            ToastError('Vui lòng nhập họ.');
            return;
        }
        if (tenDem.replace(/\s/g, "").length === 0) {
            ToastError('Vui lòng nhập tên đệm.');
            return;
        }
        if (ten.replace(/\s/g, "").length === 0) {
            ToastError('Vui lòng nhập tên.');
            return;
        }
        if (email.length === 0) {
            ToastError('Vui lòng nhập email.');
            return;
        }
        if (!regexEmail.test(email)) {
            ToastError('Email không đúng định dạng.');
            return;
        }
        if (soDT.length === 0) {
            ToastError('Vui lòng nhập số điện thoại.');
            return;
        }
        if (!regexPhone.test(soDT)) {
            ToastError('Vui lòng nhập số điện thoại.');
            return;
        }
        if (gender.length === 0) {
            ToastError('Vui lòng chọn giới tính.');
            return;
        }
        if (ngaySinh.length === 0) {
            ToastError('Vui lòng chọn ngày sinh.');
            return;
        }
        if (soNha.replace(/\s/g, "").length === 0) {
            ToastError('Vui lòng nhập số nhà.');
            return;
        }
        if ($('#phuongXa').val() === '#') {
            ToastError('Vui lòng chọn phường xã.');
            return;
        }
        if ($('#quanHuyen').val() === '#') {
            ToastError('Vui lòng chọn quận huyện.');
            return;
        }
        if ($('#tinhTP').val() === '#') {
            ToastError('Vui lòng chọn tỉnh.');
            return;
        }
        let fullname = `${ho} ${tenDem} ${ten}`;
        $.ajax({
            url: '/api/add-new-customer',
            type: 'POST',
            data: {
                hoTen: fullname,
                email: email,
                gioiTinh: gender,
                ngaySinh: ngaySinh,
                sdt: soDT,
                soNha: soNha,
                phuongXa: phuongXa,
                quanHuyen: quanHuyen,
                tinhThanhPho: tinh,
            },
            success: function (data) {
                let html = `<option value="${data.id}" data-phone="${data.phone}" data-email="${data.mail}">${data.ten + '-' + data.ma}</option>`;
                let select = wrapper.find('select.customer-selected');
                select.prepend(html);
                ToastSuccess('Thêm thành công.')
                $('#form-add-customer').modal('hide');
            },
            error: function (e) {
                console.log(e.getResponseHeader('status'));

                switch (e.getResponseHeader('status')) {

                    case 'emtyHoTen':
                        ToastError('Họ Tên trống.');
                        break;

                    case 'emtySDT':
                        ToastError('Số điện thoại trống.');
                        break;

                    case 'exitsBySDT':
                        ToastError('Số điện thoại đã tồn tại.');
                        break;

                    case 'emtyEmail':
                        ToastError('Email trống.');
                        break;
                    case 'exitsByEmail':
                        ToastError('Email đã tồn tại.');
                        break;

                    case 'emtySoNha':
                        ToastError('Số nhà trống.');
                        break;

                    case 'emtyPhuongXa':
                        ToastError('Phường xã trống.');
                        break;

                    case 'emtyQuanHuyen':
                        ToastError('Quận huyện trống.');
                        break;

                    case 'emtyTinhTP':
                        ToastError('Tỉnh thành phố trống.');
                        break;

                    default:
                        ToastError('Lỗi.');
                }
            }
        })
    })

    $(document).on('change', '.option-select-receipt', function () {
        let oder = getOderNum(this);
        let val = $(this).val();
        let wrapper = $(`#oder_content_${oder}`);
        if (val === 'CP') {
            setVariableShipping(oder, null);
            wrapper.find('.wrapper-address-user').removeClass('d-none');
        } else {
            setVariableShipping(oder, 0);
            $(`.option-select-address[name="address_khac_${oder}"]`).prop('checked', false);
            wrapper.find('.wrapper-address-user').addClass('d-none');
        }
        updateTotalMoney(oder);
    })

    $(document).on('click', '.payment-success', function () {
        let oder = $('#modal-input-id-oder').val();
        let hasTM = $('#payment-type-cash').is(':checked');
        let hasCK = $('#payment-type-card').is(':checked');
        let NH = $('#payment-on-delivery').is(':checked');
        if (hasTM) {
            let tienThieu = extractNumberFromString($('#lack-of-money').val());
            if (tienThieu > 1) {
                ToastError('Vui lòng nhập số tiền thanh toán.')
                return;
            }
        }
        let transferCode = $('#pay-card-money').val().replace(/\s/g, "");
        if (hasCK) {
            if (transferCode.length === 0) {
                ToastError('Vui lòng nhập mã giao dịch.')
                return;
            }
        }
        let listProduct = getListProductLocal(oder);
        let arrPro = [];
        listProduct.forEach((item) => {
            let oj = {
                id: item.id, quantity: item.quantity,
            }
            arrPro.push(oj);
        })
        let wrapper = $(`#oder_content_${oder}`);
        let khachHang = wrapper.find('select.customer-selected[name="khachHang"]').val();
        let typeNH = wrapper.find(`[name="deliveryOptionCheckbox_hd_${oder}"]:checked`).val();
        let diaChiNhanHang = '';
        let nameCus = '';
        let phoneCus = '';
        let emailCus = '';
        if (typeNH === 'CP') {
            let dc = wrapper.find(`.option-select-address[name="address_khac_${oder}"]:checked`);
            if (dc.val() === '#') {
                nameCus = wrapper.find('input.hoTen').val();
                phoneCus = wrapper.find('input.soDienThoai').val();
                emailCus = wrapper.find('input.email').val();
            }
            if (dc.val() !== '#') {
                let label = wrapper.find(`label[for="${dc.attr('id')}"]`);
                let nameSoNha = label.find('span.soNha').text()
                let nameXa = label.find('span.phuongXa').text()
                let nameHyen = label.find('span.quanHuyen').text()
                let nameTinh = label.find('span.tinhTP').text()
                diaChiNhanHang = nameSoNha + ', ' + nameXa + ', ' + nameHyen + ', ' + nameTinh;
            } else {
                let nameSoNha = wrapper.find('input.soNha').val();
                let nameXa = wrapper.find('select.phuongXa').find('option:selected').text();
                let nameHuyen = wrapper.find('select.quanHuyen').find('option:selected').text();
                let nameTinh = wrapper.find('select.tinhTP').find('option:selected').text();
                diaChiNhanHang = nameSoNha + ', ' + nameXa + ', ' + nameHuyen + ', ' + nameTinh;
            }
        }
        let typePayment = {
            tienMat: hasTM, chuyenKhoan: hasCK, khiNhanHang: NH
        }
        let shippingFe = getVariableShipping(oder);
        let cash = $('#pay-cash-money').val().replace(/[.,]/g, '');
        if (cash === null || cash === undefined) {
            cash = 0;
        }
        // let total = $('#total-money').val().replace(/[.,]/g, '');
        let transfer = $('#pay-chuyen-khoan-money').val().replace(/[.,]/g, '');
        if (transfer === null || transfer === undefined) {
            transfer = 0;
        }

        let voucher = getVoucher(oder)
        let code = '';
        if (voucher !== null) {
            code = voucher.ma
        }
        $.ajax({
            url: '/api/hoa-don/payment-cashier',
            type: 'POST',
            data: {
                product: JSON.stringify(arrPro),
                customer: khachHang,
                receivingType: typeNH,
                address: diaChiNhanHang,
                typePayment: JSON.stringify(typePayment),
                cash: cash,
                transfer: transfer,
                transferCode: transferCode,
                voucher: code,
                shippingFee: shippingFe,
                shippingCode: shippingCode,
                hoten: nameCus,
                email: emailCus,
                sdt: phoneCus,
            }, success: function (data) {
                PrintBillOder(data);
                resetBill(oder)
                ToastSuccess('Thành công.');
                $('#form-modal-payment').modal('hide');
            }, error: function (error) {
                console.log(error)
                console.log(error.getResponseHeader("status"))
                switch (error.getResponseHeader("status")) {
                    case 'minQuantityPro':
                        ToastError('Số lượng sản phẩm vượt quá số lượng tồn');
                        break;
                    case 'zeroQuantityPro':
                        ToastError('Sản phẩm hiện đang hết hàng.');
                        break;
                    case 'ZeroVoucher':
                        ToastError('Số lượng mã giảm giá đã hết.');
                        break;
                    case 'paymentError':
                        ToastError('Đơn tại quầy không thể thiếu.');
                        break;
                    default:
                        ToastError(error.getResponseHeader("status"))
                }
            }
        })
    })

    function getOptionAddress(id, oder) {
        $.ajax({
            url: '/api/get-address-by-customer', type: 'GET', data: {id: id}, success: function (data) {
                if (Array.isArray(data)) {
                    let html = '';
                    data.forEach((ad) => {
                        html += `
                                   <div class="custom-control custom-radio ml-3">
                                        <input type="radio" id="address_customer_${oder}_${ad.id}"
                                               name="address_khac_${oder}"
                                               class="custom-control-input option-select-address" value="${ad.id}">
                                        <label class="custom-control-label custom-address" for="address_customer_${oder}_${ad.id}">
                                            <span class="d-block mb-1 soNha">${ad.soNha}</span>,
                                            <span class="d-block mb-1 phuongXa">${ad.phuongXa}</span>,
                                            <span class="d-block mb-1 quanHuyen">${ad.quanHuyen}</span>,
                                            <span class="d-block mb-1 tinhTP">${ad.tinhThanhPho}</span>
                                        </label>
                                    </div>`;
                    });
                    $(`#oder_content_${oder}`).find('.wrapper-address-user .show-list-user').html(html);
                }
            }, error: function (xhr) {
                console.log(xhr)
            }
        })
    }

    $(document).on('input', '.hoTen,.soDienThoai,.email,.soNha', function () {
        let oder = getOderNum(this)
        let element = $(this);
        let val = element.val();
        let regexPhone = /^0[0-9]{9}$/;
        let regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        let checkName = true;
        let checkPhone = true;
        let checkEmail = true;
        if (element.hasClass('hoTen')) {
            if (val.length < 3) {
                element.parent().find('span.text-error-hoten').text('Tên phải lớn hơn 2 ký tự.')
                checkName = false;
            }
            if (val.length === 0) {
                element.parent().find('span.text-error-hoten').text('Vui lòng nhập tên.')
                checkName = false;
            }
        }
        if (element.hasClass('soDienThoai')) {
            if (!regexPhone.test(val)) {
                element.parent().find('span.text-error-soDienThoai').text('Số điện thoại không đúng định dạng.')
                checkPhone = false;
            }
            if (val.length === 0) {
                element.parent().find('span.text-error-soDienThoai').text('Vui lòng nhập số điện thoại.')
                checkPhone = false;
            }

        }
        if (element.hasClass('email')) {
            if (!regexEmail.test(val)) {
                element.parent().find('span.text-error-email').text('Email không đúng định dạng.')
                checkEmail = false;
            }
            if (val.length === 0) {
                element.parent().find('span.text-error-email').text('Vui lòng nhập email.')
                checkEmail = false;
            }


        }
        if (element.hasClass('soNha')) {
            if (val.length === 0) {
                element.parent().find('span.text-error-soNha').text('Vui lòng nhập số nhà.')
            } else {
                element.parent().find('span.text-error-soNha').text('')
            }
        }
        if (checkName) {
            element.parent().find('span.text-error-hoten').text('')
        }

        if (checkEmail) {
            element.parent().find('span.text-error-email').text('')
        }

        if (checkPhone) {
            element.parent().find('span.text-error-soDienThoai').text('')
        }
    })
    $(document).on('change', '.option-select-address', async function () {
        let oder = getOderNum(this);
        // let data = getListProductLocal(oder);
        // if (data.length === 0) {
        //     ToastError('Vui lòng chọn sản phẩm.')
        //     $(this).prop('checked', false).trigger('change')
        //     return;
        // }
        let input = $(`input[name="address_khac_${oder}"]:checked`);
        let val = input.val();
        let wrapper = $(`#oder_content_${oder}`);
        if (val === '#') {
            let khachhang = wrapper.find('select.customer-selected');
            let val = khachhang.val();
            let hoten = '';
            let email = '';
            let sdt = '';
            if (val !== '#') {
                let option = khachhang.find('option:selected');
                email = option.data('email');
                sdt = option.data('phone');
                let name = option.text().split('-');
                hoten = name[0];
            }
            let province = '<option value="#">Chọn Tỉnh</option>';
            if (Array.isArray(arrProvince)) {
                arrProvince.forEach((item) => {
                    province += `<option value="${item.ProvinceID}">${String(item.ProvinceName)}</option>`;
                })
            }
            let html = `
                    <div class="form-group col-4 mb-3">
                        <label for="hoTen_${oder}" class="mb-0">Họ Tên:</label>
                        <input class="form-control hoTen" id="hoTen_${oder}" type="text" value="${hoten}">
                        <span class="text-danger text-error-hoten"></span>
                    </div>
                    <div class="form-group col-4 mb-3">
                        <label for="soDienThoai_${oder}" class="mb-0">Số Điện Thoại:</label>
                        <input class="form-control soDienThoai" id="soDienThoai_${oder}" type="text" value="${sdt}">
                        <span class="text-danger text-error-soDienThoai"></span>
                    </div>
                    <div class="form-group col-4 mb-3">
                        <label for="email_${oder}" class="mb-0">Email:</label>
                        <input class="form-control email" id="email_${oder}" type="text" value="${email}">
                        <span class="text-danger text-error-email"></span>
                    </div>
                    <div class="form-group col-6 mb-3">
                        <label for="soNha_${oder}" class="mb-0">Số Nhà:</label>
                        <input class="form-control soNha" id="soNha_${oder}" type="text">
                        <span class="text-danger text-error-soNha"></span>
                    </div>
                    <div class="form-group col-6 mb-3">
                        <label for="tinhTP_${oder}" class="mb-0">Tỉnh/TP:</label>
                        <select class="js-select2-custom custom-select tinhTP"
                                id="tinhTP_${oder}" type="text"
                                data-hs-select2-options='{
                        "placeholder": "Tìm Tỉnh/TP...",
                        "searchInputPlaceholder": "Tìm Tỉnh/TP..."}'>${province}</select>
                    </div>
                    <div class="form-group col-6 mb-3">
                        <label for="quanHuyen_${oder}" class="mb-0">Quận/Huyện:</label>
                        <select class="js-select2-custom custom-select quanHuyen"
                                id="quanHuyen_${oder}" type="text"
                                data-hs-select2-options='{
                        "placeholder": "Tìm Quận/Huyện...",
                        "searchInputPlaceholder": "Quận/Huyện..."}'> </select>
                    </div>
                    <div class="form-group col-6 mb-3">
                        <label for="phuongXa_${oder}" class="mb-0">Phường/Xã:</label>
                        <select class="js-select2-custom custom-select phuongXa"
                                id="phuongXa_${oder}" type="text"
                                data-hs-select2-options='{
                        "placeholder": "Tìm Phường/Xã...",
                        "searchInputPlaceholder": "Tìm Phường/Xã..."}'> </select>
                    </div>`;
            wrapper.find('.wrapper-option-address-khac').html(html);
            $('.js-select2-custom').each(function () {
                initSelect2($(this));
            });
            setVariableShipping(oder, null);
        } else {
            resetShipping(oder);
            wrapper.find('.wrapper-option-address-khac').empty();
        }
        updateTotalMoney(oder);
    })
    $(document).on('change', 'select.custom-select.phuongXa', async function () {
        let code = $(this).val();
        let oder = getOderNum(this);
        let quan = $(`#oder_content_${oder}`).find('select.custom-select.quanHuyen').val();
        let data = getListProductLocal(oder);
        if (data.length === 0) {
            setVariableShipping(oder, null);
            updateTotalMoney(oder);
            ToastError('Vui lòng chọn sản phẩm.')
        }
        let result = await getShippingFee(oder, code, quan);
        if (result !== null) {
            setVariableShipping(oder, result.data.total_fee);
            updateTotalMoney(oder);
        } else {
            setVariableShipping(oder, null);
        }
    })
    $(document).on('click', '.js-create-field', function () {
        let oder = getOderNum(this);
        $(`#searchProduct_hd_${oder}`).focus().trigger('focus');
    })
    $(document).on('change', '#tinhTP', function () {
        let quanHuyen = $('#quanHuyen');
        let phuongXa = $('#phuongXa');
        let val = $(this).val();
        quanHuyen.html('<option value="#">Chọn Quận/Huyện</option>');
        phuongXa.html('<option value="#">Chọn Phường/Xã</option>');
        if (val.length > 0) {
            arrDistrict.forEach(function (item) {
                if (Number(item.ProvinceID) === Number(val)) {
                    let html = `<option value="${item.DistrictID}">${String(item.DistrictName)}</option>`;
                    quanHuyen.append(html);
                }
            })
        }
        initSelect2(quanHuyen);
        initSelect2(phuongXa);
    })
    $(document).on('change', '#quanHuyen', function () {
        let phuongXa = $('#phuongXa');
        let val = $(this).val();
        phuongXa.html('<option value="#">Chọn Phường/Xã</option>');
        if (val.length > 0) {
            arrWard.forEach(function (item) {
                if (Number(item.DistrictID) === Number(val)) {
                    let html = `<option value="${item.Code}">${String(item.Name)}</option>`;
                    phuongXa.append(html);
                }
            })
        }
        initSelect2(phuongXa);
    })
    $(document).on('change', 'select.custom-select.tinhTP', function () {
        let oder = getOderNum(this);
        let wrapper = $(`#oder_content_${oder}`);
        let quanHuyen = wrapper.find('select.custom-select.quanHuyen');
        let phuongXa = wrapper.find('select.custom-select.phuongXa');
        let val = $(this).val();
        quanHuyen.html('<option value="">Quận/Huyện</option>');
        phuongXa.html('<option value="">Phường/Xã</option>');
        if (val.length > 0) {
            arrDistrict.forEach(function (item) {
                if (Number(item.ProvinceID) === Number(val)) {
                    let html = `<option value="${item.DistrictID}">${String(item.DistrictName)}</option>`;
                    quanHuyen.append(html);
                }
            })
        }
        initSelect2($(quanHuyen));
    })
    $(document).on('change', 'select.custom-select.quanHuyen', function () {
        let oder = getOderNum(this);
        let wrapper = $(`#oder_content_${oder}`);
        let phuongXa = wrapper.find('select.custom-select.phuongXa');
        let val = $(this).val();
        phuongXa.html('<option value="">Phường/Xã</option>');
        if (val.length > 0) {
            arrWard.forEach(function (item) {
                if (Number(item.DistrictID) === Number(val)) {
                    let html = `<option value="${item.Code}">${String(item.Name)}</option>`;
                    phuongXa.append(html);
                }
            })
        }
        initSelect2(phuongXa);
    })
    $(document).on('click', '.li-item-ctsp-search', function () {
        let id_pro = $(this).data('ctsp-id');
        let oder = getOderNum(this);
        let product = findProductById(id_pro);
        saveProductToOder(product, oder, 1);
    })

    let modalBarcode = $('#form-modal-barcode');
    $(document).on('click', '.btn-scan-barcode', function () {
        let oder = getOderNum(this);
        num_oder_add = oder;
        modalBarcode.modal('show');
    })
    modalBarcode.on('shown.bs.modal', function () {
        let video = document.getElementById("video_show_camera");
        let beepSound = document.getElementById("sound_beep");
        Quagga.init({
            inputStream: {
                name: "Live", type: "LiveStream", target: document.querySelector("#show_video_live"), constraints: {
                    width: 640, height: 480, facingMode: "environment",
                },
            }, decoder: {
                readers: ["code_128_reader"],
            },
        }, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
        });
        Quagga.onDetected(function (result) {
            if (canRunDetection) {
                addProductByBarcode(result.codeResult.code)
                beepSound.play();
                canRunDetection = false;
                setTimeout(() => {
                    canRunDetection = true;
                }, 2000);
            }
        });

    });
    modalBarcode.on('hidden.bs.modal', function () {
        Quagga.stop();
    });
    $(document).on('change', '.customer-selected', function () {
        let oder = getOderNum(this);
        let wrapper = $(`#oder_content_${oder}`);
        $('input[name="deliveryOptionCheckbox_hd_' + oder + '"][value="TQ"]').prop('checked', true);
        wrapper.find('.wrapper-address-user').addClass('d-none');
        let content = $(this).closest('.oder-wraper-content');
        wrapper.find('.wrapper-option-address-khac').empty();
        wrapper.find('.option-select-address').prop('checked', false);
        let val = $(this).val();
        setVariableShipping(oder, 0);
        setVoucher(oder, null);
        getAllVoucher(val).then((res) => {
            ListVoucher = res;
            wrapper.find('.input_voucher').val('');
            $(`#best_voucher_voucher_hd_${oder}`).empty();
            $(`#list_show_voucher_hd_${oder}`).empty();
            updateTotalMoney(oder);
        })
        if (val !== '#') {
            let option = $(this).find('option:selected');
            let arrName = option.text().split('-');
            let name = arrName[0];
            let cusCode = arrName[1];
            let phone = option.data('phone');
            let email = option.data('email');
            content.find('strong.fullName-customer').text(name)
            content.find('strong.email-customer').text(email)
            content.find('strong.phone-customer').text(phone)
            content.find('strong.code-customer').text(cusCode)
            getOptionAddress(val, oder);
        } else {
            $(`#oder_content_${oder}`).find('.wrapper-address-user .show-list-user').html('');
            content.find('strong.fullName-customer').text('')
            content.find('strong.email-customer').text('')
            content.find('strong.phone-customer').text('')
            content.find('strong.code-customer').text('')
        }
    })
    $(document).on('click', '.btn-delete-oder', function () {
        Confirm('Xác Nhận Xóa !', 'Sau khi xóa sẽ không thể hoàn tác', 'Đóng', 'Xác Nhận').then(check => {
            if (check) {
                let li = $(this).closest('li.nav-item');
                let a = li.find('a.nav-link');
                if (a.hasClass('active')) {
                    let prevLi = li.prev();
                    if (prevLi.length !== 0) {
                        let id = prevLi.find('a.nav-link').attr('href');
                        prevLi.find('a.nav-link').addClass('active');
                        $(id).addClass('show active')
                    } else {
                        let nextLi = li.next();
                        if (nextLi.length !== 0) {
                            let id = nextLi.find('a.nav-link').attr('href');
                            nextLi.find('a.nav-link').addClass('active');
                            $(id).addClass('show active')
                        }
                    }
                }
                let id_ct = a.attr('href');
                let element = $(id_ct);
                let id = element.children().data('id-num-hd');
                setVariableShipping(id, 0);
                saveToLocalStorage([], id)
                element.remove();
                li.remove();
                ToastSuccess('Xóa Thành Công.')
            }
        })
    })
    $('#btn-add-new-bill').on('click', function () {
        let listItem = $('#list-item-oder');
        let tabContent = $('#tab-content-show');
        let quantity_oder = listItem.find('li');
        if (quantity_oder.length > 4) {
            ToastError('Số lượng hóa đơn chờ đạt tối đa.')
            return;
        }
        let numId = quantity_oder.length + 1
        if ($(`#oder_content_${numId}`).length > 0) {
            for (let i = 1; i < 9; i++) {
                if ($(`#oder_content_${i}`).length === 0) {
                    numId = i;
                    break;
                }
            }
        }
        let navTtem = ` <li class="nav-item position-relative">
                <a class="nav-link nav-show-oder" id="nav-link-tab-${numId}" data-toggle="pill" href="#nav-content-tab-${numId}" role="tab"
                   aria-controls="nav-content-tab-${numId}" aria-selected="false">Hóa Đơn ${numId}</a>
                <i class="tio-clear btn-delete-oder"></i>
            </li>`;
        listItem.append(navTtem)
        let contentMau = $('#oder_content_mau');
        let div = contentMau.clone();
        div.find('h4.header-title').text('Hóa Đơn ' + numId);
        div.find('select.customer-selected').addClass('js-select2-custom')
        div.find('[data-id-hd]').each((index, ele) => {
            let curentId = $(ele).attr('id');
            let id = $(ele).data('id-hd') + numId;
            let type = $(ele).attr('type');
            let td_type = $(ele).data('type');
            if (td_type === 'collapse') {
                $(ele).attr('id', id)
                $(ele).find('div.collapse').attr('data-parent', id)
            }
            if (type === 'checkbox') {
                div.find(`label[for=${curentId}]`).attr('for', id);
            }
            if (type === 'radio') {
                div.find(`label[for='${curentId}']`).attr('for', id + '_' + index);
                $(ele).attr('id', id + '_' + index)
                $(ele).attr('name', id)
            } else {
                $(ele).attr('id', id)
            }
        })
        let navContent = `<div class="tab-pane fade" id="nav-content-tab-${numId}" role="tabpanel" aria-labelledby="nav-link-tab-${numId}">
             <div id="oder_content_${numId}" class="row oder-wraper-content" data-id-num-hd="${numId}">
              ${div.html()}
              </div>
             </div>`;
        tabContent.append(navContent);
        initializeHSFormSearch();
        $('.js-select2-custom').each(function () {
            initSelect2($(this));
        });
    })


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

    // INITIALIZATION OF QUANTITY COUNTER
    // =======================================================
    $('.js-quantity-counter').each(function () {
        var quantityCounter = new HSQuantityCounter($(this)).init();
    });
    $(document).on('input', '.form-input-search', function () {
        let val = $(this).val();
        let formShow = $(this).closest('.wrapper-form-search').find('.div-form-search');
        formShow.removeClass('d-none')
        let list = [...dataProductDetails];
        let li = formShow.find('li');
        li.removeClass('d-none');
        if (val.length > 0) {
            list.forEach((ctsp) => {
                let propertiesToCheck = ['ten', 'tenMau', 'maSanPham', 'kichCo'];
                let isHave = propertiesToCheck.some(property => ctsp[property].toString().toLowerCase().includes(val.toLowerCase()));
                if (!isHave) {
                    formShow.find(`li.li-item-ctsp-search[data-ctsp-id="${ctsp.id}"]`).addClass('d-none');
                }
            });
        }
    });
    $(document).on('focus click input', '.form-input-search', function () {
        let formShow = $(this).closest('.wrapper-form-search').find('.div-form-search');
        formShow.removeClass('d-none');
    });
    $(document).on('blur', '.form-input-search', function () {
        let formShow = $(this).closest('.wrapper-form-search').find('.div-form-search');
        if (!formShow.is(':hover')
            && !$(this).is('focus')) {
            formShow.addClass('d-none');
        }
    });

    $(document).on('mouseleave', '.div-form-search', function () {
        $(this).addClass('d-none');
    });

    $(document).on('click', '#addCustomer', function () {
        alert('add customer');
    })

    // INITIALIZATION OF ADD INPUT FILED
    // =======================================================
    $('.js-add-field').each(function () {
        new HSAddField($(this), {
            addedField: function () {
                $('.js-add-field .js-select2-custom-dynamic').each(function () {
                    var select2dynamic = $.HSCore.components.HSSelect2.init($(this));
                });

                $('[data-toggle="tooltip"]').tooltip();


                // INITIALIZATION OF QUANTITY COUNTER
                // =======================================================
                $('.js-quantity-counter').each(function () {
                    var quantityCounter = new HSQuantityCounter($(this)).init();
                });
            }, deletedField: function () {
                $('.tooltip').hide();
            }
        }).init();
    });


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
    function initializeHSFormSearch() {
        $('.js-form-search').each(function () {
            new HSFormSearch($(this)).init();
        });
    }
    initializeHSFormSearch();


    // INITIALIZATION OF SELECT2
    // =======================================================
    // Định nghĩa hàm để khởi tạo Select2 cho một phần tử


    $('.js-select2-custom').each(function () {
        initSelect2($(this));
    });

    // $(document).on('DOMNodeInserted', function (e) {
    //     if ($(e.target).hasClass('js-select2-custom')) {
    //         initSelect2($(e.target));
    //     }
    // });

    // INITIALIZATION OF QUILLJS EDITOR
    // =======================================================
    var quill = $.HSCore.components.HSQuill.init('.js-quill');


    // INITIALIZATION OF ADD INPUT FILED
    // =======================================================
    // $('.js-add-field').each(function () {
    //     new HSAddField($(this), {
    //         addedField: function () {
    //             $('.js-add-field .js-select2-custom-dynamic').each(function () {
    //                 var select2dynamic = $.HSCore.components.HSSelect2.init($(this));
    //             });
    //         }
    //     }).init();
    // });


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


    // INITIALIZATION OF STEP FORM
    // =======================================================
    $('.js-step-form').each(function () {
        var stepForm = new HSStepForm($(this), {
            finish: function () {
                $("#checkoutStepFormProgress").hide();
                $("#checkoutStepFormContent").hide();
                $("#checkoutStepOrderSummary").hide();
                $("#checkoutStepSuccessMessage").show();
            }
        }).init();
    });


    // INITIALIZATION OF MASKED INPUT
    // =======================================================
    $('.js-masked-input').each(function () {
        var mask = $.HSCore.components.HSMask.init($(this));
    });
});


<!-- IE Support -->

if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) document.write('<script src="/assets/vendor/babel-polyfill/polyfill.min.js"><\/script>');
