const knex = require('../node_modules/knex')
const config = require('../config/config.json')
const database = knex(config.dbConnection)

const getPrefix = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await database.select('prefix', 'country', 'countryCode', 'description').from('prefix')
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

const getPeer = async () => {
  let result = await database.select('asn', 'asName', 'countryCode').from('peer')
  return result
}

const insertPerfix = (prefix, country, countryCode, description) => {
  return new Promise(async (resolve, reject) => {
    try {
      await database(config.dbTable.prefixTable).insert({
        prefix: prefix,
        country: country,
        countryCode: countryCode,
        description: description
      })
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

const insertPeer = (asn, asName, country, countryCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      await database(config.dbTable.peerTable).insert({
        asn: asn,
        asName: asName,
        country: country,
        countryCode: countryCode
      })
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

const deletePrefix = (prefix) => {
  return new Promise(async (resolve, reject) => {
    try {
      await database(config.dbTable.prefixTable).where('prefix', prefix).del()
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

const deletePeer = (asn) => {
  return new Promise(async (resolve, reject) => {
    try {
      await database(config.dbTable.peerTable).where('asn', asn).del()
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

exports.getPrefix = getPrefix
exports.getPeer = getPeer
exports.insertPerfix = insertPerfix
exports.insertPeer = insertPeer
exports.deletePrefix = deletePrefix
exports.deletePeer = deletePeer