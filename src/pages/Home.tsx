import React from 'react';
import { ArrowRight, FileText, CheckCircle, PackageSearch, Truck, Home as HomeIcon, MapPin } from 'lucide-react';

const Home = () => {
  const quickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Tracking feature accessed! Please log in for full dashboard tracking.');
  };

  return (
    <>
      <section className="hero" style={{
        background: 'linear-gradient(135deg, rgba(11,31,51,0.92), rgba(15,61,102,0.85)), url("https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1600&q=80") center/cover no-repeat',
        minHeight: '88vh',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 0',
        marginTop: '-80px' // Compensate for header
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '50px',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '24px' }}>
              Reliable Customs & Relocation Solutions
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.15rem', marginBottom: '32px', maxWidth: '640px' }}>
              Terraport Logistics provides customs brokerage, documentation, international logistics, office & home relocation, and shipment tracking in one complete premium platform.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
              <a href="#services" className="btn btn-primary">Explore Services <ArrowRight size={18} /></a>
              <a href="#contact" className="btn btn-outline">Request Quote</a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="glass-card" style={{ padding: '20px' }}>
                <CheckCircle size={28} color="var(--accent)" style={{ marginBottom: '12px' }} />
                <h4 style={{ color: 'white' }}>Customs Brokerage</h4>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Fast clearance</p>
              </div>
              <div className="glass-card" style={{ padding: '20px' }}>
                <HomeIcon size={28} color="var(--accent)" style={{ marginBottom: '12px' }} />
                <h4 style={{ color: 'white' }}>Relocations</h4>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Safe & secure</p>
              </div>
              <div className="glass-card" style={{ padding: '20px' }}>
                <Truck size={28} color="var(--accent)" style={{ marginBottom: '12px' }} />
                <h4 style={{ color: 'white' }}>Door Delivery</h4>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Direct to you</p>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '40px' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>Quick Track</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>Enter your tracking number to check shipment status.</p>
            <form onSubmit={quickTrack}>
              <div className="form-group">
                <label>Tracking Number</label>
                <input type="text" placeholder="e.g. TLX-458923" required />
              </div>
              <button className="btn btn-secondary" style={{ width: '100%' }}>Track Now <PackageSearch size={18} /></button>
            </form>
          </div>
        </div>
      </section>

      <section id="services" style={{ background: 'var(--light)' }}>
        <div className="container">
          <div className="section-title">
            <h2>Our Logistics Services</h2>
            <p>Complete end-to-end logistics support for individuals, businesses, importers, exporters, and relocation clients.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            <div className="card">
              <div className="btn-icon" style={{ width: '60px', height: '60px', background: 'rgba(29,120,193,0.1)', color: 'var(--secondary)', marginBottom: '20px' }}>
                <FileText size={30} />
              </div>
              <h3>Customs Form Filling</h3>
              <p>Accurate preparation and submission of customs-related forms and supporting documentation for faster processing.</p>
            </div>

            <div className="card">
              <div className="btn-icon" style={{ width: '60px', height: '60px', background: 'rgba(24,169,87,0.1)', color: 'var(--success)', marginBottom: '20px' }}>
                <CheckCircle size={30} />
              </div>
              <h3>Customs Clearance</h3>
              <p>End-to-end customs clearance coordination for commercial cargo, personal goods, and special shipments.</p>
            </div>

            <div className="card">
              <div className="btn-icon" style={{ width: '60px', height: '60px', background: 'rgba(255,183,3,0.1)', color: 'var(--accent)', marginBottom: '20px' }}>
                <MapPin size={30} />
              </div>
              <h3>International Logistics</h3>
              <p>Air, sea, and multimodal logistics solutions for cross-border transportation and freight movement.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
