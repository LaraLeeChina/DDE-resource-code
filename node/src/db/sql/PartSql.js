var connection = require("../connection");
var util = require("../../util/util");

var selectPart = (product, assay) => {
  return new Promise((resolve, reject) => {
    var sql
    if(product != "all" && assay != "all") {
      product = JSON.parse(product)
      assay = JSON.parse(assay)
      sql = `SELECT part.part_id, part.part_value FROM (SELECT DISTINCT assay_pns_by_product_part_fk AS part_value FROM assay_pns_by_product WHERE (`
      for(let i = 0; i < product.length; i++) {
        if(i == product.length - 1) {
          sql = sql + `assay_pns_by_product_fk = '${product[i]}')`
        } else {
          sql = sql + `assay_pns_by_product_fk = '${product[i]}' OR `
        }
      }
      sql = sql + ` AND (`
      for(let i = 0; i < assay.length; i++) {
        if(i == assay.length - 1) {
          sql = sql + `assay_pns_by_product_value = '${assay[i]}')`
        } else {
          sql = sql + `assay_pns_by_product_value = '${assay[i]}' OR `
        }
      }
      sql = sql + " ORDER BY assay_pns_by_product_part_fk)a, part WHERE a.part_value = part.part_value;"
    } else {
      sql = `SELECT part_id, part_value FROM part ORDER BY part_value;`
    }
    connection.execute(sql, 'selectPart').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var selectPartByPage = (rows, offset, value) => {
  return new Promise((resolve, reject) => {
    let filterSql = ``
    if(value) {
      filterSql = `WHERE part_value LIKE '%${value}%'`
    }
    let sql = `SELECT part_id, part_value FROM part ` + filterSql + ` ORDER BY part_value LIMIT ${rows}, ${offset};`
        + `SELECT COUNT(*) AS total FROM part ` + filterSql + `;`
    connection.execute(sql, 'selectPartByPage').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var updatePart = (id, value, user) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE part SET part_value = '${value}', part_cu_date = '${util.formatCuDate(new Date())}', part_cu_user = '${user}' WHERE part_id = ${id};`
    connection.execute(sql, 'updatePart').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var insertPart = (value, user) => {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO part(part_id, part_value, part_cu_date, part_cu_user) VALUES (NULL, '${value}', '${util.formatCuDate(new Date())}', '${user}');`
    connection.execute(sql, 'insertPart').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var deletePart = (id) => {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM part WHERE part_id = ${id};`
    connection.execute(sql, 'deletePart').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

module.exports = {
  selectPart: selectPart,
  selectPartByPage: selectPartByPage,
  updatePart: updatePart,
  insertPart: insertPart,
  deletePart: deletePart
}