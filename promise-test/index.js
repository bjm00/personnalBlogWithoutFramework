const fs = require('fs')
const path = require('path')


//callback方式获取一个文件的内容
/*
function getFileContent(fileName, callback) {
    const fullFileName = path.resolve(__dirname, 'files', fileName)
    fs.readFile(fullFileName, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        callback(
            JSON.parse(data.toString())
        )
    })
}

//测试 callback-hell
getFileContent('a.json', aData => {
    console.log('aData', aData)
    getFileContent(aData.next, bData => {
        console.log('bData', bData)
        getFileContent(bData.next, cData => {
            console.log('cData', cData)
        })
    })
})*/

//用promise 获取文件内容
function getFileContent(fileName) {
    const promise = new Promise((resolve, reject) => {
        const fullFileName = path.resolve(__dirname, 'files', fileName)
        fs.readFile(fullFileName, (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve(
                JSON.parse(data.toString())
            )
        })
    })
    return promise
}

getFileContent('a.json').then(aData => {
    console.log('aData', aData)
    return getFileContent(aData.next)
}).then(bData => {
    console.log('bData', bData)
    return getFileContent(bData.next)
}).then(cData => {
    console.log('cData', cData)
})

//asyn wait
//koa2

