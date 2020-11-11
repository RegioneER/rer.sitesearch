import React from 'react';
//import SearchContext from '../../utils/searchContext';
import ReactPaginate from 'react-paginate';

const Pagination = () => {
  return (
    <>
      {/* <SearchContext.Consumer> vedi unife per implementarlo*/}
      {({ setFilters, batching, translations }) => {
        const { numpages, pagesize, current_page } = batching;

        const handlePageChange = data => {
          setFilters({ b_start: data.selected * pagesize });
        };

        if (numpages && numpages > 1) {
          return (
            <div className="navigation">
              {' '}
              <ReactPaginate
                previousLabel={
                  translations ? translations.previous_label : 'Previous >'
                }
                nextLabel={translations ? translations.next_label : '< Next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={numpages}
                forcePage={current_page - 1}
                onPageChange={handlePageChange}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
              />
            </div>
          );
        } else {
          return '';
        }
      }}
      {/* </SearchContext.Consumer> */}
    </>
  );
};

export default Pagination;
