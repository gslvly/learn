const jwt = require('jsonwebtoken')

var token = jwt.sign({ foo: 'bar' }, 'ff', {
  expiresIn: 2 // s作为单位
})

let expiresIn

setTimeout(() => {
  var token2 = jwt.sign({ foo: 'bar' }, 'ff', {
    // expiresIn: 2 // s作为单位
    expiresIn
  })
  
  console.log(token2 === token)
},3000);
