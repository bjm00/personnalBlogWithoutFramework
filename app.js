/*
const http = require('http')
const querystring = require('querystring')
*/

/*
使用nodejs发送get请求
 */
/*const server = http.createServer((req ,res) =>{
    console.log(req.method)
    const url = req.url
    console.log('url:',url)
    req.query = querystring.parse(url.split('?')[1])
    console.log('query:',req.query)
    res.end(
        JSON.stringify(req.query)
    )
})*/


/*
使用nodejs发送post请求
 */
/*const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        //数据格式
        console.log('content-type:', req.headers['content-type'])
        //接收数据
        let postData = ""
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            console.log("postData", postData)
            res.end('hello world')//在这里返回，因为是异步
        })
    }
})*/

/*
处理http请求的综合示例
 */
/*const server = http.createServer((req, res) => {
    const method = req.method
    const url = req.url
    const path = url.split("?")[0]
    const query = querystring.parse(url.split("?")[1])

    //设置返回格式 JSON
    res.setHeader("Content-type", "application/json")
    //返回的数据
    const resData = {
        method,
        url,
        path,
        query
    }

    //返回
    if (method === 'GET') {
        res.end(
            JSON.stringify(resData)
        )
    }
    if (method === 'POST') {
        let postData = ''
        req.on('data',chunk => {
            postData +=chunk.toString()
        })
        req.on('end',()=>{
            resData.postData = postData
            //返回
            res.end(
                JSON.stringify(resData)
            )
        })
    }


})


server.listen(8000)
console.log('ok')*/

const handlerBlogRouter = require('./src/router/user')
const handlerUserRouter = require('./src/router/blog')

const serverHandler = (req,res) =>{
    //设置path
    const url = req.url
    req.path = url.split('?')[0]

    //设置返回格式 JSON
    res.setHeader('Content-type','application/json')

    //处理blog路由
    const blogData = handlerBlogRouter(req,res)

    if (blogData) {
        res.end(
            JSON.stringify(blogData)
        )
        return
    }

    //处理user路由
    const userData = handlerUserRouter(req,res)

    if (userData) {
        res.end(
            JSON.stringify(userData)
        )
        return
    }

    //未命中，返回404
    res.writeHead(404,{"Content-type":"text/plain"})
    res.write("404 NOT FOUND")
    res.end()

}
module.exports = serverHandler
