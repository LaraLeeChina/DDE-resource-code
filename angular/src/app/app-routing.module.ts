import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { UpdateComponent } from './update/update.component';
import { InsertComponent } from './insert/insert.component';
import { LoginComponent } from './login/login.component';
import { ShowTableComponent } from './show-table/show-table.component';
import { ImportComponent } from './import/import.component';
import { HomeComponent } from './home/home.component';
import { CellLineEditComponent } from './cellLineEdit/cellLineEdit.component';
import { ExportStructureComponent } from './export-structure/export-structure.component';
import { ImportStructureComponent } from './import-structure/import-structure.component';
import { AuthGuard } from './auth/auth.guard';
//import { OktaCallbackComponent } from '@okta/okta-angular';
import { OktaCallbackComponent } from './okta-callback/okta-callback.component'
import { OktaCallbackLogoutComponent } from './okta-callback-logout/okta-callback-logout.component'


const routes: Routes = [
  {
    path:'',
    component:LoginComponent
  }, {
    path:'home',
    component:HomeComponent,
    canActivate: [AuthGuard]
  }, {
    path:'insert',
    component:InsertComponent,
    canActivate: [AuthGuard],
  }, {
    path: 'lovs',
    component: CellLineEditComponent,
    canActivate: [AuthGuard]
  }, {
    path: 'implicit/callback',
    component: OktaCallbackComponent
  }, {
    path: 'implicit/callback/logout',
    component: OktaCallbackLogoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
