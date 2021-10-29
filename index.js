const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require("dotenv").config();

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

        // Get Services API
        app.get('/services', async (req, res) => {
            const services = await serviceCollection.find({}).toArray();
            res.json(services);
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