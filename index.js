const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors());
app.use(express.json());

app.get('/',(req,res)=> {
    res.send("hostel server is getting famous")
});
app.listen(port, ()=> {
    console.log(`server is running on port ${port}`);
});





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ivjkefo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    



   
    // post site

    // user Api..........................................................................

    const usersCollection = client.db('hostelDB').collection('users');

    app.post('/users', async(req ,res) => {
    const newUsers = req.body;
    const { email } = req.body;
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return 
    }
    console.log(newUsers);
    const result = await usersCollection.insertOne(newUsers);
    res.send(result);
  });

  app.get('/users',async(req,res)=> {
    const cursor = usersCollection.find();
    const result = await cursor.toArray();
    res.send(result)
  });


  app.put('/users/:email', async(req, res)=>{
    const email = req.params.email;
    const filter = {email};
    const updatedUser = req.body;
    const updatedDoc = {
         $set:updatedUser
    }
    const result = await usersCollection.updateOne(filter,updatedDoc);
    res.send(result)
  })
    
// doing search option............................................................
// Backend: Search users by name or email
app.get('/users/search', async (req, res) => {
  const query = req.query.q?.trim();

  if (!query) {
    const users = await usersCollection.find().toArray();
    return res.send(users);
  }

  const filter = {
    $or: [
      { user_name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } }
    ]
  };

  const result = await usersCollection.find(filter).toArray();
  res.send(result);
});



// Now adding meal collection

const mealsCollection = client.db('mealDB').collection('meals');

    app.post('/meals', async(req ,res) => {
    const newMeal = req.body;
    console.log(newMeal);
    const result = await mealsCollection.insertOne(newMeal)
    res.send(result);
  });


  app.get('/meals',async(req,res)=> {
    const cursor = mealsCollection.find();
    const result = await cursor.toArray();
    res.send(result)
  });


  app.put('/meals/:id', async(req, res)=>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const updatedMeal = req.body;
    const updatedDoc = {
         $set:updatedMeal
    }
    const result = await mealsCollection.updateOne(filter,updatedDoc);
    res.send(result)
  })



  // add review collection

  const reviewsCollection = client.db('reviewDB').collection('reviews');

    app.post('/reviews', async(req ,res) => {
    const newReview = req.body;
    console.log(newReview);
    const result = await reviewsCollection.insertOne(newReview)
    res.send(result);
  });


  app.get('/reviews',async(req,res)=> {
    const cursor = reviewsCollection.find();
    const result = await cursor.toArray();
    res.send(result)
  });

  
  app.delete('/reviews/:id',async(req,res)=> {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await reviewsCollection.deleteOne(query);
    res.send(result);
  });


  
  // add upcoming meals collection

   const upMealsCollection = client.db('upMealsDB').collection('upMeals');

    app.post('/upMeals', async(req ,res) => {
    const newUp = req.body;
    const result = await upMealsCollection.insertOne(newUp)
    res.send(result);
  });


  app.get('/upMeals',async(req,res)=> {
    const cursor = upMealsCollection.find();
    const result = await cursor.toArray();
    res.send(result)
  });


  app.delete('/upMeals/:id',async(req,res)=> {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await upMealsCollection.deleteOne(query);
    res.send(result);
  });





    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
