# postcss-to-camel-case

Convert all CSS Selectors into camelCase. Useful for converting an existing project to use camelCase selectors to follow the default CSS Modules conventions.

## Usage

This plugin is most useful with the replace feature of [PostCSS CLI](https://github.com/postcss/postcss-cli).

```
npx postcss ./path/to/css/**/*.css --replace --no-map --use @abcaustralia/postcss-to-camel-case
```

Or with a config file:

```js
module.exports = (ctx) => ({
  map: ctx.options.map,
  parser: ctx.options.parser,
  plugins: [require("@abcaustralia/postcss-to-camel-case")],
});
```

```
npx postcss ./path/to/css/**/*.css --replace --no-map --config ./postcss.config.js
```
