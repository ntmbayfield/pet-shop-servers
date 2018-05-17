const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const node = path.basename(process.argv[0])
const fileName = path.basename(process.argv[1])
const crudWord = process.argv[2];

const allCrudOperations = ['create','read','update','destroy']

if ( allCrudOperations.indexOf(crudWord) > -1 ) {
  fs.readFile(petsPath, 'utf8', (err,data)=>{
    if (err) {throw err};
    let pets = JSON.parse(data);

    if ( crudWord === 'create' ) {
      const age = Number.parseInt(process.argv[3]);
      const kind = process.argv[4];
      const name = process.argv[5];

      if ( Number.isNaN(age) || !kind || !name ) {
        console.error(`Usage: ${node} ${fileName} ${crudWord} AGE KIND NAME`);
        process.exit(1);
      }

      const pet = {age, kind, name};
      pets.push(pet)
      const petsJSON = JSON.stringify(pets);

      fs.writeFile(petsPath, petsJSON, (writeErr)=>{
        if (writeErr) {throw writeErr};
        console.log(pet);
      })


    } else if (crudWord === 'read' ) {
      const indexNeeded = Number.parseInt(process.argv[3]);

      //handles base case for read
      if ( Number.isNaN(indexNeeded) ) {
        console.log(pets)
        process.exit();
      }

      //handles invalid index
      if ( indexNeeded < 0 || indexNeeded >= pets.length ) {
        console.error(`Usage: ${node} ${fileName} ${crudWord} INDEX`);
        process.exit(1);
      }

      console.log(pets[indexNeeded]);
    } else if ( crudWord === 'update' ) {
      const indexNeeded = Number.parseInt(process.argv[3]);

      //handles invalid index
      if ( Number.isNaN(indexNeeded) || indexNeeded < 0 || indexNeeded >= pets.length ) {
        console.error(`Usage: ${node} ${fileName} ${crudWord} INDEX`)
        process.exit(1);
      }

      const age = Number.parseInt(process.argv[4]);
      const kind = process.argv[5];
      const name = process.argv[6];

      //handles invalid age, kind, name
      if ( Number.isNaN(age) || !kind || !name ) {
        console.error(`Usage: ${node} ${fileName} ${crudWord} AGE KIND NAME`)
        process.exit(1);
      }

      const pet = {age,kind,name};

      //NOTE: here is update operation (finally)
      pets[indexNeeded] = pet;

      const petsJSON = JSON.stringify(pets);

      fs.writeFile(petsPath, petsJSON, (writeErr)=>{
        if (writeErr) {throw writeErr};

        console.log(pets);
      })

    } else if ( crudWord === 'destroy' ) {
      const indexNeeded = Number.parseInt(process.argv[3]);

      //handles invalid index
      if ( Number.isNaN(indexNeeded) || indexNeeded < 0 || indexNeeded >= pets.length ) {
        console.error(`Usage: ${node} ${fileName} ${crudWord} INDEX`)
        process.exit(1);
      }

      const pet = pets.splice(indexNeeded,1)[0];
      const petsJSON = JSON.stringify(pets);

      fs.writeFile(petsPath,petsJSON,(writeErr)=>{
        if (writeErr){ throw writeErr };
        console.log(pets)
      })
    }
  })
} else {
  console.error(`Usage: ${node} ${fileName} [create | read | update | destroy]`);
  process.exit(1);
}
