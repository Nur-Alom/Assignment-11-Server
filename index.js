const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;
const app = express();

// Middleware.
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zqb2d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('explore-bd');
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('ordersItem');

        // Services API Options.

        // Get Services API
        app.get('/services', async (req, res) => {
            const services = await serviceCollection.find({}).toArray();
            res.json(services);
        });

        // Post New Added Data/services.
        app.post('/services', async (req, res) => {
            const newData = req.body;
            const result = await serviceCollection.insertOne(newData);
            res.json(result)
        });

        // Get Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleItem = await serviceCollection.findOne(query);
            res.json(singleItem);
        });


        // Order API Options.

        // Post Orders
        app.post('/ordersItem', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        });

        // Get user Orders
        app.get('/ordersItem', async (req, res) => {
            const allOrders = await orderCollection.find({}).toArray();
            res.json(allOrders);
        });

        // Update order Status.
        app.put('/ordersItem/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: updateStatus.status
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc);
            console.log(id)
            res.send(result);
        });

        // Delete Order
        app.delete('/ordersItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running explore bd server')
});

app.listen(port, () => {
    console.log('server running on port:', port)
});