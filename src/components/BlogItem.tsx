import { NavLink } from "react-router";
import { type BlogItemTypes } from "../types/blog";

const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });

export default function BlogItem({ blog }: { blog: BlogItemTypes }) {
  return (
    <NavLink
      to={`/blogs/${blog.slug}`}
      className="card card__blog-item text-decoration-none bg-gray-100 h-100"
    >
      <figure
        className="card__blog-item-image w-100 bg-gray-300 m-0"
        style={{ aspectRatio: "4/3" }}
      >
        <img
          src={blog.featured_image}
          alt={blog.title}
          className="card-img-top object-fit-contain w-100 h-100"
          loading="lazy"
        />
      </figure>

      <div className="card-body">
        <h5 className="card-title title-truncate" style={{ fontWeight: 700 }}>
          {blog.title}
        </h5>
        <p className="card-text text-muted">{blog.content_thumbnail}</p>
        <p className="mb-0 text-gray-700">
          <span>{formatDate(blog.created_at)}</span> &bull;{" "}
          <span className="text-uppercase fw-bold">{blog.category.name}</span>{" "}
          &bull; <span>{blog.min_read} min read</span>
        </p>
      </div>
    </NavLink>
  );
}
