import React from 'react';

const FilterPerson = ({persons, newSearch, handleSearchChange}) => {
  return (
    <>
      <form>
        filter shown with <input value={newSearch} onChange={handleSearchChange} />
      </form>
      {
        persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))
               .map(person => <p key={person.name}>{person.name} {person.number}</p>)
      }
    </>
  );
};

export default FilterPerson;
