const https = require('https')
const http = require('http')
const { redisClient } = require('../db/redis')
const logger = require('../lib/logger.lib')

const { CLFL_ZONEID, CLFL_RECORDID, CLFL_ACCID, CLFL_AUTHKEY } = process.env

const url = `https://api.cloudflare.com/client/v4/zones/${CLFL_ZONEID}/dns_records/${CLFL_RECORDID}`

async function changeCloudFlareRecordIp(ip) {
    const data = {
        content: ip.toString(),
        proxied: true,
    }
    console.log(data)

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Email': 'truongquocvuongnb@gmail.com',
                'X-Auth-Key': CLFL_AUTHKEY,
            },
            body: JSON.stringify(data),
        })
        const result = await response.json()
        console.log(result)
    } catch (error) {
        console.log(error)
    }
}

//   async function getListRecord() {
//     res = await fetch(`https://api.cloudflare.com/client/v4/zones/${CLFL_ZONEID}/dns_records`,{
//         headers:{
//             "X-Auth-Email": "truongquocvuongnb@gmail.com",
//             "X-Auth-Key":CLFL_AUTHKEY,
//             "Content-Type":"application/json"
//         }
//     })

//     const data  = await res.json()
//     console.log(data);
//   }

//   getListRecord()

setInterval(async () => {
    try {
        http.get({ host: 'api.ipify.org', port: 80, path: '/' }, (resp) => {
            resp.on('data', async (ip) => {
                //
                let oldIp = (await redisClient.get('my_publish_wan_ip')) || ''

                logger.info(`Địa chỉ ip máy tính hiện tại ${ip.toString()}`)

                logger.info(`Địa chỉ ip máy tính lưu trong redis ${oldIp.toString()}`)

                if (oldIp.toString() == ip.toString()) {
                    return
                }
                await redisClient.del('my_publish_wan_ip')
                await redisClient.set('my_publish_wan_ip', ip)

                let newIP = await redisClient.get('my_publish_wan_ip')

                logger.info(`Địa chỉ ip redis mới ${newIP} `)

                return changeCloudFlareRecordIp(ip)
            })
        })
    } catch (error) {
        logger.error(error)
    }
}, 50000)
