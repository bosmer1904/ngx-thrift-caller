import { TProtocolConstructor, TTransportConstructor } from 'thrift';
import { parseUrlToUrlOptions } from './utils';
import { createClient, createConnection, UrlOptions } from './models';
import { ClientFactory } from './client-factory';
import { TransferHttpService } from '../http/transfer-http.service';

export class ThriftCompiler {
  transport: TTransportConstructor;
  protocol: TProtocolConstructor;
  url: UrlOptions;
  transferHttp: TransferHttpService;

  constructor(transferHttp: TransferHttpService,
              transport: TTransportConstructor,
              protocol: TProtocolConstructor,
              url: UrlOptions | string) {
    this.transferHttp = transferHttp;
    if (typeof url === 'string') {
      this.url = parseUrlToUrlOptions(url);
    } else {
      this.url = url;
    }
    this.transport = transport;
    this.protocol = protocol;
  }

  getFactory(connectionType: createConnection, clientType: createClient): ClientFactory {
    return new ClientFactory(this.transferHttp, this.transport, this.protocol, connectionType, clientType, this.url);
  }
}
