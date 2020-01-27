import { Component, OnInit, Type, Query } from '@angular/core';

import { Http  , ResponseOptions , Headers  , URLSearchParams, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'modal-content',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})

export class UpdateComponent implements OnInit {
  res:any;
  column_value:String;
  apiBase: string = environment.apiBase;
  column_values:any[];
  object: Array<Array<any>>;
  column_names:Array<any>;
  table_name: String;
  isSuccessful: boolean
  datasource: Observable<any>;

  constructor(private http:Http,public bsModalRef: BsModalRef,public activeRoute: ActivatedRoute,private router: Router) {
    this.isSuccessful = false;

  }
  ngOnInit() {
    this.column_values = new Array<any>();
  // var selectSource = this.http.get("http://localhost:8081/objectDetailMysql?tableName="+this.table_name+"&column_name=id&name="+this.column_value).map(res=>res.json());
    console.log(this.column_value);
    var selectSource = this.http.get(this.apiBase+"/objectDetailOracle?tableName="+this.table_name+"&column_name=ID&name="+this.column_value).map(res=>res.json());
   selectSource.subscribe(data=>{
     console.log(data);
     for (let index=0; index< data.metaData.length; index++) {
       console.log(data.rows[index]);
       this.column_values[data.metaData[index].name] = data.rows[0][index];
     }
   })
    console.log(this.column_values)
  }
  update(){
    const   d = new URLSearchParams();
    var query:string="";

    for (let index = 0; index < this.column_names.length; index++) {
      query+=this.column_names[index]+" = '"+this.column_values[this.column_names[index]]+"',";
    }
    query=query.substr(0,query.length-1);
    d.append("updateQuery",query)
    console.log(this.column_values)
    console.log(this.column_names[0])
   //this.datasource=this.http.post("http://localhost:8081/updateMysql?name="+this.column_values[this.column_names[0]]+"&tableName="+this.table_name+"&column_name="+this.column_names[0],d).map(res => res.json());
    this.datasource=this.http.post(this.apiBase+"/updateOracle?name="+this.column_values['ID']+"&tableName="+this.table_name+"&column_name="+this.column_names[0],d).map(res => res.json());
    console.log(query);
    this.datasource.subscribe(data=>{
      console.log(data)
      if(data.affectedrows!=0){
        this.isSuccessful = true;
        alert("Update successfully")
        this.bsModalRef.hide();
      } else {
        alert("Update failed")
      }
    })


  }
}
