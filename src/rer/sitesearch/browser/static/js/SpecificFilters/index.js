import React from 'react';
import Select from 'react-select';
import SearchContext from '../utils/searchContext';

const SpecificFilters = () => {
  return (
    <SearchContext.Consumer>
      {({ setFilters, translations }) => (
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
                onChange={option => setFilters({ state: option.value })}
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
                onChange={option => setFilters({ bando_type: option.value })}
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
                onChange={option => setFilters({ beneficari: option.value })}
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
                onChange={option => setFilters({ fondo: option.value })}
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
                onChange={option => setFilters({ materia: option.value })}
              />
            </div>
          </div>
        </div>
      )}
    </SearchContext.Consumer>
  );
};

export default SpecificFilters;
