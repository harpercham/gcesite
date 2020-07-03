var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var secured = require('../lib/middleware/secured');

router.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
router.use(bodyParser.json({ limit: '50mb' }));

var daten;
//router post
router.post('/whatsapp', secured(), function (req, res) {
    daten = (req.body);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    var groupAdmin = daten.group_admin; // TODO: Specify the WhatsApp number of the group creator, including the country code
    var groupName = daten.group_name;   // TODO: Specify the name of the group
    var message = daten.message

    sendWhatsappGroupPatience(groupAdmin, groupName, message)

    function sendWhatsappGroupPatience(groupAdmin, groupName, message) {
        var http = require('http');

        var instanceId = "24";  // TODO: Replace it with your gateway instance ID here
        var clientId = " maxchao7023@gmail.com";  // TODO: Replace it with your Forever Green client ID here
        var clientSecret = "16609007ee7840138d521bdab65986b6";   // TODO: Replace it with your Forever Green client secret here

        var jsonPayload = JSON.stringify({
            group_admin: groupAdmin, // TODO: Specify the WhatsApp number of the group creator, including the country code
            group_name: groupName,   // TODO:  Specify the name of the group
            message: message  // TODO: Specify the content of your message
        });

        var options = {
            hostname: "api.whatsmate.net",
            port: 80,
            path: "/v3/whatsapp/group/text/message/" + instanceId,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-WM-CLIENT-ID": clientId,
                "X-WM-CLIENT-SECRET": clientSecret,
                "Content-Length": Buffer.byteLength(jsonPayload)
            }
        };

        var request = new http.ClientRequest(options);
        request.end(jsonPayload);

        request.on('response', function (response) {
            console.log('Heard back from the WhatsMate WA Gateway:\n');
            console.log('Status code: ' + response.statusCode);
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                console.log(chunk);
            });
        });
    };
});





module.exports = router;
