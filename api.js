'use strict';

var http = require('./http');

module.exports = function() {

    var getUrl = function(path, baseUrl) {
        return baseUrl + "/" + path;
    }

    var getHeaderToken = function(token) {
        var headers = [];
        headers.push({ key: "access_token", value: token });
        return headers;
    }

    var getContent = function(config, path) {
        var url = getUrl(path, config.url);
        var headerWithToken = getHeaderToken(config.access_token);
        return http.get(url, headerWithToken, []);
    }

    var addIsDraft = function(post) {
        post.isDraft = post.source.indexOf('_draft') === 0;
        post.isDiscarded = post.source.indexOf('_discarded') === 0;
        return post;
    }

    var createNewItem = function(hexo, post, layout) {
        return hexo.post.create({ title: post.title, layout: layout, date: new Date() })
            .error(function(err) {
                console.error(err, err.stack)
                return new Error("Failed to create page");
            })
            .then(function(err, file) {
                var source = file.path.slice(hexo.source_dir.length);
                return hexo.source.process([source]).then(function() {
                    var page = hexo.model('Page').findOne({ source: source });
                    return addIsDraft(page);
                });
            });
    }

    var sync = function(hexo, config) {
        return getContent(config, "posts").then(function(data) {
        	data.data.forEach(function (post) {
        		var postInHexo = hexo.model('Post').get(post.id);
        		if (!postInHexo) {
        			createNewItem(hexo, post, "post");
        		}
        	});
        });
    }

    return {
        getContent: getContent,
        sync: sync
    }

}
