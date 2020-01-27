import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductComponent } from '../product/product.component';
import {ShowTableComponent} from "../show-table/show-table.component";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  tablename:String;
  searchInfo:String;

  @ViewChild('product',{static: false}) public product:ProductComponent;
  @ViewChild('showTable',{static: false}) public showTable:ShowTableComponent;


  constructor(public router: Router, public route: ActivatedRoute) {
    this.tablename = 'null';
    this.route.queryParams.subscribe(
      params => {
        if(params['widget']) {
          this.router.navigateByUrl('/home');
        }
      }
    );
  }

  ngOnInit() {   

  }
  
  getChildMsg(childmsg) {
    this.tablename=childmsg
    this.product.createTable(childmsg)
  }
  getSearchContent(childmsg){
    var temp = childmsg.split(":");
    if(temp[0]=="search"){
      this.searchInfo = temp[1];
      this.product.search(this.searchInfo);
    } else if(temp[0] == "export"){
      this.product.exportSelected();
    }else if(temp[0] == "drop"){
      this.product.dropTable(this.tablename);
    }else if(temp[0] == "exportForEndeca") {
      this.product.exportForEndeca();
    }else if(temp[0] == "pushToEndeca"){
      this.product.pushToEndeca();
    }else{
      this.product.createTable(this.tablename);
    }

  }
  getOperationTable(childmsg){
    this.tablename = undefined;
    this.showTable.createTables();
    this.product.createTable(this.tablename)
  }

}
