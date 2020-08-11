import React from 'react';
import { useDispatch } from 'react-redux';
import { filterChange } from '../reducers/filterReducer';

const Filter = () => {
  const dispatch = useDispatch();

  return (
    <div>
      filter
      <input
        type="text"
        name="filter"
        onChange={({target}) => dispatch(filterChange(target.value))}
      />
    </div>
  );
};

export default Filter;
