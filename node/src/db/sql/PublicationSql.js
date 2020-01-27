var connection = require("../connection");
var util = require("../../util/util");

var publicationFilter = (query) => {
  let sql = ``
  if(query.PublicationTitle) {
    sql = sql + `AND publication_title LIKE '%${util.transSq(query.PublicationTitle)}%' `
  }
  if(query.PublicationLink) {
    sql = sql + `AND publication_link LIKE '%${util.transSq(query.PublicationLink)}%' `
  }
  if(query.PublicationDate) {
    sql = sql + `AND DATE_FORMAT(publication_date, '%m/%d/%Y') LIKE '%${query.PublicationDate}%' `
  }
  if(query.PrimaryAuthor) {
    sql = sql + `AND primary_author LIKE '%${util.transSq(query.PrimaryAuthor)}%' `
  }
  if(query.Authors) {
    sql = sql + `AND authors LIKE '%${util.transSq(query.Authors)}%' `
  }
  if(query.JournalName) {
    sql = sql + `AND journal_name LIKE '%${util.transSq(query.JournalName)}%' `
  }
  if(query.CUDate) {
    sql = sql + `AND DATE_FORMAT(cu_date, '%m/%d/%Y %H:%I:%S') LIKE '%${query.CUDate}%' `
  }
  if(query.ResearchArea) {
    sql = sql + `AND research_area LIKE '%${query.ResearchArea}%' `
  }
  if(query.CellLine) {
    sql = sql + `AND cell_line LIKE '%${query.CellLine}%' `
  }
  if(query.CellType) {
    sql = sql + `AND cell_type LIKE '%${query.CellType}%' `
  }
  if(query.Species) {
    sql = sql + `AND species LIKE '%${query.Species}%' `
  }
  if(query.Platform) {
    sql = sql + `AND platform LIKE '%${query.Platform}%' `
  }
  if(query.Product) {
    sql = sql + `AND product LIKE '%${query.Product}%' `
  }
  if(query.Assay) {
    sql = sql + `AND assay LIKE '%${query.Assay}%' `
  }
  if(query.CellSeedingDensity) {
    sql = sql + `AND cell_seeding_density LIKE '%${query.CellSeedingDensity}%' `
  }
  if(query.PlateCoating) {
    sql = sql + `AND plate_coating LIKE '%${query.PlateCoating}%' `
  }
  if(query.Part) {
    sql = sql + `AND part LIKE '%${query.Part}%' `
  }
  return sql;
}

var selectPublication = (rows, offset, query) => {
  return new Promise((resolve, reject) => {
    let orderSql = ``
    if(query.sort) {
      query.sort = JSON.parse(query.sort)
      if(query.sort.field == 'Create/Update Date') {
        orderSql = `ORDER BY cu_date ${query.sort.dir}`
      }
      if(query.sort.field == 'Platform') {
        orderSql = `ORDER BY platform ${query.sort.dir}`
      }
      if(query.sort.field == 'Publication Title') {
        orderSql = `ORDER BY publication_title ${query.sort.dir}`
      }
      if(query.sort.field == 'Publication Link') {
        orderSql = `ORDER BY publication_link ${query.sort.dir}`
      }
      if(query.sort.field == 'Primary Author') {
        orderSql = `ORDER BY primary_author ${query.sort.dir}`
      }
      if(query.sort.field == 'Author(s)') {
        orderSql = `ORDER BY authors ${query.sort.dir}`
      }
      if(query.sort.field == 'Journal Name') {
        orderSql = `ORDER BY journal_name ${query.sort.dir}`
      }
      if(query.sort.field == 'Publication Date') {
        orderSql = `ORDER BY publication_date ${query.sort.dir}`
      }
      if(query.sort.field == 'Research Area') {
        orderSql = `ORDER BY research_area ${query.sort.dir}`
      }
      if(query.sort.field == 'Cell Line') {
        orderSql = `ORDER BY cell_line ${query.sort.dir}`
      }
      if(query.sort.field == 'Cell Types') {
        orderSql = `ORDER BY cell_type ${query.sort.dir}`
      }
      if(query.sort.field == 'Species') {
        orderSql = `ORDER BY species ${query.sort.dir}`
      }
      if(query.sort.field == 'Assay') {
        orderSql = `ORDER BY assay ${query.sort.dir}`
      }
      if(query.sort.field == 'Product') {
        orderSql = `ORDER BY product ${query.sort.dir}`
      }
      if(query.sort.field == 'Part') {
        orderSql = `ORDER BY part ${query.sort.dir}`
      }
      if(query.sort.field == 'Cell Seeding Density') {
        orderSql = `ORDER BY cell_seeding_density ${query.sort.dir}`
      }
      if(query.sort.field == 'Plate Coating') {
        orderSql = `ORDER BY plate_coating ${query.sort.dir}`
      }
    } else {
      orderSql = `ORDER BY id ASC`
    }
    let sql = `SELECT * FROM publication LEFT JOIN publication_sub ON publication.id = publication_sub.publication_id WHERE 1=1 `
    sql = sql + publicationFilter(query) + orderSql + ` LIMIT ${rows}, ${offset};`
    sql = sql + `SELECT COUNT(*) AS total FROM publication LEFT JOIN publication_sub ON publication.id = publication_sub.publication_id WHERE 1=1 ` + publicationFilter(query) + `;`
    connection.execute(sql, 'selectPublication').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    });
  });
};

