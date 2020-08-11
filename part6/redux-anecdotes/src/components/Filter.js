import React from 'react';
import { connect } from 'react-redux';
import { filterChange } from '../reducers/filterReducer';

const Filter = (props) => {
  return (
    <div>
      filter
      <input
        type="text"
        name="filter"
        onChange={({target}) => props.filterChange(target.value)}
      />
    </div>
  );
};

const ConnectedFilter = connect(null, {filterChange})(Filter);
export default ConnectedFilter;
