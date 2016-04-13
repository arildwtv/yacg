# YACG _[yak-ee]_

<img src="https://raw.githubusercontent.com/arildwtv/yacg/master/media/yacg.png" alt="YACG" />

<blockquote>A framework that propels your specification into realization.</blockquote>


## What...?

_TL;DR: See Usage below._

__YACG__ (pronounced _[yak-ee]_) stands for Yet Another Code Generator - and yes, that's a very clever reference to
[YACC](https://en.wikipedia.org/wiki/Yacc). :smirk:

Essentially, YACG is a small Node module that facilitates auto-generation of code -  or any other type of file, for
that matter.

YACG is like any other function: You put something in, you get something out. However, YACG is specialized in that the
output will always be a source file, or a list of source files.

Also, YACG has conveniently built-in functionality for creating actual files based on your generated sources. And, of
course, both Windows and *NIX environments are supported.

The input to YACG - what we like to call the _specification_ of your generated code - is all up to you. It may be a
string, a number, an array, an object, a [Swagger](http://swagger.io/) specification - it may be whatever you need it
to be. For all we care, it could be `null` or `undefined`.

For further details, check Usage below, or our [examples](https://github.com/arildwtv/yacg/tree/master/examples).

Happy auto-generating!

## Install

```
$ npm install yacg --save
```

:exclamation: __Note__ that YACG uses Promises extensively. Be sure to include a 
[polyfill](https://github.com/stefanpenner/es6-promise) if your runtime does not support Promises.

## Usage

For more examples, take a look in the [examples](https://github.com/arildwtv/yacg/tree/master/examples) folder.

```js
// Let's create a generator that generates a JS file
// that outputs "I dig YACG!"
import { initialize, generateSources, writeFiles } from 'yacg';

// Create your plugin(s).
const helloPlugin = {
    generateSources(spec) {
        return {
            path: 'dig.js',
            content: `console.log('I dig ${spec.name}!');`
        };
    }
};

// The spec from which to generate our amazing code.
const spec = { name: 'YACG' };

// Initialize YACG with the spec and plugins.
initialize(spec, [ helloPlugin ])
    // Let our hello plugin generate our sources.
    .then(generateSources)
    // Output the sources as files in current directory.
    .then(writeFiles('.'))
    // Important! Catch if any error is thrown during the process.
    .catch(err => console.error(err));
```

## API

### `initialize(spec, plugins)`

Initializes YACG with your specification (`spec`) and your plugins (`plugins`).

* `spec : *` - The specification from which to generate your code. Can be a string, object, array - whatever you
need it to be.
* `plugins : array` - The plugins you want to generate your code.
* __Returns__ a promise, from which you can proceed your code generation.

### `validateSpec(validator)`

(Optionally) validates your specification before proceeding.

* `validator : Function` - The validator function, which takes a single argument: the `spec` provided from the
`initialize` method. YACG considers the validation as failed if the validator function either:
	* returns a Promise that eventually is rejected
	* throws an Error
* __Returns__ a promise that resolves when the validation passes, or rejects when the validation fails.

### `generateSources`

Calls each of your registered plugins to let them generate your sources.

* __Returns__ a promise that resolves when all plugins have generated their sources.

### `writeFiles(outputDirectory [, keepPatterns])`

(Optionally) writes your sources as files in the directory that you provide. This function supports both Windows and 
*NIX environments.

* `outputDirectory : string` - The relative directory in which you want your generated code to be written.
* `keepPatterns : [RegExp]` (optional) - An array of regular expression patterns that you may provide to determine
whether to overwrite given sources if their respective files already exist.
* __Returns__ a promise that resolves when all files have been written to your desired directory.


## Plugins

A YACG plugin can basically do two things, either:

1. subscribe to YACG events (such as when a file has been written)
2. generate _sources_.

A _source_ in YACG context is basically just an object with a `path` and `content` property, where the first is the
unique path to the source (or file), and the second is the content of the source (or file).

## Plugin API

### `generateSources(spec)`

This function is called by YACG when the client calles YACG's `generateSources` function.

* `spec : *` - The specification, as provided by you in YACG's `initialize` method.
* __Returns__: A _source_, an array of _sources_, or a promise that eventually resolves to either of the aforementioned.
    * `source : object`:
        * `path : string` - The unique (UNIX-style) path to the source (or file). If you define a deeply nested path,
        such as `"hello/to/you.js"`, YACG will generate the directories for you automagically.
        * `content : string` - The content of the file.

### `subscriptions`

This function is called by YACG's `initialize` function, so that YACG may register the events to which your plugins are
interested in listening.

* __Returns__: An array of _subscriptions_ to events of which the plugin wants to be notified by YACG during the code
generation.
    * `subscription : object`:
        * `event : string` - The type of event. Can be either of _specValidationStarted_, _specValidationCompleted_,
        _specValidationFailed_, _sourceGenerationStarted_, _sourceGenerationCompleted_, _sourceOutputStarted_ or
        _sourceOutputCompleted_.
        * `handler : Function` - The function to handle the event when it occurs. The arguments for each event vary - 
        please see examples or source code for further details.

## Contribution

This project started out as a joint venture between
[Mesan AS](http://mesan.no) and [Harald A. Møller AS](http://moller.no)
and is now open-sourced with their permission.

## License

[MIT](http://opensource.org/licenses/MIT) © Arild Tvergrov
