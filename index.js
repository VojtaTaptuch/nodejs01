
const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const csvtojson = require('csvtojson');
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static("public"));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "ukoly"));


app.listen(port, () => {
console.log(`Port ${port}`);
});

const urlencodedParser = bodyParser.urlencoded({extended: false});
app.post('/savedata', urlencodedParser, (req, res) => {
let date = moment().format('YYYY-MM-DD');
let str = `"${req.body.task}","${req.body.druh}","${date}","${req.body.splneni}"\n`;
fs.appendFile(path.join(__dirname, 'data/data.csv'), str, function (err) {
if (err) {
console.error(err);

return res.status(400).json({
success: false,
message: "Chyba během ukládání souboru"
});
}
});
res.redirect(301, '/');
});

app.get("/ukoly", (req, res) => {
    csvtojson({headers:['task','druh','zadani','splneni']}).fromFile(path.join(__dirname, 
    'data/data.csv'))
    .then(data => {
    console.log(data);
    res.render('index', {nadpis: "Seznam úkolů", ukoly: data});
    }) 
    });
    