import type { BlogCategoryTypes, BlogTagTypes } from "../types/blog";
import { Accordion } from "react-bootstrap";
import useFilters from "../hooks/useFilters";
import { useFetchBlogCategories, useFetchBlogTags } from "../services/api/blog";

function BlogListFilters() {
  const { setFilter, clearFilters, params } = useFilters();

  const { data: categories } = useFetchBlogCategories();
  const { data: tags } = useFetchBlogTags();

  return (
    <div className="blog__filter">
      <h5 className="mb-4 d-none d-lg-block">
        <i className="fa-solid fa-filter"></i> Filter
      </h5>

      <Accordion defaultActiveKey="0" flush alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Category</Accordion.Header>
          <Accordion.Body>
            <ul className="list-unstyled mb-0">
              {categories?.map((category: BlogCategoryTypes) => (
                <li key={`category-${category.id}`} className="mb-2">
                  <span
                    role="button"
                    className={
                      category.id == params.category_id
                        ? "text-primary fw-bold"
                        : "text-dark"
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
                        : "text-dark"
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

      <div className="d-grid mt-4">
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => {
            clearFilters("category_id", "tag_id");
          }}
        >
          Clear all
        </button>
      </div>
    </div>
  );
}

export default BlogListFilters;
