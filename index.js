#!/usr/bin/env node

const { spawn } = require("child_process");
const chalk = require("chalk");
const os = require("os");

const yargs = require("yargs");

const options = yargs
 .usage("Usage: -f <file>")
 .option("-f", { alias: "file", describe: "Run clinker.", type: "string", demandOption: true })
 .argv;

let file = options.file;
const runner = spawn("node", [file]);

let greenFlag = chalk.greenBright(`[ clinker ]`);
let redFlag = chalk.redBright(`[ clinker ]`);

console.log(chalk`
${greenFlag} process ${chalk.yellow(file)} about to be run on ${chalk.yellow(os.hostname())}\n
CPU: {blueBright ${os.cpus()[0].model}%}
MEMORY: {blueBright ${Math.floor(os.freemem()/1000000)}} / ${Math.floor(os.totalmem()/1000000)} MB
UPTIME: {blueBright ${os.uptime()}} seconds
`);

runner.stdout.on("data", data => {
   console.log(`${greenFlag} ${chalk.yellow(`stdout`)}: ${data}`);
});

runner.stderr.on("data", data => {
    console.log(`${redFlag} ${chalk.yellow(`stderr`)}: ${data}`);
});

runner.on('error', (error) => {
    console.log(`${redFlag} ${chalk.yellow(`err`)}: ${error}`);
});

runner.on("close", code => {
    if(code === 0) console.log(`${greenFlag} process ${chalk.yellow(file)} exited with code ${code}`)
    else console.log(`${redFlag} process ${chalk.yellow(file)} exited with code ${code}`)
});