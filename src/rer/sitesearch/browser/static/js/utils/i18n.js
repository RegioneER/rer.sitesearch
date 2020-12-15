import axios from 'axios';

export const getTranslationCatalog = (domain = 'rer.sitesearch') => {
  const catalogUrl = document
    .querySelector('body')
    .getAttribute('data-i18ncatalogurl');
  if (!catalogUrl) {
    return new Promise(function(resolve) {
      resolve(null);
    });
  }
  let language = document.querySelector('html').getAttribute('lang');
  if (!language) {
    language = 'en';
  }

  return axios({
    method: 'GET',
    url: catalogUrl,
    params: { domain, language },
  })
    .then(({ data }) => {
      return { ...data, language };
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    });
};
