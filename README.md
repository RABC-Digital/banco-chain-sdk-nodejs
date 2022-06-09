<p align="center">
  <a href="https://www.banco.sg">
    <img alt="Banco Chain" src="https://static.bancochain.com/banco_chain_horizontal.png" width="500" />
  </a>
</p>

<p align="center">
  Banco Chain SDK for Node.js
</p>

<p align="center">
  <a href="https://npmjs.org/package/banco-chain-sdk"><img alt="NPM version" src="https://img.shields.io/npm/v/banco-chain-sdk.svg?style=flat" /></a>
  <a href="https://github.com/RABC-Group/banco-chain-sdk-nodejs/actions/workflows/node.yml"><img alt="Node.js CI" src="https://github.com/RABC-Group/banco-chain-sdk-nodejs/actions/workflows/node.yml/badge.svg" /></a>
  <a href="https://codecov.io/gh/RABC-Group/banco-chain-sdk-nodejs">
    <img src="https://codecov.io/gh/RABC-Group/banco-chain-sdk-nodejs/branch/main/graph/badge.svg?token=YK8LBR476D"/>
  </a>
  <a href="https://snyk.io/test/github/RABC-Group/banco-chain-sdk-nodejs"><img src="https://snyk.io/test/github/RABC-Group/banco-chain-sdk-nodejs/badge.svg"></a>
</p>

## Versions

