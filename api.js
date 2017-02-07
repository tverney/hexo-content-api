'use strict';

var http = require('./http');

module.exports = function (app, hexo, config) { 

	var getUrl = function (path, baseUrl) {
		return baseUrl + "/" + path;
	}

	var getHeaderToken = function (token) {
		var headers = [];
		return headers.push({key:"token", value:token});
	}

	var getSite = function () {
		var url = getUrl('site', config.url);
		var headerWithToken = getHeaderToken(config.token);
		return http.get(url, headerWithToken, []);
	}

	return {
		getSite: getSite
	}

}