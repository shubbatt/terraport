
const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-wrap">
          <div className="logo" style={{ color: 'white' }}>
            <img src="/logo.png" alt="Terraport Logistics" style={{ height: '36px' }} />
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#services">Services</a>
            <a href="#tracking">Tracking</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <small>© 2026 Terraport Logistics. All rights reserved.</small>
          <small>Reliable Customs & Relocation Services</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