`banco-chain-sdk-nodejs` uses a modified version of [Semantic Versioning](https://semver.org) for all changes.

### Supported Node.js Versions

This library supports the following Node.js implementations:

*   Node.js 12
*   Node.js 14
*   Node.js 16

TypeScript is supported for TypeScript version 2.9 and above.

## Installation

The preferred way to install the Banco Chain SDK for Node.js is to use the npm package manager for Node.js. Simply type the following into a terminal window:

> npm install banco-chain-sdk --save

# Usage

To use the TypeScript definition files within a Node.js project, simply import `banco-chain-sdk` as you normally would.

In a TypeScript file:

```javascript
import BancoChainSdk from 'banco-chain-sdk';
```

**NOTE:** You need to add `"esModuleInterop": true` to compilerOptions of your `tsconfig.json`. If not possible, use like `import * as BancoChainSdk from 'banco-chain-sdk'`.

In a JavaScript file:

```javascript
const BancoChainSdk = require('banco-chain-sdk');
```

## Summary

- [Create A Banco Chain Client Instance](#create-a-banco-chain-client-instance)
- [Authentication](#authentication)
  - [.token([options])](#tokenoptions)
- [Using the Client to Make API Calls](#using-the-client-to-make-api-calls)
  - [.exec(accessToken, method, params [, options])](#execaccesstoken-method-params--options)
- [Signature](#signature)
  - [.signOpenRequest(params)](#signopenrequestparams)
- [Endpoints](#endpoints)
- [Known Errors](#known-errors)

## Create A Banco Chain Client Instance

Banco Chain client instance required `appId`, `clientId`, `clientSecret` and `privateKey`.

### BancoChainSdk(options)

Create a Banco Chain client instance.

options:

- appId {String} application id you create on banco chain console website
- clientId {String} client id you get from banco chain console website
- clientSecret {String} client secret you get from banco chain console website
- privateKey {String} The private key of key pair you upload on banco chain console website
- [keyType] {String} Default `PKCS1`. The private key type, it must be one of `PKCS1` or `PKCS8`. PKCS8: PRIVATE KEY, PKCS1: RSA PRIVATE KEY
- [gateway] {String} Banco Chain Openapi endpoint. Default `https://openapi.bancochain.com/api`. Please see [endpoints](#endpoints).
- [timeout] {Number} The timeout interval, in milliseconds, to use for the request, default is 5s.
- [version] {String} The version of openapi. Please see [endpoints](#endpoints).
- [charset] {String} Fixed to `utf-8`.

example:

1. basic usage

In a TypeScript file:

```javascript
import BancoChainSdk from 'banco-chain-sdk';

const sdk = new BancoChainSdk({
  appId: '53900923',
  clientId: 'OD8olwq7lTkh1xbf',
  clientSecret: 'uT5GcQRI1vo4edxQ',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----',
});
```

In a JavaScript file:

```javascript
const BancoChainSdk = require('banco-chain-sdk');

const sdk = new BancoChainSdk({
  appId: '53900923',
  clientId: 'OD8olwq7lTkh1xbf',
  clientSecret: 'uT5GcQRI1vo4edxQ',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----',
});
```

2. use staging endpoint

In a TypeScript file:

```javascript
import BancoChainSdk from 'banco-chain-sdk';

const sdk = new BancoChainSdk({
  appId: '53900923',
  clientId: 'OD8olwq7lTkh1xbf',
  clientSecret: 'uT5GcQRI1vo4edxQ',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----',
  gateway: 'https://openapi-staging.bancochain.com/api',
});
```

In a JavaScript file:

```javascript
const BancoChainSdk = require('banco-chain-sdk');

const sdk = new BancoChainSdk({
  appId: '53900923',
  clientId: 'OD8olwq7lTkh1xbf',
  clientSecret: 'uT5GcQRI1vo4edxQ',
  privateKey: '-----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----',
  gateway: 'https://openapi-staging.bancochain.com/api',
});
```

## Authentication

Authentication with the Banco Chain API uses an Access Token to identify a client. 

Server-side authentication using JSON Web Tokens (JWT) is the most common way to authenticate to the Banco Chain API. JWT is an open standard designed to allow powerful server-to-server authentication.

### .token([options])

Request an Access Token using server-side JWT assertion.

parameters:

- [options] {Object} options parameters, default is `null`
  - log {Object} The object of logger
    - info {Function} The recording info log function of logger
    - error {Function} The recording error log function of logger

Returns a new Access Token that can be used to make authenticated API calls by passing along the token in a authorization header as follows `Authorization: Bearer <Token>`.

- success {Boolen} Whether this API is called successfully.
- errorCode {Number} The error code
- errorMessage {String} The error message
- data
  - access_token {String} The token used to access Banco Chain API. Max length: 4096 characters.
  - expires_in {Number} The remaining lifetime of the access token. The value begins at 3600. This is in seconds (one hour).

example:

```javascript
const data = await sdk.token({
  log: ctx.logger,
});
```

response:

```json
{
  "success": false,
  "data": {
    "access_token": "5bf0c488d3732be6f54d71389ec8e4297675bc11d4a37da86a83d2cb6b99f7d6",
    "expires_in": 86400
  },
  "errorCode": 0,
  "errorMessage": "Success"
}
```

## Using the Client to Make API Calls

The different API endpoints you can call are represented as methods, grouped into managers by the type of object they interact with.

### .exec(accessToken, method, params [, options])

parameters:

- accessToken {String} The token used to access Banco Chain API
- method {String} Must be one of `GET`, `POST`, `PUT`, `DELETE`.
- params {Object | Array} The data you need request
- [options] {Object} options parameters, default is `null`
  - log {Object} The object of logger
    - info {Function} The recording info log function of logger
    - error {Function} The recording error log function of logger

Success will return:

- success {Boolen} Whether this API is called successfully.
- errorCode {Number} The error code
- errorMessage {String} The error message
- data {Any} The response data

example:

```javascript
const result = await sdk.exec(accessToken, 'GET', 'program/vendor', {
  no: 'TEST0006',
});
```

response:

```json
{
	"success": true,
	"data": {
		"fabric": [{
			"record": {
				"docType": "",
				"NO": "TEST0006",
				"supplierName": "",
				"supplierUEN": "",
				"approvedBuyerName": "",
				"approvedBuyerUEN": "",
				"agreementDate": "0001-01-01T00:00:00Z",
				"invoiceDate": "0001-01-01T00:00:00Z",
				"invoiceDueDate": "0001-01-01T00:00:00Z",
				"invoiceNumber": "",
				"invoiceValue": "",
				"invoiceCurrency": "",
				"invoicePurchaseDate": "0001-01-01T00:00:00Z",
				"financed": false,
				"registryUpdatedDatetime": "0001-01-01T00:00:00Z"
			},
			"txId": "41a942318557a9993dd2b3abfef435c18da7778a1a225ac8ea85f1d000f31fd6",
			"timestamp": "2022-06-06T11:13:28.158Z",
			"isDelete": true
		}]
	},
	"errorCode": 0,
	"errorMessage": "Success"
}
```

## Signature

### .signOpenRequest(params)

parameters:
  - params {Object | Array} The data you need signature

Success will return:
  - clientId {String} client id you get from banco chain console website
  - timestamp {String} The current timestamp of signature
  - sign {String} Calculated signature

example:

```javascript
const result = sdk.signOpenRequest({
  no: 'TEST0006',
});
```

response:
  
```json
{
	"clientId": "OD8olwq7lTkh1xbf",
	"timestamp": "1654764284065",
	"no": "TEST0006",
	"sign": "WTmD4obINgykYXKEUUAzAA+rbyQgIMMj9r/iEdCwkRZGOgJOF4JRW05oqr2+UpSyHHi3t6I2PIImfUlbZdHPQZ3oIWkK0yCnOTy52bhKxOz2aTXX+LSC3nB6qS8UlHWSS0Vt0wiiQQTBg+4GrMI/EqruKCHRw3dBnim0pxeGRs5qcuitqqW48s629ylZwWbrTT9ihG1/ZIpRyfNAlEwsZwVBO/YRZgaxTrgjZIGPD9hwkEo/gsNiOlTq0uFeFaGeo25UaEkcBw8JZrL6y1NJncW58ajYCSp2Op3zV6U0kKyJG0loccTJTn6B5VMgAUOPo+mVE7cGbd7nfElnlbK7aA=="
}
```

## Endpoints

environment | endpoint | latest api version
---  | ---  | ---
Production | https://openapi.bancochain.com/api | v1
Staging | https://openapi-staging.bancochain.com/api | v1
QA | https://openapi-qa.bancochain.com/api | v1

## Known Errors

TBD