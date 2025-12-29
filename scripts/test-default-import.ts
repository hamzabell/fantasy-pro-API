import fpTs from 'fp-ts';
const { taskEither: TE } = fpTs;

console.log('fpTs:', !!fpTs);
console.log('TE:', !!TE);
console.log('TE.right:', !!TE.right);
