import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SearchContext from '../../utils/searchContext';
import ResultItem from './ResultItem';

const Bando = ({ item, inEvidence = false }) => {
  const hasSimilarResults =
    item.similarResults != null && item.similarResults.length > 0;

  const [showSimilarResults, setShowSimilarResults] = useState(false);

  //[ToDo] da fare. Adesso è solo di esempio
  let title_parts = [
    'creato da Marcella Bongiovanni',
    'pubblicato 19/06/2013',
    'ultima modifica 31/01/2020 10:14',
  ];
  const title = title_parts.join(' - ');

  return (
    <SearchContext.Consumer>
      {({ translations }) => (
        <div className={`result-item ${inEvidence ? 'in-evidence' : ''}`}>
          {/* in evidenza */}
          {inEvidence && (
            <div className="in-evidence-title desktop-only">
              {translations['In evidenza']}
            </div>
          )}

          {/* data + path */}
          {(item.date || item.path) && !inEvidence && (
            <div className="row-item row-item-infos">
              <div className="col-icon"></div>
              <div className="col-content">
                <div className="item-infos">
                  {item.date && <div className="item-date">{item.date}</div>}
                  {item.path && <div className="item-path">{item.path}</div>}
                </div>
              </div>
            </div>
          )}

          <div className="row-item row-item-content">
            {/* colonna icona */}
            <div className="col-icon">
              <div className="main">
                <i
                  className="fas fa-broadcast-tower"
                  title={translations.ct_Bando}
                ></i>
                <span className="mobile-only">{translations.ct_Bando}</span>
              </div>
              <div className="more">
                <div className="bandoInfos">
                  <span
                    className={`bandoStateClass state-${item.state}`}
                  ></span>
                </div>
              </div>
            </div>
            {/* item content */}
            <div className="col-content">
              <div className="item-title">
                <a href={item.url}>
                  <h3 title={title}>{item.title}</h3>
                </a>
              </div>
              {(item.description || hasSimilarResults) && (
                <div className="description">
                  {item.description}
                  {hasSimilarResults && (
                    <a
                      href="#"
                      role="button"
                      className="similar-results-link"
                      onClick={e => {
                        e.preventDefault();
                        setShowSimilarResults(!showSimilarResults);
                      }}
                    >
                      {' '}
                      | {translations['Risultati simili']}
                    </a>
                  )}

                  {showSimilarResults && (
                    <div className="similar-results">
                      {item.similarResults.map(sr => (
                        <ResultItem item={sr} key={sr.id} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!showSimilarResults && (
                <>
                  {item.expire_date && (
                    <div className="expire">
                      {translations['Scadenza partecipazione']}:{' '}
                      {item.expire_date}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </SearchContext.Consumer>
  );
};
Bando.propTypes = {
  item: PropTypes.object.isRequired,
  inEvidence: PropTypes.bool,
};
export default Bando;
