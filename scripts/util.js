const path = require('path')

const getAppPath = path.join(__dirname, '..')

const resolveDirPath = (dir = '') => path.join(getAppPath, dir)

module.exports = resolveDirPath
