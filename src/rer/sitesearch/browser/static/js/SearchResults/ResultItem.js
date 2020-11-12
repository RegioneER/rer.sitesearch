import React from 'react';
import PropTypes from 'prop-types';

const ResultItem = ({ item, inEvidence = false }) => {
  return (
    <div className="result-item">
      {(item.date || item.path) && !inEvidence && (
        <div className="row row-item-infos">
          <div className="col-xs-1 col-icon"></div>
          <div className="col-xs-11">
            <div className="item-infos">
              {item.date && <div className="item-date">{item.date}</div>}
              {item.path && <div className="item-path">{item.path}</div>}
            </div>
          </div>
        </div>
      )}

      <div className="row row-item-content">
        <div className="col-xs-1 col-icon">icon</div>
        <div className="col-xs-11">
          <div className="item-title">
            <a href={item.url}>
              <h3>{item.title}</h3>
            </a>
          </div>
          {item.description && (
            <div className="description">{item.description}</div>
          )}
          {item.expire_date && (
            <div className="expire">
              Scadenza partecipazione: {item.expire_date}
            </div>
          )}

          {!inEvidence && (
            <>
              {item.themes && (
                <div className="themes">
                  Temi:{' '}
                  {item.themes.map(theme => (
                    <a href="#" key={theme}>
                      {theme}
                    </a>
                  ))}
                </div>
              )}
              {item.categories && (
                <div className="categories">
                  {item.categories.map(cat => (
                    <a href="#" key={cat}>
                      {cat}
                    </a>
                  ))}
                </div>
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
