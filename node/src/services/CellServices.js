var sql = require("../db/sql/CellSql");
var LovResponse = require("../body/response/LovResponse");
var LovPageResponse = require("../body/response/LovPageResponse");
var SuccessResponse = require("../body/response/SuccessResponse");
var ErrorResponse = require("../body/response/ErrorResponse");
var util = require("../util/util");
var log4jHandler = require('../log4j/Log4jHandler');

var getCellTypes = (cellLine) => {
  return new Promise((resolve, reject) => {
    if(!cellLine || (cellLine != "all" && JSON.parse(cellLine).length == 0)) {
      resolve(new Array())
    } else {
      sql.selectCellTypes(cellLine).then((cellTypes) => {
        resolve(LovResponse.lov('cellTypes', cellTypes))
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "select cell types fail"))
      })
    }
  })
}

var getCellTypesByPage = (index, offset, value) => {
  return new Promise((resolve, reject) => {
    let rows = (index - 1) * offset;
    if(isNaN(rows) || isNaN(offset)) {
      reject(ErrorResponse.error(util.CC, "index and offset are required, and type must be number"))
    } else {
      sql.selectCellTypesByPage(rows, offset, value).then((cellTypes) => {
        resolve(LovPageResponse.lovPage('cellTypes', index, cellTypes[1], cellTypes[0]))
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "select cell types by page fail"))
      })
    }
  })
}

var editCellTypes = (cellTypes, user) => {
  return new Promise((resolve, reject) => {
    if(!cellTypes.key) {
      reject(ErrorResponse.error(util.CC, "Cell Types key is required"))
    } else {
      var id = cellTypes.key.toString().replace(/\s+/g,"");
      if(!cellTypes.value) {
        reject(ErrorResponse.error(util.CC, "Cell Types value is required"))
      } else {
        sql.updateCellTypes(id, cellTypes.value, user).then((edit) => {
          if(edit.affectedRows == 1) {
            resolve(SuccessResponse.edit());
          } else {
            reject(ErrorResponse.error(util.orCEC, "update Cell Types with wrong Rows: " + edit.affectedRows))
          }
        }).catch((err) => {
          log4jHandler.error(err)
          if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
            reject(ErrorResponse.error(util.orEC, "This cell types value is already exist"))
          } else {
            reject(ErrorResponse.error(util.orEC, "update cell types fail"))
          }
        })
      }
    }
  })
}

