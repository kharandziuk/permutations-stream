const log = require('debug')('app')
const _ = require('lodash')
const assert  = require('assert')
const {expect} = require('chai')
const Promise = require('bluebird')
const H = require('highland')
const {Readable} = require('stream')

function countStream(end = Infinity) {
  let counter = 0
  return H(function(push, next) {
    if (counter === end) {
      push(null, H.nil)
    } else {
      push(null, counter)
      counter += 1
      next()
    }
  })
}

function permutationsLevel(level, space) {
  log('permutationsLevel', level, space, Math.pow(level, space.length))
  let mask = _.fill(Array(level), 0)
  return countStream(
    Math.pow(space.length, level) - 1
  ).scan(
    mask,
    mask => add1(mask, space.length)
  )
  .map(mask =>
    _.map(
      mask,
      i => space[i]
    )
  )
}

function permutations(levels, space) {
  return countStream(levels)
    .map(x => x + 1)
    .flatMap(i => permutationsLevel(i, space))
}


function add1(mask, base) {
  mask = mask.slice()
  for(let i = 0; i < mask.length; i++) {
    mask[i] += 1
    assert(mask[i] <= base)
    if (mask[i] === base) {
      mask[i] = 0
    } else {
      break
    }
  }
  return mask
}

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

  it('', function() {
    return streamToPromise(
      permutations(Infinity, 'abcdefghij').map(x => x.join('')).drop(100000).take(1)
    ).then(function(res) {
      expect(res).eql(['ajiii'])
    })
  })
})
