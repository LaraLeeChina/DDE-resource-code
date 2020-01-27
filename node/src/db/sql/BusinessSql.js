var connection = require("../connection");
var util = require("../../util/util");

var selectBusiness = () => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT business_id, business_value FROM business ORDER BY business_value;`;
    connection.execute(sql, 'selectBusiness').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var selectBusinessByPage = (rows, offset, value) => {
  return new Promise((resolve, reject) => {
    let filterSql = ``
    if(value) {
      filterSql = `WHERE business_value LIKE '%${value}%'`
    }
    let sql = `SELECT business_id, business_value FROM business ` + filterSql + ` ORDER BY business_value LIMIT ${rows}, ${offset};`
        + `SELECT COUNT(*) AS total FROM business ` + filterSql + `;`
    connection.execute(sql, 'selectBusinessByPage').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var updateBusiness = (id, business, user) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE business SET business_value = '${business}', business_cu_date = '${util.formatCuDate(new Date())}', business_cu_user = '${user}' WHERE business_id = ${id};`
    connection.execute(sql, 'updateBusiness').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });  
  })
}

var insertBusiness = (business, user) => {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO business(business_id, business_value, business_cu_date, business_cu_user) VALUES(NULL, '${business}', '${util.formatCuDate(new Date())}', '${user}');`
    connection.execute(sql, 'insertBusiness').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });    
  })
}

var deleteBusiness = (id) => {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM business WHERE business_id = ${id};`
    connection.execute(sql, 'deleteBusiness').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

module.exports = {
  selectBusiness: selectBusiness,
  selectBusinessByPage: selectBusinessByPage,
  updateBusiness: updateBusiness,
  insertBusiness: insertBusiness,
  deleteBusiness: deleteBusiness
}