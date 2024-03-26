const express = require("express")

const { bios } = require("./data-bios")

const bioRouter = express.Router()

module.exports = bioRouter;

bioRouter.get('/', (req, res, next) => {
    const { person } = req.query
    if (person) {
        const bio = bios.find(item => item.person === person)
        if (bio) {
            res.send(bio)
        } else {
            res.send(`No biography found for ${person}`)
        }
    } else {
        res.status(400).send()
    }
})