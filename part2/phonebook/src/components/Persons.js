import React from 'react';
import Person from './Person';

const Persons = ({persons, handleDeletePerson}) => {
  return (
    <>
      {
        persons.map(person => <Person key={person.name} person={person} handleDeletePerson={handleDeletePerson} /> )
      }
    </>
  );
};

export default Persons;
