"use strict";

var express = require('express');
var app = express();
var request = require('request');
var cfenv = require('cfenv');
var fs = require('fs');
var redirect_uri = null;
var port = null;
var appEnv = null;

console.log('Start running...');
port = process.env.PORT;
appEnv = cfenv.getAppEnv();
redirect_uri = process.env.REDIRECTURI;

// Redirect to /test
app.get('/', function(req, res) {
    res.redirect('/test');
});

//OAUTH callback handler - this is the where the Slack redirect_uri for OAUTH should point.
app.get('/auth', function(req, res) {

    var formData = {
        client_id: process.env.OAUTHCLIENT,
        client_secret: process.env.OAUTHSECRET,
        redirect_uri: redirect_uri,
        code: req.query.code,
    };

    console.log('Received callback from OAUTH: code:' + req.query.code + '  state:' + req.query.state);
    request.post({
        url: 'https://slack.com/api/oauth.access',
        formData: formData
    }, function(err, response, body) {
        if (!err) {
            console.log('Good response, save token to file...');
            console.log(body);
            var b = JSON.parse(body);
            fs.open('./Token.txt', 'a', function opened(err, fd) {
                if (err) {
                    throw err;
                }
                var writeBuffer = new Buffer('Scope: ' + b.scope + '\nToken: ' + b.access_token + '\n'),
                    bufferPosition = 0,
                    bufferLength = writeBuffer.length,
                    filePosition = null;
                fs.write(fd, writeBuffer, bufferPosition, bufferLength, filePosition,
                    function wrote(err, written) {
                        if (err) {
                            throw err;
                        }
                        console.log('Wrote ' + written + ' bytes');
                    });
            });
            res.redirect('/test');
        } else {
            console.log(JSON.stringify(err));
        }
    });
});

app.get('/test', function(req, res) {
    res.render('test', {
        client_id: process.env.OAUTHCLIENT
    });
});

app.set('view engine', 'pug');
app.use(express.static('public'));

app.listen(port, function() {
    console.log('App listening on port ' + port + " !");
});
