#!/usr/bin/env node

let holiYear = new Date().getFullYear();
const api = "https://date.nager.at/api/v2/publicholidays/";
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const error = chalk.bold.red;
import ora from 'ora';
import validator from 'validator';
import axios from 'axios';
import chalk from 'chalk';
import figlet from 'figlet';
import { getCode } from 'country-list';

process.argv.forEach((val, index) => {
	const spinner = ora('Loading country values ').start();
	if (val.charAt(0) != "/") {
		if (validator.isInt(val) && val.length == 4) {
			if(val < new Date().getFullYear() + 20 && val > new Date().getFullYear() - 50)
			{
				holiYear = val;

			} 
			else 
			{	
				console.log(error("Year entered is not in the available scope. Using current year instead."));
			}
		}
		else if (validator.isAlpha(val)) {

			let code = getCode(val);

			if (code == undefined) 
			{
				spinner.fail("Error. Country name not correctly spelled. Any country code found.")
			} 
			else
			{
				figlet('myOwn', {
					font: 'Fender',
					horizontalLayout: 'default',
					verticalLayout: 'default'
				}, function (err, data) {
					if (err) {
						console.log('Something went wrong...');
						console.error(err);
						return;
					}

					console.log(chalk.bold.green(data))
				})
				console.log(chalk.bgBlack(`Here is the official public Holidays dates for ${val} in ${holiYear}`));	
				let holidays = axios.get(`${api}${holiYear}/${code}`)
					.then(response => {
						spinner.succeed();
						response.data.forEach(day => {
							let fixed = "";
							if (day.fixed) {
								fixed = "It's a fixed date."
							} else {
								fixed = "It's a variable date."
							}
							let dateHol = new Date(day.date);
							console.log(chalk.bold.bgBlack.greenBright(`-- ${days[dateHol.getDay()]} ${dateHol.getDate()} ${months[dateHol.getMonth()]} ${dateHol.getFullYear()} --`),chalk.bold.red(day.localName) + ` AKA ${chalk.bold.yellow(day.name)}. ${fixed}`);
						})
					}).catch(error => {
						console.error(error);
					})
			}

		}
		spinner.stop();
	}
});