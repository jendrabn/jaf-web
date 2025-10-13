import data from "../../data/faq.json";
import Accordion from "react-bootstrap/Accordion";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet-async";

function FaqPage() {
  return (
    <Layout>
      <Helmet>
        <meta name="description" content="Frequently Asked Questions" />
        <title>Pertanyaan Umum | {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <div className="container">
        <h1 className="mb-5 fw-bold text-center">FAQ</h1>

        <Accordion defaultActiveKey="0" className="faqs-accordion">
          {data.map((item, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>{item.question}</Accordion.Header>
              <Accordion.Body>{item.answer}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </Layout>
  );
}

export default FaqPage;
