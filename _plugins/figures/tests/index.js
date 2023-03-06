require('module-alias/register')
const test = require('node:test')
const assert = require('assert/strict')
// const { add, subtract, multiply, divide, power } = require('./index')
const figuresData = require('./__fixtures__/figures/index.js')
const iiifConfig = require('./__fixtures__/iiifConfig.json')

const Figure = require('../figure')
const processImage
const figures = Object
  .keys(figuresData)
  .map((figureData) => {
    return new Figure(iiifConfig, processImage, figureData)
  })
// const figure = new Figure(iiifConfig)

// - mock `processImage`
// https://presentation-validator.iiif.io/validate?version=2.1&url=manifest-url-here
// create new figure factory?

test('synchronous passing test', (t) => {
  assert.strictEqual(1, figures)
})

