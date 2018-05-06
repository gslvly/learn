const mongoose = require('mongoose')
,Schema = mongoose.Schema
mongoose.connect('mongodb://127.0.0.1:27017')
mongoose
  .connection
  .once('open', _ => console.log(mongoose.connection.name))

const store =  Schema({
  // ref: {type: Schema.Types.ObjectId, ref: 'test'},
  name: String
})
store.virtual('linkto', {
  ref: 'tests',
  localField: 'name',
  foreignField: 'name',
})

const Schema1 = Schema({
  age: Number,
  name: String,
  text: String,
  arr: Array,
  // children,
})

const User = mongoose.model('tests', Schema1)
const Store = mongoose.model('refs', store)

// Schema1.pre('update', function (...a) {
//   console.log('update')
// })
// User.create({name: 'gg', age: 10}).then(res => {

//   return Store.create({name: 'gg'})
// })

// .catch(console.error)
Store.find({ name: 'gg' }).populate('linkto').then(res => console.log(res))
// require('./text.js')

// User.update({name: 'gss'}, { $set: { text: '5' } }).then(console.log)


// User.remove({name:'gs'}).then(res => console.log('remove', res))
// User.find({name: 'gss'}).then(console.log)


// User.create({
//   age: 22,
//   name: 'gss',
//   arr: [1]
// })

//   .then(res => console.log('ok', res))
//   .catch(console.error)
