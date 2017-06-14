'use strict';

var http = require('./http');
var fs = require('fs');

module.exports = function() {

    var getUrl = function(path, baseUrl) {
        return baseUrl + "/" + path;
    }

    var getHeaderToken = function(key, token, bearer) {
        var headers = [];
        var bearer;
        if (bearer) { 
            bearer = 'Bearer ';
            token = bearer + token;
         };
        headers.push({ key: key, value: token });
        return headers;
    }

    var getContent = function(path, config, token) {
        var url = getUrl(path, config.url);
        var headerWithToken = getHeaderToken('auth', token, true);
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

    var auth = function (config) {
        var url = getUrl('auth/loginBySite', config.url);
        var headerWithToken = getHeaderToken('token', config.readApiToken);
        return http.post(url, headerWithToken, []);
    }

    var removeAllLocalPosts = function(hexo, posts) {
        posts.forEach(function (post) {
            fs.unlinkSync(hexo.source_dir + post.source);
        })
    }

    var sync = function(hexo, config) {
        return auth(config).then(function (data) {
            var token = data.data.token;
            var siteHash = data.data.hashid;
            return getContent('api/item?siteId='+siteHash, config, token).then(function(data) {
                if (data.data.length) {
                    removeAllLocalPosts(hexo, listLocalPosts(hexo));
                    data.data = JSON.parse(data.data);
                    return data.data.forEach(function(post) {
                        createNewItem(hexo, post, post.itemModel.name);
                    });
                } else {
                    console.info("There`s nothing to sync.")
                }
            });
            return data;
        });
        
    }

    return {
        getContent: getContent,
        sync: sync
    }

}
