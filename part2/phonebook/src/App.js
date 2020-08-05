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
  const [ isError, setIsError ] = useState(false);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  const setErrorMessageAndTimeout = (message, isError, timeout=5000) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, timeout);
    setIsError(isError);
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

            setErrorMessageAndTimeout(`Changed ${oldPerson.name} number`, false);
          })
          .catch(error => {
            setErrorMessageAndTimeout(`Information of ${oldPerson.name} has already been removed from server`, true, 8000);
          });
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');

          setErrorMessageAndTimeout(`Added ${returnedPerson.name}`, false);
        })
        .catch(error => {
          setErrorMessageAndTimeout(error.response.data.error, true, 8000);
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

          setErrorMessageAndTimeout(`Deleted ${name}`, false);
        })
        .catch(error => {
          setErrorMessageAndTimeout(`the person '${name}' was already deleted from server`, true);
          setPersons(persons.filter(p => p.id !== id));
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} isError={isError} />
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
