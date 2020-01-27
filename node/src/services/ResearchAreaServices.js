var sql = require("../db/sql/ResearchAreaSql");
var LovResponse = require("../body/response/LovResponse");
var LovPageResponse = require("../body/response/LovPageResponse");
var SuccessResponse = require("../body/response/SuccessResponse");
var ErrorResponse = require("../body/response/ErrorResponse");
var util = require("../util/util");
var log4jHandler = require('../log4j/Log4jHandler');

var getResearchArea = () => {
  return new Promise((resolve, reject) => {
    sql.selectResearchArea().then((researchArea) => {
      resolve(LovResponse.lov('researchArea', researchArea))
    }).catch((err) => {
      log4jHandler.error(err)
      reject(ErrorResponse.error(util.orEC, "select research area fail"))
    })
  })
}

var getResearchAreaByPage = (index, offset, value, exportValue) => {
  return new Promise((resolve, reject) => {
    let rows = (index - 1) * offset;
    if(isNaN(rows) || isNaN(offset)) {
      reject(ErrorResponse.error(util.CC, "index and offset are required, and type must be number"))
    } else {
      sql.selectResearchAreaByPage(rows, offset, value, exportValue).then((researchArea) => {
        resolve(LovPageResponse.lovPage('researchArea', index, researchArea[1], researchArea[0]))
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "select research area by page fail"))
      })
    }
  })
}

var editResearchArea = (researchArea, user) => {
  return new Promise((resolve, reject) => {
    if(!researchArea.key) {
      reject(ErrorResponse.error(util.CC, "Research Area key is required"))
    } else {
      var id = researchArea.key.toString().replace(/\s+/g,"");
      var value = researchArea.value;
      var exportValue = researchArea.exportValue;
      if(!value || !exportValue) {
        reject(ErrorResponse.error(util.CC, "Research Area value and exportValue are required"))
      } else {
        sql.updateResearchArea(id, value, exportValue, user).then((edit) => {
          if(edit.affectedRows == 1) {
            resolve(SuccessResponse.edit())
          } else {
            reject(ErrorResponse.error(util.orCEC, "update Research Area with wrong Rows: " + edit.affectedRows))
          }
        }).catch((err) => {
          if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
            reject(ErrorResponse.error(util.orEC, "This research area value is already exist"))
          } else {
            reject(ErrorResponse.error(util.orEC, "update Research Area fail"))
          }
        })
      }
    }
  })  
}

var addResearchArea = (researchArea, user) => {
  return new Promise((resolve, reject) => {
    var value = researchArea.value;
    var exportValue = researchArea.exportValue;
    if(!value || !exportValue) {
      reject(ErrorResponse.error(util.CC, "Research Area value and exportValue are required"))
    } else {
      sql.insertResearchArea(value, exportValue, user).then((add) => {
        if(add.affectedRows == 1) {
          resolve(SuccessResponse.add())
        } else {
          reject(ErrorResponse.error(util.orCEC, "insert Research Area with wrong Rows: " + add.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
          reject(ErrorResponse.error(util.orEC, "This research area value is already exist"))
        } else {
          reject(ErrorResponse.error(util.orEC, "insert Research Area fail"))
        }
      })
    }
  })
}

var removeResearchArea = (id) => {
  return new Promise((resolve, reject) => {
    if(!id) {
      reject(ErrorResponse.error(util.CC, "Research Area key is required"))
    } else {
      id = id.replace(/\s+/g,"");
      sql.deleteResearchArea(id).then((remove) => {
        if(remove.affectedRows == 1) {
          resolve(SuccessResponse.remove())
        } else {
          reject(ErrorResponse.error(util.orCEC, "delete Research Area with wrong Rows: " + remove.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "delete research area fail"))
      })
    }
  })
}


module.exports = {
  getResearchArea: getResearchArea,
  editResearchArea: editResearchArea,
  addResearchArea: addResearchArea,
  removeResearchArea: removeResearchArea,
  getResearchAreaByPage: getResearchAreaByPage
}