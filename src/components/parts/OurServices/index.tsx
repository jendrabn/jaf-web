const OurServices = () => {
  return (
    <div className="row g-3 our__services-container">
      <div className="col-12 col-md-4">
        <div className="card border-primary rounded-4 h-100 shadow-sm border-dashed">
          <div className="card-body text-center">
            <i className="bi bi-truck service-icon mb-3 display-6 text-primary"></i>
            <h5 className="mb-1 fw-bold text-uppercase">
              Pengiriman Kilat & Gratis
            </h5>
            <p className="text-secondary small px-3 px-md-0">
              Gratis ongkir untuk pesanan di atas Rp100.000.*
            </p>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="card border-primary rounded-4 h-100 shadow-sm border-dashed">
          <div className="card-body text-center">
            <i className="bi bi-gift service-icon mb-3 display-6 text-primary"></i>
            <h5 className="mb-1 fw-bold text-uppercase">
              Hadiah Mingguan untuk Member
            </h5>
            <p className="text-secondary small px-3 px-md-0">
              Reward eksklusif untuk pelanggan setia yang berbelanja lebih dari
              3x.
            </p>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="card border-primary rounded-4 h-100 shadow-sm border-dashed">
          <div className="card-body text-center">
            <i className="bi bi-headset service-icon mb-3 display-6 text-primary"></i>
            <h5 className="mb-1 fw-bold text-uppercase">Dukungan Ramah 24/7</h5>
            <p className="text-secondary small px-3 px-md-0">
              Tim kami siap membantu kapan pun Anda butuh.
            </p>
          </div>
        </div>
      </div>
      <style>
        {`
          .border-dashed {
            border-style: dashed !important;
          }
          .our__services-container .card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .our__services-container .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.12);
          }
          .our__services-container .service-icon {
            filter: drop-shadow(0 2px 6px rgba(0,0,0,0.12));
          }
          html[data-bs-theme="dark"] .our__services-container .card:hover {
            box-shadow: 0 12px 24px rgba(255,255,255,0.06);
          }
        `}
      </style>
    </div>
  );
};

export default OurServices;
