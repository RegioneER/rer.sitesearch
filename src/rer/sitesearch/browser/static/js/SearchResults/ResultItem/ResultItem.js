import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import SearchContext from '../../utils/searchContext';
import Bando from './Bando';

const ResultItem = ({ item, inEvidence = false }) => {
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

  const brdcIsInPath = brdc => {
    //[ToDo] da fare. Adesso è solo di esempio
    return brdc.url === '/temi/luoghi-da-scoprire';
  };

  const isInFilters = (type, item) => {
    //[ToDo] da fare. Adesso è solo di esempio
    if (type === 'theme') {
      return item === 'parchi';
    } else if (type === 'Subject') {
      return item === 'cittadini';
    }
    return false;
  };

  //[ToDo]: sistemare la get icon con tipi e icone corretti
  const getIcon = item => {
    if (item['@type'] === 'Folder') {
      return 'fas fa-folder-open';
    }
    if (item['@type'] === 'Event') {
      return 'fas fa-calendar-alt';
    }
    // if (item['@type'] === 'File') {
    //   return 'fas fa-paperclip';
    // }
    if (item['@type'] === 'News Item') {
      return 'fas fa-newspaper';
    }
    return 'fas fa-file';
  };

  const getItemTypeLabel = (item, translations) => {
    return translations['type_' + item['@type']] || item['@type'];
  };

  return item['@type'] === 'Bando' ? (
    <Bando item={item} inEvidence={inEvidence} />
  ) : (
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
          {!inEvidence && (
            <div className="row-item row-item-infos">
              <div className="col-icon"></div>
              <div className="col-content">
                <div className="item-infos">
                  {item.Date && (
                    <div className="item-date">
                      {moment(item.Date).format('D/MM/YYYY')}
                    </div>
                  )}
                  <div className="item-path">{item['@id']}</div>
                </div>
              </div>
            </div>
          )}

          <div className="row-item row-item-content">
            {/* colonna icona */}
            <div className="col-icon">
              <div className="main">
                <i
                  className={`${getIcon(item)}`}
                  title={getItemTypeLabel(item, translations)}
                ></i>
                <span className="mobile-only">
                  {getItemTypeLabel(item, translations)}
                </span>
              </div>
            </div>
            {/* item content */}
            <div className="col-content">
              <div className="item-title">
                <a href={item['@id']}>
                  <h3 title={getTitleHover(item, translations)}>
                    {item.title}
                  </h3>
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
                  {!inEvidence && (
                    <>
                      {/*
                      //la RER ha rinunaciato alle breadcrumbs, ma se un giorno qualcuno le vuole, hanno già gli stili.
                      {breadcrumbs && breadcrumbs.length > 0 && (
                        <div className="item-breadcrumbs">
                          <i className="fas fa-folder" />{' '}
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
                              <i className="fas fa-tag" />
                              {item.themes.map(theme => (
                                <a
                                  href="#"
                                  key={theme}
                                  className={
                                    isInFilters('theme', theme) ? 'active' : ''
                                  }
                                >
                                  {theme}
                                </a>
                              ))}
                            </div>
                          )}
                          {item.Subject && item.Subject.length > 0 && (
                            <div className="item-categories">
                              <i className="fas fa-list" />
                              {item.Subject.map(cat => (
                                <a
                                  href="#"
                                  key={cat}
                                  className={
                                    isInFilters('Subject', cat) ? 'active' : ''
                                  }
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
