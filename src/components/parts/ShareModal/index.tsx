import { Modal } from "react-bootstrap";
import { Link } from "react-router";
import { toast } from "react-toastify";

interface ShareModalProps {
  show: boolean;
  onHide: () => void;
  data: {
    title: string;
    url: string;
  };
}

type SocialPlatform = {
  icon: string;
  color: string;
  name: string;
  shareUrl: string;
};

const socialPlatforms: SocialPlatform[] = [
  {
    icon: "whatsapp",
    color: "#25D366",
    name: "WhatsApp",
    shareUrl: "https://wa.me/?text={title}%20{url}",
  },
  {
    icon: "facebook",
    color: "#1877F2",
    name: "Facebook",
    shareUrl:
      "https://www.facebook.com/sharer/sharer.php?u={url}&quote={title}",
  },
  {
    icon: "twitter-x",
    color: "#000000",
    name: "X",
    shareUrl: "https://x.com/intent/post?text={title}&url={url}",
  },
  {
    icon: "line",
    color: "#00B900",
    name: "LINE",
    shareUrl:
      "https://social-plugins.line.me/lineit/share?url={url}&text={title}",
  },
  {
    icon: "telegram",
    color: "#26A5E4",
    name: "Telegram",
    shareUrl: "https://t.me/share/url?url={url}&text={title}",
  },
  {
    icon: "threads",
    color: "#000000",
    name: "Threads",
    shareUrl: "https://threads.net/intent/post?text={title}%20{url}",
  },
  {
    icon: "linkedin",
    color: "#0A66C2",
    name: "LinkedIn",
    shareUrl: "https://www.linkedin.com/sharing/share-offsite/?url={url}",
  },
  {
    icon: "envelope",
    color: "#EA4335",
    name: "Email",
    shareUrl: "mailto:?subject={title}&body={url}",
  },
  {
    icon: "link-45deg",
    color: "#6C757D",
    name: "Copy Link",
    shareUrl: "{url}",
  },
];

const urlReplace = (template: string, url: string, title: string) => {
  return template
    .replace("{url}", encodeURIComponent(url))
    .replace("{title}", encodeURIComponent(title));
};

const ShareModal = ({ show, onHide, data }: ShareModalProps) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title className="h5 line-clamp-2">{data.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          {socialPlatforms.map((platform) => (
            <div
              className="text-center"
              key={platform.name}
              style={{ width: 72 }}
            >
              <Link
                to={urlReplace(platform.shareUrl, data.url, data.title)}
                className="d-inline-block"
                style={{ borderColor: platform.color }}
                target={platform.name === "Copy Link" ? undefined : "_blank"}
                rel={
                  platform.name === "Copy Link"
                    ? undefined
                    : "noopener noreferrer"
                }
                onClick={(e) => {
                  if (platform.name === "Copy Link") {
                    e.preventDefault();
                    navigator.clipboard.writeText(data.url);

                    toast.success("Link copied to clipboard!");
                  }
                }}
              >
                <i
                  className={`bi bi-${platform.icon} fs-4`}
                  style={{ color: platform.color }}
                ></i>
              </Link>
              <div className="small text-body-secondary mt-1">
                {platform.name}
              </div>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ShareModal;
