let sql = require("../helpers/sql");
const sqlite3 = require('sqlite3').verbose();
let recommender = require('recommender');

let db = new sqlite3.Database('../sqlite/BarBot.db', (err) => {
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

  insertRating: function(userID, userName, barName, rating, callback) {
    getUser(userID, userName, function(res) {
      getBar(barName, function(res) {
        if (res) {
          insertRating(userID, res, rating, function() {
            callback("Thank you for rating " + barName + "!");
          });
        } else {
          callback("No such bar exists!");
        }
      });
      
    });
  },

  getRatingData: function(callback) {
    let allUsers = [];
    let allBars = [];
    let allRatings = [];

    getAllUsers(function(users) {
        allUsers = users;
        getAllBars(function(bars) {
          allBars = bars;
          getAllRatings(function(ratings) {
            allRatings = ratings;
            callback(allUsers, allBars, allRatings);
          });
        });
    });
  },

  getSingleRecommendation: function(userRatings, userIndex, callback) {
    recommender.getTopCFRecommendations(userRatings, 0, {limit: 3}, (recommendations) => {
      callback(recommendations);
    });
  }
};

function getUser(userID, userName, callback) {
  let query = sql.getUserSql(userID);

  db.get(query, (err, row) => {
    if (err) {
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

function getAllUsers(callback) {
  let query = sql.getAllUsersSql();
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      callback(rows);
    }
  });
}

function getUsersRating(userID, barID, callback) {
  let query = sql.getUsersRating(userID, barID);
  db.get(query, (err, row) => {
    if (err) {
      console.log(err);
    } else {
      if (row) {
        callback(row);
      } else {
        callback({rating: 0});
      }
    }
  });
}

function getUsersRatings(userID, callback) {
  let query = sql.getUsersRatings(userID);
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      callback(rows);
    }
  });
}

function getBar(barName, callback) {
  let query = sql.getBarSql(barName);
  db.get(query, (err, row) => {
    if (err) {
      console.log("getBar: " + err);
    } else {
      if (row) {
        callback(row.id);
      } else {
        callback(row);
      }
    }
  });
}

function getAllBars(callback) {
  let query = sql.getAllBarsSql();
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      callback(rows);
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

function insertRating(userID, barID, rating, callback) {
  let query = sql.insertRatingSql(userID, barID, rating);
  db.run(query, function(err) {
    if (err) {
      console.log(err);
    } else {
      callback();
    }
  });
}

function getAllRatings(callback) {
  let query = sql.getAllRatings();
  db.all(query, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      callback(rows);
    }
  });
}

