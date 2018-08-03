const express = require('express')
const app = express();
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
let port = process.env.PORT || 8000

app.use(bodyParser.json())

const getStorage = () => {
  return JSON.parse(fs.readFileSync(path.join(`${__dirname}`, 'storage.json'), 'utf8'))
}

const writeStorage = (data) => {
  fs.writeFileSync(path.join(`${__dirname}`, 'storage.json'), JSON.stringify(data))
}

const getUser = (req) => {
  let data = getStorage()
  let paramId = req.params.id
  return data.filter((obj) => obj.id == paramId)
}

app.post('/users', (req, res) => {
  let data = getStorage()
  let user = {
    id: data.length+1,
    name: req.body.name,
    email: req.body.email,
    state: req.body.state
  }
  data.push(user)
  writeStorage(data)
  res.json('User entered')
})

app.get('/users', (req, res) => {
  res.json(getStorage())
})

app.get('/users/:id', (req, res) => {
  let data = getUser(req)
  data.length > 0 ? res.json(data) : res.sendStatus(404)
})

app.put('/users/:id', (req, res) => {
  let data = getStorage()
  let paramId = req.params.id
  let user = {
    id: paramId,
    name: req.body.name,
    email: req.body.email,
    state: req.body.state
  }
  data[paramId-1] = user
  writeStorage(data)
  res.json('User updated')
})

app.delete('/users/:id', (req, res) => {
  let data = getStorage()
  let paramId = req.params.id
  data = data.filter((obj) => obj.id != paramId)
  writeStorage(data)
  res.json('User deleted')
})


app.listen(port, () => {
  console.log('Listening on port', port)
})
