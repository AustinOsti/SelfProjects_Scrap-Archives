const fs = require('fs');
const archiveFolder = './extracts - ToConsolidate/';
const archivesPending = './extracts - ToUpload/archivedata';

let fileNames = [];
let archiveData = [];

//read in filenames of extracted results into an array
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

// using the array containing the filenames, consolidate the contents of each file into a JSON array
let retrieveFileContents = function(fileNames, archiveData) {
	return new Promise(function(resolve, reject) {	
		fileNames.forEach(function(fileName) {
			let fileToRetrieve = archiveFolder+fileName;
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
		d = new Date().getTime();		
		let saveFile = archivesPending + '_' + String(d) + '.txt';	
		fs.writeFile(saveFile, JSON.stringify(archiveData), function(err) {
			if (err) throw err;
		});	
		console.log(" Archive file " + saveFile + " created succesfully");		
		resolve(fileNames);
	});
};

// delete the extract(s) file from the extracts folder
let deleteExtractFiles = function(fileNames) {
	return new Promise(function(resolve, reject) {
		fileNames.forEach(function(fileName) {
			fileToDelete = archiveFolder+fileName;
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

var promise = retrieveFileNames(archiveFolder, fileNames);
promise.then(function(fileNames) {
	return retrieveFileContents(fileNames, archiveData);
})
.then(function(fileNames) {
	return deleteExtractFiles(fileNames);
})
.catch(function (err) {	
	console.log(err);
});
