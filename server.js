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

const createUser = (req) => {
  return {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    state: req.body.state
  }
}

app.post('/users', (req, res) => {
  let data = getStorage()
  let user = createUser(req)
  let bodyId = req.body.id
  let idCheck = data.filter((obj) => obj.id == bodyId)
  idCheck.length === 0 ? data.push(user) : console.log('duplicate id');
  writeStorage(data)
  idCheck.length === 0 ? res.json('User entered') : res.json('Duplicate ID entered')
})

app.get('/users', (req, res) => {
  res.json(getStorage())
})

app.get('/users/:id', (req, res) => {
  res.json(getUser(req))
})

app.put('/users/:id', (req, res) => {
  let data = getStorage();
  let paramId = req.params.id
  let user = {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    state: req.body.state
  }
  let bodyId = req.body.id
  let idCheck = data.filter((obj) => obj.id == bodyId)

  if (idCheck.length === 0 || paramId == bodyId) {
    data.map((obj) => {
      if (obj.id == paramId) {
        data[data.indexOf(obj)] = user
      }
    })
  }
  writeStorage(data)
  if (idCheck.length === 0 || paramId == bodyId) {
    res.json('User updated')
  } else {
    res.json('Duplicate ID entered')
  }
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
