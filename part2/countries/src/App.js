import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Countries from './components/Countries';


function App() {
  const [ countries, setCountries ] = useState([]);
  const [ newSearch, setNewCountry ] = useState("");

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data);
      });
  }, []);

  const handleSearchChange = (event) => {
    setNewCountry(event.target.value);
  };

  return (
    <div>
      <form>
        find countries
        <input value={newSearch} onChange={handleSearchChange} />
      </form>
      <Countries countries={countries} newSearch={newSearch} />
    </div>
  );
}

export default App;
