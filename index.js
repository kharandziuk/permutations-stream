const log = require('debug')('app')
const _ = require('lodash')
const assert  = require('assert')
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

module.exports = { add1, permutationsLevel, permutations }
