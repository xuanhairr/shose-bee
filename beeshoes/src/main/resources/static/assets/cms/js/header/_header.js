$('#notis').on('click',function () {
    $('#notiItem').addClass('d-none');
})

$('#logout').on('click', function () {
    Swal.fire({
        title: "Bạn chắc chứ?",
        text: "Bạn muốn đăng xuất?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Hủy",
        confirmButtonText: "Đăng Xuất"
    }).then((result) => result.isConfirmed ? location.href = '/logout' : '');
});