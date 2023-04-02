const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

const port = process.env.PORT || 80;
app.listen(port);

console.log('App is launck : OK ');


process.on('SIGTERM', async () => {
    await app.close(() => {
        console.log('App closed');
    })
    process.exit(0);
})