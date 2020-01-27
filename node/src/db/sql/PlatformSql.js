var connection = require("../connection");
var util = require("../../util/util");

var selectPlatform = () => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT DISTINCT platform_value FROM platform ORDER BY platform_value`
    connection.execute(sql, 'selectPlatform').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var selectPlatformByPage = (rows, offset, value, exportValue, business) => {
  return new Promise((resolve, reject) => {
    let filterSql = ``;
    if(value) {
      filterSql = filterSql + `platform_value LIKE '%${value}%' AND `
    }
    if(exportValue) {
      filterSql = filterSql + `platform_export_value LIKE '%${exportValue}%' AND `
    }
    if(business) {
      filterSql = filterSql + `platform_business_fk LIKE '%${business}%' AND `
    }
    let sql = `SELECT platform_id, platform_value, platform_export_value, platform_business_fk FROM platform WHERE ` + filterSql + ` 1=1 ORDER BY platform_value LIMIT ${rows}, ${offset};`
        + `SELECT COUNT(*) AS total FROM platform WHERE ` + filterSql + ` 1=1;`
    connection.execute(sql, 'selectPlatformByPage').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var validatePlatform = (value, exportValue, business) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) AS total FROM platform WHERE platform_value = '${value}' AND platform_export_value = '${exportValue}' AND platform_business_fk = '${business}';`
    connection.execute(sql, 'validatePlatform').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var updatePlatform = (id, value, exportValue, business, user) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE platform SET platform_value = '${value}', platform_export_value = '${exportValue}', platform_business_fk='${business}', platform_cu_date = '${util.formatCuDate(new Date())}', platform_cu_user = '${user}' WHERE platform_id = ${id};`
    connection.execute(sql, 'updatePlatform').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var insertPlatform = (value, exportValue, business, user) => {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO platform(platform_id, platform_value, platform_export_value, platform_business_fk, platform_cu_date, platform_cu_user) VALUES (NULL, '${value}', '${exportValue}', '${business}', '${util.formatCuDate(new Date())}', '${user}');`
    connection.execute(sql, 'insertPlatform').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var deletePlatform = (id) => {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM platform WHERE platform_id = ${id};`
    connection.execute(sql, 'deletePlatform').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var selectPlatformExportValue = () => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT platform_value, platform_export_value FROM platform;`
    connection.execute(sql, 'selectPlatformExportValue').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    }); 
  })
}

module.exports = {
  selectPlatform: selectPlatform,
  selectPlatformByPage: selectPlatformByPage,
  validatePlatform: validatePlatform,
  updatePlatform: updatePlatform,
  insertPlatform: insertPlatform,
  deletePlatform: deletePlatform,
  selectPlatformExportValue: selectPlatformExportValue
}