const {loginCheck} = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/respModel')

const handlerUserRouter = (req, res) => {
    const method = req.method //GET POST
    //登录
    if (method === 'POST' && req.path === '/api/user/login') {
        const {username, password} = req.body
        const result = loginCheck(username, password)
        return result.then(resultData =>{
            if (resultData) {
                return new SuccessModel()
            } else {
                return new ErrorModel('登录博客失败')
            }
        })

    }
}

module.exports = handlerUserRouter