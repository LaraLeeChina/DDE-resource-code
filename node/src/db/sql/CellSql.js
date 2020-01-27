var connection = require("../connection");
var util = require("../../util/util");

var selectCellTypes = (cellLine) => {
  return new Promise((resolve, reject) => {
    let sql
    if(cellLine == "all") {
      sql = `SELECT cell_types_id, cell_types_value FROM cell_types ORDER BY cell_types_value;`
    } else {
      cellLine = JSON.parse(cellLine)
      sql = `SELECT DISTINCT cell_types_id, cell_types_value FROM cell_types ct, cell_line cl WHERE ct.cell_types_value = cl.cell_types_fk AND (`
      for(let i = 0; i < cellLine.length; i++) {
        if(i == cellLine.length - 1) {
          sql = sql + `cell_line_value = '${cellLine[i]}')`
        } else {
          sql = sql + `cell_line_value = '${cellLine[i]}' OR `
        }
      }
      sql = sql + ` ORDER BY cell_types_value`
    }
    connection.execute(sql, 'selectCellTypes').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var selectCellTypesByPage = (rows, offset, value) => {
  return new Promise((resolve, reject) => {
    let filterSql = ``
    if(value) {
      filterSql = `WHERE cell_types_value LIKE '%${value}%'`
    }
    let sql = `SELECT cell_types_id, cell_types_value FROM cell_types ` + filterSql + ` ORDER BY cell_types_value LIMIT ${rows}, ${offset};`
        + `SELECT COUNT(*) AS total FROM cell_types ` + filterSql + `;`
    connection.execute(sql, 'selectCellTypesByPage').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var updateCellTypes = (id, value, user) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE cell_types SET cell_types_value = '${value}', cell_types_cu_date = '${util.formatCuDate(new Date())}', cell_types_cu_user = '${user}' WHERE cell_types_id = ${id};`
    connection.execute(sql, 'updateCellTypes').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}


var insertCellTypes = (cellTypes, user) => {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO cell_types(cell_types_id, cell_types_value, cell_types_cu_date, cell_types_cu_user) VALUES (NULL, '${cellTypes}', '${util.formatCuDate(new Date())}', '${user}');`
    connection.execute(sql, 'insertCellTypes').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var deleteCellTypes = (id) => {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM cell_types WHERE cell_types_id = ${id};`
    connection.execute(sql, 'deleteCellTypes').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}


var selectCellLine = () => {
  return new Promise((resolve, reject) => {
    let sql = "SELECT DISTINCT cell_line_value FROM cell_line ORDER BY cell_line_value";
    connection.execute(sql, 'selectCellLine').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var selectCellLineByPage = (rows, offset, value, cellTypes) => {
  return new Promise((resolve, reject) => {
    let filterSql = ``
    if(value) {
      filterSql = filterSql + `cell_line_value LIKE '%${value}%' AND `
    }
    if(cellTypes) {
      filterSql = filterSql + `cell_types_fk LIKE '%${cellTypes}%' AND `
    }
    let sql = `SELECT cell_line_id, cell_line_value, cell_types_fk FROM cell_line WHERE ` + filterSql + `1=1 ORDER BY cell_line_value LIMIT ${rows}, ${offset};`
        + `SELECT COUNT(*) AS total FROM cell_line WHERE ` + filterSql + `1=1;`
    connection.execute(sql, 'selectCellLineByPage').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var validateCellLine = (value, cellTypes) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) AS total FROM cell_line WHERE cell_line_value = '${value}' AND cell_types_fk = '${cellTypes}'`
    connection.execute(sql, 'validateCellLine').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var updateCellLine = (id, value, cellTypes, user) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE cell_line SET cell_line_value = '${value}', cell_types_fk = '${cellTypes}', cell_line_cu_date = '${util.formatCuDate(new Date())}', cell_line_cu_user = '${user}' WHERE cell_line_id = ${id};`
    connection.execute(sql, 'updateCellLine').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var insertCellLine = (value, cellTypes, user) => {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO cell_line(cell_line_id, cell_line_value, cell_types_fk, cell_line_cu_date, cell_line_cu_user) VALUES (NULL, '${value}', '${cellTypes}', '${util.formatCuDate(new Date())}', '${user}');`
    connection.execute(sql, 'insertCellLine').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var deleteCellLine = (id) => {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM cell_line WHERE cell_line_id = ${id}`
    connection.execute(sql, 'deleteCellLine').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}


module.exports = {
  selectCellTypes: selectCellTypes,
  selectCellTypesByPage: selectCellTypesByPage,
  validateCellLine: validateCellLine,
  updateCellTypes: updateCellTypes,
  insertCellTypes: insertCellTypes,
  deleteCellTypes: deleteCellTypes,
  selectCellLine: selectCellLine,
  selectCellLineByPage: selectCellLineByPage,
  updateCellLine: updateCellLine,
  insertCellLine: insertCellLine,
  deleteCellLine: deleteCellLine
}
  