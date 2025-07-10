function OurServices() {
  return (
    <div className="row g-3 our__services-container">
      <div className="col-12 col-md-4">
        <div className="card border-primary rounded-4 h-100 shadow-sm border-dashed">
          <div className="card-body text-center">
            <i className="fa-solid fa-truck-fast service-icon mb-3"></i>
            <h5 className="mb-1 fw-bold">PENGIRIMAN CEPAT & GRATIS</h5>
            <p className="text-muted fs-7 px-3 px-md-0">
              Penawaran berlaku untuk semua pesanan di atas 100k
            </p>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="card border-primary rounded-4 h-100 shadow-sm border-dashed">
          <div className="card-body text-center">
            <i className="fa-solid fa-gift service-icon mb-3"></i>
            <h5 className="mb-1 fw-bold">HADIAH MINGGUAN BAGI MEMBER</h5>
            <p className="text-muted fs-7 px-3 px-md-0">
              Penawaran berlaku bagi pelanggan yang membeli lebih dari 3x
            </p>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <div className="card border-primary rounded-4 h-100 shadow-sm border-dashed">
          <div className="card-body text-center">
            <i className="fa-solid fa-headset service-icon mb-3"></i>
            <h5 className="mb-1 fw-bold">DUKUNGAN RAMAH 24/7</h5>
            <p className="text-muted fs-7 px-3 px-md-0">
              Kustomer servis kami selalu siap membantu
            </p>
          </div>
        </div>
      </div>
      <style>
        {`
          .border-dashed {
            border-style: dashed !important;
          }
        `}
      </style>
    </div>
  );
}

export default OurServices;
