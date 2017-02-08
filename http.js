'use strict';

var request = require('request');
var q = require('q');

var http = function (requestParams) {
  var defer = q.defer();
  request(requestParams, function (error, response, body) {
    if(!error && response.statusCode == 200) {
      defer.resolve({
        'response': response,
        'data': JSON.parse(body)
      });
    } else {
      defer.reject({
        'response': response,
        'error': error
      });
    }
  });
  return defer.promise;
}

var getRequestParams = function (method, url, headers) {
  var requestParams = {
    method: method,
    url: url
  };
  setHeaderValues(headers, requestParams);
  return requestParams;
}

var setHeaderValues = function(headers, requestParams) {
  if(!headers) return;
  requestParams.headers = {};
  headers.forEach(function(header){
    requestParams.headers[header.key] = header.value;
  });
}

var setQueryStringValues = function(params, requestParams) {
  if (!params) return;
  requestParams.qs = params;
};

var setJsonValues = function(format, params, requestParams) {
  if (format !== 'JSON' || !params) return;
  requestParams.json = params;
};

exports.get = function (url, headers, params) {
  var requestParams = getRequestParams('GET', url, headers);
  setQueryStringValues(params, requestParams);
  return http(requestParams);
};

exports.post = function (url, format, headers, params) {
  var requestParams = getRequestParams('POST', url, headers);
  setJsonValues(format, params, requestParams);
  return http(requestParams);
};