var connection = require("../connection");
var util = require("../../util/util");

var selectResearchArea = () => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT research_area_id, research_area_value FROM research_area ORDER BY research_area_value;`
    connection.execute(sql, 'selectResearchArea').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var selectResearchAreaByPage = (rows, offset, value, exportValue) => {
  return new Promise((resolve, reject) => {
    let filterSql = ``
    if(value) {
      filterSql = filterSql + `research_area_value LIKE '%${value}%' AND `
    }
    if(exportValue) {
      filterSql = filterSql + `research_area_export LIKE '%${exportValue}%' AND `
    }
    let sql = `SELECT research_area_id, research_area_value, research_area_export FROM research_area WHERE ` + filterSql + ` 1=1 ORDER BY research_area_value LIMIT ${rows}, ${offset};`
        + `SELECT COUNT(*) AS total FROM research_area WHERE ` + filterSql + ` 1=1;`
    connection.execute(sql, 'selectResearchAreaByPage').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  })
}

var updateResearchArea = (id, researchArea, researchAreaExport, user) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE research_area SET research_area_value = '${researchArea}', research_area_export = '${researchAreaExport}', research_area_cu_date = '${util.formatCuDate(new Date())}', research_area_cu_user = '${user}' WHERE research_area_id = ${id};`
    connection.execute(sql, 'updateResearchArea').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  }) 
}

var insertResearchArea = (researchArea, researchAreaExport, user) => {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO research_area(research_area_id, research_area_value, research_area_export, research_area_cu_date, research_area_cu_user) VALUES(NULL, '${researchArea}', '${researchAreaExport}', '${util.formatCuDate(new Date())}', '${user}');`
    connection.execute(sql, 'insertResearchArea').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });    
  })
}

var deleteResearchArea = (id) => {
  return new Promise((resolve, reject) => {
    let sql = `DELETE FROM research_area WHERE research_area_id = ${id};`
    connection.execute(sql, 'deleteResearchArea').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });        
  })
}

var selectReasearchAreaExportValue = () => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT research_area_value, research_area_export FROM research_area;`
    connection.execute(sql, 'selectReasearchAreaExportValue').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    }); 
  })
}

module.exports = {
  selectResearchArea: selectResearchArea,
  selectResearchAreaByPage: selectResearchAreaByPage,
  updateResearchArea: updateResearchArea,
  insertResearchArea: insertResearchArea,
  deleteResearchArea: deleteResearchArea,
  selectReasearchAreaExportValue: selectReasearchAreaExportValue
}
  