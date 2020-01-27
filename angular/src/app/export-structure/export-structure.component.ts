import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'modal-content-export-structure',
  templateUrl: './export-structure.component.html',
  styleUrls: ['./export-structure.component.css']
})
export class ExportStructureComponent implements OnInit {
  tableList:Array<any>;
  tableName:String;
  datasource: Observable<any>;
  isSuccessful: boolean;
  constructor(private http: Http ,public bsModalRef: BsModalRef) {
    this.isSuccessful = false;
   }

  ngOnInit() {
  }
  export(){
    this.isSuccessful = true;
    this.bsModalRef.hide();
  }
}
