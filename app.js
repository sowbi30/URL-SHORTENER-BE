const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/urlShort");
const { UrlModel } = require('./models/urlshort');

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", async function (req, res) {
  try {
    const urlResult = await UrlModel.find();
    res.render("home", {
        urlResult
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving URLs");
  }
});

app.post("/create", async function (req, res) {
  try {
    const myRandNumer = Math.floor(Math.random() * 10000);
    const newUrlShort = new UrlModel({
      longUrl: req.body.longUrl,
      shortUrl: myRandNumer
    });

    const savedData = await newUrlShort.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating a new URL");
  }
});

app.get("/:shortId", async function (req, res) {
    try {
      const data = await UrlModel.findOne({ shortUrl: req.params.shortId });
  
      if (!data) {
        // Handle the case where no data is found for the provided shortUrl
        return res.status(404).send("URL not found");
      }
  
      const updateData = await UrlModel.findByIdAndUpdate(
        { _id: data.id },
        { $inc: { clickCount: 1 } }
      );
  
      res.redirect(data.longUrl);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error redirecting to the URL");
    }
  });
  

app.get('/delete/:id', async function (req, res) {
  try {
    await UrlModel.findByIdAndDelete({ _id: req.params.id });
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting the URL");
  }
});

app.listen(8000, function () {
  console.log("The app is listening in PORT 8000");
});

//function generateUrl() {
//     let rndResult = '';
//     let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let charactersLength = characters.length;

//     for (let i = 0; i < 5; i++) {
//         rndResult += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     console.log(rndResult);
//     return rndResult;
// }
