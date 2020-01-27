import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { State } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Service } from "./../../services/service";
import { NotificationService } from '@progress/kendo-angular-notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cellLineEdit',
  templateUrl: './cellLineEdit.component.html',
  styleUrls: ['./cellLineEdit.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class CellLineEditComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private Service: Service, private notificationService: NotificationService, private router: Router) { }
  backText = "<Back"
  //下拉列表
  private editList: string[] = ["Manage Cell Line", "Manage Cell Type", "Manage Species", "Manage Research Area", "Assay By Business", "Assay PNs By Product", "Product by Platform", "Manage Assay PNs", "Manage Cell Seeding Density", "Manage Plate Coating", "Business & Platform", "Manage Business"];
  //当前项
  private editName: string = this.editList[0];
  //title与field关联枚举
  private wholeColumn: object = {
    "Manage Cell Line": {
      title: ["Cell Line", "Cell Type"],
      field: ["value", "cellTypes"]
    },
    "Manage Cell Type": {
      title: ["Cell Type"],
      field: ["value"],
    },
    "Manage Species": {
      title: ["Species"],
      field: ["value"],
    },
    "Manage Research Area": {
      title: ["Research Area", "Export Link"],
      field: ["value", "exportValue"]
    },
    /*"Assay": {
      title: ["Assay", "Business", "Product", "Part", "Export value"],
      field: ["value", "business", "product", "part", "exportValue"]
    },*/
    "Assay By Business": {
      title: ["Business", "Assay", "Export Link"],
      field: ["business", "value", "exportValue"]
    },
    "Assay PNs By Product": {
      title: ["Product", "Assay", "Part"],
      field: ["product", "value", "part"]
    },
    "Product by Platform": {
      title: ["Analysis Platform", "Product", "Export Link"],
      field: ["platform", "value", "exportValue"]
    },
    "Manage Assay PNs": {
      title: ["Part"],
      field: ["value"]
    },
    "Manage Cell Seeding Density": {
      title: ["Cell Seeding Density"],
      field: ["value"]
    },
    "Manage Plate Coating": {
      title: ["Plate Coating"],
      field: ["value"]
    },
    "Business & Platform": {
      title: ["Business", "Analysis Platform Display Value","Analysis Platform"],
      field: ["business", "value", "exportValue"]
    },
    "Manage Business": {
      title: ["Business"],
      field: ["value"]
    }
  };
  //当前title
  private columnNames: string[] = this.wholeColumn[this.editName].title;
  private state: State = {
    sort: [],
    skip: 0,
    take: 25,
    filter: {
      logic: 'or',
      filters: []
    }
  };
  private pageNo: number = 1;
  private gridView: GridDataResult = {
    data: [],
    total: 0
  };

  //下拉框的值
  public cellTypeList: Array<{ key: string, value: number | string }>;
  public journalNameList: Array<{ key: string, value: number | string }>;
  public productList: Array<{ key: string, value: number | string }>;
  public partList: Array<{ key: string, value: number | string }>;
  public platfromList: Array<{ key: string, value: number | string }>;
  public businessList: Array<{ key: string, value: number | string}>;
  public assayList: Array<{ key: string, value: number | string}>;
  private sender: any;
  public subFormModel: FormGroup = new FormGroup({
    value: new FormControl([]),
    cellType: new FormControl(''),
    platform: new FormControl(''),
    product: new FormControl(''),
    Assay: new FormControl(''),
    part: new FormControl('')
  });

  editAssayIndex: number
  editAssaySender

  /**
   * 下拉框切换
   */
  private editChange(): void {
    
    if(this.sender) {
      this.closeEditor(this.sender, -1);
    }
    
    this.state.skip = 0;
    this.pageNo = 1;
    this.gridView.data = [];
    this.columnNames = this.wholeColumn[this.editName].title;
    this.state.filter.filters = []
    this.switchGetData(this.editName);

  }

  /**
   * 点击grid
   * @param param
   */
  public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }): void {
    const keys: string[] = ["Manage Cell Line", "Assay", "Assay By Business", "Assay PNs By Product", "Product by Platform", "Business & Platform"];
    if(this.editName != 'Assay') {
      if (!isEdited) {
        if (keys.includes(this.editName)) {
          this.subFormModel = this.createFormGroup3(dataItem);
          sender.editCell(rowIndex, columnIndex, this.subFormModel);
        } else {
          sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
        }
      }
    }
  }

  public createFormGroup(dataItem: any): FormGroup {
    let params = new Object;
    this.wholeColumn[this.editName].field.forEach(item => params[item] = dataItem[item]);
    return this.formBuilder.group(params)
  }

  /**
   * grid失去焦点
   * @param args 
   */
  public cellCloseHandler(args: any): void {
    const { formGroup, dataItem, column, rowIndex } = args;
    if (!formGroup.valid) {
      args.preventDefault();
    } else if (formGroup.dirty) {
      this.assignValues(dataItem, formGroup.value);
      this.updateTable(dataItem, rowIndex % this.state.take, '');
    }
  }

  assignValues(target: any, source: any): void {
    Object.assign(target, source);
  }

  /**
   * 更新数据
   * @param item 
   * @param rowIndex 
   */
  updateTable(item: any, rowIndex: number, field: string): any {
    let params: object,
      dataItem: any;
      console.log(item)
    dataItem = this.replaceKey(item);
    if (this.editName == "Manage Cell Line") {
      params = { id: item.id, value: item.value, cellTypes: dataItem.cellTypes.value };
      this.gridView.data.splice(rowIndex, 1, params);
    } else if (this.editName == "Assay By Business") {
      params = { id: dataItem.id, value: dataItem.value, exportValue: dataItem.exportValue, business: dataItem.business.value };
    } else if (this.editName == "Assay PNs By Product") {
      if(dataItem.part) {
        params = { id: dataItem.id, value: dataItem.value.value, product: dataItem.product.value, part: dataItem.part.value };
      } else {
        params = { id: dataItem.id, value: dataItem.value.value, product: dataItem.product.value, part: null };
      }
    }
      /*else if (this.editName == "Assay") {
      if(!dataItem.product) {
        if(dataItem.part){
          params = { value: item.value, id: item.id, exportValue: item.exportValue, business: dataItem.business.value, product: null, part: dataItem.part.value };
        }else{
          params = { value: item.value, id: item.id, exportValue: item.exportValue, business: dataItem.business.value, product: null, part: null };
        }
      } else {
        if(dataItem.part){
          params = { value: item.value, id: item.id, exportValue: item.exportValue, business: dataItem.business.value, product: dataItem.product.value, part: dataItem.part.value };
        }else{
          params = { value: item.value, id: item.id, exportValue: item.exportValue, business: dataItem.business.value, product: dataItem.product.value, part: null };
        } 
      }
      this.gridView.data.splice(rowIndex, 1, params);
    }*/ else if (this.editName == "Product by Platform") {
      params = { id: dataItem.id, value: dataItem.value, platform: dataItem.platform.value, exportValue: dataItem.exportValue };
      this.gridView.data.splice(rowIndex, 1, params);
    } else if (this.editName == "Business & Platform") {
      params = { key: dataItem.key, value: dataItem.value, business: dataItem.business.value, exportValue: dataItem.exportValue };
      this.gridView.data.splice(rowIndex, 1, params);
    } else {
      params = item;
    }
    this.switchModifyData(this.editName, params);
  }

  /**
 * 替换object的key
 * @param data 需要替换的object
 */

  private replaceKey(data: object): object {
    let data2: object = new Object;

    for (const item in data) {
      Array.isArray(data[item]) ? data2[item] = data[item].map(val => val && val.value).join("~") : data2[item] = data[item];
    }
    return data2;
  }



  /**
   * 新增
   * @param param
   */
  public addHandler({ sender }): void {

    let rowData = new Object,
      keys: string[] = ["Manage Cell Line", "Assay", "Assay By Business", "Assay PNs By Product", "Product by Platform", "Business & Platform"];
    this.wholeColumn[this.editName]["field"].forEach(item => rowData[item] = "");

    if (keys.includes(this.editName)) {
      this.subFormModel = this.createFormGroup2(rowData);
      console.log(this.subFormModel)
      sender.addRow(this.subFormModel);
    } else {
      sender.addRow(this.createFormGroup(rowData));
    }

    this.sender = sender;
  }

  /**
   * 新增后的保存
   * @param param
   */
  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    if(isNew) {
      let params: object;
      switch (this.editName) {
        case "Manage Cell Line":
          params = { value: formGroup.value.value, cellTypes: formGroup.value.cellTypes.value };
          break;
        case "Research Area":
          params = { value: formGroup.value.value, exportValue: formGroup.value.exportValue };
          break;
        /*case "Assay":
          if(formGroup.value.part){
            params = { value: formGroup.value.value, exportValue: formGroup.value.exportValue, business: formGroup.value.business.value, product: formGroup.value.product.value, part: formGroup.value.part.value };
          }else{
            params = { value: formGroup.value.value, exportValue: formGroup.value.exportValue, business: formGroup.value.business.value, product: formGroup.value.product.value, part: null };
          }        
          break;*/
        case "Assay By Business":
          params = { value: formGroup.value.value, exportValue: formGroup.value.exportValue, business: formGroup.value.business.value };
          break;
        case "Assay PNs By Product":
          if(formGroup.value.part) {
            params = { value: formGroup.value.value.value, product: formGroup.value.product.value, part: formGroup.value.part.value };
          } else {
            params = { value: formGroup.value.value.value, product: formGroup.value.product.value, part: null };
          }
          break;
        case "Product by Platform":
          params = { value: formGroup.value.value, exportValue: formGroup.value.exportValue, platform: formGroup.value.platform.value };
          break;
        case "Business & Platform":
          params = { value: formGroup.value.value, exportValue: formGroup.value.exportValue, business: formGroup.value.business.value };
          break;
        default:
          params = formGroup.value;
          break;
      }
      this.switchAddData(this.editName, params, sender, rowIndex % this.state.take);
    } else {
      let params: object;
      if(formGroup.value.part){
        params = { value: formGroup.value.value, id: formGroup.value.id, exportValue: formGroup.value.exportValue, business: formGroup.value.business.value, product: formGroup.value.product.value, part: formGroup.value.part.value };
      }else{
        params = { value: formGroup.value.value, id: formGroup.value.id, exportValue: formGroup.value.exportValue, business: formGroup.value.business.value, product: formGroup.value.product.value, part: null };
      }
      sender.closeRow(rowIndex);
      this.switchModifyData(this.editName, params)
    }
  }

  /**
   * 取消新增
   * @param param
   */
  public cancelHandler({ sender, rowIndex }): void {
    this.closeEditor(sender, rowIndex);
  }

  /**
 * 删除行
 * @param rowIndex 行号 
 */
  public removeHandler({ rowIndex }): void {
    let id: string, keys: string[] = ["Manage Cell Line", "Assay", "Assay By Business", "Assay PNs By Product", "Product by Platform"];

    if (keys.includes(this.editName)) {
      id = this.gridView.data[Math.ceil(rowIndex % this.state.take)].id;
    } else {
      id = this.gridView.data[Math.ceil(rowIndex % this.state.take)].key;
    }

    this.switchRemoveData(this.editName, id, rowIndex);

  }

  /**
   * 关闭新增组件
   * @param grid 
   * @param rowIndex 
   */
  private closeEditor(grid, rowIndex): void {
    grid.closeRow(rowIndex);
  }

  /**
   * 获取field
   * @param index field的索引
   */
  public getField(index: number): string {
    return this.wholeColumn[this.editName]["field"][index];
  }

  /**
   * 翻页回调函数
   * @param event 
   */
  public pageChange(event: PageChangeEvent): void {
    if(this.sender){
      this.closeEditor(this.sender, -1);
    }
    this.state.skip = event.skip;
    this.pageNo = event.skip / event.take + 1;
    this.switchGetData(this.editName);
    //还差一个请求切换的放缓
  }

  /**
   * 不同指标的切换获取数据
   * @param editName 指标名字
   */
  private switchGetData(editName) {
    var filters = {}
    if(this.state.filter.filters.length > 0) {
      for(let i = 0; i < this.state.filter.filters.length; i++) {
        filters[this.state.filter.filters[i]['field']] = this.state.filter.filters[i]['value']
      }
    }
    switch (editName) {
      case "Manage Cell Line":
        this.getCellLine(filters);
        this.getCellTypesList('all');
        break;
      case "Manage Cell Type":
        this.getCellTypes(filters);
        break;
      case "Manage Species":
        this.getSpecies(filters);
        break;
      case "Manage Research Area":
        this.getResearcharea(filters);
        break;
      /*case "Assay":
        this.getAssay(filters);
        this.getBusinessList();
        this.getPartList();
        break;*/
      case "Assay By Business":
        this.getAssayByBusiness(filters);
        this.getBusinessList();
        break;
      case "Assay PNs By Product":
        this.getAssayPNsByProduct(filters);
        this.getProductListForAssay();
        this.getPartList();
        this.getAssayList()
        break;
      case "Product by Platform":
        this.getProduct(filters);
        this.getPlatfromList();
        break;
      case "Manage Assay PNs":
        this.getPart(filters);
        break;
      case "Business & Platform":
        this.getPlatform(filters);
        this.getBusinessList()
        break;
      case "Manage Cell Seeding Density":
        this.getcellseedingdensity(filters);
        break;
      case "Manage Plate Coating":
        this.getPlatecoating(filters);
        break;
      case "Journal Name":
        this.getJournalname();
        break;
      case "Manage Business":
        this.getBusiness(filters);
        break;
    }
  }

  /**
   * 不同指标的切换删除数据
   * @param editName 
   */
  private async switchRemoveData(editName: string, id: string, rowIndex: number) {
    let result: any;

    switch (editName) {
      case "Manage Cell Line":
        result = await this.removeCellLine(id);
        break;
      case "Manage Cell Type":
        result = await this.removeCellTypes(id);
        break;
      case "Manage Species":
        result = await this.removeSpecies(id);
        break;
      case "Manage Research Area":
        result = await this.removeResearcharea(id);
        break;
      /*case "Assay":
        result = await this.removeAssay(id);
        break;*/
      case "Assay By Business":
        result = await this.removeAssayByBusiness(id);
        break;
      case "Assay PNs By Product":
        result = await this.removeAssayPNsByProduct(id);
        break;
      case "Product by Platform":
        result = await this.removeProduct(id);
        break;
      case "Manage Assay PNs":
        result = await this.removePart(id);
        break;
      case "Business & Platform":
        result = await this.removePlatform(id);
        break;
      case "Manage Cell Seeding Density":
        result = await this.removeCellseedingdensity(id);
        break;
      case "Manage Plate Coating":
        result = await this.removePlatecoating(id);
        break;
      case "Journal Name":
        result = await this.removeJournalname(id);
        break;
      case "Manage Business":
        result = await this.removeBusiness(id);
    }

    if (result.data.message == "Remove Successful!") {
      this.gridView.data.splice(Math.ceil(rowIndex % this.state.take), 1);
      this.switchGetData(this.editName);
    }
    if(result.status != 401) {
      this.showMessage(result.data.message);
    }
    

  }

  /**
   * 不同指标的切换更新数据
   */
  private async switchModifyData(editName: string, params: any) {
    let { id, key, value, cellTypes, exportValue, product, part, platform, business } = params, result;
    switch (editName) {
      case "Manage Cell Line":
        result = await this.modifyCellline(id, value, cellTypes);
        break;
      case "Manage Cell Type":
        result = await this.modifyCelltypes(key, value);
        break;
      case "Manage Species":
        result = await this.modifyspecies(key, value);
        break;
      case "Manage Research Area":
        result = await this.modifyResearcharea(key, value, exportValue);
        break;
      /*case "Assay":
        result = await this.modifyAssay(id, value, exportValue, business, product, part);
        break;*/
      case "Assay By Business":
        result = await this.modifyAssayByBusiness(id, value, exportValue, business);
        break;
      case "Assay PNs By Product":
        result = await this.modifyAssayPnsByProduct(id, value, product, part);
        break;
      case "Product by Platform":
        result = await this.modifyProduct(id, value, exportValue, platform);
        break;
      case "Manage Assay PNs":
        result = await this.modifyPart(key, value);
        break;
      case "Business & Platform":
        result = await this.modifyPlatform(key, value, exportValue, business);
        break;
      case "Manage Cell Seeding Density":
        result = await this.modifyCellseedingdensity(key, value);
        break;
      case "Manage Plate Coating":
        result = await this.modifyPlatecoating(key, value);
        break;
      case "Journal Name":
        result = await this.modifyJournalname(key, value);
        break;
      case "Manage Business":
        result = await this.modifyBusiness(key, value);
        break;
    }
    if(result.status != 401) {
      this.showMessage(result.data.message);
    }
    this.switchGetData(this.editName);
  }

  /**
  * 不同指标的切换更新数据
  */
  private async switchAddData(editName: string, params: any, sender: any, rowIndex: number) {
    let { id, value, cellTypes, exportValue, platform, product, part, business } = params, result: any;

    switch (editName) {
      case "Manage Cell Line":
        result = await this.addCellLine(value, cellTypes);
        break;
      case "Manage Cell Type":
        result = await this.addCelltypes(value);
        break;
      case "Manage Species":
        result = await this.addspecies(value);
        break;
      case "Manage Research Area":
        result = await this.addResearcharea(value, exportValue);
        break;
      /*case "Assay":
        result = await this.addAssay(value, exportValue, business, product, part);
        break;*/
      case "Assay By Business":
        result = await this.addAssayByBusiness(value, exportValue, business);
        break;
      case "Assay PNs By Product":
        result = await this.addAssayPNsByProduct(value, product, part);
        break;
      case "Product by Platform":
        result = await this.addProduct(value, exportValue, platform);
        break;
      case "Manage Assay PNs":
        result = await this.addPart(value);
        break;
      case "Business & Platform":
        result = await this.addPlatform(value, exportValue, business);
        break;
      case "Manage Cell Seeding Density":
        result = await this.addCellseedingdensity(value);
        break;
      case "Manage Plate Coating":
        result = await this.addPlatecoating(value);
        break;
      case "Journal Name":
        result = await this.addJournalname(value);
        break;
      case "Manage Business":
        result = await this.addBusiness(value);
        break;
    }

    if (result.data.message == "Add Successful!") {
      this.gridView.data.unshift(params);
      sender.closeRow(rowIndex);
      this.switchGetData(this.editName);
    }
    if(result.status != 401) {
      this.showMessage(result.data.message);
    }

  }

  /**
   * 获取cellLine
   */
  private async getCellLine(filters): Promise<any> {
    let result: any = await this.Service.celllinePage(this.pageNo, this.state.take, filters.value, filters.cellTypes);
    this.gridView.data = result.data.data;
    this.gridView.total = result.data.total;
    // this.cellTypeList = result.data.data;
  }

  /**
 * 添加cellLine
 */
  private async addCellLine(value: string, cellTypes): Promise<any> {
    return await this.Service.addCellline(value, cellTypes);
  }

  /**
   * 删除cellLine
   * @param id 
   */
  private async removeCellLine(id: string): Promise<any> {
    return await this.Service.removeCellline(id);
  }

  /**
   * 更新cellLine
   * @param key 
   * @param value 
   */
  private async modifyCellline(key: string, value: string, cellTypes: string): Promise<any> {
    return await this.Service.modifyCellline(key, value, cellTypes);
  }

  /**
   * 删除cellTypes
   * @param key 
   */
  private async removeCellTypes(key): Promise<any> {
    return await this.Service.removeCelltypes(key);
  }

  /**
   * 获取cellTypes
   */
  private async getCellTypes(filters): Promise<any> {

    let result: any = await this.Service.celltypesPage(this.pageNo, this.state.take, filters.value);
    this.gridView.data = result.data.lov;
    this.gridView.total = result.data.total;
  }

  /**
   * 新增cellTypes
   * @param value 
   * @param cellTypes 
   */
  private async addCelltypes(value: string): Promise<any> {
    return await this.Service.addCelltypes(value);
  }

  /**
   * 更新cellTypes
   * @param key 
   * @param value 
   */
  private async modifyCelltypes(key: string, value: string): Promise<any> {
    return await this.Service.modifyCelltypes(key, value);
  }

  /**
   * 获取Species
   */
  private async getSpecies(filters): Promise<any> {
    let result: any = await this.Service.speciesPage(this.pageNo, this.state.take, filters.value);
    this.gridView.data = result.data.lov;
    this.gridView.total = result.data.total;
  }

  /**
   * 更新species
   * @param key 
   * @param value 
   */
  private async modifyspecies(key: string, value: string): Promise<any> {
    return await this.Service.modifyspecies(key, value);
  }

  /**
   * 新增species
   * @param key 
   */
  private async addspecies(value: string): Promise<any> {
    return await this.Service.addspecies(value);
  }

  /**
   * 删除Species
   * @param id 
   */
  private async removeSpecies(key: string): Promise<any> {
    return await this.Service.removeSpecies(key);
  }

  /**
   * 获取researcharea
   */
  private async getResearcharea(filters): Promise<any> {
    let result: any = await this.Service.researchareaPage(this.pageNo, this.state.take, filters.value, filters.exportValue);
    this.gridView.data = result.data.lov;
    this.gridView.total = result.data.total;
  }

  /**
   * 新增
   * @param value 
   * @param exportValue 
   */
  private async addResearcharea(value: string, exportValue: string): Promise<any> {
    return await this.Service.addResearcharea(value, exportValue);
  }

  /**
   * 更新Researcharea
   * @param key 
   * @param value 
   * @param exportValue 
   */
  private async modifyResearcharea(key: string | number, value: string, exportValue: string): Promise<any> {
    return await this.Service.modifyResearcharea(key, value, exportValue);
  }

  /**
   * 删除removeResearcharea
   * @param key 
   */
  private async removeResearcharea(key: string): Promise<any> {
    return await this.Service.removeResearcharea(key);
  }

  /**
   * 获取cellseedingdensity
   */
  private async getcellseedingdensity(filters): Promise<any> {
    let result: any = await this.Service.cellseedingdensityPage(this.pageNo, this.state.take, filters.value);
    this.gridView.data = result.data.lov;
    this.gridView.total = result.data.total;
  }

  /**
   * 新增Cellseedingdensity
   * @param value 
   */
  private async addCellseedingdensity(value: string): Promise<any> {
    return await this.Service.addCellseedingdensity(value);
  }

  /**
   * 更新Cellseedingdensity
   */
  private async modifyCellseedingdensity(key: string | number, value: string): Promise<any> {
    return await this.Service.modifyCellseedingdensity(key, value);
  }

  /**
   * 删除Cellseedingdensity
   * @param key 
   */
  private async removeCellseedingdensity(key: string): Promise<any> {
    return await this.Service.removeCellseedingdensity(key);
  }

  /**
   * 获取Platecoating
   */
  private async getPlatecoating(filters): Promise<any> {
    let result: any = await this.Service.platecoatingPage(this.pageNo, this.state.take, filters.value);
    this.gridView.data = result.data.lov;
    this.gridView.total = result.data.total;
  }

  /**
   * 新增Platecoating
   * @param value 
   */
  private async addPlatecoating(value: string): Promise<any> {
    return await this.Service.addPlatecoating(value);
  }

  /**
   * 更新Platecoating
   * @param key 
   * @param value 
   */
  private async modifyPlatecoating(key: string | number, value: string): Promise<any> {
    return await this.Service.modifyPlatecoating(key, value);
  }

  /**
   * 删除Platecoating
   * @param key 
   */
  private async removePlatecoating(key: string): Promise<any> {
    return await this.Service.removePlatecoating(key);
  }

  /**
   * 获取JournalnamePage
   */
  private async getJournalname(): Promise<any> {
    let result: any = await this.Service.journalnamePage(this.pageNo, this.state.take);
    this.gridView.data = result.data.lov;
    this.gridView.total = result.data.total;
  }

  /**
   * 新增Journalname
   * @param value 
   */
  private async addJournalname(value: string): Promise<any> {
    return await this.Service.addJournalname(value);
  }

  /**
  * 获取JournalnamePage
  */
  private async getPlatform(filters): Promise<any> {
    let result: any = await this.Service.platformPage(this.pageNo, this.state.take, filters.value, filters.exportValue, filters.business);
    this.gridView.data = result.data.lov;
    this.gridView.total = result.data.total;
  }

  /**
   * 新增Journalname
   * @param key 
   * @param value 
   */
  private async modifyJournalname(key: string | number, value: string): Promise<any> {
    return await this.Service.modifyJournalname(key, value);
  }

  /**
   * 删除Journalname
   * @param value 
   */
  private async removeJournalname(value: string): Promise<any> {
    return await this.Service.removeJournalname(value);
  }

  /**
   * 删除Platform
   * @param key 
   */
  private async removePlatform(key): Promise<any> {
    return await this.Service.removePlatform(key);
  }

  /**
   * 更新Platform
   * @param key 
   * @param value 
   */
  private async modifyPlatform(key: string, value: string, exportValue: string, business: string): Promise<any> {
    return await this.Service.modifyPlatform(key, value, exportValue, business);
  }

  /**
   * 新增Platform
   * @param value 
   */
  private async addPlatform(value: string, exportValue: string, business: string): Promise<any> {
    return await this.Service.addPlatform(value, exportValue, business);
  }

  /**
   * 获取product
   */
  private async getProduct(filters): Promise<any> {
    let result = await this.Service.productPage(this.pageNo, this.state.take, filters.value, filters.exportValue, filters.platform);
    this.gridView.data = result.data.data;
    this.gridView.total = result.data.total;
  }

  /**
   * 获取Part
   */
  private async getPart(filters): Promise<any> {
    let result = await this.Service.partPage(this.pageNo, this.state.take, filters.value);
    this.gridView.data = result.data.lov;
    this.gridView.total = result.data.total;
  }

  /**
   * 删除Part
   * @param key 
   */
  private async removePart(key: string): Promise<any> {
    return await this.Service.removePart(key);
  }

  /**
   * 新增part
   * @param value 
   */
  private async addPart(value: string): Promise<any> {
    return await this.Service.addPart(value);
  }

  /**
   * 更新Part
   * @param key 
   * @param value 
   */
  private async modifyPart(key: string, value: string): Promise<any> {
    return await this.Service.modifyPart(key, value);
  }

  /**
   * 删除product
   * @param id 
   */
  private async removeProduct(id: string): Promise<any> {
    return await this.Service.removeProduct(id);
  }

  /**
   * 新增Product
   * @param value 
   * @param exportValue 
   * @param platform 
   */
  private async addProduct(value: string, exportValue: string, platform: string): Promise<any> {
    return await this.Service.addProduct(value, exportValue, platform);
  }

  /**
   * 更新Product
   * @param id 
   * @param value 
   * @param exportValue 
   * @param platform 
   */
  private async modifyProduct(id: string, value: string, exportValue: string, platform: string): Promise<any> {
    return await this.Service.modifyProduct(id, value, exportValue, platform);
  }

  /**
  * 获取Business
  */
  private async getBusiness(filters): Promise<any> {
    let result = await this.Service.businessPage(this.pageNo, this.state.take, filters.value);
    this.gridView.data = result.data.lov;
    this.gridView.total = result.data.total;
  }

  /**
   * 更新Business
   * @param id 
   * @param value
   */
  private async modifyBusiness(key: string, value: string): Promise<any> {
    return await this.Service.modifyBusiness(key, value);
  }

  /**
   * 新增Business
   * @param id 
   */
  private async addBusiness(value: string): Promise<any> {
    return await this.Service.addBusiness(value);
  }

  /**
   * 删除Business
   * @param id 
   */
  private async removeBusiness(key: string): Promise<any> {
    return await this.Service.removeBusiness(key);
  }

  /**
   * 删除Assay
   * @param id 
   */
  private async removeAssayByBusiness(id: string): Promise<any> {
    return await this.Service.removeAssayByBusiness(id);
  }

  /**
   * 删除Assay
   * @param id 
   */
  private async removeAssayPNsByProduct(id: string): Promise<any> {
    return await this.Service.removeAssayPnsByProduct(id);
  }

  /**
   * 更新Assay By Business
   * @param id 
   * @param value 
   * @param exportValue 
   * @param business 
   */
  private async modifyAssayByBusiness(id: string, value: string, exportValue: string, business: string): Promise<any> {
    return await this.Service.modifyAssayByBusiness(id, value, exportValue, business);
  }

  /**
   * 更新Assay PNs By Product
   * @param id 
   * @param value 
   * @param exportValue 
   * @param business 
   */
  private async modifyAssayPnsByProduct(id: string, value: string, product: string, part: string): Promise<any> {
    return await this.Service.modifyAssayPnsByProduct(id, value, product, part);
  }

  /**
   * 新增Assay
   * @param value 
   * @param exportValue 
   * @param business  
   */
  private async addAssayByBusiness(value: string, exportValue: string, business: string): Promise<any> {
    return await this.Service.addAssayByBusiness(value, exportValue, business);
  }

  /**
   * 新增Assay
   * @param value 
   * @param exportValue 
   * @param business  
   */
  private async addAssayPNsByProduct(value: string, product: string, part: string): Promise<any> {
    return await this.Service.addAssayPnsByProduct(value, product, part);
  }

  private async getAssayByBusiness(filters): Promise<any> {
    let result = await this.Service.assayPageByBusiness(this.pageNo, this.state.take, filters.value, filters.exportValue, filters.business);
    this.gridView.data = result.data.data;
    this.gridView.total = result.data.total;
  }

  private async getAssayPNsByProduct(filters): Promise<any> {
    let result = await this.Service.assayPagePnsByProduct(this.pageNo, this.state.take, filters.value, filters.product, filters.part);
    this.gridView.data = result.data.data;
    this.gridView.total = result.data.total;
  }

  private createFormGroup2(item: any): FormGroup {
    if (this.editName == "Manage Cell Line") {
      return new FormGroup({
        value: new FormControl(item.value),
        cellTypes: new FormControl(this.rollUpStringToJson(item.cellTypes, this.cellTypeList))
      })
    } /*else if (this.editName == "Assay") {
      return new FormGroup({
        value: new FormControl(item.value),
        business: new FormControl(this.getValRelationObject(item.business, this.businessList, "value")),
        product: new FormControl(this.getValRelationObject(item.product, this.productList, "value")),
        part: new FormControl(this.getValRelationObject(item.part||null, this.partList, "value")),
        exportValue: new FormControl(item.exportValue)
      });
    }*/ else if (this.editName == "Assay By Business") {
      return new FormGroup({
        value: new FormControl(item.value),
        business: new FormControl(this.getValRelationObject(item.business, this.businessList, "value")),
        exportValue: new FormControl(item.exportValue)
      });
    } else if (this.editName == "Assay PNs By Product") {
      return new FormGroup({
        value: new FormControl(this.getValRelationObject(item.value, this.assayList, "value")),
        product: new FormControl(this.getValRelationObject(item.product, this.productList, "value")),
        part: new FormControl(this.getValRelationObject(item.part||null, this.partList, "value"))
      });
    } else if (this.editName == "Product by Platform") {
      return new FormGroup({
        value: new FormControl(item.value),
        platform: new FormControl(this.getValRelationObject(item.platform, this.platfromList, "value")),
        exportValue: new FormControl(item.exportValue)
      });
    } else if (this.editName == "Business & Platform") {
      return new FormGroup({
        value: new FormControl(item.value),
        business: new FormControl(this.getValRelationObject(item.business, this.businessList, "value")),
        exportValue: new FormControl(item.exportValue)
      });
    }
  }

  private createFormGroup3(item: any): FormGroup {
    if (this.editName == "Manage Cell Line") {
      return new FormGroup({
        value: new FormControl(item.value),
        cellTypes: new FormControl(this.getValRelationObject(item.cellTypes, this.cellTypeList, "value"))
      });
    } /*else if (this.editName == "Assay") {
      return new FormGroup({
        value: new FormControl(item.value),
        business: new FormControl(this.getValRelationObject(item.business, this.businessList, "value")),
        product: new FormControl(this.getValRelationObject(item.product, this.productList, "value")),
        part: new FormControl(this.getValRelationObject(item.part, this.partList, "value")),
        exportValue: new FormControl(item.exportValue)
      });
    }*/ else if (this.editName == "Assay By Business") {
      return new FormGroup({
        value: new FormControl(item.value),
        business: new FormControl(this.getValRelationObject(item.business, this.businessList, "value")),
        exportValue: new FormControl(item.exportValue)
      });
    } else if (this.editName == "Assay PNs By Product") {
      return new FormGroup({
        value: new FormControl(this.getValRelationObject(item.value, this.assayList, "value")),
        product: new FormControl(this.getValRelationObject(item.product, this.productList, "value")),
        part: new FormControl(this.getValRelationObject(item.part, this.partList, "value"))
      });
    } else if (this.editName == "Product by Platform") {
      return new FormGroup({
        value: new FormControl(item.value),
        platform: new FormControl(this.getValRelationObject(item.platform, this.platfromList, "value")),
        exportValue: new FormControl(item.exportValue)
      });
    } else if (this.editName == "Business & Platform") {
      return new FormGroup({
        value: new FormControl(item.value),
        business: new FormControl(this.getValRelationObject(item.business, this.businessList, "value")),
        exportValue: new FormControl(item.exportValue)
      });
    }
  }

  private rollUpStringToJson(item: string, list: Array<any>): any {
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

  /**
 * 获取到与value值相匹配的object
 * @param value 当前值
 * @param data 与之匹配的数组
 */
  private getValRelationObject(value: any, data: Array<{ key: string, value: number | string }>, key: string): object | null {
    if (value) {
      let resule;
      //let params = value.split("~"), resule: any; 
      data && data.forEach((item: any) => {
        if (value == item[key]) {
          resule = item;
        }
      });
      return resule;
    } else {
      return null;
    }
  }

  /**
   * 提示框
   * @param message 提示内容
   */
  private showMessage(message) {

    this.notificationService.show({
      content: message,
      cssClass: 'button-notification',
      animation: { type: 'slide', duration: 500 },
      position: { horizontal: 'center', vertical: 'bottom' },
      type: { style: 'warning', icon: true },
      hideAfter: 3000//自动消失时间
    });

  }

  private getCellTypesList(cellTypes: string): void {
    this.Service.cellTypes(cellTypes).then(result => {
      this.cellTypeList = result.data;
    });
  }

  private getJournalNameList(): void {
    this.Service.journalname().then(result => {
      this.journalNameList = result.data;
    });
  }

  private getPartList(): void {
    this.Service.getPartAll().then(result => {
      this.partList = result.data;
      this.partList.unshift({value: null, key: ""});
    });
  }

  private getAssayList(): void {
    this.Service.getAssayForPnsProduct().then(result => {
      this.assayList = result.data;
    })
  }

  private getProductListForAssay(): void {
    this.Service.getProductAll().then(result => {
      this.productList = result.data;
    })
  }

  private getProductList(business: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.Service.getProductByBusiness(business).then(result => {
        this.productList = result.data;
        resolve()
      });
    })
  }

  private getPlatfromList(product?: string, assay?: string, part?: string): void {
    this.Service.getPlatform(product, assay, part).then(result => {
      this.platfromList = result.data;
    });
  }

  private getBusinessList(): void {
    this.Service.getBusiness().then(result => {
      this.businessList = result.data
    })
  }

  public getWinH(): number {
    return window.innerHeight - 150;
  }

  changeBusiness(event) {
    this.getProductList(event.value)
    //this.productList = new Array()
    this.subFormModel.get('product').setValue(null);
    this.editAssaySender.editRow(this.editAssayIndex, this.subFormModel)
    //this.gridView.data[this.editAssayIndex].product = null
  }

  editHandler({sender, rowIndex, dataItem}) {
    this.getProductList(dataItem.business).then(() => {
      this.editAssayIndex = rowIndex
      this.editAssaySender = sender
      this.subFormModel = new FormGroup({
        id: new FormControl(dataItem.id),
        value: new FormControl(dataItem.value),
        business: new FormControl(this.getValRelationObject(dataItem.business, this.businessList, "value")),
        product: new FormControl(this.getValRelationObject(dataItem.product, this.productList, "value")),
        part: new FormControl(this.getValRelationObject(dataItem.part||null, this.partList, "value")),
        exportValue: new FormControl(dataItem.exportValue)
      });
      sender.editRow(rowIndex, this.subFormModel);
    })

  }

  goBack() {
    this.router.navigate(['/home'])
  }

  filterChange(event) {
    this.pageNo = 1;
    var filters = {}
    for(let i = 0; i < event.filters.length; i++) {
      filters[event.filters[i].field] = event.filters[i].value
    }
    if(this.editName == 'Manage Cell Line') {
      this.getCellLine(filters)
    }
    if(this.editName == 'Manage Cell Type') {
      this.getCellTypes(filters)
    }
    if(this.editName == 'Manage Species') {
      this.getSpecies(filters)
    }
    if(this.editName == 'Manage Research Area') {
      this.getResearcharea(filters)
    }
    /*if(this.editName == 'Assay') {
      this.getAssay(filters)
    }*/
    if(this.editName == 'Assay By Business') {
      this.getAssayByBusiness(filters)
    }
    if(this.editName == 'Assay PNs By Product') {
      this.getAssayPNsByProduct(filters)
    }
    if(this.editName == 'Product by Platform') {
      this.getProduct(filters)
    }
    if(this.editName == 'Manage Assay PNs') {
      this.getPart(filters)
    }
    if(this.editName == 'Manage Cell Seeding Density') {
      this.getcellseedingdensity(filters)
    }
    if(this.editName == 'Manage Plate Coating') {
      this.getPlatecoating(filters)
    }
    if(this.editName == 'Business & Platform') {
      this.getPlatform(filters)
    }
    if(this.editName == 'Manage Business') {
      this.getBusiness(filters)
    }
  }


  ngOnInit() {
    this.getCellTypesList("all");
    //this.getJournalNameList();
    this.getPartList();
    this.getPlatfromList();
    this.getBusinessList();
    this.getProductListForAssay();
    this.getAssayList();
    this.switchGetData(this.editName);
  }

}
