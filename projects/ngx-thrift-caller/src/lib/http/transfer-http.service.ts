import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TransferState, StateKey, makeStateKey } from '@angular/platform-browser';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

// @dynamic
@Injectable()
export class TransferHttpService {
  constructor(
    private transferState: TransferState,
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
  }

  post<T>(
    url: string,
    body: any,
    options?: {
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'response';
      params?:
        | HttpParams
        | {
            [param: string]: string | string[];
          };
      reportProgress?: boolean;
      responseType?: 'json' | 'arraybuffer';
      withCredentials?: boolean;
    },
  ): Observable<T> {
    // tslint:disable-next-line:no-shadowed-variable
    return this.getPostData<T>(
      'post',
      url,
      body,
      options,
      // tslint:disable-next-line:no-shadowed-variable
      (method: string, url: string, body: any, options: any) => {
        return this.httpClient.post<T>(url, body, options);
      },
    );
  }

  private getPostData<T>(
    method: string,
    uri: string | Request,
    body: any,
    options: any,
    callback: (method: string, uri: string | Request, body: any, options: any) => Observable<any>,
  ): Observable<T> {
    let url = uri;

    if (typeof uri !== 'string') {
      url = uri.url;
    }

    const tempKey =
      url + (body ? JSON.stringify(body) : '');
    const key = makeStateKey<T>(tempKey);

    try {
      return this.resolveData(key);
    } catch (e) {
      return callback(method, uri, body, options).pipe(
        tap((data) => {
          const dataArray = new Uint8Array(data);
          // @ts-ignore
          dataArray.seqid = data.seqid;
          if (isPlatformServer(this.platformId)) {
            if (options.responseType === 'arraybuffer') {
              this.setCache<T>(key, dataArray);
            } else {
              this.setCache<T>(key, data);
            }
          }
        }),
      );
    }
  }

  private resolveData<T>(key: StateKey<T>): Observable<any> {
    const data = this.getFromCache<T>(key);

    if (!data.seqid) {
      throw new Error();
    }

    if (isPlatformBrowser(this.platformId)) {
      this.transferState.remove(key);
    }
    const arrayData = new Uint8Array(Object.keys(data).map(e => data[e]));
    // for put seqid to response
    (arrayData as Uint8Array & {seqid: number}).seqid = data.seqid;
    return from(Promise.resolve(arrayData));
  }

  private setCache<T>(key: StateKey<T>, data): void {
    return this.transferState.set(key, data);
  }

  private getFromCache<T>(key: StateKey<T>): any {
    return this.transferState.get(key, null);
  }
}
