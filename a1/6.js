import assert from "assert";

function Spy(target, method){
    let spy = {
        count: 0
    };
    
    const func = target[method]

    target[method] = function(...args){
        spy.count++
        return func.apply(this, args)
    }

    return spy;
}

var spy1 = Spy(console, 'log')
console.log('calling console.error')

var spy2 = Spy(console, 'warn')

var spy3 = Spy(console, 'error')
console.error('calling console.error')
console.error('calling console.error')
console.error('calling console.error')

//  console.log(spy.count) // 3

assert.deepEqual(spy1.count, 1)
assert.deepEqual(spy2.count, 0)
assert.deepEqual(spy3.count, 3)
