const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const pg = require('pg');
const pool = new pg.Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'helloWorldExpress',
    password: 'postgres',
    port: '5432'});


pool.query("SELECT * FROM calculator", (err, res) => {
    if(res === undefined){
        pool.query("CREATE TABLE calculator (id SERIAL PRIMARY KEY , first decimal, second decimal, operator varchar(10), result decimal )");
        console.log("Created table \"calculator\"");
    }
});

app.use(express.static(path.join(__dirname, 'public')));

/**
 * Test
 * @path {POST} /calculate
 */
app.post('/calculate', jsonParser, (req, res) =>
{
    const num1 = parseFloat(req.body.num1);
    const num2 = parseFloat(req.body.num2);
    const operator = req.body.op;

    pool.query(`SELECT * FROM calculator WHERE first = '${num1}' AND second = '${num2}' AND operator = '${operator}'`, (error, result) => {
        const data = result.rows[0];
        if(data !== undefined){
            console.log("Found equation in database!");
            res.json({result: data.result})
        }else{
            const result = calculate(num1, num2, operator);
            res.json(result);
            console.log("Stored new equation in database!");
            pool.query(`INSERT INTO calculator (first, second , operator, result ) VALUES (${num1}, ${num2}, '${operator}', ${result.result})`);
        }

    });




})

app.listen(port, () => console.log('Example App listening on port ' + port + '!'))

/**
 * Calculates the result from two numbers with given operation
 * @param num1 First number for calculation
 * @param num2 Second number for calculation
 * @param operation Operation for both numbers
 * @returns {float}
 */
function calculate(num1, num2, operation){
    let result;

    switch (operation){
        case '+': result = {result: num1+num2}; break;
        case '-': result = {result: num1-num2}; break;
        case '*': result = {result: num1*num2}; break;
        case '/': result = {result: num1/num2}; break;
        case 'pow': result = {result: Math.pow(num1, num2)}; break;
        default: result = {result: -1}; break;
    }
    return result;
}
