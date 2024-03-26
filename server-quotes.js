const express = require('express')

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const quotesRouter = express.Router()

module.exports = quotesRouter

quotesRouter.get('/random', (req, res, next) => {
    const quoteToSend = getRandomElement(quotes)
    res.send({quote: quoteToSend})
})

quotesRouter.get('/', (req, res, next) => {
    const quoteQuery = req.query
    if(Object.keys(quoteQuery).length !== 0) {
        const allQuotesFromPerson = quotes.filter(quote => quote.person === quoteQuery.person)
        res.send({quotes: allQuotesFromPerson})
    } else {
        res.send({quotes})
    }
})

quotesRouter.post('/', (req, res, next) => {
    const {person, quote, year} = req.query
    if (person && quote && year) {
        const lastItemInArray = quotes[quotes.length - 1]
        const lastIDInArray = lastItemInArray.id
        const quoteToAdd = {
            quote: {
                id: lastIDInArray + 1,
                quote: quote,
                person: person,
                year: year
            }
        }
        quotes.push(quoteToAdd.quote)
        res.status(201).send(quoteToAdd)
    } else {
        res.status(400).send()
    }
})

quotesRouter.put('/:id', (req, res, next) => {
    const {id} = req.params
    const quoteToUpdate = quotes.find(quote => quote.id === Number(id))
    if (quoteToUpdate) {
        quoteToUpdate.quote = req.body.quote
        quoteToUpdate.person = req.body.person
        quoteToUpdate.year = req.body.year
        res.send(quoteToUpdate)
    } else {
        res.status(404).send({message: "Quote not found"})
    }
})

quotesRouter.delete('/:id', (req, res, next) => {
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