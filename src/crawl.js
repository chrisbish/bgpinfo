const got = require('../node_modules/got-cjs').got
const cheerio = require('../node_modules/cheerio')
const net = require('net')
const clm = require('../node_modules/country-locale-map')

const getPeer = (asn) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await got.get(`https://bgp.tools/as/${asn}#connectivity`, {
        headers: {
          "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
        }
      })
      const $ = cheerio.load(result.body)
      let peersArrary = []
      $('table#upstreamTable > tbody').each((index, element) => {
        if ($(element).children().length > 10) {
          $(element).children().each((index, element) => {
            if (index !== 0) {
              peersArrary.push(
                $(element).text().split('\n')[2].replaceAll(' ', ''),
              )
            }
          })
        }
      })
      resolve(peersArrary)
    } catch (error) {
      reject(error)
    }
  })
}

const getPrefix = (asn) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await got.get(`https://bgp.tools/as/${asn}#prefixes`, {
        headers: {
          "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
        }
      })
      const $ = cheerio.load(result.body)
      let prefixArray = []
      let prefixInfoArray = []
      const blank = '                                    '
      $('table#fhTable > tbody').each((index, element) => {
        $(element).children().each((index, element) => {
          if (index !== 0) {
            let data = $(element).text().split('\n')
            prefixArray.push(data[data.length - 3].replace(blank,''))
            prefixInfoArray.push({
              description: data[data.length - 2].replace(blank, '')
            })
          }
        })
      })
      resolve([prefixArray, prefixInfoArray])
    } catch (error) {
      reject(error)
    }
  })
}

const getPeersInfo = (peers) => {
  return new Promise(async (resolve, reject) => {
    const connectionConfig = {
      port: 43,
      host: "bgp.tools"
    }
    const client = net.connect(connectionConfig)
    const payload = 'begin' + '\n' + peers.join('\n') + '\n' + 'end'
    let received = ""
    let result = []
    client.on('data', (data) => {
      received += data
    })
    client.on("close", () => {
      let peersDataArray = received.split('\n')
      peersDataArray.pop()
      for (let peer of peersDataArray) {
        peer = peer.split(' | ')
        let country = clm.getCountryNameByAlpha2(peer[3])
        if (typeof country === 'undefined') country = peer[3]
        result.push({
          asn: 'AS' + peer[0].replaceAll(' ', ''),
          asName: peer[6].replace('\r', ''),
          countryCode: peer[3],
          country: country
        })
      }
      resolve(result)
    })
    client.write(payload)
  })
}

const getPrefixsInfo = (perfixs) => {
  return new Promise(async (resolve, reject) => {
    const connectionConfig = {
      port: 43,
      host: "bgp.tools"
    }
    const client = net.connect(connectionConfig)
    const payload = 'begin' + '\n' + perfixs.join('\n') + '\n' + 'end'
    let received = ""
    let result = []
    client.on('data', (data) => {
      received += data
    })
    client.on("close", () => {
      let prefixsDataArray = received.split('\n')
      prefixsDataArray.pop()
      for (let prefix of prefixsDataArray) {
        prefix = prefix.split(' | ')
        let country = clm.getCountryNameByAlpha2(prefix[3])
        if (typeof country === 'undefined') country = prefix[3]
        result.push({
          prefix: prefix[2].replace(' ',''),
          countryCode: prefix[3],
          country: country
        })
      }
      resolve(result)
    })
    client.write(payload)
  })
}

exports.getPeer = getPeer
exports.getPrefix = getPrefix
exports.getPeersInfo = getPeersInfo
exports.getPrefixsInfo = getPrefixsInfo