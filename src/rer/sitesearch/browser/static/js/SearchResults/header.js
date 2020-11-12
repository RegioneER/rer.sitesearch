import React, { useState } from 'react';
import Select from 'react-select';

const Header = ({ searchHasFilters = false }) => {
  const [orderBy, setOrderBy] = useState({
    value: 'rilevanza',
    label: 'Rilevanza',
  });

  return (
    <div className="results-header">
      <div className="total-items">
        <span aria-live="polit">40 elementi su 70 filtrati</span>{' '}
        {searchHasFilters && (
          <a href="javascript:0" onClick={() => {}}>
            (Annulla filtri)
          </a>
        )}
      </div>
      <div className="order-by">
        <div className="select-label">Ordina per </div>
        <div className="select">
          <Select
            options={[
              { value: 'rilevanza', label: 'Rilevanza' },
              { value: 'date-desc', label: 'Più recenti' },
            ]}
            isClearable={false}
            placeholder={'Ordina per'}
            defaultValue={orderBy}
            onChange={option => setOrderBy(option)}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
