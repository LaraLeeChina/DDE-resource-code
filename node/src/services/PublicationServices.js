var sql = require("../db/sql/PublicationSql");
var raSql = require("../db/sql/ResearchAreaSql");
var pSql = require("../db/sql/ProductSql");
var aSql = require("../db/sql/AssaySql");
var plSql = require("../db/sql/PlatformSql");
var ErrorResponse = require("../body/response/ErrorResponse");
var PublicationResponse = require("../body/response/PublicationResponse");
var GetEditPublicationResponse = require("../body/response/GetEditPublicationResponse");
var SuccessResponse = require("../body/response/SuccessResponse");
var nodeExcel = require('node-xlsx');
var util = require('../util/util');
var log4jHandler = require('../log4j/Log4jHandler');
var fs = require("fs");
var iconv = require('iconv-lite');
var pathConfig = require('../path-config');

var getPublication = (query) => {
  return new Promise((resolve, reject) => {
    let index = query.index;
    let offset = query.offset;
    let rows = (index - 1) * offset;
    if(isNaN(rows) || isNaN(offset)) {
      reject(ErrorResponse.error(util.CC, "index and offset are required, and type must be number"))
    } else {
      sql.selectPublication(rows, offset, query).then((publication) => {
        resolve(PublicationResponse.publication(index, publication[1], publication[0]))
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "Select publication fail"));
      });
    }
  });
};

var editBasePublicationField = (id, field, value, user) => {
  return new Promise((resolve, reject) => {
    if(!id || !field || !value) {
      reject(ErrorResponse.error(util.CC, "id, field and value are required"));
    } else {
      if(field != "PublicationTitle" && field != "PublicationLink" && field != "PrimaryAuthor" && field != "Authors" && field != "JournalName" && field != "PublicationDate") {
        reject(ErrorResponse.error(util.CC, "Field is wrong"));
      } else {
        id = id.replace(/\s+/g,"")
        var sqlField = ""
        if(field == "PublicationTitle") {
          sqlField = "publication_title"
        }
        if(field == "PublicationLink") {
          sqlField = "publication_link"
        }
        if(field == "PrimaryAuthor") {
          sqlField = "primary_author"
        }
        if(field == "Authors") {
          sqlField = "authors"
        }
        if(field == "JournalName") {
          sqlField = "journal_name"
        }
        if(field == "PublicationDate") {
          sqlField = "publication_date"
        }
        sql.updateBasePublicationField(id, sqlField, value, user).then(() => {
          resolve(SuccessResponse.edit());
        }).catch((err) => {
          log4jHandler.error(err)
          if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
            reject(ErrorResponse.error(util.orEC, "This publication link is already exist"))
          } else {
            reject(ErrorResponse.error(util.orEC, "Update base publication field fail"));
          }
        });
      }
    }
  });  
}

var getEditPublication = (id, index, offset) => {
  return new Promise((resolve, reject) => {
    let rows = (index - 1) * offset;
    if(!id || isNaN(rows) || isNaN(offset)) {
      reject(ErrorResponse.error(util.CC, "id and index and offset are required, and type must be number"))
    } else {
      id = id.replace(/\s+/g,"")
      sql.selectUpdatePublication(id, rows, offset).then((updatePublication) => {
        if(updatePublication[0].length == 0) {
          reject(ErrorResponse.error(util.orCEC, "can not found this publication"))
        } else {
          resolve(GetEditPublicationResponse.getEditPublication(index, updatePublication[2], updatePublication[0], updatePublication[1]))
        }
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "select update publication fail"))
      })
    }
  })
}

