import React from 'react';
import ReactPaginate from 'react-paginate';
import SearchContext from '../utils/searchContext';

const Pagination = () => {
  return (
    <SearchContext.Consumer>
      {({ setFilters, b_size, filters, total, getTranslationFor }) => {
        const b_start = filters.b_start || 0;
        const currentPage = b_start === 0 ? 0 : b_start / b_size;

        const handlePageChange = data => {
          setFilters({ b_start: data.selected * b_size });
          setTimeout(() => {
            let resultsList = document.getElementById('content');
            if (resultsList && resultsList.scrollIntoView) {
              resultsList.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }
          }, 300);
        };
        if (total && total > b_size) {
          return (
            <div className="navigation">
              <ReactPaginate
                initialPage={currentPage}
                disableInitialCallback={true}
                previousLabel="<"
                nextLabel=">"
                nextAriaLabel={getTranslationFor('next_aria_label')}
                previousAriaLabel={getTranslationFor('prev_aria_label')}
                breakLabel={'...'}
                breakAriaLabels={{
                  forward: getTranslationFor('jump_forward_label'),
                  backward: getTranslationFor('jump_backward_label'),
                }}
                breakClassName={'break-me'}
                pageCount={Math.ceil(total / b_size)}
                pageRangeDisplayed={2}
                marginPagesDisplayed={2}
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
