require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');

AWS.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "BaiBao"

const convertFormToJson = multer();
const app = express();

app.use(express.static('./css'));
app.set('view engine', 'ejs');
app.set('views', './templates');

app.get('/', (req, res) => {
    const params = {
        TableName: tableName
    };
    docClient.scan(params, (err, data) => {
        if (err) {
            return res.send('Internal server error');
        } else {
            // console.log('data = ', JSON.stringify(data));
            return res.render('index', { data:data.Items});
        }
    });
    // return res.render('index', { data: data });
});

app.post('/', convertFormToJson.fields([]), (req, res) => {
    const {ma_bao, ten_bao} = req.body;
    const params = {
        TableName : tableName,
        Item: {
            ma_bao,
            ten_bao
        }
    };
    docClient.put(params,(err,data) => {
        if (err) {
            return res.send('Internal server error');
        } else {
            // console.log('data = ', JSON.stringify(data));
            return res.redirect('/');
        }
    });
    // console.log(req.body);
    // // data.push(req.body);
    // return res.redirect('/');
});

app.get("/xxx",(req,res) =>{
    res.render('them')
});

app.post('/delete', convertFormToJson.fields([]), (req,res) => {
    const {ma_bao} = req.body;
    const params = {
        TableName: tableName,
        Key: {
            ma_bao
        }
    };

    docClient.delete(params, (err,data) => {
        if (err) {
            return res.send('Internal server error');
        } else {
            return res.redirect('/');
        }
    });
});

app.listen(4000, () => {
    console.log('Running on 4000');
});