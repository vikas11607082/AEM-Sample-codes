import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class AppRestService {
  constructor(private _http: HttpClient) {
  }

  public getData(requestParam: any) {
    return this._http.get(requestParam.url)
      .catch((error: any) => Observable.throw(error.error || 'Server error'));
  }
}
