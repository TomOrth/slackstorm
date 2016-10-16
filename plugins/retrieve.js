'use strict';
const Log = require('../models/logItem.js');
module.exports = {
    main: function(bot, message, mongoose) {
          let content = message.text;
         content = content.substring(content.indexOf('retrieve ') + 1, content.length);
         let data = content.split(', ');
         let timeIndex = data[0];
         let queryData = data[1].split('-');
         if(queryData.length < 1)
             queryData = [data[1]];
         Log.findOne({'time': timeIndex}, function(err, results){
             if (err) return console.error(err);
             console.log(results);
             let response = 'Minutes from meeting ' + timeIndex + ': ';
             for(let column of queryData){
                 response += '\n' + column + ': ' + results[column];               }
             bot.sendMessage(response, message.channel);
         })
    }
};
