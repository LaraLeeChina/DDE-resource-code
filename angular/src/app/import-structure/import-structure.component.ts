import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpHeaders, HttpRequest, HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'modal-import-structure',
  templateUrl: './import-structure.component.html',
  styleUrls: ['./import-structure.component.css']
})
export class ImportStructureComponent implements OnInit {
  tableName: String;
  chooseImportWay:String;
  datasource: Observable<any>;
  elements:any = [{"name": "","type": "","length":""}]
  constructor(private http: HttpClient,public bsModalRef: BsModalRef,public activeRoute: ActivatedRoute,private router: Router) { }
  selectedFile: File = null;
  ngOnInit() {
  }
  addInput() {
    this.elements.push({"name": "","type": "","length":""});
  }
  removeInput(item) {
    console.log(item);
    let i = this.elements.indexOf(item);
    console.log(i);
    this.elements.splice(i, 1);
  } 
  changeway(){
    console.log(this.chooseImportWay)
  }
  uploadFile(event){
    this.selectedFile = <File>event.target.files[0];
  }
  import(){
    if(this.chooseImportWay=='file'){
      const fd = new FormData();
      fd.append('file',this.selectedFile,this.selectedFile.name)
      this.datasource=this.http.post('http://127.0.0.1:8081/importTableMysql?tableName='+this.tableName,fd).map(res =>res.toString);
      this.datasource.subscribe(res=>{
        if(res!=null){
          alert("import successfully")
          this.bsModalRef.hide();
        }
      })
    }else if(this.chooseImportWay=='form'){
      var sql = ``;
      for (const element of this.elements) {
        sql = sql + element.name + ` ` + element.type + `(` + element.length + `),`
      }
      sql = sql.substr(0,sql.length-1);
      const d = new URLSearchParams();
      d.append("column_information",sql);
      this.datasource=this.http.get("http://localhost:8081/createTableOracle?tableName="+this.tableName+"&column_information="+sql).map(res => res.toString); 
      this.datasource.subscribe(data=>{
        console.log(data)
        if(data.affectedRows!=0){
          alert("Insert successful")
          this.bsModalRef.hide();
        } else {
          alert("Insert failed")
          this.bsModalRef.hide();
        }
      })
    }
  }
}
