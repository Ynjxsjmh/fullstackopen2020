require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

morgan.token("body", req => JSON.stringify(req.body));

const app = express();

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('build'));


app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    let date = new Date();
    res.send(`<p>Phonebook has info for ${persons.length} people</p>` + date);
  });
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  Person.findById(id).then(person => {
    res.json(person);
  });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  Person.findByIdAndRemove(id)
    .then(result => {
      res.status(204).end();
    });
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'The name or number is missing'
    });
  }

  const person = new Person ({
    name: body.name,
    number: body.number,
  });

  person.save().then(savedPerson => {
    res.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
