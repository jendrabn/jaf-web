import { Link, useParams } from "react-router";
import { useFetchBlog } from "../services/api/blog";
import Layout from "../layouts/Layout";
import NotFoundPage from "./NotFoundPage";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";

const formatDate = (date: string) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("id-ID", { month: "long" });
  const year = d.getFullYear();
  const hours = d.getHours();
  const minutes = d.getMinutes();

  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

function BlogDetailPage() {
  const { slug } = useParams();

  const { data: blog, isLoading } = useFetchBlog(slug);

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
            <div className="row flex-column-reverse flex-lg-row">
              <div className="col-lg-7">
                <figure style={{ aspectRatio: "4/2" }} className="mb-0">
                  <img
                    src={blog.featured_image}
                    alt={blog.title}
                    className="object-fit-fill w-100 h-100 img-fluid rounded-3"
                    loading="lazy"
                  />
                  {blog.featured_image_description && (
                    <figcaption className="text-center text-gray-700">
                      {blog.featured_image_description}
                    </figcaption>
                  )}
                </figure>
              </div>
              <div className="col-lg-5 align-self-center mb-3 mb-lg-0">
                <div className="blog__category mb-3">
                  <Link
                    className="btn btn-light btn-sm border border-1 rounded-0 px-3 border-dark-subtle"
                    to={`/blogs?category_id=${blog.category.id}`}
                  >
                    {blog.category.name}
                  </Link>
                </div>

                <h1 className="fw-bold mb-3 text-gray-800">{blog.title}</h1>

                <div className="blog__meta d-flex align-items-center">
                  <div className="pe-2 me-2 border-end">
                    <picture
                      className="me-2 rounded-circle bg-gray-300 d-none d-md-inline-block"
                      style={{ width: 35, height: 35 }}
                    >
                      <img
                        src="/img/user.png"
                        alt="Author"
                        className="w-100 h-100"
                      />
                    </picture>
                    <span style={{ fontWeight: 700 }}>{blog.author}</span>
                  </div>

                  <div className="pe-2 me-2 border-end">
                    {formatDate(blog.created_at)}
                  </div>

                  <div className="pe-2 me-2 border-end">
                    <i className="bi bi-eye-fill me-2"></i>
                    {blog.views_count}
                  </div>

                  <div className="">{blog.min_read} min read</div>
                </div>
              </div>
            </div>

            <div className="row mt-3 mt-lg-5">
              <div className="col-md-8 offset-md-2">
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
        </>
      )}
    </Layout>
  );
}

export default BlogDetailPage;
