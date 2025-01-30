import { Link, useParams } from "react-router";
import { useFetchBlog } from "../services/api/blog";
import Layout from "../layouts/Layout";
import NotFoundPage from "./NotFoundPage";
import Loading from "../components/Loading";
import { formatDateTime } from "../utils/functions";

function BlogDetailPage() {
  const { slug } = useParams();

  const { data: blog, isLoading } = useFetchBlog(slug);

  if (!isLoading && !blog) return <NotFoundPage />;

  return (
    <Layout title={blog?.title}>
      {isLoading && <Loading className="py-5" />}

      {blog && (
        <div className="container">
          <div className="d-flex justify-content-center">
            <div className="blog__content">
              <div className="blog__meta d-flex mb-2">
                <div className="d-flex align-items-center me-3">
                  <Link
                    className="btn btn-primary btn-sm border rounded-5 px-3"
                    to={`/blogs?category_id=${blog.category.id}`}
                  >
                    {blog.category.name}
                  </Link>
                </div>

                <div className="d-flex align-items-center me-3">
                  {formatDateTime(blog.created_at)}
                </div>

                <div className="d-flex align-items-center me-3">
                  {blog.author}
                </div>

                <div className="d-flex align-items-center me-3">
                  <i className="bi bi-eye-fill me-1"></i>
                  {blog.views_count}
                </div>

                <div className="d-flex align-items-center">
                  {blog.min_read} min read
                </div>
              </div>

              <h1 className="fw-bold mb-3">{blog.title}</h1>

              <figure className="mb-3">
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="object-fit-cover w-100 img-fluid rounded-3"
                  loading="lazy"
                  style={{ aspectRatio: "4/2.5" }}
                />
                {blog.featured_image_description && (
                  <figcaption className="text-center">
                    {blog.featured_image_description}
                  </figcaption>
                )}
              </figure>

              <div
                className="mb-3"
                style={{ fontSize: "1.125rem" }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              ></div>

              <div className="blog__tags">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/blogs?tag_id=${tag.id}`}
                    className="btn btn-sm btn-primary border rounded-0 me-2"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default BlogDetailPage;
