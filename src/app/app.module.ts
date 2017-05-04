import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule ,ReactiveFormsModule}   from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import {MdSliderModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent }  from './app.component';
import { UserFormComponent } from './user/user-form.component';
import { NetworkGraphComponent } from './network/network-graph.component';
import { UserFormService } from './user/user-form.service';
import { OnlyNumber } from './user/user-form.directive';
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AlertModule.forRoot(),
    AppRoutingModule,
    HttpModule,
    MdSliderModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppComponent,
    UserFormComponent,
    NetworkGraphComponent,
    OnlyNumber 
  ],
  bootstrap: [ AppComponent ],
  providers:[UserFormService]
})
export class AppModule { }