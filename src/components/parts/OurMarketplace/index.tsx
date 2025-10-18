import { env } from "@/utils/config";
import ShopeeLogo from "@/assets/images/marketplace/Shopee.svg";
import TokopediaLogo from "@/assets/images/marketplace/Tokopedia.svg";
import LazadaLogo from "@/assets/images/marketplace/Lazada.svg";
import BlibliLogo from "@/assets/images/marketplace/Blibli.svg";

type MarketplaceItem = {
  key: "shopee" | "tokopedia" | "lazada" | "blibli";
  name: string;
  url?: string;
  logo: string;
  brandColor: string;
};

const marketplaces: MarketplaceItem[] = [
  {
    key: "shopee",
    name: "Shopee",
    url: env.SHOPEE_URL,
    logo: ShopeeLogo,
    brandColor: "#FF5722",
  },
  {
    key: "tokopedia",
    name: "Tokopedia",
    url: env.TOKOPEDIA_URL,
    logo: TokopediaLogo,
    brandColor: "#03A64E",
  },
  {
    key: "lazada",
    name: "Lazada",
    url: env.LAZADA_URL,
    logo: LazadaLogo,
    brandColor: "#1A2F5F",
  },
  {
    key: "blibli",
    name: "Blibli",
    url: env.BLIBLI_URL,
    logo: BlibliLogo,
    brandColor: "#008DFF",
  },
];

const OurMarketplace = () => {
  const available = marketplaces.filter(
    (m) => typeof m.url === "string" && m.url.trim().length > 0
  );

  if (available.length === 0) return null;

  return (
    <div className="our-marketplace-container">
      <div className="row g-3">
        {available.map((m) => (
          <div className="col-6 col-md-4 col-lg-3" key={m.key}>
            <a
              href={String(m.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none hover-up"
              aria-label={`Buka toko JAF Parfum's di ${m.name}`}
            >
              <div className="card rounded-4 shadow-sm h-100 border-0">
                <div className="card-body d-flex align-items-center gap-3">
                  <div
                    className="brand-logo rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: 72,
                      height: 72,
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <img
                      src={m.logo}
                      alt={`Logo ${m.name}`}
                      style={{ width: 48, height: 48 }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-bold text-dark">{m.name}</h6>
                    <span className="text-muted text-xs">
                      Belanja di {m.name}
                    </span>
                  </div>
                  <div className="ms-auto text-muted" title="Buka di tab baru">
                    <i className="bi bi-box-arrow-up-right"></i>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      <style>
        {`
          .our-marketplace-container .card {
            border: 1px dashed rgba(0,0,0,0.08);
          }
          html[data-bs-theme="dark"] .our-marketplace-container .card {
            border-color: rgba(255,255,255,0.12);
            background-color: #1f1f1f;
          }
          .brand-logo {
            box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          }
        `}
      </style>
    </div>
  );
};

export default OurMarketplace;
