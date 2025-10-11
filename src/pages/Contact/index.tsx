import { Helmet } from "react-helmet-async";
import { Form } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import CSContact from "../../components/shared/CSContact";

function ContactPage() {
  return (
    <Layout>
      <Helmet>
        <meta
          name="description"
          content="Hubungi JAF Parfum's untuk pertanyaan, bantuan, atau kerjasama. Kami siap membantu Anda!"
        />
        <title>Kontak Kami | {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <div className="container">
        <h1 className="mb-5 fw-bold text-center">Hubungi Kami</h1>

        <div className="row align-items-stretch">
          <div className="col-lg-6">
            <div className="bg-white rounded-4 shadow-sm h-100 d-flex flex-column justify-content-center">
              <p className="mb-4 text-muted">
                Ada pertanyaan, kritik, saran, atau ingin kerjasama? Silakan isi
                form di bawah ini. Tim kami akan membalas dalam 1x24 jam pada
                hari kerja.
              </p>
              <Form>
                <Form.Group className="mb-3" controlId="contactName">
                  <Form.Label>Nama Lengkap</Form.Label>
                  <Form.Control type="text" placeholder="Nama Anda" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="contactEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="email@domain.com"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="contactPhone">
                  <Form.Label>No. Telepon (Opsional)</Form.Label>
                  <Form.Control type="tel" placeholder="08xxxxxxxxxx" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="contactMessage">
                  <Form.Label>Pesan</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Tulis pesan Anda di sini..."
                    required
                  />
                </Form.Group>
                <button className="btn btn-primary" type="submit">
                  <i className="bi bi-send me-2"></i>Kirim Pesan
                </button>
              </Form>
              <div className="mt-4 border-top pt-4">
                <CSContact />
              </div>
            </div>
          </div>
          <div className="col-lg-6 d-flex align-items-stretch">
            <div className="rounded-4 overflow-hidden shadow-sm w-100 bg-white">
              <iframe
                title="Lokasi JAF Parfum's"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.21554637957!2d113.7107621745602!3d-8.181028682013878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd6942986b10fb5%3A0x25e647f267f7b636!2sKANTOR%20JAF%20PARFUM&#39;s!5e0!3m2!1sid!2sid!4v1750245222336!5m2!1sid!2sid"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ContactPage;
