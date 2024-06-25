const express = require('express');
const logs = express.Router();
const logsData = require('../models/logModel.js');

//Helper Function to verify post
const verifyPost = body => {
  if (
    body.captainName &&
    body.title &&
    body.post &&
    body.mistakesWereMadeToday &&
    body.daysSinceLastCrisis
  ) {
    const checkList = [];
    checkList.push(/^[a-zA-Z\s]+$/.test(body.captainName));
    checkList.push(/^[a-zA-Z\s]+$/.test(body.title));
    checkList.push(/^[a-zA-Z\s]+$/.test(body.post));
    checkList.push(/^[true|false]+$/i.test(body.mistakesWereMadeToday));
    checkList.push(/^[\d]+$/.test(body.daysSinceLastCrisis));
    return checkList.every(bool => bool === true);
  } else {
    return false;
  }
};

//Helper Function to process data base on query input
const queryLogic = (data, query) => {
  let processedData = undefined;
  if (query.order) {
    const multiplier = query.order === 'asc' ? 1 : -1;
    processedData = data.sort(
      (a, b) => a.captainName.localeCompare(b.captainName) * multiplier,
    );
  }
  if (query.mistakes === 'true' || query.mistakes === 'false') {
    const bool = query.mistakes === 'true';
    processedData = data.filter(log => log.mistakesWereMadeToday === bool);
  }
  if (query.lastCrisis) {
    const comparisonMap = {
      gt: (a, b) => a > b,
      gte: (a, b) => a >= b,
      lt: (a, b) => a < b,
      lte: (a, b) => a <= b,
    };
    const match = query.lastCrisis.match(/[a-z]+|\d+/g);
    if (match[1] && Object.keys(comparisonMap).includes(match[0])) {
      const operator = match[0];
      const num = Number(match[1]);
      const compare = comparisonMap[operator];
      processedData = data.filter(log => compare(log.daysSinceLastCrisis, num));
    }
  }
  return processedData;
};

//Index and query logic
logs.get('/', (req, res) => {
  if (Object.keys(req.query).length === 0) {
    res.json(logsData);
  } else {
    const processedData = queryLogic(logsData, req.query);
    if (!processedData) {
      res.status(404).json({
        error:
          'Query received did not match any of our functionalities, please try something different.',
      });
    } else if (processedData.length === 0) {
      res
        .status(200)
        .json({message: 'Unfortunately, no data matched query received.'});
    } else {
      res.status(200).json(processedData);
    }
  }
});

//Show log by id
logs.get('/:id', (req, res) => {
  const {id} = req.params;
  if (logsData[id]) {
    res.status(200).json(logsData[id]);
  } else {
    res.redirect('/');
  }
});

//Create
logs.post('/', (req, res) => {
  const checkPost = verifyPost(req.body);
  if (checkPost) {
    console.log('This is req.body', req.body);
    logsData.push(req.body);
    res.status(200).json(logsData[logsData.length - 1]);
  } else {
    res
      .status(404)
      .json({error: 'Data entered is not valid or formatted incorrectly.'});
  }
});

//Main 404 error page
logs.get('*', (req, res) => res.status(404).send('Invalid Route'));

module.exports = logs;
