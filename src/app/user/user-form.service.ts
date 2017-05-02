import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserFormService {
  public userFormData : any;
  public userFormMainData : any;
  private headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http) { }

  submitUserForm(obj:any) {

    let url = 'http://10.105.104.19:8080/ire/match/byall';

    if(obj.person.typeOfData == 'Phonetic'){
        url = 'http://10.105.104.19:8080/ire/match/homophone';
    }else if(obj.person.typeOfData == 'EdgeGram'){
        url = 'http://10.105.104.19:8080/ire/match/custom';
    }
    delete obj.person.typeOfData;
    return this.http.post(url, obj,this.headers)
      .map((res: Response) => {
         return res.json();
      });
  }


}