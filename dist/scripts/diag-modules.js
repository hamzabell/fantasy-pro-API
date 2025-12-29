import { createRequire } from 'module';
const require = createRequire(import.meta.url);
try {
    console.log('Resolving fp-ts main...');
    console.log('Main:', import.meta.resolve('fp-ts'));
}
catch (e) {
    console.log('Main resolution failed');
}
try {
    console.log('Resolving fp-ts lib/TaskEither.js...');
    console.log('Lib:', import.meta.resolve('fp-ts/lib/TaskEither.js'));
}
catch (e) {
    console.log('Lib resolution failed');
}
try {
    console.log('Resolving fp-ts es6/TaskEither.js...');
    console.log('ES6:', import.meta.resolve('fp-ts/es6/TaskEither.js'));
}
catch (e) {
    console.log('ES6 resolution failed');
}
try {
    console.log('Trying require("fp-ts/lib/TaskEither")...');
    const TE = require('fp-ts/lib/TaskEither');
    console.log('Require success!');
}
catch (e) {
    console.log('Require failed:', e.message);
}
