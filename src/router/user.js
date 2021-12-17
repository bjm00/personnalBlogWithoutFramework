const {login} = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/respModel')
const {get, set} = require('../db/redis')

//获取cookie过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log('d.toGMTString is', d.toUTCString())
    return d.toUTCString()
}

const handlerUserRouter = (req, res) => {
    const method = req.method //GET POST
    //登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const {username, password} = req.body
        const result = login(username, password)
        return result.then(resultData => {
            //console.log(resultData.username)
            if (resultData) {
                //设置session
                console.log('req.session is', req.session)
                req.session.username = resultData.username
                req.session.realname = resultData.realname
                //同步到redis
                set(req.sessionId, req.session)

                console.log('req.session is', req.session)
                return new SuccessModel()
            } else {
                return new ErrorModel('登录博客失败')
            }
        })
    }

    /*//登录验证测试
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.session.username) {
            return Promise.resolve(new SuccessModel({
                session: req.session
            }))
        }
        return Promise.resolve(new ErrorModel('尚未登陆'))
    }*/
}

module.exports = handlerUserRouter