const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const http = require('http');

const server = http.createServer((req,res)=>{
  const petRegExp = /^\/pets\/(.*)$/;

  if ( req.method === 'GET') {
    //request all pets
    if ( req.url === '/pets' ) {
      fs.readFile(petsPath, 'utf8', (err, petsJSON)=>{
        if (err) {
          console.error(err.stack);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          return res.end('Internal Server Error');
        }
        res.setHeader('Content-Type', 'application/json');
        return res.end(petsJSON);
      })
    }
    //request a specific pet @ index
    else if ( petRegExp.test(req.url) ){
      fs.readFile(petsPath, 'utf8', (err, petsJSON)=>{
        if (err) {
          console.error(err.stack);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          return res.end('Internal Server Error');
        }

        const pets = JSON.parse(petsJSON);
        const matches = req.url.match(petRegExp);
        const id = Number.parseInt(matches[1]);

        //handles invalid index
        if ( id < 0 || id >= pets.length || Number.isNaN(id) ) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          return res.end('Not Found')
        }

        const petJSON = JSON.stringify(pets[id]);
        res.setHeader('Content-Type','application/json');
        return res.end(petJSON)
      })
    }
    //POST
  } else if ( req.method === "POST" && req.url === '/pets' ) {
    let jsonBody = '';

    req.on('data', (chunk)=>{
      jsonBody += chunk.toString();
    })

    req.on('end',()=>{

      fs.readFile(petsPath, 'utf8', (readErr, petsJSON)=>{
        if (readErr) {
          console.error(readErr.stack);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          return res.end('Internal Service Error');
        }

        const body = JSON.parse(jsonBody);
        const pets = JSON.parse(petsJSON);
        const age  = Number.parseInt(body.age);
        const kind = body.kind;
        const name = body.name;

        if ( Number.isNaN(age) || !kind || !name ) {
          res.statusCode = 400;
          res.setHeader('Content-Type','text/plain');
          return res.end('Bad Request');
        }

        const pet = {age,kind,name};
        pets.push(pet);

        const petJSON = JSON.stringify(pet);
        const newPetsJSON = JSON.stringify(pets);

        fs.writeFile(petsPath, newPetsJSON, (writeErr)=>{
          if (writeErr){
            console.error(writeErr.stack);
            res.statusCode = 500;
            res.setHeader('Content-Type','text/plain');
            return res.end('Internal Service Error');
          }
          res.setHeader('Content-Type','application/json');
          return res.end(petJSON)
        })

      })
    })

  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type','text/plain');
    return res.end('Not Found');
  }
})

const port = process.env.PORT || 8000;

server.listen(port, ()=>{
  console.log('Listening on port', port);
})

module.exports = server;
