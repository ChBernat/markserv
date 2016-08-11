module.exports = {

  "name": "My Blog",

  // "heroimage": "#",

  // Processors read file-includes in HTML Templates and
  // pass back HTML content used to build the template.
  // The HTML templates are then passed to the module to
  // be used by Handlebars to render the content though
  // the module when the HTTP request is served.

  // "index": "templates/index.html",

  "processors": {
    "html": "processors/html.processor.js",
    "less": "processors/less.processor.js",
    "svg": "processors/svg.processor.js",
  },

  // Modules for rendering HTTP content into HTML Templates
  // All HTTP Requests ate served through relevant modules.

  "map": {


    "directory": {
      "module": "mods/dir.js",
      "template": "mods/dir.html"
    },

    "markdown": {
      "module": "mods/markdown.js",
      "template": "mods/markdown.html"
    },

    "http404": {
      "module": "mods/http-404.js",
      "template": "mods/http-404.html"
    },

    "file": {
      "module": "mods/file.js"
    },

    // // Custom Less Processor
    // "**/github.less": {
    //   "module": "mods/less.js",
    // }

    // Custom JSON Handler
    // "*.json": {
    //   "module": "mods/json.js",
    //   "template": "mods/json.html"
    // }

    // Custom post handler
    // Relative to this settings file
    // "**/posts/*.md": {
    //   "module": "mods/custom-post-handler.js",
    //   "template": "mods/custom-post-handler.html"
    // }

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

