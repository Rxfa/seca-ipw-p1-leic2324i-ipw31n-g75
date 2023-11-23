import express from 'express'

import * as Api from "./web/api/seca-web-api.mjs"
import bodyParser from 'body-parser'
let app = express()

//app.use('/docs', swaggerUI)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/users', Api.insertUser)
app.get('/users', Api.listUsers)

app.get("/groups", Api.listGroups)
app.post("/groups", Api.createGroup)

app.listen(3000, () => console.log(`listening on port 3000`))