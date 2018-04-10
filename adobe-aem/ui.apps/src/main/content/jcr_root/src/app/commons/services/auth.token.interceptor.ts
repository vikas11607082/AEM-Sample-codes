import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

/**
 * @whatItDoes This interceptor is responsible for handling of the http Authorization header
 *
 * @description If the http response contains an Authorization header, it will be saved in the {@link sessionStorage}.
 * And if the {@link sessionStorage} contains a stored header it will be added to each http request.
 *
 * It can be configure like this
 * <pre><code>
 * @NgModule({
 *   providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true}}]
 * })
 * export class AppModule { }
 * </code></pre>
 *
 */
@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  static readonly HEADER_AUTHORIZATION = 'Authorization';
  private static readonly LOCALSTORE_JWT = 'qb_jwt';
  private static readonly LOCALSTORE_CHANNEL = 'channel';
  private static readonly LOCALSTORE_ORIGIP = 'cc_origip';
  private static readonly LOCALSTORE_SESSIONID = 'qb_sessionid';
  private static readonly LOCALSTORE_USERNAME = 'qb_uname';
  private static readonly LOCALSTORE_TICKET = 'qb_ticket';




  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const storedAuthHeader = sessionStorage.getItem(AuthTokenInterceptor.LOCALSTORE_JWT);

    const storedChannelHeader = sessionStorage.getItem(AuthTokenInterceptor.LOCALSTORE_CHANNEL);
    const storedIPHeader = sessionStorage.getItem(AuthTokenInterceptor.LOCALSTORE_ORIGIP);
    const storedSIDHeader = sessionStorage.getItem(AuthTokenInterceptor.LOCALSTORE_SESSIONID);
    const storedUnameHeader = sessionStorage.getItem(AuthTokenInterceptor.LOCALSTORE_USERNAME);
    const storedTicketHeader = sessionStorage.getItem(AuthTokenInterceptor.LOCALSTORE_TICKET);

    if (storedAuthHeader && storedAuthHeader!=="null" ) {
      request = request.clone({
        setHeaders: {
          'Authorization': storedAuthHeader
        }
      });
    }

      if (storedChannelHeader && storedChannelHeader!=="null") {
        request = request.clone({
          setHeaders: {
            'X-Sales-Channel': storedChannelHeader
          }
        });
      }

        if (storedSIDHeader && storedSIDHeader!=="null") {
          request = request.clone({
            setHeaders: {
              'X-UserSession-ID': storedSIDHeader
            }
          });
        }

          if (storedIPHeader && storedIPHeader!=="null") {
            request = request.clone({
              setHeaders: {
                'X-Originating-IP': storedIPHeader
              }
            });
          }

            if (storedTicketHeader && storedTicketHeader!=="null") {
              request = request.clone({
                setHeaders: {
                  'X-Ticket': storedTicketHeader
                }
              });
            }
              if (storedUnameHeader && storedUnameHeader!=="null") {
                request = request.clone({
                  setHeaders: {
                    'X-CC-User': storedUnameHeader
                  }
                });
              }
    

    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        const response = <HttpResponse<Object>> event;
        const authHeader = response.headers.get(AuthTokenInterceptor.HEADER_AUTHORIZATION);
        const channelHeader = response.headers.get('X-Sales-Channel');
        const ipHeader = response.headers.get('X-Originating-IP');
        const sIDHeader = response.headers.get('X-UserSession-Id');
        const uNameHeader = response.headers.get('X-CC-User');
        const ticketHeader = response.headers.get('X-Ticket');

        if (authHeader) {
          sessionStorage.setItem(AuthTokenInterceptor.LOCALSTORE_JWT, authHeader);
        }
        if(ticketHeader) {
          sessionStorage.setItem(AuthTokenInterceptor.LOCALSTORE_TICKET, ticketHeader);
        }  
        if(channelHeader) {
          sessionStorage.setItem(AuthTokenInterceptor.LOCALSTORE_CHANNEL, channelHeader);
        }
        if(ipHeader) {
          sessionStorage.setItem(AuthTokenInterceptor.LOCALSTORE_ORIGIP, ipHeader);
        }
        if(sIDHeader) {
          sessionStorage.setItem(AuthTokenInterceptor.LOCALSTORE_SESSIONID, sIDHeader);
        }
        if(uNameHeader) {
          sessionStorage.setItem(AuthTokenInterceptor.LOCALSTORE_USERNAME, uNameHeader);
        } 
              
      }
    });
  }
}
