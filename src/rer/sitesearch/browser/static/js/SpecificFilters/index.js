import React from 'react';
import Select from 'react-select';

const SpecificFilters = () => {
  return (
    <div className="specific-filters">
      <strong>Filtra i bandi per finanziamenti ed opportunità</strong>
      <div className="row">
        <div className="col-xs-2">
          <Select
            options={[
              { value: 'aperto', label: 'Aperto' },
              { value: 'in-corso', label: 'In corso' },
              { value: 'chiuso', label: 'Chiuso' },
            ]}
            isMulti={true}
            isClearable={true}
            placeholder={'Stato'}

            //onChange={
            // option =>
            // onSelect({
            //   key: 'year',
            //   value: option ? parseInt(option.value) : null,
            // })
            //  }
          />
        </div>
        <div className="col-xs-2">
          <Select
            options={[
              { value: 'tipo-a', label: 'Tipo A' },
              { value: 'tipo-b', label: 'Tipo B' },
              { value: 'tipo-c', label: 'Tipo C' },
            ]}
            isMulti={true}
            isClearable={true}
            placeholder={'Tipologia'}
            //onChange={
            // option =>
            // onSelect({
            //   key: 'year',
            //   value: option ? parseInt(option.value) : null,
            // })
            //  }
          />
        </div>
        <div className="col-xs-2">
          <Select
            options={[
              { value: 'tipo-a', label: 'Tipo A' },
              { value: 'tipo-b', label: 'Tipo B' },
              { value: 'tipo-c', label: 'Tipo C' },
            ]}
            isMulti={true}
            isClearable={true}
            placeholder={'Beneficiari'}
            //onChange={
            // option =>
            // onSelect({
            //   key: 'year',
            //   value: option ? parseInt(option.value) : null,
            // })
            //  }
          />
        </div>
        <div className="col-xs-2">
          <Select
            options={[
              { value: 'tipo-a', label: 'Tipo A' },
              { value: 'tipo-b', label: 'Tipo B' },
              { value: 'tipo-c', label: 'Tipo C' },
            ]}
            isClearable={true}
            placeholder={'Fondo'}
            //onChange={
            // option =>
            // onSelect({
            //   key: 'year',
            //   value: option ? parseInt(option.value) : null,
            // })
            //  }
          />
        </div>
        <div className="col-xs-2">
          <Select
            options={[
              { value: 'tipo-a', label: 'Tipo A' },
              { value: 'tipo-b', label: 'Tipo B' },
              { value: 'tipo-c', label: 'Tipo C' },
            ]}
            isClearable={true}
            placeholder={'Materia'}
            //onChange={
            // option =>
            // onSelect({
            //   key: 'year',
            //   value: option ? parseInt(option.value) : null,
            // })
            //  }
          />
        </div>
      </div>
    </div>
  );
};

export default SpecificFilters;
