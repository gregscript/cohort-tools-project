const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");

// import JSON files (not needed any more because we get data from MongoDB)
// const cohorts = require("./cohorts.json")
// const students = require("./students.json")

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

const mongoose = require("mongoose");
const Student = require("./models/Student.model");
const Cohort = require("./models/Cohort.model");
 
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to MongoDB", err));
 


// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();


// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// allow only port 5173 to enter

app.use(
  cors({
    origin: ['http://localhost:5173'], // Add the URLs of allowed origins to this array
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// app.get("/api/cohorts", (req, res) => {
//   res.json(cohorts);
// });

app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohortFromDB) => {
      console.log("Retrieved cohorts ->", cohortFromDB);
      res.json(cohortFromDB);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error);
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});

app.post("/api/cohorts", (req, res) => {
  const cohortDetails = req.body
  
  Cohort.create(cohortDetails)
    .then((cohortFromDB) => {
      console.log("Created cohort ->", cohortFromDB);
      res.json(cohortFromDB);
    })
    .catch((error) => {
      console.error("Error while creating cohort ->", error);
      res.status(500).json({ error: "Failed to create cohort" });
    });
});


// app.get("/api/students", (req, res) => {
//   res.json(students);
// });

app.get("/api/students", (req, res) => {
  Student.find({})
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

app.post("/api/students", (req, res) => {
  const studentDetails = req.body
  
  Student.create(studentDetails)
    .then((studentFromDB) => {
      console.log("Created student ->", studentFromDB);
      res.json(studentFromDB);
    })
    .catch((error) => {
      console.error("Error while creating student ->", error);
      res.status(500).json({ error: "Failed to create student" });
    });
});

app.post("/api/students", (req, res) => {
  const studentDetails = req.body
  
  Student.create(studentDetails)
    .then((studentFromDB) => {
      console.log("Created student ->", studentFromDB);
      res.json(studentFromDB);
    })
    .catch((error) => {
      console.error("Error while creating student ->", error);
      res.status(500).json({ error: "Failed to create student" });
    });
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});