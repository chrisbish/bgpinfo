const cron = require('./node_modules/node-cron')
const query = require('./src/query') 
const config = require('./config/config.json')
const crawl = require('./src/crawl')

cron.schedule(config.cronConfig, async () => {
  await insertPeer()
  await deletePeer()
  await insertPrefix()
  await deletePrefix()
})

const insertPeer = () => {
  return new Promise(async (resolve, reject) => {
    const rows = await query.getPeer()
    let peersAsnInDB = []
    for (let row of rows) {
      peersAsnInDB.push(row.asn)
    }
    let peerInfosInBgpTools = await crawl.getPeer(config.myAsn)
    peerInfosInBgpTools = await crawl.getPeersInfo(peerInfosInBgpTools)
    for (let peer of peerInfosInBgpTools) {
      if (!peersAsnInDB.includes(peer.asn)) {
        console.log(`DEBUG | ${(new Date).toString()} | ${peer.asn} is not exist in DB`)
        await query.insertPeer(peer.asn,peer.asName,peer.country,peer.countryCode)
      }
    }
    resolve()
  })
}

const deletePeer = () => {
  return new Promise(async (resolve, reject) => {
    const rows = await query.getPeer()
    let peersAsnInDB = []
    for (let row of rows) {
      peersAsnInDB.push(row.asn)
    }
    let peersAsnInBgpTools = await crawl.getPeer(config.myAsn)
    for (let peer of peersAsnInDB) {
      if (!peersAsnInBgpTools.includes(peer)) {
        console.log(`DEBUG | ${(new Date).toString()} | ${peer} is not exist in BGP.tools`)
        await query.deletePeer(peer)
      }
    }
    resolve()
  })
}

const insertPrefix = () => {
  return new Promise(async (resolve, reject) => {
    const rows = await query.getPrefix()
    let prefixInDB = []
    for (let row of rows) {
      prefixInDB.push(row.prefix)
    }
    const perfixInfoInBgpToolsA = await crawl.getPrefix(config.myAsn)
    const perfixInfoInBgpToolsB = await crawl.getPrefixsInfo(perfixInfoInBgpToolsA[0])
    for (let [index, prefix] of perfixInfoInBgpToolsB.entries()) {
      if (!prefixInDB.includes(prefix.prefix)) {
        console.log(`DEBUG | ${(new Date).toString()} | ${prefix.prefix} is not exist in DB`)
        await query.insertPerfix(prefix.prefix, prefix.country, prefix.countryCode, perfixInfoInBgpToolsA[1][index].description)
      }
    }
    resolve()
  })
}

const deletePrefix = () => {
  return new Promise(async (resolve, reject) => {
    const rows = await query.getPrefix()
    let prefixInDB = []
    for (let row of rows) {
      prefixInDB.push(row.prefix)
    }
    let prefixInBgpTools = await crawl.getPrefix(config.myAsn)
    for (let prefix of prefixInDB) {
      if (!prefixInBgpTools[0].includes(prefix)) {
        console.log(`DEBUG | ${(new Date).toString()} | ${prefix} is not exist in BGP.tools`)
        await query.deletePrefix(prefix)
      }
    }
    resolve()
  })
}