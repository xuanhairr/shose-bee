const socket = new SockJS('/notification');
const stompClient = Stomp.over(socket);
stompClient.connect({}, function (frame) {
    stompClient.subscribe('/topic/newInvoice', function (invoice) {
        const newInvoice = JSON.parse(invoice.body);
        updateDataTableInvoice(newInvoice);
    });

    stompClient.subscribe('/topic/noti', function (noti) {
        const newNoti = JSON.parse(noti.body);
        updateDataTableNotification(newNoti);
    });
});
let isCooldown = false;

function updateDataTableInvoice(hoaDon) {
    const newInvoiceRow = document.createElement('tr');
    newInvoiceRow.innerHTML = `
           <td data-ma-hoa-don=${hoaDon.maHoaDon}>
                    <span>1</span>
                </td>
                <td><a href="/cms/hoa-don/${hoaDon.maHoaDon}/chi-tiet">${hoaDon.maHoaDon}</a></td>
                <td>
                    <span>${hoaDon.tenNguoiNhan == null ? 'N/A' : hoaDon.tenNguoiNhan}</span>
                </td>
                <td>
                    <span>${hoaDon.sdtNhan == null ? 'N/A' : hoaDon.sdtNhan}</span>
                </td>
                <td>
                    <span>${hoaDon.thucThu.toLocaleString('en-US')}</span>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <span class="text-dark">${hoaDon.loaiHoaDon ? 'Bán Giao Hàng' : 'Bán Tại Quầy'}</span>
                    </div>
                </td>
                <td>
                    <span class="${hoaDon.trangThai == 'Thành Công' ? 'badge badge-soft-success' :
        (hoaDon.trangThai == 'Chờ Giao' ? 'badge badge-soft-warning' : 'badge badge-soft-danger')}">${hoaDon.trangThai}
                    </span>
                </td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-ghost-info dropdown-toggle" type="button" data-toggle="dropdown">Thao tác
                            <span class="caret"></span></button>
                            ${hoaDon.trangThai == 'Chờ Xác Nhận' ? `<ul class="text-center dropdown-menu">
      <li>
        <a class="btn btn-sm btn-outline-dark" data-toggle="tooltip"
           data-original-title="Xem Chi Tiết" href="/cms/hoa-don/${hoaDon.maHoaDon}/chi-tiet">
          <i class="tio-visible-outlined"></i></a>
      </li>
      <li>
        <a data-toggle="tooltip"
           data-original-title="Xác Nhận Đơn" class="btn btn-sm btn-outline-success xacNhanFromAction">
          <i class="tio-checkmark-circle-outlined"></i></a>
      </li>
      <li>
        <a data-toggle="tooltip"
           data-original-title="Hủy Đơn" class="btn btn-sm btn-outline-danger huyFromAction">
          <i class="tio-delete-outlined"></i></a>
      </li>
    </ul>` : (hoaDon.trangThai == 'Chuẩn Bị Hàng' ? `<ul class="text-center dropdown-menu">
      <li>
        <a class="btn btn-sm btn-outline-dark" data-toggle="tooltip"
           data-original-title="Xem Chi Tiết" href="/cms/hoa-don/${hoaDon.maHoaDon}/chi-tiet">
          <i class="tio-visible-outlined"></i></a>
      </li>
      <li>
        <a data-toggle="tooltip"
           data-original-title="Xác Nhận Đơn" class="btn btn-sm btn-outline-success xacNhanFromAction">
          <i class="tio-checkmark-circle-outlined"></i></a>
      </li></ul>` : `<ul class="text-center dropdown-menu">
      <li>
        <a class="btn btn-sm btn-outline-dark" data-toggle="tooltip"
           data-original-title="Xem Chi Tiết" href="/cms/hoa-don/${hoaDon.maHoaDon}/chi-tiet">
          <i class="tio-visible-outlined"></i></a>
      </li></ul>`)}
                    </div>
                </td>
        `;
    if (!isCooldown) {
        let newdata = Array.from(dataTable.data());
        newdata.unshift(newInvoiceRow);
        console.log(newdata)
        dataTable.clear();
        for (let i = 1; i < newdata.length; i++) {
            newdata[i][0] = `<span>${i + 1}</span>`
        }
        for (const row of newdata) {
            dataTable.row.add(row);
        }
        dataTable.draw();
        isCooldown = true;
        setTimeout(function () {
            isCooldown = false;
        }, 1000);
    }
}

function updateDataTableNotification(noti) {
    const notiTable = document.getElementById('notiTable');
    const newNoti = document.createElement('li');
    newNoti.className = 'list-group-item custom-checkbox-list-wrapper';
    newNoti.innerHTML = `<div class="row">
        <div class="col-auto position-static">
            <div class="d-flex align-items-center">
                <div
                    class="custom-control custom-checkbox custom-checkbox-list">
                    <input type="checkbox" class="custom-control-input"
                           id="notificationCheck1" checked="">
                        <label class="custom-control-label"
                               for="notificationCheck1"></label>
                        <span
                            class="custom-checkbox-list-stretched-bg"></span>
                </div>
                <div class="avatar avatar-sm avatar-circle">
                    <img class="avatar-img"
                         src="${noti.creatorAvatarUrl != null ? noti.creatorAvatarUrl : '/assets/cms/img/160x160/img3.jpg'}"
                         alt="Image Description">
                </div>
            </div>
        </div>
        <div class="col ml-n3">
            <span class="card-title h5">${noti.createdBy}</span>
            <p class="card-text font-size-sm">${noti.title}</p>
            <blockquote
                class="blockquote blockquote-sm">${noti.description != null ? noti.description : ''}</blockquote>
        </div>
        <small class="col-auto text-muted text-cap">${noti.createdTime}</small>
    </div>
    <a class="stretched-link" href="#"></a>`
    notiTable.insertBefore(newNoti, notiTable.firstChild);
    $('#notiItem').removeClass('d-none');
}