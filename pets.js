const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const node = path.basename(process.argv[0])
const fileName = path.basename(process.argv[1])
const crudWord = process.argv[2];

console.log(crudWord);

if ( crudWord === 'read' ) {
  fs.readFile(petsPath, 'utf8', (err,data)=>{
    if (err) {throw err};

    const indexNeeded = Number.parseInt(process.argv[3]);
    const pets = JSON.parse(data);

    if ( Number.isNaN(indexNeeded) ) {
      console.log("invalid input for index")
      process.exit();
    }

    if ( indexNeeded < 0 || indexNeeded >= pets.length ) {
      console.error(`Usage: ${node} ${fileName} ${crudWord} INDEX INVALID`);
      process.exit(1);
    }

    console.log(pets[indexNeeded]);
  })
}
