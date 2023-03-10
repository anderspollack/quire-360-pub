## Transform to combine HTML output for PDF

The PDF module implements an [Eleventy `transform` function](https://www.11ty.dev/docs/config/#transforms) that prepares the static output for input to the [`Paged.js`](https://pagedjs.org) library. The HTML output from static rendering is output to a combined HTML file that is the input to the [`Paged.js`](https://pagedjs.org) commands.

## Reading the HTML output files

The transform function is called for each template, with the output HTML and output path as arguments, at the end of the build step before the individual page content is written to file on disk.

### Selecting the content

The transfrom uses the [`JSDOM` library](https://github.com/jsdom/jsdom) to create an HTML `document` from the rendered output and `querySelect` a `section` element that contains the content. The `section` containing the content is selected by the `data-ouput-path` attribute applied to the wrapping `section` element rendered by the [`base.11ty.js` layout](../_layouts/base.11ty.js).

Below is simplified example of the `content` argument passed to the transform function:

```HTML
<!DOCTYPE html>
<html>
  <head>
    <!-- omitted -->
  </head>
  <body>
    <header>
      <!-- omitted -->
    </header>
    <main>
      <nav>
        <!-- omitted -->
      </nav>
      <section data-output-path="example/page.html">
        <p>This is the combined output of the `content` directory template file and the applied layouts.</p>
      </section>
    </main>
    <footer>
      <!-- omitted -->
    </footer>
  </body>
</html>
```

## Writing the transformed output

For each file output by the build process a `<section>` element is written to the combined output file. Note that "templates are rendered in the order generated by the dependency graph" (see [Eleventy Order of Operation](https://www.11ty.dev/docs/advanced-order/#order-of-operations)), which
prevents the transform function from simply appending the HTML fragments to the combined output file. To ensure that content in the combined output file appears in the correct order the transform function must be aware of the computed page order.

### Insertion algorithm

A map of all `<section>` elements written to output file is maintained to allow quick lookup of parent and sibling sections.

For each `<section>` content fragment to be written to the output file its location is determined by comparing the value of its `data-ouput-path` with the computed page order and the current map of `<section>` elements written.

#### Computing content order

After selecting the `<section>` element by its `data-ouput-path` attribute the location of that content in looked up in the computed page order and the nearest siblings and ancestors is then found in the array of `<section>` elements already written to the combined output file.

#### Inserting the content

The `<section>` content fragment is written to the combined output file by calling `insertBefore` or `insertAfter` on the nearest ancestor `<section>` element.


## Exclude/include content from the publication PDF

### Pages [for editors]

Use the front-matter `outputs` key to define outputs, for example:

```yaml
outputs:
  - html
```

### Components [for developers]

*Not yet implemented*

Possible solutions:

- Add css classes for print only output. This is less ideal as the markup will be sent to Paged.js for parsing.

```html
<canvas-panel class="no-print" />
```

- Render both markup for *both* web and print, then remove any markup not for current output during Eleventy transform or from an after build hook.

```html
<canvas-panel data-outputs="html" />
<img data-outputs="pdf, ebub" />
```

- Render the static alternative and save the output as a string. When parsing the site output for tranform lookup and replace the component markup in `pdf.html` with the static version.

- Register an alternate component render function that will be called from the PDF transform; we may not have access to the component data at this point.

Can an Eleventy plugin add a `registerTransform` function to Eleventy?

`web-components/canvas-panel.js`
```javascript
eleventyConfig.registerTransform(id, transform)
```

```javascript
{
  'id1': (args) => { return '' }
  'id2': '<img src="" alt="" />'
}
```

## Open Questions

- What markup is required to correctly render sections, section headings (title, subtitle, et cetera)?

- What is the PDF standard for TOC markup?

- Can we pass the TOC JSON to the Paged.js API?

- How can we access the PDF page numbering?
  For example, were we to render the TOC Grid how might we get the PDF page number for each section so that it can be rendered below the section image?

