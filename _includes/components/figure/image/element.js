/**
 * Renders an image
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Object}  figure          The figure object
 *
 * @return     {String}  An HTML <img> element, `<canvas-panel>` or `<image-service>` web components
 */
module.exports = function (eleventyConfig) {
  const canvasPanel = eleventyConfig.getFilter('canvasPanel')
  const imageService = eleventyConfig.getFilter('imageService')
  const sequencePanel = eleventyConfig.getFilter('sequencePanel')
  const imageTag = eleventyConfig.getFilter('imageTag')
  const { imageDir } = eleventyConfig.globalData.config.figures

  return function (figure) {
    const { isCanvas, isImageService, isSequence } = figure

    switch (true) {
      case isSequence:
        return sequencePanel(figure)
      case isCanvas:
        return canvasPanel(figure)
      case isImageService:
        return imageService(figure)
      default:
        return imageTag(figure)
    }
  }
}
