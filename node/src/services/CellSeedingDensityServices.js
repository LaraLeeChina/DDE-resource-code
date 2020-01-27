var sql = require("../db/sql/CellSeedingDensitySql");
var LovResponse = require("../body/response/LovResponse");
var LovPageResponse = require("../body/response/LovPageResponse");
var SuccessResponse = require("../body/response/SuccessResponse");
var ErrorResponse = require("../body/response/ErrorResponse");
var util = require("../util/util");
var log4jHandler = require('../log4j/Log4jHandler');

var getCellSeedingDensity = () => {
  return new Promise((resolve, reject) => {
    sql.selectCellSeedingDensity().then((cellSeedingDensity) => {
      resolve(LovResponse.lov('cellSeedingDensity', cellSeedingDensity))
    }).catch((err) => {
      log4jHandler.error(err)
      reject(ErrorResponse.error(util.orEC, "select cell seeding density fail"))
    })
  })
}

var getCellSeedingDensityByPage = (index, offset, value) => {
  return new Promise((resolve, reject) => {
    let rows = (index - 1) * offset;
    if(isNaN(rows) || isNaN(offset)) {
      reject(ErrorResponse.error(util.CC, "index and offset are required, and type must be number"))
    } else {
      sql.selectCellSeedingDensityByPage(rows, offset, value).then((cellSeedingDensity) => {
        resolve(LovPageResponse.lovPage('cellSeedingDensity', index, cellSeedingDensity[1], cellSeedingDensity[0]))
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orCEC, "select cell seeding density by page fail"))
      })
    }
  })
}

var editCellSeedingDensity = (cellSeedingDensity, user) => {
  return new Promise((resolve, reject) => {
    if(!cellSeedingDensity.key) {
      reject(ErrorResponse.error(util.CC, "Cell Seeding Density key is required"))
    } else {
      var id = cellSeedingDensity.key.toString().replace(/\s+/g,"");
      var value = cellSeedingDensity.value;
      if(!value) {
        reject(ErrorResponse.error(util.CC, "Cell Seeding Density value is required"))
      } else {
        sql.updateCellSeedingDensity(id, value, user).then((edit) => {
          if(edit.affectedRows == 1) {
            resolve(SuccessResponse.edit())
          } else {
            reject(ErrorResponse.error(util.orCEC, "update Cell Seeding Density with wrong Rows: " + edit.affectedRows))
          }
        }).catch((err) => {
          log4jHandler.error(err)
          if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
            reject(ErrorResponse.error(util.orEC, "This cell seeding density value is already exist"))
          } else {
            reject(ErrorResponse.error(util.orEC, "update cell seeding density fail"))
          }
        })
      }
    }
  })
}

var addCellSeedingDensity = (cellSeedingDensity, user) => {
  return new Promise((resolve, reject) => {
    var value = cellSeedingDensity.value
    if(!value) {
      reject(ErrorResponse.error(util.CC, "Cell Seeding Density value is required"))
    } else {
      sql.insertCellSeedingDensity(value, user).then((add) => {
        if(add.affectedRows == 1) {
          resolve(SuccessResponse.add())
        } else {
          reject(ErrorResponse.error(util.orCEC, "Insert Cell Seeding Density with wrong Rows: " + add.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
          reject(ErrorResponse.error(util.orEC, "This cell seeding density value is already exist"))
        } else {
          reject(ErrorResponse.error(util.orEC, "Insert cell seeding density fail"))
        }
      })
    }
  })
}

var removeSeedingDensity = (id) => {
  return new Promise((resolve, reject) => {
    if(!id) {
      reject(ErrorResponse.error(util.CC, "Cell Seeding Density key is required"))
    } else {
      id = id.replace(/\s+/g,"");
      sql.deleteCellSeedingDensity(id).then((remove) => {
        if(remove.affectedRows == 1) {
          resolve(SuccessResponse.remove())
        } else {
          reject(ErrorResponse.error(util.orCEC, "delete Cell Seeding Density with wrong Rows: " + remove.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "delete cell seeding density fail"))
      })
    }
  })
}


module.exports = {
  getCellSeedingDensity: getCellSeedingDensity,
  getCellSeedingDensityByPage: getCellSeedingDensityByPage,
  editCellSeedingDensity: editCellSeedingDensity,
  addCellSeedingDensity: addCellSeedingDensity,
  removeSeedingDensity: removeSeedingDensity
}