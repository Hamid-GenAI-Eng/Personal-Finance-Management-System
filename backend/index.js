const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors());

const corsOptions = {
    origin: "http://localhost:3000", // Adjust if frontend is on a different port
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  };
  app.use(cors(corsOptions));

mongoose
.connect("mongodb+srv://hamidsaif214:karachiPws@userdata.gayzv.mongodb.net/?retryWrites=true&w=majority&appName=UserData")
.then(() =>{
    console.log("MongoDB Connected successfully.")
}).catch(err =>{
    console.log(err)
})

app.use('/auth', require('./routes/authRoutes'));

const PORT = 5001;

app.listen(PORT, () =>{
    console.log(`Server is running on Port ${PORT}`)
})

