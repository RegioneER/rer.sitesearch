import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ResultItem = ({ item, inEvidence = false }) => {
  const hasSimilarResults =
    item.similarResults != null && item.similarResults.length > 0;

  const [showSimilarResults, setShowSimilarResults] = useState(false);
  //[ToDo] le breadcrumbs saranno una proprietà dentro item, che verrà ritornata da plone
  let breadcrumbs = [
    { url: '/temi', title: 'temi' },
    { url: '/temi/luoghi-da-scoprire', title: 'Luoghi da scoprire' },
    { url: '/temi/luoghi-da-scoprire/parchi', title: 'parchi' },
  ];

  //[ToDo] da fare. Adesso è solo di esempio
  let title_parts = [
    'creato da Marcella Bongiovanni',
    'pubblicato 19/06/2013',
    'ultima modifica 31/01/2020 10:14',
  ];
  const title = title_parts.join(' - ');

  const brdcIsInPath = brdc => {
    //[ToDo] da fare. Adesso è solo di esempio
    return brdc.url === '/temi/luoghi-da-scoprire';
  };

  const isInFilters = (type, item) => {
    //[ToDo] da fare. Adesso è solo di esempio
    if (type === 'theme') {
      return item === 'parchi';
    } else if (type === 'category') {
      return item === 'cittadini';
    }
    return false;
  };

  //[ToDo]: sistemare la get icon con tipi e icone corretti
  const getIcon = item => {
    if (item['@type'] === 'Bando') {
      return 'fas fa-broadcast-tower';
    }
    if (item['@type'] === 'Folder') {
      return 'fas fa-folder-open';
    }
    if (item['@type'] === 'Event') {
      return 'fas fa-calendar-alt';
    }
    if (item['@type'] === 'News Item') {
      return 'fas fa-newspaper';
    }
    return 'fas fa-file';
  };

  // [ToDo]: sistemare la get del nome del tipo di contenuto che si deve mostrare quando si va in hover sull'icona
  const getItemTypeLabel = item => {
    return item['@type'] || 'Documento';
  };

  return (
    <div className={`result-item ${inEvidence ? 'in-evidence' : ''}`}>
      {inEvidence && (
        <div className="in-evidence-title desktop-only">In evidenza</div>
      )}

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
        <div className="col-icon">
          <div className="main">
            <i
              className={`${getIcon(item)}`}
              title={getItemTypeLabel(item)}
            ></i>
            <span className="mobile-only">{getItemTypeLabel(item)}</span>
          </div>
          <div className="more">+ stato bando</div>
        </div>
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
                  href="javascript:void(null);"
                  role="button"
                  className="similar-results-link"
                  onClick={() => {
                    setShowSimilarResults(!showSimilarResults);
                  }}
                >
                  {' '}
                  | Risultati simili
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
                  Scadenza partecipazione: {item.expire_date}
                </div>
              )}

              {!inEvidence && (
                <>
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
                  )}

                  {(item.themes || item.categories) && (
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
                      {item.categories && (
                        <div className="item-categories">
                          <i className="fas fa-list" />
                          {item.categories.map(cat => (
                            <a
                              href="#"
                              key={cat}
                              className={
                                isInFilters('category', cat) ? 'active' : ''
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
  );
};
ResultItem.propTypes = {
  item: PropTypes.object.isRequired,
  inEvidence: PropTypes.bool,
};
export default ResultItem;
