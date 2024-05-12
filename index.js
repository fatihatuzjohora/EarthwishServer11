const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
//-----------------------
const jwt =require("jsonwebtoken")
const cookieParser = require("cookie-parser");
//-----------------------

app.use(cors({ origin: "*" }));  //change
app.use(express.json());

//-------------------------------
require("dotenv").config();
//-----------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qchb1so.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//console.log(uri);
//--------------------------
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    //---------------------------------------------------------

    const assigmentCollection = client
      .db("assigmentDB")
      .collection("assigment");

    //-------------------------------
    //2---server ar data pora ba ui te dakhano
    app.get("/assigment", async (req, res) => {
      try {
        const { level } = req.query;
        let query = {};

        if (level && level.length > 0) {
          query = { level: level }; // Assuming 'level' is a field in your MongoDB documents
        }

        const cursor = await assigmentCollection.find(query);
        const result = await cursor.toArray();

        res.send(result);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    //-------------------------------------------------------
    //4----data gulo update kora prothom dhap
    app.get("/assigment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assigmentCollection.findOne(query);
      res.send(result);
    });

    //------------------------------------------------
    //1--data server a dawa
    app.post("/assigment", async (req, res) => {
      const newAssigment = req.body;
      console.log(newAssigment);
      const result = await assigmentCollection.insertOne(newAssigment);
      res.send(result);
    });

    //--------------------------------------------------
    //5--data gulo update kora sas dhap
    app.put("/assigment/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updated = req.body;
      console.log(id, updated);
      const assigment = {
        $set: {
          titleName: updated.titleName,
          description: updated.description,
          processingTime: updated.processingTime,
          mark: updated.mark,
          photo: updated.photo,
          level: updated.level,
        },
      };
      const result = await assigmentCollection.updateOne(
        filter,
        assigment,
        options
      );
      res.send(result);
    });

    //------------------------------------------------------------------
    //3----data gulo delete kora
    app.delete("/assigment/:id", async (req, res) => {
      const id = req.params.id;
      //  console.log("delete", id);
      const query = { _id: new ObjectId(id) };
      const result = await assigmentCollection.deleteOne(query);
      res.send(result);
    });

    //----------------------------------------------------------

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
//--------------------------
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(" server is running");
});

app.listen(port, () => {
  console.log(` runnign port:${port}`);
});
