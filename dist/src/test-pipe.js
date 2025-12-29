import { pipe } from 'fp-ts';
const res = pipe(1, (n) => n + 1);
console.log('Pipe worked:', res);
