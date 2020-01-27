var sql = require('../db/sql/UserSql');
var ErrorResponse = require('../body/response/ErrorResponse');
var log4j = require('../log4j/Log4jHandler');
var utils = require('../util/util');

var verifyUser = (user) => {
  return new Promise((resolve, reject) => {
    sql.selectUserByUserName(user).then((res) => {
      if(res[0]['COUNT(*)'] == 0) {
        reject(ErrorResponse.error(utils.orCEC, "This user not exist in white list"))
      } else {
        resolve()
      }
    }).catch((err) => {
      log4j.error(err)
      reject(ErrorResponse.error(utils.orEC, "Verify user fail"))
    })
  })
}

module.exports = {
  verifyUser: verifyUser
}