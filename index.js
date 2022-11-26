const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const productCollection = client.db('CheapPhone').collection('products');
        // app.get('/users', async (req, res) => {
        //     const query = {};
        //     const cursor = userCollection.find(query);
        //     const users = await cursor.toArray();
        //     res.send(users);
        // })
        app.get('/userrole', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result)
        })
        app.get('/allproducts', async (req, res) => {
            const query = {};
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })
        app.get('/myproducts', async (req, res) => {
            const email = req.query.email;
            const query = { sellerEmail: email };
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })
        app.delete('/myproducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.deleteOne(query);
            res.send(result)
        })
        app.post('/newuser', async (req, res) => {
            const newUser = req.body.userInformation;
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })
        app.post('/addproduct', async (req, res) => {
            let product = req.body;
            const addingDate = new Date()
            const result = await productCollection.insertOne({ ...product, ...{ addingDate } });
            res.send(result);
        })



    } catch (error) {
        console.log(error)
    }
}
run().catch(err => console.log(err));