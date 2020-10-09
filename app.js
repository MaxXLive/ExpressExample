const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(express.static(path.join(__dirname, 'public')));

app.post('/calculate', jsonParser, (req, res) =>
{
    const num1 = parseFloat(req.body.num1);
    const num2 = parseFloat(req.body.num2);
    const operation = req.body.op;

    console.log(req.body);
    let result;

    switch (operation){
        case '+': result = {result: num1+num2}; break;
        case '-': result = {result: num1-num2}; break;
        case '*': result = {result: num1*num2}; break;
        case '/': result = {result: num1/num2}; break;
        case 'pow': result = {result: Math.pow(num1, num2)}; break;
        default: result = {result: -1}; break;
    }
    res.json(result);
})


app.listen(port, () => console.log('Example App listening on port ' + port + '!'))
