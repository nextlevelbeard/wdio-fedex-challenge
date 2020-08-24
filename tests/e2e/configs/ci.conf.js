const path = require("path");
const argv = require("yargs").argv;
const merge = require("deepmerge");

const { config: bsConfig } = require("./bs.conf.js");
const { parallel } = argv;
require("@babel/register");

process.env.CI = true;

module.exports.config = merge(bsConfig, {
	specs: [
		path.join(
			parallel ? bsConfig._PARALLEL_FEATURES : bsConfig._FEATURES,
			"**/*.feature"
		)
	]
});
