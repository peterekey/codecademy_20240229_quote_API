const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;
app.use(express.static('public'));

app.get('/api/quotes/random', (req, res, next) => {
    const quoteToSend = getRandomElement(quotes)
    res.send({quote: quoteToSend})
})

app.get('/api/quotes', (req, res, next) => {
    const quoteQuery = req.query
    if(Object.keys(quoteQuery).length !== 0) {
        const allQuotesFromPerson = quotes.filter(quote => quote.person === quoteQuery.person)
        res.send({quotes: allQuotesFromPerson})
    } else {
        res.send({quotes})
    }
})

app.post('/api/quotes/', (req, res, next) => {
    const {person, quote} = req.query
    if (person && quote) {
        const quoteToAdd = {
            quote: {
                quote: quote,
                person: person
            }
        }
        res.status(201).send(quoteToAdd)
    } else {
        res.status(400).send()
    }
})

app.listen(PORT, () => console.log('Listening on 4001...'))