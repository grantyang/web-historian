// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

//using cron to run every 1 minute,
//check sites.txt for new entries
//pass array of new entries to archive.downloadUrls.
// then exit?

var CronJob = require('cron').CronJob;
new CronJob('0,10,20,30,40,50 * * * * *', function() {
  console.log('You will see this message every 10 seconds');
  //if our sites.txt does not exist, don't do anything
}, null, true, 'America/Los_Angeles');
