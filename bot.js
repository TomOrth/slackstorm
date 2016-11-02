'use strict';
const RtmClient = require('@slack/client').RtmClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const fs = require('fs');
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const config = require('./config.json');
const bot = new RtmClient(config.token, {logLevel: 'debug'});
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/stormlog');
bot.start();

let plugins = new Map();

function loadPlugins(){
    var files = fs.readdirSync(__dirname + '/plugins', 'utf8');
	for (let plugin of files) {
		if (plugin.endsWith('.js')) {
			console.log(plugin.slice(0, -3));
			plugins.set(plugin.slice(0, -3), require(__dirname + '/plugins/' + plugin));
		} 
	}
    console.log('Plugins loaded.');
}


bot.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function(rtmStartData){
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
    loadPlugins();
});

bot.on(RTM_EVENTS.MESSAGE, function (message) {
    let user = bot.dataStore.getUserById(message.user),
        dm = bot.dataStore.getDMByName(user.name);

    if(user.name !== config.name && message.text.startsWith(config.prefix)){
        let content = message.text.split(config.prefix)[1],
            cmd = content.substring(0, content.indexOf(' ')),
            args = content.substring(content.indexOf(' ') + 1, content.length);
        if (plugins.get(cmd) !== undefined && content.indexOf(' ') !== -1) {
	    message.text = args;
	    plugins.get(cmd).main(bot, message, mongoose);
	} else if (plugins.get(content) !== undefined && content.indexOf(' ') < 0) {
	    plugins.get(content).main(bot, message);
	} 
    }
});

