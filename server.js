var express = require("express");
var fs = require("fs");
var request = require("request");
var path = require('path');
var cheerio = require("cheerio");
var bodyParser = require('body-parser');

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, '/url.html'));
});

app.post("/", urlencodedParser, function (req, res) {
    var data = req.body;
    url = data.url;
    request(url, function (error, response, html) {
        if (!error) {
            var $ =cheerio.load(html);
            var title, release;
            var json = { title: "", release: ""};
            $('.title_wrapper h1').filter(function () {
                var data = $(this);
                json.title = data.text();
            })
            $('#titleYear').filter(function () {
                var year = $(this);
                release = year.children().first().text();
                json.release = release;
            })
        }
        res.send(json);
    });
})

app.listen('8081');
console.log("Magic is happening on port 8081");