var connection = require("../connection");
var util = require("../../util/util");

var selectProduct = (platform, action) => {
  return new Promise((resolve, reject) => {
    var sql
    if(action == "all") {
      sql = `SELECT DISTINCT product_value FROM product ORDER BY product_value = 'Not Specified' DESC, product_value;`
    } else {
      sql = `SELECT DISTINCT product_value FROM product WHERE platform_fk = '${platform}' ORDER BY product_value = 'Not Specified' DESC, product_value;`
    }
    connection.execute(sql, 'selectProduct').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var selectProductByBusiness = (business) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT DISTINCT product_value FROM (SELECT * FROM product LEFT JOIN platform ON product.platform_fk = platform.platform_value)p WHERE p.platform_business_fk = '${business}';`
    connection.execute(sql, 'selectProductByProduct').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var selectProductByPage = (rows, offset, value, exportValue, platform) => {
  let filterSql = ``
  if(value) {
    filterSql = filterSql + `product_value LIKE '%${value}%' AND `
  }
  if(exportValue) {
    filterSql = filterSql + `product_export_value LIKE '%${exportValue}%' AND `
  }
  if(platform) {
    filterSql = filterSql + `platform_fk LIKE '%${platform}%' AND `
  }
  return new Promise((resolve, reject) => {
    let sql = `SELECT product_id, product_value, product_export_value, platform_fk FROM product WHERE ` + filterSql + ` 1=1 ORDER BY product_value LIMIT ${rows}, ${offset};`
        + `SELECT COUNT(*) AS total FROM product WHERE ` + filterSql + ` 1=1;`
    connection.execute(sql, 'selectProductByPage').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })    
}

var validateProduct = (value, exportValue, platform) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) AS total FROM product WHERE product_value = '${value}' AND platform_fk = '${platform}' AND product_export_value = '${exportValue}';`
    connection.execute(sql, 'validateProduct').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var updateProduct = (id, value, exportValue, platform, user) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE product SET product_value = '${value}', product_export_value = '${exportValue}', platform_fk = '${platform}', product_cu_date = '${util.formatCuDate(new Date())}', product_cu_user = '${user}' WHERE product_id = ${id};`
    connection.execute(sql, 'updateProduct').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })  
}

var insertProduct = (value, exportValue, platform, user) => {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO product(product_id, product_value, product_export_value, platform_fk, product_cu_date, product_cu_user) VALUES (NULL, '${value}', '${exportValue}', '${platform}', '${util.formatCuDate(new Date())}', '${user}');`
    connection.execute(sql, 'insertProduct').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM product WHERE product_id = ${id};`
    connection.execute(sql, 'deleteProduct').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var selectProductExportValue = () => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT product_value, product_export_value, platform_fk FROM product;`
    connection.execute(sql, 'selectProductExportValue').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    }); 
  })
}



module.exports = {
  selectProduct: selectProduct,
  selectProductByBusiness: selectProductByBusiness,
  selectProductByPage: selectProductByPage,
  validateProduct: validateProduct,
  updateProduct: updateProduct,
  insertProduct: insertProduct,
  deleteProduct: deleteProduct,
  selectProductExportValue: selectProductExportValue
}