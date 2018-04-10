import {UrlSerializer, UrlTree, DefaultUrlSerializer} from '@angular/router';


export class CustomUrlSerializer implements UrlSerializer {
    
    parse(url: any): UrlTree {
        let dus = new DefaultUrlSerializer();
        return dus.parse(url);
    }

    serialize(url): any {        
        return encodeURI(url);
    }
	}