import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { FileUploadModule} from 'ng2-file-upload';
import { HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http'
import { UpdateComponent } from './update/update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsertComponent } from './insert/insert.component';
import { LoginComponent } from './login/login.component';
import { ShowTableComponent } from './show-table/show-table.component';
import { ImportComponent } from './import/import.component';
import { HeaderComponent } from './header/header.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ExportStructureComponent } from './export-structure/export-structure.component';
import { ImportStructureComponent } from './import-structure/import-structure.component';
import { PaginationModule } from 'ngx-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderbarComponent } from './headerbar/headerbar.component';
import { FooterbarComponent } from './footerbar/footerbar.component';
import { CellLineEditComponent } from './cellLineEdit/cellLineEdit.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import {RootService} from "./../services/rootService";
import {Service} from "../services/service";
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { OktaCallbackComponent } from './okta-callback/okta-callback.component';
import { OktaCallbackLogoutComponent } from './okta-callback-logout/okta-callback-logout.component';
import { Util } from '../services/util'

@NgModule({
  declarations: [
    HeaderComponent,
    AppComponent,
    HomeComponent,
    ProductComponent,
    UpdateComponent,
    InsertComponent,
    LoginComponent,
    ImportComponent,
    ShowTableComponent,
    HeaderComponent,
    ExportStructureComponent,
    ImportStructureComponent,
    HeaderbarComponent,
    FooterbarComponent,
    CellLineEditComponent,
    OktaCallbackComponent,
    OktaCallbackLogoutComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FileUploadModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    GridModule,
    BrowserAnimationsModule,
    DropDownsModule,
    DateInputsModule,
    NotificationModule,
    DialogsModule,
    TooltipModule
  ],
  providers: [
    RootService,
    Service,
    Util
  ],
  entryComponents: [ImportComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
