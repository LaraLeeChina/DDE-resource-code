var connection = require("../connection");
var util = require("../../util/util");

var selectCellSeedingDensity = () => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT cell_sd_id, cell_sd_value FROM cell_seeding_density ORDER BY cell_sd_value = 'Not Specified' DESC, cell_sd_value`;
    connection.execute(sql, 'selectCellSeedingDensity').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var selectCellSeedingDensityByPage = (rows, offset, value) => {
  return new Promise((resolve, reject) => {
    let filterSql = ``
    if(value) {
      filterSql = `WHERE cell_sd_value LIKE '%${value}%'`
    }
    let sql = `SELECT cell_sd_id, cell_sd_value FROM cell_seeding_density ` + filterSql + ` ORDER BY cell_sd_value LIMIT ${rows}, ${offset};`
        + `SELECT COUNT(*) AS total FROM cell_seeding_density ` + filterSql + `;`
    connection.execute(sql, 'selectCellSeedingDensityByPage').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var updateCellSeedingDensity = (id, value, user) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE cell_seeding_density SET cell_sd_value = '${value}', cell_sd_cu_date = '${util.formatCuDate(new Date())}', cell_sd_cu_user = '${user}' WHERE cell_sd_id = ${id};`
    connection.execute(sql, 'updateCellSeedingDensity').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    })
  })
}

var insertCellSeedingDensity = (value, user) => {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO cell_seeding_density(cell_sd_id, cell_sd_value, cell_sd_cu_date, cell_sd_cu_user) VALUES(NULL, '${value}', '${util.formatCuDate(new Date())}', '${user}');`
    connection.execute(sql, 'insertCellSeedingDensity').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    })
  })
}

var deleteCellSeedingDensity = (id) => {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM cell_seeding_density WHERE cell_sd_id = ${id};`
    connection.execute(sql, 'deleteCellSeedingDensity').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    })
  })
}


module.exports = {
  selectCellSeedingDensity: selectCellSeedingDensity,
  selectCellSeedingDensityByPage: selectCellSeedingDensityByPage,
  updateCellSeedingDensity: updateCellSeedingDensity,
  insertCellSeedingDensity: insertCellSeedingDensity,
  deleteCellSeedingDensity: deleteCellSeedingDensity
}
  