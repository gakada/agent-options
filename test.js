import {exec} from 'child_process'
import test from 'ava'
import got from 'got'
import makeAgent from '.'

const testSNI = (wait, host, agentOptions, connectOptions) => new Promise((resolve, reject) => {
  setTimeout(() => {
    got(host, {agent: makeAgent(agentOptions, connectOptions)})
  }, wait)
  exec(`tshark -Y ssl.handshake.type==1 -T fields -e ssl.handshake.extensions_server_name -a duration:${Math.ceil(wait * 2 / 1000)}`, (err, stdout) => {
    if (err) {
      reject(err)
    } else {
      stdout = stdout.toString().split('\n').filter(e => e.length > 0)
      console.log(`SNI for ${host} request: [${stdout.join(', ')}]`)
      resolve(stdout.includes(host))
    }
  })
})

// May need to be slower
const sniWait = 1000
const sniHost = 'github.com'

test.serial('SNI on normal request', async t => {
  t.true(await testSNI(sniWait, sniHost))
})

test.serial('No SNI on request with servername: null', async t => {
  t.false(await testSNI(sniWait, sniHost, {servername: null}))
})

test.serial('No SNI on request with servername: undefined using connectOptions', async t => {
  t.false(await testSNI(sniWait, sniHost, null, {servername: undefined}))
})
