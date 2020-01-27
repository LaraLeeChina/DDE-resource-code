var connection = require("../connection");
var util = require("../../util/util")

var selectPlateCoating = () => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT plate_coating_id, plate_coating_value FROM plate_coating ORDER BY plate_coating_value = 'Not Specified' DESC, plate_coating_value;`
    connection.execute(sql, 'selectPlateCoating').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var selectPlateCoatingByPage = (rows, offset, value) => {
  return new Promise((resolve, reject) => {
    let filterSql = ``
    if(value) {
      filterSql = `WHERE plate_coating_value LIKE '%${value}%'`
    }
    let sql = `SELECT plate_coating_id, plate_coating_value FROM plate_coating ` + filterSql + ` ORDER BY plate_coating_value LIMIT ${rows}, ${offset};`
        + `SELECT COUNT(*) AS total FROM plate_coating ` + filterSql + `;`
    connection.execute(sql, 'selectPlateCoatingByPage').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var updatePlateCoating = (id, value, user) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE plate_coating SET plate_coating_value = '${value}', plate_coating_cu_date = '${util.formatCuDate(new Date())}', plate_coating_cu_user = '${user}' WHERE plate_coating_id = ${id};`
    connection.execute(sql, 'updatePlateCoating').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var insertPlateCoating = (value, user) => {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO plate_coating(plate_coating_id, plate_coating_value, plate_coating_cu_date, plate_coating_cu_user) VALUES (NULL, '${value}', '${util.formatCuDate(new Date())}', '${user}');`
    connection.execute(sql, 'insertPlateCoating').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var deletePlateCoating = (id) => {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM plate_coating WHERE plate_coating_id = ${id};`
    connection.execute(sql, 'deletePlateCoating').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}


module.exports = {
  selectPlateCoating: selectPlateCoating,
  selectPlateCoatingByPage: selectPlateCoatingByPage,
  updatePlateCoating: updatePlateCoating,
  insertPlateCoating: insertPlateCoating,
  deletePlateCoating: deletePlateCoating
}
  