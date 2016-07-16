module.exports = {

  "name": "Github Documentation",

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

    // Custom JSON Handler
    // Relative to this settings file
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
