import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http  ,  URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {Router, NavigationEnd, ActivatedRoute, Params} from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UpdateComponent } from '../update/update.component';
import { GridDataResult, PageChangeEvent, SelectableSettings, RowArgs, SelectAllCheckboxState,DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { orderBy, SortDescriptor, CompositeFilterDescriptor, process, State, filterBy } from '@progress/kendo-data-query';
import { NotificationService } from '@progress/kendo-angular-notification';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs-compat/operator/map';
import { environment } from '../../environments/environment';
import { Service } from "./../../services/service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [Service]
})

export class ProductComponent implements OnInit {
  loading: boolean = false;
  apiBase: string = environment.apiBase;
  bsModalRef: BsModalRef;
  deleteUser:any[];
  datasource: Observable<any>;
  column_names:string[] = ["Create/Update Date","Platform","Publication Title","Publication Link","Primary Author","Author(s)","Journal Name","Publication Date","Research Area","Cell Line","Cell Types","Species","Assay","Product","Part","Cell Seeding Density","Plate Coating"];
  keys:Array<{"key": string, "key2": string}> = [
    {key: "Create/Update Date", key2: "CUDate"},
    {key: "Platform", key2: "Platform"},
    {key: "Publication Title", key2: "PublicationTitle"},
    {key: "Publication Link", key2: "PublicationLink"},
    {key: "Primary Author", key2: "PrimaryAuthor"},
    {key: "Author(s)", key2: "Authors"},
    {key: "Journal Name", key2: "JournalName"},
    {key: "Publication Date", key2: "PublicationDate"},
    {key: "Research Area", key2: "ResearchArea"},
    {key: "Cell Line", key2: "CellLine"},
    {key: "Cell Types", key2: "CellType"},
    {key: "Species", key2: "Species"},
    {key: "Assay", key2: "Assay"},
    {key: "Product", key2: "Product"},
    {key: "Part", key2: "Part"},
    {key: "Cell Seeding Density", key2: "CellSeedingDensity"},
    {key: "Plate Coating", key2: "PlateCoating"}
  ];
  searchParams: any = {};
  currentPage = 4;
  object:any[];
  column_id:any[];
  private pageNo: number = 1;
  private pageSize2: number = 25;
  private editedRowIndex: number;
  private editedProduct: object;
  private updatedItems: any[] = [];
  private createdItems: any[] = [];
  public pageSize = 25;
  public skip = 0;
  public objects:String[][];
  public selectAllState: SelectAllCheckboxState = 'unchecked';
  public gridView: GridDataResult = {
    data: [],
    total: 0
  };
  public allowUnsort = false;

  public sortfield = null;
  public state: State = {
    sort: [],
    skip: 1,
    take: 25,
    // Initial filter descriptor
    filter: {
      logic: 'or',
      filters: []
    }
  };
  public selectableSettings: SelectableSettings = {
    checkboxOnly: true,
    mode: 'multiple'
  };
  public sort;
  public mySelection: number[] = [];
  private selectData : Array<{ID: number, subid?: number}> = [];

  public sortChange(sort: SortDescriptor[]): void {
    if(sort[0].dir) {
      this.sort = {
        sort: sort[0]
      };
    } else {
      this.sort = {};
    }

    this.createTable('');
    //this.loadProducts();
  }
  /*private loadProducts(): void {
    this.gridView.data = orderBy(this.object, this.sort);
  }*/

   public events: string[] = [];

   public onItemClick(): void {
       this.log('item click');
   }

   private log(event: string): void {
       this.events.push(`${event}`);
   }

   private items: any[] = this.object;

   public pageChange(event: PageChangeEvent): void {
       this.skip = event.skip;
       this.state.skip = event.skip;
       //this.loadItems();
       this.pageNo = event.skip/event.take+1;
       this.createTable("");
   }

   private loadItems(): void {
      for (let index = 0; index < this.items.length; index++) {
        for (const iterator2 of this.column_names) {
          if(this.items[index][iterator2] != null&&this.items[index][iterator2].length>64){
            this.items[index][iterator2] = this.items[index][iterator2].substring(0,64);
            this.items[index][iterator2] = this.items[index][iterator2]+"..."
          }
        }
      }
      this.gridView.data = this.items;
  }
  data: any[];
  searchValue: String;
  DialogService: any;
  showObject:String[][];
  selectObject: boolean[];
  deleteSuccessfully=true;

