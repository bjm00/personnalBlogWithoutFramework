const redis = require('redis')

//创建客户端
const client = redis.createClient(6379, '127.0.0.1')
client.on('error', err => {
    console.log(err)
})

//测试
client.set('myname', "zhangsan2", redis.print)
client.get('myname', (err, val) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('val ', val)
})

//退出
client.quit()
