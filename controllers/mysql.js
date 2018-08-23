const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '54haotiangeA!',
  database: 'file_db'
})

module.exports = {
  getAllFiles(fileId) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM files_list WHERE file_id = '${fileId}'`, function (error, results, fields) {
        if (error) {
          reject(error)
        } else {
          console.log('The results is: ', results)
          resolve(results)
        }
      })
    })
  },

  saveFileInfo(info) {
    return new Promise((resolve, reject) => {
      connection.query(`
      INSERT INTO files_list (file_id, file_name, chunk_index, chunk_total, create_time)
      VALUES
      ('${info.file_id}', '${info.file_name}', ${info.chunk_index}, ${info.chunk_total}, '${new Date().getTime()}')
      `, function (error, results, fields) {
        if (error) {
          reject(error)
        } else {
          console.log('Save file info success !')
          resolve()
        }
      })
    })
  },

  deleteFileInfo(fileId) {
    return new Promise((resolve, reject) => {
      connection.query(`DELETE FROM files_list WHERE file_id = '${fileId}'`, function (error, results, fields) {
        if (error) {
          reject(error)
        } else {
          console.log('The results is: ', results)
          resolve(results)
        }
      })
    })
  }
}
