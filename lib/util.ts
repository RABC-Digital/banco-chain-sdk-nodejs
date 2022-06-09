import * as crypto from 'crypto';
import * as iconv from 'iconv-lite';
import moment from 'moment';
import { BancoChainSdkConfig } from './banco-chain';

export const sign = (params: any = {}, config: BancoChainSdkConfig) => {
  const signParams = Object.assign({
    clientId: config.clientId,
    timestamp: moment().valueOf(),
  }, params);

  const signStr = Object.keys(signParams).sort().map((key) => {
    let data = signParams[key];
    if (Array.prototype.toString.call(data) !== '[object String]') {
      data = JSON.stringify(data);
    }
    return `${key}=${iconv.encode(data, config.charset)}`;
  }).join('&');

  // Calculate the signature
  const sign = crypto.createSign('RSA-SHA256')
                .update(signStr, 'utf8').sign(config.privateKey, 'base64');
  return Object.assign(signParams, { sign });
};
