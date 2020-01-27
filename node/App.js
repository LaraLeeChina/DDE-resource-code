var publicationServices = require("./src/services/PublicationServices");
var speciesServices = require("./src/services/SpeciesServices");
var cellServices = require("./src/services/CellServices");
var researchAreaServices = require("./src/services/ResearchAreaServices");
var cellSeedingDensityServices = require("./src/services/CellSeedingDensityServices");
var plateCoatingServices = require("./src/services/PlateCoatingServices");
var platformServices = require("./src/services/PlatformServices");
var productServices = require("./src/services/ProductServices");
var partServices = require("./src/services/PartServices");
var assayServices = require("./src/services/AssayServices");
var userServices = require("./src/services/UserServices");
var businessServices = require("./src/services/BusinessServices");
var util = require("./src/util/util");
var express = require("express");
var authorization = require("./src/okta/Authorization");
var log4jHandler = require("./src/log4j/Log4jHandler");
const app = express();
var bodyParser = require('body-parser');
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

var loginRes;
var logoutRes;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cache-Control,Pragma,Expires');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};
app.use(allowCrossDomain);

var port = 5555
// var port = 8555

app.listen(port, (err) => {
  if(err) {
    log4jHandler.error("Run Application Fail: " + err)
  } else {
    log4jHandler.info("Run Application Success, Port: ", port);
  }
})

logRequestInfo = (api, payload) => {
  if(!payload) {
    log4jHandler.info(api + " request")
  } else {
    log4jHandler.info(api + " request payload: " + JSON.stringify(payload))
  }
}

