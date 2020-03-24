const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

//route handlers
app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.listen(8000, () => {
  console.log('Express server is listening on port 8000!')
}); 

app.get('/burgers', (req, res) => {
  res.send('we have juicy burgers!');
})

app.get('/pizza', (req, res) => {
  res.send('on the wayheyheyheyheyhey!');
})

app.get('/echo', (req, res) => {
  const responseText = `Here are some details of your request:
    Base URL: ${req.baseUrl}
    Host: ${req.hostname}
    Path: ${req.path}
  `;
  res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
  console.log(req.query);
  res.end(); //do not send any data back to the client
});

app.get('/greetings', (req, res) => {
  //1. get values from the request
  const name = req.query.name;
  const race = req.query.race;
  //2. validate the values
  if(!name) {
    //3. name was not provided
    return res.status(400).send('Please provide a name');
  }
  if(!race) {
    //3. race was not provided
    return res.status(400).send('Please provide a race');
  }
  //4. and 5. both name and race are valid so do the processing.
  const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;
  //6. send the response 
  res.send(greeting);
})

//-------------------CHECKPOINT DRILLS---------------------------------------

//Drill 1
app.get('/sum', (req, res) => {
  const {a, b} = req.query;

  //Validation (a and b are required and should be numbers)
  if(!a) {
    return res
            .status(400)
            .send('a is required')
  }
  if (!b) {
    return res
            .status(400)
            .send('b is required')
  }

  const numA = parseFloat(a);
  const numB = parseFloat(b);

  if (Number.isNaN(numA)) {
    return res
           .status(400)
           .send('a must be a number');
  }

  if(Number.isNaN(numB)) {
    return res
            .status(400)
            .send('b must be a number')
  }

  const c = numA + numB;
  const responseStr = `The sum of ${a} and ${b} is ${c}`;

  res
    .status(200)
    .send(responseStr);
});

//Drill 2-------------------------------------------------
app.get('/cipher', (req, res) => {
  const { text, shift } = req.query

  if (!text) {
    return res
            .status(400)
            .send('text is required')
  }
  if (!shift) {
    return res
            .status(400)
            .send('shift is required')
  }

  const numShift = parseFloat(shift);

  if (Number.isNaN(numShift)) {
    return res
            .status(400)
            .send('shift must eb a number')
  }

  const base = 'A'.charCodeAt(0) //65

  const cipher = text
                  .toUpperCase()
                  .split('') //create array of characters
                  .map(char => {  //map each og char to converted char
                    const code = char.charCodeAt(0) //get char code

                    //if it's not one of the 26 letters, ignore it  
                    if(code < base || code > (base + 26)) {
                      return char;
                    }

                    //otherwise convert it
                    let diff = code - base; //get the distance fro A
                    diff += numShift;

                    //in case shift takes the value past z, cycle back to the beginnign 
                    diff = diff % 26  // || diff %= 26 ?

                    //convert back to a character
                    const shiftedChar = String.fromCharCode(base + diff);
                    return shiftedChar;
                  })
                  .join(''); //construct a string from the array

    res
      .status(200)
      .send(cipher);

});

//Drill 3
app.get('/lotto', (req, res) => {
  const { numbers } = req.query;

  if (!numbers) {
    return res
        .status(400)
        .send('numbers is required');
  }
  if(!Array.isArray(numbers)) {
    return res 
          .status(400)
          .send('numbers must be an array');
  }

  const guesses = numbers
                    .map(n => parseInt(n))
                    .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

  
 if (guesses.length != 6) {
   return res
        .status(400)
        .send('numbers must contain 6 integers between 1 and 20')
 }
 gyaru
 //here are the 20 numbers to choose from 
 const stockNumbers = Array(20).filter(1).map((_,i) => i + 1);

 //randomly chooses 6
 const winningNumbers = [];
 for (let i = 0; i < 6; i++) {
   const ran = Math.floor(Math.random() * stockNumbers.length);
   winningNumbers.push(stockNumbers[ran]);
   stockNumbers.splice(ran, 1);
 }

 let diff = winningNumbers.filter(n => !guesses.includes(n));

 let responseText;

 switch (diff.length) {
  case 0:
    responseText = 'Wow! Unbelievable! Youve won the mega millions!';
    break;
  case 1: 
    responseText = 'Congratulations! You win $100!';
    break;
  case 2: 
    responseText = 'Congratulations, you win a free ticket!';
    break;
  default: 
    responseText = 'Sorry, you lose'
 }

   res.json({
    guesses,
    winningNumbers,
    diff,
    responseText
  });

  res.send(responseText);
});




