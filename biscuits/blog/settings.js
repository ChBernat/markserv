module.exports = {

  "name": "My Blog",

  // "heroimage": "#",


  // Setting an index will... [EXPLAIN!]
  "index": "partials/index.html",

  // Processors read file-includes in HTML Templates and
  // pass back HTML content used to build the template.
  // The HTML templates are then passed to the module to
  // be used by Handlebars to render the content though
  // the module when the HTTP request is served.



  "processors": {
    "html": "processors/html.processor.js",
    "less": "processors/less.processor.js",
    "svg": "processors/svg.processor.js",
  },

  // Modules for rendering HTTP content into HTML Templates
  // All HTTP Requests ate served through relevant modules.

  "map": {

    // Turn off directory listings
    "directory": {
      "module": "mods/dir.js",
      "template": "mods/dir.html"
    },

    // "markdown": {
    //   "module": "mods/markdown.js",
    //   "template": "mods/markdown.html"
    // },

    "http404": {
      "module": "mods/http-404.js",
      "template": "mods/http-404.html"
    },

    "file": {
      "module": "mods/file.js"
    },

    // Custom post handler
    // Relative to this settings file
    "**/posts/*.md": {
      "module": "mods/markdown-post.js",
      "template": "mods/markdown-post.html"
    }

  },



  "watch": [
    ".less",
    ".js",
    ".css",
    ".html",
    ".htm",
    ".json",
    ".gif",
    ".png",
    ".jpg",
    ".jpeg"
  ],

};
