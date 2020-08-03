import React from 'react';

const Country = ({country}) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>captial {country.capital}</p>
      <p>population {country.population}</p>
      <h2>languages</h2>
      <ul>
        {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <p>{country.flag}</p>
    </div>
  );
};

export default Country;
