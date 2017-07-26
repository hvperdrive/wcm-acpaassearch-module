require("rootpath")();
var indexHelper = require("app/helpers/elastic/indices");

var createIndex = function createIndex(client, index) {
    indexHelper.read(index, client)
        .then(function(response) {
            console.log("UPDATING INDEX");
            console.log("UPDATING INDEX -- REMOVING INDEX");
            indexHelper.remove(index, client)
                .then(function() {
                    console.log("UPDATING INDEX -- CREATING INDEX");
                    indexHelper.create(index, client);
                });
        }, function(errResponse) {
            if (errResponse.status === 404) {
                console.log("CREATING INDEX");
                indexHelper.create(index, client);
            }
        });
};

module.exports = {
    create: createIndex
};
