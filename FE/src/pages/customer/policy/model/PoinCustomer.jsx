import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function PoinCustomer() {
  return (
    <>
      <h2>Chính sách điểm thưởng thành viên </h2>
      <br />
      <h3>
        {" "}
        <FontAwesomeIcon
          icon={faCircle}
          style={{ fontSize: "5px", marginRight: "5px" }}
        />
        I. Mục đích
      </h3>
      <p>
        – Khuyến khích khách hàng mua sắm sản phẩm của cửa hàng 
        - Gia tăng khách hàng thân thiết 
      </p>
      <h3>
        {" "}
        <FontAwesomeIcon
          icon={faCircle}
          style={{ fontSize: "5px", marginRight: "5px" }}
        />
        II. Định nghĩa
      </h3>
      <p>
        – Khách Hàng: Là cá nhân, tổ chức có nhu cầu mua sắm các đôi giày cho cá nhân hoặc tổ chức.
      </p>
      <p>
        – Thành viên: Là khách hàng có đăng ký tài khoản sử dụng trên trang web Shose Bee
      </p>
      <p>
        – Điểm: Là điểm thưởng dành cho khách hàng khi tham gia mua sắm các đôi giày của cửa hàng
      </p>
      <p>
        – Giá trị quy đổi: Giá trị quy đổi sẽ được thiết lập, chỉnh sửa phù hợp với nhu cầu thị trường 
      </p>
      <h3>
        {" "}
        <FontAwesomeIcon
          icon={faCircle}
          style={{ fontSize: "5px", marginRight: "5px" }}
        />
        III. Đối tượng áp dụng
      </h3>
      <p>
        – Chính sách này áp dụng tất cả các khách hàng đã đăng ký tài khoản  hoặc đã được cung cấp tài khoản trên trang web.
      </p>
      <p>
        – Phạm vi áp dụng: Trong phạm vi toàn lãnh thổ Việt Nam
      </p>
      <h3>
        {" "}
        <FontAwesomeIcon
          icon={faCircle}
          style={{ fontSize: "5px", marginRight: "5px" }}
        />
        IV. Nội dung chính sách
      </h3>
      <h5>1. Tích lũy điểm khi khách hàng mua sắm sản phẩm</h5>
      <p>
        – Cơ chế tích điểm: Với mỗi giao dịch thanh toán thành công, Khách hàng sẽ tích được một số điểm nhất định. Tỷ lệ tích điểm dựa trên tổng giá trị sản phẩm thanh toán
      </p>
      <h5>2. Thời điểm ghi nhận tích lũy:</h5>
      <p>
        – khách hàng sẽ được ghi nhận điểm ngày sau khi đơn hàng ở trạng thái đã thành công 
      </p>
      <h5>3. Thời điểm ghi nhận tích lũy:</h5>
      <p>
        – Điểm  có hai mốc thời gian hết hạn, theo đó Điểm được tích lũy giai đoạn từ 01/01 – 30/06 của năm nay sẽ hết hạn vào ngày 31/12 cùng năm, Điểm  được tích lũy trong giai đoạn từ ngày 01/07 – 31/12 của năm nay sẽ hết hạn vào ngày 30/06 của năm kế tiếp
      </p>
      <p>
        – Như vậy, Điểm sẽ có thời hạn tối đa là 1 năm và tối thiểu là 6 tháng
      </p>
      <p>
      Ví dụ: Thành viên A có 1,000 điểm được tích lũy trong kỳ từ ngày 01/01/2020 – 30/06/2020 sẽ hết hạn vào ngày 31/12/2020
      </p>
      <h5>4. Sử dụng điểm:</h5>
      <p>
        – Điểm được dùng để thanh toán khi thành viên mua sắm các sản phẩm của cửa hàng 
      </p>
      <p>
        – Điểm không có giá trị quy đổi thành tiền mặt
      </p>
      <p>
        – Các bước sử dụng điểm khi khách hàng mua sắm sản phẩm, dịch vụ tại trang web: 
      </p>
      <ul>
        <li>B1: Khách hàng truy cập, lựa chọn và tìm kiếm dịch vụ phù hợp trên trang web beeshose</li>
        <li>B2: Xem thông tin chi tiết, click đặt hàng</li>
        <li>B3: Đăng nhập chọn hình thức thanh toán =`{'>'}` Tại bước thanh toán, Thành viên có thể lựa sử dụng điểm tích lũy  để thanh toán cho đơn hàng</li>
        <li>B5: Hoàn tất</li>
      </ul>
      <h5>6.  Giá trị thanh toán:</h5>
      <p>
        – Giá trị thanh toán là tổng giá trị đơn hàng sau khi trừ đi điểm:
      </p>
      <p>
        – Số tiền cần thanh toán = Tổng giá trị đơn hàng – Số điểm sử dụng * tỷ lệ quy đổi 
      </p>
      <p>
        – VD: Thành viên A mua một đoi giày có giá trị đơn hàng là 489,000 vnđ, Thành viên A có 300 điểm và tỷ lệ quy đổi hiện tại trên trang web là 1 điểm = 100, sau khi sử dụng để thanh toán, số tiền còn lại thành viên cần thanh toán là: 489,000 – (300 * 100) = 459,000 vnđ
      </p>
      <h5>7. Hoàn trả và thu hồi tích lũy điểm:</h5>
      <p>
        – Cửa hàng sẽ hoàn trả điểm vào tài khoản của khách hàng khi khách hàng hủy đơn, với các đơn hàng  trả hàng sẽ trừ đi những điểm đã được cộng cho đơn hàng trước đó và nếu đơn hàng hoàn trả sử dụng điểm thì điểm sẽ được thiết lập lại như sau:
      </p>
      <p>
        – Điểm = điểm hiện tại + điểm đã sử dụng cho đơn hàng - điểm cho đơn hàng thành công
      </p>
      <p>
        – Ví dụ: Thành viên A mua một đôi giày và sử dụng điểm là 10 điểm. Sau khi đơn hàng thanh công thành viên A được cộng điểm từ hoá đơn được nhận 5 điểm.Sau 1 ngày thành viên A muốn trả đơn hàng đã mua trước đó. Thành viên A hiện có 15 điểm trên trang web, sau khi hoàn trả hàng điểm còn lại của thành viên được tính như sau 15 + 10 - 5 = 20 điểm 
      </p>
      <p>
        – Thực hiện khóa tài khoản trong trường hợp Khách hàng có hành vi lạm dụng quy đổi điểm thưởng  để trục lợi cho mục đích cá nhân. 
      </p>
      <p>
        – Trong trường hợp số điểm khả dụng của khách hàng nhỏ hơn số điểm cần thu hồi, chỉ cho phép khách hàng tích điểm, không cho phép khách hàng tiêu điểm cho đến khi thu hồi đủ số điểm. 
      </p>
    </>
  )
}

export default PoinCustomer