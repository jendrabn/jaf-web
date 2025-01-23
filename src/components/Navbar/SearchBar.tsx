import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface SearchBarProps {
  className?: string;
}

function SearchBar({ className }: SearchBarProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search") || ""
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate(
      `/products${searchTerm.trim().length > 0 ? `?search=${searchTerm}` : ""}`
    );
  };

  return (
    <form
      className={`d-flex flex-row search__bar ${className}`}
      onSubmit={handleSubmit}
    >
      <div className="input-group">
        <input
          type="search"
          className="form-control"
          placeholder="Search for products and brands"
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
        <button className="btn" type="submit">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
