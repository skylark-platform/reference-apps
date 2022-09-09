module.exports = {
  "locales": ["en-gb", "pt-pt"],
  "defaultLocale": "en-gb",
  "pages": {
    "*": ["common"],
  },
  // "loadLocaleFrom": (lang, ns) =>
  //   // You can use a dynamic import, fetch, whatever. You should
  //   // return a Promise with the JSON file.
  //   import(`@skylark-reference-apps/lib/translations/${lang}/${ns}.json`).then((m) => m.default),
}
