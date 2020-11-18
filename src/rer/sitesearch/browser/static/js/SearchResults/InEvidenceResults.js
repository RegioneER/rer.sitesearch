import React from 'react';
import ResultItem from './ResultItem/ResultItem';

const InEvidenceResults = ({ results = [] }) => {
  return results.length > 0 ? (
    <>
      {results.map(item => (
        <ResultItem
          item={item}
          key={item['@id'] + '-inevidence'}
          inEvidence={true}
        />
      ))}
    </>
  ) : null;
};

export default InEvidenceResults;
