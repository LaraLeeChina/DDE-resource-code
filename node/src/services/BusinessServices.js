var sql = require("../db/sql/BusinessSql");
var LovResponse = require("../body/response/LovResponse");
var LovPageResponse = require("../body/response/LovPageResponse");
var ErrorResponse = require("../body/response/ErrorResponse");
var SuccessResponse = require("../body/response/SuccessResponse");
var util = require("../util/util");
var log4jHandler = require('../log4j/Log4jHandler');

var getBusiness = () => {
  return new Promise((resolve, reject) => {
    sql.selectBusiness().then((business) => {
      resolve(LovResponse.lov('business', business))
    }).catch((err) => {
      log4jHandler.error(err)
      reject(ErrorResponse.error(util.orEC, "select business fail"))
    })
  })
}

var getBusinessByPage = (index, offset, value) => {
  return new Promise((resolve, reject) => {
    let rows = (index - 1) * offset;
    if(isNaN(rows) || isNaN(offset)) {
      reject(ErrorResponse.error(util.CC, "index and offset are required, and type must be number"))
    } else {
      sql.selectBusinessByPage(rows, offset, value).then((business) => {
        resolve(LovPageResponse.lovPage('business', index, business[1], business[0]))
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "select business by page fail"))
      })
    }
  })
}

var editBusiness = (business, user) => {
  return new Promise((resolve, reject) => {
    if(!business.key) {
      reject(ErrorResponse.error(util.CC, "business key is required"))
    } else {
      if(!business.value) {
        reject(ErrorResponse.error(util.CC, "business value is required"))
      } else {
        var id = business.key.toString().replace(/\s+/g,"");
        sql.updateBusiness(id, business.value, user).then((edit) => {
          if(edit.affectedRows == 1) {
            resolve(SuccessResponse.edit())
          } else {
            reject(ErrorResponse.error(util.orCEC, "update business with wrong Rows: " + edit.affectedRows))
          }
        }).catch((err) => {
          log4jHandler.error(err)
          if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
            reject(ErrorResponse.error(util.orEC, "This business value is already exist"))
          } else {
            reject(ErrorResponse.error(util.orEC, "update business fail"))
          }
        })
      }
    }
  })
}

var addBusiness = (business, user) => {
  return new Promise((resolve, reject) => {
    if(!business) {
      reject(ErrorResponse.error(util.CC, "Business value is required"))
    } else {
      sql.insertBusiness(business, user).then((add) => {
        if(add.affectedRows == 1) {
          resolve(SuccessResponse.add())
        } else {
          reject(ErrorResponse.error(util.orCEC, "insert Business with wrong Rows: " + add.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
          reject(ErrorResponse.error(util.orEC, "This Business value is already exist"))
        } else {
          reject(ErrorResponse.error(util.orEC, "insert Business fail"))
        }
      })
    }
  })
}

var removeBusiness = (id) => {
  return new Promise((resolve, reject) => {
    if(!id) {
        reject(ErrorResponse.error(util.CC, "Business key is required"))
      } else {
        id = id.replace(/\s+/g,"");
        sql.deleteBusiness(id).then((remove) => {
          if(remove.affectedRows == 1) {
            resolve(SuccessResponse.remove())
          } else {
            reject(ErrorResponse.error(util.orCEC, "delete Business with wrong Rows: " + remove.affectedRows))
          }
        }).catch((err) => {
          log4jHandler.error(err)
          reject(ErrorResponse.error(util.orEC, "delete Business fail"))
        })
      }
  })
}

module.exports = {
  getBusiness: getBusiness,
  getBusinessByPage: getBusinessByPage,
  editBusiness: editBusiness,
  addBusiness: addBusiness,
  removeBusiness: removeBusiness
}