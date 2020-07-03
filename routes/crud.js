var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var secured = require('../lib/middleware/secured');
const { GoogleSpreadsheet } = require('google-spreadsheet');

router.use(bodyParser.urlencoded({limit: '50mb', extended: true,parameterLimit:50000}));
router.use(bodyParser.json({limit: '50mb'}));

var daten;
//router post
router.post('/crud', secured(), function (req, res) {
    daten = (req.body);
    console.log('daten:'+daten)
    appendRow();
});

async function appendRow() {
    var spreadsheetId = new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(daten.form_url)[1];
    var cred = JSON.parse(daten.form_cred);
    const doc = new GoogleSpreadsheet(spreadsheetId);
    try {
        await doc.useServiceAccountAuth(cred);
        await doc.loadInfo(); // loads document properties and worksheets
        const sheet = doc.sheetsByIndex[daten.form_tabSeq]; // or use doc.sheetsById[id]
        let values = daten.form_data.map(function (num) {
            return num.value
        });
        values.push(new Date()) //log update timing
       await sheet.addRow(values);



    }
    catch (err) {
        console.log('append row failure:' + err);
    };


};

module.exports = router;
