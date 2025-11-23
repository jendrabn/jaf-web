import { Link } from "react-router";
import { Card, Spinner } from "react-bootstrap";
import { useFetchBlogCategories, useFetchBlogTags } from "@/hooks/api/blog";

function BlogSidebar() {
  const { data: categories, isLoading: isLoadingCategories } =
    useFetchBlogCategories();
  const { data: tags, isLoading: isLoadingTags } = useFetchBlogTags();

  return (
    <aside className="d-flex flex-column gap-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="fw-bold fs-5">Kategori</Card.Header>
        <Card.Body className="p-0">
          {isLoadingCategories ? (
            <div className="d-flex align-items-center gap-2 px-3 py-4 text-secondary-emphasis">
              <Spinner animation="border" size="sm" />
              <span>Memuat kategori...</span>
            </div>
          ) : categories && categories.length > 0 ? (
            categories.map((category, index) => (
              <div
                key={`category-${category.id}`}
                className={`d-flex align-items-center justify-content-between px-3 py-3 ${
                  index !== categories.length - 1 ? "border-bottom" : ""
                }`}
              >
                <Link
                  to={`/blog?category_id=${category.id}`}
                  className="fw-semibold text-decoration-none link-body-emphasis"
                >
                  {category.name}
                </Link>
                <span className="badge bg-white text-body border rounded-pill px-3 py-2 fw-semibold shadow-sm">
                  {category.blogs_count}
                </span>
              </div>
            ))
          ) : (
            <div className="px-3 py-4 text-secondary-emphasis">
              Kategori belum tersedia.
            </div>
          )}
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0">
        <Card.Header className="fw-bold fs-5">Tag</Card.Header>
        <Card.Body>
          {isLoadingTags ? (
            <div className="d-flex align-items-center gap-2 text-secondary-emphasis">
              <Spinner animation="border" size="sm" />
              <span>Memuat tag...</span>
            </div>
          ) : tags && tags.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  to={`/blog?tag_id=${tag.id}`}
                  key={`tag-${tag.id}`}
                  className="text-decoration-none"
                >
                  <span className="d-inline-flex align-items-center gap-2 border rounded-pill px-3 py-2 bg-white text-body-emphasis fw-medium shadow-sm small">
                    <i className="bi bi-tag"></i>
                    {tag.name}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-secondary-emphasis">Tag belum tersedia.</div>
          )}
        </Card.Body>
      </Card>
    </aside>
  );
}

export default BlogSidebar;
