import { TProtocolConstructor, TTransportConstructor } from 'thrift';
import { TransferHttpService } from '../http/transfer-http.service';
import { HttpClient } from '@angular/common/http';

export type createConnection = (transferHttp: TransferHttpService | HttpClient,
                                host: string, port: number, options?: ConnectOptions) => any;
export type createClient = (client, connection) => any;

export interface UrlOptions {
  host: string;
  port: number;
  https: boolean;
}

export interface Clients {
  [name: string]: any;
}

export interface ConnectOptions {
  transport?: TTransportConstructor;
  protocol?: TProtocolConstructor;
  path?: string;
  headers?: {
    [name: string]: string | string[];
  };
  useCORS?: boolean;
  https?: boolean;
  debug?: boolean;
  max_attempts?: number;
  retry_max_delay?: number;
  connect_timeout?: number;
  timeout?: number;
}
