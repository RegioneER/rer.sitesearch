import React from 'react';
//import SearchContext from '../../utils/searchContext';
import ReactPaginate from 'react-paginate';
import SearchContext from '../utils/searchContext';

const Pagination = () => {
  return (
    <SearchContext.Consumer>
      {({ setFilters, b_size, filters, total }) => {
        const b_start = filters.b_start || 0;
        const currentPage = b_start === 0 ? 0 : b_start / b_size;

        const handlePageChange = data => {
          setFilters({ b_start: data.selected * b_size });
        };

        if (total && total > b_size) {
          return (
            <div className="navigation">
              <ReactPaginate
                initialPage={currentPage}
                disableInitialCallback={true}
                previousLabel="<"
                nextLabel=">"
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(total / b_size)}
                onPageChange={handlePageChange}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
              ></ReactPaginate>
            </div>
          );
        } else {
          return '';
        }
      }}
    </SearchContext.Consumer>
  );
};

export default Pagination;
