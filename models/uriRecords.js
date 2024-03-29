'use strict';

const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      autoInc = require('mongoose-auto-increment');

//initialise mongo
autoInc.initialize(mongoose.connection);

const UriRecords = new Schema ({
  uri : {type: String, required: true},
  uriIdx: {type: Number},
});

UriRecords.plugin(autoInc.plugin, {
    model: 'UriRecords',
    field: 'uriIdx',
    startAt: 1
});

module.exports = mongoose.model('UriRecords', UriRecords);