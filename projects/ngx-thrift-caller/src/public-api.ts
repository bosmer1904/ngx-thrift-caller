/*
 * Public API Surface of ngx-thrift-caller
 */

export { NgxThriftCaller } from './lib/ngx-thrift-caller.service';
export { NgxThriftCallerModule } from './lib/ngx-thrift-caller.module';
export { TransferHttpService } from './lib/http/transfer-http.service';
export * from './lib/angular-xhr/creations';
export { AngularXHRClient } from './lib/angular-xhr/angular-xhr-client';
export { AngularXhrConnection } from './lib/angular-xhr/angular-xhr-connection';
export { ThriftCompiler } from './lib/thrift/thrift-compiler';
export { createConnection, createClient, UrlOptions, ConnectOptions, Clients } from './lib/thrift/models';
export { ClientFactory } from './lib/thrift/client-factory';
