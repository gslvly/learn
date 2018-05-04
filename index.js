const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017')
mongoose.connection.once('open', _ => console.log(mongoose.connection.name))

const children = new mongoose.Schema({
  age: Number,
  name: String
})

const Schema1 = new mongoose.Schema({
  age: Number,
  name: String,
  text: String,
  arr: Array,
  // children,
})


const User = mongoose.model('test', Schema1)
User.update({}, {$addToSet:{arr: 'fgeer333'}}).then(console.log)
User.find({arr: {$in:['fgeer3']}}).then(console.log)


// User.create({
//   age: 22,
//   name: 'gss',
//   arr: [1]
// })

//   .then(res => console.log('ok', res))
//   .catch(console.error)