var updateBasePublicationField = (id, field, value, user) => {
  return new Promise((resolve, reject) => {
    var sqlValue;
    if(field == "publication_date") {
      sqlValue = `STR_TO_DATE('${value}', '%m/%d/%Y')`;
    } else {
      sqlValue = `'${util.transSq(value)}'`
      value = util.transSq(value)
    }
    let sql = 
        `UPDATE publication SET ${field} = ${sqlValue}, cu_date = '${util.formatCuDate(new Date())}' WHERE id = ${id}; `
        + `INSERT INTO audit(audit_id, audit_publication_id, audit_publication_sub_id, audit_publication_column, audit_cu_date, audit_cu_user)`
        + `VALUES (NULL, ${id}, NULL, 'UPDATE: ${field} = ${value}', '${util.formatCuDate(new Date())}', '${user}');` 
    connection.trans(sql, 'updateBasePublicationField').then(() => {
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
}

var selectUpdatePublication = (id, rows, offset) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM publication WHERE id = ${id};`
    sql = sql + `SELECT * FROM publication_sub WHERE publication_id = ${id} LIMIT ${rows}, ${offset};`
    sql = sql + `SELECT COUNT(*) AS total FROM publication_sub WHERE publication_id = ${id};`
    connection.execute(sql, 'selectUpdatePublication').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    })
  })
}

var selectDeleteSubPublication = (id) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT COUNT(*) AS total FROM publication_sub WHERE publication_id = ${id};`
    connection.execute(sql, 'selectDeleteSubPublication').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    })
  })
}

