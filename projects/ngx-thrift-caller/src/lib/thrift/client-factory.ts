import { TClientConstructor, TProtocolConstructor, TTransportConstructor } from 'thrift';
import { ConnectOptions, createClient, createConnection, UrlOptions } from './models';
import { parseUrlToUrlOptions } from './utils';
import { TransferHttpService } from '../http/transfer-http.service';
import { HttpClient } from '@angular/common/http';

export class ClientFactory {
  transport: TTransportConstructor;
  protocol: TProtocolConstructor;
  url: UrlOptions;
  createConnection: createConnection;
  createClient: createClient;
  transferHttp: TransferHttpService | HttpClient;

  constructor(transferHttp: TransferHttpService | HttpClient,
              transport: TTransportConstructor,
              protocol: TProtocolConstructor,
              connectionType: createConnection,
              clientType: createClient,
              url: UrlOptions | string) {
    this.transferHttp = transferHttp;


    if (typeof url === 'string') {
      this.url = parseUrlToUrlOptions(url);
    } else {
      this.url = url;
    }
    this.transport = transport;
    this.protocol = protocol;
    this.createConnection = connectionType;
    this.createClient = clientType;
  }

  getClient<TClient>(service: TClientConstructor<TClient>, options: ConnectOptions): TClient {
    const connection = this.createConnection(this.transferHttp, this.url.host, this.url.port, {
      transport: this.transport,
      protocol: this.protocol,
      https: this.url.https,
      ...options
    });
    return this.createClient(service, connection);
  }
}