  @Input() public tableName: string ;
  @Output() outChildMsg = new EventEmitter<String>();
  changeA:boolean;
  constructor( private http: Http ,private modalService: BsModalService, private router: Router,private Service: Service,private formBuilder: FormBuilder,private notificationService: NotificationService, private activeRoute: ActivatedRoute) {
    // super();
    this.data = new Array<any>();
    this.searchValue=null;
    this.selectObject = new Array<boolean>();
    this.activeRoute.queryParams.subscribe((params: Params) => {
      if(params.filters) {
        this.state.filter.filters = JSON.parse(params.filters)
        let data : object = {};
        this.pageNo = 1;
        if(this.state.filter.filters && this.state.filter.filters){
          this.state.filter.filters.forEach(item => {
            data[this.getkey(this.keys, item['field'])] = item['value'];
          });      
        }
        this.searchParams = data;
        
      }
      this.createTable("");
    })
    //this.createTable(this.tableName);
  }
  ngOnInit() {
    setTimeout(()=>{
      var doc = document.querySelectorAll(".k-filtercell-operator")
      for(let i = 0; i < doc.length; i++) {
        doc[i]['style']['display'] = "none"
      }
      //document.querySelectorAll(".k-filtercell-operator").forEach((item: any) => item.style="display: none");
    });
  }

  edit({ dataItem }) {
    if(this.state.filter.filters.length == 0) {
      this.router.navigate(['insert'], { queryParams: { ID: dataItem.ID}});
    } else {
      this.router.navigate(['insert'], { queryParams: { ID: dataItem.ID, filters: JSON.stringify(this.state.filter.filters) }});
    }
  }

  async createTable(tableName) : Promise<any> {
    let data : any = {
      index: this.pageNo,
      offset: this.pageSize2
    };
    Object.assign(data, this.searchParams);
    Object.assign(data, this.sort)
    
    this.Service.publicAtion(data).then((result) => {
      console.log(result)
      this.object = result.data.publication;
      this.items = this.object;
      console.log(result.data.total)
      this.gridView.total = result.data.total;
      this.loadItems();
    });
  }

  private getTime() {
    const date: Date = new Date();
    return this.addZero(date.getFullYear()) + "_" + this.addZero(date.getMonth() + 1) + "_" + this.addZero(date.getDate()) + " " + this.addZero(date.getHours()) + "_" + this.addZero(date.getMinutes()) + "_" + this.addZero(date.getSeconds());
  }
 
