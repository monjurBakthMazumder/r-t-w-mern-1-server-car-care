const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASS}@cluster0.ib5iccz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const servicesCollection = client.db("carCareBD").collection("services")
    const bookingsCollection = client.db("carCareBD").collection("bookings")
    const employeesCollection = client.db("carCareBD").collection("employees")

    //service related api 
    app.get('/services', async(req, res) => {
        const services = await servicesCollection.find().toArray()
        res.send(services)
    })

    app.get('/services/:id', async(req, res) => {
      const id = req.params.id
      const cursor = {_id: new ObjectId(id)}
      const result = await servicesCollection.findOne(cursor)
      res.send(result)
    })

    //check out related api 
    app.get('/bookings', async(req, res) => {
      let query = []
      if(req?.query?.email){
        query = {email : req.query?.email}
      }
      const result = await bookingsCollection.find(query).toArray();
      res.send(result)
    })

    app.post('/bookings', async(req, res) => {
      const checkout = req.body
      const result = await checkoutCollection.insertOne(checkout)
      res.send(result)
    })

    app.delete('/bookings/:id', async(req, res) => {
      const id = req.params
      const cursor = {_id : new ObjectId(id)}
      const result = await bookingsCollection.deleteOne(cursor)
      res.send(result)
    })

    // employee related api
    app.get('/employees', async(req, res) => {
      const result = await employeesCollection.find().toArray()
      res.send(result)
    })

    app.post('/employees', async(req, res) => {
      const employee = req.body
      const result = await employeesCollection.insertOne(employee)
      res.send(result)
    })





    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=> {
    res.send("hello")
})

app.listen(port, ()=> {
    console.log(`server is running on port ${port}`);
})