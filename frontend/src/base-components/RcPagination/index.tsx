import Pagination from "rc-pagination";
import React, { useState } from "react";
import "rc-pagination/assets/index.css"; // Import the pagination styles

const RcPagination = ({
  total,
  per_page,
  current,
}: {
  total: number;
  per_page: number;
  current: number;
}) => {
  const [currentPage, setCurrentPage] = useState(current);

  const PaginationChange = (page: number) => {
    setCurrentPage(page);
    // You can perform any other actions here based on the page change
  };

  const PrevNextArrow = (
    current: number,
    type: string,
    originalElement: React.ReactNode
  ) => {
    if (type === "prev") {
      return (
        <button>
          <i className="fa fa-angle-double-left"></i>
        </button>
      );
    }
    if (type === "next") {
      return (
        <button>
          <i className="fa fa-angle-double-right"></i>
        </button>
      );
    }
    return originalElement;
  };

  return (
    <>
      <Pagination
        className="pagination-data"
        showTotal={(total: any, range: any[]) =>
          `Showing ${range[0]}-${range[1]} of ${total}`
        }
        onChange={PaginationChange}
        total={total}
        current={currentPage}
        pageSize={per_page}
        showSizeChanger={false}
        itemRender={PrevNextArrow}
      />
    </>
  );
};

export default RcPagination;
