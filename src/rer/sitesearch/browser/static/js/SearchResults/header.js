import React, { useState } from 'react';
import Select from 'react-select';
import SearchContext from '../utils/searchContext';

const Header = ({ searchHasFilters = false }) => {
  const [orderBy, setOrderBy] = useState({
    value: 'rilevanza',
    label: 'Rilevanza',
  });

  return (
    <SearchContext.Consumer>
      {({ translations }) => (
        <div className="results-header">
          <div className="total-items">
            <span>
              40{' '}
              <span className="desktop-only">
                {translations['elementi su']}{' '}
              </span>
              <span className="mobile-only">/ </span> 70{' '}
              <span className="desktop-only">{translations['filtrati']}</span>
            </span>{' '}
            {searchHasFilters && (
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                }}
              >
                ({translations['Annulla filtri']})
              </a>
            )}
          </div>
          <div className="order-by">
            <div className="select-label desktop-only">
              {translations['Ordina per']}{' '}
            </div>
            <div className="select">
              <Select
                options={[
                  { value: 'rilevanza', label: 'Rilevanza' },
                  { value: 'date-desc', label: 'Più recenti' },
                ]}
                isClearable={false}
                placeholder={translations['Ordina per']}
                defaultValue={orderBy}
                onChange={option => setOrderBy(option)}
              />
            </div>
          </div>
        </div>
      )}
    </SearchContext.Consumer>
  );
};

export default Header;
