var express = require('express');
var router = express.Router();
var account = require('../models/account')
var url = require('url')

router.get('/', function(req, res, next) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  account.getAccessToken(query.email, query.password, function(err, result) {

    if (err) {

      res.status(500).send({ error: err})

    } else {

      res.send({access_token : result})
    }
  })
});

module.exports = router;
