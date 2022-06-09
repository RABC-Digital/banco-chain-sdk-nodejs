import camelcaseKeys from 'camelcase-keys';
import * as crypto from 'crypto';
import * as is from 'is';
import jwt from 'jsonwebtoken';
import * as urllib from 'urllib';

import pkg from '../package.json';

export interface BancoChainSdkConfig {
  appId: string;
  clientId: string;
  clientSecret: string;
  privateKey: string;
  keyType?: 'PKCS1' | 'PKCS8'; // 指定private key类型, 默认： PKCS1, PKCS8: PRIVATE KEY, PKCS1: RSA PRIVATE KEY
  gateway?: string;
  timeout?: number;
  version?: 'v1';
  urllib?: typeof urllib;
}

export interface BancoChainSdkCommonResult {
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  showType?: number;
  data: any;
}

export interface IRequestParams {
  [key: string]: any;
}

export interface IRequestOption {
  log?: {
    info(...args: any[]): any;
    error(...args: any[]): any;
  };
}

class BancoChainSdk {
  private sdkVersion: string;
  public config: BancoChainSdkConfig;

  constructor(config: BancoChainSdkConfig) {
    if (!config.appId) {
      throw Error('config.appId is required');
    }
    if (!config.clientId) {
      throw Error('config.clientId is required');
    }
    if (!config.clientSecret) {
      throw Error('config.clientSecret is required');
    }
    if (!config.privateKey) {
      throw Error('config.privateKey is required');
    }

    const privateKeyType = config.keyType === 'PKCS8' ? 'PRIVATE KEY' : 'RSA PRIVATE KEY';
    config.privateKey = this.formatKey(config.privateKey, privateKeyType);

    this.config = Object.assign({
      urllib,
      gateway: 'https://openapi.bancochain.com/api',
      timeout: 5000,
      version: 'v1',
    }, camelcaseKeys(config, { deep: true }));

    this.sdkVersion = `banco-chain-sdk-nodejs-${pkg.version}`;
  }

  private formatKey(key: string, type: string): string {
    const item = key.split('\n').map(val => val.trim());

    if (item[0].includes(type)) {
      item.shift();
    }

    if (item[item.length - 1].includes(type)) {
      item.pop();
    }

    return `-----BEGIN ${type}-----\n${item.join('')}\n-----END ${type}-----`;
  }

  public token(option: IRequestOption = {}): Promise<BancoChainSdkCommonResult> {
    const config = this.config;

    const assertion = jwt.sign({
      iss: config.appId,
      sub: config.clientId,
      aud: config.gateway,
      jti: crypto.randomBytes(64).toString('hex'),
      exp: Math.floor(Date.now() / 1000) + 45,
    }, config.privateKey, {
      algorithm: 'RS512',
    });
    const url = `${config.gateway}/oauth2/token`;

    const infoLog = (option.log && is.fn(option.log.info)) ? option.log.info : null;
    const errorLog = (option.log && is.fn(option.log.error)) ? option.log.error : null;

    const data = {
      assertion,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    };

    return new Promise((resolve, reject) => {
      config.urllib.request<BancoChainSdkCommonResult>(url, {
        data,
        method: 'POST',
        timeout: config.timeout,
        headers: { 'user-agent': this.sdkVersion },
        dataType: 'json',
      }).then((ret) => {

        infoLog && infoLog('[BancoChainSdk]Apply token request: %s', data);

        // Success
        if (ret.status === 200) {
          if (ret.data && Object.prototype.toString.call(ret.data).toLowerCase() === '[object object]') {

            if (ret.data.success) {
              // TODO: 数据验签
              return resolve(ret.data);
            }

            return reject(ret.data);
          }
          return reject({
            errorCode: '400',
            errorMessage: '[BancoChainSdk]Response format error',
          });
        }

        reject({
          errorCode: ret.status.toString(),
          errorMessage: '[BancoChainSdk]HTTP request error',
        });
      })
      .catch((err) => {
        err.message = '[BancoChainSdk]Apply token error';
        errorLog && errorLog(err);
        reject(err);
      });
    });
  }

  public exec(
    accesstoken: string,
    method: urllib.HttpMethod,
    resource: string,
    params: IRequestParams = {},
    option: IRequestOption = {},
  ) {
    if (!accesstoken) {
      throw Error('Access Token is required');
    }

    const config = this.config;
    const url = `${config.gateway}/${config.version}/${resource}`;

    const infoLog = (option.log && is.fn(option.log.info)) ? option.log.info : null;
    const errorLog = (option.log && is.fn(option.log.error)) ? option.log.error : null;

    return new Promise((resolve, reject) => {
      config.urllib.request<BancoChainSdkCommonResult>(url, {
        method,
        data: params,
        timeout: config.timeout,
        headers: {
          authorization: `Bearer ${accesstoken}`,
          'app-id': config.appId,
          'user-agent': this.sdkVersion,
        },
        dataType: 'json',
      }).then((ret: { status: number, data: any }) => {

        infoLog && infoLog('[BancoChainSdk]Exec request: %s', params);

        // Success
        if (ret.status === 200) {
          if (ret.data && Object.prototype.toString.call(ret.data).toLowerCase() === '[object object]') {

            if (ret.data.success) {
              // TODO: 数据验签
              return resolve(ret.data);
            }

            return reject(ret.data);
          }
          return reject({
            errorCode: '400',
            errorMessage: '[BancoChainSdk]Response format error',
          });
        }

        reject({
          errorCode: ret.status.toString(),
          errorMessage: '[BancoChainSdk]HTTP request error',
        });
      })
      .catch((err) => {
        err.message = '[BancoChainSdk]Exec error';
        errorLog && errorLog(err);
        reject(err);
      });
    });
  }
}

export default BancoChainSdk;
