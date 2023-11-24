const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();

const port = process.env.PORT || 200;

// middlewares 
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Blood Donation Server is running!')
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})




