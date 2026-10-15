const { load_update_db } = require('./src/cron/load_db/load_db');
var cron = require('node-cron');

//cron each two hours update all the db
cron.schedule('0 0 */2 * * *', function() {
  load_update_db();
});

//at the start of the server update all the db
load_update_db();
