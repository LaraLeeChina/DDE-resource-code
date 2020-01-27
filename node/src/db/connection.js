var log4jHandler = require('../log4j/Log4jHandler');

const mysql = require('mysql');

let pool = mysql.createPool({
    host : '101.133.167.102',
    port: '3306',
    user : 'root', 
    password : 'Mysql@647',
    database : 'AgilentDDE',
    multipleStatements: true
});

var execute = (sql, method) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if(err) {
        log4jHandler.error(method + " error: " + err.message)
        reject(err);
      } else {
        connection.query(sql, (error, response) => {
          log4jHandler.info(method + " sql: " + sql)
          if(error) {    
            log4jHandler.error(method + " error: " + error.message)
            reject(error);
          } else {
            resolve(JSON.parse(JSON.stringify(response)));
          };
          connection.release();
        })
      }
    })
  })
}

var trans = (sql, method) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if(err) {
        log4jHandler.error(method + " error: " + err.message)
        reject(err);
      } else {
        connection.beginTransaction((terr) => {
          if(terr) {
            connection.release();
            log4jHandler.error(method + " error: " + terr.message)
            reject(terr);
          } else {   
            log4jHandler.info(method + " sql: " + sql)    
            if(method == 'importBasePublication') {
              for(let i = 0; i < sql.length; i++) {
                var errResponse = new Array()
                connection.query(sql[i].sql, (error, response) => {
                  if(error && error.code != 'ER_DUP_ENTRY') {
                    connection.rollback(() => {
                      connection.release();
                      log4jHandler.error(method + " error: " + error.message)
                      reject(error);
                    }) 
                  } else {
                    if(error) {
                      errResponse.push(sql[i].link)
                    }
                    if(i == sql.length - 1) {
                      connection.commit((cerror) => {
                        if(cerror) {
                          log4jHandler.error(method + " error: " + cerror.message)
                          reject(cerror);
                        } else {
                          log4jHandler.info(method + " result: " + JSON.stringify(response))
                          resolve(errResponse)
                        }
                        connection.release();
                      })
                    } 
                  };
                })
              }
            } else {
              connection.query(sql, (error, response) => {
                if(error) {
                  connection.rollback(() => {
                    connection.release();
                    log4jHandler.error(method + " error: " + error.message)
                    reject(error);
                  }) 
                } else {
                  connection.commit((cerror) => {
                    if(cerror) {
                      log4jHandler.error(method + " error: " + cerror.message)
                      reject(cerror);
                    } else {
                      log4jHandler.info(method + " result: " + JSON.stringify(response))
                      if(!response) {
                        resolve()
                      } else {
                        resolve(JSON.parse(JSON.stringify(response)));
                      }
                    }
                    connection.release();
                  })
                };
              })
            }
          }
        })
      }
    })
  })
}

module.exports = {
  execute: execute,
  trans: trans
}