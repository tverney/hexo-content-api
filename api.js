'use strict';

var http = require('./http');
var fs = require('fs');

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
            .then(function(file) {
                var source = file.path.slice(hexo.source_dir.length);
                return hexo.source.process([source]);
            });
    }

    var listLocalPosts = function(hexo) {
        return hexo.model('Post').sort('-date').toArray();
    }

    var removeAllLocalPosts = function(hexo, posts) {
        posts.forEach(function (post) {
            fs.unlinkSync(hexo.source_dir + post.source);
        })
    }

    var sync = function(hexo, config) {
        return getContent(config, "posts").then(function(data) {
            if (data.data.length) {
                removeAllLocalPosts(hexo, listLocalPosts(hexo));
                return data.data.forEach(function(post) {
                        createNewItem(hexo, post, "post");
                });
            } else {
                console.info("There`s nothing to sync.")
            }
        });
    }

    return {
        getContent: getContent,
        sync: sync
    }

}
