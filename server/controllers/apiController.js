// controller for accessing city database
// controller for accessing city databse

// npm package that allows the use of fetch without the browser (ie in postman)
const fetch = require('isomorphic-fetch');
const db = require('../models/db');

// app identifier to allow more queries to database
const appToken = 'rvAoMk2CVgwcxb3uzQw8lxP1k';

const apiController = {};

// function to format string correctly with regex for database query
const format = (str) => {
  // const string = str.replace(/(th)|(st)|(nd)|(rd)\b/i, '')
  //   .replace(/st/i, 'STREET')
  //   .replace(/ave?/i, 'AVENUE')
  //   .replace(/blvd/i, 'BOULEVARD')
  //   .replace(/pl/i, 'PLACE')
  //   .replace(/pt/i, 'POINT')
  //   .replace(/\b(w)\b/i, 'WEST')
  //   .replace(/\b(e)\b/i, 'EAST')
  //   .replace(/\b(s)\b/i, 'SOUTH')
  //   .replace(/\b(n)\b/i, 'NORTH')
  //   .replace(/  +/g, ' ')
  //   .trim()
  //   .toUpperCase();
  // return string;

  //* new formatting style using the google places api
  const arr = str.toUpperCase().split(',');
  arr[0] = arr[0].replace(/(th)|(st)|(nd)|(rd)\b/i, '');
  arr[1] = arr[1].replace(' ', '');
  return arr;
};

// function to fetch data from the api
apiController.getData = (req, res, next) => {
  const addressArr = format(req.body.address);
  // const borough = req.body.borough.toUpperCase();
  console.log(addressArr);

  fetch(`https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address='${addressArr[0]}'&$where=city='${addressArr[1]}'`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-App-Token': appToken,
      },
    })
    .then((data) => data.json())
    .then((data) => {
      const filteredData = data.map((elem) => ({
        date: elem.created_date,
        address: elem.incident_address,
        borough: elem.borough,
        complaintType: elem.complaint_type,
        description: elem.descriptor,
        location: elem.location, // location: {latitude: '40', longitude: '-73'}
      }));
      res.locals.data = filteredData;
    })
    .then(next)
    .catch((err) => next({
      log: err,
      message: { err: 'there was an error fetching 311 data' },
    }));
};

apiController.saveSearch = async (req, res, next) => {
  try {
    const search = await db.query(`INSERT INTO Searches(address_search, user_id)
    VALUES($1, $2)`, [req.body.address, req.body.user.id]);
    next();
  } catch(err) {
    next(err);
  }
};

module.exports = apiController;
