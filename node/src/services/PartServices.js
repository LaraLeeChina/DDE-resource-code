var sql = require("../db/sql/PartSql");
var LovResponse = require("../body/response/LovResponse");
var LovPageResponse = require("../body/response/LovPageResponse");
var SuccessResponse = require("../body/response/SuccessResponse");
var ErrorResponse = require("../body/response/ErrorResponse");
var util = require("../util/util");
var log4jHandler = require('../log4j/Log4jHandler');

var getPart = (product, assay) => {
  return new Promise((resolve, reject) => {
    if(!product || (product != "all" && JSON.parse(product).length == 0) || !assay || (assay != "all" && JSON.parse(assay).length == 0)) {
      resolve(new Array())
    } else {
      sql.selectPart(product, assay).then((part) => {
        resolve(LovResponse.lov('part', part))
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "select part fail"))
      })
    }
  })
}

var getPartByPage = (index, offset, value) => {
  return new Promise((resolve, reject) => {
    let rows = (index - 1) * offset;
    if(isNaN(rows) || isNaN(offset)) {
      reject(ErrorResponse.error(util.CC, "index and offset are required, and type must be number"))
    } else {
      sql.selectPartByPage(rows, offset, value).then((part) => {
        resolve(LovPageResponse.lovPage('part', index, part[1], part[0]))
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "select part by page fail"))
      })
    }
  })
}

var editPart = (part, user) => {
  return new Promise((resolve, reject) => {
    if(!part.key) {
      reject(ErrorResponse.error(util.CC, "part key is required"))
    } else {
      var id = part.key.toString().replace(/\s+/g,"")
      if(!part.value) {
        reject(ErrorResponse.error(util.orCC, "part value is required"))
      } else {
        sql.updatePart(id, part.value, user).then((edit) => {
          if(edit.affectedRows == 1) {
            resolve(SuccessResponse.edit())
          } else {
            reject(ErrorResponse.error(util.orCEC, "update Part with wrong Rows: " + edit.affectedRows))
          }
        }).catch((err) => {
          log4jHandler.error(err)
          if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
            reject(ErrorResponse.error(util.orEC, "This part value is already exist"))
          } else {
            reject(ErrorResponse.error(util.orEC, "update part fail"))
          }
        })
      }
    }
  })
}

var addPart = (part, user) => {
  return new Promise((resolve, reject) => {
    if(!part.value) {
      reject(ErrorResponse.error(util.orCC, "part value is required"))
    } else {
      sql.insertPart(part.value, user).then((add) => {
        if(add.affectedRows == 1) {
          resolve(SuccessResponse.add())
        } else {
          reject(ErrorResponse.error(util.orCEC, "insert part with wrong Rows: " + add.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
          reject(ErrorResponse.error(util.orEC, "This part value is already exist"))
        } else {
          reject(ErrorResponse.error(util.orEC, "insert part fail"))
        }
      })
    }
  })
}

var removePart = (id) => {
  return new Promise((resolve, reject) => {
    if(!id) {
      reject(ErrorResponse.error(util.orCC, "part id is required"))
    } else {
      id = id.replace(/\s+/g,"")
      sql.deletePart(id).then((remove) => {
        if(remove.affectedRows == 1) {
          resolve(SuccessResponse.remove())
        } else {
          reject(ErrorResponse.error(util.orCEC, "delete part with wrong Rows: " + remove.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "delete part fail"))
      })
    }
  })
}

module.exports = {
  getPart: getPart,
  getPartByPage: getPartByPage,
  editPart: editPart,
  addPart: addPart,
  removePart: removePart
}