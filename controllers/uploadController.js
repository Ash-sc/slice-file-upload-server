const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const multiparty = require('connect-multiparty')
const multipartyMiddleware = multiparty()
const db = require('./db')
const config = require('../config')

router.post('/upload', multipartyMiddleware, function (req, res) {
  const {
    key,
    currentChunk,
    totalChunk,
    filename,
    chunkSize
  } = req.body
  const tmpBuffer = fs.readFileSync(req.files.file.path) // get file buffer
  const distFileName = key + '.' + filename.split('.').pop() // init file name
  const downloadUrl = config.serverName + ':' + config.port + '/static/' + distFileName

  if (currentChunk === '0' && totalChunk === '1') {
    fs.open(path.join(__dirname, '../static/' + distFileName), 'a', (err, fd) => {
      if (err) console.error(err)
      fs.writeSync(fd, tmpBuffer, 0, tmpBuffer.length, currentChunk * chunkSize)
      fs.closeSync(fd)
      res.status(200).json({
        errno: 0,
        data: {
          path: downloadUrl
        }
      })
    })
  } else {
    let nextIndex = 0

    const savedFileInfo = db.getFileInfo(key)

    if (savedFileInfo) nextIndex = savedFileInfo.savedIndex + 1

    try {
      fs.open(path.join(__dirname, '../static/' + distFileName), 'a', (err, fd) => {
        if (err) console.error(err)
        fs.writeSync(fd, tmpBuffer, 0, tmpBuffer.length, currentChunk * chunkSize)
        fs.closeSync(fd)

        if (parseInt(currentChunk, 10) + 1 === parseInt(totalChunk, 10)) {
          db.deleteFileInfo(key)
          res.status(200).json({
            errno: 0,
            data: {
              path: downloadUrl
            }
          })
        } else {
          db.saveFileInfo(key, parseInt(currentChunk, 10))
          res.status(200).json({
            errno: 0,
            data: nextIndex ? {
              nextIndex: nextIndex
            } : {}
          })
        }
      })
    } catch (err) {
      res.status(200).json({
        errno: 1,
        errorInfo: err
      })
    }
  }
})

module.exports = router
