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

const querystring = require('querystring')
const handlerUserRouter = require('./src/router/user')
const handlerBlogRouter = require('./src/router/blog')
const {get, set} = require('./src/db/redis')

//sesion数据
const SESSION_DATA = {}

const serverHandler = (req, res) => {
    //设置path
    const url = req.url
    req.path = url.split('?')[0]

    //解析query
    req.query = querystring.parse(url.split('?')[1])

    //解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })
    console.log('req.cookie is ', req.cookie)

    //解析session
    let userId = req.cookie.userid
    let needSetCookie = false
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        //初始化redis中的session值
        set(userId, {})
    }

    //获取session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            //初始化redis中的session值
            set(req.sessionId, {})
            req.session = {}
        } else {
            req.session = sessionData
        }
        console.log('req session ', req.session)
        //处理postdata
        return getPostData(req)
    }).then(postData => {
        req.body = postData
        // //设置返回格式 JSON
        res.setHeader('Content-type', 'application/json')

        //处理blog路由
        const blogResult = handlerBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId};path=/; httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }

        //处理user路由
        const userData = handlerUserRouter(req, res)
        if (userData) {
            userData.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId};path=/; httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }

        //未命中，返回404
        res.writeHead(404, {"Content-type": "text/plain"})
        res.write("404 NOT FOUND")
        res.end()

    })
}

//用于处理post data
const getPostData = (req) => {
    const promise = new Promise(((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }

        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return;
        }

        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })

        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    }))

    return promise
}

//获取cookie过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d.toGMTString is', d.toUTCString())
    return d.toUTCString()
}
module.exports = serverHandler
