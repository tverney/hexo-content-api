'use strict';

var api = require('./api');

exports.sync = function (hexo) {
	var config = hexo.config.netzei || null;

	if (!config) {
		console.error("[Netzei CMS]: admin informations is required for authentication");
		throw new Error("[Netzei CMS]: admin informations is required for authentication");
	}

	hexo.extend.filter.register('before_generate', function(app){
		  console.log("Init sync with with your Netzei API:");
		  api().sync(hexo, config);
	});
}
