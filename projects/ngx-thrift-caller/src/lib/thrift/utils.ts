import { UrlOptions } from './models';

export function parseUrlToUrlOptions(url: string): UrlOptions {
  const parse_http = url.split('://');
  const has_http = parse_http.length > 1;
  return {
    host: has_http ? parse_http[1].split(':')[0] : url.split(':')[0],
    https: has_http ? parse_http[0] === 'https' : true,
    port: (has_http ? +parse_http[1].split(':')[1] : +url.split(':')[1]) || 80
  };
}
