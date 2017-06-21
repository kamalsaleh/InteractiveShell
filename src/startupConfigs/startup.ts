// This starts the main server!
import fs = require("fs");
import {AuthOption} from "../lib/enums";

const fileExistsPromise = function(filename) {
  return new Promise(function(resolve) {
    fs.access(filename, fs.constants.R_OK, function(err) {
      resolve(!err);
    });
  });
};

module.exports = function(overrideOptions) {
  fileExistsPromise("public/users.htpasswd")
    .then(function(exists) {
      if (exists) {
        overrideOptions.authentication = AuthOption.basic;
      } else {
        overrideOptions.authentication = AuthOption.none;
      }
    })
    .then(function() {
      require("./default").getConfig(overrideOptions, function(options) {
        const Macaulay2Server = require("../lib/server").mathServer(options);
        Macaulay2Server.listen();
      });
    })
    .catch(function(err) {
      console.log(err);
    });
};
