import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
  useRef,
} from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import fetchApi from "@/utils/api";

interface SearchBarProps {
  className?: string;
}

const DEFAULT_SIZE = 10;

const SearchBar = ({ className }: SearchBarProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search") || ""
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    navigate(
      `/products${
        searchTerm.trim().length > 0
          ? `?search=${encodeURIComponent(searchTerm.trim())}`
          : ""
      }`
    );
    setShowSuggestions(false);
  };

  // Fetch suggestions when user types >= 3 characters (debounced)
  useEffect(() => {
    const q = searchTerm.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const resp = await fetchApi().get("/products/suggestions", {
          params: { q, size: DEFAULT_SIZE },
        });

        let data: string[] = [];
        if (Array.isArray(resp)) {
          data = resp as string[];
        } else if (resp && typeof resp === "object" && "data" in resp) {
          const r = resp as { data: unknown };
          if (Array.isArray(r.data)) {
            data = r.data as string[];
          }
        }
        setSuggestions(data);
        setShowSuggestions(isFocused && data.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, isFocused]);

  // Close suggestions when clicking outside the search bar
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
    };
  }, []);

  return (
    <form
      className={`search-bar d-flex flex-row ${className}`}
      onSubmit={handleSubmit}
    >
      <div ref={containerRef} className="input-group position-relative">
        <input
          ref={inputRef}
          type="search"
          className="form-control"
          placeholder="Cari parfum disini..."
          value={searchTerm}
          onFocus={() => {
            setIsFocused(true);
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          onBlur={() => {
            // Biarkan listener klik-luar yang menutup dropdown
            setTimeout(() => setIsFocused(false), 0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowSuggestions(false);
          }}
        />
        <button className="btn" type="submit" aria-label="Cari">
          <i className="bi bi-search"></i>
        </button>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div
            className="shadow-sm rounded-3 bg-white border mt-1"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1030,
              overflow: "hidden",
            }}
            onMouseDown={(e) => {
              // Prevent input blur from closing when clicking inside
              e.preventDefault();
            }}
          >
            <div className="list-group list-group-flush">
              {loading && (
                <div className="list-group-item d-flex align-items-center py-2">
                  <div
                    className="spinner-border spinner-border-sm text-secondary me-2"
                    role="status"
                    aria-hidden="true"
                  ></div>
                  <span className="text-muted">Memuat saran…</span>
                </div>
              )}

              {!loading && suggestions.length === 0 && (
                <div className="list-group-item py-2">
                  <span className="text-muted">Tidak ada saran</span>
                </div>
              )}

              {!loading &&
                suggestions.length > 0 &&
                suggestions.map((item) => {
                  const to = `/products?search=${encodeURIComponent(item)}`;
                  return (
                    <Link
                      key={item}
                      to={to}
                      className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-2"
                      onClick={() => {
                        setSearchTerm(item);
                        setShowSuggestions(false);
                      }}
                    >
                      <span className="text-dark">{item}</span>
                      <i className="bi bi-arrow-return-right text-muted ms-2"></i>
                    </Link>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
