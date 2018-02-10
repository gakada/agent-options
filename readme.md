As stated in the documentation for [`https.request`](https://nodejs.org/api/https.html#https_https_request_options_callback):

> The following additional `options` from [`tls.connect()`](https://nodejs.org/api/tls.html#tls_tls_connect_options_callback) are also accepted when using a custom [`Agent`](https://nodejs.org/api/https.html#https_class_https_agent): `ca`, `cert`, `ciphers`, `clientCertEngine`, `key`, `passphrase`, `pfx`, `rejectUnauthorized`, `secureProtocol`, `servername`.

This module allows to modify other options, as well as to disable them. For example, [SNI](https://en.wikipedia.org/wiki/Server_Name_Indication) can be disabled by setting `servername` to `null` (or `undefined`).

# Install

```console
$ npm i agent-options
```

# Usage

`makeAgent(options)` returns [`https.Agent`](https://nodejs.org/api/https.html#https_class_https_agent) created with given `options` and ensures that those `options` are used for [`tls.connect`](https://nodejs.org/api/tls.html#tls_tls_connect_options_callback) as well.

## Examples

Performing [`https.request`](https://nodejs.org/api/https.html#https_https_request_options_callback) without [SNI](https://en.wikipedia.org/wiki/Server_Name_Indication):

```js
const https = require('https')
const makeAgent = require('agent-options')

const options = {
  host: 'example.com',
  port: 443,
  path: '/...',
  agent: makeAgent({ servername: null })
}

const req = https.request(options, res => {
  res.on('data', data => {
    // ...
  })
  res.on('end', () => {
    // ...
  })
})

req.on('error', err => {
  // ...
})

req.end()
```

Using [got](https://github.com/sindresorhus/got):

```js
const got = require('got')
const makeAgent = require('agent-options')

got('https://example.com/...', { agent: makeAgent({ servername: null }) }).then(res => {
  // ...
}).catch(err => {
  // ...
})
```

# Issues

* Separate `https.Agent` and `tls.connect` options?
* Support agents other than `https.Agent`?
