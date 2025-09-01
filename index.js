const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :response-time ms :body"));

let persons = [
  { id: "1", name: "Kaisa Diakhate", number: "0405122727" },
  { id: "2", name: "Daniel Oldenburg", number: "0401111111" },
  { id: "3", name: "Sofie Diakhate", number: "04055555555" },
];

app.get("/", (request, respose) => {
  respose.send("<h1>Hello World</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

app.post("/api/persons/", (request, response) => {
  const person = request.body;
  person.id = Math.floor(Math.random() * 1000);
  if (person.name === undefined) {
    response.status(404).json({ error: "name missing" });
  } else if (person.number === undefined) {
    response.status(404).json({ error: "number missing" });
  } else if (
    persons.find((p) => p.name.toLowerCase() === person.name.toLowerCase())
  ) {
    response.status(404).json({ error: "name must be unique" });
  } else {
    console.log(person);

    persons = persons.concat(person);
    response.json(person);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
