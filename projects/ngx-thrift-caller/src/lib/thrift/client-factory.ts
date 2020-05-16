import { TClientConstructor, TProtocolConstructor, TTransportConstructor } from 'thrift';
import { createClient, createConnection, UrlOptions } from './models';
import { parseUrlToUrlOptions } from './utils';
import { TransferHttpService } from '../http/transfer-http.service';

export class ClientFactory {
  transport: TTransportConstructor;
  protocol: TProtocolConstructor;
  url: UrlOptions;
  createConnection: createConnection;
  createClient: createClient;
  transferHttp: TransferHttpService;

  constructor(transferHttp: TransferHttpService,
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

  getClient<TClient>(service: TClientConstructor<TClient>, path: string): TClient {
    const connection = this.createConnection(this.transferHttp, this.url.host, this.url.port, {
      transport: this.transport,
      protocol: this.protocol,
      https: this.url.https,
      path
    });
    return this.createClient(service, connection);
  }
}
