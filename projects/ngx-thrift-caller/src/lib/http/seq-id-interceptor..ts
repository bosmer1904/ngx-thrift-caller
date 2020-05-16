import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SeqIdInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isBuffer = req.responseType === 'arraybuffer';
    const seqId = req.params.get('seqid');
    if (isBuffer && seqId) {
      const request = req.clone({
        params: req.params.delete('seqid')
      });
      return next.handle(request).pipe(
        map(response => {
          if (response instanceof HttpResponse) {
            response.body.seqid = seqId;
          }
          return response;
        })
      );
    } else {
      return next.handle(req);
    }
  }

}
