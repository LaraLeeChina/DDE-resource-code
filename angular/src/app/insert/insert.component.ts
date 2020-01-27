import { Component, OnInit, Type, ViewEncapsulation } from '@angular/core';

import { Http, ResponseOptions, Headers, URLSearchParams, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IntlService } from '@progress/kendo-angular-intl';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Product, tableSourceInform } from '../shared/get-table-inform.service';
import { FormGroup, Validators, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Service } from './../../services/service';


const rollUpStringToJson = (item: string, list: Array<any>): any => {
  const valueItems = [];
  var itemArr = [];
  if (item) {
    if (item.includes('~')) {
      itemArr = item.split('~');
    } else {
      itemArr.push(item);
    }
  }
  if (item && list) {
    itemArr.forEach(j => {
      var a = list.filter(i => i.value === j);
      valueItems.push(a[0]);
    });
  }

  return itemArr;
}

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InsertComponent implements OnInit {
  private pubID: string;
  private offset: 25;
  private indexPage: 1;
  private publicationDetail: any;
  private subPublicationDetail: any;
  private basicFormModel: FormGroup;
  backText = "<Back"
  dialogOpened: boolean = false
  removeIndex;

  filters

  private subFormModel: FormGroup = new FormGroup({
    researchArea: new FormControl([]),
    cellLine: new FormControl(''),
    cellType: new FormControl(''),
    species: new FormControl(''),
    platform: new FormControl(''),
    Product: new FormControl(''),
    Assay: new FormControl(''),
    cellSeedingDensity: new FormControl(''),
    plateCoating: new FormControl(''),
    part: new FormControl(''),
    subId: new FormControl('')
  });
  public subPubColumnformat: GridDataResult = {
    data: [],
    total: 0
  };
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 25
  };
  //private ravalue = [{key: 'Nephrology Research', value: 1}];
  public researchAreaListItem: Array<{ key: string, value: number | string }>;
  public speciesListItem: Array<{ key: string, value: number | string }>;
  public CSDListItem: Array<{ key: string, value: number | string }>;
  public cellLineListItem: Array<{ key: string, value: number | string }>;
  public cellTypeListItem: Array<{ key: string, value: number | string }>;
  public platfromListItem: Array<{ key: string, value: number | string }>;
  public productListItem: Array<{ key: string, value: number | string }>;
  public assayListItem: Array<{ key: string, value: number | string }>;
  public partListItem: Array<{ key: string, value: number | string }>;
  public journalNameListItem: Array<{ key: string, value: number | string }>;
  public plateCoatingListItem: Array<{ key: string, value: number | string }>;
  public journalName: any;

  private keys: { "key": string, "key2": string }[] = [
    /*{ key: "Create/Update Date", key2: "Create/Update Date" },*/
    { key: "researchArea", key2: "Research Area" },
    { key: "Research Area", key2: "ResearchArea" },
    { key: "cellLine", key2: "Cell Line" },
    { key: "Cell Line", key2: "CellLine" },
    { key: "cellType", key2: "Cell Type" },
    { key: "Cell Type", key2: "CellType" },
    { key: "species", key2: "Species" },
    { key: "Species", key2: "Species" },
    { key: "platform", key2: "Platform" },
    { key: "Platform", key2: "Platform" },
    { key: "Product", key2: "Product" },
    { key: "Assay", key2: "Assay" },
    { key: "part", key2: "Part" },
    { key: "Part", key2: "Part" },
    { key: "cellSeedingDensity", key2: "Cell Seeding Density" },
    { key: "Cell Seeding Density", key2: "CellSeedingDensity" },
    { key: "plateCoating", key2: "Plate Coating" },
    { key: "Plate Coating", key2: "PlateCoating" },
    { key: "SubId", key2: "SubId" },
    { key: "subId", key2: "SubId" },
    { key: "recordType", key2: "recordType" }
  ];

  //表格副本
  private tableData: Array<any> = [];
  //表格是否有修改
  private tableDirty: boolean = false;

  constructor(private http: Http, private router: Router, private formBuilder: FormBuilder, private Service: Service, private activeRoute: ActivatedRoute,private notificationService: NotificationService) {
    this.basicFormModel = this.formBuilder.group({
      ID: [''],
      PublicationTitle: [''],
      PublicationLink: [''],
      PrimaryAuthor: [''],
      Authors: [''],
      JournalName: [''],
      PublicationDate: ['']
    });

    this.getResearchAreaDropList();
    this.getSpeciesDropList();
    this.getCSDDropList();
    this.getCellLinesList("");
    this.getCellTypesList('');
    //this.getCellTypesList(JSON.stringify(["Adipocytes","Airway epithelial cells"]));
    this.getPlateCoatingList();
    //this.getJournalNameList();
    this.getPlatfromList();
    this.getProductList();
    this.getAssayList();
    this.getPartList();
  }
  ngOnInit() {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.pubID = params.ID;
      this.filters = params.filters;
    })
    this.getPublicationByID(this.pubID, this.indexPage, this.offset);
  }
  async getPublicationByID(id, index = 1, offset = 25): Promise<any> {
    if (id) {
      this.publicationDetail = await this.Service.queryPublicationByID(id, index, offset);
      this.createBasicFormGroup(this.publicationDetail);
      this.publicationDetail = this.publicationDetail.data;
      this.subPublicationDetail = this.publicationDetail.SubPublication.data;
      this.tableData = JSON.parse(JSON.stringify(this.publicationDetail.SubPublication.data));
      this.subPubColumnformat = { data: this.subPublicationDetail, total: this.subPublicationDetail.length };
      
    } else {
      //
    }
  }

  public createSubFormGroup(i: any): FormGroup {
    console.log(rollUpStringToJson(i['Cell Line'], this.cellLineListItem),rollUpStringToJson(i['Cell Type'], this.cellLineListItem));
    const formGroup = new FormGroup({
      researchArea: new FormControl(rollUpStringToJson(i['Research Area'], this.researchAreaListItem)),
      cellLine: new FormControl(rollUpStringToJson(i['Cell Line'], this.cellLineListItem)),
      cellType: new FormControl(rollUpStringToJson(i['Cell Type'], this.cellTypeListItem)),
      species: new FormControl(rollUpStringToJson(i.Species, this.speciesListItem)),
      platform: new FormControl(rollUpStringToJson(i.Platform, this.platfromListItem)),
      Product: new FormControl(rollUpStringToJson(i.Product, this.productListItem)),
      Assay: new FormControl(rollUpStringToJson(i.Assay, this.assayListItem)),
      cellSeedingDensity: new FormControl(rollUpStringToJson(i['Cell Seeding Density'], this.CSDListItem)),
      plateCoating: new FormControl(rollUpStringToJson(i['Plate Coating'], this.plateCoatingListItem)),
      part: new FormControl(rollUpStringToJson(i.part, this.partListItem)),
      subId: new FormControl(i.SubId)
    });
    return formGroup;
  }

  public createFormGroup(i: any): FormGroup {
    const formGroup = new FormGroup({
      researchArea: new FormControl(this.getValRelationObject(i['Research Area'], this.researchAreaListItem)),
      cellLine: new FormControl(this.getValRelationObject(i['Cell Line'], this.cellLineListItem)),
      cellType: new FormControl(this.getValRelationObject(i['Cell Type'], this.cellTypeListItem)),
      species: new FormControl(this.getValRelationObject(i.Species, this.speciesListItem)),
      platform: new FormControl(this.getValRelationObject2(i.Platform, this.platfromListItem, "value")),
      Product: new FormControl(this.getValRelationObject(i.Product, this.productListItem)),
      Assay: new FormControl(this.getValRelationObject(i.Assay, this.assayListItem)),
      cellSeedingDensity: new FormControl(this.getValRelationObject(i['Cell Seeding Density'], this.CSDListItem)),
      plateCoating: new FormControl(this.getValRelationObject(i['Plate Coating'], this.plateCoatingListItem)),
      part: new FormControl(this.getValRelationObject3(i.Part, this.partListItem)),
      subId: new FormControl(i.SubId)
    });
    return formGroup;
  }

  public createCloneFormGroup(i: any): FormGroup {
    const formGroup = new FormGroup({
      researchArea: new FormControl(this.getValRelationObject(i['Research Area'], this.researchAreaListItem)),
      cellLine: new FormControl(this.getValRelationObject(i['Cell Line'], this.cellLineListItem)),
      cellType: new FormControl(this.getValRelationObject(i['Cell Type'], this.cellTypeListItem)),
      species: new FormControl(this.getValRelationObject(i.Species, this.speciesListItem)),
      platform: new FormControl(this.getValRelationObject2(i.Platform, this.platfromListItem, "value")),
      Product: new FormControl(this.getValRelationObject(i.Product, this.productListItem)),
      Assay: new FormControl(this.getValRelationObject(i.Assay, this.assayListItem)),
      cellSeedingDensity: new FormControl(this.getValRelationObject(i['Cell Seeding Density'], this.CSDListItem)),
      plateCoating: new FormControl(this.getValRelationObject(i['Plate Coating'], this.plateCoatingListItem)),
      part: new FormControl(this.getValRelationObject3(i.Part, this.partListItem)),
      //subId: null
    });
    return formGroup;
  }

  createBasicFormGroup(detail: any): FormGroup {
    const item = detail.data;
    
    if (item) {
      this.basicFormModel = this.formBuilder.group({
        ID: [item['ID']],
        PublicationTitle: [item['Publication Title']],
        PublicationLink: [item['Publication Link']],
        PrimaryAuthor: [item['Primary Author']],
        Authors: [item['Author(s)']],
        JournalName: item["Journal Name"],
        PublicationDate: [new Date(item['Publication Date'])]
      });      
      return this.basicFormModel;
    }
  }

  getResearchAreaDropList() {
    this.Service.researcharea().then(result => {
      this.researchAreaListItem = result.data;
    });
  }
  getSpeciesDropList(): void {
    this.Service.species().then(result => {
      this.speciesListItem = result.data;
    });
  }
  getCSDDropList(): void {
    this.Service.cellseedingdensity().then(result => {
      this.CSDListItem = result.data;
    });
  }
  getCellLinesList(cellLine: string): void {
    this.Service.cellLines(cellLine).then(result => {
      this.cellLineListItem = result.data;
    });
  }
  getCellTypesList(cellTypes: string): void {
    this.Service.cellTypes(cellTypes).then(result => {
      this.cellTypeListItem = result.data;
    });
  }
  getPlateCoatingList(): void {
    this.Service.platecoating().then(result => {
      this.plateCoatingListItem = result.data;
    });
  }
  getJournalNameList(): void {
    this.Service.journalname().then(result => {
      this.journalNameListItem = result.data;
    });
  }
  getPlatfromList(product?: string, assay?: string, part?: string) :void {
    this.Service.getPlatform(product, assay, part).then(result => {
      this.platfromListItem = result.data;
    });
  }
  getProductList(platform?: string,assay?: string, part?: string) : void {
    this.Service.getProduct(platform, assay, part).then(result => {
      this.productListItem = result.data;
    });
  }
  getAssayList(product?: string) : void {
    this.Service.getAssay(product).then(result => {
      this.assayListItem = result.data;
    });
  }
  getPartList(product?: string, assay?: string) : void {
    this.Service.getPart(assay, product).then(result => {
      this.partListItem = result.data;
    });
  }

  onStateChange(event) {
    console.log(event);
  }
  private closeEditor(grid, rowIndex = 1) {
    grid.closeRow(rowIndex);
  }

  /**
   * save
   */
  private async insert() {

    let data = new Object(),
        result: any,
        datea: Date,
        { controls, value } = this.basicFormModel;

    //必填项检查    
    if(!value.PublicationTitle){
      this.showMessage("Publication Title is required!");
      return;
    }

    if(!value.PublicationLink){
      this.showMessage("Publication Link is required!");
      return;
    }

    if(!value.PrimaryAuthor){
      this.showMessage("Primary Author is required!");
      return;
    }

    if(!value.Authors){
      this.showMessage("Authors is required!");
      return;
    }

    if(!value.JournalName){
      this.showMessage("Journal Name is required!");
      return;
    }

    if(!value.PublicationDate){
      this.showMessage("Publication Date is required!");
      return;
    }

    //base是否有修改
    if (this.basicFormModel.dirty) {
      console.log('g0')
      //是否为新增，新增不需要id
      if (this.pubID) {
        console.log('g1')
        data["ID"] = controls.ID.value;
      }
      for (let item in controls) {
        if (controls[item].dirty) {
          data[item] = controls[item].value;
        }
      }
    }

    datea = new Date(controls.PublicationDate.value);
    data["PublicationDate"] = datea.getFullYear() + "/" +this.addZero(datea.getMonth()+1) + "/" + this.addZero(datea.getDate());

    let dataItemCopy : any = this.subPubColumnformat.data;

    if(this.tableData.length < this.subPubColumnformat.data.length){
      dataItemCopy = JSON.parse(JSON.stringify(this.subPubColumnformat.data)).reverse();
      this.tableData.reverse();
    }

    //是否修改表格
    if (this.tableDirty) {
      data["ID"] = controls.ID.value;
      data["SubPublication"] = this.difference(this.tableData, dataItemCopy);
    }
    // 有改动才提交
    console.log(this.basicFormModel.dirty, this.tableDirty)
    if(this.basicFormModel.dirty || this.tableDirty){
      if(this.pubID){
        result = await this.Service.insertPublication(data);
      }else{
        result = await this.Service.addPublicAtion(data);
        if(result.data.id) {
          this.pubID = result.data.id
        }
      }
      if(result.status != 401) {
        this.showMessage(result.data.message);
      }
      this.getPublicationByID(this.pubID, this.indexPage, this.offset);
    }
  }

  Cancel() {
    this.router.navigate(['/home']);
  }

  public valueChange(value: any){
    if(value.length == 0) {
      this.subFormModel.get('cellType').setValue('');
    }
    let cellLineValue = this.subFormModel.value.cellLine.map(item => item.value);
    this.getCellTypesList(JSON.stringify(cellLineValue));
  }

  public removeCellLine(event) {
    this.subFormModel.get('cellType').setValue('');
  }

  public platformChange(value: any){
    this.subFormModel.get('Product').setValue('')
    this.subFormModel.get('Assay').setValue('')
    this.subFormModel.get('part').setValue('')
    
    let { product, assay, part, platform } = this.subFormModel.value,
      params : any= {};
      if(platform){
        params["platform"] = platform.value;
      }

    this.getProductList(params.platform);
  }

 public productChange(value: any){
    if(value.length == 0) {
      this.subFormModel.get('Assay').setValue('')
      this.subFormModel.get('part').setValue('')
    }
    let { platform, Product, assay, part } = this.subFormModel.value,
        params : any= {};
      if(Product){
          params["product"] = Product.map(item => item.value);
        }
    this.getAssayList(JSON.stringify(params.product));
  }

  public removeProduct(event) {
    this.subFormModel.get('Assay').setValue('')
    this.subFormModel.get('part').setValue('')
  }

  public assayChange(value: any){
    if(value.length == 0) {
      this.subFormModel.get('part').setValue('')
    }
    let { platform, Product, part, Assay } = this.subFormModel.value,
        params : any= {};

        if(Product){
          params["product"] = Product.map(item => item.value);
        }

        if(Assay){
          params["assay"] = Assay.map(item => item.value);
        }

    this.getPartList(JSON.stringify(params.product), JSON.stringify(params.assay));
  }

  public removeAssay(event) {
    this.subFormModel.get('part').setValue('')
  }

 public cellTypeFocus(){
    let cellLineValue = this.subFormModel.value.cellLine.map(item => item.value);
    this.getCellTypesList(JSON.stringify(cellLineValue));
  }

  public productFocus(){
    //this.platformChange({});
  }

  public AssayFocus(){
    //this.productChange({});
  }

  public partFocus(){
    //this.assayChange({});
  }

  private weke(cellTypes: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.Service.cellTypes(cellTypes).then(result => {
        resolve(result.data);
      });
    })
  }

  private async getDataForCloneAndEdit(item) {
    var cellLine = JSON.stringify(item['Cell Line'].split('~'))
    var platform = item['Platform']
    var product = JSON.stringify(item['Product'].split('~'))
    var assay = JSON.stringify(item['Assay'].split('~'))
    await this.Service.cellTypes(cellLine).then(result => {
      this.cellTypeListItem = result.data;
    });
    await this.Service.getProduct(platform).then(result => {
      this.productListItem = result.data;
    });
    await this.Service.getAssay(product).then(result => {
      this.assayListItem = result.data;
    });
    await this.Service.getPart(assay, product).then(result => {
      this.partListItem = result.data;
    });
  }

  async CloneHandler({ sender, dataItem }) {
    console.log(dataItem)
    this.closeEditor(sender);
    await this.getDataForCloneAndEdit(dataItem)
    this.subFormModel = this.createCloneFormGroup(dataItem);
    sender.addRow(this.subFormModel);
  }

  public async cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited, column }) {

    if(!isEdited) {
      if(column.title !== 'Command') {
        await this.getDataForCloneAndEdit(dataItem);
        this.subFormModel = this.createFormGroup(dataItem);
        sender.editRow(rowIndex, this.subFormModel);
      }
    }
    
    /*if(column.title == "Cell Line"){
      if(dataItem["Cell Line"] && dataItem["Cell Line"].length){
        this.getCellTypesList(JSON.stringify(dataItem["Cell Line"].split("~")));
      }
    }
    if (!isEdited) {
      this.subFormModel = this.createFormGroup(dataItem);
      sender.editCell(rowIndex, columnIndex, this.subFormModel);
    }*/
  }

  public cellCloseHandler(args: any) {
    const { formGroup, dataItem, rowIndex } = args;
    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      this.assignValues(dataItem, formGroup.value);
      this.update(dataItem, rowIndex);
      this.tableDirty = true;
    }
  }

  assignValues(target: any, source: any): void {
    Object.assign(target, source);
  }

  /**
  * 更新表格
  * @param item 当前对象
  * @param rowIndex 行index
  */
  update(item: any, rowIndex: any): any {
    let params: object = new Object;
    params = this.replaceKey(item);
    this.subPubColumnformat.data.splice(rowIndex, 1, params);    
    // this.publicationEditData(item.ID, params);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    let product: object = new Object,
      data: object;
    for(let item in formGroup.value){
      if(formGroup.value[item] && formGroup.value[item].length){
        product[item] = formGroup.value[item];
      } else if(item == "platform"){
        product[item] = {value: formGroup.value.platform.value};
      } else if(item == "subId") {
        product[item] = formGroup.value.subId
      } else{
        //提示
        if(item == "Cell Seeding Density" || item == "Plate Coating"){
          product[item] = "Not Specified";
        }if(item == "subId"){
          // return;
        } else{
          this.showMessage(item + " is required!");
          return;
        }
      }
    }
    //是否是新建
    if (isNew) {
      console.log('g111111111')
      data = this.replaceKey(product);
      this.subPubColumnformat.data.unshift(data);
      this.tableDirty = true; 
      this.subPubColumnformat.total = this.subPubColumnformat.data.length     
    } else {
      console.log(formGroup.dirty)
      data = this.replaceKey(product);
      this.subPubColumnformat.data[rowIndex] = data
      if(formGroup.dirty) {
        this.tableDirty = true;  
      }
    }
    // this.service.save(product, isNew);
    sender.closeRow(rowIndex);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);

    this.subFormModel = this.createSubFormGroup({
      researchArea: '',
      cellLine: '',
      cellType: '',
      species: '',
      platform: '',
      Product: '',
      Assay: '',
      cellSeedingDensity: '',
      plateCoating: '',
      part: '',
      subId: ''
    });
    sender.addRow(this.subFormModel);
  }

  /**
   * 删除行
   * @param rowIndex 行号 
   */
  public removeHandler({ rowIndex, isNew }): void {
    if(this.subPubColumnformat.data[rowIndex].SubId){
      this.dialogOpened = true
      this.removeIndex = rowIndex
      //this.Service.removeSubPublication(this.pubID,this.subPubColumnformat.data[rowIndex].SubId);
    } else {
      this.subPubColumnformat.data.splice(rowIndex, 1);
      this.subPubColumnformat.total = this.subPubColumnformat.data.length
    }
  }

  //小于10，前面补0；9=>09
  private addZero(val) {
    return val < 10 ? "0" + val : val;
  }

  private getTime() {
    const date: Date = new Date();
    return this.addZero(date.getFullYear()) + "/" + this.addZero(date.getMonth() + 1) + "/" + this.addZero(date.getDate()) + " " + this.addZero(date.getHours()) + ":" + this.addZero(date.getMinutes()) + ":" + this.addZero(date.getSeconds());
  }

  /**
   * 关联表格的key
   * @param keys 全部的key
   * @param key 当前key
   */
  private getkey(keys: Array<{ "key": string, "key2": string }>, key: string): string {
    let result: string;
    keys.forEach((item) => {
      if (item.key == key)
        result = item.key2;
    });
    return result;
  }

  /**
   * 替换object的key
   * @param data 需要替换的object
   */

  private replaceKey(data: any): object {
    let data2: object = new Object,
      key: string = "";

    for (const item in data) {
      key = this.getkey(this.keys, item);
      
      if(item == "Platform" || item == "platform"){
        data2[key] = data[item].value;
      } else {
        data2[key] = data[item];
      }

      if(item != "Platform" && item != "platform"){
        Array.isArray(data[item]) ? data2[key] = data[item].map(item => item && item.value).join("~") : null;
      }
    
    }
    return data2;
  }

  /**
   * 获取到与value值相匹配的object
   * @param value 当前值
   * @param data 与之匹配的数组
   */
  private getValRelationObject(value: string, data: Array<{ key: string, value: number | string }>): Array<{ key?: string, value: number | string }> | null {
    if (value) {
      let params = value.split("~"),
          returnValue;
          returnValue = data.filter((item: { key: string, value: string }) => {
            if (params.includes(item.value)) {
              return item;
              };
          });
        if(returnValue.length == 0){
            returnValue = params.map((item, index) => { return {value: item,key: index} })
          }
        return returnValue;  
    } else {
      return null;
    }
  }

    private getValRelationObject2(value: string, data: Array<{ key: string, value: number | string }>, key: string): object | null {
    if (value) {
      let params = value.split("~"), resule: any;
       data && data.forEach((item: any) => {
        if (params.includes(item[key])) {
          resule = item;
        }
      });
      if(resule == undefined){
        return {value: value};
      }
      return resule;
    } else {
      return null;
    }
  }

  private getValRelationObject3(value: string, data: Array<{ key: string, value: number | string }>): Array<{ key?: string, value: number | string }> | null {
    if (value) {
      let returnValue = new Array();
      //let flag = false;
      for(let i = 0; i < data.length; i++) {
        if(data[i].value == null) {
          returnValue.push(data[i])
        } else {
          if(data[i].value.toString().indexOf('~') != -1) {
            //flag = true
            if(value.indexOf(data[i].value.toString()) != -1) {
              returnValue.push(data[i])
              value.replace(data[i].value.toString(), '')
            }
          }
        }
        
      }
      //if(!flag) {
        let splitValue = value.split('~')
        for(let i = 0; i < data.length; i++) {
          if(data[i].value != null) {
            if(splitValue.includes(data[i].value.toString())) {
              returnValue.push(data[i])
            }
          }
        }
      //} else {
        //let splitMultValue = value.split('~')

      //}
      /*let params = value.split("~"), returnValue;
          console.log(params)
          console.log(data)
          returnValue = data.filter((item: { key: string, value: string }) => {
            if (params.includes(item.value)) {
              return item;
              };
          });
        if(returnValue.length == 0){
            returnValue = params.map((item, index) => { return {value: item,key: index} })
          }*/
          console.log(returnValue)
        return returnValue;  
        
    } else {
      if(value === '') {
        value = null
      }
      let returnValue;
      let returnValueArr = data.filter((item: { key: string, value: string }) => {
          if (value == item.value) {
            return item
          };
        });
        returnValue = returnValueArr;
      if(returnValue.length == 0){
          returnValue = [{value: value,key: 1}]
        }
      return returnValue;  
    }
  }

  /**
   * 比较对象的差异并返回差异
   * @param params 对象1
   * @param params2 对象2
   */
  private difference(params: Array<any>, params2: Array<any>): Array<any> {
    let data: Array<any> = new Array();
    params2.forEach((item, index) => {
      data.push(new Object());
      //是否为新增
      if (params2[index].SubId == undefined || params2[index].SubId == "") {
        // data[index] = params2[index];
        for(let val in params2[index]){
          if(val == "platform" || val == "Platform"){
            data[index].Platform = params2[index][val];
          } else if(val != "SubId"){
            // data[index].SubId = "";
             data[index][this.getkey(this.keys, val)] = params2[index][val].split("~");
          }
          //   else {
          //   data[index][this.getkey(this.keys, val)] = params2[index][val].split("~");
          // }
        }
      } else {
        for (let key in item) {
          if (item[key] != params[index][key]) {
            if(params[index][key] && params[index][key] != undefined && params[index][key] != null){
              if(key == "platform" || key == "Platform"){
                data[index].Platform = item[key];
              } else if(key == "SubId") {
                data[index].SubId = item[key];
              }else{
                data[index][this.getkey(this.keys, key)] = item[key].split("~");
              }
              data[index].SubId = params[index].SubId;
            }            
          }
        }
      }            
    });

    //过滤空对象
    data = data.filter((item) => {
      if(Object.keys(item).length){
        return item
      }
    });

    return data;
  }

    /**
   * 提示框
   * @param message 提示内容
   */
  showMessage(message) {

    this.notificationService.show({
      content: message,
      cssClass: 'button-notification',
      animation: { type: 'slide', duration: 500 },
      position: { horizontal: 'center', vertical: 'bottom' },
      type: { style: 'warning', icon: true },
      hideAfter: 3000//自动消失时间
    });

  }

  close() {
    this.dialogOpened = false
  }

  action(event) {
    if(event == 'yes') {
      this.Service.removeSubPublication(this.pubID,this.subPubColumnformat.data[this.removeIndex].SubId);
      this.subPubColumnformat.data.splice(this.removeIndex, 1);
      this.subPubColumnformat.total = this.subPubColumnformat.data.length
    };
    this.removeIndex = undefined
    this.dialogOpened = false
  }

  goBack() {
    if(!this.filters) {
      this.router.navigate(['home'])
    } else {
      this.router.navigate(['home'], { queryParams: { filters: this.filters}})
    }
  }
}