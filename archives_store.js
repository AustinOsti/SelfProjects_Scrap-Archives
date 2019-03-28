const fs = require('fs');
const archiveFolder = './archives/';

let fileNames = [];
let archiveData = [];

//read in filenames into an array
let retrieveFileNames = function(archiveFolder, fileNames) {
	return new Promise(function(resolve, reject) {		
		fs.readdir(archiveFolder, function(err, files) {
			if (err) {
				reject(err);
			}
			files.forEach(function(file) {
				fileNames.push(file);
			});
			resolve(fileNames);			
		});
	});
};

// using the array containing the filenames, read the contents of each file into a JSON array
let retrieveFileContents = function(fileNames, archiveData) {
	return new Promise(function(resolve, reject) {	
		fileNames.forEach(function(fileName) {
			let fileToRetrieve = './archives/'+fileName;
			let contents = JSON.parse(fs.readFileSync(fileToRetrieve, 'utf8'));
			// use function below to remove nested arrays ....
			Array.prototype.extend = function (other_array) {
				if (Array.isArray(other_array)) {
					other_array.forEach(function(v) {
						this.push(v)}, this);			
				} else {
					return this;
				}  
			};
			
			archiveData.extend(contents);					
		});
		resolve(archiveData);
	});
};

//write data to mongoDB db ... to be completed later ...
let storeArchiveData = function(archiveData) {
	return new Promise(function(resolve, reject) {
		console.log(archiveData);
		resolve();
	});		
};

// write data into a txt file
let writeDataFile = function(archiveData) {
	return new Promise(function(resolve, reject) {
		storeData = [];
		d = new Date().getTime();
		
		saveFile = './archives/archivedata'+ '_' + String(d) + '.txt';	
		fs.writeFile(saveFile, JSON.stringify(archiveData), function(err) {
			if(err) {
				reject(err);
			}
		});	
		console.log(" Archive file " + saveFile + " created succesfully");
		resolve();
	});	
}

var promise = retrieveFileNames(archiveFolder, fileNames);
promise.then(function(fileNames) {
	return retrieveFileContents(fileNames, archiveData);
})			
.then(function(archiveData) {
	return writeDataFile(archiveData);
})
.catch(function (err) {	
	console.log(err);
});
