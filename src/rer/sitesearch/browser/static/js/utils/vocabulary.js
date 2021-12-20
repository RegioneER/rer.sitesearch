import apiFetch from './apiFetch';

const Vocabulary = {
  createVocabulary: function(terms) {
    var v = {};
    terms.forEach(function(t) {
      v[t.token] = t.title;
    });
    return v;
  },
  getVocabularies: function(domain, vocabularyNames) {
    const fetches = [];
    //create fetches
    vocabularyNames.forEach(name => {
      var f = apiFetch({
        url: '@vocabularies/' + domain + '.' + name,
        method: 'GET',
      });
      fetches.push(f);
    });

    //get vocabularies
    return new Promise(function(resolve) {
      Promise.all(fetches).then(data => {
        var vocabulary = {};
        vocabularyNames.forEach(function(name, index) {
          var items = data[index].data.items;
          var v = Vocabulary.createVocabulary(items);
          vocabulary[name] = v;
        });
        resolve(vocabulary);
      });
    });
  },
};

export default Vocabulary;
