import axios from 'axios';
import qs from 'query-string';

export const dotify = params => {
  var res = {};
  function recurse(obj, current) {
    for (var key in obj) {
      var value = obj[key];
      var newKey = current ? current + '.' + key : key; // joined key with dot
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        recurse(value, newKey); // it's a nested object, so do it again. Skip if is an array
      } else {
        res[newKey] = value; // it's not an object, so set the property
      }
    }
  }

  recurse(params);
  return res;
};
const metadata_fields = [
  'Date',
  'Subject',
  'scadenza_bando',
  'effective',
  'path',
  'path_depth',
];

export const updateHistory = ({ url, params }) => {
  const searchParams = qs.stringify(dotify(params), {
    skipNull: true,
    skipEmptyString: true,
  });
  window.history.pushState({}, '', `${url}?${searchParams}`);
};

const apiFetch = ({ url, params, method }) => {
  if (!method) {
    method = 'GET';
  }
  var headers = { Accept: 'application/json' };
  return axios({
    method,
    url,
    params: params ? dotify({ ...params, metadata_fields }) : null,
    paramsSerializer: params =>
      qs.stringify(params, { skipNull: true, skipEmptyString: true }),
    headers,
  }).catch(function(error) {
    // handle error
    console.log(error);
  });
};

export default apiFetch;