var removePublication = (id, subId, user) => {
  return new Promise((resolve, reject) => {
    if(!id) {
      reject(ErrorResponse.error(util.CC, "Publication id is required"))
    } else {
      id = id.replace(/\s+/g,"")
      if(!subId) {
        sql.selectDeleteSubPublication(id).then((subTotal) => {
          if(subTotal[0].total < 1) {
            sql.deleteBasePublication(id, user).then(() => {
              resolve(SuccessResponse.remove())
            }).catch((err) => {
              log4jHandler.error(err)
              reject(ErrorResponse.error(util.orEC, "delete base publication fail"))
            })
          } else {
            reject(ErrorResponse.error(util.orCEC, "This id can get subentry, but you are not send subId"))
          }
        }).catch((err) => {
          reject(ErrorResponse.error(util.orEC, "select delete sub publication fail"))
        })
      } else {
        subId = subId.replace(/\s+/g,"")
        sql.selectDeleteSubPublication(id).then((subTotal) => {
          if(subTotal[0].total > 1) {
            sql.deleteSubPublication(id, subId, user).then(() => {
              resolve(SuccessResponse.remove())
            }).catch((err) => {
              log4jHandler.error(err)
              reject(ErrorResponse.error(util.orEC, "delete sub publication fail"))
            })
          } else if(subTotal[0].total == 1) {
            sql.deletePublication(id, subId, user).then(() => {
              resolve(SuccessResponse.remove())
            }).catch((err) => {
              log4jHandler.error(err)
              reject(ErrorResponse.error(util.orEC, "delete publication fail"))
            })
          } else {
            reject(ErrorResponse.error(util.orCEC, "this id can not get any subentry"))
          }
        }).catch((err) => {
          reject(ErrorResponse.error(util.orEC, "select delete sub publication fail"))
        })
      }
    }
  })
}

var removeSubPublication = (id, subId, user) => {
  return new Promise((resolve, reject) => {
    if(!id || !subId) {
      reject(ErrorResponse.error(util.CC, "id and subId are required"))
    } else {
      id = id.replace(/\s+/g,"")
      subId = subId.replace(/\s+/g,"")
      sql.deleteSubPublication(id, subId, user).then(() => {
        resolve(SuccessResponse.remove())
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "delete sub publication fail"))
      })
    }
  })
}

var addPublication = (publication, user) => {
  return new Promise((resolve, reject) => {
    if(!publication.PublicationLink || !publication.PublicationTitle || !publication.PublicationDate || !publication.PrimaryAuthor || !publication.Authors || !publication.JournalName) {
      reject(ErrorResponse.error(util.CC, "base publication field are required"))
    } else {
      if(!publication.SubPublication || publication.SubPublication.length == 0) {
        sql.insertBasePublication(publication, user).then((baseSuccess) => {
          resolve(Object.assign(SuccessResponse.add(), {id: baseSuccess[0].insertId}));
        }).catch((err) => {
          log4jHandler.error(err)
          if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
            reject(ErrorResponse.error(util.orEC, "This publication link is already exist"))
          } else {
            reject(ErrorResponse.error(util.orEC, "insert base publication fail"))
          }
        })
      } else {
        var flag = true;
        for(let i = 0; i < publication.SubPublication.length; i++) {
          var subKey = new Array()
          for(var key in publication.SubPublication[i]){
            subKey.push(key)
            if(key != "Part") {
              if(!publication.SubPublication[i][key] || publication.SubPublication[i][key].length == 0) {
                flag = false
              } 
            }
          }
          if(subKey.indexOf('ResearchArea') == -1 || subKey.indexOf('CellLine') == -1 || subKey.indexOf('CellType') == -1 || subKey.indexOf('Species') == -1 || subKey.indexOf('Platform') == -1 || subKey.indexOf('Product') == -1 || subKey.indexOf('Assay') == -1 || subKey.indexOf('CellSeedingDensity') == -1 || subKey.indexOf('PlateCoating') == -1) {
            flag = false
          }
        }
        if(!flag) {
          reject(ErrorResponse.error(util.CC, "sub publication field are required"))
        } else {
          sql.insertPublication(publication, user).then((success) => {
            resolve(Object.assign(SuccessResponse.add(), {id: success[0].insertId}));
          }).catch((err) => {
            log4jHandler.error(err)
            if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
              reject(ErrorResponse.error(util.orEC, "This publication link is already exist"))
            } else {
              reject(ErrorResponse.error(util.orEC, "insert publication fail"))
            }
          })
        }
      }
    }
  })
}

