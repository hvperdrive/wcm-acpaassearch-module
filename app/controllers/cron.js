var cron = require("node-cron");

function ElasticCron() {
    this.cronJob = cron.schedule("0 0 1 * *", function() {
        // Sync all content
    }, false);
}

elasticCron.prototype.start = function() {
    this.cronJob.start();
};

elasticCron.prototype.stop = function() {
    this.cronJob.stop();
};

module.exports = new ElasticCron();


