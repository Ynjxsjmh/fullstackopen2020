import React, { useState } from 'react';
import Country from './Country';

const Countries = ({countries, newSearch}) => {
  const filtered = countries.filter(country => country.name.toLowerCase().includes(newSearch.toLowerCase()));
  const len = filtered.length;

  const [isShow, setIsShow] = useState(new Array(len).fill(false));

  const toggleShow = (index) => {
    let copy = [...isShow];
    copy[index] = !copy[index];
    setIsShow(copy);
  };

  if (len > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (len > 1) {
    return (
      filtered.map((country, index) => {
        return (
          <div key={country.name}>
            <p>
              {country.name}
              <button onClick={() => toggleShow(index)}>
                {isShow[index] ? 'hide' : 'show' }
              </button>
            </p>
            {isShow[index] ? <Country country={country} /> : '' }
          </div>
        )
      })
    );
  } else if (len === 1) {
    return (
      <Country country={filtered[0]} />
    );
  } else {
    return (
      <p>nothing returned</p>
    );
  }
};

export default Countries;