var editPublication = (publication, user) => {
  return new Promise((resolve, reject) => {
    var flag = true
    for(var key in publication) {
      if(!publication[key] && key != 'SubPublication') {
        flag = false
      }
    }
    if(!flag) {
      reject(ErrorResponse.error(util.orCC, "the base publication field have empty value"))
    } else {
      if(!publication.SubPublication || publication.SubPublication.length == 0) {
        sql.updateBasePublication(publication, user).then(() => {
          resolve(SuccessResponse.edit())
        }).catch((err) => {
          log4jHandler.error(err)
          if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
            reject(ErrorResponse.error(util.orEC, "This publication link is already exist"))
          } else {
            reject(ErrorResponse.error(util.orEC, "update base publication fail"))
          }
        })
      } else {
        var subFlag = true
        for(let i = 0; i < publication.SubPublication.length; i++) {
          var subKeyArr = new Array()
          for(var subKey in publication.SubPublication[i]) {
            subKeyArr.push(subKey)
            if(subKey != "Part") {
              if(!publication.SubPublication[i][subKey] || publication.SubPublication[i][subKey].length == 0) {
                subFlag = false
              }
            }
          }
          if(subKeyArr.indexOf("SubId") == -1) {
            if(subKeyArr.indexOf('ResearchArea') == -1 || subKeyArr.indexOf('CellLine') == -1 || subKeyArr.indexOf('CellType') == -1 || subKeyArr.indexOf('Species') == -1 || subKeyArr.indexOf('Platform') == -1 || subKeyArr.indexOf('Product') == -1 || subKeyArr.indexOf('Assay') == -1 || subKeyArr.indexOf('CellSeedingDensity') == -1 || subKeyArr.indexOf('PlateCoating') == -1) {
              subFlag = false
            }
          }
        }
        if(!subFlag) {
          reject(ErrorResponse.error(util.orCC, "sub publication field are required"))
        } else {
          sql.updatePublication(publication, user).then(() => {
            resolve(SuccessResponse.edit())
          }).catch((err) => {
            log4jHandler.error(err)
            if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
              reject(ErrorResponse.error(util.orEC, "This publication link is already exist"))
            } else {
              reject(ErrorResponse.error(util.orEC, "update publication fail"))
            }
          })
        }
      }
    }
  })
}

var importPublication = (file, user) => {
  return new Promise((resolve, reject) => {
    if(!file || file[0].originalname.substring(file[0].originalname.lastIndexOf(".")) != '.xlsx') {
      if(!file) {
        reject(ErrorResponse.error(util.CC, "Didn't get the file"))
      }
      if(file[0].originalname.substring(file[0].originalname.lastIndexOf(".")) != '.xlsx') {
        reject(ErrorResponse.error(util.CC, "File type is not xlsx"))
      }  
    } else {
      var excelFile = file[0].buffer
      var publicationExcel = nodeExcel.parse(excelFile);
      log4jHandler.info("import publication excel parse data: " + JSON.stringify(publicationExcel))
      var title = publicationExcel[0].data[0];
      if(title.indexOf('Publication Title') != -1 && title.indexOf('Journal Name') != -1 && title.indexOf('Publication Date') != -1 && title.indexOf('Author(s)') != -1 && title.indexOf('Publication Link') != -1) {
        var publication = [];
        for(let i = 1; i < publicationExcel[0].data.length; i++) {
          if(publicationExcel[0].data[i].length != 0) {
            var publicationItem = JSON.parse("{}");
            for(let j = 0; j < title.length; j++){
              publicationItem[title[j]] = publicationExcel[0].data[i][j]
              if(title[j] == "Author(s)") {
                publicationItem['Primary Author'] = publicationExcel[0].data[i][j].split(',')[0]
              }
            }
            publication.push(publicationItem)
          }
        }
        for(let i = 0; i < publication.length; i++) {
          publication[i]['Publication Date'] = util.formatDate(new Date(1900, 0, publication[i]['Publication Date'] - 1));
        }
        log4jHandler.info("import publication excel parse data convert format: " + JSON.stringify(publicationExcel))
        sql.importBasePublication(publication, user).then((importResponse) => {
          if(importResponse.length == 0) {
            resolve(SuccessResponse.importExcel())
          } else {
            resolve({link: importResponse})
          }
        }).catch((err) => {
          log4jHandler.error(err)
          if(err.message.indexOf('ER_DUP_ENTRY') != -1) {
            reject(ErrorResponse.error(util.orEC, "This excel have publication link is already exist"))
          } else {
            reject(ErrorResponse.error(util.orEC, "import publication fail"))
          }
        })
      } else {
        reject(ErrorResponse.error(util.CC, "Excel publication data format is wrong"))
      }
    }
  })
}

