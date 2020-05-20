import { Buffer } from 'buffer';
// @ts-ignore
import { InputBufferUnderrunError, SeqId2Service, Thrift, TProtocolConstructor, TTransportConstructor } from 'thrift';
import { ConnectOptions } from '../thrift/models';
import { TransferHttpService } from '../http/transfer-http.service';

export class AngularXhrConnection {

  public options: ConnectOptions;
  public wpos: number;
  public rpos: number;
  public useCORS: boolean;
  public send_buf: Uint8Array;
  public recv_buf: Uint8Array;
  public transport: TTransportConstructor;
  public protocol: TProtocolConstructor;
  public headers: {
    [header: string]: string | string[];
  };
  public timeout: number;
  public seqId2Service: SeqId2Service;
  public url: string;
  public seqid: any;
  public recv_buf_sc: number;

  public client: any;

  constructor(
    private transferHttp: TransferHttpService,
    host: string,
    port: number,
    options?: ConnectOptions
  ) {
    this.options = options || {};
    this.wpos = 0;
    this.rpos = 0;
    this.useCORS = (options && options.useCORS);
    this.transport = options.transport;
    this.protocol = options.protocol;
    this.headers = options.headers;
    this.timeout = options.timeout || 0;
    const prefix = options.https ? 'https://' : 'http://';
    const path = options.path || '/';

    if (!port || port === 80) {
      this.url = prefix + host + path;
    } else {
      this.url = prefix + host + ':' + port + path;
    }

    this.seqId2Service = {};
  }


  static isOpen(): boolean {
    return true;
  }

  flush() {
    if (this.url === undefined || this.url === '') {
      return this.send_buf;
    }

    this.transferHttp.post(this.url, this.send_buf, {
      headers: this.headers,
      responseType: 'arraybuffer',
      params: {
        seqid: this.seqid
      }
    }).subscribe(response => {
      // seqid gets from XHR from seq-id-interceptor.ts
      this.setRecvBuffer(response, (response as {seqid: number}).seqid);
    }, error => {
      console.error(error);
    });

  }

  setRecvBuffer(buf, seqid): void {
    this.recv_buf = buf;
    this.recv_buf_sc = this.recv_buf.length;
    this.wpos = this.recv_buf.length;
    this.rpos = 0;
    let data;

    if (buf instanceof ArrayBuffer) {
      data = new Uint8Array(buf);
    }
    const thing = Buffer.from(data || buf);
    // @ts-ignore
    this.transport.receiver(this._decodeCallback.bind(this), seqid)(thing);
  }

  open(): void {
  }

  close(): void {
  }

  private _decodeCallback(transport_with_data, seqid) {
    // @ts-ignore
    const protocol = new this.protocol(transport_with_data);
    try {
      while (true) {
        const header = protocol.readMessageBegin();
        const dummy_seqid = header.rseqid * -1;
        let client = this.client;
        // The Multiplexed Protocol stores a hash of seqid to service names
        //  in seqId2Service. If the SeqId is found in the hash we need to
        //  lookup the appropriate client for this call.
        //  The client var is a single client object when not multiplexing,
        //  when using multiplexing it is a service name keyed hash of client
        //  objects.
        // NOTE: The 2 way interdependencies between protocols, transports,
        //  connections and clients in the Node.js implementation are irregular
        //  and make the implementation difficult to extend and maintain. We
        //  should bring this stuff inline with typical thrift I/O stack
        //  operation soon.
        //  --ra
        const service_name = this.seqId2Service[header.rseqid];
        if (service_name) {
          client = this.client[service_name];
          delete this.seqId2Service[header.rseqid];
        }

        const clientCallback = client._reqs[header.rseqid];
        delete client._reqs[header.rseqid];
        client._reqs[dummy_seqid] = (err, success) => {
          transport_with_data.commitPosition();
          if (clientCallback) {
            clientCallback(err, success);
          }
        };
        if (client['recv_' + header.fname]) {
          if (header.rseqid === seqid) {
            client['recv_' + header.fname](protocol, header.mtype, dummy_seqid);
          } else {
            delete client._reqs[dummy_seqid];
            clientCallback && clientCallback(
              new Thrift.TApplicationException(
                Thrift.TApplicationExceptionType.BAD_SEQUENCE_ID,
                'Out of sequence response'));
          }
        } else {
          delete client._reqs[dummy_seqid];
          clientCallback && clientCallback(
            new Thrift.TApplicationException(
              Thrift.TApplicationExceptionType.WRONG_METHOD_NAME,
              'Received a response to an unknown RPC function'));
        }
      }
    } catch (e) {
      if (e instanceof InputBufferUnderrunError) {
        transport_with_data.rollbackPosition();
      } else {
        throw e;
      }
    }
  }

  readAll(): Uint8Array {
    return this.recv_buf;
  }

  write(buf: Uint8Array, seqid): void {
    this.send_buf = buf;
    this.seqid = seqid;
    this.flush();
  }

  getSendBuffer(): Uint8Array {
    return this.send_buf;
  }
}
