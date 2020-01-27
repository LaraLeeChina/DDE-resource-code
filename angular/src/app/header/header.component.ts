import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { InsertComponent } from '../insert/insert.component';
import { ImportComponent } from '../import/import.component';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  bsModalRef: BsModalRef;
  @Input() public tableName: string ;
  @Output() outChildMsg = new EventEmitter<String>();
  searchInfo :String;
  constructor(private modalService: BsModalService, private router: Router ) {
    this.searchInfo="";
  }

  ngOnInit() {

  }
  search(){
    this.outChildMsg.emit("search:"+this.searchInfo);
  }
  export(){
    this.outChildMsg.emit("export:request")
  }
  exportForEndeca() {
    this.outChildMsg.emit("exportForEndeca:request")
  }
  pushToEndeca() {
    this.outChildMsg.emit("pushToEndeca:request")
  }
  insert() {
    const initialState = {
      table_name:this.tableName,
      title: 'Modal with component'
    };
    // this.bsModalRef = this.modalService.show(InsertComponent, {initialState});
    // this.bsModalRef.content.closeBtnName = 'Close';
    // this.modalService.onHidden.subscribe((r: string) => {
    //   this.outChildMsg.emit("insert:finished");
    // });
    this.router.navigate(['/insert']);
  }
  import() {
    const initialState = {
      table_name: this.tableName,
      title: 'Modal with component'
    };
    this.bsModalRef = this.modalService.show(ImportComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
    this.modalService.onHidden.subscribe((r: string) => {
      this.outChildMsg.emit("import:finished");
    });
  }

  cellLineEdit(){
    this.router.navigate(['/lovs']);
  }

  drop(){
    this.outChildMsg.emit("drop:requesting");
  }
}