var exportPublication = (exportFilter) => {
  return new Promise((resolve, reject) => {
    getExportData(exportFilter).then((exportData) => {
      getExportDataValue(parseExportData(exportData)).then((tExportData) => {
        var mergeData = transExportDataValue(tExportData)
        var needExportData = new Array()
        needExportData.push(['ID', 'Publication Link', 'Publication Title', 'Publication Date', 'Primary Author', 'Author(s)', 'Journal Name', 'Research Area', 'Cell Line', 'Cell Types', 'Species', 'Platform', 'Product', 'Assay', 'Cell Seeding Density', 'Plate Coating', 'Part', 'Record-type', 'Create/Update Date'])
        for(let i = 0; i < mergeData.length; i++) {
          needExportData.push([
            'PUB-' + mergeData[i].ID +  (mergeData[i].SubId ? '-' + mergeData[i].SubId : ''),
            mergeData[i].PublicationLink,
            mergeData[i].PublicationTitle,
            mergeData[i].PublicationDate,
            mergeData[i].PrimaryAuthor,
            mergeData[i].Authors,
            mergeData[i].JournalName,
            mergeData[i].ResearchArea,
            mergeData[i].CellLine,
            mergeData[i].CellTypes,
            mergeData[i].Species,
            mergeData[i].Platform,
            mergeData[i].Product,
            mergeData[i].Assay,
            mergeData[i].CellSeedingDensity,
            mergeData[i].PlateCoating,
            mergeData[i].part,
            mergeData[i].RecordType,
            mergeData[i].CUDate
          ])  
        }
        //var content = ''
        //for(let i = 0; i < needExportData.length; i++) {
          //content = content + needExportData[i].join(',') + '\n'
        //}
        //let buffer = Buffer.from(content);
        var result = nodeExcel.build([{name:'sheet1', data: needExportData}]);
        //var result = iconv.encode(buffer, 'UCS-2BE')
        resolve(result)
      }).catch((err) => {
        reject(err)
      })  
    }).catch((err) => {
      reject(err)
    })  
  })
}

var exportPublicationToEndeca = () => {
  return new Promise((resolve, reject) => {
    getAllExportData().then((exportData) => {
      getExportDataValue(parseExportData(exportData)).then((tExportData) => {
        var mergeData = mergeExportData(transExportDataValue(tExportData))
        var needExportData = new Array()
        needExportData.push(['ID', 'Publication Link', 'Publication Title', 'Publication Date', 'Primary Author', 'Author(s)', 'Journal Name', 'Research Area', 'Cell Line', 'Cell Types', 'Species', 'Platform', 'Product', 'Assay', 'Cell Seeding Density', 'Plate Coating', 'Part', 'Record-type', 'Create/Update Date'])
        for(let i = 0; i < mergeData.length; i++) {
          needExportData.push([
            mergeData[i].ID,
            mergeData[i].PublicationLink,
            mergeData[i].PublicationTitle,
            mergeData[i].PublicationDate,
            mergeData[i].PrimaryAuthor,
            mergeData[i].Authors,
            mergeData[i].JournalName,
            mergeData[i].ResearchArea,
            mergeData[i].CellLine,
            mergeData[i].CellTypes,
            mergeData[i].Species,
            mergeData[i].Platform,
            mergeData[i].Product,
            mergeData[i].Assay,
            mergeData[i].CellSeedingDensity,
            mergeData[i].PlateCoating,
            mergeData[i].part,
            mergeData[i].RecordType,
            mergeData[i].CUDate
          ])  
        }
        var result = nodeExcel.build([{name:'sheet1', data:needExportData}]);
        resolve(result)
      }).catch((err) => {
        reject(err)
      })  
    }).catch((err) => {
      reject(err)
    })  
  })
}