//DONE!
app.get('/login', (req, res) => {
  logRequestInfo('/login request')
  authorization.auth(req).then((user) => {
    userServices.verifyUser(user).then(() => {
      res.send({'login': 'login successful'})
    }).catch((err) => {
      res.status(500).send(err)
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!
app.get('/publication',(req, res) => {
  logRequestInfo('GET /publication', req.query)
  authorization.auth(req).then(() => {
    publicationServices.getPublication(req.query).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!
app.put('/publication/edit/:id',(req, res) => {
  logRequestInfo('/publication/edit/:id', req.body)
  authorization.auth(req).then((user) => {
    var id = req.params.id;
    var fieldBody = req.body;
    var field = "";
    var value = "";
    for (var key in fieldBody) {
      field = key;
      value = fieldBody[key];
    }
    publicationServices.editBasePublicationField(id, field, value, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!
app.get('/publication/getedit', (req, res) => {
  logRequestInfo('/publication/getedit', req.query)
  authorization.auth(req).then(() => {
    let index = req.query.index;
    let offset = req.query.offset;
    let id = req.query.id;
    publicationServices.getEditPublication(id, index, offset).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!
app.delete('/publication', (req, res) => {
  logRequestInfo('Delete /publication', req.query)
  let id = req.query.id
  let subId = req.query.subId
  authorization.auth(req).then((user) => { 
    publicationServices.removePublication(id, subId, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!
app.delete('/publication/sub', (req, res) => {
  logRequestInfo('Delete /publication/sub', req.query)
  let id = req.query.id
  let subId = req.query.subId
  authorization.auth(req).then((user) => { 
    publicationServices.removeSubPublication(id, subId, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!
app.post('/publication', (req, res) => {
  logRequestInfo('POST /publication', req.body)
  authorization.auth(req).then((user) => { 
    publicationServices.addPublication(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!
app.put('/publication', (req, res) => {
  logRequestInfo('PUT /publication', req.body)
  authorization.auth(req).then((user) => { 
    publicationServices.editPublication(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!
app.post('/publication/import', upload.any(), (req, res) => {
  logRequestInfo('/publication/import', req.files[0].originalname)
  authorization.auth(req).then((user) => { 
    publicationServices.importPublication(req.files, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/publication/export', (req, res) => {
  logRequestInfo('/publication/export', req.query)
  authorization.auth(req).then(() => { 
    publicationServices.exportPublication(req.query).then((response) => {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader("Content-Disposition", "attachment; filename=" + "DDE_Publication_" + util.formatCuDateUSA(new Date()) + ".xlsx");
      res.end(response, 'binary');
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/publication/export/endeca', (req, res) => {
  logRequestInfo('/publication/export/endeca')
  authorization.auth(req).then(() => { 
    publicationServices.exportPublicationToEndeca().then((response) => {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader("Content-Disposition", "attachment; filename=" + "DDE_Publication_Endeca" + util.formatCuDateUSA(new Date()) + ".xlsx");
      res.end(response, 'binary');
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/publication/export/endeca/push', (req, res) => {
  logRequestInfo('/publication/export/endeca/push')
  authorization.auth(req).then(() => { 
    publicationServices.pushToEndeca().then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/species', (req, res) => {
  logRequestInfo('GET /species')
  authorization.auth(req).then(() => { 
    speciesServices.getSpecies().then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/species/page', (req, res) => {
  logRequestInfo('/species/page', req.query)
  authorization.auth(req).then(() => { 
    speciesServices.getSpeciesByPage(req.query.index, req.query.offset, req.query.value).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.put('/species', (req, res) => {
  logRequestInfo('PUT /species', req.body)
  authorization.auth(req).then((user) => { 
    speciesServices.editSpecies(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })  
})

//DONE!!
app.post('/species', (req, res) => {
  logRequestInfo('POST /species', req.body)
  authorization.auth(req).then((user) => { 
    speciesServices.addSpecies(req.body.value, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })    
})

//DONE!!
app.delete('/species', (req, res) => {
  logRequestInfo('DELETE /species', req.query)
  authorization.auth(req).then(() => {
    speciesServices.removeSpecies(req.query.key).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })    
})

//DONE!!
app.get('/researcharea', (req, res) => {
  logRequestInfo('GET /researcharea')
  authorization.auth(req).then(() => { 
    researchAreaServices.getResearchArea().then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/researcharea/page', (req, res) => {
  logRequestInfo('/researcharea/page', req.query)
  authorization.auth(req).then(() => { 
    researchAreaServices.getResearchAreaByPage(req.query.index, req.query.offset, req.query.value, req.query.exportValue).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.put('/researcharea', (req, res) => {
  logRequestInfo('PUT /researcharea', req.body)
  authorization.auth(req).then((user) => { 
    researchAreaServices.editResearchArea(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.post('/researcharea', (req, res) => {
  logRequestInfo('POST /researcharea', req.body)
  authorization.auth(req).then((user) => { 
    researchAreaServices.addResearchArea(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  }) 
})

//DONE!!
app.delete('/researcharea', (req, res) => {
  logRequestInfo('DELETE /researcharea', req.query)
  authorization.auth(req).then(() => { 
    researchAreaServices.removeResearchArea(req.query.key).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  }) 
})

//DONE!!
app.get('/cellseedingdensity', (req, res) => {
  logRequestInfo('GET /cellseedingdensity')
  authorization.auth(req).then(() => { 
    cellSeedingDensityServices.getCellSeedingDensity().then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/cellseedingdensity/page', (req, res) => {
  logRequestInfo('/cellseedingdensity/page', req.query)
  authorization.auth(req).then(() => { 
    cellSeedingDensityServices.getCellSeedingDensityByPage(req.query.index, req.query.offset, req.query.value).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.put('/cellseedingdensity', (req, res) => {
  logRequestInfo('PUT /cellseedingdensity', req.body)
  authorization.auth(req).then((user) => { 
    cellSeedingDensityServices.editCellSeedingDensity(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })  
})

//DONE!!
app.post('/cellseedingdensity', (req, res) => {
  logRequestInfo('POST /cellseedingdensity', req.body)
  authorization.auth(req).then((user) => { 
    cellSeedingDensityServices.addCellSeedingDensity(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })    
})

//DONE!!
app.delete('/cellseedingdensity', (req, res) => {
  logRequestInfo('DELETE /cellseedingdensity', req.query)
  authorization.auth(req).then(() => { 
    cellSeedingDensityServices.removeSeedingDensity(req.query.key).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })  
})

//DONE!!
app.get('/platecoating', (req, res) => {
  logRequestInfo('GET /platecoating')
  authorization.auth(req).then(() => { 
    plateCoatingServices.getPlateCoating().then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/platecoating/page', (req, res) => {
  logRequestInfo('/platecoating/page', req.query)
  authorization.auth(req).then(() => { 
    plateCoatingServices.getPlateCoatingByPage(req.query.index, req.query.offset, req.query.value).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.put('/platecoating', (req, res) => {
  logRequestInfo('PUT /platecoating', req.body)
  authorization.auth(req).then((user) => { 
    plateCoatingServices.editPlateCoating(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.post('/platecoating', (req, res) => {
  logRequestInfo('POST /platecoating', req.body)
  authorization.auth(req).then((user) => { 
    plateCoatingServices.addPlateCoating(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.delete('/platecoating', (req, res) => {
  logRequestInfo('DELETE /platecoating', req.query)
  authorization.auth(req).then(() => { 
    plateCoatingServices.removePlateCoating(req.query.key).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/celltypes', (req, res) => {
  logRequestInfo('GET /celltypes', req.query)
  authorization.auth(req).then(() => { 
    cellServices.getCellTypes(req.query.cellLine).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/celltypes/page', (req, res) => {
  logRequestInfo('/celltypes/page', req.query)
  authorization.auth(req).then(() => { 
    cellServices.getCellTypesByPage(req.query.index, req.query.offset, req.query.value).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.put('/celltypes', (req, res) => {
  logRequestInfo('PUT /celltypes', req.body)
  authorization.auth(req).then((user) => { 
    cellServices.editCellTypes(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.post('/celltypes', (req, res) => {
  logRequestInfo('POST /celltypes', req.body)
  authorization.auth(req).then((user) => { 
    cellServices.addCellTypes(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.delete('/celltypes', (req, res) => {
  logRequestInfo('DELETE /celltypes', req.query)
  authorization.auth(req).then(() => { 
    cellServices.removeCellTypes(req.query.key).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/cellline', (req, res) => {
  logRequestInfo('GET /cellline')
  authorization.auth(req).then(() => { 
    cellServices.getCellLine().then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/cellline/page', (req, res) => {
  logRequestInfo('/cellline/page', req.query)
  authorization.auth(req).then(() => { 
    cellServices.getCellLineByPage(req.query.index, req.query.offset, req.query.value, req.query.cellTypes).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.put('/cellline', (req, res) => {
  logRequestInfo('PUT /cellline', req.body)
  authorization.auth(req).then((user) => { 
    cellServices.editCellLine(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.post('/cellline', (req, res) => {
  logRequestInfo('POST /cellline', req.body)
  authorization.auth(req).then((user) => { 
    cellServices.addCellLine(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.delete('/cellline', (req, res) => {
  logRequestInfo('DELETE /cellline', req.query)
  authorization.auth(req).then(() => { 
    cellServices.removeCellLine(req.query.id).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/platform', (req, res) => {
  logRequestInfo('GET /platform')
  authorization.auth(req).then(() => { 
    platformServices.getPlatform().then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/platform/page', (req, res) => {
  logRequestInfo('/platform/page', req.query)
  authorization.auth(req).then(() => { 
    platformServices.getPlatformByPage(req.query.index, req.query.offset, req.query.value, req.query.exportValue, req.query.business).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.put('/platform', (req, res) => {
  logRequestInfo('PUT /platform', req.body)
  authorization.auth(req).then((user) => { 
    platformServices.editPlatform(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})


//DONE!!
app.post('/platform', (req, res) => {
  logRequestInfo('POST /platform', req.body)
  authorization.auth(req).then((user) => { 
    platformServices.addPlatform(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.delete('/platform', (req, res) => {
  logRequestInfo('DELETE /platform', req.query)
  authorization.auth(req).then(() => { 
    platformServices.removePlatform(req.query.key).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/product', (req, res) => {
  logRequestInfo('GET /product', req.query)
  authorization.auth(req).then(() => { 
    productServices.getProduct(req.query.platform, req.query.action).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/product/business', (req, res) => {
  logRequestInfo('GET /product/business', req.query)
  authorization.auth(req).then(() => { 
    productServices.getProductByBusiness(req.query.business).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/product/page', (req, res) => {
  logRequestInfo('/product/page', req.query)
  authorization.auth(req).then(() => { 
    productServices.getProductByPage(req.query.index, req.query.offset, req.query.value, req.query.exportValue, req.query.platform).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.put('/product', (req, res) => {
  logRequestInfo('PUT /product', req.body)
  authorization.auth(req).then((user) => { 
    productServices.editProduct(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.post('/product', (req, res) => {
  logRequestInfo('POST /product', req.body)
  authorization.auth(req).then((user) => { 
    productServices.addProduct(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.delete('/product', (req, res) => {
  logRequestInfo('DELETE /product', req.query)
  authorization.auth(req).then(() => { 
    productServices.removeProduct(req.query.id).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/part', (req, res) => {
  logRequestInfo('GET /part', req.query)
  authorization.auth(req).then(() => { 
    partServices.getPart(req.query.product, req.query.assay).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/part/page', (req, res) => {
  logRequestInfo('/part/page', req.query)
  authorization.auth(req).then(() => { 
    partServices.getPartByPage(req.query.index, req.query.offset, req.query.value).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.put('/part', (req, res) => {
  logRequestInfo('PUT /part', req.body)
  authorization.auth(req).then((user) => { 
    partServices.editPart(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.post('/part', (req, res) => {
  logRequestInfo('POST /part', req.body)
  authorization.auth(req).then((user) => { 
    partServices.addPart(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.delete('/part', (req, res) => {
  logRequestInfo('DELETE /part', req.query)
  authorization.auth(req).then(() => { 
    partServices.removePart(req.query.key).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/assay', (req, res) => {
  logRequestInfo('GET /assay', req.query)
  authorization.auth(req).then(() => { 
    assayServices.getAssay(req.query.product).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/assay/page', (req, res) => {
  logRequestInfo('/assay/page', req.query)
  authorization.auth(req).then(() => { 
    assayServices.getAssayByPage(req.query.index, req.query.offset, req.query.value, req.query.exportValue, req.query.business, req.query.product, req.query.part).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/assayForPnsProduct', (req, res) => {
  logRequestInfo('GET /assayForPnsProduct')
  authorization.auth(req).then(() => { 
    assayServices.getAssayForPnsProduct().then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/assayByBusiness/page', (req, res) => {
  logRequestInfo('GET /assayByBusiness/page', req.query)
  authorization.auth(req).then(() => { 
    assayServices.getAssayByBusinessByPage(req.query.index, req.query.offset, req.query.value, req.query.exportValue, req.query.business).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/assayPnsByProduct/page', (req, res) => {
  logRequestInfo('GET /assayPnsByProduct/page', req.query)
  authorization.auth(req).then(() => { 
    assayServices.getAssayPnsByProductByPage(req.query.index, req.query.offset, req.query.value, req.query.product, req.query.part).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.put('/assay', (req, res) => {
  logRequestInfo('PUT /assay', req.body)
  authorization.auth(req).then((user) => { 
    assayServices.editAssay(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.put('/assayByBusiness', (req, res) => {
  logRequestInfo('PUT /assayByBusiness', req.body)
  authorization.auth(req).then((user) => { 
    assayServices.editAssayByBusiness(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.put('/assayPnsByProduct', (req, res) => {
  logRequestInfo('PUT /assayPnsByProduct', req.body)
  authorization.auth(req).then((user) => { 
    assayServices.editAssayPnsByProduct(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.post('/assay', (req, res) => {
  logRequestInfo('POST /assay', req.body)
  authorization.auth(req).then((user) => { 
    assayServices.addAssay(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.post('/assayByBusiness', (req, res) => {
  logRequestInfo('POST /assayByBusiness', req.body)
  authorization.auth(req).then((user) => { 
    assayServices.addAssayByBusiness(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.post('/assayPnsByProduct', (req, res) => {
  logRequestInfo('POST /assayPnsByProduct', req.body)
  authorization.auth(req).then((user) => { 
    assayServices.addAssayPnsByProduct(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.delete('/assay', (req, res) => {
  logRequestInfo('DELETE /assay', req.query)
  authorization.auth(req).then(() => { 
    assayServices.removeAssay(req.query.id).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.delete('/assayByBusiness', (req, res) => {
  logRequestInfo('DELETE /assayByBusiness', req.query)
  authorization.auth(req).then(() => { 
    assayServices.removeAssayByBusiness(req.query.id).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.delete('/assayPnsByProduct', (req, res) => {
  logRequestInfo('DELETE /assayPnsByProduct', req.query)
  authorization.auth(req).then(() => { 
    assayServices.removeAssayPnsByProduct(req.query.id).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/business', (req, res) => {
  logRequestInfo('GET /business')
  authorization.auth(req).then(() => { 
    businessServices.getBusiness().then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.get('/business/page', (req, res) => {
  logRequestInfo('GET /business/page', req.query)
  authorization.auth(req).then(() => { 
    businessServices.getBusinessByPage(req.query.index, req.query.offset, req.query.value).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.put('/business', (req, res) => {
  logRequestInfo('PUT /business', req.body)
  authorization.auth(req).then((user) => { 
    businessServices.editBusiness(req.body, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.post('/business', (req, res) => {
  logRequestInfo('POST /business', req.body)
  authorization.auth(req).then((user) => { 
    businessServices.addBusiness(req.body.value, user).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})

//DONE!!
app.delete('/business', (req, res) => {
  logRequestInfo('DELETE /business', req.query)
  authorization.auth(req).then(() => { 
    businessServices.removeBusiness(req.query.key).then((response) => {
      res.send(response)
    }).catch((err) => {
      res.status(500).send(err);
    })
  }).catch((err) => {
    res.status(401).send(err);
  })
})


