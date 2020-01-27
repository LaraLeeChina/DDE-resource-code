var sql = require("../db/sql/AssaySql");
var LovResponse = require("../body/response/LovResponse");
var LovPageResponse = require("../body/response/LovPageResponse");
var SuccessResponse = require("../body/response/SuccessResponse");
var ErrorResponse = require("../body/response/ErrorResponse");
var util = require("../util/util");
var log4jHanlder = require("../log4j/Log4jHandler");

var getAssay = (product) => {
  return new Promise((resolve, reject) => {
    if(!product || JSON.parse(product).length == 0) {
      resolve(new Array())
    } else {
      sql.selectAssay(JSON.parse(product)).then((assay) => {
        resolve(LovResponse.lov('assay', assay))
      }).catch((err) => {
        log4jHanlder.error(err)
        reject(ErrorResponse.error(util.orEC, "select assay fail"))
      })
    }
  })
}

var getAssayForPnsProduct = () => {
  return new Promise((resolve, reject) => {
    sql.selectAssayForPnsProduct().then((assay) => {
      resolve(LovResponse.lov('assayForPnsProduct', assay))
    }).catch((err) => {
      log4jHanlder.error(err)
      reject(ErrorResponse.error(util.orEC, "select assay for pns product fail"))
    })
  })
}

var getAssayByBusinessByPage = (index, offset, value, exportValue, business) => {
  return new Promise((resolve, reject) => {
    let rows = (index - 1) * offset;
    if(isNaN(rows) || isNaN(offset)) {
      reject(ErrorResponse.error(util.CC, "index and offset are required, and type must be number"))
    } else {
      sql.selectAssayByBusinessByPage(rows, offset, value, exportValue, business).then((assay) => {  
        resolve(LovPageResponse.lovPage('assayByBusiness', index, assay[1], assay[0]))
      }).catch((err) => {
        log4jHanlder.error(err)
        reject(ErrorResponse.error(util.orEC, "select assay by business by page fail"))
      })
    }
  })
}

var getAssayPnsByProductByPage = (index, offset, value, product, part) => {
  return new Promise((resolve, reject) => {
    let rows = (index - 1) * offset;
    if(isNaN(rows) || isNaN(offset)) {
      reject(ErrorResponse.error(util.CC, "index and offset are required, and type must be number"))
    } else {
      sql.selectAssayPnsByProductByPage(rows, offset, value, product, part).then((assay) => {  
        resolve(LovPageResponse.lovPage('assayPnsByProduct', index, assay[1], assay[0]))
      }).catch((err) => {
        log4jHanlder.error(err)
        reject(ErrorResponse.error(util.orEC, "select assay pns by product by page fail"))
      })
    }
  })
}

var editAssayByBusiness = (assay, user) => {
  return new Promise((resolve, reject) => {
    if(!assay.id) {
      reject(ErrorResponse.error(util.CC, "assay by business id is required"))
    }else {
      var id = assay.id.toString().replace(/\s+/g,"")
      if(!assay.value || !assay.exportValue || !assay.business) {
        reject(ErrorResponse.error(util.orCC, "assay value, export link and mapped business are required"))
      } else {
        sql.validateAssayByBusiness(assay.value, assay.exportValue, assay.business).then((validate) => {
          if(validate[0].total == 0) {
            sql.updateAassayByBusiness(id, assay.value, assay.exportValue, assay.business, user).then((edit) => {
              if(edit.affectedRows == 1) {
                resolve(SuccessResponse.edit())
              } else {
                reject(ErrorResponse.error(util.orCEC, "update assay by business with wrong Rows: " + edit.affectedRows))
              }
            }).catch((err) => {
              log4jHanlder.error(err)
              reject(ErrorResponse.error(util.orEC, "update assay by business fail"))
            })
          } else {
            reject(ErrorResponse.error(util.orCEC, "This assay value, export link and mapped business is already exist"))
          }
        }).catch((err) => {
          log4jHanlder.error(err)
          reject(ErrorResponse.error(util.orEC, "validate assay by business fail"))
        })
      }
    }
  })
}

var editAssayPnsByProduct = (assay, user) => {
  return new Promise((resolve, reject) => {
    if(!assay.id) {
      reject(ErrorResponse.error(util.CC, "assay pns by product id is required"))
    }else {
      var id = assay.id.toString().replace(/\s+/g,"")
      if(!assay.value || !assay.product) {
        reject(ErrorResponse.error(util.orCC, "assay value and mapped product are required"))
      } else {
        sql.validateAssayPnsByProduct(assay.value, assay.product, assay.part).then((validate) => {
          if(validate[0].total == 0) {
            sql.updateAssayPnsByProduct(id, assay.value, assay.product, assay.part, user).then((edit) => {
              if(edit.affectedRows == 1) {
                resolve(SuccessResponse.edit())
              } else {
                reject(ErrorResponse.error(util.orCEC, "update assay pns by product with wrong Rows: " + edit.affectedRows))
              }
            }).catch((err) => {
              log4jHanlder.error(err)
              reject(ErrorResponse.error(util.orEC, "update assay pns by product fail"))
            })
          } else {
            reject(ErrorResponse.error(util.orCEC, "This assay value and mapped product and part is already exist"))
          }
        }).catch((err) => {
          log4jHanlder.error(err)
          reject(ErrorResponse.error(util.orEC, "validate assay pns by product fail"))
        })
      }
    }
  })
}

