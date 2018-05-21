const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//returns whole array
app.get('/pets', (req,res,next)=>{
  fs.readFile(petsPath, 'utf8', (err, petsJSON)=>{
    if (err) { return next(err) };

    const pets = JSON.parse(petsJSON);

    return res.send(pets);
  })
});

//returns individual pets
app.get('/pets/:id', (req,res,next)=>{
  fs.readFile(petsPath, 'utf8', (err, petsJSON)=>{
    if (err) { return next(err) };

    const id = Number.parseInt(req.params.id);
    const pets = JSON.parse(petsJSON);
    if ( id < 0 || id >= pets.length || Number.isNaN(id) ) {
      return res.sendStatus(404);
    }

    return res.send(pets[id]);
  })
})

//adds pets to our "database"
app.post('/pets', (req,res,next)=>{
  fs.readFile(petsPath, 'utf8', (readErr, petsJSON)=>{
    if (readErr) { return next(readErr) };

    const pets = JSON.parse(petsJSON);
    const age = Number.parseInt(req.body.age);
    const { kind, name } = req.body;

    if ( Number.isNaN(age) || !kind || !name ) {
      return res.sendStatus(400);
    }

    const pet = {age, kind, name};
    pets.push(pet);

    const newPetsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, newPetsJSON, (writeErr)=>{
      if ( writeErr ) { return next(writeErr) };

      return res.send(pet);
    })
  })
})

//returns 404 for requests against the root
app.use('/',(req,res)=>{
  res.sendStatus(404);
})

app.listen(port, ()=>{
  console.log("Listening on port",port);
});

module.exports = app;
