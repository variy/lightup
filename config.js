var path = require('path');
console.log('>>> ' + process.argv)
console.log('>>> ' + process.env.NODE_ENV)

module.exports = {
    debug: process.env.NODE_ENV !== 'production',
    port: 3000,
    srcPath:  path.join(__dirname, './src'),
    destPath: path.join(__dirname, './docs/')
};