import React from 'react';

const Person = ({person, handleDeletePerson}) => {
  return (
    <>
      <p>{person.name} {person.number} <button onClick={() => handleDeletePerson(person.name, person.id)}>delete</button></p>
    </>
  );
};

export default Person;