var pushToEndeca = () => {
  return new Promise((resolve, reject) => {
    getAllExportData().then((exportData) => {
      getExportDataValue(parseExportData(exportData)).then((tExportData) => {
        var mergeData = mergeExportData(transExportDataValue(tExportData))
        var needExportData = new Array()
        needExportData.push(['ID', 'Publication Link', 'Publication Title', 'Publication Date', 'Primary Author', 'Author(s)', 'Journal Name', 'Research Area', 'Cell Line', 'Cell Types', 'Species', 'Platform', 'Product', 'Assay', 'Cell Seeding Density', 'Plate Coating', 'Part', 'Record-type', 'Create/Update Date'])
        for(let i = 0; i < mergeData.length; i++) {
          needExportData.push([
            mergeData[i].ID,
            mergeData[i].PublicationLink,
            mergeData[i].PublicationTitle,
            mergeData[i].PublicationDate,
            mergeData[i].PrimaryAuthor,
            mergeData[i].Authors,
            mergeData[i].JournalName,
            mergeData[i].ResearchArea,
            mergeData[i].CellLine,
            mergeData[i].CellTypes,
            mergeData[i].Species,
            mergeData[i].Platform,
            mergeData[i].Product,
            mergeData[i].Assay,
            mergeData[i].CellSeedingDensity,
            mergeData[i].PlateCoating,
            mergeData[i].part,
            mergeData[i].RecordType,
            mergeData[i].CUDate
          ])  
        }
        var content = ''
        for(let i = 0; i < needExportData.length; i++) {
          content = content + needExportData[i].join('    ') + '\n'
        }
        let buffer = Buffer.from(content);
        var tBuffer = iconv.encode(buffer, 'ucs2')
        fs.writeFileSync(pathConfig.path + 'DDE_Publication_Endeca_' + util.formatExportDate(new Date()) + '.txt', tBuffer);
        resolve(SuccessResponse.pushToEndeca())
      }).catch((err) => {
        reject(err)
      })  
    }).catch((err) => {
      reject(err)
    })  
  })
}

var getAllExportData = () => {
  return new Promise((resolve, reject) => {
    var data = new Array()
    sql.selectAllExportPublication().then((publication) => {
      if(publication.length >= 1) {
        for(let i = 0; i < publication.length; i++) {
          data.push(
            {
              ID: publication[i].id,
              PublicationLink: publication[i].publication_link,
              PublicationTitle: publication[i].publication_title,
              PublicationDate: util.formatDateUSA(new Date(publication[i].publication_date)),
              PrimaryAuthor: publication[i].primary_author,
              Authors: util.trimSpace(publication[i].authors),
              JournalName: publication[i].journal_name,
              CUDate: util.formatCuDateUSA(new Date(publication[i].cu_date)),
              SubId: publication[i].sub_id,
              ResearchArea: publication[i].research_area,
              CellLine: publication[i].cell_line,
              CellTypes: publication[i].cell_type,
              Species: publication[i].species,
              Platform: publication[i].platform,
              Product: publication[i].product,
              Assay: publication[i].assay,
              CellSeedingDensity: publication[i].cell_seeding_density,
              PlateCoating: publication[i].plate_coating,
              part: publication[i].part,
              RecordType: 'Rollup',
            }
          )
        }
        resolve(data)
      } else {
        reject(ErrorResponse.error(util.CC, "can't get any data"))
      }
    }).catch((err) => {
      log4jHandler.error(err)
      reject(ErrorResponse.error(util.orEC, "select all export publication fail"))
    })
  })
}

