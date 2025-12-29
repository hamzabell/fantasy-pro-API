import { taskEither as TE, function as F } from 'fp-ts';
console.log('TE:', !!TE);
console.log('F:', !!F);
console.log('pipe:', !!F.pipe);
const result = F.pipe(TE.right(1), TE.map(n => n + 1));
console.log('Result:', result);
