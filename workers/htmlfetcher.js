var archive = require('../helpers/archive-helpers');

// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

//using cron to run every 1 minute,
//check sites.txt for new entries
//pass array of new entries to archive.downloadUrls.
// then exit?

var CronJob = require('cron').CronJob;
new CronJob('0,10,20,30,40,50 * * * * *', function () {
  console.log('You will see this message every 10 seconds');
  archive.readListOfUrls(function (urls) {
    archive.downloadUrls(urls)
  })
}, null, true, 'America/Los_Angeles');
