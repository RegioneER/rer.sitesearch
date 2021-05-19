import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const DateAndPosition = ({ item }) => {
  const getItemPosition = item => {
    const url = new URL(item['@id']);
    const domain = url.host;
    if (item.path_depth) {
      if (item.path_depth == 1) {
        return domain;
      } else if (item.path_depth == 2) {
        return (
          domain +
          '/' +
          item.path
            .split('/')
            .slice(2, -1)
            .join('/')
        );
      } else {
        return (
          domain +
          '/…/' +
          item.path
            .split('/')
            .slice(-3, -1)
            .join('/')
        );
      }
    }
  };

  return (
    <div className="row-item row-item-infos">
      <div className="col-icon"></div>
      <div className="col-content">
        <div className="item-infos">
          {item.effective &&
            moment(item.effective).format('YYYY') !== '1969' && (
              <div className="item-date">
                {moment(item.effective).format('D/MM/YYYY')}
              </div>
            )}
          {getItemPosition(item)}
        </div>
      </div>
    </div>
  );
};

DateAndPosition.propTypes = {
  item: PropTypes.object.isRequired,
};
export default DateAndPosition;
