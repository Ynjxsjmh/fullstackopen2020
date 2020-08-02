import React from 'react';

const Total = ({ parts }) => {
  const exercises = parts.map(part => part.exercises);

  let total = 0;

  exercises.forEach((exercise) => total += exercise);

  return (
      <p><b>Number of exercises {total}</b></p>
  );
};

export default Total;
