import { NavLink } from "react-router";
import { BlogItemTypes } from "../types/blog";

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });

export default function BlogItem({ blog }: { blog: BlogItemTypes }) {
  return (
    <NavLink
      to={`/blogs/${blog.slug}`}
      className="card card__blog-item text-decoration-none bg-gray-100 h-100"
    >
      <picture className="card__blog-item-image" style={{ aspectRatio: "4/3" }}>
        <img
          src={blog.featured_image}
          alt={blog.title}
          className="card-img-top object-fit-contain w-100 h-100"
          loading="lazy"
        />
      </picture>

      <div className="card-body px-2">
        <div className="card__blog-item-meta fw-bold fs-6">
          {formatDate(blog.created_at)} &bull;{" "}
          <span className="text-uppercase">{blog.category.name}</span> &bull;{" "}
          {blog.min_read} min{" "}
        </div>
        <div className="card__blog-item-title h4 text-truncate">
          {blog.title}
        </div>
        <p className="card__blog-item-content-thumb card-text fs-6 text-gray-700 ">
          {blog.content_thumbnail}
        </p>
      </div>
    </NavLink>
  );
}
