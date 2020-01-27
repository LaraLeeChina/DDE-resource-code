var connection = require("../connection");
var util = require("../../util/util");

var selectSpecies = () => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT species_id, species_value FROM species ORDER BY species_value`;
    connection.execute(sql, 'selectSpecies').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var selectSpeciesByPage = (rows, offset, value) => {
  return new Promise((resolve, reject) => {
    let filterSql = ``;
    if(value) {
      filterSql = `WHERE species_value LIKE '%${value}%'`
    }
    let sql = `SELECT species_id, species_value FROM species ` + filterSql + ` ORDER BY species_value LIMIT ${rows}, ${offset};`
        + `SELECT COUNT(*) AS total FROM species ` + filterSql + `;`
    connection.execute(sql, 'selectSpeciesByPage').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var updateSpecies = (id, species, user) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE species SET species_value = '${species}', species_cu_date = '${util.formatCuDate(new Date())}', species_cu_user = '${user}' WHERE species_id = ${id};`
    connection.execute(sql, 'updateSpecies').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  }) 
}

var insertSpecies = (species, user) => {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO species(species_id, species_value, species_cu_date, species_cu_user) VALUES(NULL, '${species}', '${util.formatCuDate(new Date())}', '${user}');`
    connection.execute(sql, 'insertSpecies').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })  
}

var deleteSpecies = (id) => {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM species WHERE species_id = ${id};`
    connection.execute(sql, 'deleteSpecies').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })   
}


module.exports = {
  selectSpecies: selectSpecies,
  selectSpeciesByPage: selectSpeciesByPage,
  updateSpecies: updateSpecies,
  insertSpecies: insertSpecies,
  deleteSpecies: deleteSpecies
}
  