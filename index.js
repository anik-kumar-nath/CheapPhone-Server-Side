const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.send('server work successfully');
})
app.listen(port, () => console.log(`server running on ${port}`))

const uri = `mongodb+srv://${process.env.DB_Name}:${process.env.DB_Password}@cluster0.7wt8nwb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db('CheapPhone').collection('Users');
        // app.get('/users', async (req, res) => {
        //     const query = {};
        //     const cursor = userCollection.find(query);
        //     const users = await cursor.toArray();
        //     res.send(users);
        // })
        app.post('/newuser', async (req, res) => {
            const newUser = req.body.userInformation;
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })



    } catch (error) {
        console.log(error)
    }
}
run().catch(err => console.log(err));