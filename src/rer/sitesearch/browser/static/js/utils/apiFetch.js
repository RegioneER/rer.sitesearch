import axios from 'axios';
import qs from 'query-string';

// const parseParams = params => {
//   const keys = Object.keys(params);
//   let options = '';

//   keys.forEach(key => {
//     const isParamTypeObject = typeof params[key] === 'object';
//     const isParamTypeArray =
//       isParamTypeObject && params[key] !== null && params[key].length >= 0;

//     if (!isParamTypeObject) {
//       options += `${key}=${params[key]}&`;
//     }

//     if (isParamTypeObject && isParamTypeArray) {
//       params[key].forEach(element => {
//         options += `${key}=${element}&`;
//       });
//     }
//   });

//   return options ? options.slice(0, -1) : options;
// };

const metadata_fields = ['Date', 'Subject', 'scadenza_bando', 'effective'];

const apiFetch = ({ url, params, method }) => {
  if (!method) {
    method = 'GET';
  }
  var headers = { Accept: 'application/json' };

  return axios({
    method,
    url,
    params: params ? { ...params, metadata_fields } : null,
    paramsSerializer: params =>
      qs.stringify(params, { skipNull: true, skipEmptyString: true }),
    headers,
  }).catch(function(error) {
    // handle error
    console.log(error);
  });
};

export default apiFetch;
