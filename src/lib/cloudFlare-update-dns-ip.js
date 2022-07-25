const { redisClient } = require('../db/redis')
const logger = require('../lib/logger.lib')
const publicIp = require('public-ip')
const axios = require('axios').default

const { CLFL_ZONEID, CLFL_RECORDID, CLFL_ACCID, CLFL_AUTHKEY } = process.env

console.log(CLFL_AUTHKEY)

const url = `https://api.cloudflare.com/client/v4/zones/${CLFL_ZONEID}/dns_records/${CLFL_RECORDID}`

async function changeCloudFlareRecordIp(ip) {
    const data = {
        content: ip.toString(),
        proxied: true,
    }
    try {
        const response = await axios({
            method: 'patch',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Email': 'truongquocvuongnb@gmail.com',
                'X-Auth-Key': CLFL_AUTHKEY,
            },
            data: data,
        })
        return response
    } catch (error) {
        logger.error(`[CLOUD FLARE] ${error.name} ${error.message}`)
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

// ;(async () => {
//     const publicIpV4 = await publicIp.v4()
// })()

setInterval(async () => {
    try {
        const publicIpV4 = await publicIp.v4()
        const redisKey = 'my_publish_wan_ip'

        console.log(publicIpV4)

        // await redisClient.FLUSHALL()

        let oldIp = (await redisClient.get(redisKey)) || 'no - ip'

        if (oldIp.toString() == publicIpV4.toString()) {
            logger.info('PUBLIC IP NOT CHANGE')
            return
        }

        logger.info(`Current public ip ${publicIpV4.toString()}`)

        logger.info(`Persistent public ip ${oldIp.toString()}`)

        const result = await changeCloudFlareRecordIp(publicIpV4)

        if (result.data.success) {
            logger.info('PUBLIC IP UPDATED SUCCESSFULLY')
            console.log(result.data.success)
            await redisClient.del(redisKey)
            await redisClient.set(redisKey, publicIpV4.toString())
        }
    } catch (error) {
        logger.error(`[CLOUD FLARE] ${error.name} ${error.message}`)
    }
}, 120000)
