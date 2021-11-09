const {getList, getDetail, newBLog, updateBlog, delBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/respModel')
const handlerBlogRouter = (req, res) => {
    const method = req.method
    const id = req.query.id

    //获取博客地址
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
        const result = getList(author, keyword)
        debugger;
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
        const blogData = req.body
        const author = 'zhangsan'//假数据，待开发登录时再改成真实数据
        blogData.author = author
        const result = newBLog(blogData)
        return result.then(resultData => {
            return new SuccessModel(resultData)
        })
    }

    //更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
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
        const author = 'zhangsan'//假数据，待开发登录时再改成真实数据
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