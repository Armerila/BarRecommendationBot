let sql = require("../helpers/sql");
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('../BarBot.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the barbot database.');
});

module.exports = {
  insertBar: function(bar) {
    let query = sql.insertBarSql(bar.name, bar.address);
    console.log(query);
    db.run(query, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log(`Rows inserted ${this.changes}`);
      }
    });
  },

  insertRating: function(userID, userName, barName, rating) {
    getUser(userID, userName, function(res) {
      console.log(res);
    });
  },
};

function getUser(userID, userName, callback) {
  let query = sql.getUserSql(userID);
  
  db.get(query, (err, row) => {
    if (err) {
      console.log(err);
    } else {
      if (row) {
        callback(row.id + " " + row.displayname);
      } else {
        insertUser(userID, userName, function () {
          console.log("user created!");
        });
      }
    }
  });
}

function insertUser(userID, userName, callback) {
  let query = sql.insertUserSql(userID, userName);
  db.run(query, function(err) {
    if (err) {
      console.log(err);
    } else {
      callback();
    }
  });
}
