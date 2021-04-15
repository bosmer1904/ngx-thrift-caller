import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SeqidHttpResponse } from './seqid-http-response';

@Injectable()
export class SeqIdInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const seqid = +req.params.get('seqid');
    if (seqid) {
      const request = req.clone({
        params: req.params.delete('seqid'),
        responseType: (req.responseType === 'arraybuffer') ? 'arraybuffer' : 'text'
      });
      return next.handle(request).pipe(
        map(response => {
          if (response instanceof HttpResponse && typeof response.body !== 'string') {
            response.body.seqid = seqid;
          } else if (response instanceof HttpResponse && typeof response.body === 'string') {
            response = response.clone<SeqidHttpResponse<string>>({body: {
                body: response.body,
                seqid
              }});
          }
          return response;
        })
      );
    } else {
      return next.handle(req);
    }
  }

}
