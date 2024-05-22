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

//put cohort
app.put("/api/cohorts/:cohortId", (req, res, next)=> {
  const {cohortId} = req.params;
  const newDetailsC = req.body;
  Cohort.findByIdAndUpdate(cohortId, newDetailsC, {new:true})
  .then(cohorts => {
      console.log("Success, cohort updated", cohorts)
      res.json(cohorts)
  })
  .catch((error) => {
      console.log("lots of errors", error)
      res.status(500).json({error: "hehe sucks to be you x2"})
  })
});


//Delete Cohort
app.delete("/api/cohorts/:cohortId", (req, res) => {

  Cohort.findByIdAndDelete(req.params.cohortId)
    .then( response => {
      res.status(200).json(response)
    })
    .catch( error => {
      console.log(error)
      res.status(500).json(error)
    }) 
})

// get cohort details
app.get("/api/cohorts/:cohortId", (req, res, next) => {

  const {cohortId} = req.params;

  Cohort.findById(cohortId)
      .then(cohortFromDB => {
          res.json(cohortFromDB);
      })
      .catch((error) => {
          console.log("Error getting student details", error);
          res.status(500).json({error: "Failed to get student details"});
      })

})

// app.get("/api/students", (req, res) => {
//   res.json(students);
// });


app.get("/api/students", (req, res) => {
  Student.find({})

    .populate("cohort")
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

// get students in a given cohort

app.get("/api/students/cohort/:cohortId", (req, res) => {
  const {cohortId} = req.params;
  
  Student.find({cohort: cohortId})
    .populate("cohort")
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

// put student
app.put("/api/students/:studentId", (req, res, next)=> {
  const {studentId} = req.params;
  const newDetails = req.body;
  Student.findByIdAndUpdate(studentId, newDetails, {new:true})
  .then(students => {
      console.log("Success, student updated", students)
      res.json(students)
  })
  .catch((error) => {
      console.log("lots of errors", error)
    })
})


//Delte student
app.delete("/api/students/:studentId", (req, res) => {
  Student.findByIdAndDelete(req.params.studentId)
    .then( response => {
      res.status(200).json(response)
    })
    .catch( error => {
      res.status(500).json(error)
    }) 

})

//GET student Details

app.get("/api/students/:studentId", (req, res, next) => {

  const {studentId} = req.params;

Student.findById(studentId)
      .populate("cohort")
      .then(singleStudentData => {
          res.json(singleStudentData);
      })
      .catch((error) => {
          console.log("Error getting student details", error);
          res.status(500).json({error: "Failed to get student details"});
      })

})

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});