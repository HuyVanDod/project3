export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Liên hệ */}
        <div className="footer-col">
          <h4>Tổng đài liên lạc</h4>
          <p>Thứ 2 - Thứ 6: 8h - 22h</p>
          <p>1900 9999</p>
          <p>Cần hỗ trợ chi tiết</p>
          <p>contact@fruityfruit.com</p>
        </div>

        {/* Hỗ trợ */}
        <div className="footer-col">
          <h4>Hỗ trợ</h4>
          <ul>
            <li><a href="#">Đơn hàng của bạn</a></li>
            <li><a href="#">Hoàn hàng và đổi trả</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Trung tâm hỗ trợ</a></li>
          </ul>
        </div>

        {/* Thông tin */}
        <div className="footer-col">
          <h4>Thông tin</h4>
          <ul>
            <li><a href="#">Cơ hội việc làm tại Fruity Fruit</a></li>
            <li><a href="#">Về Fruity Fruit</a></li>
            <li><a href="#">Các nhà đầu tư</a></li>
            <li><a href="#">Đánh giá khách hàng</a></li>
            <li><a href="#">Trách nhiệm cộng đồng</a></li>
            <li><a href="#">Các cơ sở cửa hàng</a></li>
          </ul>
        </div>

        {/* Ứng dụng */}
        <div className="footer-col">
          <h4>Tải ứng dụng</h4>
          <img src="/assets/icons/googleplay.png" alt="Google Play" width={140} />
          <img src="/assets/icons/appstore.png" alt="App Store" width={140} />

          <div className="social-icons">
      <a href="#">
            <img src="/assets/icons/face.png" alt="Facebook" />
      </a>
            <a href="#"><img src="/assets/icons/X.png"  alt="X" /></a>
            <a href="#"><img src="/assets/icons/install.png" alt="Instagram" /></a>
            <a href="#"><img src="/assets/icons/in.png"  alt="LinkedIn" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
