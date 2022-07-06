const Cache = require('file-system-cache').default

const cache = Cache({
    basePath: './.cache', // Optional. Path where cache files are stored (default).
    ns: 'my-namespace', // Optional. A grouping namespace for items.
})

const fileSystemCache = async (key, callback) => {
    const cached = await cache.get(key)

    if (cached) {
        return cached
    }

    const value = await callback()

    await cache.set(key, value)

    return value
}

// clear file system cache
setInterval(function () {
    try {
        cache.clear()
    } catch (error) {
        console.log(error)
    }
}, 3600000) //clear after one hour

module.exports = fileSystemCache
