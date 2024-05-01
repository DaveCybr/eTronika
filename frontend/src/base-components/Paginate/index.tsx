// src/components/Paginate.tsx
import React from "react";
import Lucide from "../../base-components/Lucide";
import Pagination from "../../base-components/Pagination";

interface PaginateProps {
  meta: any;
  onPageChange: (newPage: number) => void;
}

const Paginate: React.FC<PaginateProps> = ({ meta, onPageChange }) => {
  return (
    <Pagination className="w-full sm:w-auto sm:mr-auto">
      <button
        onClick={() => onPageChange(1)}
        disabled={meta.current_page === 1}
      >
        <Lucide
          icon="ChevronsLeft"
          className={`w-8 h-4 ${
            meta.current_page === 1 ? "text-slate-300" : ""
          }`}
        />
      </button>
      <button
        onClick={() => onPageChange(meta.current_page - 1)}
        disabled={meta.current_page === 1}
      >
        <Lucide
          icon="ChevronLeft"
          className={`w-12 mr-1 h-4 ${
            meta.current_page === 1 ? "text-slate-300" : ""
          }`}
        />
      </button>
      <Pagination.Link
        active={!!meta.current_page}
        onClick={() => onPageChange(meta.current_page)}
      >
        {meta.current_page}
      </Pagination.Link>
      <button
        onClick={() => onPageChange(meta.current_page + 1)}
        disabled={meta.current_page === meta.last_page}
      >
        <Lucide
          icon="ChevronRight"
          className={`w-8 h-4 ${
            meta.current_page === meta.last_page ? "text-slate-300" : ""
          }`}
        />
      </button>
      <button
        onClick={() => onPageChange(meta.last_page)}
        disabled={meta.current_page === meta.last_page}
      >
        <Lucide
          icon="ChevronsRight"
          className={`w-10 h-4 ${
            meta.current_page === meta.last_page ? "text-slate-300" : ""
          }`}
        />
      </button>
    </Pagination>
  );
};

export default Paginate;
