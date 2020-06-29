import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { ListUserComponent } from './list-user/list-user.component';
import { MainComponent } from './main/main.component';
import { CatalogComponent } from './catalog/catalog.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { ViewServiceComponent } from './view-service/view-service.component';
import { MastersComponent } from './masters/masters.component';
import { AddMasterComponent } from './add-master/add-master.component';
import { ProfileComponent } from './profile/profile.component';
import { ListRequestsComponent } from './list-requests/list-requests.component';
import { ListRecordsComponent } from './list-records/list-records.component';
import { TypeServiceComponent } from './type-service/type-service.component';
import { AddTypeServiceComponent } from './add-type-service/add-type-service.component';
import { RecordMasterComponent } from './record-master/record-master.component';
import { RecordDateComponent } from './record-date/record-date.component';
import { RecordTimeComponent } from './record-time/record-time.component';
import { ViewRecordComponent } from './view-record/view-record.component';


const routes: Routes = [
  { path: "", component: MainComponent },
  { path: "registration", component: RegistrationComponent },
  { path: "login", component: AuthorizationComponent },
  
  { path: "profile", component: ProfileComponent },
  { path: "catalog", component: CatalogComponent },
  { path: "addService", component: AddServiceComponent },
  { path: "services/:id_service", component: ViewServiceComponent },
  { path: "masters", component: MastersComponent },
  { path: "add-master", component: AddMasterComponent },
  { path: "list-requests", component: ListRequestsComponent },
  { path: "list-records", component: ListRecordsComponent },

  { path: "add-role", component: AddRoleComponent },
  { path: "list-user", component: ListUserComponent },
  { path: "list-specialization", component: TypeServiceComponent },
  { path: "add-type-specialization", component: AddTypeServiceComponent },
  { path: "record-master/:id_service", component: RecordMasterComponent },
  { path: "record-date/record", component: RecordDateComponent},
  { path: "record-time/record", component: RecordTimeComponent},
  { path: "profile/:id_record", component: ViewRecordComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
