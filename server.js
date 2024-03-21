const express = require('express');
const app = express();
app.use(express.json())

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

app.post('/api/quotes', (req, res, next) => {
    const {person, quote} = req.query
    if (person && quote) {
        const lastItemInArray = quotes[quotes.length - 1]
        const lastIDInArray = lastItemInArray.id
        const quoteToAdd = {
            quote: {
                id: lastIDInArray + 1,
                quote: quote,
                person: person
            }
        }
        quotes.push(quoteToAdd.quote)
        res.status(201).send(quoteToAdd)
    } else {
        res.status(400).send()
    }
})

app.put('/api/quotes/:id', (req, res, next) => {
    const {id} = req.params
    const quoteToUpdate = quotes.find(quote => quote.id === Number(id))
    if (quoteToUpdate) {
        quoteToUpdate.quote = req.body.quote
        quoteToUpdate.person = req.body.person
        res.send(quoteToUpdate)
    } else {
        res.status(404).send({message: "Quote not found"})
    }
})

app.delete('/api/quotes/:id', (req, res, next) => {
    const {id} = req.params
    const index = quotes.findIndex(quote => quote.id === Number(id))
    if (index !== -1) {
        quotes.splice(index, 1)
        res.status(204).send()
    } else {
        console.log('did not find')
        res.status(404).send()
    }
})

app.listen(PORT, () => console.log('Listening on 4001...'))