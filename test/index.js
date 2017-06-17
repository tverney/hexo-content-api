var should = require('chai').should(),
    hexoIndex = require('../index'),
    api = require('../api'),
    Hexo = require('hexo'),
    hexo = new Hexo(process.cwd(), {}),
    sync = hexoIndex.sync;

describe('#sync', function() {

  it('Init sync with Netzei API data - index.js', function() {
  	var netzei = {
      url:"http://localhost:3000",
      readApiToken:"703h6XOwnkfZgZ2s22vM1O1LVaA4"
    }
  	hexo.config.netzei = netzei;
    sync(hexo);
  });

  it('Init sync with Netzei API data - api.js', function() {
    var netzei = {
      url:"http://localhost:3000",
      readApiToken:"703h6XOwnkfZgZ2s22vM1O1LVaA4"
    };
    hexo.config.netzei = netzei;
    return api().sync(hexo, hexo.config.netzei).then(function (data) {
      
    });
  });

  it('Init sync with Netzei API data - api.js', function() {
    var netzei = {
      url:"http://app.netzei.com",
      readApiToken:"703h6XOwnkfZgZ2s22vM1O1LVaA4"
    };
    hexo.config.netzei = netzei;
    return api().sync(hexo, hexo.config.netzei).then(function (data) {
      
    });
  });

});

