import { Component ,ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { UserFormService } from './user-form.service';

import 'rxjs/add/operator/switchMap';
@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class UserFormComponent {
  private model : any;
  private isSubmitted : boolean = false;
  private radioData : any;
  private noResultFound : boolean = false;
  private errMsg = 'No result found please try again later.';
  private score = {
    autoTicks : false,
    disabled : false,
    invert : false,
    max : 15,
    min : 0,
    showTicks : true,
    step : .5,
    thumbLabel : true,
    value : 0,
    vertical : false
  }
  private size = {
    autoTicks : false,
    disabled : false,
    invert : false,
    max : 100,
    min : 0,
    showTicks : true,
    step : 1,
    thumbLabel : true,
    value : 0,
    vertical : false
  }
  constructor(private UserFormService:UserFormService , private router:Router){
    this.model = {
        'firstName': '',
        'lastName':'',
        'street': '',
        'zip' : '',
        'town': '',
        'typeOfData':'Normal'
    };
    this.radioData = [
        {value : 'Normal'},
        {value : 'Phonetic'},
        {value : 'EdgeGram'}
    ]

  }
  
  onSubmit() {
    this.isSubmitted = true;
    let obj = {
        'firstName': this.model.firstName,
        'lastName':this.model.lastName,
        'street': this.model.street,
        'zip' : 0,
        'town': this.model.town,
        'typeOfData':this.model.typeOfData
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
    let jsonTemp = {
        "score":this.score.value,
        "size":this.size.value,
        "person":obj
    };

    this.UserFormService.size = this.size.value;
    this.UserFormService.score = this.score.value;
    this.UserFormService.typeOfData = obj.typeOfData;

    this.UserFormService.submitUserForm(jsonTemp).subscribe((data) => {
        this.UserFormService.userFormData = data;
        this.UserFormService.userFormMainData = this.model;
        if(this.UserFormService.userFormData.length > 0){
            this.router.navigate(['/network-graph']);
        }else{
            if(this.size.value == 0){
                this.errMsg = 'Size should be more than 0.';
            }
            this.noResultFound = true;
            this.isSubmitted = false;
        }
     });
  }
  reset(){
    this.model = {
        'firstName': '',
        'lastName':'',
        'street': '',
        'zip' : '',
        'town': '',
        'typeOfData':'Normal'
    };
    this.size.value = 0;
    this.score.value = 0;
  }

}
