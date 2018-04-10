import { Injectable, Inject } from '@angular/core';

@Injectable()
export class AppUrlService{

    private _url:any;

    setUrls(urlObj:any){        
        localStorage.setItem('config', JSON.stringify(urlObj));        
    }

    getUrl(url:string){       
        this._url = JSON.parse(localStorage.getItem('config'));       
        return this._url.urls[url];
    }
}