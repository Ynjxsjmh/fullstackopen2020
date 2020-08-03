import React, { useState, useEffect } from 'react';
import FilterPerson from './components/FilterPerson';
import AddPerson from './components/AddPerson';
import Persons from './components/Persons';
import personService from './services/persons';
import Notification from "./components/Notification";


const App = () => {
  const [persons, setPersons] = useState([]);
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ newSearch, setNewSearch ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  const setErrorMessageAndTimeout = (message, timeout=5000) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, timeout);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    if (persons.filter(person => person.name === personObject.name).length > 0) {
      const message = `${personObject.name} is already added to phonebook, replace the old number with a new one?`;
      if (window.confirm(message)) {
        const oldPerson = persons.find(p => p.name === newName);
        personService
          .update(oldPerson.id, {...oldPerson, number: newNumber})
          .then(updatedPerson => {
            setPersons(
              persons.map(p => (p.name === newName ? updatedPerson : p))
            );
            setNewName("");
            setNewNumber("");

            setErrorMessageAndTimeout(`Changed ${oldPerson.name} number`);
          })
          .catch(error => {
            console.log(error);
          });
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');

          setErrorMessageAndTimeout(`Added ${returnedPerson.name}`);
        });
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

  const handleDeletePerson = (name, id) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deleteById(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          setNewName("");
          setNewNumber("");

          setErrorMessageAndTimeout(`Deleted ${name}`);
        })
        .catch(error => {
          alert(
            `the person '${name}' was already deleted from server`
          );
          setPersons(persons.filter(p => p.id !== id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <FilterPerson persons={persons} newSearch={newSearch} handleSearchChange={handleSearchChange} />
      <h3>add a new</h3>
      <AddPerson addPerson={addPerson} newName={newName} handleNameChange={handleNameChange}
                 newNumber={newNumber} handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} handleDeletePerson={handleDeletePerson} />
    </div>
  );
};

export default App;
