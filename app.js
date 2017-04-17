var express = require('express');
var path = require('path');

var app = express();

var CONFIG = require('./config.js');
var PORT = CONFIG.port;
var destPath = CONFIG.destPath;

// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true }));

/*这种路径结构导致这种中间件无法*/
if( CONFIG.debug === '1'){
    var webpack = require('webpack');
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var configPath = path.join(__dirname, './webpack.config.js')
    // console.log(configPath)

    var config = require(configPath);
    // console.log(configPath)

    var compiler = webpack(config);
    /*为什么这里的路径要配成 ./public 呢*/
    app.use(express.static(path.resolve(__dirname, CONFIG.srcPath)));
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        // hot: true,
        noInfo: false,
        inline: true,
        stats: {
            cached: false,
            colors: true
        }
    }));
    
    app.use(webpackHotMiddleware(compiler, {
        log: console.log
    }));

}else{
    // 调试生产地址，请求本地编译后的代码
    app.use(express.static( path.resolve(__dirname, CONFIG.destPath)));
}
    
app.listen(PORT, function () {
  console.log('Server listening at port', PORT);
});

module.exports = app;

