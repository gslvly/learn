var AA = /** @class */ (function () {
    function AA(a, b) {
        this.a = a;
        this.b = b;
        console.log(a, b);
    }
    return AA;
}());
var a = new AA('b');
console.log(a);
// aa({ a: '2', b: 1 })
