const _ = require('lodash')
const Promise = require('bluebird')
const { expect } = require('chai')
const { add1, permutationsLevel, permutations } = require('../index')


describe('add1', function() {
  it('simple', function() {
    expect(
      add1([0], 2)
    ).eql([1])
  })

  it('move', function() {
    expect(
      add1([1, 0], 2)
    ).eql([0, 1])
  })
})

function streamToPromise(stream) {
  return Promise.fromCallback(cb =>
    stream.collect().toCallback(cb)
  )
}

describe('permutationsLevel', function() {
  it('length 3 of set [a]', function() {
      return streamToPromise(
        permutationsLevel(1, 'a').map(x => x.join(''))
      ).then(function(res) {
        expect(res).eql(['a'])
      })
  })

  it('length 3 of set [a]', function() {
    return streamToPromise(
      permutationsLevel(3, 'a').map(x => x.join(''))
    ).then(function(res) {
      expect(res).eql(['aaa'])
    })
  })

  it('length 1 of set [a, b]', function() {
    return streamToPromise(
      permutationsLevel(1, 'ab').map(x => x.join(''))
    ).then(function(res) {
      expect(res).eql(['a', 'b'])
    })
  })

  it('length 2 of set [a, b]', function() {
    return streamToPromise(
      permutationsLevel(2, 'ab').map(x => x.join(''))
    ).then(function(res) {
      expect(res).eql(['aa', 'ba', 'ab', 'bb'])
    })
  })
})

describe('permutations', function() {
  it('length 3 of set [a]', function() {
    return streamToPromise(
      permutations(3, 'a').map(x => x.join(''))
    ).then(function(res) {
      expect(res).eql(['a', 'aa', 'aaa'])
    })
  })

  it('length 2 of set [ab]', function() {
    return streamToPromise(
      permutations(2, 'ab').map(x => x.join(''))
    ).then(function(res) {
      expect(res).eql(['a', 'b', 'aa', 'ba', 'ab', 'bb'])
    })
  })

  it('take 1000001th element', function() {
    return streamToPromise(
      permutations(Infinity, 'abcdefghij').map(x => x.join('')).drop(100000).take(1)
    ).then(function(res) {
      expect(res).eql(['ajiii'])
    })
  })
})
