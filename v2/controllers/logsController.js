const express = require('express');
const logs = express.Router();
const logsData = require('../../models/logModel.js');

const createHTML = data => {
  const HTMLTemplate = [];
  HTMLTemplate.push(`
    <!doctype html>
    <html lang="en">
      <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Captain's Log App</title>
        <style>
          *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .container, .log{
            display: flex;
            flex-direction: column;
            padding: 2%;
          }
          .back{
            padding: 5%;
            cursor: pointer;
          }
          .logs{
            padding: 5%;
            display: grid;
            grid-template-columns: repeat(2, auto); 
            column-gap: 10%;
          }
        </style>
      </head>
      <body>
        <article class='container'>
          <div class='back'>
            <a href='/logs'>Go back</a>
          </div>
          <div class='logs'>
  `);
  data.forEach(log => {
    const {
      captainName,
      title,
      post,
      mistakesWereMadeToday,
      daysSinceLastCrisis,
    } = log;
    HTMLTemplate.push(`
      <div class='log'>
        <h1>${title}</h1>
        <p>Captain: ${captainName}</p>
        <p>${post}</p>
        <p>Any mistakes? ${mistakesWereMadeToday === 'true' ? 'Yes' : 'No'}</p>
        <p>Days Since Last Crisis: ${daysSinceLastCrisis}</p>
      </div>
    `);
  });
  HTMLTemplate.push(`
          </div>
        </article>
      </body>
    </html>
  `);
  return HTMLTemplate.join('\n');
};

logs.get('/', (req, res) => res.status(200).send(createHTML(logsData)));

logs.get('/:id', (req, res) => {
  const {id} = req.params;
  if (logsData[id]) {
    res.status(200).send(createHTML([logsData[id]]));
  } else {
    res.status(404).json({error: 'No Log with that ID'});
  }
});

//Main 404 error page
logs.get('*', (req, res) => res.status(404).send('Invalid Route'));

module.exports = logs;
