import { Badge, Button } from "react-bootstrap";
import { useFetchBlogCategories, useFetchBlogTags } from "../../hooks/api/blog";
import useFilters from "../../hooks/useFilters";
import type { BlogParamsTypes } from "../../types/blog";

export default function BlogHeader() {
  const { params, setFilter, clearFilters } = useFilters<BlogParamsTypes>();
  const { data: categories } = useFetchBlogCategories();

  function TagBadge({ id, onClear }: { id: number; onClear: () => void }) {
    const { data: tags } = useFetchBlogTags();
    const t = tags?.find((tg) => tg.id === id);
    if (!t) return null;
    return (
      <Badge
        bg="light"
        text="dark"
        className="d-inline-flex align-items-center me-2"
      >
        <span className="me-2">{t.name}</span>
        <Button
          variant="link"
          size="sm"
          className="p-0 ms-1 text-dark"
          onClick={onClear}
          aria-label={`Clear tag ${t.name}`}
        >
          <i className="bi bi-x-lg" />
        </Button>
      </Badge>
    );
  }

  return (
    <div className="blog-header rounded-4 p-4 text-center mb-4">
      {/* decorative bubbles - purely visual */}
      <span className="bubble b1" aria-hidden="true" />
      <span className="bubble b2" aria-hidden="true" />
      <span className="bubble b3" aria-hidden="true" />
      <h1 className="display-6 fw-bold mb-1 text-truncate">
        {params.category_id
          ? `Blog ${
              categories?.find((c) => c.id === Number(params.category_id))
                ?.name ?? ""
            }`
          : "Blog"}
      </h1>

      <p className="lead text-muted mb-0">
        Artikel dan ulasan seputar parfum untuk membantu Anda memilih aroma
        terbaik.
      </p>

      {params.tag_id || params.search ? (
        <div className="d-flex justify-content-center gap-2 flex-wrap mt-3">
          {params.tag_id && (
            <TagBadge
              id={Number(params.tag_id)}
              onClear={() => clearFilters("tag_id")}
            />
          )}

          {params.search && (
            <Badge
              bg="secondary"
              className="d-inline-flex align-items-center me-2 text-white"
            >
              <span className="me-2">{`Search: ${params.search}`}</span>
              <Button
                variant="link"
                size="sm"
                className="p-0 ms-1 text-white"
                onClick={() => setFilter("search", "")}
                aria-label="Clear search"
              >
                <i className="bi bi-x-lg" />
              </Button>
            </Badge>
          )}
        </div>
      ) : null}
    </div>
  );
}
