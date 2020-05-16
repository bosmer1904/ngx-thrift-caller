# ngx-thrift-caller

Page on  [GitHub](https://github.com/bosmer1904/ngx-thrift-caller)
[NPM](https://www.npmjs.com/package/ngx-thrift-caller)

#### Installation

```
npm install ngx-thrift-caller --save
```

This package compatible only with binary protocol and require `thrift` package 

In `package.json`
```json
"dependencies": {
  ...
  "thrift": "git+https://github.com/bosmer1904/thrift.git"
}
```

#### Configure

First create factory for **NgxThriftCaller**
```typescript
import { TBinaryProtocol, TBufferedTransport } from 'thrift';
import {
  ClientFactory,
  createAngularXHRClient,
  createAngularXHRConnection,
  NgxThriftCaller,
  TransferHttpService,
  UrlOptions
} from 'ngx-thrift-caller';
import { UserService, ProjectService } from 'path-to-your-thrift';

export function thriftCallerFactory(transferHttp: TransferHttpService): NgxThriftCaller {

  let url: UrlOptions = {host: '127.0.0.1', port: 92, https: false};
  /* OR 
  * let url = 'https://127.0.0.1:92',
  * also url = '127.0.0.1' will be parsed with https: true and port 80
  */
  

  const factory = new ClientFactory
    (transferHttp, TBufferedTransport, TBinaryProtocol, createAngularXHRConnection, createAngularXHRClient, url);

  let callback = (err, res) => {
    if (err) {
      console.error(err);
    } else if (res !== undefined) {
      console.log(res);
    }
  };
  
  let preRequest = (path: string) => {  
    console.log('request will send to ', path);
  }

  let clients = {
    USER: factory.getClient(UserService, '/user'),
    PROJECT: factory.getClient(ProjectService, '/project')
  };

  return new NgxThriftCaller(factory, clients, callback, preRequest);
}
```
Then in **app.module.ts** import **NgxThriftCallerModule.forRoot()** with providing NgxThriftCaller via our factory

```typescript
@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    HttpClientModule,
    NgxThriftCallerModule.forRoot({
         provide: NgxThriftCaller,
         useFactory: thriftCallerFactory,
         deps: [TransferHttpService]
    })
  ]
})
```

#### Usage
```typescript
import { NgxThriftCaller } from 'ngx-thrift-caller';

@Component()
export class YourComponent {
    constructor(private thriftService: NgxThriftCaller) {
        this.thriftService.call<T>(this.thriftService.clients.USER, 'method', {...})
            .subscribe(...);
    }
}
```
