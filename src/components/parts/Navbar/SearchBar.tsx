import { type ChangeEvent, type FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface SearchBarProps {
  className?: string;
}

const SearchBar = ({ className }: SearchBarProps) => {
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
      className={`search-bar d-flex flex-row ${className}`}
      onSubmit={handleSubmit}
    >
      <div className="input-group">
        <input
          type="search"
          className="form-control"
          placeholder="Cari parfum disini..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
        <button className="btn" type="submit">
          <i className="bi bi-search"></i>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
