module.exports = {
  insertBarSql: function(name, address) {
    let sql = "INSERT INTO bars (name, address) VALUES ('" + name + "', '" + address + "')";
    return sql;
  },

  getUserSql: function(userID) {
    let sql = "SELECT id, displayname FROM users WHERE id = " + userID;
    return sql;
  },

  getBarSql: function(barName) {
    let sql = "SELECT id FROM bars WHERE name = " + barName ;
    return sql;
  },

  insertUserSql: function(userID, userName) {
    let sql = "INSERT INTO users (id, displayname) VALUES ('" + userID + "', '" + userName + "')";
    return sql;
  },

  insertRatingSql: function(userID, barID, rating) {
    let sql = "INSERT INTO ratings (rating, bar, user) VALUES ('" + rating + "', '" + barID + "', '" + userID + "')"
    return sql;
  },
  
  getAllRatings: function() {
    let sql = "SELECT * FROM ratings";
    return sql;
  },
};