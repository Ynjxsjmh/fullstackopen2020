import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterPerson from './components/FilterPerson';
import AddPerson from './components/AddPerson';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ newSearch, setNewSearch ] = useState("");

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    if (persons.filter(person => person.name === personObject.name).length > 0) {
      alert(`${personObject.name} is already added to phonebook`);
    } else {
      setPersons(persons.concat(personObject));
      setNewName('');
      setNewNumber('');
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterPerson persons={persons} newSearch={newSearch} handleSearchChange={handleSearchChange} />
      <h3>add a new</h3>
      <AddPerson addPerson={addPerson} newName={newName} handleNameChange={handleNameChange}
                 newNumber={newNumber} handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} />
    </div>
  );
};

export default App;
