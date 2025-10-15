import { Link, useParams } from "react-router";
import { useFetchBlog } from "../../hooks/api/blog";
import Layout from "../../components/layout/Layout";
import NotFoundPage from "../../pages/NotFound";
import Loading from "../../components/ui/Loading";
import { Helmet } from "react-helmet-async";
import { Badge, Breadcrumb, Button, Image } from "react-bootstrap";
import { formatDateTime } from "../../utils/format";
import { useState } from "react";
import ShareModal from "./ShareModal";

function BlogDetailPage() {
  const { slug } = useParams();

  const { data: blog, isLoading } = useFetchBlog(slug);
  const [showShareModal, setShowShareModal] = useState(false);

  if (!isLoading && !blog) return <NotFoundPage />;

  return (
    <Layout>
      {isLoading && <Loading className="py-5" />}

      {blog && (
        <>
          <Helmet>
            <title>
              {blog.title} | {import.meta.env.VITE_APP_NAME}
            </title>
          </Helmet>

          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-md-10 col-lg-8">
                <Breadcrumb className="mb-5">
                  <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                    Home
                  </Breadcrumb.Item>
                  <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/blog" }}>
                    Blog
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active className="text-truncate">
                    {blog.title}
                  </Breadcrumb.Item>
                </Breadcrumb>

                <article className="blog-detail">
                  <Badge
                    as={"a"}
                    href={`/blog?category_id=${blog.category.id}`}
                    className="blog-category fs-6 rounded-0 mb-3"
                  >
                    {blog.category.name}
                  </Badge>

                  <h1 className="blog-title fw-bold lh-sm mb-3 text-body-emphasis">
                    {blog.title}
                  </h1>

                  <div className="blog-meta d-flex align-items-center justify-content-between flex-wrap mb-3 gap-3">
                    <div className="d-flex justify-content-start align-items-center gap-3">
                      <div>
                        <Image
                          src={`https://ui-avatars.com/api/?name=${blog.author}`}
                          alt={blog.author}
                          width={40}
                          height={40}
                          roundedCircle
                        />
                      </div>
                      <div className="d-flex flex-column">
                        <Link
                          to={`/blog?author=${blog.author}`}
                          style={{ fontWeight: 700 }}
                          className="fw-semibold text-decoration-none link-body-emphasis"
                        >
                          {blog.author}
                        </Link>
                        <time
                          className="small text-secondary-emphasis"
                          dateTime={blog.created_at}
                        >
                          <i className="bi bi-clock me-1"></i>
                          {formatDateTime(blog.created_at)}
                        </time>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-light"
                        className="rounded-0"
                        title="Waktu baca"
                      >
                        <i className="bi bi-clock me-2"></i>
                        {blog.min_read}
                      </Button>

                      <Button
                        variant="outline-light"
                        className="rounded-0"
                        title="Jumlah dilihat"
                      >
                        <i className="bi bi-eye-fill me-2"></i>
                        {blog.views_count}
                      </Button>

                      <Button
                        variant="outline-light"
                        className="rounded-0"
                        title="Bagikan artikel"
                        onClick={() => setShowShareModal(true)}
                      >
                        <i className="bi bi-share-fill me-2"></i>
                        Share
                      </Button>
                    </div>
                  </div>

                  <figure className="blog-image mb-3">
                    <div className="w-100 ratio ratio-16x9 bg-gray-300 rounded-3 overflow-hidden">
                      <img
                        src={blog.featured_image}
                        alt={blog.title}
                        className="object-fit-fill w-100 h-100"
                        loading="lazy"
                      />
                    </div>
                    {blog.featured_image_description && (
                      <figcaption className="text-center text-secondary-emphasis mt-2">
                        {blog.featured_image_description}
                      </figcaption>
                    )}
                  </figure>

                  <div
                    className="blog-content mb-3"
                    style={{ fontSize: "1.125rem" }}
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  ></div>

                  <div className="blog-tags d-flex flex-wrap gap-2">
                    <span className="text-secondary-emphasis fw-semibold">
                      Tag:
                    </span>
                    {blog.tags.map((tag) => (
                      <Badge
                        as={"a"}
                        href={`/blog?tag_id=${tag.id}`}
                        key={tag.id}
                        bg="light"
                        text="dark"
                        className="fs-6 border"
                      >
                        <i className="bi bi-tag me-1"></i>
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          </div>
        </>
      )}

      {!isLoading && blog && (
        <ShareModal
          show={showShareModal}
          onHide={() => setShowShareModal(false)}
          blog={blog}
        />
      )}
    </Layout>
  );
}

export default BlogDetailPage;
