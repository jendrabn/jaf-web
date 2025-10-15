import type { BlogCategoryTypes, BlogTagTypes } from "../../types/blog";
import { Accordion, Button } from "react-bootstrap";
import useFilters from "../../hooks/useFilters";
import { useFetchBlogCategories, useFetchBlogTags } from "../../hooks/api/blog";

function BlogFilters() {
  const { setFilter, clearFilters, params } = useFilters();

  const { data: categories } = useFetchBlogCategories();
  const { data: tags } = useFetchBlogTags();

  return (
    <div className="blog-filters d-flex flex-column gap-3">
      <Accordion defaultActiveKey="0" flush alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Kategori</Accordion.Header>
          <Accordion.Body>
            <ul className="list-unstyled mb-0">
              {categories?.map((category: BlogCategoryTypes) => (
                <li key={`category-${category.id}`} className="mb-2">
                  <span
                    role="button"
                    className={
                      category.id == params.category_id
                        ? "text-primary fw-bold"
                        : "text-dark-emphasis"
                    }
                    onClick={() => setFilter("category_id", category.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {category.name}
                  </span>
                </li>
              ))}
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion defaultActiveKey="1" flush alwaysOpen>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Tag</Accordion.Header>
          <Accordion.Body>
            <ul className="list-unstyled mb-0">
              {tags?.map((tag: BlogTagTypes) => (
                <li key={`tag-${tag.id}`} className="mb-2">
                  <span
                    role="button"
                    className={
                      tag.id == params.tag_id
                        ? "text-primary fw-bold"
                        : "text-dark-emphasis"
                    }
                    onClick={() => setFilter("tag_id", tag.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {tag.name}
                  </span>
                </li>
              ))}
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="d-grid">
        <Button
          type="button"
          variant="outline-danger"
          onClick={() => {
            clearFilters("category_id", "tag_id");
          }}
        >
          Hapus Semua
        </Button>
      </div>
    </div>
  );
}

export default BlogFilters;
