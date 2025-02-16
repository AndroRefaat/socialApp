import express from 'express'
import 'dotenv/config';
import bootstrap from './src/app.controller.js'
import chalk from 'chalk';
import dotenv from 'dotenv'
dotenv.config();
const app = express()
bootstrap(app, express);


const port = process.env.PORT
app.listen(port, () => console.log(chalk.blue.bgRed.bold(`Example app listening on port ${port}!`)))