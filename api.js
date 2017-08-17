'use strict';

var http = require('./http');
var constants = require('./constants');
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

    var formatPost = function (post) {
        var newPost = {};
        post.itemModel.fields.forEach(function (field) {
            if (field.fieldType.slug === constants.title) {
                newPost.title = post.content[field.slug].data || '';
            }
            if (field.fieldType.slug === (constants.content[0] || constants.content[0])) {
                newPost.content = post.content[field.slug].data || '';
            }
            if (field.fieldType.slug === (constants.image)) {
                newPost.featured_image = post.content[field.slug].data || '';
            }
            if (field.fieldType.slug === (constants.metatagTitle)) {
                newPost[constants.metatagTitle] = post.content[field.slug].data || '';
            }
            if (field.fieldType.slug === (constants.metatagDescription)) {
                newPost[constants.metatagDescription] = post.content[field.slug].data || '';
            }
        }); 
        newPost.date = post.createDate;
        return newPost; 
    }

    var createNewItem = function(hexo, post, layout) {
        return hexo.post.create(formatPost(post))
            .error(function(err) {
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
                         createNewItem(hexo, post, post.itemModel.slug);
                    });
                } else {
                    removeAllLocalPosts(hexo, listLocalPosts(hexo));
                }
            });
        }).catch(function (err) {
            console.log(err);
        });
        
    }

    return {
        getContent: getContent,
        sync: sync
    }

}