var getExportData = (exportFilter) => {
  return new Promise((resolve, reject) => {
    var data = new Array()
    sql.selectExportPublication(exportFilter).then((publication) => { 
      if(publication.length >= 1) {
        for(let i = 0; i < publication.length; i++) {
          data.push(
            {
              ID: publication[i].id,
              PublicationLink: publication[i].publication_link,
              PublicationTitle: publication[i].publication_title,
              PublicationDate: util.formatDateUSA(new Date(publication[i].publication_date)),
              PrimaryAuthor: publication[i].primary_author,
              Authors: util.trimSpace(publication[i].authors),
              JournalName: publication[i].journal_name,
              CUDate: util.formatCuDateUSA(new Date(publication[i].cu_date)),
              SubId: publication[i].sub_id,
              ResearchArea: publication[i].research_area,
              CellLine: publication[i].cell_line,
              CellTypes: publication[i].cell_type,
              Species: publication[i].species,
              Platform: publication[i].platform,
              Product: publication[i].product,
              Assay: publication[i].assay,
              CellSeedingDensity: publication[i].cell_seeding_density,
              PlateCoating: publication[i].plate_coating,
              part: publication[i].part,
              RecordType: 'Rollup',
            }
          )
        }
        resolve(data)
      } else {
        reject(ErrorResponse.error(util.CC, "use this filter can't get any data"))
      }
    }).catch((err) => {
      log4jHandler.error(err)
      reject(ErrorResponse.error(util.orEC, "select export publication fail"))
    })
  })
}

var parseExportData = (data) => {
  for(let i = 0; i < data.length; i++) {
    var researchAreaArr = new Array()
    var productArr = new Array()
    var assayArr = new Array()
    if(data[i].SubId) {
      if(data[i].ResearchArea.indexOf("~") != -1) {
        var rs = data[i].ResearchArea.split("~")
        for(let ri = 0; ri < rs.length; ri++) {
          researchAreaArr.push(rs[ri])
        }
      } else {
        researchAreaArr.push(data[i].ResearchArea)
      }
      if(data[i].Product.indexOf("~") != -1) {
        var ps = data[i].Product.split("~")
        for(let pi = 0; pi < ps.length; pi++) {
          productArr.push(ps[pi])
        }
      } else {
        productArr.push(data[i].Product)
      }
      if(data[i].Assay.indexOf("~") != -1) {
        var as = data[i].Assay.split("~")
        for(let ai = 0; ai < as.length; ai++) {
          assayArr.push(as[ai])
        }
      } else {
        assayArr.push(data[i].Assay)
      }
    }
    data[i].ResearchArea = researchAreaArr
    data[i].Product = productArr
    data[i].Assay = assayArr
  }
  return data
}

