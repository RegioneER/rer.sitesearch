import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const DateAndPosition = ({ item }) => {
  const getItemPosition = item => {
    const url = new URL(item['@id']);
    const domain = url.host.replace('emilia-romagna.it', '..');
    const path = item.path ? item.path : url.pathname;
    const path_depth = item.path_depth
      ? item.path_depth
      : path.split('/').length - 2;

    if (path_depth) {
      if (path_depth === 1) {
        return domain;
      } else if (path_depth === 2) {
        return (
          domain +
          '/' +
          path
            .split('/')
            .slice(2, -1)
            .join('/')
        );
      } else {
        return (
          domain +
          '/…/' +
          path
            .split('/')
            .slice(-3, -1)
            .join('/')
        );
      }
    }
  };

  const itemPosition = getItemPosition(item);

  return (
    <div className="row-item row-item-infos">
      <div className="item-infos">
        {item.effective && moment(item.effective).format('YYYY') !== '1969' && (
          <span className="item-date">
            {moment(item.effective).format('D/MM/YYYY')}
          </span>
        )}
        {itemPosition && <span className="item-position">{itemPosition}</span>}
      </div>
    </div>
  );
};

DateAndPosition.propTypes = {
  item: PropTypes.object.isRequired,
};
export default DateAndPosition;
