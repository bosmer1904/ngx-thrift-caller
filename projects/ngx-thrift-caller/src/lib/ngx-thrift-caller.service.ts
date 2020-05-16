import { Observable } from 'rxjs';
import { ClientFactory } from './thrift/client-factory';
import { Clients } from './thrift/models';

export class NgxThriftCaller {

  constructor(
    private factory: ClientFactory,
    public clients: Clients,
    private callback?: (err: any , res: any) => void,
    private beforeRequest?: (path?: string) => void
  ) {  }

  public call<T>(client, method: string, data?: object, ...rest): Observable<T> {
    return new Observable<T>((observer) => {
      if (this.beforeRequest) {
        this.beforeRequest(client.path);
      }

      const success = (res: T) => {
        if (this.callback) {
          this.callback(undefined, res);
        }
        observer.next(res);
      };

      const failure = (err) => {
        if (this.callback) {
          this.callback(err, undefined);
        }
        observer.error(err);
      };

      if (data) {
        client[method](data, ...rest)
          .then(success, failure).finally(() => {
          observer.complete();
        });
      } else {
        client[method]().then(success, failure).finally(() => {
          observer.complete();
        });
      }
    });
  }
}
