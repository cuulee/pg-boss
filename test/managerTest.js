var assert = require('chai').assert;
var helper = require('./testHelper');
var PgBoss = require('../src/index');

describe('manager', function(){

    before(function(finished){
       helper.init().then(() => finished());
    });

    it('should reject multiple simultaneous start requests', function(finished) {

        var boss = new PgBoss(helper.getConfig());

        boss.start();

        boss.start().catch(() => {
            assert(true);
            finished();
        });
    });

});



