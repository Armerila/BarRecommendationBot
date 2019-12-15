module.exports = {
  insertBarSql: function(name, address) {
    let sql = "INSERT INTO bars (name, address) VALUES ('" + name + "', '" + address + "')";
    return sql;
  },
};