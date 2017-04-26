import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserFormService } from './user-form.service';

import 'rxjs/add/operator/switchMap';
@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  private model : any;
  private isSubmitted : boolean = false;
  constructor(private UserFormService:UserFormService , private router:Router){
    this.model = {
        'firstName': '',
        'lastName':'',
        'street': '',
        'zip' : '',
        'town': ''
    };
  }
  
  onSubmit() {
    this.isSubmitted = true;
    let obj = {
        'firstName': this.model.firstName,
        'lastName':this.model.lastName,
        'street': this.model.street,
        'zip' : 0,
        'town': this.model.town
    };
    if(this.model.zip != ''){
      obj.zip = parseInt(this.model.zip);
    }
    if(this.model.firstName.trim() ==''){
        obj.firstName = null;
    }
    if(this.model.lastName.trim() ==''){
        obj.lastName = null;
    }
    if(this.model.street.trim() ==''){
        obj.street = null;
    }
    if(this.model.town.trim() ==''){
        obj.town = null;
    }

    this.UserFormService.submitUserForm(obj).subscribe((data) => {
        this.UserFormService.userFormData = data;
        this.UserFormService.userFormMainData = this.model;
        this.router.navigate(['/network-graph']);
     });
  }
  reset(){
    this.model = {
        'firstName': '',
        'lastName':'',
        'street': '',
        'zip' : '',
        'town': ''
    };
  }

}
