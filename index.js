require("dotenv").config(); // ympäristömuuttujat käyttöön koko sovellukselle
const Person = require("./models/person"); //saadaan tietokanta käyttöön person.js:stä

const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.static("dist")); //frontend build
app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms :body"));

app.get("/", (request, respose) => {
  respose.send("<h1>Hello World</h1>");
});

app.get("/api/people", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(`
    <p>Phonebook has info for ${people.length} people</p>
    <p>${date}</p>
  `);
});

/*
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = people.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  people = people.filter((p) => p.id !== id);
  response.status(204).end();
});
*/

app.post("/api/persons/", (request, response) => {
  const body = request.body;

  if (body.name === undefined) {
    response.status(404).json({ error: "name missing" });
  } else if (body.number === undefined) {
    response.status(404).json({ error: "number missing" });
  } else {
    console.log(body);

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person.save().then((savedPerson) => {
      response.json(savedPerson);
    });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
