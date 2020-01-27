import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Http  ,  URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs/Observable';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ExportStructureComponent } from '../export-structure/export-structure.component';
import { ImportStructureComponent } from '../import-structure/import-structure.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-show-table',
  templateUrl: './show-table.component.html',
  styleUrls: ['./show-table.component.css']
})
export class ShowTableComponent implements OnInit {
  apiBase: string = environment.apiBase;
  datasource: Observable<any>;
  bsModalRef: BsModalRef;
  tableNames:String[];
  @Output() outChildMsg = new EventEmitter<string>();
  constructor( private http: Http ,private modalService: BsModalService, private router: Router,) {
  }

  ngOnInit() {
    // this.createTables();
  }
  createTables(){
    // console.log('environment', environment);
    this.tableNames = new Array<String>();
    //this.datasource=this.http.get('http://localhost:8081/tableMysql').map(res => res.json());
    this.datasource=this.http.get( this.apiBase+'/tableOracle').map(res => res.json());
    this.datasource.subscribe(
      (data)=>{
        console.log(data)
        for (const iterator of data.rows) {
          console.log(iterator)
            this.tableNames.push(iterator);
            this.outChildMsg.emit(iterator);
        }
    });
  }
  detail(tablename){
    this.router.navigate(['product'],{ queryParams: { tableName:  tablename}})
  }
  export(){
    const initialState = {
      tableList: this.tableNames,
      title: 'Modal with component'
    };
    this.bsModalRef = this.modalService.show(ExportStructureComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.modalService.onHidden.subscribe((r: string) => {
      if(this.bsModalRef.content.isSuccessful){
        var date=new Date();
        var month=date.getMonth()+1;
        var monthString="";
        if(month<10){
          monthString="0"+month
        } else {
          monthString=month.toString();
        }
        const d = new URLSearchParams();
        var fileName=+date.getFullYear()+""+monthString+""+date.getDay()+""+this.bsModalRef.content.tableName+".json";
        d.append("filename",fileName);
        this.datasource=this.http.post(this.apiBase+"/exportTableMysql?tableName="+this.bsModalRef.content.tableName,d);
        this.datasource.subscribe(data=>{
          var result= data._body;
          var blob = new Blob([result], {type: "json"||data.type});
          var objectUrl = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.setAttribute('style', 'display:none');
          a.setAttribute('href', objectUrl);
          a.setAttribute('download', fileName);
          a.click();
          URL.revokeObjectURL(objectUrl);
        })
      }
    });

  }
  choose(tableName){
    this.outChildMsg.emit(tableName);
  }
  import(){
    console.log("sss")
    const initialState = {
      title: 'Modal with component'
    };
    this.bsModalRef = this.modalService.show(ImportStructureComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.modalService.onHidden.subscribe((r: string) => {
      this.createTables();
    })
  }

}
