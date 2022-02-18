
interface Person {
  a: string,
  b: number,
}
class AA{
  f: string
  constructor(public a,public b?){
    console.log(a, b)
  }
}
let a = new AA('b')
console.log(a)
// aa({ a: '2', b: 1 })