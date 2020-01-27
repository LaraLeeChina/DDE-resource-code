var sql = require("../db/sql/ProductSql");
var LovResponse = require("../body/response/LovResponse");
var LovPageResponse = require("../body/response/LovPageResponse");
var SuccessResponse = require("../body/response/SuccessResponse");
var ErrorResponse = require("../body/response/ErrorResponse");
var util = require("../util/util");
var log4jHandler = require("../log4j/Log4jHandler");

var getProduct = (platform, action) => {
  return new Promise((resolve, reject) => {
    if(platform && action) {
      reject(ErrorResponse.error(util.CC, "Accept only one parameter"))
    } else {
      if(!platform && !action) {
        resolve(new Array())
      } else {
        sql.selectProduct(platform, action).then((product) => {
          resolve(LovResponse.lov('product', product))
        }).catch((err) => {
          log4jHandler.error(err)
          reject(ErrorResponse.error(util.orEC, "select product fail"))
        })
      }
    }
  })
}

var getProductByBusiness = (business) => {
  return new Promise((resolve, reject) => {
    if(!business) {
      reject(ErrorResponse.error(util.CC, "business is required"))
    } else {
      sql.selectProductByBusiness(business).then((product) => {
        resolve(LovResponse.lov('product', product))
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "select product by business fail"))
      })
    }
  })
}

var getProductByPage = (index, offset, value, exportValue, platform) => {
  return new Promise((resolve, reject) => {
    let rows = (index - 1) * offset;
    if(isNaN(rows) || isNaN(offset)) {
      reject(ErrorResponse.error(util.CC, "index and offset are required, and type must be number"))
    } else {
      sql.selectProductByPage(rows, offset, value, exportValue, platform).then((product) => {
        resolve(LovPageResponse.lovPage('product', index, product[1], product[0]))
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "select product by page fail"))
      })
    }
  })
}

var editProduct = (product, user) => {
  return new Promise((resolve, reject) => {
    if(!product.id) {
      reject(ErrorResponse.error(util.CC, "product id is required"))
    } else {
      var id = product.id.toString().replace(/\s+/g,"")
      if(!product.value || !product.exportValue || !product.platform) {
        reject(ErrorResponse.error(util.orCC, "product value, exportValue and platform are required"))
      } else {
        sql.validateProduct(product.value, product.exportValue, product.platform).then((validate) => {
          if(validate[0].total == 0) {
            sql.updateProduct(id, product.value, product.exportValue, product.platform, user).then((edit) => {
              if(edit.affectedRows == 1) {
                resolve(SuccessResponse.edit())
              } else {
                reject(ErrorResponse.error(util.orCEC, "update Product with wrong Rows: " + edit.affectedRows))
              }
            }).catch((err) => {
              log4jHandler.error(err)
              reject(ErrorResponse.error(util.orEC, "update product fail"))
            })
          } else {
            reject(ErrorResponse.error(util.orCEC, "This product value and mapped plateform is already exist"))
          }
        }).catch((err) => {
          log4jHandler.error(err)
          reject(ErrorResponse.error(util.orEC, "validate product fail"))
        })
      }
    }
  })
}

var addProduct = (product, user) => {
  return new Promise((resolve, reject) => {
    if(!product.value || !product.exportValue || !product.platform) {
      reject(ErrorResponse.error(util.orCC, "product value, exportValue and platform is required"))
    } else {
      sql.validateProduct(product.value, product.exportValue, product.platform).then((validate) => {
        if(validate[0].total == 0) {
          sql.insertProduct(product.value, product.exportValue, product.platform, user).then((add) => {
            if(add.affectedRows == 1) {
              resolve(SuccessResponse.add())
            } else {
              reject(ErrorResponse.error(util.orCEC, "insert product with wrong Rows: " + add.affectedRows))
            }
          }).catch((err) => {
            log4jHandler.error(err)
            reject(ErrorResponse.error(util.orEC, "insert product fail"))
          })
        } else {
          reject(ErrorResponse.error(util.orCEC, "This product value and mapped plateform is already exist"))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "validate product fail"))
      })
    }
  })
}

var removeProduct = (id) => {
  return new Promise((resolve, reject) => {
    if(!id) {
      reject(ErrorResponse.error(util.orCC, "product id is required"))
    } else {
      id = id.replace(/\s+/g,"")
      sql.deleteProduct(id).then((remove) => {
        if(remove.affectedRows == 1) {
          resolve(SuccessResponse.remove())
        } else {
          reject(ErrorResponse.error(util.orCEC, "delete product with wrong Rows: " + remove.affectedRows))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "delete product fail"))
      })
    }
  })
}

module.exports = {
  getProduct: getProduct,
  getProductByBusiness: getProductByBusiness,
  getProductByPage: getProductByPage,
  editProduct: editProduct,
  addProduct: addProduct,
  removeProduct: removeProduct
}