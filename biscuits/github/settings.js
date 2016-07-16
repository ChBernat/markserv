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
