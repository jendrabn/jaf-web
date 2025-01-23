import { useFetchBlogs } from "../services/api/blog";
import { BlogParamsTypes } from "../types/blog";
import BlogItem from "../components/BlogItem";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import Layout from "../layouts/Layout";
import BlogListFilters from "../components/BlogListFilters";
import useFilters from "../hooks/useFilters";
import { FormEvent, useState } from "react";

function BlogPage() {
  const { params, setFilter, queryString, clearFilters } =
    useFilters<BlogParamsTypes>();

  const [searchTerm, setSearchTerm] = useState<string>(params.search || "");

  const { data: blogs, isLoading } = useFetchBlogs(queryString);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFilter("search", searchTerm);
  };

  const handlePageClick = (page: number) => {
    setFilter("page", page);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <Layout title="Blogs">
      <div className="container">
        <div className="row">
          <div className="col-lg-2">
            <BlogListFilters />
          </div>
          <div className="col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="text-gray-700 mb-0 me-2">Sort by:</span>
                <select
                  className="form-select w-auto d-inline-block"
                  onChange={(e) => {
                    setFilter("sort_by", e.target.value);

                    clearFilters("page");
                  }}
                >
                  <option value="">Relevance</option>
                  <option value="newest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="views">Views</option>
                </select>
              </div>

              <form
                className="d-flex align-items-center w-50"
                onSubmit={handleSearchSubmit}
              >
                <input
                  className="form-control w-100 d-inline-block"
                  type="search"
                  placeholder="Search for blogs"
                  name="search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>

              <p className="text-gray-700 mb-0">
                Showing {blogs?.data?.length || 0} results
              </p>
            </div>

            {isLoading && <Loading className="py-5" />}

            {blogs?.data?.length === 0 && (
              <p className="text-center text-gray-700 mb-0 py-5">
                No products found
              </p>
            )}

            {blogs?.data && blogs?.data?.length > 0 && (
              <>
                <div className="row g-3">
                  {blogs.data.map((blog) => (
                    <div
                      key={`blog-${blog.id}`}
                      className="col-12 col-md-6 col-lg-3"
                    >
                      <BlogItem blog={blog} />
                    </div>
                  ))}
                </div>

                {blogs?.page && (
                  <Pagination
                    {...blogs.page}
                    onClick={(page) => handlePageClick(page)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BlogPage;