var getExportDataValue = (data) => {
  return new Promise((resolve, reject) => {
    raSql.selectReasearchAreaExportValue().then((raExportValue) => { 
      pSql.selectProductExportValue().then((pExportValue) => {
        aSql.selectAssayExportValue().then((aExportValue) => {
          plSql.selectPlatformExportValue().then((plExportValue) => {
            for(let e = 0; e < data.length; e++) {
              for(let ei = 0; ei < data[e].ResearchArea.length; ei++) {
                var rFlag = false
                for(let i = 0; i < raExportValue.length; i++) {
                  if(data[e].ResearchArea[ei] == raExportValue[i].research_area_value) {
                    rFlag = true
                    data[e].ResearchArea[ei] = raExportValue[i].research_area_export
                  }
                }
                if(!rFlag) {
                  data[e].ResearchArea[ei] = ""
                }
              }
              for(let ej = 0; ej < data[e].Product.length; ej++) {
                var pFlag = false;
                for(let j = 0; j < pExportValue.length; j++) {
                  if(data[e].Product[ej] == pExportValue[j].product_value && data[e].Platform == pExportValue[j].platform_fk) {
                    pFlag = true
                    data[e].Product[ej] = pExportValue[j].product_export_value
                  }
                }
                if(!pFlag) {
                  data[e].Product[ej] = ""
                }
              }
              for(let ek = 0; ek < data[e].Assay.length; ek++) {
                var aFlag = false;
                for(let k = 0; k < aExportValue.length; k++) {
                  if(data[e].Assay[ek] == aExportValue[k].assay_by_business_value) {
                    aFlag = true
                    data[e].Assay[ek] = aExportValue[k].assay_by_business_export_value
                  }
                }
                if(!aFlag) {
                  data[e].Assay[ek] = ""
                }
              }  
            }
            for(let ep = 0; ep < data.length; ep++) {
              var plFlag = false;
              for(let m = 0; m < plExportValue.length; m++) {
                if(data[ep].Platform == plExportValue[m].platform_value) {
                  plFlag = true
                  data[ep].Platform = plExportValue[m].platform_export_value
                }
              }
              if(!plFlag) {
                data[ep].Platform = ""
              }
            }
            resolve(data)
          }).catch((err) => {
            log4jHandler.error(err)
            reject(ErrorResponse.error(util.orEC, "select platform export value fail"))
          })
        }).catch((err) => {
          log4jHandler.error(err)
          reject(ErrorResponse.error(util.orEC, "select assay export value fail"))
        })
      }).catch((err) => {
        log4jHandler.error(err)
        reject(ErrorResponse.error(util.orEC, "select product export value fail"))
      })
    }).catch((err) => {
      log4jHandler.error(err)
      reject(ErrorResponse.error(util.orEC, "select research area export value fail"))
    })
  })
}

var transExportDataValue = (exportDataValue) => {
  var value
  for(let i = 0; i < exportDataValue.length; i++) {
    var rValue;
    var pValue;
    var aValue;
    for(let ri = 0; ri < exportDataValue[i].ResearchArea.length; ri++) {
      if(ri == 0) {
        rValue = exportDataValue[i].ResearchArea[ri]
      } else {
        rValue = rValue + "~" + exportDataValue[i].ResearchArea[ri]
      }
    }
    for(let pi = 0; pi < exportDataValue[i].Product.length; pi++) {
      if(pi == 0) {
        pValue = exportDataValue[i].Product[pi]
      } else {
        pValue = pValue + "~" + exportDataValue[i].Product[pi]
      }
    }
    for(let ai = 0; ai < exportDataValue[i].Assay.length; ai++) {
      if(ai == 0) {
        aValue = exportDataValue[i].Assay[ai]
      } else {
        aValue = aValue + "~" + exportDataValue[i].Assay[ai]
      }
    }
    exportDataValue[i].ResearchArea = rValue
    exportDataValue[i].Product = pValue
    exportDataValue[i].Assay = aValue
  }
  return exportDataValue
}

