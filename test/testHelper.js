const Db = require('../src/db');
const PgBoss = require('../src/index');

module.exports = {
    init: init,
    start: start,
    extend: extend,
    getDb: getDb,
    getJobById: getJobById,
    getConfig: getConfig,
    getConnectionString: getConnectionString
};

function getConnectionString() {
    let config = getConfig();

    return `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
}

function getConfig(){
    let config = require('./config.json');

    if(process.env.TRAVIS) {
        config.port = 5432;
        config.password = '';
        config.schema = 'pgboss' + process.env.TRAVIS_JOB_ID;
    }

    return clone(config);
}

function getDb() {
    return new Db(getConfig());
}

function init() {
    return getDb().executeSql(`DROP SCHEMA IF EXISTS ${getConfig().schema} CASCADE`);
}

function getJobById(id) {
    return getDb().executeSql(`select * from ${getConfig().schema}.job where id = $1`, [id]);
}

function start(options) {

    return init()
        .then(() => {
            let config  = getConfig();

            if(options && typeof options == 'object')
                options = extend(config, options);

            return new PgBoss(options || config).start();
        });
}

function extend(dest, source) {
    for(var key in source) {
        if(source.hasOwnProperty(key))
            dest[key] = source[key];
    }
    return dest;
}

function clone(source) {
    return extend({}, source);
}