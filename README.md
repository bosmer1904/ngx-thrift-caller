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
import { HttpClient } from '@angular/common/http';
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

export function thriftCallerFactory(transferHttp: TransferHttpService | HttpClient): NgxThriftCaller {

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
    USER: factory.getClient(UserService, {
        path: '/user',
        headers: {
            'header-name': 'header-value'
        }  
    }),
    PROJECT: factory.getClient(ProjectService, {
      path: '/project'
    })
  };

  return new NgxThriftCaller(factory, clients, callback, preRequest);
}
```
If you want to use base64 encoding, you should add the header ```Content-Transfer-Encoding: base64``` to your thrift client like this:
```typescript
USER: factory.getClient(UserService, {
        path: '/user',
        headers: {
            'Content-Transfer-Encoding': 'base64'
        }  
    })
```

Then in **app.module.ts** import **NgxThriftCallerModule.forRoot()** with providing NgxThriftCaller via our factory.
Second parameter of **NgxThriftCallerModule.forRoot()** is optional. It`s contains config for separate api urls to use in StateKey for TransferState: SSR (privateUrl) and CSR(publicUrl). 

```typescript
const publicApi = 'https://example.public.api';
const privateApi = 'https://example.private.api';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'my-app' }),
    HttpClientModule,
    NgxThriftCallerModule.forRoot({
        provide: NgxThriftCaller,
        useFactory: thriftCallerFactory,
        deps: [TransferHttpService]
    }, {
        publicUrl: publicApi,
        privateUrl: privateApi
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
