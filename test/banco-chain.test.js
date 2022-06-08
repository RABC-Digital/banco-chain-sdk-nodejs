'use strict';

require('should');
const fs = require('fs');
const sinon = require('sinon');
const urllib = require('urllib');

const BancoChainSdk = require('../lib/banco-chain').default;

const sandbox = sinon.createSandbox();

const APP_ID = '53900923';
const CLIENT_ID = 'OD8olwq7lTkh1xbf';
const CLIENT_SECRET = 'uT5GcQRI1vo4edxQ';
const GATE_WAY = 'https://api-dev.bancochain.com/api';
const PRIVATE_KEY = fs.readFileSync(__dirname + '/fixtures/app-private-key.pem', 'ascii');

describe('sdk', function() {
  afterEach(function() {
    sandbox.restore();
  })

  describe('config error', () => {
    it('appId is null', () => {
      try {
        const sdk = new BancoChainSdk({
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          gateway: GATE_WAY,
          privateKey: PRIVATE_KEY,
        });
      } catch (e) {
        (e.toString().indexOf('config.appId is required') > -1).should.eql(true);
      }
    });

    it('clientId is null', () => {
      try {
        const sdk = new BancoChainSdk({
          appId: APP_ID,
          clientSecret: CLIENT_SECRET,
          gateway: GATE_WAY,
          privateKey: PRIVATE_KEY,
        });
      } catch (e) {
        (e.toString().indexOf('config.clientId is required') > -1).should.eql(true);
      }
    });

    it('clientSecret is null', () => {
      try {
        const sdk = new BancoChainSdk({
          appId: APP_ID,
          clientId: CLIENT_ID,
          gateway: GATE_WAY,
          privateKey: PRIVATE_KEY,
        });
      } catch (e) {
        (e.toString().indexOf('config.clientSecret is required') > -1).should.eql(true);
      }
    });

    it('privateKey is null', () => {
      try {
        const sdk = new BancoChainSdk({
          appId: APP_ID,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          gateway: GATE_WAY,
        });
      } catch (e) {
        (e.toString().indexOf('config.privateKey is required') > -1).should.eql(true);
      }
    });

    it('formatKey', function() {
      const noWrapperPrivateKey = fs.readFileSync(__dirname + '/fixtures/app-private-key-no-wrapper.pem', 'ascii');
      const sdk = new BancoChainSdk({
        appId: APP_ID,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        privateKey: noWrapperPrivateKey,
        gateway: GATE_WAY,
      });

      sdk.config.privateKey.should.eql(`-----BEGIN RSA PRIVATE KEY-----\n${noWrapperPrivateKey}\n-----END RSA PRIVATE KEY-----`);
    });

    it('formatKey with pkcs8', function() {
      const pkcs8PrivateKey = fs.readFileSync(__dirname + '/fixtures/app-private-key-pkcs8.pem', 'ascii');
      const sdk = new BancoChainSdk({
        appId: APP_ID,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        privateKey: pkcs8PrivateKey,
        gateway: GATE_WAY,
        keyType: 'PKCS8',
      });

      sdk.config.privateKey.should.eql(`-----BEGIN PRIVATE KEY-----\n${pkcs8PrivateKey}\n-----END PRIVATE KEY-----`);
    });
  });

  describe('token', function() {
    this.timeout(30000);

    let sdk;
    const sdkBaseConfig = {
      appId: APP_ID,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      privateKey: PRIVATE_KEY,
      gateway: GATE_WAY,
      timeout: 30000,
    };

    beforeEach(function() {
      sdk = new BancoChainSdk(sdkBaseConfig)
    });
    it('request error.', (done) => {
      sandbox.stub(urllib, 'request').callsFake(() => {
        return new Promise(function() {
          throw Error('custom error.');
        });
      });

      sdk.token().catch((err) => {
        (err.toString().indexOf('[BancoChainSdk]apply token error') > -1).should.eql(true);
        done();
      });
    });
    
  })
})