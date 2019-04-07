const fs = require('fs');
const cheerio = require('cheerio');

const extractsFolder = './extracts/';
const extractsToConsolidate = './extracts - ToConsolidate/';

const date = new Date();
const formattedDate = date.toLocaleDateString('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric'
}).replace(/ /g, ' ');
//console.log(formattedDate);

let fileNamesAll = [];

let fileNames = [
	{
		fileName: '20190301.html',
		date: '01 Mar 2019'
	},
	{
		fileName: '20190302.html',
		date: '02 Mar 2019'
	},
	{
		fileName: '20190303.html',
		date: '03 Mar 2019'
	},
	{
		fileName: '20190304.html',
		date: '04 Mar 2019'
	},
	{
		fileName: '20190305.html',
		date: '05 Mar 2019'
	},
	{
		fileName: '20190306.html',
		date: '06 Mar 2019'
	},
	{
		fileName: '20190307.html',
		date: '07 Mar 2019'
	},
	{
		fileName: '20190308.html',
		date: '08 Mar 2019'
	},
	{
		fileName: '20190309.html',
		date: '09 Mar 2019'
	},
	{
		fileName: '20190310.html',
		date: '10 Mar 2019'
	},
	{
		fileName: '20190311.html',
		date: '11 Mar 2019'
	},
	{
		fileName: '20190312.html',
		date: '12 Mar 2019'
	},
	{
		fileName: '20190313.html',
		date: '13 Mar 2019'
	},
	{
		fileName: '20190314.html',
		date: '14 Mar 2019'
	},
	{
		fileName: '20190315.html',
		date: '15 Mar 2019'
	},
	{
		fileName: '20190316.html',
		date: '16 Mar 2019'
	},
	{
		fileName: '20190317.html',
		date: '17 Mar 2019'
	},
	{
		fileName: '20190318.html',
		date: '18 Mar 2019'
	},
	{
		fileName: '20190319.html',
		date: '19 Mar 2019'
	},
	{
		fileName: '20190320.html',
		date: '20 Mar 2019'
	},
	{
		fileName: '20190321.html',
		date: '21 Mar 2019'
	},
	{
		fileName: '20190322.html',
		date: '22 Mar 2019'
	},
	{
		fileName: '20190323.html',
		date: '23 Mar 2019'
	},
	{
		fileName: '20190324.html',
		date: '24 Mar 2019'
	},
	{
		fileName: '20190325.html',
		date: '25 Mar 2019'
	},
	{
		fileName: '20190326.html',
		date: '26 Mar 2019'
	},
	{
		fileName: '20190327.html',
		date: '27 Mar 2019'
	},
	{
		fileName: '20190328.html',
		date: '28 Mar 2019'
	},
	{
		fileName: '20190329.html',
		date: '29 Mar 2019'
	},
	{
		fileName: '20190330.html',
		date: '30 Mar 2019'
	},
	{
		fileName: '20190331.html',
		date: '31 Mar 2019'
	},
	{
		fileName: '20190401.html',
		date: '01 Apr 2019'
	},
	{
		fileName: '20190402.html',
		date: '02 Apr 2019'
	},
	{
		fileName: '20190403.html',
		date: '03 Apr 2019'
	},
	{
		fileName: '20190404.html',
		date: '04 Apr 2019'
	},
	{
		fileName: '20190405.html',
		date: '05 Apr 2019'
	},
	{
		fileName: '20190406.html',
		date: '06 Apr 2019'
	}
];

// extract the 'results' data from the saved webpage(s) and store in 'archives - ToConsolidate' folder
let processFileContents = function(fileNames) {
	return new Promise(function(resolve, reject) {
		fileNames.forEach(function(fileName) {
			let fileToRetrieve = './extracts/'+fileName.fileName;			
			let dateValue = fileName.date;

			fs.readFile(fileToRetrieve, 'utf-8', function(err, data) {
				if (err) {
					reject(err);
				}				
				htmlData = [];
				const $ = cheerio.load(data);
				$('table.table-main tr')
				.each(function(i, elem){
					let fld_1 = $(elem).children("td:nth-child(1)").text().trim();
					let fixture = $(this).find("th.first2").text();
					if (fixture.length > 0) {
						league = fixture;
					}
					results = $(elem).children("td:nth-child(3)").text().trim();
					if (fld_1.length > 0 && results.length > 0) {
						if ($(elem).children("td").length > 6) {
							results = results,	
							odds_1 = $(elem).children("td:nth-child(4)").text(),
							odds_X = $(elem).children("td:nth-child(5)").text(),
							odds_2 = $(elem).children("td:nth-child(6)").text()							
						} else {
							results = "",	
							odds_1 = $(elem).children("td:nth-child(3)").text(),
							odds_X = $(elem).children("td:nth-child(4)").text(),
							odds_2 = $(elem).children("td:nth-child(5)").text()								
						}
						htmlData.push({
							league: league.trim(),
							day: dateValue,
							time: fld_1,	
							game: $(elem).children("td:nth-child(2)").text().replace(' - ', ' vs ').replace('-', ' ').replace('.-', ' ').replace(' vs ', '-').trim(),	
							results: results.trim(),	
							odds_1: odds_1.trim(),
							odds_X: odds_X.trim(),
							odds_2: odds_2.trim()				
						});				
					}	
				});
				const fileDate = new Date();
				saveFile = extractsToConsolidate + 'Bets_' + String(fileDate.getTime()) + '.txt';	
				fs.writeFile(saveFile, JSON.stringify(htmlData), function(err) {
					if(err) {
						reject(err);
					}
				});		
				console.log(saveFile + " Done!");					
			});
		});
		resolve(fileNames);
	});
}

// delete the extract(s) file from the extracts folder
let deleteExtractFiles = function(fileNames) {
	return new Promise(function(resolve, reject) {
		fileNames.forEach(function(fileName) {
			let fileToDelete = extractsFolder + fileName;
			fs.unlink(fileToDelete, function (err) {
				if (err) {
					reject(err);
				}
				console.log(fileName +' deleted!');
			}); 				
		});	
		resolve();
	});	
}

let deleteFolderRecursive = function(path) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function(file, index){
			var curPath = path + "/" + file;
			if (fs.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}		
};

let deleteExtractFolders = function () {
	return new Promise(function(resolve, reject) {
		fileNamesAll.forEach(function(file) {
			let subfolder = extractsFolder+file;
			deleteFolderRecursive(subfolder);		
		});
		resolve();
	});	
};

var promise = processFileContents(fileNames);
promise.then(function(fileNames) {
	return deleteExtractFiles(fileNames);
})
.then(function() {
	return deleteExtractFolders();
})
.catch(function (err) {	
	console.log(err);
});
