var express = require('express');
var router = express.Router();
var account = require('../models/account')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {

  account.create(req.body.email, req.body.password, function(err, result) {

    if (err) {

      // Error
      res.status(500).send(err)
    } else {

      res.status(201).send()
    }
  });
});

module.exports = router;
