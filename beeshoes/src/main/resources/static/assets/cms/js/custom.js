$(document).ready(function () {
    $(document).on('click', '.js-plus, .js-minus', function () {
        var quantityInput = $(this).closest('.js-quantity-counter').find('.js-result');
        var currentQuantity = parseInt(quantityInput.val(), 10);
        if ($(this).hasClass('js-plus')) {
            quantityInput.val(currentQuantity + 1);
        } else if ($(this).hasClass('js-minus')) {
            quantityInput.val(Math.max(currentQuantity - 1, 0));
        }
        quantityInput.change(); // Sử dụng .change() thay vì .trigger('change')
    });

    $(document).on('input', '.money-input-mask', function () {
        $(this).mask('#.###.###.###đ', {reverse: true});
    });
    $(document).on('input', '.money-input-mask-num', function () {
        $(this).mask('#.###.###.###', {reverse: true});
    });
});

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

function Confirm() {
    Swal.fire({
        title: "Bạn chắc chứ?",
        text: "Sau khi xóa sẽ không thể khôi phục lại!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Hủy",
        confirmButtonText: "Xác Nhận"
    }).then((result) => {
        if (result.isConfirmed) {
            ToastSuccess("Thành Công !");
            return true;
        } else {
            return false;
        }
    });

}

function setFormSendData(url, name, id) {
    $('#titleModalLabel').text("Thêm Mới " + name);
    $('#form-modal-add-attr-label').text("Tên " + name + ":");
    $('#url-post-data').val(url)
    $('#id-element-data').val(id)
    $('#form-add-product-attr').modal('show')
    $('#product-name-modal').val('');
}

$(document).on('ready', function () {
    $('#btn-add-new-product').on('click', () => {
        let ten = $('#product-name-modal').val();
        let url = $('#url-post-data').val();
        if (ten.length === 0) {
            Toast('error', 'Vui lòng nhập tên !');
        } else {
            $.ajax({
                type: "POST",
                url: "/api/them-" + url,
                data: {
                    ten: ten,
                    trangThai: true
                },
                success: (data, status, xhr) => {
                    let id = $('#id-element-data').val();
                    let html = `<option value="${data.id}" selected>${data.ten}</option>`;
                    if (id == 'kichCo') {
                        html = `<option value="${data.ten}" selected>${data.ten}</option>`;
                    }
                    if (id == 'sanPham') {
                        $('#sanPham_input').val(data.ten);
                    }
                    $('#' + id).append(html);
                    Toast('success', 'Thêm Thành Công !');
                    $('#product-name-modal').val('');
                    $('#form-add-product-attr').modal('hide')
                },
                error: (xhr) => {
                    let mess = xhr.getResponseHeader('status');
                    if (mess == "existsByTen") {

                    }
                    switch (mess) {
                        case "existsByTen":
                            ToastError('Tên Đã Tồn Tại.');
                            break;
                        case "NotIsNum":
                            ToastError('Kích Cỡ phải là số.');
                            break;
                        case "faildkhoang":
                            ToastError('Kích Cỡ phải từ 20->50.');
                            break;
                        case "nameNull":
                            ToastError("Tên không được để trống.");
                            break;
                        case "nameSize":
                            ToastError("Tên kích cỡ phải từ 30 đến 50.");
                            break;
                        default:
                            ToastError('Lỗi hệ thống ! Vui lòng thử lại sau.')
                    }
                }
            })
        }
    })

    function changeNameToColor() {
        let mausac = $('#mauSac').val();
        mausac.forEach((mau) => {
            let tenmau = $('option[value="' + mau + '"]').attr('data-name');
            let ele = $('#selectedColor').find('li.select2-selection__choice[title="' + tenmau + '"]');
            let span = $(ele[0]).find('span:not(.select2-selection__choice__remove)').eq(0);
            $(span[0]).text(tenmau);
            $(ele[0]).css('background-color', mau).css('color', '#FFFFFF').css('border', 'solid 1px').css('border-color', '#f9dbdb');
        });
    }

    changeNameToColor();
    $('#mauSac').on('change', function () {
        changeNameToColor();

    });
    // thêm màu sắc
    $('#btn-add-new-color').on('click', () => {
        let coloCode = $('#colorChoice').val();
        let coloName = $('#color-name').val();
        if (coloName.length === 0) {
            Toast('error', 'Vui lòng nhập tên !');
        } else {
            $.ajax({
                type: "POST",
                url: "/api/them-mau-sac",
                data: {
                    ten: coloName,
                    maMau: coloCode.toUpperCase(),
                    trangThai: true
                },
                success: (data, status, xhr) => {
                    let html = `<option value="${data.maMauSac}" data-name="${data.ten}">${data.ten}</option>`;
                    $('#mauSac').append(html);
                    $('#form-add-product-attr').modal('show')
                    Toast('success', 'Thêm Thành Công !');
                    Swal.fire({
                        title: "Bạn muốn thêm tiếp?",
                        text: "Bạn có muốn tạo thêm màu nữa không?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        cancelButtonText: "không",
                        confirmButtonText: "Có"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $('#color-name').val('');
                        } else {
                            $('#form-add-color').modal('hide');
                            $('#color-name').val('');
                        }
                    })
                },
                error: (xhr) => {
                    let st = xhr.getResponseHeader('status');
                    console.log(st)
                    switch (st) {
                        case "existsByTen":
                            ToastError("Tên đã tồn tại.")
                            break;
                        case "existsByMaMau":
                            ToastError("Mã màu đã tồn tại.")
                            break;
                        case "nameNull":
                            ToastError("Tên không được trống.")
                            break;
                        case "colorCodeNull":
                            ToastError("Mã màu không được trống.")
                            break;
                        case "statusNull":
                            ToastError("Trạng thái không được trống.")
                            break;
                        case "oke":
                            ToastSuccess("Thêm thành công.")
                            break;
                        default:
                            ToastError("Thất Bại.")
                    }
                }
            })
        }
    })

})

function checkData() {

}

showColorCode('#000000')

function showColorCode(color) {
    let colorCode = document.getElementById("colorCode");
    colorCode.value = color.toUpperCase();
}


function isEmpty(str) {
    return (!str || str.length === 0);
}

function convertToNumber(text) {
    text = text.replace(/[.,]/g, "");
    text = text.replace(/[a-zA-Z]/g, "");
    var number = Number(text);
    return number;
}
