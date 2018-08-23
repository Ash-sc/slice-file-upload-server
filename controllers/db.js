const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({
    fileInfo: [{
      fileId: 'fileId', // 每个文件唯一的id
      savedIndex: 0 // 当前已存储的分片
    }]
  })
  .write()

module.exports = {
  getFileInfo(fileId) {
    return db.get('fileInfo').find({
      fileId
    }).value()
  },

  saveFileInfo(fileId, savedIndex) {
    return this.getFileInfo(fileId) ? db.get('fileInfo').find({
      fileId
    }).assign(savedIndex ? {
      savedIndex
    } : {}).write() : db.get('fileInfo').push({
      fileId,
      savedIndex
    }).write()
  },

  deleteFileInfo(fileId) {
    db.get('fileInfo')
      .remove({
        fileId
      })
      .write()
  }
}
