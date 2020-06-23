import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ItemComponent } from './item/item.component';
import { AddComponent } from './add/add.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { RegistrationComponent } from './registration/registration.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { FavouriteComponent } from './favourite/favourite.component';
import { AddRoleComponent } from './add-role/add-role.component';
import { ListUserComponent } from './list-user/list-user.component';
import { CommentsComponent } from './comments/comments.component';
import { MainComponent } from './main/main.component';
import { RequestComponent } from './request/request.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CatalogComponent } from './catalog/catalog.component';
import { ServiceComponent } from './service/service.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { ViewServiceComponent } from './view-service/view-service.component';
import { MastersComponent } from './masters/masters.component';
import { AddMasterComponent } from './add-master/add-master.component';
import { ProfileComponent } from './profile/profile.component';
import { ListRequestsComponent } from './list-requests/list-requests.component';
import { FormsModule } from '@angular/forms'; 
import { FilterService } from './shared/pipes/filter-service.pipe';
import { SortPipe } from './shared/pipes/sort-pipe.pipe';
import { SortAbcPipe } from './shared/pipes/sort-abc.pipe';
import { SortAbcMastersPipe } from './shared/pipes/sort-abc-masters.pipe';


import { ListRecordsComponent } from './list-records/list-records.component';
import { RecordComponent } from './record/record.component';
import { TypeServiceComponent } from './type-service/type-service.component';
import { AddTypeServiceComponent } from './add-type-service/add-type-service.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ItemComponent,
    AddComponent,
    RegistrationComponent,
    AuthorizationComponent,
    FavouriteComponent,
    AddRoleComponent,
    ListUserComponent,
    CommentsComponent,
    MainComponent,
    RequestComponent,
    CatalogComponent,
    ServiceComponent,
    AddServiceComponent,
    ViewServiceComponent,
    MastersComponent,
    AddMasterComponent,
    ProfileComponent,
    ListRequestsComponent,
    FilterService,
    SortPipe,
    SortAbcPipe,
    SortAbcMastersPipe,
    ListRecordsComponent,
    RecordComponent,
    TypeServiceComponent,
    AddTypeServiceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    AngularFileUploaderModule,
    TextMaskModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
