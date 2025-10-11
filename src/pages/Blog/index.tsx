import { useFetchBlogs } from "../../services/api/blog";
import type { BlogParamsTypes } from "../../types/blog";
import BlogItem from "../../components/shared/BlogItem";
import Loading from "../../components/ui/Loading";
import Pagination from "../../components/ui/Pagination";
import Layout from "../../components/layout/Layout";
import BlogListFilters from "./BlogListFilters";
import useFilters from "../../hooks/useFilters";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { Button, Form, Offcanvas } from "react-bootstrap";
import NoData from "../../components/ui/NoData";
import { Helmet } from "react-helmet-async";

const SORT_OPTIONS: { label: string; value: string }[] = [
  {
    label: "Default",
    value: "",
  },
  {
    label: "Terbaru",
    value: "newest",
  },
  {
    label: "Terlama",
    value: "oldest",
  },
];

function BlogPage() {
  const { params, setFilter, queryString, clearFilters } =
    useFilters<BlogParamsTypes>();
  const [searchTerm, setSearchTerm] = useState<string>(params.search || "");
  const { data: blogs, isLoading } = useFetchBlogs(queryString);
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

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

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilter("sort_by", e.target.value);

    clearFilters("page");
  };

  return (
    <Layout>
      <Helmet>
        <title>Blog | {import.meta.env.VITE_APP_NAME}</title>
      </Helmet>

      <div className="container">
        <div className="row">
          <div className="col-lg-2 d-none d-lg-block">
            <BlogListFilters />
          </div>
          <div className="col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-3">
              {/* Desktop Only */}
              <div className="d-none d-lg-block">
                <span className="text-gray-700 mb-0 me-2">Urutkan:</span>
                <Form.Select
                  defaultValue=""
                  onChange={handleSortChange}
                  className="d-inline-block cursor-pointer w-auto"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </div>
              {/* End Desktop Only */}

              <p className="text-gray-700 mb-0">
                {blogs?.page?.from || 0} - {blogs?.page?.to || 0} dari{" "}
                {blogs?.page?.total || 0}
              </p>

              {/* Mobile Only */}
              <div className="d-flex gap-2 d-lg-none">
                <Button
                  size="sm"
                  variant="outline-dark"
                  onClick={() => setShowSort(true)}
                >
                  <i className="bi bi-arrow-down-up"></i>
                </Button>

                <Button
                  size="sm"
                  variant="outline-dark"
                  onClick={() => setShowFilter(true)}
                >
                  <i className="bi bi-funnel"></i>
                </Button>

                <Offcanvas
                  show={showFilter}
                  onHide={() => setShowFilter(false)}
                  placement="end"
                >
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                      <i className="bi bi-funnel-fill"></i> Filter
                    </Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <BlogListFilters />
                  </Offcanvas.Body>
                </Offcanvas>

                <Offcanvas
                  show={showSort}
                  onHide={() => setShowSort(false)}
                  placement="end"
                >
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                      <i className="bi bi-arrow-down-up"></i> Sort
                    </Offcanvas.Title>
                  </Offcanvas.Header>

                  <Offcanvas.Body>
                    <Form.Select
                      defaultValue=""
                      onChange={handleSortChange}
                      className="d-inline-block cursor-pointer w-100"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Offcanvas.Body>
                </Offcanvas>
              </div>
              {/* End Mobile Only */}
            </div>

            <div className="d-flex justify-content-center align-items-center mb-3 bg-primary py-2 rounded">
              <form className="mx-auto w-50" onSubmit={handleSearchSubmit}>
                <input
                  className="form-control w-100 border-0"
                  type="search"
                  placeholder="Cari blog disini..."
                  name="search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
            </div>

            {isLoading && <Loading className="py-5" />}

            {blogs?.data?.length === 0 && <NoData />}

            {blogs?.data && blogs?.data?.length > 0 && (
              <>
                <div className="row g-3">
                  {blogs.data.map((blog) => (
                    <div
                      key={`blog-${blog.id}`}
                      className="col-6 col-md-4 col-lg-3"
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
