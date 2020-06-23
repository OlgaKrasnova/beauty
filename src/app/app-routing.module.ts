import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { FavouriteComponent } from './favourite/favourite.component';
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


const routes: Routes = [
  { path: "", component: MainComponent },
  { path: "favour", component: FavouriteComponent },
  { path: "registration", component: RegistrationComponent },
  { path: "login", component: AuthorizationComponent },
  { path: "add", component: AddComponent },
  
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
