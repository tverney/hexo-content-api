var should = require('chai').should(),
    hexoIndex = require('../index'),
    api = require('../api'),
    Hexo = require('hexo'),
    hexo = new Hexo(process.cwd(), {}),
    sync = hexoIndex.sync;

describe('#sync', function() {
  it('Init sync with Netzei API data - index.js', function() {
  	var netzei = {
  		url:"https://api.netzei.com",
  		access_token:"yLY0teWHhnretce98JgKCeLp2UogG6DJ"
  	}
  	hexo.config.netzei = netzei;
    sync(hexo);
  });

  it('getSites - api.js', function() {
  	var netzei = {
  		url:"http://0.0.0.0:9000",
  		access_token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4OWEwZjgwOTQ4OWJiNTBhNDU1ODhhNiIsImlhdCI6MTQ4NjQ5Mzg0MH0.GwhNyT1oVw61rZMAwnuTPC88rIhyLYp742kVpr5AeLc"
  	}
  	hexo.config.netzei = netzei;
    return api().getContent(hexo.config.netzei, "sites").then(function (data) {
    	
    });
  });

  it('getPosts - api.js', function() {
    var netzei = {
      url:"http://0.0.0.0:9000",
      access_token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4OWEwZjgwOTQ4OWJiNTBhNDU1ODhhNiIsImlhdCI6MTQ4NjQ5Mzg0MH0.GwhNyT1oVw61rZMAwnuTPC88rIhyLYp742kVpr5AeLc"
    }
    hexo.config.netzei = netzei;
    return api().getContent(hexo.config.netzei, "posts").then(function (data) {
     
    });
  });

  it('sync - api.js', function() {
    var netzei = {
      url:"http://0.0.0.0:9000",
      access_token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4OWEwZjgwOTQ4OWJiNTBhNDU1ODhhNiIsImlhdCI6MTQ4NjQ5Mzg0MH0.GwhNyT1oVw61rZMAwnuTPC88rIhyLYp742kVpr5AeLc"
    }
    hexo.config.netzei = netzei;
    return api().sync(hexo, hexo.config.netzei).then(function (data) {
     
    });
  });

});

