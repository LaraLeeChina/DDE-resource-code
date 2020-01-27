import { Component, OnInit, Type, ViewEncapsulation } from '@angular/core';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HttpHeaders, HttpRequest, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '@progress/kendo-angular-notification';
import { environment } from '../../environments/environment';
import { Service } from "./../../services/service";

@Component({
  selector: 'modal-content',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
  providers: [Service],
  encapsulation: ViewEncapsulation.None
})
export class ImportComponent implements OnInit {
  apiBase: string = environment.apiBase;
  selectedFile: File = null;
  table_name: String;
  datasource: Observable<any>;
  errorMessage: string;
  constructor(private http: HttpClient,public bsModalRef: BsModalRef,public activeRoute: ActivatedRoute,private router: Router,private Service: Service,private notificationService: NotificationService){

  }
  ngOnInit(): void {

  }
  uploadFile(event){
    this.errorMessage = "";
    this.selectedFile = <File>event.target.files[0];
  }
  async fileUpload(){
    let fd: FormData = new FormData();
    fd.append('excel',this.selectedFile);
    
    let result = await this.Service.publicationImport(fd);
    
    try {
      if(result.data.message == "Import Successful!"){
        this.bsModalRef.hide();    
        this.showMessage(result.data.message);      
      } 
      if(result.data.link) {
        this.bsModalRef.hide(); 
        this.notificationService.show({
          content: 'There are duplicate Publication Link records in the import file and only the first duplicate information is imported. The duplicate Publication Link is: ' + String(this.unique(result.data.link)),
          cssClass: 'button-notification',
          animation: { type: 'slide', duration: 500 },
          position: { horizontal: 'center', vertical: 'bottom' },
          closable: true,
          type: { style: 'warning', icon: true },
          hideAfter: 3000//自动消失时间
        });
      }
      if(result.data.message != "Import Successful!" && !result.data.link &&result.status != 401) {
        this.showMessage(result.data.message);
      }
      
    }
    catch (err){
      console.error(err);
    }
  }

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

  unique(arr){            
    for(var i=0; i<arr.length; i++){
        for(var j=i+1; j<arr.length; j++){
            if(arr[i]==arr[j]){         //第一个等同于第二个，splice方法删除第二个
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr;
  }
}