var mergeExportData = (data) => {
  var mergeData = JSON.parse('{}')
  for(let i = 0; i < data.length; i++) {
    if(!mergeData[data[i].ID]) {
      mergeData[data[i].ID] = new Array()
      mergeData[data[i].ID].push(data[i])
    } else {
      mergeData[data[i].ID].push(data[i])
    }
  }
  for(var key in mergeData) {
    var merge = JSON.parse(JSON.stringify(mergeData[key][0]))
    merge.ID = "PBM-" + merge.ID
    merge.RecordType = "Mega"
    merge.SubCUDate = merge.SubId ? merge.CUDate : ''
    if(merge.SubId) {
      for(let k = 0; k < mergeData[key].length; k++) {
        for(let m = 0; m < mergeData[key][k].ResearchArea.split('~').length; m++) {
          if(merge.ResearchArea.indexOf(mergeData[key][k].ResearchArea.split('~')[m]) == -1) {
            merge.ResearchArea =  merge.ResearchArea + "~" + mergeData[key][k].ResearchArea.split('~')[m]
          }
        }
        for(let m = 0; m < mergeData[key][k].CellLine.split('~').length; m++) {
          if(merge.CellLine.indexOf(mergeData[key][k].CellLine.split('~')[m]) == -1) {
            merge.CellLine =  merge.CellLine + "~" + mergeData[key][k].CellLine.split('~')[m]
          }
        }
        for(let m = 0; m < mergeData[key][k].CellTypes.split('~').length; m++) {
          if(merge.CellTypes.indexOf(mergeData[key][k].CellTypes.split('~')[m]) == -1) {
            merge.CellTypes =  merge.CellTypes + "~" + mergeData[key][k].CellTypes.split('~')[m]
          }
        }
        for(let m = 0; m < mergeData[key][k].Species.split('~').length; m++) {
          if(merge.Species.indexOf(mergeData[key][k].Species.split('~')[m]) == -1) {
            merge.Species =  merge.Species + "~" + mergeData[key][k].Species.split('~')[m]
          }
        }
        for(let m = 0; m < mergeData[key][k].Platform.split('~').length; m++) {
          if(merge.Platform != mergeData[key][k].Platform.split('~')[m]) {
            merge.Platform =  merge.Platform + "~" + mergeData[key][k].Platform.split('~')[m]
          }
        }
        for(let m = 0; m < mergeData[key][k].Product.split('~').length; m++) {
          if(merge.Product.indexOf(mergeData[key][k].Product.split('~')[m]) == -1) {
            merge.Product =  merge.Product + "~" + mergeData[key][k].Product.split('~')[m]
          }
        }
        for(let m = 0; m < mergeData[key][k].Assay.split('~').length; m++) {
          if(merge.Assay.indexOf(mergeData[key][k].Assay.split('~')[m]) == -1) {
            merge.Assay =  merge.Assay + "~" + mergeData[key][k].Assay.split('~')[m]
          }
        }
        for(let m = 0; m < mergeData[key][k].CellSeedingDensity.split('~').length; m++) {
          if(merge.CellSeedingDensity.indexOf(mergeData[key][k].CellSeedingDensity.split('~')[m]) == -1) {
            merge.CellSeedingDensity =  merge.CellSeedingDensity + "~" + mergeData[key][k].CellSeedingDensity.split('~')[m]
          }
        }
        for(let m = 0; m < mergeData[key][k].PlateCoating.split('~').length; m++) {
          if(merge.PlateCoating.indexOf(mergeData[key][k].PlateCoating.split('~')[m]) == -1) {
            merge.PlateCoating =  merge.PlateCoating + "~" + mergeData[key][k].PlateCoating.split('~')[m]
          }
        }
        for(let m = 0; m < (mergeData[key][k].part ? mergeData[key][k].part : '').split('~').length; m++) {
          if((merge.part ? merge.part : '').indexOf((mergeData[key][k].part ? mergeData[key][k].part : '').split('~')[m]) == -1) {
            merge.part =  merge.part + "~" + (mergeData[key][k].part ? mergeData[key][k].part : '').split('~')[m]
          }
        }
      }
    }
    mergeData[key].push(merge)
  }
  var newMergeData = new Array()
  for(var nkey in mergeData) {
    for(let j = 0; j < mergeData[nkey].length; j++) {
      if(mergeData[nkey][j].RecordType == 'Rollup' || !mergeData[nkey][j].RecordType) {
        mergeData[nkey][j].RecordType = 'Rollup'
        mergeData[nkey][j].ID = "PUB-" + mergeData[nkey][j].ID + (mergeData[nkey][j].SubId ? '-' + mergeData[nkey][j].SubId : '')
      }
      newMergeData.push(mergeData[nkey][j])
    }
  }
  return newMergeData
}

module.exports = {
  getPublication: getPublication,
  editBasePublicationField: editBasePublicationField,
  getEditPublication: getEditPublication,
  addPublication: addPublication,
  removePublication: removePublication,
  removeSubPublication: removeSubPublication,
  editPublication: editPublication,
  importPublication: importPublication,
  exportPublication: exportPublication,
  exportPublicationToEndeca: exportPublicationToEndeca,
  pushToEndeca: pushToEndeca
}