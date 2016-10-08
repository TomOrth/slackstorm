'use strict';
const RtmClient = require('@slack/client').RtmClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const fs = require('fs');
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const config = require('./config.json');
const bot = new RtmClient(config.token, {logLevel: 'debug'});
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
    console.log('Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}');
    loadPlugins();
});

bot.on(RTM_EVENTS.MESSAGE, function (message) {
    let user = bot.dataStore.getUserById(message.user),
        dm = bot.dataStore.getDMByName(user.name);

    if(user.name !== config.name && message.text.startsWith(config.prefix)){
        bot.sendMessage('Hello ' + user.name + '!', message.channel);
    }
});

