var sql = require("../db/sql/SpeciesSql");
var LovResponse = require("../body/response/LovResponse");
var LovPageResponse = require("../body/response/LovPageResponse");
var ErrorResponse = require("../body/response/ErrorResponse");
var SuccessResponse = require("../body/response/SuccessResponse");
var util = require("../util/util");
var log4jHandler = require('../log4j/Log4jHandler');

var getSpecies = () => {
  return new Promise((resolve, reject) => {
    sql.selectSpecies().then((species) => {
      resolve(LovResponse.lov('species', species))
    }).catch((err) => {
      log4jHandler.error(err)
      reject(ErrorResponse.error(util.orEC, "select species fail"))
    })
  })
}

var getSpeciesByPage = (index, offset, value) => {
  return new Promise((resolve, reject) => {
    let rows = (index - 1) * offset;
    if(isNaN(rows) || isNaN(offset)) {
      reject(ErrorResponse.error(util.CC, "index and offset are required, and type must be number"))
    } else {
      sql.selectSpeciesByPage(rows, offset, value).then((species) => {
        resolve(LovPageResponse.lovPage('species', index, species[1], species[0]))
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "select species by page fail"))
      })
    }
  })
}

var editSpecies = (species, user) => {
  return new Promise((resolve, reject) => {
    if(!species.key) {
      reject(ErrorResponse.error(util.CC, "Species key is required"))
    } else {
      var id = species.key.toString().replace(/\s+/g,"");
      var value = species.value;
      if(!value) {
        reject(ErrorResponse.error(util.CC, "Species value is required"))
      } else {
        sql.updateSpecies(id, value, user).then((edit) => {
          if(edit.affectedRows == 1) {
            resolve(SuccessResponse.edit())
          } else {
            reject(ErrorResponse.error(util.orCEC, "update species with wrong Rows: " + edit.affectedRows))
          }
        }).catch((err) => {
          log4jHandler.error(err)
          if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
            reject(ErrorResponse.error(util.orEC, "This species value is already exist"))
          } else {
            reject(ErrorResponse.error(util.orEC, "update Species fail"))
          }
        })
      }
    }
  })  
}

var addSpecies = (species, user) => {
  return new Promise((resolve, reject) => {
    if(!species) {
      reject(ErrorResponse.error(util.CC, "Species value is required"))
    } else {
      sql.insertSpecies(species, user).then((add) => {
        if(add.affectedRows == 1) {
          resolve(SuccessResponse.add())
        } else {
          reject(ErrorResponse.error(util.orCEC, "insert Species with wrong Rows: " + add.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
          reject(ErrorResponse.error(util.orEC, "This species value is already exist"))
        } else {
          reject(ErrorResponse.error(util.orEC, "insert species fail"))
        }
      })
    }
  })    
}

var removeSpecies = (id) => {
  return new Promise((resolve, reject) => {
    if(!id) {
      reject(ErrorResponse.error(util.CC, "Species key is required"))
    } else {
      id = id.replace(/\s+/g,"");
      sql.deleteSpecies(id).then((remove) => {
        if(remove.affectedRows == 1) {
          resolve(SuccessResponse.remove())
        } else {
          reject(ErrorResponse.error(util.orCEC, "delete Species with wrong Rows: " + remove.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "delete species fail"))
      })
    }
  })    
}


module.exports = {
  getSpecies: getSpecies,
  getSpeciesByPage: getSpeciesByPage,
  editSpecies: editSpecies,
  addSpecies: addSpecies,
  removeSpecies: removeSpecies
}