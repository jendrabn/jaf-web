import { useFetchBlogs } from "../../hooks/api/blog";
import type { BlogParamsTypes } from "../../types/blog";
import BlogItem from "../../components/parts/BlogItem";
import Loading from "../../components/ui/Loading";
import Pagination from "../../components/ui/Pagination";
import Layout from "../../components/layouts/Layout";
import BlogFilters from "./BlogFilters";
import BlogHeader from "./BlogHeader";
import useFilters from "../../hooks/useFilters";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { Button, Form, InputGroup, Offcanvas, Dropdown } from "react-bootstrap";
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
    <Layout>
      <Helmet>
        <title>Blog | {import.meta.env.VITE_APP_NAME}</title>
        <meta
          name="description"
          content="Temukan artikel menarik seputar dunia parfum di blog kami. Baca tips, ulasan, dan berita terbaru tentang parfum."
        />
      </Helmet>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <BlogHeader />

            <div className="d-flex align-items-center justify-content-between gap-2 mb-4">
              <div className="d-flex gap-2">
                {/* Sort dropdown */}
                <Dropdown>
                  <Dropdown.Toggle
                    as={Button}
                    id="sort-btn"
                    variant="outline-dark"
                    className="no-caret"
                    aria-label="Sort"
                    title="Urutkan"
                  >
                    <i className="bi bi-arrow-down-up" aria-hidden="true" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {SORT_OPTIONS.map((option) => (
                      <Dropdown.Item
                        key={option.value}
                        active={params.sort_by === option.value}
                        onClick={() => {
                          setFilter("sort_by", option.value);
                          clearFilters("page");
                        }}
                      >
                        {option.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                {/* Filter Offcanvas */}
                <Button
                  variant="outline-dark"
                  title="Filter"
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
                    <BlogFilters />
                  </Offcanvas.Body>
                </Offcanvas>
              </div>

              {/* Search form */}
              <form
                className="blog-search-form w-100"
                onSubmit={handleSearchSubmit}
              >
                <InputGroup>
                  <Form.Control
                    type="search"
                    placeholder="Cari artikel disini..."
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setSearchTerm(e.target.value)
                    }
                    id="blog-search-input"
                  />
                  <Button type="submit" variant="outline-secondary">
                    <i className="bi bi-search"></i>
                  </Button>
                </InputGroup>
              </form>

              <p className="text-secondary-emphasis mb-0 d-none d-lg-block">
                {blogs?.page?.from || 0} - {blogs?.page?.to || 0} dari{" "}
                {blogs?.page?.total || 0} artikel
              </p>
            </div>

            {isLoading && <Loading className="py-5" />}

            {blogs?.data?.length === 0 && <NoData />}

            {blogs?.data && blogs?.data?.length > 0 && (
              <>
                <div className="row g-4">
                  {blogs.data.map((blog) => (
                    <div
                      key={`blog-${blog.id}`}
                      className="col-12 col-md-6 col-lg-4"
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
