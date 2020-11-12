import React from 'react';
import ResultItem from './ResultItem';

const InEvidenceResults = ({ results = [] }) => {
  return results.length > 0 ? (
    <div className="inevidence-results">
      <div className="inevidence-title">In evidenza</div>
      {results.map(item => (
        <ResultItem item={item} key={item.id} inEvidence={true} />
      ))}
    </div>
  ) : null;
};

export default InEvidenceResults;
