var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var logSchema = new Schema({
    time: String,
    robot: String,
    scouting: String,
    vision: String,
    leds: String
});

var Log = mongoose.model('Log', logSchema);
module.exports = Log;
