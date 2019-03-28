const fs = require('fs');
const cheerio = require('cheerio');

const archiveFile = 'extract.html';

// use fs to retrieve archived results stored in a local file as sample.html
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

// parse the HTML with Cheerio.js
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
					day: day.replace('Yesterday, 27 Mar', '27 Mar 2019').replace('Today, 28 Mar', '28 Mar 2019').trim(),
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

// write data into a file
let writeDataFile = function(spreadData) {
	return new Promise(function(resolve, reject) {
		d = new Date().getTime();
		fileName = String(spreadData[0].league).replace('/', '-');
		saveFile = './archives/archive_'+ fileName + '_' + String(d) + '.txt';
/*		
		const file = fs.createWriteStream(saveFile);		
		file.write(JSON.stringify(data));		
		file.end();		
*/		
		fs.writeFile(saveFile, JSON.stringify(spreadData), function(err) {
			if(err) {
				reject(err);
			}
		});		
		console.log(String(spreadData[0].league) + " Done!");
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
