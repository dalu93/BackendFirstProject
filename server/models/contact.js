var pg = require('pg')
var config = require('../config')

module.exports = {

  create : function(first_name, last_name, phone_number, user_id, done) {

    if (!first_name || first_name.length == 0) {

      done("Invalid first name", null)
      return
    }

    if (!last_name || last_name.length == 0) {

      done("Invalid last name", null)
      return
    }

    if (!phone_number || phone_number.length <= 3) {

      done("Invalid phone number", null)
      return
    }

    if (!user_id) {

      done("Invalid user", null)
      return
    }

    pg.connect(process.env.DATABASE_URL, function(err, client) {
      if (err) {
        console.log(err)
        done(err, null)
        return
      }
      client
        .query("SELECT * FROM create_contact("+user_id+", '"+first_name+"', '"+last_name+"', '"+phone_number+"')")
        .on('row', function(row, result) {
          result.addRow(row)
        })
        .on('end', function(result) {
          done(null, result.rows)
        })
        .on('error', function(error) {
          done(error, null)
        })
    });
  },

  getAll: function(user_id, done) {

    if (!user_id) {

      done("Invalid user", null)
      return
    }

    pg.connect(process.env.DATABASE_URL, function(err, client) {
      if (err) {
        console.log(err)
        done(err, null)
        return
      }
      client
        .query("SELECT * FROM get_contacts("+user_id+")")
        .on('row', function(row, result) {
          result.addRow(row)
        })
        .on('end', function(result) {
          done(null, result.rows)
        })
        .on('error', function(error) {
          done(error, null)
        })
    });
  }
}
