import React from 'react';

const Total = ({ parts }) => {
  const exercises = parts.map(part => part.exercises);

  const total = exercises.reduce((s, p) => s + p);

  return (
      <p><b>Number of exercises {total}</b></p>
  );
};

export default Total;
