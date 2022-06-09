'use strict';
require('should');

const fs = require('fs');
const { sign } = require('../lib/util');

const CLIENT_ID = 'OD8olwq7lTkh1xbf';
const PRIVATE_KEY = fs.readFileSync(__dirname + '/fixtures/app-private-key.pem', 'ascii');


describe('util', function() {
  it('sign', function() {
    const data = sign({
      no: 'TEST0006',
    }, {
      clientId: CLIENT_ID,
      privateKey: PRIVATE_KEY,
      charset: 'utf-8',
    });
    data.no.should.eql('TEST0006');
    data.clientId.should.eql(CLIENT_ID);
    (data.sign !== '').should.eql(true);
  })
})