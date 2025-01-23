import { Link, useParams } from "react-router";
import { useFetchBlog } from "../services/api/blog";
import Layout from "../layouts/Layout";
import NotFoundPage from "./NotFoundPage";
import Loading from "../components/Loading";
import { formatDate } from "../utils/functions";

function BlogDetailPage() {
  const { slug } = useParams();

  const { data: blog, isLoading } = useFetchBlog(slug ?? "");

  if (!isLoading && !blog) return <NotFoundPage />;

  return (
    <Layout title={blog?.title ?? ""}>
      {isLoading && <Loading className="py-5" />}

      {blog && (
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <picture>
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="object-fit-cover w-100 img-fluid rounded-3"
                  loading="lazy"
                  style={{ aspectRatio: "4/2.5" }}
                />
              </picture>
              {blog.featured_image_description && (
                <p className="text-muted text-center mb-0">
                  <small> {blog.featured_image_description}</small>
                </p>
              )}
            </div>
            <div className="col-lg-6 d-flex flex-column justify-content-center">
              <div className="blog__meta-category mb-2">
                <Link
                  className="btn btn-light btn-sm border rounded-0"
                  to={`/blogs?category_id=${blog.category.id}`}
                >
                  {blog.category.name}
                </Link>
              </div>

              <h1 className="fw-bold h1 text-gray-900">{blog.title}</h1>

              <div className="blog__meta-author-date">
                <div className="d-flex align-items-center">
                  <img
                    src="https://avatar.iran.liara.run/public/48"
                    alt="avatar"
                    className="rounded-circle me-2"
                    loading="lazy"
                    style={{ aspectRatio: "1/1", width: "42px" }}
                  />
                  <div>
                    <div className="fw-bold">{blog.author}</div>
                    <div className="text-muted">
                      {formatDate(blog.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="blog__content mt-3"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          ></div>

          <div className="mt-3 blog__tags">
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
      )}
    </Layout>
  );
}

export default BlogDetailPage;
