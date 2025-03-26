const path = require('path');
const fs = require('fs');
const os = require('os');
const RammerheadJSMemCache = require('./classes/RammerheadJSMemCache.js');
const RammerheadJSFileCache = require('./classes/RammerheadJSFileCache.js');

const enableWorkers = os.cpus().length !== 1;

module.exports = {
    //// HOSTING CONFIGURATION ////

    bindingAddress: '0.0.0.0', // Allow external access (use 0.0.0.0 for Koyeb)
    port: process.env.PORT || 8080, // Use Koyeb's environment variable for the port
    crossDomainPort: 8081,
    publicDir: path.join(__dirname, '../public'), // set to null to disable

    // enable or disable multithreading
    enableWorkers,
    workers: os.cpus().length,

    // ssl object is null because Koyeb handles SSL automatically
    ssl: null,

    // this function's return object will determine how the client url rewriting will work.
    // Koyeb uses the domain from the Koyeb app URL, and the protocol is always HTTPS.
    getServerInfo: () => ({
        hostname: process.env.HOSTNAME || 'your-koyeb-app.koyeb.app', // Replace with your Koyeb app hostname
        port: 443, // Koyeb handles HTTPS on port 443
        crossDomainPort: 8081,
        protocol: 'https:',
    }),

    // enforce a password for creating new sessions. set to null to disable
    password: 'sharkie4life',

    // disable or enable localStorage sync (turn off if clients send over huge localStorage data, resulting in huge memory usages)
    disableLocalStorageSync: false,

    // restrict sessions to be only used per IP
    restrictSessionToIP: true,

    // caching options for js rewrites. (disk caching not recommended for slow HDD disks)
    jsCache: new RammerheadJSFileCache(path.join(__dirname, '../cache-js'), 5 * 1024 * 1024 * 1024, 50000, enableWorkers),

    // whether to disable http2 support or not (from proxy to destination site).
    disableHttp2: false,

    //// REWRITE HEADER CONFIGURATION ////

    // removes reverse proxy headers
    stripClientHeaders: [],
    rewriteServerHeaders: {
        'x-frame-options': null, // Example of removing the header
    },

    //// SESSION STORE CONFIG ////

    fileCacheSessionConfig: {
        saveDirectory: path.join(__dirname, '../sessions'),
        cacheTimeout: 1000 * 60 * 20, // 20 minutes
        cacheCheckInterval: 1000 * 60 * 10, // 10 minutes
        deleteUnused: true,
        staleCleanupOptions: {
            staleTimeout: 1000 * 60 * 60 * 24 * 3, // 3 days
            maxToLive: null,
            staleCheckInterval: 1000 * 60 * 60 * 6 // 6 hours
        },
        deleteCorruptedSessions: true,
    },

    //// LOGGING CONFIGURATION ////

    logLevel: process.env.DEVELOPMENT ? 'debug' : 'info',
    generatePrefix: (level) => `[${new Date().toISOString()}] [${level.toUpperCase()}] `,

    // logger depends on this value
    getIP: (req) => req.socket.remoteAddress
};

if (fs.existsSync(path.join(__dirname, '../config.js'))) Object.assign(module.exports, require('../config'));
