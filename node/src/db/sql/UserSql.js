var connection = require("../connection");

var selectUserByUserName = (user) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) FROM user WHERE UPPER(username) = UPPER('${user}');`;
    connection.execute(sql, 'selectUserByUserName').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}


module.exports = {
  selectUserByUserName: selectUserByUserName
}
  