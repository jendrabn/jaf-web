import { type BlogItemTypes } from "../../../types/blog";
import { Badge, Card, Col, Image, Row } from "react-bootstrap";
import { formatDiffForHumans } from "../../../utils/format";
import { Link } from "react-router";

type Props = { blog: BlogItemTypes };

const BlogItem = ({ blog }: Props) => (
  <Card as="article" className="h-100 border-0 hover-up">
    <Row className="g-0 g-md-2">
      <Col xs={3} md={12}>
        <div className="position-relative">
          <Link
            to={`/blog/${blog.slug}`}
            aria-label={blog.title}
            className="d-block"
          >
            <div className="w-100 ratio ratio-16x9 overflow-hidden rounded-3 bg-gray-300 img-hover-zoom">
              <img
                className="w-100 h-100 object-fit-cover"
                loading="lazy"
                src={blog.featured_image}
                alt={blog.title}
              />
            </div>
          </Link>

          <Link
            to={`/blog?category_id=${blog.category.id}`}
            className="position-absolute top-0 start-0 m-2 z-1 text-decoration-none d-none d-md-inline-block"
          >
            <Badge bg="primary" className="fw-medium">
              {blog.category.name}
            </Badge>
          </Link>
        </div>
      </Col>

      <Col xs={9} md={12}>
        <Card.Body className="py-0 pe-0 px-md-0">
          <Card.Title as="h5" className="line-clamp-2 m-0">
            <Link
              to={`/blog/${blog.slug}`}
              className="text-decoration-none text-body-emphasis hover-text-primary"
            >
              {blog.title}
            </Link>
          </Card.Title>

          <Card.Text className="d-flex align-items-center gap-2 small mt-2">
            {blog.author ? (
              <Link
                to={`/blog/author/${encodeURIComponent(blog.author)}`}
                className="text-decoration-none text-body-secondary d-inline-flex align-items-center"
              >
                <Image
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    blog.author
                  )}`}
                  alt={blog.author}
                  roundedCircle
                  width={32}
                  height={32}
                  className="d-none d-md-inline-block me-2"
                />
                <span className="fw-semibold">{blog.author}</span>
              </Link>
            ) : (
              <span className="text-body-secondary fw-semibold">
                {blog.author}
              </span>
            )}

            <span className="text-body-secondary">•</span>
            <time
              className="text-body-secondary"
              dateTime={new Date(blog.created_at).toISOString()}
              title={new Date(blog.created_at).toLocaleString()}
            >
              {formatDiffForHumans(blog.created_at)}
            </time>
          </Card.Text>
        </Card.Body>
      </Col>
    </Row>
  </Card>
);

export default BlogItem;
