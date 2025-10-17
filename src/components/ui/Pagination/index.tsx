import { Pagination as BootstrapPagination } from "react-bootstrap";
import type { PageTypes } from "@/types";
import { useEffect, useState } from "react";

type PaginationProps = PageTypes & {
  onClick: (page: number) => void;
};

function Pagination({ current_page, last_page, onClick }: PaginationProps) {
  const [active, setActive] = useState<number>(current_page);

  // keep internal active in sync when parent changes current_page
  useEffect(() => {
    setActive(current_page);
  }, [current_page]);

  const handleClick = (page: number) => () => {
    setActive(page);

    onClick(page);
  };

  const renderPages = () => {
    // If few pages, render all
    if (last_page <= 7) {
      return [...Array(last_page)].map((_, index) => (
        <BootstrapPagination.Item
          key={index}
          active={index + 1 === active}
          onClick={handleClick(index + 1)}
        >
          {index + 1}
        </BootstrapPagination.Item>
      ));
    }

    const elems: JSX.Element[] = [];
    elems.push(
      <BootstrapPagination.Item
        key={1}
        active={1 === active}
        onClick={handleClick(1)}
      >
        {1}
      </BootstrapPagination.Item>
    );

    const start = Math.max(2, active - 2);
    const end = Math.min(last_page - 1, active + 2);

    if (start > 2) elems.push(<BootstrapPagination.Ellipsis key="ell-left" />);

    for (let p = start; p <= end; p++) {
      elems.push(
        <BootstrapPagination.Item
          key={p}
          active={p === active}
          onClick={handleClick(p)}
        >
          {p}
        </BootstrapPagination.Item>
      );
    }

    if (end < last_page - 1)
      elems.push(<BootstrapPagination.Ellipsis key="ell-right" />);

    elems.push(
      <BootstrapPagination.Item
        key={last_page}
        active={last_page === active}
        onClick={handleClick(last_page)}
      >
        {last_page}
      </BootstrapPagination.Item>
    );

    return elems;
  };

  return (
    <BootstrapPagination className="d-flex justify-content-center align-items-center flex-wrap gap-2 mt-5">
      <BootstrapPagination.First
        disabled={active === 1}
        onClick={handleClick(1)}
      />
      <BootstrapPagination.Prev
        disabled={active === 1}
        onClick={handleClick(Math.max(1, active - 1))}
      />

      {renderPages()}

      <BootstrapPagination.Next
        disabled={active === last_page}
        onClick={handleClick(Math.min(last_page, active + 1))}
      />
      <BootstrapPagination.Last
        disabled={active === last_page}
        onClick={handleClick(last_page)}
      />
    </BootstrapPagination>
  );
}

export default Pagination;
