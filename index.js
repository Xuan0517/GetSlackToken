"use strict";

var express = require('express');
var app     = express();
var request = require('request');
var cfenv   = require('cfenv');
var Etcd    = require('node-etcd');

var redirect_uri = null;
var port = null;
var appEnv = null;
var etcdService = null;
var etcd_ca = null;
var etcd_hosts = null;
var etcd_pw = null;
var etcd_auth = null;

console.log('Start running...');
port = process.env.PORT;
appEnv = cfenv.getAppEnv();
redirect_uri = process.env.REDIRECTURI;
etcdService = appEnv.getServiceCreds(/etcd/);
etcd_ca = new Buffer(etcdService.ca_certificate_base64, 'base64');
var parts = etcdService.uri_cli.split(' ');
etcd_hosts = parts[5].split(',');
etcd_pw = parts[7].split(':');
etcd_auth = {
        user: etcd_pw[0],
        pass: etcd_pw[1]
}; 

var etcd = new Etcd(etcd_hosts, { auth: etcd_auth, ca: etcd_ca } );

// Redirect to /test
app.get('/', function(req, res){
    res.redirect('/test');
});

//OAUTH callback handler - this is the where the Slack redirect_uri for OAUTH should point.
function safeGet(key){
        //console.log('Getting etcd key ' + key);
        var results = etcd.getSync(process.env.KEYPATH + '/' + key);
        var token = etcd.getSync(process.env.KEYPATH + '/token');
        if (results.body){
                console.log('Getting etcd key ' + key + ': ' + results.body.node.value);
                console.log('Getting etcd key token: ' + token.body.node.value);
                return results.body.node.value;
        } else {
                return " unset ";
        }
}

app.get('/auth', function(req, res){

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
        }, function(err, response, body){
                if (!err){
                        console.log('Good response:');
                        console.log(body);
                        var b = JSON.parse(body);
                        etcd.set(process.env.KEYPATH + '/token', b.access_token);
                        etcd.set(process.env.KEYPATH + '/scope', b.scope);
                        res.redirect('/test');

                } else {
                        console.log(JSON.stringify(err));
                }
        });
});

app.get('/test', function(req, res){
        res.render('test', {
                scope: safeGet('scope'),
                client_id: process.env.OAUTHCLIENT
        });
});

app.set('view engine', 'pug');
app.use(express.static('public'));

app.listen(port, function () {
  console.log('App listening on port ' + port + " !");
});