var addCellTypes = (cellTypes, user) => {
  return new Promise((resolve, reject) => {
    if(!cellTypes.value) {
      reject(ErrorResponse.error(util.CC, "Cell Types value is required"))
    } else {
      sql.insertCellTypes(cellTypes.value, user).then((add) => {
        if(add.affectedRows == 1) {
          resolve(SuccessResponse.add())
        } else {
          reject(ErrorResponse.error(util.orCEC, "Insert Cell Types with wrong Rows: " + add.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
          reject(ErrorResponse.error(util.orEC, "This cell types value is already exist"))
        } else {
          reject(ErrorResponse.error(util.orEC, "Insert cell types fail"))
        }
      })
    }
  })
}

var removeCellTypes = (id) => {
  return new Promise((resolve, reject) => {
    if(!id) {
      reject(ErrorResponse.error(util.CC, "Cell Types key is required"))
    } else {
      id = id.replace(/\s+/g,"")
      sql.deleteCellTypes(id).then((remove) => {
        if(remove.affectedRows == 1) {
          resolve(SuccessResponse.remove())
        } else {
          reject(ErrorResponse.error(util.orCEC, "delete Cell Types with wrong Rows: " + remove.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "delete cell types fail"))
      })
    }
  })
}

var getCellLine = () => {
  return new Promise((resolve, reject) => {
    sql.selectCellLine().then((cellLine) => {
      resolve(LovResponse.lov('cellLine', cellLine))
    }).catch((err) => {
      log4jHandler.error(err)
      reject(ErrorResponse.error(util.orEC, "select cell line fail"))
    })
  })
}

var getCellLineByPage = (index, offset, value, cellTypes) => {
  return new Promise((resolve, reject) => {
    let rows = (index - 1) * offset;
    if(isNaN(rows) || isNaN(offset)) {
      reject(ErrorResponse.error(util.CC, "index and offset are required, and type must be number"))
    } else {
      sql.selectCellLineByPage(rows, offset, value, cellTypes).then((cellLine) => {    
        resolve(LovPageResponse.lovPage('cellLine', index, cellLine[1], cellLine[0]))
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "select cell line by page fail"))
      })
    }
  })
}

var editCellLine = (cellLine, user) => {
  return new Promise((resolve, reject) => {
    if(!cellLine.id) {
      reject(ErrorResponse.error(util.CC, "Cell Line id is required"))
    } else {
      var id = cellLine.id.toString().replace(/\s+/g,"")
      var value = cellLine.value
      var cellTypes = cellLine.cellTypes
      if(!value || !cellTypes) {
        reject(ErrorResponse.error(util.CC, "Cell Line value and map cell types is required"))
      } else {
        sql.validateCellLine(value, cellTypes).then((validate) => {
          if(validate[0].total == 0) {
            sql.updateCellLine(id, value, cellTypes, user).then((edit) => {
              if(edit.affectedRows == 1) {
                resolve(SuccessResponse.edit())
              } else {
                reject(ErrorResponse.error(util.orCEC, "update Cell Line with wrong Rows: " + edit.affectedRows))
              }
            }).catch((err) => {
              log4jHandler.error(err)
              reject(ErrorResponse.error(util.orEC, "update cell line fail"))
            })
          } else {
            reject(ErrorResponse.error(util.orCEC, "This cell line value and mapped cell types is already exist"))
          }
        }).catch((err) => {
          log4jHandler.error(err)
          reject(ErrorResponse.error(util.orEC, "validate cell line fail"))
        })
      }
    }
  })
}

var addCellLine = (cellLine, user) => {
  return new Promise((resolve, reject) => {
    if(!cellLine.value || !cellLine.cellTypes) {
      reject(ErrorResponse.error(util.CC, "Cell Line value and map cell types is required"))
    } else {
      sql.validateCellLine(cellLine.value, cellLine.cellTypes).then((validate) => {
        if(validate[0].total == 0) {
          sql.insertCellLine(cellLine.value, cellLine.cellTypes, user).then((add) => {
            if(add.affectedRows == 1) {
              resolve(SuccessResponse.add())
            } else {
              reject(ErrorResponse.error(util.orCEC, "Insert Cell Line with wrong Rows: " + add.affectedRows))
            }
          }).catch((err) => {
            log4jHandler.error(err)
            reject(ErrorResponse.error(util.orEC, "Insert cell line fail"))
          })
        } else {
          reject(ErrorResponse.error(util.orCEC, "This cell line value and mapped cell types is already exist"))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "validate cell line fail"))
      })
    }
  })
}

var removeCellLine = (id) => {
  return new Promise((resolve, reject) => {
    if(!id) {
      reject(ErrorResponse.error(util.CC, "Cell Line id is required"))
    } else {
      id = id.replace(/\s+/g,"")
      sql.deleteCellLine(id).then((remove) => {
        if(remove.affectedRows == 1) {
          resolve(SuccessResponse.remove())
        } else {
          reject(ErrorResponse.error(util.orCEC, "delete Cell Line with wrong Rows: " + remove.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "delete cell line fail"))
      })
    }
  })
}

module.exports = {
  getCellTypes: getCellTypes,
  getCellTypesByPage: getCellTypesByPage,
  editCellTypes: editCellTypes,
  addCellTypes: addCellTypes,
  removeCellTypes: removeCellTypes,
  getCellLine: getCellLine,
  getCellLineByPage: getCellLineByPage,
  editCellLine: editCellLine,
  addCellLine: addCellLine,
  removeCellLine: removeCellLine
}