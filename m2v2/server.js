const express = require('express');
const bodyParser = require("body-parser");

// Configure multer so that it will upload to '/public/images'
const multer = require('multer')
const upload = multer({
  dest: './public/images/',
  limits: {
    fileSize: 10000000
  }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/museum', {
  useNewUrlParser: true
});

// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  path: String,
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  console.log("photo is posting " + req.file.filename);
  res.send({
    path: "/images/" + req.file.filename
  });
});

// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/items', async (req, res) => {
  const item = new Item({
    title: req.body.title,
    path: req.body.path,
    description: req.body.description,
  });
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the museum.
app.get('/api/items', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/items/:id', async (req, res) => {
  //myid = req.params;
  //console.log(myid + " ahhhhhhhhhhh");
  console.log(req.params + "AHHHHH");
  try {
    let item = await Item.deleteOne({_id:req.params.id});
    res.send(item);
  } catch (error){
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/items/:id', async (req, res) => {
  //myid = req.params;
  //console.log(myid + " ahhhhhhhhhhh");
  console.log("put");
  console.log(req.body);
  console.log(req.params + "AHHHHH");
  try {
    let item = await Item.findOne({_id:req.params.id});
    console.log(req.body);
    item.title = req.body.title;
    item.description = req.body.description;
    item.save();
    //item.title = req.body.des
    res.send(item);
  } catch (error){
    console.log(error);
    res.sendStatus(500);
  }
});


app.listen(3016, () => console.log('Server listening on port 3016!'));

//mongo
//show dbs
//use museum
//db.dropDatabase()
// ^^ to clear your database ^^