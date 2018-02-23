const https = require('https')

const makeAgent = (agentOptions, connectOptions) => {
  connectOptions = connectOptions || agentOptions
  const agent = new https.Agent(agentOptions)
  if (typeof connectOptions === 'object') {
    const createConnection = agent.createConnection
    agent.createConnection = function (options) {
      if (typeof options === 'object') {
        Object.assign(options, connectOptions)
      }
      return createConnection.apply(this, arguments)
    }
  }
  return agent
}

module.exports = makeAgent
