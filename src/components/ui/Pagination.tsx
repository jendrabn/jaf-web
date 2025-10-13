import { Pagination as BootstrapPagination } from "react-bootstrap";
import type { PageTypes } from "../../types";
import { useState } from "react";

type PaginationProps = PageTypes & {
  onClick: (page: number) => void;
};

function Pagination({ current_page, last_page, onClick }: PaginationProps) {
  const [active, setActive] = useState<number>(current_page);

  const handleClick = (page: number) => () => {
    setActive(page);

    onClick(page);
  };

  return (
    <BootstrapPagination className="d-flex justify-content-center align-items-center flex-wrap gap-2 mt-5">
      <BootstrapPagination.First
        disabled={active == 1}
        onClick={handleClick(1)}
      />
      <BootstrapPagination.Prev
        disabled={active == 1}
        onClick={handleClick(active - 1)}
      />
      {[...Array(last_page)].map((_, index) => (
        <BootstrapPagination.Item
          key={index}
          active={index + 1 == active}
          onClick={handleClick(index + 1)}
        >
          {index + 1}
        </BootstrapPagination.Item>
      ))}
      <BootstrapPagination.Next
        disabled={active == last_page}
        onClick={handleClick(active + 1)}
      />
      <BootstrapPagination.Last
        disabled={active == last_page}
        onClick={handleClick(last_page)}
      />
    </BootstrapPagination>
  );
}

export default Pagination;
