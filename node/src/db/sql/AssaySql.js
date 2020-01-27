var connection = require("../connection");
var util = require("../../util/util");

var selectAssay = (product) => {
  return new Promise((resolve, reject) => {
    var sql = `SELECT MIN(assay_pns_by_product_id) AS id, assay_pns_by_product_value FROM (SELECT DISTINCT assay_pns_by_product_id, assay_pns_by_product_value FROM assay_pns_by_product WHERE `
    for(let i = 0; i < product.length; i++) {
      if(i == product.length - 1) {
        sql = sql + `assay_pns_by_product_fk = '${product[i]}'`
      } else {
        sql = sql + `assay_pns_by_product_fk = '${product[i]}' OR `
      }
    }
    sql = sql + ` )a GROUP BY assay_pns_by_product_value ORDER BY assay_pns_by_product_value = 'Not Specified' DESC, assay_pns_by_product_value;`
    connection.execute(sql, 'selectAssay').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var selectAssayForPnsProduct = () => {
  return new Promise((resolve, reject) => {
    var sql = `SELECT DISTINCT assay_by_business_value FROM assay_by_business ORDER BY assay_by_business_value = 'Not Specified' DESC, assay_by_business_value;`
    connection.execute(sql, 'selectAssayForPnsProduct').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
    
  })
}

var selectAssayByBusinessByPage = (rows, offset, value, exportValue, business) => {
  return new Promise((resolve, reject) => {
    let filterSql = ``
    if(value) {
      filterSql = filterSql + `assay_by_business_value LIKE '%${value}%' AND `
    }
    if(exportValue) {
      filterSql = filterSql + `assay_by_business_export_value LIKE '%${exportValue}%' AND `
    }
    if(business) {
      filterSql = filterSql + `assay_by_business_fk LIKE '%${business}%' AND `
    }
    let sql = `SELECT assay_by_business_id, assay_by_business_value, assay_by_business_export_value, assay_by_business_fk FROM assay_by_business WHERE ` + filterSql + ` 1=1 ORDER BY assay_by_business_value LIMIT ${rows}, ${offset};`
        + `SELECT COUNT(*) AS total FROM assay_by_business WHERE ` + filterSql + ` 1=1;`
    connection.execute(sql, 'selectAssayByBusinessByPage').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var selectAssayPnsByProductByPage = (rows, offset, value, product, part) => {
  return new Promise((resolve, reject) => {
    let filterSql = ``
    if(value) {
      filterSql = filterSql + `assay_pns_by_product_value LIKE '%${value}%' AND `
    }
    if(product) {
      filterSql = filterSql + `assay_pns_by_product_fk LIKE '%${product}%' AND `
    }
    if(part) {
      filterSql = filterSql + `assay_pns_by_product_part_fk LIKE '%${part}%' AND `
    }
    let sql = `SELECT assay_pns_by_product_id, assay_pns_by_product_value, assay_pns_by_product_fk, assay_pns_by_product_part_fk FROM assay_pns_by_product WHERE ` + filterSql + ` 1=1 ORDER BY assay_pns_by_product_value LIMIT ${rows}, ${offset};`
    + `SELECT COUNT(*) AS total FROM assay_pns_by_product WHERE ` + filterSql + ` 1=1;`
    connection.execute(sql, 'selectAssayPnsByProductByPage').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var validateAssayByBusiness = (value, exportValue, business) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) AS total FROM assay_by_business WHERE assay_by_business_value = '${value}' AND assay_by_business_export_value = '${exportValue}' AND assay_by_business_fk = '${business}';`
    connection.execute(sql, 'validateAssayByBusiness').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var validateAssayPnsByProduct = (value, product, part) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) AS total FROM assay_pns_by_product WHERE assay_pns_by_product_value = '${value}' AND assay_pns_by_product_fk = '${product}' AND assay_pns_by_product_part_fk ` + (part ? ` = '${part}'` : `IS NULL`) + `;`
    connection.execute(sql, 'validateAssayPnsByProduct').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var updateAassayByBusiness = (id, value, exportValue, business, user) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE assay_by_business SET assay_by_business_value = '${value}', assay_by_business_export_value = '${exportValue}', assay_by_business_fk = '${business}', assay_by_business_cu_date = '${util.formatCuDate(new Date())}', assay_by_business_cu_user = '${user}' WHERE assay_by_business_id = ${id};`
    connection.execute(sql, 'updateAassayByBusiness').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var updateAssayPnsByProduct = (id, value, product, part, user) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE assay_pns_by_product SET assay_pns_by_product_value = '${value}', assay_pns_by_product_fk = '${product}', assay_pns_by_product_part_fk = ` + (part ? `'${part}'` : `NULL`) + `, assay_pns_by_product_cu_date = '${util.formatCuDate(new Date())}', assay_pns_by_product_cu_user = '${user}' WHERE assay_pns_by_product_id = ${id};`
    connection.execute(sql, 'updateAssayPnsByProduct').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var insertAssayByBusiness = (value, exportValue, business, user) => {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO assay_by_business(assay_by_business_id, assay_by_business_value, assay_by_business_export_value, assay_by_business_fk, assay_by_business_cu_date, assay_by_business_cu_user) VALUES (NULL, '${value}', '${exportValue}', '${business}', '${util.formatCuDate(new Date())}', '${user}');`
    connection.execute(sql, 'insertAssayByBusiness').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var insertAssayPnsByProduct = (value, product, part, user) => {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO assay_pns_by_product(assay_pns_by_product_id, assay_pns_by_product_value, assay_pns_by_product_fk, assay_pns_by_product_part_fk, assay_pns_by_product_cu_date, assay_pns_by_product_cu_user) VALUES (NULL, '${value}', '${product}', ` + (part ? `'${part}'` : `NULL`) + `, '${util.formatCuDate(new Date())}', '${user}');`
    connection.execute(sql, 'insertAssayPnsByProduct').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var deleteAssayByBusiness = (id) => {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM assay_by_business WHERE assay_by_business_id = ${id};`
    connection.execute(sql, 'deleteAssayByBusiness').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    })
  })
}

var deleteAssayPnsByProduct = (id) => {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM assay_pns_by_product WHERE assay_pns_by_product_id = ${id};`
    connection.execute(sql, 'deleteAssayPnsByProduct').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    })
  })
}

var selectAssayExportValue = () => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT assay_by_business_value, assay_by_business_export_value FROM assay_by_business;`
    connection.execute(sql, 'selectAssayExportValue').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    }); 
  })
}

module.exports = {
  selectAssay: selectAssay,
  selectAssayForPnsProduct: selectAssayForPnsProduct,
  selectAssayByBusinessByPage: selectAssayByBusinessByPage,
  selectAssayPnsByProductByPage: selectAssayPnsByProductByPage,
  validateAssayByBusiness: validateAssayByBusiness,
  validateAssayPnsByProduct: validateAssayPnsByProduct,
  updateAassayByBusiness: updateAassayByBusiness,
  updateAssayPnsByProduct: updateAssayPnsByProduct,
  insertAssayByBusiness: insertAssayByBusiness,
  insertAssayPnsByProduct: insertAssayPnsByProduct,
  deleteAssayByBusiness: deleteAssayByBusiness,
  deleteAssayPnsByProduct: deleteAssayPnsByProduct,
  selectAssayExportValue: selectAssayExportValue
}