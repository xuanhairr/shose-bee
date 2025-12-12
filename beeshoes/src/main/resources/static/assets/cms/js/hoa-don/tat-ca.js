$(document).on('ready', function () {
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

    //tất cả
    $('.xacNhanFromAction').on('click', function () {
        var selectedValue = [];
        var maHoaDon = $(this).closest("tr").find("td[data-ma-hoa-don]").attr("data-ma-hoa-don");
        selectedValue.push(String(maHoaDon));

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
                    url: "/api/hoa-don/xac-nhan",
                    contentType: "application/json",
                    data: JSON.stringify(selectedValue),
                    success: function () {
                        ToastSuccess('Xác nhận thành công');
                        location.reload();
                    },
                    error: function (error) {
                        ToastError('Có lỗi xảy ra khi xác nhận đơn, vui lòng thử lại!');
                        console.error('Xảy ra lỗi: ', error);
                    }
                });
            }
        });
    });

    $('.huyFromAction').on('click', function () {
        var selectedValue = [];
        var maHoaDon = $(this).closest("tr").find("td[data-ma-hoa-don]").attr("data-ma-hoa-don");
        selectedValue.push(String(maHoaDon));

        Swal.fire({
            title: "Bạn chắc chứ?",
            text: "Bạn đang hủy đơn hàng!",
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
                    url: "/api/hoa-don/huy",
                    contentType: "application/json",
                    data: JSON.stringify(selectedValue),
                    success: function () {
                        ToastSuccess('Hủy thành công');
                        location.reload();
                    },
                    error: function (error) {
                        ToastError('Xảy ra lỗi khi hủy đơn, vui lòng thử lại!');
                        console.error('Xảy ra lỗi: ', error);
                    }
                });
            }
        });
    });
    //end tất cả

    // Chờ xác nhận tab
    $('#xacNhanFromCheckBoxCXN').on('click', function () {
        var selectedValue = [];
        $('#myBodyAllCXN').find('input[type=checkbox]:checked').each(function () {
            var dataMaHoaDon = $(this).closest('td').attr('data-ma-hoa-don-cxn');
            selectedValue.push(String(dataMaHoaDon));
        });

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
                    url: "/api/hoa-don/xac-nhan",
                    contentType: "application/json",
                    data: JSON.stringify(selectedValue),
                    success: function () {
                        ToastSuccess('Xác nhận thành công');
                        location.reload();
                    },
                    error: function (error) {
                        ToastError('Có lỗi xảy ra khi xác nhận đơn, vui lòng thử lại!');
                        console.error('Xảy ra lỗi: ', error);
                    }
                });
            }
        });
    });

    $('#xacNhanFromActionCXN').on('click', function () {
        var selectedValue = [];
        var maHoaDon = $(this).closest("tr").find("td[data-ma-hoa-don-cxn]").attr("data-ma-hoa-don-cxn");
        selectedValue.push(String(maHoaDon));

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
                    url: "/api/hoa-don/xac-nhan",
                    contentType: "application/json",
                    data: JSON.stringify(selectedValue),
                    success: function () {
                        ToastSuccess('Xác nhận thành công');
                        location.reload();
                    },
                    error: function (error) {
                        ToastError('Xảy ra lỗi khi xác nhận đơn, vui lòng thử lại!');
                        console.error('Xảy ra lỗi: ', error);
                    }
                });
            }
        });
    });

    $('#huyFromCheckBoxCXN').on('click', function () {
        var selectedValue = [];
        $('#myBodyAllCXN').find('input[type=checkbox]:checked').each(function () {
            var dataMaHoaDon = $(this).closest('td').attr('data-ma-hoa-don-cxn');
            selectedValue.push(String(dataMaHoaDon));
        });

        Swal.fire({
            title: "Bạn chắc chứ?",
            text: "Bạn đang hủy đơn hàng!",
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
                    url: "/api/hoa-don/huy",
                    contentType: "application/json",
                    data: JSON.stringify(selectedValue),
                    success: function () {
                        ToastSuccess('Hủy thành công!');
                        location.reload();
                    },
                    error: function (error) {
                        ToastError('Xảy ra lỗi khi hủy đơn, vui lòng thử lại!');
                        console.error('Xảy ra lỗi: ', error);
                    }
                });
            }
        });
    });

    $('#huyFromActionCXN').on('click', function () {
        var selectedValue = [];
        var maHoaDon = $(this).closest("tr").find("td[data-ma-hoa-don-cxn]").attr("data-ma-hoa-don-cxn");
        selectedValue.push(String(maHoaDon));

        Swal.fire({
            title: "Bạn chắc chứ?",
            text: "Bạn đang hủy đơn hàng!",
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
                    url: "/api/hoa-don/huy",
                    contentType: "application/json",
                    data: JSON.stringify(selectedValue),
                    success: function () {
                        ToastSuccess('Hủy thành công');
                        location.reload();
                    },
                    error: function (error) {
                        ToastError('Xảy ra lỗi khi hủy đơn, vui lòng thử lại!');
                        console.error('Xảy ra lỗi: ', error);
                    }
                });
            }
        });
    });
    //end chờ xác nhận

    // Chờ giao tab
    $('#xacNhanFromCheckBoxCG').on('click', function () {
        var selectedValue = [];
        $('#myBodyAllCG').find('input[type=checkbox]:checked').each(function () {
            var dataMaHoaDon = $(this).closest('td').attr('data-ma-hoa-don-cg');
            selectedValue.push(String(dataMaHoaDon));
        });

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
                    url: "/api/hoa-don/xac-nhan",
                    contentType: "application/json",
                    data: JSON.stringify(selectedValue),
                    success: function () {
                        ToastSuccess('Xác nhận thành công');
                        location.reload();
                    },
                    error: function (error) {
                        ToastError('Xảy ra lỗi khi xác nhận đơn, vui lòng thử lại!');
                        console.error('Xảy ra lỗi: ', error);
                    }
                });
            }
        });
    });

    $('#xacNhanFromActionCG').on('click', function () {
        var selectedValue = [];
        var maHoaDon = $(this).closest("tr").find("td[data-ma-hoa-don-cg]").attr("data-ma-hoa-don-cg");
        selectedValue.push(String(maHoaDon));

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
                    url: "/api/hoa-don/xac-nhan",
                    contentType: "application/json",
                    data: JSON.stringify(selectedValue),
                    success: function () {
                        ToastSuccess('Xác nhận thành công');
                        location.reload();
                    },
                    error: function (error) {
                        ToastError('Xảy ra lỗi khi xác nhận đơn, vui lòng thử lại!');
                        console.error('Xảy ra lỗi: ', error);
                    }
                });
            }
        });
    });
    // end chờ giao

    // đang giao tab
    $('#xacNhanFromCheckBoxDG').on('click', function () {
        var selectedValue = [];
        $('#myBodyAllDG').find('input[type=checkbox]:checked').each(function () {
            var dataMaHoaDon = $(this).closest('td').attr('data-ma-hoa-don-dg');
            selectedValue.push(String(dataMaHoaDon));
        });

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
                    url: "/api/hoa-don/xac-nhan",
                    contentType: "application/json",
                    data: JSON.stringify(selectedValue),
                    success: function () {
                        ToastSuccess('Xác nhận thành công');
                        location.reload();
                    },
                    error: function (error) {
                        ToastError('Xảy ra lỗi khi xác nhận đơn, vui lòng thử lại!');
                        console.error('Xảy ra lỗi: ', error);
                    }
                });
            }
        });
    });

    $('#xacNhanFromActionDG').on('click', function () {
        var selectedValue = [];
        var maHoaDon = $(this).closest("tr").find("td[data-ma-hoa-don-dg]").attr("data-ma-hoa-don-dg");
        selectedValue.push(String(maHoaDon));

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
                    url: "/api/hoa-don/xac-nhan",
                    contentType: "application/json",
                    data: JSON.stringify(selectedValue),
                    success: function () {
                        ToastSuccess('Xác nhận thành công');
                        location.reload();
                    },
                    error: function (error) {
                        ToastError('Xảy ra lỗi khi xác nhận đơn, vui lòng thử lại!');
                        console.error('Xảy ra lỗi: ', error);
                    }
                });
            }
        });
    });
    // end đang giao
})