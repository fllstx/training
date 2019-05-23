## Webpack

## Setup directory

```bash
#create a directory, where we can play around with webpack
# don't name your folder webpack
mkdir wptest
cd wptest

# create a .gitignore file
touch .gitignore

# and add the "node_modules" and "dist" folder
echo -e "node_modules\ndist" >> .gitignore
```

To serve our minimal webpack setup, we use `node-static`.

```bash
# install node-static globally
npm i node-static -g

# serve your folder
static .
```

## Setup minimal example

Create a minimal repository structure

```bash
# create files
touch index.html script.js lib.js style.css
```

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Webpack Test</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Hello Webpack!</h1>
    <script src="script.js"></script>
    <script src="lib.js"></script>
  </body>
</html>
```

script.js

```js
"use strict";
console.log(greeting);
```

lib.js

```
"use strict";
const greeting = "Hello World!";

```

stlye.css

```css
h1 {
  padding: 2rem;
  background-color: salmon;
}
```

## See what we got

Open your browser (assuming you started the `static` server), visit `http://localhost:8080/` and open your devtools.

You should see the error `Uncaught ReferenceError: greeting is not defined`, because the JS files have the wrong source order.

Now change the source order and the error should be fixed.

## setup npm

```bash
# Init npm with default values
npm init --yes
```

## Install webpack and webpack-cli

```bash
# install webpack
npm i webpack --save-dev
# since webpack 4, webpack-cli (or any webpack cli) is required
npm i webpack-cli --save-dev
```

## Add build command

Open `package.json` and add a build script.

```json
{
  "scripts": {
    "build": "webpack"
  }
}
```

## Run the build command w/o config

Run `npm run build` and see what happens.

Without a dedicated config, webpack will use

- `src/index.js` as entry point
- `dist/main.js` as output

## Restructure source files

```bash
# create src folder
mkdir src

# move all relevant files
mv index.html src/index.html
mv script.js src/script.js
mv lib.js src/lib.js
mv style.css src/style.css
```

Change `src/lib.js`

```js
export const greeting = "Hello World!";
```

Rename `src/script.js` to `src/index.js`

And now change `src/index.js`

```js
import { greeting } from "./lib";

console.log(greeting);
```

Because we use ESM syntax (`import ... from ...`), we are automatically use `strict mode`.

Now run `npm run build` again and see what happens.

Webpack bundled `index.js` and all it's dependencies into `dist/main.js`.

### Load bundle in index.html

Now remove the old script tags in `src/index.html` and add a script tag for `dist/main.js`.

```html
<body>
  <h1>Hello Webpack!</h1>
  <script src="../dist/main.js"></script>
</body>
```

## Add minimal config

Now create a minimal config for webpack.

```bash
# create webpack config
touch webpack.config.js
```

This config does pretty much the same as before, but we need this as an starting point for more configuration.

```js
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  }
};
```

## Mode

If `mode`is not defined in webpack config, it will automatically be set to `production`.

Available modes are

- `production` (default)
- `development`
- `none`

List of presets for each mode can be found [here](https://webpack.js.org/configuration/mode).

## Clean output folder

Webpack emits all the output to `dist`. To avoid having old output files in there, we now clean up the `dist` folder.

```bash
# install clean-webpack-plugin
npm install clean-webpack-plugin --save-dev
```

Edit `webpack.config.js`

```js
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  // ...
  plugins: [new CleanWebpackPlugin()]
};
```

### Test the clean plugin

Create an empty file `dist/foo.js` and then run `npm run build`.

You should only see `dist/main.js`

## Copy index.html to dist

Because the `dist` folder is usually published, we also need the `index.html` file in there.

First edit the ` src/index.html`` and change the path of `main.js`

```html
<body>
  ...
  <script src="main.js"></script>
</body>
```

Now install `copy-webpack-plugin`.

```bash
# install copy-webpack-plugin
npm install copy-webpack-plugin --save-dev
```

And extend the webpack config.

```js
const CopyPlugin = require("copy-webpack-plugin");

// ...

module.exports = {
  // ...
  plugins: [
    //...
    new CopyPlugin([
      { from: path.resolve(__dirname, "src/index.html"), to: "index.html" }
    ])
  ]
};
```

Once again execute `npm run build` to test the copy plugin.

## Add a hash to main.js

To avoid caching issues, let's add a hash to the output file name.

Also see webpack [guide](https://webpack.js.org/guides/caching/) on caching.

Add the `[hash]` placeholder for outputs.

```js
module.exports = {
  output: {
    ...
    filename: "main.[hash].js"
  }
};
```

Once again run `npm run build`.

> Because we renamed `main.js`, our website broke - we fix this later.

## Naming a output chunk

Because we can have multiple entry files, it makes sense to give them names.

Edit the webpack config and

- add an object for `entry`
- add `main` key and the path of the entry file
- use `[name]` placeholder for the output

```js
module.exports = {
  entry: {
    main: "./src/index.js"
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash].js"
  }
};
```

## Generate index.html

Since our `index.html` is broken and our output file will receive a new name upon changes, we need to generate the index.hml.

First remove the `CopyPlugin`.

```js
module.exports = {
  ...
  // plugins should look like this
  plugins: [
    new CleanWebpackPlugin(),
    ])
  ]
};
```

Now install `html-webpack-plugin`.

```bash
# install html-webpack-plugin
npm i html-webpack-plugin --save-dev
```

And configure it.

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // ...
  plugins: [
    //...
    new HtmlWebpackPlugin()
  ]
};
```

Execute `npm run build` again and see what happens.

## Use a template for html-webpack-plugin

Let's use our old `index.html` as a template.

First change `webpack.config.js`.

```js
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: "Hello Webpack",
      template: "./src/index.html"
    })
  ]
};
```

Change `src/index.html`to this.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title><%= htmlWebpackPlugin.options.title %></title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Hello Webpack!</h1>
  </body>
</html>
```

As always execute `npm run build` and see what happens.

> We fixed our web app!

## Bundle CSS

We don't load CSS yet, let's do this.

First install `css-loader` and `style-loader`.

```bash
npm install css-loader --save-dev
npm install style-loader --save-dev
```

Import the stylesheet in `src/index.js`

```js
import "./style.css";
```

And remove the `link` tag from your `src/index.html`

Run `npm run build` and look what happens.

Now add a rule for `css` in your webpack config.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
```

Run `npm run build` and see what happens.

## Extract CSS in own file

Install `mini-css-extract-plugin``

```bash
npm install mini-css-extract-plugin --save-dev
```

And change your webpack config.

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader"
        ]
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin()]
};
```

Run `npm run build` and see what happens.