var addAssayByBusiness = (assay, user) => {
  return new Promise((resolve, reject) => {
    if(!assay.value || !assay.exportValue || !assay.business) {
      reject(ErrorResponse.error(util.orCC, "assay value, export link and business is required"))
    } else {
      sql.validateAssayByBusiness(assay.value, assay.exportValue, assay.business).then((validate) => {
        if(validate[0].total == 0) {
          sql.insertAssayByBusiness(assay.value, assay.exportValue, assay.business, user).then((add) => {
            if(add.affectedRows == 1) {
              resolve(SuccessResponse.add())
            } else {
              reject(ErrorResponse.error(util.orCEC, "insert assay by business with wrong Rows: " + add.affectedRows))
            }
          }).catch((err) => {
            log4jHanlder.error(err)
            reject(ErrorResponse.error(util.orEC, "insert assay by business fail"))
          })
        } else {
          reject(ErrorResponse.error(util.orCEC, "This assay value, export link and mapped business is already exist"))
        }
      }).catch((err) => {
        log4jHanlder.error(err)
        reject(ErrorResponse.error(util.orEC, "validate assay by business fail"))
      })
    }
  })
}

var addAssayPnsByProduct = (assay, user) => {
  return new Promise((resolve, reject) => {
    if(!assay.value || !assay.product) {
      reject(ErrorResponse.error(util.orCC, "assay value and mapped product is required"))
    } else {
      sql.validateAssayPnsByProduct(assay.value, assay.product, assay.part).then((validate) => {
        if(validate[0].total == 0) {
          sql.insertAssayPnsByProduct(assay.value, assay.product, assay.part, user).then((add) => {
            if(add.affectedRows == 1) {
              resolve(SuccessResponse.add())
            } else {
              reject(ErrorResponse.error(util.orCEC, "insert assay pns by product with wrong Rows: " + add.affectedRows))
            }
          }).catch((err) => {
            log4jHanlder.error(err)
            reject(ErrorResponse.error(util.orEC, "insert assay pns by product fail"))
          })
        } else {
          reject(ErrorResponse.error(util.orCEC, "This assay value and mapped product and part is already exist"))
        }
      }).catch((err) => {
        log4jHanlder.error(err)
        reject(ErrorResponse.error(util.orEC, "validate assay pns by product fail"))
      })
    }
  })
}

var removeAssayByBusiness = (id) => {
  return new Promise((resolve, reject) => {
    if(!id) {
      reject(ErrorResponse.error(util.orCC, "assay by business id is required"))
    } else {
      id = id.replace(/\s+/g,"")
      sql.deleteAssayByBusiness(id).then((remove) => {
        if(remove.affectedRows == 1) {
          resolve(SuccessResponse.remove())
        } else {
          reject(ErrorResponse.error(util.orCEC, "delete assay by business with wrong Rows: " + remove.affectedRows))
        }
      }).catch((err) => {
        log4jHanlder.error(err)
        reject(ErrorResponse.error(util.orEC, "delete assay by business fail"))
      })
    }
  })
}

var removeAssayPnsByProduct = (id) => {
  return new Promise((resolve, reject) => {
    if(!id) {
      reject(ErrorResponse.error(util.orCC, "assay pns by product id is required"))
    } else {
      id = id.replace(/\s+/g,"")
      sql.deleteAssayPnsByProduct(id).then((remove) => {
        if(remove.affectedRows == 1) {
          resolve(SuccessResponse.remove())
        } else {
          reject(ErrorResponse.error(util.orCEC, "delete assay pns by product with wrong Rows: " + remove.affectedRows))
        }
      }).catch((err) => {
        log4jHanlder.error(err)
        reject(ErrorResponse.error(util.orEC, "delete assay pns by product fail"))
      })
    }
  })
}

module.exports = {
  getAssay: getAssay,
  getAssayForPnsProduct: getAssayForPnsProduct,
  getAssayByBusinessByPage: getAssayByBusinessByPage,
  getAssayPnsByProductByPage: getAssayPnsByProductByPage,
  editAssayByBusiness: editAssayByBusiness,
  editAssayPnsByProduct: editAssayPnsByProduct,
  addAssayByBusiness: addAssayByBusiness,
  addAssayPnsByProduct: addAssayPnsByProduct,
  removeAssayByBusiness: removeAssayByBusiness,
  removeAssayPnsByProduct: removeAssayPnsByProduct
}