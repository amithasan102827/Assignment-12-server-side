const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pihjg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('cars_sales')
        const newcarCollection = database.collection('newcars')
        const allcarsCollection = database.collection('allcars')
        const reviewsCollection = database.collection('reviews')
        const ordersCollection = database.collection('orders')
        const userCollection = database.collection('users');
        console.log("assignmetn-12 database connected");


        // GET newcars API
        app.get('/newcars', async (req, res) => {
            const cursor = newcarCollection.find({})
            const cars = await cursor.toArray();
            res.send(cars)
        })
        // GET ALL CARS API
        app.get('/allcars', async (req, res) => {
            const cursor = allcarsCollection.find({})
            const cars = await cursor.toArray();
            res.send(cars)
        })

        // GET  REVIEWS API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({})
            const reviews = await cursor.toArray();
            res.send(reviews)
        })
        // GET ALL ORDERS
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const order = await cursor.toArray();
            res.send(order)
        })
        // API POST REVIEWS
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log('hitting the post', review)
            const result = await reviewsCollection.insertOne(review);
            console.log(result);
            res.send(result);
        })

        // GET SINGLE CAR DETAILS BY ID
        app.get('/newcars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await newcarCollection.findOne(query)
            res.json(result);
        })

        // GET SINGLE EXPLORECAR DETAILS BY ID
        app.get('/allcars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await allcarsCollection.findOne(query)
            res.json(result);
        })


        // API POST for oder
        app.post('/orders', async (req, res) => {

            const order = req.body;
            console.log('hitting the post', order)
            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.send(result);
        })

        // API POST FOR ADD NEW PRODUCT
        app.post('/allcars', async (req, res) => {

            const car = req.body;
            console.log('hitting the post', car)
            const result = await allcarsCollection.insertOne(car);
            console.log(result);
            res.send(result);
        })

        // get singel orders by using email
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = ordersCollection.find(query)
            const result = await cursor.toArray();
            res.json(result);
        })

        //   SAVE USER INFORMATION TO DATABASE
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.json(result);
        })

        //  UPSART USER
        app.put('/users', async (req, res) => {
            const user = req.body;
            console.log('put', user);
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        // DELETE API for my orders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
        })

        // DELETE CAR/PRODUCT 
        app.delete('/allcars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await allcarsCollection.deleteOne(query)
            res.json(result)
        })


        // MAKE ADMIN
        app.put('/users/admin', async (req, res) => {
            const user = req.body;

            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result);


        })

        // admin check
      app.get('/users/:email',async(req,res)=>{
        const email=req.params.email;
        const query={email:email};
     
        const user=await userCollection.findOne(query);
        let isAdmin=false;
        if(user?.role==='admin'){
          isAdmin=true;
        }
        res.json({admin: isAdmin});
      
      })



    }

    finally {
        // await client.close();
    }
}


run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Running assignment-12 server')
})

app.listen(port, () => {
    console.log('assignment-12 server running port is', port)
})