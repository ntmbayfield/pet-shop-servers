const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const http = require('http');

const server = http.createServer((req,res)=>{
  const petRegExp = /^\/pets\/(.*)$/;


  if ( req.method === 'GET') {
    if ( req.url === '/pets' ) {
      fs.readFile(petsPath, 'utf8', (err, petsJSON)=>{
        if (err) {
          console.error(err.stack);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          return res.end('Internal Server Error');
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(petsJSON);
      })
    } else if ( petRegExp.test(req.url) ){
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

  }
})

const port = process.env.PORT || 8000;

server.listen(port, ()=>{
  console.log('Listening on port', port);
})

module.exports = server;
