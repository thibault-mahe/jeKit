Jekit
===========

A starter kit for front developpement based on bootstrap, SASS and jekyll.

## Assets

- **jekyll**
- **Bootstrap 3**
- **ES6 support**
- **SASS**
- **Respond.JS**
- **html5shiv**
- **Grunt**
- **Bower**

## License

jeKit is released under the [MIT License](COPYING).

Inspired by [the GestionAir StarterKit : https://github.com/GestionAIR/StarterKit](https://github.com/GestionAIR/StarterKit)

## Getting Started

This project requires [Grunt](http://gruntjs.com/) and [Bower](http://bower.io/).

First clone the repo : `git clone git@github.com:tibomahe/jeKit`

From the project's directory execute :

```
$ npm -g install grunt-cli bower
$ npm install
$ bower install
```

Run project with Grunt.

```
$ grunt
```

## Usage

You can custom the jekit according to your project by modifying the data (title, version, email, description, ...) in `_config.yml`, `bower.json` and `package.json`.


### Stats

To have statistics on the project, run the following command :

```
$ grunt stats
```

CSS-count gives you data on the code (IE9 is limited to 4095 selectors) and PageSpeed offers data on the project performance according to [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/).

## Critical CSS

jeKit uses the grunt contrib for [criticalcss](https://github.com/filamentgroup/grunt-criticalcss). When you launch grunt, it generates critical css files in css/critical/.. that you can copy, paste and inline in the head of your html. It will only be used in the home view.


