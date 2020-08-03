import React from 'react';
import Weather from "./Weather";

const Country = ({country}) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>captial {country.capital}</p>
      <p>population {country.population}</p>
      <h2>Spoken languages</h2>
      <ul>
        {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <p>{country.flag}</p>
      <Weather capital={country.capital} />
    </div>
  );
};

export default Country;
