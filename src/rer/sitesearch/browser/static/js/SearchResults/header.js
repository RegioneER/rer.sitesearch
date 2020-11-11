import React, { useState } from 'react';
import Select from 'react-select';

const Header = () => {
  const [orderBy, setOrderBy] = useState({
    value: 'rilevanza',
    label: 'Rilevanza',
  });

  return (
    <div className="row">
      <div className="col-xs-6">
        40 elementi su 70 filtrati{' '}
        <a href="javascript:0" onClick={() => {}}>
          (Annulla filtri)
        </a>
      </div>
      <div className="col-xs-6">
        Ordina per{' '}
        <Select
          options={[
            { value: 'rilevanza', label: 'Rilevanza' },
            { value: 'date-desc', label: 'Più recenti' },
          ]}
          isClearable={true}
          placeholder={'Ordina per'}
          defaultValue={orderBy}
          onChange={option => setOrderBy(option)}
        />
      </div>
    </div>
  );
};

export default Header;
