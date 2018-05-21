const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

const bodyParser = require('body-parser');

app.use(bodyParser.join());

app.get('/pets', (req,res,next)=>{
  fs.readFile(petsPath, 'utf8', (err,petsJSON)=>{
    if (err) { return next(err) };

    const pets = JSON.parse(petsJSON);

    return res.send(pets)
  })
})

app.get('/pets/:id', (req,res,next)=>{
  fs.readFile(petsPath, 'utf8', (err,petsJSON)=>{
    if (err) { return next(err) };

    const id = Number.parseInt(req.params.id);
    const pets = JSON.parse(petsJSON);

    if ( id < 0 || id >= pets.length || Number.isNaN(id) ) {
      return res.sendStatus(404);
    }

    return res.send(pets[id]);
  })
})

//post
//patch
//delete

app.use('/',(req,res)=>{
  re.sendStatus(404);
})

app.listen(port,()=>{
  console.log("Listening on port",port);
})



module.exports = app;
