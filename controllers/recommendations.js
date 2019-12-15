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
        return "Unable to create a new bar into the database. The bar either already exists, or something else is not working :))";
      } else {
        console.log(`Rows inserted ${this.changes}`);
        return "Bar added to the database!";
      }
    });
  },
};

