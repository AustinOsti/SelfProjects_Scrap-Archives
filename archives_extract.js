const fs = require('fs');
const cheerio = require('cheerio');

const extractsFolder = './extracts/';
const extractsToConsolidate = './extracts - ToConsolidate/';

let fileNames = [];
let fileNamesAll = [];
let archiveData = [];

//read in filenames of saved webpage(s) into an array
let retrieveFileNames = function(extractsFolder, fileNames) {
	return new Promise(function(resolve, reject) {
		fs.readdir(extractsFolder, function(err, files) {
			if (err) {
				reject(err);
			}
			files.forEach(function(file) {
				if(file.indexOf(".html")>-1) {
					fileNames.push(file);
				} else {
					fileNamesAll.push(file);
				}		
			});
			resolve(fileNames);			
		});
	});
};

// extract the 'results' data from the saved webpage(s) and store in 'archives - ToConsolidate' folder
let processFileContents = function(fileNames, archiveData) {
	return new Promise(function(resolve, reject) {			
		fileNames.forEach(function(fileName) {
			let fileToRetrieve = './extracts/'+fileName;

			fs.readFile(fileToRetrieve, 'utf-8', function(err, data) {
				if (err) {
					reject(err);
				}
				
				htmlData = [];	
				headings = [];
				const $ = cheerio.load(data);
				$('table.table-main tr')
				.each(function(i, elem){
					let fld_1 = $(elem).children("td:nth-child(1)").text().trim();
					let fixture = $(this).find("th.first2").text();
					if (fixture.length > 0) {
						day = fixture;
						headings.push(day);
					}
					results = $(elem).children("td:nth-child(3)").text().trim();
					if (fld_1.length > 0 && results.length > 0) {
						htmlData.push({
							league: headings[0].replace('Soccer» ', '').trim(),
							day: day.replace('Yesterday, 31 Mar', '31 Mar 2019').replace('Today, 1 Apr', '1 Apr 2019').trim(),
							time: fld_1,	
							game: $(elem).children("td:nth-child(2)").text().replace(' - ', '-').trim(),	
							results: results.trim(),	
							odds_1: $(elem).children("td:nth-child(4)").text().trim(),
							odds_X: $(elem).children("td:nth-child(5)").text().trim(),
							odds_2: $(elem).children("td:nth-child(6)").text().trim()				
						});				
					}	
				});
				
				d = new Date().getTime();
				fileName = String(htmlData[0].league).replace('/', '-');
				saveFile = extractsToConsolidate + fileName + '_' + String(d) + '.txt';	
				fs.writeFile(saveFile, JSON.stringify(htmlData), function(err) {
					if(err) {
						reject(err);
					}
				});						
				console.log(String(htmlData[0].league) + " Done!");					
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

var promise = retrieveFileNames(extractsFolder, fileNames);
promise.then(function(fileNames) {
	return processFileContents(fileNames, archiveData);
})
.then(function(fileNames) {
	return deleteExtractFiles(fileNames);
})
.then(function() {
	return deleteExtractFolders();
})
.catch(function (err) {	
	console.log(err);
});
