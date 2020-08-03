import React from 'react';

const Countries = ({countries, newSearch}) => {
  const filtered = countries.filter(country => country.name.toLowerCase().includes(newSearch.toLowerCase()));
  const len = filtered.length;
  console.log(filtered);

  if (len > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (len > 1) {
    return (
      filtered.map(country => <p key={country.name}>{country.name}</p>)
    );
  } else if (len === 1) {
    const country = filtered[0];

    return (
      <>
        <h1>{country.name}</h1>
        <p>captial {country.capital}</p>
        <p>population {country.population}</p>
        <h2>languages</h2>
        <ul>
          {country.languages.map(language => <li key={language.iso639_2}>{language.name}</li>)}
        </ul>
        <p>{country.flag}</p>
      </>
    );
  } else {
    return (
      <p>nothing returned</p>
    );
  }
};

export default Countries;
