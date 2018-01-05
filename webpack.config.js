var path = require('path');
var webpack = require('webpack');

var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var fs = require('fs');

var CONFIG = require('./config.js');
var pjPath = CONFIG.pj;
var srcPath = CONFIG.srcPath;
var destPath = CONFIG.destPath;
var DEBUG = CONFIG.debug;
var PORT = CONFIG.port;

var curJsDestPath = path.join(destPath, 'js');

var pageDefaultSetting = {
    filename: '',
    entry: 'app.js',
    chunks: ['vendors'],
    template: path.resolve(CONFIG.srcPath, './template.ejs'),
    inject: 'body',
    DEBUG: DEBUG
}

var pageList = fs.readdirSync(path.resolve(CONFIG.srcPath, './pages'));
pageList = pageList.filter(function(item){
    return item.charAt(0) !== '.';
})
console.log(JSON.stringify(pageList));

var getEntry = function(){
    var obj = {};
    pageList.forEach(function(item){
        if(item != '.DS_Store'){
            obj[item] =  path.join(srcPath, 'pages', item, pageDefaultSetting.entry);
        }
    });

    obj.vendors = ['Zepto','Vue','underscore', 'Global'];
    return obj;
}

var getHtmlPlugins = function(){
    var list = [];

    for (var i = 0; i < pageList.length; i++) {
        var item = pageList[i]
        //@chunks 这个参数告诉插件要引用entry里面的哪几个入口
        //@inject 要把script插入到标签里
        var opt = {
            template: pageDefaultSetting.template,
            params: {
                requestDomain: CONFIG.reqd,
                DEBUG: DEBUG
            },
            filename: item + '.html',
            chunks: ['vendors', item],
            inject: 'body'
        };

        if( !DEBUG ){
            opt.minify = {
                removeComments: true,
                collapseWhitespace: true
            }
        }

        list.push( new HtmlwebpackPlugin(opt) );
        
    };
    return list;          
}

var otherPlugins = [];
if( !DEBUG ){
    otherPlugins = [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: DEBUG,
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        })
    ];
}else{
    otherPlugins= [
        new webpack.HotModuleReplacementPlugin()
    ];  
}

var webpackConfig = {
    entry: getEntry(),
    output: {
        path: destPath,
        // publicPath: './',
        publicPath: DEBUG ? ('http://localhost:' + PORT + '/') : './',
        filename: DEBUG ?"[name].js" : './pagejs/[name].[chunkhash:8].min.js',
        chunkFilename: DEBUG ? "[chunkhash:8].chunk.js" : "[chunkhash:8].chunk.min.js",
        sourceMapFilename: "./map/[file].map"
    },
    devtool: DEBUG? "source-map": false,
    module: {
        rules: [
        {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                // 
                // [, pageDefaultSetting.template],
                // options: {
                //     presets: ['es2015']
                // }
            }, 
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    // {{# sass}}
                    // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                    // the "scss" and "sass" values for the lang attribute to the right configs here.
                    // other preprocessors should work out of the box, no loader config like this necessary.
                    'scss': 'vue-style-loader!css-loader!sass-loader',
                    'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax' 
                    // {{/sass}}
                }
                        // other vue-loader options go here
            }
        },
            {
                // url-loader更好用，小于10KB的图片会自动转成dataUrl，
                // 否则则调用file-loader，参数直接传入
                // 'url?limit=10000&name=img/[hash:8].[name].[ext]',
                // 'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
                // /\.(png|jpe?g|gif|svg)(\?.*)?$/ 
                test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|eot|ttf|gif|ico)$/,
                use: [
                    'url-loader?limit=10240&name=images/[name].[hash:8].[ext]'
                    // ,'file?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
                ]
            },
            // {
            //     test: /\.ejs?$/,
            //     loader: 'ejs-loader',
            //     exclude:  pageDefaultSetting.template
            // }, 
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader",
                    // publicPath:  DEBUG ? ('http://localhost:' + PORT + '/') : './'`
                })

                // ["style-loader", "css-loader"]

                
            }
        ]
    },
    // vue: {
    //     loaders: {
    //         js: 'babel'
    //     }
    // },
    resolve: {
        extensions: ['.js', '.ejs', 'jsx'],
        // modules: [CONFIG.rootPath],
        alias: {
            underscore$: path.join( srcPath, '/js/libs/underscore.js'),
            Zepto$: path.join( srcPath, '/js/libs/zepto.min.js'),
            Global$: path.join( srcPath, '/js/init.js'),
            Vue$: path.join( srcPath, '/js/libs/vue.js')

        }
    },
    plugins: [
        new CommonsChunkPlugin({
            name: 'vendors',
            filename: DEBUG ? 'vendors.js' : '[name].[hash:8].min.js'
        }),

        // new ExtractTextPlugin({
        //     filename: "css/[name].[contenthash:8].css",
        //     disable: false,
        //     allChunks: true
        // }),

        new ExtractTextPlugin("styles.css"),

        new webpack.ProvidePlugin({
            $: 'Zepto',
            _: 'underscore',
            Global: 'Global',
            Vue: 'Vue'
        })
    ].concat(getHtmlPlugins())
    .concat(otherPlugins)
};

if(DEBUG){
    for(var attr in webpackConfig.entry){
        if( ! Array.isArray(webpackConfig.entry[attr])){
            webpackConfig.entry[attr] = Array.of(webpackConfig.entry[attr]);
        }
        webpackConfig.entry[attr].push('webpack-hot-middleware/client?reload=true')
    }

    webpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin())
}

module.exports = webpackConfig;