  async exportSelected(){
    this.loading = true
    let result = await this.Service.export(this.searchParams);
    
    let file = new Blob([result.data._body], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"});
    let date = this.getTime();
    let objectUrl = URL.createObjectURL(file);
    let a = document.createElement('a');
    a.setAttribute('style', 'display:none');
    a.setAttribute('href', objectUrl);
    a.setAttribute('download', "DDE_Publication_"+date+".xlsx");
    a.click();
    URL.revokeObjectURL(objectUrl);
    this.loading = false
  }

  async exportForEndeca(){
    this.loading = true
    let result = await this.Service.exportForEndeca();
    
    let file = new Blob([result.data._body], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"});
    let date = this.getTime();
    let objectUrl = URL.createObjectURL(file);
    let a = document.createElement('a');
    a.setAttribute('style', 'display:none');
    a.setAttribute('href', objectUrl);
    a.setAttribute('download', "DDE_Publication_Endeca"+date+".xlsx");
    a.click();
    URL.revokeObjectURL(objectUrl);
    this.loading = false
  }

  async pushToEndeca(){
    this.loading = true
    let result = await this.Service.pushToEndeca();
    if(result.status != 401) {
      this.notificationService.show({
        content: result.data.message,
        cssClass: 'button-notification',
        animation: { type: 'slide', duration: 500 },
        position: { horizontal: 'center', vertical: 'bottom' },
        type: { style: 'warning', icon: true },
        hideAfter: 3000
      });
    }
    this.loading = false
  }

  import(){
    this.router.navigate(['import'],{ queryParams: { tableName:  this.tableName}})
  }
  search(searchValue){
    var queryString = "";
    for (let index = 0; index < this.column_names.length;index++) {
      if(index != 0){
        queryString = queryString+" or INSTR(seaHorse."+this.column_names[index]+",\""+searchValue+"\")>0";
      } else {
        queryString = queryString+"INSTR(seaHorse."+this.column_names[index]+",\""+searchValue+"\")>0";
      }
    }
    this.datasource = this.http.get('http://localhost:8081/searchMysql?tableName='+this.tableName+'&queryString='+queryString).map(res =>res.json());
    this.datasource.subscribe(
      (data)=>{
        this.items = data;
        this.loadItems();
      }
    );

    this.ngOnInit();
  }


  public async removeHandler({ rowIndex }): Promise<any> {

    let result: any;
    if(this.items[rowIndex-1]["SubId"]){
     result = await this.Service.deletePublication({id: this.items[rowIndex-1]["ID"], subId: this.items[rowIndex-1]["SubId"]}); 
    }else{
      result = await this.Service.deletePublication({id: this.items[rowIndex-1]["ID"]});
    }
    if (result.data.message == "Remove Successful!") {
      this.createTable(this.tableName);
    }
    if(result.status != 401) {
      this.showMessage(result.data.message);
    } 
  }
  dropTable(tablename){
    var deleteResult;
    deleteResult=this.http.get(this.apiBase+"/deleteTableOracle?tableName="+tablename).map(res =>res.json());
    deleteResult.subscribe(data=>{
      if(data.affectedrows!=0){
        alert("drop successfully");
        this.outChildMsg.emit("drop:successfully");
      } else {
        this.deleteSuccessfully = false;
      }
    })
  }

  async dataStateChange(state: any): Promise<any> {
      this.state = state;
  }
  async filterChange(filter): Promise<any> { 
    console.log(filter);
    this.state.skip = 1;
    let data : object = {};
    this.pageNo = 1;
    if(filter.filters && filter.filters.length){
      filter.filters.forEach(item => {
        console.log(this.getkey(this.keys, item.field))
        data[this.getkey(this.keys, item.field)] = item.value;
      });      
    }
    this.searchParams = data;
    console.log('datachange:', this.searchParams)
    this.createTable("");

    
  }
  public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
    if (!isEdited) {    
          sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
      }
  }
  public cellCloseHandler(args: any) {
      const { formGroup, dataItem, column } = args;
      if (!formGroup.valid) {
          // prevent closing the edited cell if there are invalid values.
          args.preventDefault();
      } else if (formGroup.dirty) {        
          this.assignValues(dataItem, formGroup.value);
          this.update(dataItem, column);
      }
  }
  assignValues(target: any, source: any): void {
      Object.assign(target, source);
  }
    /**
     * 更新表格
     * @param item 当前对象
     * @param column 被修改的对线
     */
  update(item: any, column:any) : any {

    const keys: Array<{"key": string, "key2": string}> = [
      {"key": "Publication Title","key2": "PublicationTitle"},
      {"key": "Publication Link" ,"key2":"PublicationLink"},
      {"key": "Primary Author" ,"key2":"PrimaryAuthor"},
      {"key": "Author(s)" ,"key2":"Authors"},
      {"key": "Journal Name" ,"key2":"JournalName"},
      {"key": "Publication Date","key2":"PublicationDate"}
    ];

    let key: string = this.getkey(keys, column.title),
        params: object = new Object;
        params[key] = item[column.title];

    this.publicationEditData(item.ID, params);     
  }

  /**
   * 关联表格的key
   * @param keys 全部的key
   * @param key 当前key
   */
  getkey(keys: Array<{"key": string, "key2": string}>, key:string) : string{
    let result: string;
    keys.forEach((item)=>{
      if(item.key == key)
        result = item.key2;
    });
    return result;
  }
  
  itemIndex(item: any, data: any[]){
      (item: any, data: any[]): number => {
      for (let idx:number = 0; idx < data.length; idx++) {
          if (data[idx].ID === item.ID) {
              return idx;
          }
      }

      return -1;
    }
  }

  /**
   * 编辑表格
   * @param dataItem 当前行数据
   */
  public createFormGroup(dataItem: any): FormGroup {
      return this.formBuilder.group({
          'ID': dataItem.ID, 
          'Publication Title': dataItem["Publication Title"],
          'Publication Link': dataItem["Publication Link"],
          'Primary Author': dataItem["Primary Author"],
          'Author(s)': dataItem["Author(s)"],
          'Journal Name': dataItem["Journal Name"],
          'Publication Date': dataItem["Publication Date"]          
      });
  }

  async publicationEditData(id: string, params: object): Promise<any>{
    const result = await this.Service.publicationEdit(id,params);
    if(result.status != 401) {
      this.showMessage(result.data.message);
    }
    this.createTable(this.tableName);
  }

  public onSelectedKeysChange(e) {
 
    const len = this.mySelection.length;

        if (len === 0) {
            this.selectAllState = 'unchecked';
        } else if (len > 0 && len < this.gridView.data.length) {
            this.selectAllState = 'indeterminate';
        } else {
            this.selectAllState = 'checked';
        }
  }

  public onSelectAllChange(checkedState: SelectAllCheckboxState){
    // console.log(checkedState);
  }

  //小于10，前面补0；9=>09
  private addZero(val){
    return val < 10 ? "0"+val : val;
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

  public getWinH(): number {
      return window.innerHeight - 216;
    }
  }

export class selectObject{
  name:String;
  isChoose:boolean
  constructor( name:String,isChoose:boolean) {
    this.name=name;
    this.isChoose=isChoose;
  }

}
