var pg = require('pg')
var bcrypt = require('bcrypt')
var config = require('../config')
var jwt = require('jwt-simple')

module.exports = {

  create : function(email, password, done) {

    if (password && password.length >= 8) {

      if (email && email.length > 0) {

        // Create user
        bcrypt.hash(password, 10, function(err, hash) {

          if (err) {

            // error
            done(err, null)
          } else {

            pg.connect(process.env.DATABASE_URL, function(err, client) {
              if (err) {
                console.log(err)
                done(err, null)
                return
              }
              client
                .query("SELECT create_user('"+email+"', '"+hash+"')")
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
        })
      } else {

        done("Not valid email", null)
      }
    } else {

      done("Not valid password", null)
    }
  },

  getAccessToken : function(email, password, done) {

    if (password && password.length >= 8) {

      if (email && email.length > 0) {

        pg.connect(process.env.DATABASE_URL, function(err, client) {
          if (err) {
            console.log(err)
            done(err, null)
            return
          }
          client
            .query("SELECT * FROM get_user_from_email('"+email+"')")
            .on('row', function(row, result) {
              result.addRow(row)
            })
            .on('end', function(result) {

              bcrypt.compare(password, result.rows[0].password, function(err, res) {

                if (err) {

                  done("Invalid password", null)

                } else {

                  done(null, jwt.encode({id:result.rows[0].id}, config.Secret))
                }
              });
            })
            .on('error', function(error) {
              done(error, null)
            })
          });

      } else {

        done("Not valid email", null)

      }

    } else {

      done("Not valid password", null)
    }
  }
}