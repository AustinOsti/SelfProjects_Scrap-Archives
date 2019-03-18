const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const archiveFile = 'sample.html';

//* option 1 - use fs to retrieve archived results stored an a local file as sample.html
let extractData = function(archiveFile) {
	return new Promise(function(resolve, reject) {		
		fs.readFile(archiveFile, 'utf-8', function(err, data) {
			if (err) {
				reject(err);
			}		
			resolve(data);
		});	
	});
}

//parse the HTML with Cheerio.js
let getData = function(html){
	return new Promise(function(resolve, reject) {		
		data = [];	
		headings = [];
		const $ = cheerio.load(html);
		$('table.table-main tr')
		.each(function(i, elem){
			let fld_1 = $(elem).children("td:nth-child(1)").text().trim();
			let fixture = $(this).find("th.first2").text();
			if (fixture.length > 0) {
				day = fixture;
//				Object.freeze(fixture);
				headings.push(day);
			}
			results = $(elem).children("td:nth-child(3)").text().trim();
			if (fld_1.length > 0 && results.length > 0) {
				data.push({
					league: headings[0].replace('Soccer» ', '').trim(),
					day: day.replace('Yesterday, 17 Mar', '17 Mar 2019').trim(),
					time: fld_1,	
					game: $(elem).children("td:nth-child(2)").text().replace(' - ', '-').trim(),	
					results: results.trim(),	
					odds_1: $(elem).children("td:nth-child(4)").text().trim(),
					odds_X: $(elem).children("td:nth-child(5)").text().trim(),
					odds_2: $(elem).children("td:nth-child(6)").text().trim()				
				});
			}	
		});
		resolve(data);
	});
}

let writeDataFile = function(spreadData) {
	return new Promise(function(resolve, reject) {
		d = new Date().getTime();
		let saveFile = './archives/archive_'+ String(spreadData[0].league) + '_' + String(d)+ '.txt';
		const file = fs.createWriteStream(saveFile);
		
		file.write(JSON.stringify(data));
		file.end();		
		console.log(String(spreadData[0].league) + " Done!");
	});	
}

let deleteDataFile = function(fileToDelete) {
	return new Promise(function(resolve, reject) {	
		fs.unlink(fileToDelete, function (err) {
			if (err) throw err;
			// if no error, file has been deleted successfully
			console.log('Sample file deleted & process complete!');
		});	
		resolve();
	});
}

var promise = extractData(archiveFile);
promise.then(function(data) {
	return getData(data);
})			
.then(function(spreadData) {
	return writeDataFile(spreadData);
})
.catch(function (err) {	
	console.log(err);
});

/* option2 - for current results, use axios to retrive results ... under WIP ...
axios.get(url)
.then(function(response){
	d = new Date();
	getData(response.data, d);
//	console.log(response.data);	
})
.catch(function(error){
	console.log(error);
}); 
*/


