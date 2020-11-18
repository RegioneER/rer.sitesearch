import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import SearchContext from '../utils/searchContext';

const SpecificFilters = ({ id }) => {
  return (
    <SearchContext.Consumer key={`specific-filters-${id}`}>
      {({ setFilters, filters, translations }) => (
        <div className="specific-filters">
          <div className="title">
            {translations['Filtra i bandi per finanziamenti ed opportunità']}
          </div>
          <div className="row-specific-filters">
            <div className="col-specific-filters">
              <Select
                options={[
                  { value: 'aperto', label: 'Aperto' },
                  { value: 'in-corso', label: 'In corso' },
                  { value: 'chiuso', label: 'Chiuso' },
                ]}
                isMulti={true}
                isClearable={true}
                placeholder={translations['bando_Stato']}
                value={filters.state}
                onChange={options => setFilters({ state: options })}
              />
            </div>
            <div className="col-specific-filters">
              <Select
                options={[
                  { value: 'tipo-a', label: 'Tipo A' },
                  { value: 'tipo-b', label: 'Tipo B' },
                  { value: 'tipo-c', label: 'Tipo C' },
                ]}
                isMulti={true}
                isClearable={true}
                placeholder={translations['bando_Tipologia']}
                value={filters.bando_type}
                onChange={options => setFilters({ bando_type: options })}
              />
            </div>
            <div className="col-specific-filters">
              <Select
                options={[
                  { value: 'tipo-a', label: 'Tipo A' },
                  { value: 'tipo-b', label: 'Tipo B' },
                  { value: 'tipo-c', label: 'Tipo C' },
                ]}
                isMulti={true}
                isClearable={true}
                placeholder={translations['bando_Beneficiari']}
                value={filters.beneficiari}
                onChange={options => setFilters({ beneficiari: options })}
              />
            </div>
            <div className="col-specific-filters">
              <Select
                options={[
                  { value: 'tipo-a', label: 'Tipo A' },
                  { value: 'tipo-b', label: 'Tipo B' },
                  { value: 'tipo-c', label: 'Tipo C' },
                ]}
                isClearable={true}
                placeholder={translations['bando_Fondo']}
                value={filters.fondo}
                onChange={options => setFilters({ fondo: options })}
              />
            </div>
            <div className="col-specific-filters">
              <Select
                options={[
                  { value: 'tipo-a', label: 'Tipo A' },
                  { value: 'tipo-b', label: 'Tipo B' },
                  { value: 'tipo-c', label: 'Tipo C' },
                ]}
                isClearable={true}
                placeholder={translations['bando_Materia']}
                value={filters.materia}
                onChange={options => setFilters({ materia: options })}
              />
            </div>
          </div>
        </div>
      )}
    </SearchContext.Consumer>
  );
};

SpecificFilters.propTypes = {
  id: PropTypes.string.isRequired,
};

export default SpecificFilters;
