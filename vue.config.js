
module.exports = {
    outputDir: 'end',   //build输出目录
    assetsDir: 'assets', //静态资源目录（js, css, img）
    lintOnSave: false, //是否开启eslint
    devServer: {
        open: true, //是否自动弹出浏览器页面
        host: "0.0.0.0",
        port: '8089',
        https: false,   //是否使用https协议
        hotOnly: false, //是否开启热更新
        proxy: {
            '/api': {
                // target: 'http://172.168.4.129:8002', //
                target:"http://47.117.129.125:9000",
                ws: true,  //代理websockets
                changeOrigin: true, // 虚拟的站点需要更管origin
                pathRewrite: {   //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
                    '^/api': ''
                }
            }
        }
    },
    // pages: {
    //     index: {
    //         entry: 'src/main.js',
    //         title: '安监重构'
    //     }
    // }
   
}