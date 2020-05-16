import { AngularXhrConnection } from './angular-xhr-connection';
import { AngularXHRClient } from './angular-xhr-client';
import { ConnectOptions, createClient, createConnection } from '../thrift/models';
import { TransferHttpService } from '../http/transfer-http.service';

export const createAngularXHRConnection: createConnection =
  (transferHttp: TransferHttpService, host: string, port: number, options?: ConnectOptions) => {
  return new AngularXhrConnection(transferHttp, host, port, options);
};

export const createAngularXHRClient: createClient = (client, connection) => {
  return new AngularXHRClient(client, connection);
};
