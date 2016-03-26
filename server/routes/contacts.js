var express = require('express');
var router = express.Router();
var contact = require('../models/contact')
var url = require('url')
var jwt = require('jwt-simple')
var config = require('../config')

/* GET users listing. */
router.get('/', function(req, res, next) {

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  var user_id = jwt.decode(query.access_token, config.Secret).id
  console.log(user_id);
  if (user_id && !isNaN(user_id)) {

    contact.getAll(user_id, function (err, result) {

      if (err) {

        res.status(500).send({error : err})

      } else {

        res.send({ contacts : result})
      }
    })

  } else {

    res.status(401).send("Invalid access token")
  }
});

router.post('/', function(req, res, next) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  var user_id = jwt.decode(query.access_token, config.Secret).id

  if (user_id && !isNaN(user_id)) {

    contact.create(req.body.firstName, req.body.lastName, req.body.phone, user_id, function(err, result) {

      if (err) {

        res.status(500).send({ error: err})

      } else {

        res.status(201).send({ contacts: result })
      }
    })
  } else {

    res.status(401).send({error : "Invalid access token"})
  }
});

module.exports = router;
