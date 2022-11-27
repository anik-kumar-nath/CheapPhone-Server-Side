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
        const orderCollection = client.db('CheapPhone').collection('order');
        const reportCollection = client.db('CheapPhone').collection('reports');

        app.get('/userrole', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result)
        })
        app.get('/sellerstatus', async (req, res) => {
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
        app.get('/products/:category', async (req, res) => {
            const category = req.params.category;
            const query = { productCategory: category };
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

        app.post('/bookings', async (req, res) => {
            const newBooked = req.body;
            const result = await orderCollection.insertOne(newBooked);
            res.send(result);
        })
        app.post('/addreport', async (req, res) => {
            const report = req.body;
            const result = await reportCollection.insertOne(report);
            res.send(result);
        })
        app.get('/bookings', async (req, res) => {
            const result = await orderCollection.find({}).toArray();
            res.send(result);
        })
        app.get('/myorder', async (req, res) => {
            const email = req.query.email;
            const query = { buyerEmail: email };
            const result = await orderCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/allseller', async (req, res) => {
            const query = { role: 'Seller' };
            const result = await userCollection.find(query).toArray();
            res.send(result);
        })
        app.get('/allbuyer', async (req, res) => {
            const query = { role: 'Buyer' };
            const result = await userCollection.find(query).toArray();
            res.send(result);
        })
        app.delete('/seller/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })
        app.delete('/buyer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })


        app.put('/seller/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const updatedSeller = req.body;
            const option = { upsert: true };
            const updatedSellerOperation = {
                $set: {
                    status: updatedSeller.verificationText,
                }
            }
            const result = await userCollection.updateOne(query, updatedSellerOperation, option)
            res.send(result)
        })

        app.get('/report', async (req, res) => {
            const query = {};
            const result = await reportCollection.find(query).toArray();
            res.send(result);
        })



    } catch (error) {
        console.log(error)
    }
}
run().catch(err => console.log(err));