const {
	withUiHook,
	htm
} = require('@zeit/integration-utils');

let count = 0;

var fs = require("fs");
const util = require('util');

const readFile = util.promisify(fs.readFile);

async function write() {
	return await fs.writeFile('asynchronous.txt', 'asynchronous write!', (err) => {
		if (err) throw err;
		console.log('The file has been saved!');
	});
}

async function read() {
	return await readFile("asynchronous.txt");
}

module.exports = withUiHook(async ({
	payload
}) => {


	await write();

	const bla = await read();
	console.log(bla.toString());

	count += 1;
	return htm `
		<Page>
		<P>Counter: ${count}</P>
			<Button>Count Me</Button>
		</Page>
	`
});