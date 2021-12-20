import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import SearchContext from '../../utils/searchContext';
import Bando from './Bando';
import DateAndPosition from './DateAndPosition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../../utils/icons';

const {
  faTag,
  faTags,
  faFolderOpen,
  faCalendarAlt,
  faNewspaper,
  faFile,
} = icons;

const ResultItem = ({ item }) => {
  const inEvidence = item['[elevated]'];
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

  //[ToDo]: sistemare la get icon con tipi e icone corretti
  const getIcon = item => {
    if (item['@type'] === 'Folder') {
      return faFolderOpen;
    }
    if (item['@type'] === 'Event') {
      return faCalendarAlt;
    }
    // if (item['@type'] === 'File') {
    //   return 'fa-paperclip';
    // }
    if (item['@type'] === 'News Item') {
      return faNewspaper;
    }
    return faFile;
  };
  const getItemTypeLabel = (item, translations) => {
    return translations['type_' + item['@type']] || item['@type'];
  };

  return item['@type'] === 'Bando' ? (
    <Bando item={item} inEvidence={inEvidence} />
  ) : (
    <SearchContext.Consumer key={item['@id']}>
      {({ translations, baseUrl }) => (
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
                  icon={getIcon(item)}
                  title={getItemTypeLabel(item, translations)}
                />
              </div>
              <h3 title={getTitleHover(item, translations)}>
                <a href={item['@id']}>
                  {item.title && item.title.length > 0
                    ? item.title
                    : item['@id'].split('/').pop()}
                </a>
              </h3>
            </div>
          </div>
          <div className="row-item row-item-details">
            {(item.Description || item.description || hasSimilarResults) && (
              <div className="description">
                <p>{item.Description || item.description}</p>
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
                {!inEvidence && (
                  <>
                    {/*
                      //la RER ha rinunaciato alle breadcrumbs, ma se un giorno qualcuno le vuole, hanno già gli stili.
                      {breadcrumbs && breadcrumbs.length > 0 && (
                        <div className="item-breadcrumbs">
                          <FontAwesomeIcon icon={faFolder} />{' '}
                          {breadcrumbs.map((brdc, index) => {
                            return (
                              <span key={brdc.url}>
                                <a
                                  href={brdc.url}
                                  className={brdcIsInPath(brdc) ? 'active' : ''}
                                >
                                  {brdc.title}
                                </a>{' '}
                                {index < breadcrumbs.length - 1 && <> {'>'} </>}
                              </span>
                            );
                          })}
                        </div>
                      )} */}

                    {(item.themes || item.Subject) && (
                      <div className="item-tags">
                        {item.themes && (
                          <div className="item-themes">
                            <FontAwesomeIcon icon={faTag} />
                            {item.themes.map(theme => (
                              <a href="#" key={theme}>
                                {theme}
                              </a>
                            ))}
                          </div>
                        )}
                        {item.Subject && item.Subject.length > 0 && (
                          <div className="item-categories">
                            <FontAwesomeIcon icon={faTags} />
                            {item.Subject.map(cat => (
                              <a
                                href={`${baseUrl}/@@search?Subject.operator=and&Subject.query=${cat}`}
                                key={cat}
                              >
                                {cat}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </SearchContext.Consumer>
  );
};
ResultItem.propTypes = {
  item: PropTypes.object.isRequired,
  inEvidence: PropTypes.bool,
};
export default ResultItem;
