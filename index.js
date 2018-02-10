const https = require('https')

const makeAgent = options => {
  const agent = new https.Agent(options)
  const createConnection = agent.createConnection
  agent.createConnection = function (options2) {
    if (typeof options2 === 'object') {
      for (const key in options) {
        options2[key] = options[key]
      }
    }
    return createConnection.apply(this, arguments)
  }
  return agent
}

module.exports = makeAgent
