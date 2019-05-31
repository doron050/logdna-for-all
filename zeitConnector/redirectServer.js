const {parse} = require('url');


module.exports = (req, res) => {
    const {query} = parse(req.url, true);
    const {name = 'World'} = query;
    res.end(`Hello ${name}!`);
};