var deleteBasePublication = (id, user) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT @pl:=publication_link, @pt:=publication_title, @pd:=publication_date, @pa:=primary_author, @a:=authors, @jn:=journal_name FROM publication WHERE id = ${id};`
        + `DELETE FROM publication WHERE id = ${id};`
        + `INSERT INTO audit(audit_id, audit_publication_id, audit_publication_sub_id, audit_publication_column, audit_cu_date, audit_cu_user) VALUES`
        + `(NULL, ${id}, NULL, CONCAT('DELETE: publication_link=', @pl, ', publication_title=', @pt, ', publication_date=', @pd, ', primary_author=', @pa, ', authors=', @a, ',  journal_name=', @jn), '${util.formatCuDate(new Date())}', '${user}');`
        + `SET @pl=NULL; SET @pt=NULL; SET @pd=NULL; SET @pa=NULL; SET @a=NULL; SET @jn=NULL;`
    connection.trans(sql, 'deleteBasePublication').then(() => {
      resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

var deleteSubPublication = (id, subId, user) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT @pl:=publication_link, @pt:=publication_title, @pd:=publication_date, @pa:=primary_author, @a:=authors, @jn:=journal_name FROM publication WHERE id = ${id};`
        + `SELECT @ra:=research_area, @cl:=cell_line, @ct:=cell_type, @s:=species, @pf:=platform, @prod:=product, @as:=assay, @cld:=cell_seeding_density, @pc:=plate_coating, @part:=IFNULL(part, '') FROM publication_sub WHERE sub_id = ${subId} AND publication_id = ${id};`
        + `DELETE FROM publication_sub WHERE sub_id = ${subId};`
        + `INSERT INTO audit(audit_id, audit_publication_id, audit_publication_sub_id, audit_publication_column, audit_cu_date, audit_cu_user) VALUES`
        + `(NULL, ${id}, ${subId}, CONCAT('DELETE: publication_link=', @pl, ', publication_title=', @pt, ', publication_date=', @pd, ', primary_author=', @pa, ', authors=', @a, ',  journal_name=', @jn, ', research_area=', @ra, ', cell_line=', @cl, ', cell_type=', @ct, ', species=', @s, ', platform=', @pf, ', product=', @prod, ', assay=', @as, ', cell_seeding_density=', @cld, ', plate_coating=', @pc, ', part=', @part), '${util.formatCuDate(new Date())}', '${user}');`
        + `SET @pl=NULL; SET @pt=NULL; SET @pd=NULL; SET @pa=NULL; SET @a=NULL; SET @jn=NULL; SET @ra=NULL; SET @cl=NULL; SET @ct=NULL; SET @s=NULL; SET @pf=NULL; SET @prod=NULL; SET @as=NULL; SET @cld=NULL; SET @pc=NULL; SET @part=NULL;`
    connection.trans(sql, 'deleteSubPublication').then(() => {
      resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

var deletePublication = (id, subId, user) => {
  return new Promise((resolve, reject) => {
    let sql =  `SELECT @pl:=publication_link, @pt:=publication_title, @pd:=publication_date, @pa:=primary_author, @a:=authors, @jn:=journal_name FROM publication WHERE id = ${id};`
        + `SELECT @ra:=research_area, @cl:=cell_line, @ct:=cell_type, @s:=species, @pf:=platform, @prod:=product, @as:=assay, @cld:=cell_seeding_density, @pc:=plate_coating, @part:=IFNULL(part, '') FROM publication_sub WHERE sub_id = ${subId} AND publication_id = ${id};`
        + `DELETE FROM publication_sub WHERE sub_id = ${subId};`
        + `DELETE FROM publication WHERE id = ${id};`
        + `INSERT INTO audit(audit_id, audit_publication_id, audit_publication_sub_id, audit_publication_column, audit_cu_date, audit_cu_user) VALUES`
        + `(NULL, ${id}, ${subId}, CONCAT('DELETE: publication_link=', @pl, ', publication_title=', @pt, ', publication_date=', @pd, ', primary_author=', @pa, ', authors=', @a, ',  journal_name=', @jn, ', research_area=', @ra, ', cell_line=', @cl, ', cell_type=', @ct, ', species=', @s, ', platform=', @pf, ', product=', @prod, ', assay=', @as, ', cell_seeding_density=', @cld, ', plate_coating=', @pc, ', part=', @part), '${util.formatCuDate(new Date())}', '${user}');`
        + `SET @pl=NULL; SET @pt=NULL; SET @pd=NULL; SET @pa=NULL; SET @a=NULL; SET @jn=NULL; SET @ra=NULL; SET @cl=NULL; SET @ct=NULL; SET @s=NULL; SET @pf=NULL; SET @prod=NULL; SET @as=NULL; SET @cld=NULL; SET @pc=NULL; SET @part=NULL;`
    connection.trans(sql, 'deletePublication').then(() => {
      resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

var insertBasePublication = (basePublication, user) => {
  return new Promise((resolve, reject) => {
    let sql = `INSERT INTO publication(id, publication_link, publication_title, publication_date, primary_author, authors, journal_name, cu_date) VALUES`
        + `(NULL, '${util.transSq(basePublication.PublicationLink)}', '${util.transSq(basePublication.PublicationTitle)}', STR_TO_DATE('${basePublication.PublicationDate}', '%Y/%m/%d'), '${util.transSq(basePublication.PrimaryAuthor)}', '${util.transSq(basePublication.Authors)}', '${util.transSq(basePublication.JournalName)}', '${util.formatCuDate(new Date())}');`
        + `SELECT @id:=LAST_INSERT_ID();`
        + `INSERT INTO audit(audit_id, audit_publication_id, audit_publication_sub_id, audit_publication_column, audit_cu_date, audit_cu_user) VALUES`
        + `(NULL, @id, NULL, CONCAT('INSERT: publication_link=', '${util.transSq(basePublication.PublicationLink)}', ', publication_title=', '${util.transSq(basePublication.PublicationTitle)}', ', publication_date=', '${basePublication.PublicationDate}', ', primary_author=', '${util.transSq(basePublication.PrimaryAuthor)}', ', authors=', '${util.transSq(basePublication.Authors)}', ',  journal_name=', '${util.transSq(basePublication.JournalName)}'), '${util.formatCuDate(new Date())}', '${user}');`
        + `SET @id=NULL;`
    connection.trans(sql, 'insertBasePublication').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    })
  })
}

var insertPublication = (publication, user) => {
  return new Promise((resolve, reject) => {
    var subPublication = publication.SubPublication;
    for(let i = 0; i < subPublication.length; i++) {
      for(var key in subPublication[i]) {
        if(key != "Platform") {
          var newValue = ""
          if(subPublication[i][key].length == 1) {
            newValue = subPublication[i][key][0]
          } else {
            for(let j = 0; j < subPublication[i][key].length; j++) {
              if(j == 0) {
                newValue = subPublication[i][key][j]
              } else {
                newValue = newValue + "~" + subPublication[i][key][j]
              }
            }
          }
          subPublication[i][key] = newValue
        } 
      }
    }

    let subInsertSql = ``;
    for(let i = 0; i < subPublication.length; i++) {
      subInsertSql = subInsertSql 
          + `INSERT INTO publication_sub(sub_id, research_area, cell_line, cell_type, species, platform, product, assay, cell_seeding_density, plate_coating, part, publication_id) VALUES`
          + `(NULL, '${subPublication[i].ResearchArea}', '${subPublication[i].CellLine}', '${subPublication[i].CellType}', '${subPublication[i].Species}', '${subPublication[i].Platform}', '${subPublication[i].Product}', '${subPublication[i].Assay}', '${subPublication[i].CellSeedingDensity}', '${subPublication[i].PlateCoating}', ` + (subPublication[i].Part ? `'${subPublication[i].Part}'` : 'NULL') + `, @id);`
          + `SELECT @subId:=LAST_INSERT_ID();`
          + `INSERT INTO audit(audit_id, audit_publication_id, audit_publication_sub_id, audit_publication_column, audit_cu_date, audit_cu_user) VALUES`
          + `(NULL, @id, @subId, CONCAT('INSERT: publication_link=', '${publication.PublicationLink}', ', publication_title=', '${publication.PublicationTitle}', ', publication_date=', '${publication.PublicationDate}', ', primary_author=', '${util.transSq(publication.PrimaryAuthor)}', ', authors=', '${util.transSq(publication.Authors)}', ',  journal_name=', '${publication.JournalName}', ', research_area=', '${subPublication[i].ResearchArea}', ', cell_line=', '${subPublication[i].CellLine}', ', cell_type=', '${subPublication[i].CellType}', ', species=', '${subPublication[i].Species}', ', platform=', '${subPublication[i].Platform}', ', product=', '${subPublication[i].Product}', ', assay=', '${subPublication[i].Assay}', ', cell_seeding_density=', '${subPublication[i].CellSeedingDensity}', ', plate_coating=', '${subPublication[i].PlateCoating}', ', part=', '${subPublication[i].Part ? subPublication[i].Part : 'NULL'}'), '${util.formatCuDate(new Date())}', '${user}');`
    }
    
    let sql = `INSERT INTO publication(id, publication_link, publication_title, publication_date, primary_author, authors, journal_name, cu_date) VALUES`
        + `(NULL, '${util.transSq(publication.PublicationLink)}', '${util.transSq(publication.PublicationTitle)}', STR_TO_DATE('${publication.PublicationDate}', '%Y/%m/%d'), '${util.transSq(publication.PrimaryAuthor)}', '${util.transSq(publication.Authors)}', '${util.transSq(publication.JournalName)}', '${util.formatCuDate(new Date())}');`
        + `SELECT @id:=LAST_INSERT_ID();`
        + subInsertSql
        + `SET @id=NULL; SET @subId=NULL;`

    connection.trans(sql, 'insertPublication').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    })
  })
}

var updateBasePublication = (basePublication, user) => {
  return new Promise((resolve, reject) => {
    var updateSql = ``;
    var auditSql = ``;
    var id;
    for(var key in basePublication) {
      if(key == "ID") {
        id = basePublication[key]
      }
      if(key == "PublicationLink") {
        updateSql = updateSql + `publication_link = '${util.transSq(basePublication[key])}', `
        auditSql = auditSql + `'publication_link=${util.transSq(basePublication[key])}, ', `
      }
      if(key == "PublicationTitle") {
        updateSql = updateSql + `publication_title = '${util.transSq(basePublication[key])}', `
        auditSql = auditSql + `'publication_title=${util.transSq(basePublication[key])}, ', `
      }
      if(key == "PublicationDate") {
        updateSql = updateSql + `publication_date = STR_TO_DATE('${basePublication[key]}', '%Y/%m/%d'), `
        auditSql = auditSql + `'publication_date=${basePublication[key]}, ', `
      }
      if(key == "PrimaryAuthor") {
        updateSql = updateSql + `primary_author = '${util.transSq(basePublication[key])}', `
        auditSql = auditSql + `'primary_author=${util.transSq(basePublication[key])}, ', `
      }
      if(key == "Authors") {
        updateSql = updateSql + `authors = '${util.transSq(basePublication[key])}', `
        auditSql = auditSql + `'authors=${util.transSq(basePublication[key])}, ', `
      }
      if(key == "JournalName") {
        updateSql = updateSql + `journal_name = '${util.transSq(basePublication[key])}', `
        auditSql = auditSql + `'journal_name=${util.transSq(basePublication[key])}, ', `
      }
    }
    updateSql = updateSql + `cu_date = '${util.formatCuDate(new Date())}' WHERE id = ${id};`
    auditSql = auditSql + `'cu_date = ${util.formatCuDate(new Date())}'), `
    let sql = `UPDATE publication SET `
        + updateSql
        + `INSERT INTO audit(audit_id, audit_publication_id, audit_publication_sub_id, audit_publication_column, audit_cu_date, audit_cu_user) VALUES`
        + `(NULL, ${id}, NULL, CONCAT('UPDATE: ',`
        + auditSql
        + `'${util.formatCuDate(new Date())}', '${user}');`
    connection.trans(sql, 'updateBasePublication').then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
    });
  });
}

var updatePublication = (publication, user) => {
  return new Promise((resolve, reject) => {
    var insertSubSql = ``;
    var updateSubSql = ``;
    var updateSql = ``;
    var auditSql = ``;
    var id;
    for(var key in publication) {
      if(key == "ID") {
        id = publication[key]
      }
      if(key == "PublicationLink") {
        updateSql = updateSql + `publication_link = '${util.transSq(publication[key])}', `
        auditSql = auditSql + `'publication_link=${util.transSq(publication[key])}, ', `
      }
      if(key == "PublicationTitle") {
        updateSql = updateSql + `publication_title = '${util.transSq(publication[key])}', `
        auditSql = auditSql + `'publication_title=${util.transSq(publication[key])}, ', `
      }
      if(key == "PublicationDate") {
        updateSql = updateSql + `publication_date = STR_TO_DATE('${publication[key]}', '%Y/%m/%d'), `
        auditSql = auditSql + `'publication_date=${publication[key]}, ', `
      }
      if(key == "PrimaryAuthor") {
        updateSql = updateSql + `primary_author = '${util.transSq(publication[key])}', `
        auditSql = auditSql + `'primary_author=${util.transSq(publication[key])}, ', `
      }
      if(key == "Authors") {
        updateSql = updateSql + `authors = '${util.transSq(publication[key])}', `
        auditSql = auditSql + `'authors=${util.transSq(publication[key])}, ', `
      }
      if(key == "JournalName") {
        updateSql = updateSql + `journal_name = '${util.transSq(publication[key])}', `
        auditSql = auditSql + `'journal_name=${util.transSq(publication[key])}, ', `
      }
    }
    updateSql = updateSql + `cu_date = '${util.formatCuDate(new Date())}' WHERE id = ${id};`
    
    var insertSubPublication = [];
    var updateSubPublication = [];
    for(let i = 0; i < publication.SubPublication.length; i++) {
      if(!publication.SubPublication[i].SubId) {
        insertSubPublication.push(publication.SubPublication[i])
      } else {
        updateSubPublication.push(publication.SubPublication[i])
      }
    }
    for(let i = 0; i < insertSubPublication.length; i++) {
      for(var ikey in insertSubPublication[i]) {
        if(ikey != "Platform") {
          var inewValue = ""
          if(insertSubPublication[i][ikey].length == 1) {
            inewValue = insertSubPublication[i][ikey][0]
          } else {
            for(let j = 0; j < insertSubPublication[i][ikey].length; j++) {
              if(j == 0) {
                inewValue = insertSubPublication[i][ikey][j]
              } else {
                inewValue = inewValue + "~" + insertSubPublication[i][ikey][j]
              }
            }
          }
          insertSubPublication[i][ikey] = inewValue
        } 
      }
    }
    for(let i = 0; i < updateSubPublication.length; i++) {
      for(var ukey in updateSubPublication[i]) {
        if(ukey != "Platform" && ukey != "SubId") {
          var unewValue = ""
          if(updateSubPublication[i][ukey].length == 1) {
            unewValue = updateSubPublication[i][ukey][0]
          } else {
            for(let j = 0; j < updateSubPublication[i][ukey].length; j++) {
              if(j == 0) {
                unewValue = updateSubPublication[i][ukey][j]
              } else {
                unewValue = unewValue + "~" + updateSubPublication[i][ukey][j]
              }
            }
          }
          updateSubPublication[i][ukey] = unewValue
        } 
      }
    }

    if(insertSubPublication.length != 0) {
      for(let i = 0; i < insertSubPublication.length; i++) {
        insertSubSql = insertSubSql 
            + `INSERT INTO publication_sub(sub_id, research_area, cell_line, cell_type, species, platform, product, assay, cell_seeding_density, plate_coating, part, publication_id) VALUES`
            + `(NULL, '${insertSubPublication[i].ResearchArea}', '${insertSubPublication[i].CellLine}', '${insertSubPublication[i].CellType}', '${insertSubPublication[i].Species}', '${insertSubPublication[i].Platform}', '${insertSubPublication[i].Product}', '${insertSubPublication[i].Assay}', '${insertSubPublication[i].CellSeedingDensity}', '${insertSubPublication[i].PlateCoating}', ` + (insertSubPublication[i].Part ? `'${insertSubPublication[i].Part}'` : 'NULL') + `, ${id});`
            + `SELECT @subId:=LAST_INSERT_ID();`
            + `INSERT INTO audit(audit_id, audit_publication_id, audit_publication_sub_id, audit_publication_column, audit_cu_date, audit_cu_user) VALUES`
            + `(NULL, ${id}, @subId, CONCAT('UPDATE-INSERT: ', ` 
            +  auditSql
            + `'research_area=', '${insertSubPublication[i].ResearchArea}', ', cell_line=', '${insertSubPublication[i].CellLine}', ', cell_type=', '${insertSubPublication[i].CellType}', ', species=', '${insertSubPublication[i].Species}', ', platform=', '${insertSubPublication[i].Platform}', ', product=', '${insertSubPublication[i].Product}', ', assay=', '${insertSubPublication[i].Assay}', ', cell_seeding_density=', '${insertSubPublication[i].CellSeedingDensity}', ', plate_coating=', '${insertSubPublication[i].PlateCoating}', ', part=', '${insertSubPublication[i].Part ? insertSubPublication[i].Part : 'NULL'}'), '${util.formatCuDate(new Date())}', '${user}');`
      }
    }

    if(updateSubPublication.length != 0) {
      for(let i = 0; i < updateSubPublication.length; i++) {
        var uSubId;
        var uUpdateSql = ``;
        var uAuditSql = ``;
        for(var key1 in updateSubPublication[i]) {
          if(key1 == "SubId") {
            uSubId = updateSubPublication[i][key1]
          }
          if(key1 == "ResearchArea") {
            uUpdateSql = uUpdateSql + `research_area = '${updateSubPublication[i][key1]}', `
            uAuditSql = uAuditSql + `'research_area=${updateSubPublication[i][key1]}, ', `
          }
          if(key1 == "CellLine") {
            uUpdateSql = uUpdateSql + `cell_line = '${updateSubPublication[i][key1]}', `
            uAuditSql = uAuditSql + `'cell_line=${updateSubPublication[i][key1]}, ', `
          }
          if(key1 == "CellType") {
            uUpdateSql = uUpdateSql + `cell_type = '${updateSubPublication[i][key1]}', `
            uAuditSql = uAuditSql + `'cell_type=${updateSubPublication[i][key1]}, ', `
          }
          if(key1 == "Species") {
            uUpdateSql = uUpdateSql + `species = '${updateSubPublication[i][key1]}', `
            uAuditSql = uAuditSql + `'species=${updateSubPublication[i][key1]}, ', `
          }
          if(key1 == "Platform") {
            uUpdateSql = uUpdateSql + `platform = '${updateSubPublication[i][key1]}', `
            uAuditSql = uAuditSql + `'platform=${updateSubPublication[i][key1]}, ', `
          }
          if(key1 == "Product") {
            uUpdateSql = uUpdateSql + `product = '${updateSubPublication[i][key1]}', `
            uAuditSql = uAuditSql + `'product=${updateSubPublication[i][key1]}, ', `
          }
          if(key1 == "Assay") {
            uUpdateSql = uUpdateSql + `assay = '${updateSubPublication[i][key1]}', `
            uAuditSql = uAuditSql + `'assay=${updateSubPublication[i][key1]}, ', `
          }
          if(key1 == "CellSeedingDensity") {
            uUpdateSql = uUpdateSql + `cell_seeding_density = '${updateSubPublication[i][key1]}', `
            uAuditSql = uAuditSql + `'cell_seeding_density=${updateSubPublication[i][key1]}, ', `
          }
          if(key1 == "PlateCoating") {
            uUpdateSql = uUpdateSql + `plate_coating = '${updateSubPublication[i][key1]}', `
            uAuditSql = uAuditSql + `'plate_coating=${updateSubPublication[i][key1]}, ', `
          }
          if(key1 == "Part") {
            uUpdateSql = uUpdateSql + `part = ` + (updateSubPublication[i][key1] ? `'${updateSubPublication[i][key1]}'` : 'NULL') + `, `
            uAuditSql = uAuditSql + `'part=${updateSubPublication[i][key1] ? updateSubPublication[i][key1] : 'NULL'}, ', `
          }
        }
        uUpdateSql = uUpdateSql + `publication_id = ${id} WHERE sub_id = ${uSubId};`
        uAuditSql = uAuditSql.substring(0, uAuditSql.length - 5) + `'`
        updateSubSql = updateSubSql
            + `UPDATE publication_sub SET `
            + uUpdateSql
            + `INSERT INTO audit(audit_id, audit_publication_id, audit_publication_sub_id, audit_publication_column, audit_cu_date, audit_cu_user) VALUES`
            + `(NULL, ${id}, ${uSubId}, CONCAT('UPDATE: ', `
            + auditSql
            + uAuditSql
            + `), '${util.formatCuDate(new Date())}', '${user}');`
      }
    }
    
    let sql = `UPDATE publication SET `
        + updateSql
        + insertSubSql
        + updateSubSql
        + `SET @subId=NULL;`
    connection.trans(sql, 'updatePublication').then(() => {
      resolve();
    }).catch((err) => {
      reject(err);
    })
  })
}

var importBasePublication = (basePublication, user) => {
  return new Promise((resolve, reject) => {
    let importSql = new Array()
    for(let i = 0; i < basePublication.length; i++) {
      importSql.push({ sql: `INSERT INTO publication(id, publication_link, publication_title, publication_date, primary_author, authors, journal_name, cu_date) VALUES`
      + `(NULL, '${util.transSq(basePublication[i]['Publication Link'])}', '${util.transSq(basePublication[i]['Publication Title'])}', STR_TO_DATE('${basePublication[i]['Publication Date']}', '%Y/%m/%d'), '${util.transSq(basePublication[i]['Primary Author'])}', '${util.transSq(basePublication[i]['Author(s)'])}', '${util.transSq(basePublication[i]['Journal Name'])}', '${util.formatCuDate(new Date())}');`
      + `SELECT @id:=LAST_INSERT_ID();`
      + `INSERT INTO audit(audit_id, audit_publication_id, audit_publication_sub_id, audit_publication_column, audit_cu_date, audit_cu_user) VALUES`
      + `(NULL, @id, NULL, CONCAT('INSERT: publication_link=', '${util.transSq(basePublication[i]['Publication Link'])}', ', publication_title=', '${util.transSq(basePublication[i]['Publication Title'])}', ', publication_date=', '${basePublication[i]['Publication Date']}', ', primary_author=', '${util.transSq(basePublication[i]['Primary Author'])}', ', authors=', '${util.transSq(basePublication[i]['Author(s)'])}', ',  journal_name=', '${util.transSq(basePublication[i]['Journal Name'])}'), '${util.formatCuDate(new Date())}', '${user}');`
      + `SET @id=NULL;`, link: basePublication[i]['Publication Link']})
    }
    let sql = importSql
    connection.trans(sql, 'importBasePublication').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    })
  }) 
}

selectExportPublication = (query) => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM publication LEFT JOIN publication_sub ON publication.id = publication_sub.publication_id WHERE 1=1 `
        + publicationFilter(query) + `ORDER BY publication_date DESC;`
    connection.execute(sql, 'selectExportPublication').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    })
  })
}

selectAllExportPublication = () => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM publication LEFT JOIN publication_sub ON publication.id = publication_sub.publication_id ORDER BY publication_date DESC;`
    connection.execute(sql, 'selectAllExportPublication').then((res) => {
      resolve(res);
    }).catch((err) => {
      reject(err);
    })
  })
}

module.exports = {
  selectPublication: selectPublication,
  updateBasePublicationField: updateBasePublicationField,
  selectUpdatePublication: selectUpdatePublication,
  selectDeleteSubPublication: selectDeleteSubPublication,
  insertBasePublication: insertBasePublication,
  insertPublication: insertPublication,
  deleteBasePublication: deleteBasePublication,
  deleteSubPublication: deleteSubPublication,
  deletePublication: deletePublication,
  updateBasePublication: updateBasePublication,
  updatePublication: updatePublication,
  importBasePublication: importBasePublication,
  selectExportPublication: selectExportPublication,
  selectAllExportPublication: selectAllExportPublication
}
