const express = require('express');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());




app.get('/', async (req, res) => {
    res.send('server work successfully');
})

app.listen(port, () => console.log(`server running on ${port}`))