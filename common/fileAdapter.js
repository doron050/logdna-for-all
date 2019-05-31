var fs = require("fs");
const util = require('util');

const readFile = util.promisify(fs.readFile);

async function write(fileName, data) {
    return await fs.writeFile(fileName, data, (err) => {
        if (err) return false;
        return true;
    });
}

async function read(fileName) {
    return await readFile(fileName);
}

module.export = {
    write,
    read
}