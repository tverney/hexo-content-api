# hexo-content-api
An Hexo.js module for content consumption from an API that provides posts, articles, and etc, from an JSON restful Service.

#Instalação

Adicione os seguintes atributos ao seu projeto Hexo

netzei:
	token:
	url:

Crie o arquivo api.config.js e adicione as seguintes informações

"use strict";

var hexoApi = require('hexo-content-api'),
    Hexo = require('hexo'),
    hexo = new Hexo(process.cwd(), {});

hexo.init().then(function(){
	hexo.load().then(function(){
		hexoApi.sync(hexo);
    });
});

#Rodar

node api.config.js

