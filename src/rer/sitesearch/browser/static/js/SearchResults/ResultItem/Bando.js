import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import SearchContext from '../../utils/searchContext';
import ResultItem from './ResultItem';
import DateAndPosition from './DateAndPosition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../../utils/icons';

const { faBroadcastTower } = icons;

const Bando = ({ item, inEvidence = false }) => {
  const hasSimilarResults =
    item.similarResults != null && item.similarResults.length > 0;

  const [showSimilarResults, setShowSimilarResults] = useState(false);

  const getTitleHover = (item, translations) => {
    let title_parts = [
      // 'creato da Marcella Bongiovanni',
      // 'pubblicato 19/06/2013',
      // 'ultima modifica 31/01/2020 10:14',
    ];
    title_parts.push(
      translations['pubblicato il'] +
        ' ' +
        moment(item.effective).format('D/MM/YYYY'),
    );
    title_parts.push(
      translations['ultima modifica'] +
        ' ' +
        moment(item.Date).format('D/MM/YYYY'),
    );

    return title_parts.join(' - ');
  };

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
          {!inEvidence ? <DateAndPosition item={item} /> : ''}

          <div className="row-item row-item-title">
            <div className="item-title">
              <div className="item-icon">
                <FontAwesomeIcon
                  icon={faBroadcastTower}
                  title={
                    translations.type_Bando ? translations.type_Bando : 'Bando'
                  }
                />
              </div>
              <h3 title={getTitleHover(item, translations)}>
                <a href={item['@id']}>{item.title}</a>
              </h3>
            </div>
          </div>
          <div className="row-item row-item-details">
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
                {item.scadenza_bando && (
                  <div className="expire">
                    {translations['Scadenza partecipazione']}:{' '}
                    {moment(item.scadenza_bando).format('D/MM/YYYY')}
                  </div>
                )}
              </>
            )}
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
