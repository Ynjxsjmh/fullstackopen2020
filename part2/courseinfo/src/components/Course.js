import React from 'react';
import Header from './subcomponents/Header';
import Content from './subcomponents/Content';
import Total from './subcomponents/Total';

const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  );
};

export default Course;
