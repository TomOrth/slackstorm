'use strict';
const Log = require('../models/logItem.js');
module.exports = {
    main: function(bot, message, mongoose) {
        let content = message.text;
        content = content.substring(content.indexOf('log ') + 1, content.length);
        let data = content.split(', ');
        let logObj = {};
        for(let item of data){
            let logCont = item.split('-');
            console.log('content: ' + item);
            logObj[logCont[0]] = logCont[1];
        }
        let logItem = new Log(logObj);
        logItem.save(function(err, logItem){
            if(err){
                bot.sendMessage('Something went wrong', message.channel);
            } 
            else{
                bot.sendMessage('Success!', message.channel);
            }
        });
       
    }

};
