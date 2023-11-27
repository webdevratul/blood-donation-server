const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 200;

// middlewares 
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uxcjhbh.mongodb.net/?retryWrites=true&w=majority`;

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

        const userCollection = client.db("bloodDonationCampaign").collection("user");
        const districtCollection = client.db("bloodDonationCampaign").collection("district");
        const upazilaCollection = client.db("bloodDonationCampaign").collection("upazila");
        const donationRequestCollection = client.db("bloodDonationCampaign").collection("donationRequest");

        app.post("/user", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        app.get("/users", async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });

        app.patch("/users/admin/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: "admin"
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        app.patch("/users/Volunteer/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: "Volunteer"
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        app.patch("/users/blocked/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: "Blocked"
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        app.patch("/users/unblocked/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: "UnBlocked"
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        app.get("/users/admin/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let admin = false;
            if (user) {
                admin = user.role === "admin";
            }
            res.send({ admin });
        });

        app.get("/users/Volunteer/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let Volunteer = false;
            if (user) {
                Volunteer = user.role === "Volunteer";
            }
            res.send({ Volunteer });
        });

        app.get("/users/donner/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let donner = false;
            if (user) {
                donner = user.role === "donner";
            }
            res.send({ donner });
        });

        app.get("/district", async (req, res) => {
            const result = await districtCollection.find().toArray();
            res.send(result);
        });

        app.get("/upazila", async (req, res) => {
            const result = await upazilaCollection.find().toArray();
            res.send(result);
        });

        app.post("/donationRequest", async (req, res) => {
            const user = req.body;
            const result = await donationRequestCollection.insertOne(user);
            res.send(result);
        });

        app.get("/donationRequest", async (req, res) => {
            const result = await donationRequestCollection.find().toArray();
            res.send(result);
        });

        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Blood Donation Server is running!')
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});




