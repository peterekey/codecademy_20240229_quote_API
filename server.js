const express = require('express');
const app = express();
app.use(express.json())


const PORT = process.env.PORT || 4001;
app.use(express.static('public'));

const quotesRouter = require('./server-quotes')
const bioRouter = require('./server-bios')

app.use('/api/quotes', quotesRouter)
app.use('/api/bios', bioRouter)

app.listen(PORT, () => console.log('Listening on 4001...'))