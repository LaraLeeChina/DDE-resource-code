var sql = require("../db/sql/PlatformSql");
var LovResponse = require("../body/response/LovResponse");
var LovPageResponse = require("../body/response/LovPageResponse");
var SuccessResponse = require("../body/response/SuccessResponse");
var ErrorResponse = require("../body/response/ErrorResponse");
var util = require("../util/util");
var log4jHandler = require('../log4j/Log4jHandler');

var getPlatform = () => {
  return new Promise((resolve, reject) => {
    sql.selectPlatform().then((platform) => {
      resolve(LovResponse.lov('platform', platform))
    }).catch((err) => {
      log4jHandler.error(err)
      reject(ErrorResponse.error(util.orEC, "select platform fail"))
    })
  })
}

var getPlatformByPage = (index, offset, value, exportValue, business) => {
  return new Promise((resolve, reject) => {
    let rows = (index - 1) * offset;
    if(isNaN(rows) || isNaN(offset)) {
      reject(ErrorResponse.error(util.CC, "index and offset are required, and type must be number"))
    } else {
      sql.selectPlatformByPage(rows, offset, value, exportValue, business).then((platform) => {
        resolve(LovPageResponse.lovPage('platform', index, platform[1], platform[0]))
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "select platform by page fail"))
      })
    }
  })
}

var editPlatform = (platform, user) => {
  return new Promise((resolve, reject) => {
    if(!platform.key) {
      reject(ErrorResponse.error(util.CC, "platform key is required"))
    } else {
      var id = platform.key.toString().replace(/\s+/g,"")
      if(!platform.value || !platform.exportValue || !platform.business) {
        reject(ErrorResponse.error(util.orCC, "platform value, export value and business is required"))
      } else {
        sql.validatePlatform(platform.value, platform.exportValue, platform.business).then((validate) => {
          if(validate[0].total == 0) {
            sql.updatePlatform(id, platform.value, platform.exportValue, platform.business, user).then((edit) => {
              if(edit.affectedRows == 1) {
                resolve(SuccessResponse.edit())
              } else {
                reject(ErrorResponse.error(util.orCEC, "update Platform with wrong Rows: " + edit.affectedRows))
              }
            }).catch((err) => {
              log4jHandler.error(err)
              reject(ErrorResponse.error(util.orEC, "update platform fail"))
            })
          } else {
            reject(ErrorResponse.error(util.orCEC, "This platform value and mapped business is already exist"))
          }
        }).catch((err) => {
          log4jHandler.error(err)
          reject(ErrorResponse.error(util.orEC, "validate platform fail"))
        })
      }
    }
  })
}

var addPlatform = (platform, user) => {
  return new Promise((resolve, reject) => {
    if(!platform.value || !platform.exportValue || !platform.business) {
      reject(ErrorResponse.error(util.orCC, "platform value, export and business value is required"))
    } else {
      sql.validatePlatform(platform.value, platform.exportValue, platform.business).then((validate) => {
        if(validate[0].total == 0) {
          sql.insertPlatform(platform.value, platform.exportValue, platform.business, user).then((add) => {
            if(add.affectedRows == 1) {
              resolve(SuccessResponse.add())
            } else {
              reject(ErrorResponse.error(util.orCEC, "insert platform with wrong Rows: " + add.affectedRows))
            }
          }).catch((err) => {
            log4jHandler.error(err)
            reject(ErrorResponse.error(util.orEC, "insert platform fail"))
          })
        } else {
          reject(ErrorResponse.error(util.orCEC, "This platform value and mapped business is already exist"))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "validate platform fail"))
      })
    }
  })
}

var removePlatform = (id) => {
  return new Promise((resolve, reject) => {
    if(!id) {
      reject(ErrorResponse.error(util.orCC, "platform id is required"))
    } else {
      id = id.replace(/\s+/g,"")
      sql.deletePlatform(id).then((remove) => {
        if(remove.affectedRows == 1) {
          resolve(SuccessResponse.remove())
        } else {
          reject(ErrorResponse.error(util.orCEC, "delete platform with wrong Rows: " + remove.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "delete platform fail"))
      })
    }
  })
}

module.exports = {
  getPlatform: getPlatform,
  getPlatformByPage: getPlatformByPage,
  editPlatform: editPlatform,
  addPlatform: addPlatform,
  removePlatform: removePlatform
}