const express = require('express');
const http = require('http');

const app = express();
app.use(express.static(__dirname))
app.listen(3000, () => {

});
