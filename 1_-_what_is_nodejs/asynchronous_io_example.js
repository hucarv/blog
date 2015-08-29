'use strict';
/*
 * This program demonstrates that nodejs executes the I/O events
 * asyncronously, allowing other events to be executed while it awaits for the
 * I/O events to be completed.
 */
var https = require('https');
var fs = require('fs');

// Here we schedule a message to be writen on the console after 3 seconds.
setTimeout(
  function() { // <- this is a callback function that will be called after 3 seconds.
    console.log('3 seconds have passed! Has the file download finished yet?');
  },
  3000 // 3 seconds
);

// Now we request the download of a file (it's the nodejs's source code, by the way).
// This download request will enter the nodejs's event loop but will not block
// the loop since it is an I/O event. So, nodejs will keep executing our next
// program's statements. When the download completes, our callback function
// will then be called by nodejs and a message informing the download completion
// is printed on the console.
var stream = fs.createWriteStream('node-v0.12.7-linux-x64.tar.gz');
stream.on('finish', // <- we want to listen to the stream's "finish" event
  function() { // <- this callback function will be called when the download is completed (the "finish" event is emitted)
    console.log('The download has been completed.');
    stream.close();
  }
);
var request = https.get('https://nodejs.org/dist/v0.12.7/node-v0.12.7-linux-x64.tar.gz', function(res) {
  console.log('Downloading file...');
  res.pipe(stream); // <- we pipe the http response to the write stream so that the downloaded file can be written to the disk
});

// Nodejs will run the event loop until there are no more callback functions
// left to be called. Then, nodejs will terminate our program.
console.log('Download request has been sent!');
