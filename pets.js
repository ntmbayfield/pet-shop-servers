var fs = require('fs')
var path = require('path')
var program = require('commander')

var command = process.argv[2]

// Assert that a VALID command is provided
// if (!process.argv.slice(2).length) {
//   console.error('Usage: node pets.js [create | read | update | destroy]')
//   process.exit(1);
// }

if (command === 'read') {
  if (!process.argv[3]) {
    read('./pets.json');
  } else {
    read('./pets.json', process.argv[3]);
  }
} else if ( command === 'create') {
    for (let i = 3; i <= 5 ; i++) {
      if (!process.argv[i]) {
        console.error('Usage: node pets.js create AGE KIND NAME');
        process.exit(1);
      }
    }
    create('./pets.json', process.argv[3], process.argv[4], process.argv[5]);
} else {
    console.error('Usage: node pets.js [create | read | update | destroy]')
    process.exit(1);
}


function read(path, idx) {
//  console.log(`read():`);
  fs.readFile(path, 'utf-8', function (err, data) {
    if (err) {
      throw err;
    } else {
      var arrOfPetsObj = JSON.parse(data);
      // console.log(arrOfPetsObj);
        if (idx === undefined) {
          console.log(arrOfPetsObj);
        } else if (idx > arrOfPetsObj.length-1 || idx < 0) {
          console.error('Usage: node pets.js read INDEX')
          process.exit(1);
        } else {
          console.log(arrOfPetsObj[idx])
        }
    }
  })
}


function create(path, age, kind, name) {
      fs.readFile(path, 'utf-8', function (err, data) {
        if (err) {
          throw err;
        } else {
//          console.log('currentContents of path is: ', data);
          var arrOfPetsObj = JSON.parse(data);
//          console.log(arrOfPetsObj);
          var newPetObj = {age: age*1, kind: kind, name: name};
//          console.log(newPetObj);
          arrOfPetsObj.push(newPetObj);
          arrOfPetsObj.join('\n');
//          console.log(arrOfPetsObj);
          var addedPet = JSON.stringify(arrOfPetsObj);
//          console.log('addedPet is: ', addedPet);
      fs.writeFileSync(path, addedPet);
    }
  });
}
