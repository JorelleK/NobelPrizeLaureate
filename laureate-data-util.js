var fs = require('fs');

function restoreOriginalData() {
    fs.writeFileSync('laurreate.json', fs.readFileSync('laureate_original.json'));
}

function loadData() {
    return JSON.parse(fs.readFileSync('laureate.json'));
}

function saveData(data) {
	// poke.json stores the pokemon array under key "pokemon",
	// so we are recreating the same structure with this object
	var obj = {
		laureates: data
	};

	fs.writeFileSync('laureate.json', JSON.stringify(obj));
}

module.exports = {
    restoreOriginalData: restoreOriginalData,
    loadData: loadData,
    saveData: saveData,
}
