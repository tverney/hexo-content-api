'use strict';

var config = hexo.config.netzei;

if (!config) {
console.error("[Netzei CMS]: admin informations is required for authentication");
throw new Error("[Netzei CMS]: admin informations is required for authentication");
}

hexo.extend.filter.register('before_generate', function(app){
	  console.log("Init sync with with your Netzei API:");
	  api(app, hexo, token);
});