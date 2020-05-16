export class AngularXHRClient {
  constructor(ServiceClient, connection) {
    if (ServiceClient.Client) {
      ServiceClient = ServiceClient.Client;
    }

    const writeCb = (buf, seqid) => {
      connection.write(buf, seqid);
    };

    const transport = new connection.transport(undefined, writeCb);
    const client = new ServiceClient(transport, connection.protocol);
    client.path = connection.options.path;
    transport.client = client;
    connection.client = client;
    return client;
  }

}
