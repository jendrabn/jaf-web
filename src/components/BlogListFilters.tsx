import { BlogCategoryTypes, BlogTagTypes } from "../types/blog";
import { Accordion } from "react-bootstrap";
import useFilters from "../hooks/useFilters";
import { ChangeEvent } from "react";
import { useFetchBlogCategories, useFetchBlogTags } from "../services/api/blog";

function BlogListFilters() {
  const { setFilter, clearFilters, params } = useFilters();

  const { data: categories } = useFetchBlogCategories();
  const { data: tags } = useFetchBlogTags();

  return (
    <div className="blog__filter">
      <h5 className="mb-4">
        <i className="fa-solid fa-filter"></i> Filter
      </h5>

      <Accordion defaultActiveKey="0" flush alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Category</Accordion.Header>
          <Accordion.Body>
            {categories?.map((category: BlogCategoryTypes) => (
              <div className="form-check mb-2" key={`category-${category.id}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={category.id == params.category_id}
                  id={`category-${category.id}`}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      setFilter("category_id", category.id);
                    } else {
                      clearFilters("category_id");
                    }
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor={`category-${category.id}`}
                >
                  {category.name}
                </label>
              </div>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion defaultActiveKey="1" flush alwaysOpen>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Tag</Accordion.Header>
          <Accordion.Body>
            {tags?.map((tag: BlogTagTypes) => (
              <div className="form-check mb-2" key={`tag-${tag.id}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={tag.id == params.tag_id}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      setFilter("tag_id", tag.id);
                    } else {
                      clearFilters("tag_id");
                    }
                  }}
                  id={`tag-${tag.id}`}
                />
                <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                  {tag.name}
                </label>
              </div>
            ))}
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
