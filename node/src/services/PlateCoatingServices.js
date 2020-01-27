var sql = require("../db/sql/PlateCoatingSql");
var LovResponse = require("../body/response/LovResponse");
var LovPageResponse = require("../body/response/LovPageResponse");
var SuccessResponse = require("../body/response/SuccessResponse");
var ErrorResponse = require("../body/response/ErrorResponse");
var util = require("../util/util");
var log4jHandler = require('../log4j/Log4jHandler');

var getPlateCoating = () => {
  return new Promise((resolve, reject) => {
    sql.selectPlateCoating().then((plateCoating) => {
      resolve(LovResponse.lov('plateCoating', plateCoating))
    }).catch((err) => {
      log4jHandler.error(err)
      reject(ErrorResponse.error(util.orEC, "select plate coating fail"))
    })
  })
}

var getPlateCoatingByPage = (index, offset, value) => {
  return new Promise((resolve, reject) => {
    let rows = (index - 1) * offset;
    if(isNaN(rows) || isNaN(offset)) {
      reject(ErrorResponse.error(util.CC, "index and offset are required, and type must be number"))
    } else {
      sql.selectPlateCoatingByPage(rows, offset, value).then((plateCoating) => {
        resolve(LovPageResponse.lovPage('plateCoating', index, plateCoating[1], plateCoating[0]))
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orCEC, "select plate coating by page fail"))
      })
    }
  })
}

var editPlateCoating = (plateCoating, user) => {
  return new Promise((resolve, reject) => {
    if(!plateCoating.key) {
      reject(ErrorResponse.error(util.CC, "Plate Coating key is required"))
    } else {
      var id = plateCoating.key.toString().replace(/\s+/g,"");
      var value = plateCoating.value;
      if(!value) {
        reject(ErrorResponse.error(util.CC, "Plate Coating value is required"))
      } else {
        sql.updatePlateCoating(id, value, user).then((edit) => {
          if(edit.affectedRows == 1) {
            resolve(SuccessResponse.edit())
          } else {
            reject(ErrorResponse.error(util.orCEC, "update Plate Coating with wrong Rows: " + edit.affectedRows))
          }
        }).catch((err) => {
          log4jHandler.error(err)
          if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
            reject(ErrorResponse.error(util.orEC, "This plate coating value is already exist"))
          } else {
            reject(ErrorResponse.error(util.orEC, "update plate coating fail"))
          }
        })
      }
    }
  })
}

var addPlateCoating = (plateCoating, user) => {
  return new Promise((resolve, reject) => {
    var value = plateCoating.value;
    if(!value) {
      reject(ErrorResponse.error(util.CC, "Plate Coating value is required"))
    } else {
      sql.insertPlateCoating(value, user).then((add) => {
        if(add.affectedRows == 1) {
          resolve(SuccessResponse.add())
        } else {
          reject(ErrorResponse.error(util.orCEC, "Insert Plate Coating with wrong Rows: " + add.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
          reject(ErrorResponse.error(util.orEC, "This plate coating value is already exist"))
        } else {
          reject(ErrorResponse.error(util.orEC, "Insert plate coating fail"))
        }
      })
    }
  })
}

var removePlateCoating = (id) => {
  return new Promise((resolve, reject) => {
    if(!id) {
      reject(ErrorResponse.error(util.CC, "Plate Coating key is required"))
    } else {
      id = id.replace(/\s+/g,"");
      sql.deletePlateCoating(id).then((remove) => {
        if(remove.affectedRows == 1) {
          resolve(SuccessResponse.remove())
        } else {
          reject(ErrorResponse.error(util.orCEC, "delete Plate Coating with wrong Rows: " + remove.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "delete plate coating fail"))
      })
    }
  })
}

module.exports = {
  getPlateCoating: getPlateCoating,
  getPlateCoatingByPage: getPlateCoatingByPage,
  editPlateCoating: editPlateCoating,
  addPlateCoating: addPlateCoating,
  removePlateCoating: removePlateCoating
}