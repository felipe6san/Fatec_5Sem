const express = require('express')
const cors = require('cors')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const port = 3000
const app = express()

app.use(cors())

app.use(methodOverride('X-HTTP-Method'))
app.use(methodOverride('X-HTTP-Method-Override'))
app.use(methodOverride('X-Method-Override'))
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send({ status: 'Ok' })
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta http://localhost:${port}`)
})

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
}