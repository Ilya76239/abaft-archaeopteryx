"use strict";

const UriRecords = require("../models/uriRecords.js");
const URI = require("uri-js");
const dns = require("dns");
//handle new uri requests
exports.newURI = (req, res) => {
  //parse URI
  let uri = URI.parse(req.body.url);
  let origURI = URI.serialize(uri);
  //check validity of uri using the URI.js library
  if (uri.scheme == null) {
    res.json({ error: "invalid URL" });
  } else if (uri.scheme.match(/(http)s?/)) {
    //check hostname resolves
    dns.lookup(uri.host, err => {
      if (err) {
        //send error if hostname does not resolve
        res.json({ error: "invalid hostname" });
      } else {
        //check if URI record exists
        UriRecords.findOne({ uri: origURI }, (err, stored) => {
          if (err) return;
          if (stored) {
            //return record
            res.json({ original_url: origURI, short_url: stored.uriIdx });
          } else {
            //create new URI record if not found

            const newUriRecord = new UriRecords({
              uri: origURI
            });

            newUriRecord.save((err, data) => {
              if (err) {
                console.log(err);
                return;
              }
              res.json({ original_url: data.uri, short_url: data.uriIdx });
            });
          }
        });
      }
    });
  } else {
    res.json({ error: "invalid URL" });
  }
};

exports.handleShortUri = (req, res) => {
  if (!parseInt(req.params.shUri, 10)) {
    res.json({ error: "Invalid format" });
  } else {
    UriRecords.findOne({ uriIdx: req.params.shUri }, function(err, data) {
      if (err) return;
      if (data) {
        // redirect to the stored page
        res.redirect(data.uri);
      } else {
        res.json({
          error: "No short url found for given input: " + req.params.shUri
        });
      }
    });
  }
};
