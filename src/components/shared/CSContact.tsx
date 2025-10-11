import { Link } from "react-router";

function CSContact() {
  return (
    <>
      <h5 className="fw-bold mb-3">Kontak Customer Service</h5>
      <ul className="list-unstyled mb-3">
        <li className="mb-2">
          <i className="bi bi-envelope me-2"></i>
          <a
            href="mailto:cs@jaf.co.id"
            className="text-decoration-none text-dark"
          >
            Email: cs@jaf.co.id
          </a>
        </li>
        <li className="mb-2">
          <i className="bi bi-whatsapp me-2"></i>
          <a
            href="https://wa.me/628113132502"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none text-dark"
          >
            WhatsApp: +62 811 3132 502
          </a>
        </li>
        <li className="mb-2">
          <i className="bi bi-telephone me-2"></i>
          Phone: 0331 322070
        </li>
        <li>
          <i className="bi bi-clock me-2"></i>Jam Operasional: Senin - Sabtu,
          09.00 - 18.00 WIB
        </li>
      </ul>
      <div>
        <span className="me-2">Butuh jawaban cepat?</span>
        <Link to="/faq" className="btn btn-outline-primary btn-sm">
          <i className="bi bi-question-circle me-1"></i>
          Lihat FAQ
        </Link>
      </div>
    </>
  );
}

export default CSContact;
