const {getList, getDetail, newBLog, updateBlog, delBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/respModel')

//统一登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登陆')
        )
    }
}

const handlerBlogRouter = (req, res) => {
    const method = req.method
    const id = req.query.id

    //获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''

        if (req.query.isadmin) {
            //
            const loginCheckResult = loginCheck(req)
            if (loginCheckResult) {
                return loginCheckResult
            }
            author = req.session.username
        }
        const result = getList(author, keyword)
        const promise = result.then(listData => {
            return new SuccessModel(listData)
        }, (error) => {
            console.error(error)
        })

        return promise
    }

    //获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        const result = getDetail(id)
        return result.then(resultData => {
            return new SuccessModel(resultData)
        })
    }

    //新建一篇博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }
        const blogData = req.body
        const author = req.session.username
        blogData.author = author
        const result = newBLog(blogData)
        return result.then(resultData => {
            return new SuccessModel(resultData)
        })
    }

    //更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }
        const blogData = req.body
        const result = updateBlog(id, blogData)
        return result.then(resultData => {
            if (resultData) {
                return new SuccessModel(resultData)
            } else
                return new ErrorModel('更新博客失败')
        })

    }

    //删除一篇博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        const loginCheckResult = loginCheck(req)
        if (loginCheckResult) {
            return loginCheckResult
        }
        const author = req.session.username
        const result = delBlog(id, author)
        return result.then(resultData => {
            if (resultData) {
                return new SuccessModel()
            } else {
                return new ErrorModel('删除博客失败')
            }
        })

    }
}

module.exports = handlerBlogRouter