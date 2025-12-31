
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Wallet
 * 
 */
export type Wallet = $Result.DefaultSelection<Prisma.$WalletPayload>
/**
 * Model Team
 * 
 */
export type Team = $Result.DefaultSelection<Prisma.$TeamPayload>
/**
 * Model FantasyLeague
 * 
 */
export type FantasyLeague = $Result.DefaultSelection<Prisma.$FantasyLeaguePayload>
/**
 * Model FantasyLeagueMembership
 * 
 */
export type FantasyLeagueMembership = $Result.DefaultSelection<Prisma.$FantasyLeagueMembershipPayload>
/**
 * Model Gameweek
 * 
 */
export type Gameweek = $Result.DefaultSelection<Prisma.$GameweekPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const RealLifeLeague: {
  PREMIER_LEAGUE: 'PREMIER_LEAGUE'
};

export type RealLifeLeague = (typeof RealLifeLeague)[keyof typeof RealLifeLeague]

}

export type RealLifeLeague = $Enums.RealLifeLeague

export const RealLifeLeague: typeof $Enums.RealLifeLeague

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.wallet`: Exposes CRUD operations for the **Wallet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Wallets
    * const wallets = await prisma.wallet.findMany()
    * ```
    */
  get wallet(): Prisma.WalletDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.team`: Exposes CRUD operations for the **Team** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Teams
    * const teams = await prisma.team.findMany()
    * ```
    */
  get team(): Prisma.TeamDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fantasyLeague`: Exposes CRUD operations for the **FantasyLeague** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FantasyLeagues
    * const fantasyLeagues = await prisma.fantasyLeague.findMany()
    * ```
    */
  get fantasyLeague(): Prisma.FantasyLeagueDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fantasyLeagueMembership`: Exposes CRUD operations for the **FantasyLeagueMembership** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FantasyLeagueMemberships
    * const fantasyLeagueMemberships = await prisma.fantasyLeagueMembership.findMany()
    * ```
    */
  get fantasyLeagueMembership(): Prisma.FantasyLeagueMembershipDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameweek`: Exposes CRUD operations for the **Gameweek** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Gameweeks
    * const gameweeks = await prisma.gameweek.findMany()
    * ```
    */
  get gameweek(): Prisma.GameweekDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.14.0
   * Query Engine version: 717184b7b35ea05dfa71a3236b7af656013e1e49
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Wallet: 'Wallet',
    Team: 'Team',
    FantasyLeague: 'FantasyLeague',
    FantasyLeagueMembership: 'FantasyLeagueMembership',
    Gameweek: 'Gameweek',
    Transaction: 'Transaction'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "wallet" | "team" | "fantasyLeague" | "fantasyLeagueMembership" | "gameweek" | "transaction"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Wallet: {
        payload: Prisma.$WalletPayload<ExtArgs>
        fields: Prisma.WalletFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WalletFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WalletFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          findFirst: {
            args: Prisma.WalletFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WalletFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          findMany: {
            args: Prisma.WalletFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>[]
          }
          create: {
            args: Prisma.WalletCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          createMany: {
            args: Prisma.WalletCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WalletCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>[]
          }
          delete: {
            args: Prisma.WalletDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          update: {
            args: Prisma.WalletUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          deleteMany: {
            args: Prisma.WalletDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WalletUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WalletUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>[]
          }
          upsert: {
            args: Prisma.WalletUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WalletPayload>
          }
          aggregate: {
            args: Prisma.WalletAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWallet>
          }
          groupBy: {
            args: Prisma.WalletGroupByArgs<ExtArgs>
            result: $Utils.Optional<WalletGroupByOutputType>[]
          }
          count: {
            args: Prisma.WalletCountArgs<ExtArgs>
            result: $Utils.Optional<WalletCountAggregateOutputType> | number
          }
        }
      }
      Team: {
        payload: Prisma.$TeamPayload<ExtArgs>
        fields: Prisma.TeamFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findFirst: {
            args: Prisma.TeamFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findMany: {
            args: Prisma.TeamFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          create: {
            args: Prisma.TeamCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          createMany: {
            args: Prisma.TeamCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          delete: {
            args: Prisma.TeamDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          update: {
            args: Prisma.TeamUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          deleteMany: {
            args: Prisma.TeamDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TeamUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          upsert: {
            args: Prisma.TeamUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          aggregate: {
            args: Prisma.TeamAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeam>
          }
          groupBy: {
            args: Prisma.TeamGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamCountArgs<ExtArgs>
            result: $Utils.Optional<TeamCountAggregateOutputType> | number
          }
        }
      }
      FantasyLeague: {
        payload: Prisma.$FantasyLeaguePayload<ExtArgs>
        fields: Prisma.FantasyLeagueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FantasyLeagueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeaguePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FantasyLeagueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeaguePayload>
          }
          findFirst: {
            args: Prisma.FantasyLeagueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeaguePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FantasyLeagueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeaguePayload>
          }
          findMany: {
            args: Prisma.FantasyLeagueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeaguePayload>[]
          }
          create: {
            args: Prisma.FantasyLeagueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeaguePayload>
          }
          createMany: {
            args: Prisma.FantasyLeagueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FantasyLeagueCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeaguePayload>[]
          }
          delete: {
            args: Prisma.FantasyLeagueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeaguePayload>
          }
          update: {
            args: Prisma.FantasyLeagueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeaguePayload>
          }
          deleteMany: {
            args: Prisma.FantasyLeagueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FantasyLeagueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FantasyLeagueUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeaguePayload>[]
          }
          upsert: {
            args: Prisma.FantasyLeagueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeaguePayload>
          }
          aggregate: {
            args: Prisma.FantasyLeagueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFantasyLeague>
          }
          groupBy: {
            args: Prisma.FantasyLeagueGroupByArgs<ExtArgs>
            result: $Utils.Optional<FantasyLeagueGroupByOutputType>[]
          }
          count: {
            args: Prisma.FantasyLeagueCountArgs<ExtArgs>
            result: $Utils.Optional<FantasyLeagueCountAggregateOutputType> | number
          }
        }
      }
      FantasyLeagueMembership: {
        payload: Prisma.$FantasyLeagueMembershipPayload<ExtArgs>
        fields: Prisma.FantasyLeagueMembershipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FantasyLeagueMembershipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FantasyLeagueMembershipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPayload>
          }
          findFirst: {
            args: Prisma.FantasyLeagueMembershipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FantasyLeagueMembershipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPayload>
          }
          findMany: {
            args: Prisma.FantasyLeagueMembershipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPayload>[]
          }
          create: {
            args: Prisma.FantasyLeagueMembershipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPayload>
          }
          createMany: {
            args: Prisma.FantasyLeagueMembershipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FantasyLeagueMembershipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPayload>[]
          }
          delete: {
            args: Prisma.FantasyLeagueMembershipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPayload>
          }
          update: {
            args: Prisma.FantasyLeagueMembershipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPayload>
          }
          deleteMany: {
            args: Prisma.FantasyLeagueMembershipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FantasyLeagueMembershipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FantasyLeagueMembershipUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPayload>[]
          }
          upsert: {
            args: Prisma.FantasyLeagueMembershipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPayload>
          }
          aggregate: {
            args: Prisma.FantasyLeagueMembershipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFantasyLeagueMembership>
          }
          groupBy: {
            args: Prisma.FantasyLeagueMembershipGroupByArgs<ExtArgs>
            result: $Utils.Optional<FantasyLeagueMembershipGroupByOutputType>[]
          }
          count: {
            args: Prisma.FantasyLeagueMembershipCountArgs<ExtArgs>
            result: $Utils.Optional<FantasyLeagueMembershipCountAggregateOutputType> | number
          }
        }
      }
      Gameweek: {
        payload: Prisma.$GameweekPayload<ExtArgs>
        fields: Prisma.GameweekFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameweekFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameweekPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameweekFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameweekPayload>
          }
          findFirst: {
            args: Prisma.GameweekFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameweekPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameweekFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameweekPayload>
          }
          findMany: {
            args: Prisma.GameweekFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameweekPayload>[]
          }
          create: {
            args: Prisma.GameweekCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameweekPayload>
          }
          createMany: {
            args: Prisma.GameweekCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameweekCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameweekPayload>[]
          }
          delete: {
            args: Prisma.GameweekDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameweekPayload>
          }
          update: {
            args: Prisma.GameweekUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameweekPayload>
          }
          deleteMany: {
            args: Prisma.GameweekDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameweekUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameweekUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameweekPayload>[]
          }
          upsert: {
            args: Prisma.GameweekUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameweekPayload>
          }
          aggregate: {
            args: Prisma.GameweekAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameweek>
          }
          groupBy: {
            args: Prisma.GameweekGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameweekGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameweekCountArgs<ExtArgs>
            result: $Utils.Optional<GameweekCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransactionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    wallet?: WalletOmit
    team?: TeamOmit
    fantasyLeague?: FantasyLeagueOmit
    fantasyLeagueMembership?: FantasyLeagueMembershipOmit
    gameweek?: GameweekOmit
    transaction?: TransactionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    teams: number
    leagues: number
    ownedLeagues: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    teams?: boolean | UserCountOutputTypeCountTeamsArgs
    leagues?: boolean | UserCountOutputTypeCountLeaguesArgs
    ownedLeagues?: boolean | UserCountOutputTypeCountOwnedLeaguesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTeamsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLeaguesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FantasyLeagueMembershipWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOwnedLeaguesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FantasyLeagueWhereInput
  }


  /**
   * Count Type FantasyLeagueCountOutputType
   */

  export type FantasyLeagueCountOutputType = {
    members: number
    transactions: number
  }

  export type FantasyLeagueCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | FantasyLeagueCountOutputTypeCountMembersArgs
    transactions?: boolean | FantasyLeagueCountOutputTypeCountTransactionsArgs
  }

  // Custom InputTypes
  /**
   * FantasyLeagueCountOutputType without action
   */
  export type FantasyLeagueCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueCountOutputType
     */
    select?: FantasyLeagueCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FantasyLeagueCountOutputType without action
   */
  export type FantasyLeagueCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FantasyLeagueMembershipWhereInput
  }

  /**
   * FantasyLeagueCountOutputType without action
   */
  export type FantasyLeagueCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }


  /**
   * Count Type GameweekCountOutputType
   */

  export type GameweekCountOutputType = {
    leagues: number
  }

  export type GameweekCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    leagues?: boolean | GameweekCountOutputTypeCountLeaguesArgs
  }

  // Custom InputTypes
  /**
   * GameweekCountOutputType without action
   */
  export type GameweekCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameweekCountOutputType
     */
    select?: GameweekCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GameweekCountOutputType without action
   */
  export type GameweekCountOutputTypeCountLeaguesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FantasyLeagueWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    coins: number | null
    balanceUsd: Decimal | null
    totalDeposited: Decimal | null
    totalWithdrawn: Decimal | null
  }

  export type UserSumAggregateOutputType = {
    coins: number | null
    balanceUsd: Decimal | null
    totalDeposited: Decimal | null
    totalWithdrawn: Decimal | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    image: string | null
    password: string | null
    country: string | null
    currency: string | null
    coins: number | null
    balanceUsd: Decimal | null
    totalDeposited: Decimal | null
    totalWithdrawn: Decimal | null
    walletAddress: string | null
    kycStatus: string | null
    mobileMoneyNumber: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    image: string | null
    password: string | null
    country: string | null
    currency: string | null
    coins: number | null
    balanceUsd: Decimal | null
    totalDeposited: Decimal | null
    totalWithdrawn: Decimal | null
    walletAddress: string | null
    kycStatus: string | null
    mobileMoneyNumber: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    image: number
    password: number
    country: number
    currency: number
    coins: number
    balanceUsd: number
    totalDeposited: number
    totalWithdrawn: number
    walletAddress: number
    kycStatus: number
    mobileMoneyNumber: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    coins?: true
    balanceUsd?: true
    totalDeposited?: true
    totalWithdrawn?: true
  }

  export type UserSumAggregateInputType = {
    coins?: true
    balanceUsd?: true
    totalDeposited?: true
    totalWithdrawn?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    image?: true
    password?: true
    country?: true
    currency?: true
    coins?: true
    balanceUsd?: true
    totalDeposited?: true
    totalWithdrawn?: true
    walletAddress?: true
    kycStatus?: true
    mobileMoneyNumber?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    image?: true
    password?: true
    country?: true
    currency?: true
    coins?: true
    balanceUsd?: true
    totalDeposited?: true
    totalWithdrawn?: true
    walletAddress?: true
    kycStatus?: true
    mobileMoneyNumber?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    image?: true
    password?: true
    country?: true
    currency?: true
    coins?: true
    balanceUsd?: true
    totalDeposited?: true
    totalWithdrawn?: true
    walletAddress?: true
    kycStatus?: true
    mobileMoneyNumber?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    image: string | null
    password: string | null
    country: string | null
    currency: string | null
    coins: number
    balanceUsd: Decimal
    totalDeposited: Decimal
    totalWithdrawn: Decimal
    walletAddress: string | null
    kycStatus: string
    mobileMoneyNumber: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    image?: boolean
    password?: boolean
    country?: boolean
    currency?: boolean
    coins?: boolean
    balanceUsd?: boolean
    totalDeposited?: boolean
    totalWithdrawn?: boolean
    walletAddress?: boolean
    kycStatus?: boolean
    mobileMoneyNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    teams?: boolean | User$teamsArgs<ExtArgs>
    leagues?: boolean | User$leaguesArgs<ExtArgs>
    ownedLeagues?: boolean | User$ownedLeaguesArgs<ExtArgs>
    wallet?: boolean | User$walletArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    image?: boolean
    password?: boolean
    country?: boolean
    currency?: boolean
    coins?: boolean
    balanceUsd?: boolean
    totalDeposited?: boolean
    totalWithdrawn?: boolean
    walletAddress?: boolean
    kycStatus?: boolean
    mobileMoneyNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    image?: boolean
    password?: boolean
    country?: boolean
    currency?: boolean
    coins?: boolean
    balanceUsd?: boolean
    totalDeposited?: boolean
    totalWithdrawn?: boolean
    walletAddress?: boolean
    kycStatus?: boolean
    mobileMoneyNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    image?: boolean
    password?: boolean
    country?: boolean
    currency?: boolean
    coins?: boolean
    balanceUsd?: boolean
    totalDeposited?: boolean
    totalWithdrawn?: boolean
    walletAddress?: boolean
    kycStatus?: boolean
    mobileMoneyNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "image" | "password" | "country" | "currency" | "coins" | "balanceUsd" | "totalDeposited" | "totalWithdrawn" | "walletAddress" | "kycStatus" | "mobileMoneyNumber" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    teams?: boolean | User$teamsArgs<ExtArgs>
    leagues?: boolean | User$leaguesArgs<ExtArgs>
    ownedLeagues?: boolean | User$ownedLeaguesArgs<ExtArgs>
    wallet?: boolean | User$walletArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      teams: Prisma.$TeamPayload<ExtArgs>[]
      leagues: Prisma.$FantasyLeagueMembershipPayload<ExtArgs>[]
      ownedLeagues: Prisma.$FantasyLeaguePayload<ExtArgs>[]
      wallet: Prisma.$WalletPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      image: string | null
      password: string | null
      country: string | null
      currency: string | null
      coins: number
      balanceUsd: Prisma.Decimal
      totalDeposited: Prisma.Decimal
      totalWithdrawn: Prisma.Decimal
      walletAddress: string | null
      kycStatus: string
      mobileMoneyNumber: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    teams<T extends User$teamsArgs<ExtArgs> = {}>(args?: Subset<T, User$teamsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    leagues<T extends User$leaguesArgs<ExtArgs> = {}>(args?: Subset<T, User$leaguesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ownedLeagues<T extends User$ownedLeaguesArgs<ExtArgs> = {}>(args?: Subset<T, User$ownedLeaguesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    wallet<T extends User$walletArgs<ExtArgs> = {}>(args?: Subset<T, User$walletArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly image: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly country: FieldRef<"User", 'String'>
    readonly currency: FieldRef<"User", 'String'>
    readonly coins: FieldRef<"User", 'Int'>
    readonly balanceUsd: FieldRef<"User", 'Decimal'>
    readonly totalDeposited: FieldRef<"User", 'Decimal'>
    readonly totalWithdrawn: FieldRef<"User", 'Decimal'>
    readonly walletAddress: FieldRef<"User", 'String'>
    readonly kycStatus: FieldRef<"User", 'String'>
    readonly mobileMoneyNumber: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.teams
   */
  export type User$teamsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    where?: TeamWhereInput
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    cursor?: TeamWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * User.leagues
   */
  export type User$leaguesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembership
     */
    select?: FantasyLeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembership
     */
    omit?: FantasyLeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipInclude<ExtArgs> | null
    where?: FantasyLeagueMembershipWhereInput
    orderBy?: FantasyLeagueMembershipOrderByWithRelationInput | FantasyLeagueMembershipOrderByWithRelationInput[]
    cursor?: FantasyLeagueMembershipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FantasyLeagueMembershipScalarFieldEnum | FantasyLeagueMembershipScalarFieldEnum[]
  }

  /**
   * User.ownedLeagues
   */
  export type User$ownedLeaguesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeague
     */
    select?: FantasyLeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeague
     */
    omit?: FantasyLeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueInclude<ExtArgs> | null
    where?: FantasyLeagueWhereInput
    orderBy?: FantasyLeagueOrderByWithRelationInput | FantasyLeagueOrderByWithRelationInput[]
    cursor?: FantasyLeagueWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FantasyLeagueScalarFieldEnum | FantasyLeagueScalarFieldEnum[]
  }

  /**
   * User.wallet
   */
  export type User$walletArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    where?: WalletWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Wallet
   */

  export type AggregateWallet = {
    _count: WalletCountAggregateOutputType | null
    _avg: WalletAvgAggregateOutputType | null
    _sum: WalletSumAggregateOutputType | null
    _min: WalletMinAggregateOutputType | null
    _max: WalletMaxAggregateOutputType | null
  }

  export type WalletAvgAggregateOutputType = {
    balance: Decimal | null
  }

  export type WalletSumAggregateOutputType = {
    balance: Decimal | null
  }

  export type WalletMinAggregateOutputType = {
    id: string | null
    userId: string | null
    address: string | null
    encryptedPrivateKey: string | null
    balance: Decimal | null
    lastBalanceUpdate: Date | null
    createdAt: Date | null
  }

  export type WalletMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    address: string | null
    encryptedPrivateKey: string | null
    balance: Decimal | null
    lastBalanceUpdate: Date | null
    createdAt: Date | null
  }

  export type WalletCountAggregateOutputType = {
    id: number
    userId: number
    address: number
    encryptedPrivateKey: number
    balance: number
    lastBalanceUpdate: number
    createdAt: number
    _all: number
  }


  export type WalletAvgAggregateInputType = {
    balance?: true
  }

  export type WalletSumAggregateInputType = {
    balance?: true
  }

  export type WalletMinAggregateInputType = {
    id?: true
    userId?: true
    address?: true
    encryptedPrivateKey?: true
    balance?: true
    lastBalanceUpdate?: true
    createdAt?: true
  }

  export type WalletMaxAggregateInputType = {
    id?: true
    userId?: true
    address?: true
    encryptedPrivateKey?: true
    balance?: true
    lastBalanceUpdate?: true
    createdAt?: true
  }

  export type WalletCountAggregateInputType = {
    id?: true
    userId?: true
    address?: true
    encryptedPrivateKey?: true
    balance?: true
    lastBalanceUpdate?: true
    createdAt?: true
    _all?: true
  }

  export type WalletAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wallet to aggregate.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Wallets
    **/
    _count?: true | WalletCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WalletAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WalletSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WalletMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WalletMaxAggregateInputType
  }

  export type GetWalletAggregateType<T extends WalletAggregateArgs> = {
        [P in keyof T & keyof AggregateWallet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWallet[P]>
      : GetScalarType<T[P], AggregateWallet[P]>
  }




  export type WalletGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WalletWhereInput
    orderBy?: WalletOrderByWithAggregationInput | WalletOrderByWithAggregationInput[]
    by: WalletScalarFieldEnum[] | WalletScalarFieldEnum
    having?: WalletScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WalletCountAggregateInputType | true
    _avg?: WalletAvgAggregateInputType
    _sum?: WalletSumAggregateInputType
    _min?: WalletMinAggregateInputType
    _max?: WalletMaxAggregateInputType
  }

  export type WalletGroupByOutputType = {
    id: string
    userId: string
    address: string
    encryptedPrivateKey: string
    balance: Decimal
    lastBalanceUpdate: Date | null
    createdAt: Date
    _count: WalletCountAggregateOutputType | null
    _avg: WalletAvgAggregateOutputType | null
    _sum: WalletSumAggregateOutputType | null
    _min: WalletMinAggregateOutputType | null
    _max: WalletMaxAggregateOutputType | null
  }

  type GetWalletGroupByPayload<T extends WalletGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WalletGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WalletGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WalletGroupByOutputType[P]>
            : GetScalarType<T[P], WalletGroupByOutputType[P]>
        }
      >
    >


  export type WalletSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    address?: boolean
    encryptedPrivateKey?: boolean
    balance?: boolean
    lastBalanceUpdate?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wallet"]>

  export type WalletSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    address?: boolean
    encryptedPrivateKey?: boolean
    balance?: boolean
    lastBalanceUpdate?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wallet"]>

  export type WalletSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    address?: boolean
    encryptedPrivateKey?: boolean
    balance?: boolean
    lastBalanceUpdate?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["wallet"]>

  export type WalletSelectScalar = {
    id?: boolean
    userId?: boolean
    address?: boolean
    encryptedPrivateKey?: boolean
    balance?: boolean
    lastBalanceUpdate?: boolean
    createdAt?: boolean
  }

  export type WalletOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "address" | "encryptedPrivateKey" | "balance" | "lastBalanceUpdate" | "createdAt", ExtArgs["result"]["wallet"]>
  export type WalletInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WalletIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WalletIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WalletPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Wallet"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      address: string
      encryptedPrivateKey: string
      balance: Prisma.Decimal
      lastBalanceUpdate: Date | null
      createdAt: Date
    }, ExtArgs["result"]["wallet"]>
    composites: {}
  }

  type WalletGetPayload<S extends boolean | null | undefined | WalletDefaultArgs> = $Result.GetResult<Prisma.$WalletPayload, S>

  type WalletCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WalletFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WalletCountAggregateInputType | true
    }

  export interface WalletDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Wallet'], meta: { name: 'Wallet' } }
    /**
     * Find zero or one Wallet that matches the filter.
     * @param {WalletFindUniqueArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WalletFindUniqueArgs>(args: SelectSubset<T, WalletFindUniqueArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Wallet that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WalletFindUniqueOrThrowArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WalletFindUniqueOrThrowArgs>(args: SelectSubset<T, WalletFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wallet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletFindFirstArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WalletFindFirstArgs>(args?: SelectSubset<T, WalletFindFirstArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Wallet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletFindFirstOrThrowArgs} args - Arguments to find a Wallet
     * @example
     * // Get one Wallet
     * const wallet = await prisma.wallet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WalletFindFirstOrThrowArgs>(args?: SelectSubset<T, WalletFindFirstOrThrowArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Wallets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Wallets
     * const wallets = await prisma.wallet.findMany()
     * 
     * // Get first 10 Wallets
     * const wallets = await prisma.wallet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const walletWithIdOnly = await prisma.wallet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WalletFindManyArgs>(args?: SelectSubset<T, WalletFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Wallet.
     * @param {WalletCreateArgs} args - Arguments to create a Wallet.
     * @example
     * // Create one Wallet
     * const Wallet = await prisma.wallet.create({
     *   data: {
     *     // ... data to create a Wallet
     *   }
     * })
     * 
     */
    create<T extends WalletCreateArgs>(args: SelectSubset<T, WalletCreateArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Wallets.
     * @param {WalletCreateManyArgs} args - Arguments to create many Wallets.
     * @example
     * // Create many Wallets
     * const wallet = await prisma.wallet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WalletCreateManyArgs>(args?: SelectSubset<T, WalletCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Wallets and returns the data saved in the database.
     * @param {WalletCreateManyAndReturnArgs} args - Arguments to create many Wallets.
     * @example
     * // Create many Wallets
     * const wallet = await prisma.wallet.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Wallets and only return the `id`
     * const walletWithIdOnly = await prisma.wallet.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WalletCreateManyAndReturnArgs>(args?: SelectSubset<T, WalletCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Wallet.
     * @param {WalletDeleteArgs} args - Arguments to delete one Wallet.
     * @example
     * // Delete one Wallet
     * const Wallet = await prisma.wallet.delete({
     *   where: {
     *     // ... filter to delete one Wallet
     *   }
     * })
     * 
     */
    delete<T extends WalletDeleteArgs>(args: SelectSubset<T, WalletDeleteArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Wallet.
     * @param {WalletUpdateArgs} args - Arguments to update one Wallet.
     * @example
     * // Update one Wallet
     * const wallet = await prisma.wallet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WalletUpdateArgs>(args: SelectSubset<T, WalletUpdateArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Wallets.
     * @param {WalletDeleteManyArgs} args - Arguments to filter Wallets to delete.
     * @example
     * // Delete a few Wallets
     * const { count } = await prisma.wallet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WalletDeleteManyArgs>(args?: SelectSubset<T, WalletDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Wallets
     * const wallet = await prisma.wallet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WalletUpdateManyArgs>(args: SelectSubset<T, WalletUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Wallets and returns the data updated in the database.
     * @param {WalletUpdateManyAndReturnArgs} args - Arguments to update many Wallets.
     * @example
     * // Update many Wallets
     * const wallet = await prisma.wallet.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Wallets and only return the `id`
     * const walletWithIdOnly = await prisma.wallet.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WalletUpdateManyAndReturnArgs>(args: SelectSubset<T, WalletUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Wallet.
     * @param {WalletUpsertArgs} args - Arguments to update or create a Wallet.
     * @example
     * // Update or create a Wallet
     * const wallet = await prisma.wallet.upsert({
     *   create: {
     *     // ... data to create a Wallet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Wallet we want to update
     *   }
     * })
     */
    upsert<T extends WalletUpsertArgs>(args: SelectSubset<T, WalletUpsertArgs<ExtArgs>>): Prisma__WalletClient<$Result.GetResult<Prisma.$WalletPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Wallets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletCountArgs} args - Arguments to filter Wallets to count.
     * @example
     * // Count the number of Wallets
     * const count = await prisma.wallet.count({
     *   where: {
     *     // ... the filter for the Wallets we want to count
     *   }
     * })
    **/
    count<T extends WalletCountArgs>(
      args?: Subset<T, WalletCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WalletCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Wallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WalletAggregateArgs>(args: Subset<T, WalletAggregateArgs>): Prisma.PrismaPromise<GetWalletAggregateType<T>>

    /**
     * Group by Wallet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WalletGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WalletGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WalletGroupByArgs['orderBy'] }
        : { orderBy?: WalletGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WalletGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWalletGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Wallet model
   */
  readonly fields: WalletFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Wallet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WalletClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Wallet model
   */
  interface WalletFieldRefs {
    readonly id: FieldRef<"Wallet", 'String'>
    readonly userId: FieldRef<"Wallet", 'String'>
    readonly address: FieldRef<"Wallet", 'String'>
    readonly encryptedPrivateKey: FieldRef<"Wallet", 'String'>
    readonly balance: FieldRef<"Wallet", 'Decimal'>
    readonly lastBalanceUpdate: FieldRef<"Wallet", 'DateTime'>
    readonly createdAt: FieldRef<"Wallet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Wallet findUnique
   */
  export type WalletFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet findUniqueOrThrow
   */
  export type WalletFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet findFirst
   */
  export type WalletFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wallets.
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wallets.
     */
    distinct?: WalletScalarFieldEnum | WalletScalarFieldEnum[]
  }

  /**
   * Wallet findFirstOrThrow
   */
  export type WalletFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallet to fetch.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Wallets.
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Wallets.
     */
    distinct?: WalletScalarFieldEnum | WalletScalarFieldEnum[]
  }

  /**
   * Wallet findMany
   */
  export type WalletFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter, which Wallets to fetch.
     */
    where?: WalletWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Wallets to fetch.
     */
    orderBy?: WalletOrderByWithRelationInput | WalletOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Wallets.
     */
    cursor?: WalletWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Wallets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Wallets.
     */
    skip?: number
    distinct?: WalletScalarFieldEnum | WalletScalarFieldEnum[]
  }

  /**
   * Wallet create
   */
  export type WalletCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * The data needed to create a Wallet.
     */
    data: XOR<WalletCreateInput, WalletUncheckedCreateInput>
  }

  /**
   * Wallet createMany
   */
  export type WalletCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Wallets.
     */
    data: WalletCreateManyInput | WalletCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Wallet createManyAndReturn
   */
  export type WalletCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * The data used to create many Wallets.
     */
    data: WalletCreateManyInput | WalletCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Wallet update
   */
  export type WalletUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * The data needed to update a Wallet.
     */
    data: XOR<WalletUpdateInput, WalletUncheckedUpdateInput>
    /**
     * Choose, which Wallet to update.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet updateMany
   */
  export type WalletUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Wallets.
     */
    data: XOR<WalletUpdateManyMutationInput, WalletUncheckedUpdateManyInput>
    /**
     * Filter which Wallets to update
     */
    where?: WalletWhereInput
    /**
     * Limit how many Wallets to update.
     */
    limit?: number
  }

  /**
   * Wallet updateManyAndReturn
   */
  export type WalletUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * The data used to update Wallets.
     */
    data: XOR<WalletUpdateManyMutationInput, WalletUncheckedUpdateManyInput>
    /**
     * Filter which Wallets to update
     */
    where?: WalletWhereInput
    /**
     * Limit how many Wallets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Wallet upsert
   */
  export type WalletUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * The filter to search for the Wallet to update in case it exists.
     */
    where: WalletWhereUniqueInput
    /**
     * In case the Wallet found by the `where` argument doesn't exist, create a new Wallet with this data.
     */
    create: XOR<WalletCreateInput, WalletUncheckedCreateInput>
    /**
     * In case the Wallet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WalletUpdateInput, WalletUncheckedUpdateInput>
  }

  /**
   * Wallet delete
   */
  export type WalletDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
    /**
     * Filter which Wallet to delete.
     */
    where: WalletWhereUniqueInput
  }

  /**
   * Wallet deleteMany
   */
  export type WalletDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Wallets to delete
     */
    where?: WalletWhereInput
    /**
     * Limit how many Wallets to delete.
     */
    limit?: number
  }

  /**
   * Wallet without action
   */
  export type WalletDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Wallet
     */
    select?: WalletSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Wallet
     */
    omit?: WalletOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WalletInclude<ExtArgs> | null
  }


  /**
   * Model Team
   */

  export type AggregateTeam = {
    _count: TeamCountAggregateOutputType | null
    _avg: TeamAvgAggregateOutputType | null
    _sum: TeamSumAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  export type TeamAvgAggregateOutputType = {
    teamValue: number | null
    teamPlayers: number | null
    captainId: number | null
  }

  export type TeamSumAggregateOutputType = {
    teamValue: number | null
    teamPlayers: number[]
    captainId: number | null
  }

  export type TeamMinAggregateOutputType = {
    id: string | null
    userId: string | null
    realLifeLeague: $Enums.RealLifeLeague | null
    teamValue: number | null
    captainId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TeamMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    realLifeLeague: $Enums.RealLifeLeague | null
    teamValue: number | null
    captainId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TeamCountAggregateOutputType = {
    id: number
    userId: number
    realLifeLeague: number
    teamValue: number
    teamPlayers: number
    captainId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TeamAvgAggregateInputType = {
    teamValue?: true
    teamPlayers?: true
    captainId?: true
  }

  export type TeamSumAggregateInputType = {
    teamValue?: true
    teamPlayers?: true
    captainId?: true
  }

  export type TeamMinAggregateInputType = {
    id?: true
    userId?: true
    realLifeLeague?: true
    teamValue?: true
    captainId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TeamMaxAggregateInputType = {
    id?: true
    userId?: true
    realLifeLeague?: true
    teamValue?: true
    captainId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TeamCountAggregateInputType = {
    id?: true
    userId?: true
    realLifeLeague?: true
    teamValue?: true
    teamPlayers?: true
    captainId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TeamAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Team to aggregate.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Teams
    **/
    _count?: true | TeamCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TeamAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TeamSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamMaxAggregateInputType
  }

  export type GetTeamAggregateType<T extends TeamAggregateArgs> = {
        [P in keyof T & keyof AggregateTeam]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeam[P]>
      : GetScalarType<T[P], AggregateTeam[P]>
  }




  export type TeamGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamWhereInput
    orderBy?: TeamOrderByWithAggregationInput | TeamOrderByWithAggregationInput[]
    by: TeamScalarFieldEnum[] | TeamScalarFieldEnum
    having?: TeamScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamCountAggregateInputType | true
    _avg?: TeamAvgAggregateInputType
    _sum?: TeamSumAggregateInputType
    _min?: TeamMinAggregateInputType
    _max?: TeamMaxAggregateInputType
  }

  export type TeamGroupByOutputType = {
    id: string
    userId: string
    realLifeLeague: $Enums.RealLifeLeague
    teamValue: number
    teamPlayers: number[]
    captainId: number | null
    createdAt: Date
    updatedAt: Date
    _count: TeamCountAggregateOutputType | null
    _avg: TeamAvgAggregateOutputType | null
    _sum: TeamSumAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  type GetTeamGroupByPayload<T extends TeamGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamGroupByOutputType[P]>
            : GetScalarType<T[P], TeamGroupByOutputType[P]>
        }
      >
    >


  export type TeamSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    realLifeLeague?: boolean
    teamValue?: boolean
    teamPlayers?: boolean
    captainId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["team"]>

  export type TeamSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    realLifeLeague?: boolean
    teamValue?: boolean
    teamPlayers?: boolean
    captainId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["team"]>

  export type TeamSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    realLifeLeague?: boolean
    teamValue?: boolean
    teamPlayers?: boolean
    captainId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["team"]>

  export type TeamSelectScalar = {
    id?: boolean
    userId?: boolean
    realLifeLeague?: boolean
    teamValue?: boolean
    teamPlayers?: boolean
    captainId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TeamOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "realLifeLeague" | "teamValue" | "teamPlayers" | "captainId" | "createdAt" | "updatedAt", ExtArgs["result"]["team"]>
  export type TeamInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TeamIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TeamIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TeamPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Team"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      realLifeLeague: $Enums.RealLifeLeague
      teamValue: number
      teamPlayers: number[]
      captainId: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["team"]>
    composites: {}
  }

  type TeamGetPayload<S extends boolean | null | undefined | TeamDefaultArgs> = $Result.GetResult<Prisma.$TeamPayload, S>

  type TeamCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TeamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeamCountAggregateInputType | true
    }

  export interface TeamDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Team'], meta: { name: 'Team' } }
    /**
     * Find zero or one Team that matches the filter.
     * @param {TeamFindUniqueArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamFindUniqueArgs>(args: SelectSubset<T, TeamFindUniqueArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Team that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamFindUniqueOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamFindFirstArgs>(args?: SelectSubset<T, TeamFindFirstArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Teams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Teams
     * const teams = await prisma.team.findMany()
     * 
     * // Get first 10 Teams
     * const teams = await prisma.team.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamWithIdOnly = await prisma.team.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamFindManyArgs>(args?: SelectSubset<T, TeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Team.
     * @param {TeamCreateArgs} args - Arguments to create a Team.
     * @example
     * // Create one Team
     * const Team = await prisma.team.create({
     *   data: {
     *     // ... data to create a Team
     *   }
     * })
     * 
     */
    create<T extends TeamCreateArgs>(args: SelectSubset<T, TeamCreateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Teams.
     * @param {TeamCreateManyArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamCreateManyArgs>(args?: SelectSubset<T, TeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Teams and returns the data saved in the database.
     * @param {TeamCreateManyAndReturnArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Team.
     * @param {TeamDeleteArgs} args - Arguments to delete one Team.
     * @example
     * // Delete one Team
     * const Team = await prisma.team.delete({
     *   where: {
     *     // ... filter to delete one Team
     *   }
     * })
     * 
     */
    delete<T extends TeamDeleteArgs>(args: SelectSubset<T, TeamDeleteArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Team.
     * @param {TeamUpdateArgs} args - Arguments to update one Team.
     * @example
     * // Update one Team
     * const team = await prisma.team.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamUpdateArgs>(args: SelectSubset<T, TeamUpdateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Teams.
     * @param {TeamDeleteManyArgs} args - Arguments to filter Teams to delete.
     * @example
     * // Delete a few Teams
     * const { count } = await prisma.team.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamDeleteManyArgs>(args?: SelectSubset<T, TeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamUpdateManyArgs>(args: SelectSubset<T, TeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams and returns the data updated in the database.
     * @param {TeamUpdateManyAndReturnArgs} args - Arguments to update many Teams.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TeamUpdateManyAndReturnArgs>(args: SelectSubset<T, TeamUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Team.
     * @param {TeamUpsertArgs} args - Arguments to update or create a Team.
     * @example
     * // Update or create a Team
     * const team = await prisma.team.upsert({
     *   create: {
     *     // ... data to create a Team
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Team we want to update
     *   }
     * })
     */
    upsert<T extends TeamUpsertArgs>(args: SelectSubset<T, TeamUpsertArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamCountArgs} args - Arguments to filter Teams to count.
     * @example
     * // Count the number of Teams
     * const count = await prisma.team.count({
     *   where: {
     *     // ... the filter for the Teams we want to count
     *   }
     * })
    **/
    count<T extends TeamCountArgs>(
      args?: Subset<T, TeamCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TeamAggregateArgs>(args: Subset<T, TeamAggregateArgs>): Prisma.PrismaPromise<GetTeamAggregateType<T>>

    /**
     * Group by Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TeamGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamGroupByArgs['orderBy'] }
        : { orderBy?: TeamGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Team model
   */
  readonly fields: TeamFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Team.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Team model
   */
  interface TeamFieldRefs {
    readonly id: FieldRef<"Team", 'String'>
    readonly userId: FieldRef<"Team", 'String'>
    readonly realLifeLeague: FieldRef<"Team", 'RealLifeLeague'>
    readonly teamValue: FieldRef<"Team", 'Int'>
    readonly teamPlayers: FieldRef<"Team", 'Int[]'>
    readonly captainId: FieldRef<"Team", 'Int'>
    readonly createdAt: FieldRef<"Team", 'DateTime'>
    readonly updatedAt: FieldRef<"Team", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Team findUnique
   */
  export type TeamFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findUniqueOrThrow
   */
  export type TeamFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findFirst
   */
  export type TeamFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findFirstOrThrow
   */
  export type TeamFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findMany
   */
  export type TeamFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Teams to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team create
   */
  export type TeamCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to create a Team.
     */
    data: XOR<TeamCreateInput, TeamUncheckedCreateInput>
  }

  /**
   * Team createMany
   */
  export type TeamCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Team createManyAndReturn
   */
  export type TeamCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Team update
   */
  export type TeamUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to update a Team.
     */
    data: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
    /**
     * Choose, which Team to update.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team updateMany
   */
  export type TeamUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
  }

  /**
   * Team updateManyAndReturn
   */
  export type TeamUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Team upsert
   */
  export type TeamUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The filter to search for the Team to update in case it exists.
     */
    where: TeamWhereUniqueInput
    /**
     * In case the Team found by the `where` argument doesn't exist, create a new Team with this data.
     */
    create: XOR<TeamCreateInput, TeamUncheckedCreateInput>
    /**
     * In case the Team was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
  }

  /**
   * Team delete
   */
  export type TeamDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter which Team to delete.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team deleteMany
   */
  export type TeamDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Teams to delete
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to delete.
     */
    limit?: number
  }

  /**
   * Team without action
   */
  export type TeamDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
  }


  /**
   * Model FantasyLeague
   */

  export type AggregateFantasyLeague = {
    _count: FantasyLeagueCountAggregateOutputType | null
    _avg: FantasyLeagueAvgAggregateOutputType | null
    _sum: FantasyLeagueSumAggregateOutputType | null
    _min: FantasyLeagueMinAggregateOutputType | null
    _max: FantasyLeagueMaxAggregateOutputType | null
  }

  export type FantasyLeagueAvgAggregateOutputType = {
    limit: number | null
    winners: number | null
    entryFeeUsd: Decimal | null
    totalPoolUsd: Decimal | null
    currentParticipants: number | null
    commissionRate: Decimal | null
    creatorCommission: Decimal | null
    gameweekId: number | null
  }

  export type FantasyLeagueSumAggregateOutputType = {
    limit: number | null
    winners: number | null
    entryFeeUsd: Decimal | null
    totalPoolUsd: Decimal | null
    currentParticipants: number | null
    commissionRate: Decimal | null
    creatorCommission: Decimal | null
    gameweekId: number | null
  }

  export type FantasyLeagueMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    stake: string | null
    limit: number | null
    leagueType: string | null
    leagueMode: string | null
    winners: number | null
    code: string | null
    ownerId: string | null
    realLifeLeague: $Enums.RealLifeLeague | null
    status: string | null
    entryFeeUsd: Decimal | null
    totalPoolUsd: Decimal | null
    currentParticipants: number | null
    blockchainTxHash: string | null
    paymentMethod: string | null
    commissionRate: Decimal | null
    creatorCommission: Decimal | null
    gameweekId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FantasyLeagueMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    stake: string | null
    limit: number | null
    leagueType: string | null
    leagueMode: string | null
    winners: number | null
    code: string | null
    ownerId: string | null
    realLifeLeague: $Enums.RealLifeLeague | null
    status: string | null
    entryFeeUsd: Decimal | null
    totalPoolUsd: Decimal | null
    currentParticipants: number | null
    blockchainTxHash: string | null
    paymentMethod: string | null
    commissionRate: Decimal | null
    creatorCommission: Decimal | null
    gameweekId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FantasyLeagueCountAggregateOutputType = {
    id: number
    name: number
    description: number
    stake: number
    limit: number
    leagueType: number
    leagueMode: number
    winners: number
    code: number
    ownerId: number
    realLifeLeague: number
    status: number
    winnersArray: number
    entryFeeUsd: number
    totalPoolUsd: number
    currentParticipants: number
    blockchainTxHash: number
    prizeDistribution: number
    paymentMethod: number
    commissionRate: number
    creatorCommission: number
    gameweekId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FantasyLeagueAvgAggregateInputType = {
    limit?: true
    winners?: true
    entryFeeUsd?: true
    totalPoolUsd?: true
    currentParticipants?: true
    commissionRate?: true
    creatorCommission?: true
    gameweekId?: true
  }

  export type FantasyLeagueSumAggregateInputType = {
    limit?: true
    winners?: true
    entryFeeUsd?: true
    totalPoolUsd?: true
    currentParticipants?: true
    commissionRate?: true
    creatorCommission?: true
    gameweekId?: true
  }

  export type FantasyLeagueMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    stake?: true
    limit?: true
    leagueType?: true
    leagueMode?: true
    winners?: true
    code?: true
    ownerId?: true
    realLifeLeague?: true
    status?: true
    entryFeeUsd?: true
    totalPoolUsd?: true
    currentParticipants?: true
    blockchainTxHash?: true
    paymentMethod?: true
    commissionRate?: true
    creatorCommission?: true
    gameweekId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FantasyLeagueMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    stake?: true
    limit?: true
    leagueType?: true
    leagueMode?: true
    winners?: true
    code?: true
    ownerId?: true
    realLifeLeague?: true
    status?: true
    entryFeeUsd?: true
    totalPoolUsd?: true
    currentParticipants?: true
    blockchainTxHash?: true
    paymentMethod?: true
    commissionRate?: true
    creatorCommission?: true
    gameweekId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FantasyLeagueCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    stake?: true
    limit?: true
    leagueType?: true
    leagueMode?: true
    winners?: true
    code?: true
    ownerId?: true
    realLifeLeague?: true
    status?: true
    winnersArray?: true
    entryFeeUsd?: true
    totalPoolUsd?: true
    currentParticipants?: true
    blockchainTxHash?: true
    prizeDistribution?: true
    paymentMethod?: true
    commissionRate?: true
    creatorCommission?: true
    gameweekId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FantasyLeagueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FantasyLeague to aggregate.
     */
    where?: FantasyLeagueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FantasyLeagues to fetch.
     */
    orderBy?: FantasyLeagueOrderByWithRelationInput | FantasyLeagueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FantasyLeagueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FantasyLeagues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FantasyLeagues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FantasyLeagues
    **/
    _count?: true | FantasyLeagueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FantasyLeagueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FantasyLeagueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FantasyLeagueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FantasyLeagueMaxAggregateInputType
  }

  export type GetFantasyLeagueAggregateType<T extends FantasyLeagueAggregateArgs> = {
        [P in keyof T & keyof AggregateFantasyLeague]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFantasyLeague[P]>
      : GetScalarType<T[P], AggregateFantasyLeague[P]>
  }




  export type FantasyLeagueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FantasyLeagueWhereInput
    orderBy?: FantasyLeagueOrderByWithAggregationInput | FantasyLeagueOrderByWithAggregationInput[]
    by: FantasyLeagueScalarFieldEnum[] | FantasyLeagueScalarFieldEnum
    having?: FantasyLeagueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FantasyLeagueCountAggregateInputType | true
    _avg?: FantasyLeagueAvgAggregateInputType
    _sum?: FantasyLeagueSumAggregateInputType
    _min?: FantasyLeagueMinAggregateInputType
    _max?: FantasyLeagueMaxAggregateInputType
  }

  export type FantasyLeagueGroupByOutputType = {
    id: string
    name: string
    description: string | null
    stake: string | null
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    code: string
    ownerId: string | null
    realLifeLeague: $Enums.RealLifeLeague
    status: string
    winnersArray: string[]
    entryFeeUsd: Decimal
    totalPoolUsd: Decimal
    currentParticipants: number
    blockchainTxHash: string | null
    prizeDistribution: JsonValue | null
    paymentMethod: string
    commissionRate: Decimal
    creatorCommission: Decimal
    gameweekId: number
    createdAt: Date
    updatedAt: Date
    _count: FantasyLeagueCountAggregateOutputType | null
    _avg: FantasyLeagueAvgAggregateOutputType | null
    _sum: FantasyLeagueSumAggregateOutputType | null
    _min: FantasyLeagueMinAggregateOutputType | null
    _max: FantasyLeagueMaxAggregateOutputType | null
  }

  type GetFantasyLeagueGroupByPayload<T extends FantasyLeagueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FantasyLeagueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FantasyLeagueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FantasyLeagueGroupByOutputType[P]>
            : GetScalarType<T[P], FantasyLeagueGroupByOutputType[P]>
        }
      >
    >


  export type FantasyLeagueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    stake?: boolean
    limit?: boolean
    leagueType?: boolean
    leagueMode?: boolean
    winners?: boolean
    code?: boolean
    ownerId?: boolean
    realLifeLeague?: boolean
    status?: boolean
    winnersArray?: boolean
    entryFeeUsd?: boolean
    totalPoolUsd?: boolean
    currentParticipants?: boolean
    blockchainTxHash?: boolean
    prizeDistribution?: boolean
    paymentMethod?: boolean
    commissionRate?: boolean
    creatorCommission?: boolean
    gameweekId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | FantasyLeague$ownerArgs<ExtArgs>
    members?: boolean | FantasyLeague$membersArgs<ExtArgs>
    gameweek?: boolean | GameweekDefaultArgs<ExtArgs>
    transactions?: boolean | FantasyLeague$transactionsArgs<ExtArgs>
    _count?: boolean | FantasyLeagueCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fantasyLeague"]>

  export type FantasyLeagueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    stake?: boolean
    limit?: boolean
    leagueType?: boolean
    leagueMode?: boolean
    winners?: boolean
    code?: boolean
    ownerId?: boolean
    realLifeLeague?: boolean
    status?: boolean
    winnersArray?: boolean
    entryFeeUsd?: boolean
    totalPoolUsd?: boolean
    currentParticipants?: boolean
    blockchainTxHash?: boolean
    prizeDistribution?: boolean
    paymentMethod?: boolean
    commissionRate?: boolean
    creatorCommission?: boolean
    gameweekId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | FantasyLeague$ownerArgs<ExtArgs>
    gameweek?: boolean | GameweekDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fantasyLeague"]>

  export type FantasyLeagueSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    stake?: boolean
    limit?: boolean
    leagueType?: boolean
    leagueMode?: boolean
    winners?: boolean
    code?: boolean
    ownerId?: boolean
    realLifeLeague?: boolean
    status?: boolean
    winnersArray?: boolean
    entryFeeUsd?: boolean
    totalPoolUsd?: boolean
    currentParticipants?: boolean
    blockchainTxHash?: boolean
    prizeDistribution?: boolean
    paymentMethod?: boolean
    commissionRate?: boolean
    creatorCommission?: boolean
    gameweekId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | FantasyLeague$ownerArgs<ExtArgs>
    gameweek?: boolean | GameweekDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fantasyLeague"]>

  export type FantasyLeagueSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    stake?: boolean
    limit?: boolean
    leagueType?: boolean
    leagueMode?: boolean
    winners?: boolean
    code?: boolean
    ownerId?: boolean
    realLifeLeague?: boolean
    status?: boolean
    winnersArray?: boolean
    entryFeeUsd?: boolean
    totalPoolUsd?: boolean
    currentParticipants?: boolean
    blockchainTxHash?: boolean
    prizeDistribution?: boolean
    paymentMethod?: boolean
    commissionRate?: boolean
    creatorCommission?: boolean
    gameweekId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FantasyLeagueOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "stake" | "limit" | "leagueType" | "leagueMode" | "winners" | "code" | "ownerId" | "realLifeLeague" | "status" | "winnersArray" | "entryFeeUsd" | "totalPoolUsd" | "currentParticipants" | "blockchainTxHash" | "prizeDistribution" | "paymentMethod" | "commissionRate" | "creatorCommission" | "gameweekId" | "createdAt" | "updatedAt", ExtArgs["result"]["fantasyLeague"]>
  export type FantasyLeagueInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | FantasyLeague$ownerArgs<ExtArgs>
    members?: boolean | FantasyLeague$membersArgs<ExtArgs>
    gameweek?: boolean | GameweekDefaultArgs<ExtArgs>
    transactions?: boolean | FantasyLeague$transactionsArgs<ExtArgs>
    _count?: boolean | FantasyLeagueCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FantasyLeagueIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | FantasyLeague$ownerArgs<ExtArgs>
    gameweek?: boolean | GameweekDefaultArgs<ExtArgs>
  }
  export type FantasyLeagueIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | FantasyLeague$ownerArgs<ExtArgs>
    gameweek?: boolean | GameweekDefaultArgs<ExtArgs>
  }

  export type $FantasyLeaguePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FantasyLeague"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs> | null
      members: Prisma.$FantasyLeagueMembershipPayload<ExtArgs>[]
      gameweek: Prisma.$GameweekPayload<ExtArgs>
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      stake: string | null
      limit: number
      leagueType: string
      leagueMode: string
      winners: number
      code: string
      ownerId: string | null
      realLifeLeague: $Enums.RealLifeLeague
      status: string
      winnersArray: string[]
      entryFeeUsd: Prisma.Decimal
      totalPoolUsd: Prisma.Decimal
      currentParticipants: number
      blockchainTxHash: string | null
      prizeDistribution: Prisma.JsonValue | null
      paymentMethod: string
      commissionRate: Prisma.Decimal
      creatorCommission: Prisma.Decimal
      gameweekId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["fantasyLeague"]>
    composites: {}
  }

  type FantasyLeagueGetPayload<S extends boolean | null | undefined | FantasyLeagueDefaultArgs> = $Result.GetResult<Prisma.$FantasyLeaguePayload, S>

  type FantasyLeagueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FantasyLeagueFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FantasyLeagueCountAggregateInputType | true
    }

  export interface FantasyLeagueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FantasyLeague'], meta: { name: 'FantasyLeague' } }
    /**
     * Find zero or one FantasyLeague that matches the filter.
     * @param {FantasyLeagueFindUniqueArgs} args - Arguments to find a FantasyLeague
     * @example
     * // Get one FantasyLeague
     * const fantasyLeague = await prisma.fantasyLeague.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FantasyLeagueFindUniqueArgs>(args: SelectSubset<T, FantasyLeagueFindUniqueArgs<ExtArgs>>): Prisma__FantasyLeagueClient<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FantasyLeague that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FantasyLeagueFindUniqueOrThrowArgs} args - Arguments to find a FantasyLeague
     * @example
     * // Get one FantasyLeague
     * const fantasyLeague = await prisma.fantasyLeague.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FantasyLeagueFindUniqueOrThrowArgs>(args: SelectSubset<T, FantasyLeagueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FantasyLeagueClient<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FantasyLeague that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueFindFirstArgs} args - Arguments to find a FantasyLeague
     * @example
     * // Get one FantasyLeague
     * const fantasyLeague = await prisma.fantasyLeague.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FantasyLeagueFindFirstArgs>(args?: SelectSubset<T, FantasyLeagueFindFirstArgs<ExtArgs>>): Prisma__FantasyLeagueClient<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FantasyLeague that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueFindFirstOrThrowArgs} args - Arguments to find a FantasyLeague
     * @example
     * // Get one FantasyLeague
     * const fantasyLeague = await prisma.fantasyLeague.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FantasyLeagueFindFirstOrThrowArgs>(args?: SelectSubset<T, FantasyLeagueFindFirstOrThrowArgs<ExtArgs>>): Prisma__FantasyLeagueClient<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FantasyLeagues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FantasyLeagues
     * const fantasyLeagues = await prisma.fantasyLeague.findMany()
     * 
     * // Get first 10 FantasyLeagues
     * const fantasyLeagues = await prisma.fantasyLeague.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fantasyLeagueWithIdOnly = await prisma.fantasyLeague.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FantasyLeagueFindManyArgs>(args?: SelectSubset<T, FantasyLeagueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FantasyLeague.
     * @param {FantasyLeagueCreateArgs} args - Arguments to create a FantasyLeague.
     * @example
     * // Create one FantasyLeague
     * const FantasyLeague = await prisma.fantasyLeague.create({
     *   data: {
     *     // ... data to create a FantasyLeague
     *   }
     * })
     * 
     */
    create<T extends FantasyLeagueCreateArgs>(args: SelectSubset<T, FantasyLeagueCreateArgs<ExtArgs>>): Prisma__FantasyLeagueClient<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FantasyLeagues.
     * @param {FantasyLeagueCreateManyArgs} args - Arguments to create many FantasyLeagues.
     * @example
     * // Create many FantasyLeagues
     * const fantasyLeague = await prisma.fantasyLeague.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FantasyLeagueCreateManyArgs>(args?: SelectSubset<T, FantasyLeagueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FantasyLeagues and returns the data saved in the database.
     * @param {FantasyLeagueCreateManyAndReturnArgs} args - Arguments to create many FantasyLeagues.
     * @example
     * // Create many FantasyLeagues
     * const fantasyLeague = await prisma.fantasyLeague.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FantasyLeagues and only return the `id`
     * const fantasyLeagueWithIdOnly = await prisma.fantasyLeague.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FantasyLeagueCreateManyAndReturnArgs>(args?: SelectSubset<T, FantasyLeagueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FantasyLeague.
     * @param {FantasyLeagueDeleteArgs} args - Arguments to delete one FantasyLeague.
     * @example
     * // Delete one FantasyLeague
     * const FantasyLeague = await prisma.fantasyLeague.delete({
     *   where: {
     *     // ... filter to delete one FantasyLeague
     *   }
     * })
     * 
     */
    delete<T extends FantasyLeagueDeleteArgs>(args: SelectSubset<T, FantasyLeagueDeleteArgs<ExtArgs>>): Prisma__FantasyLeagueClient<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FantasyLeague.
     * @param {FantasyLeagueUpdateArgs} args - Arguments to update one FantasyLeague.
     * @example
     * // Update one FantasyLeague
     * const fantasyLeague = await prisma.fantasyLeague.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FantasyLeagueUpdateArgs>(args: SelectSubset<T, FantasyLeagueUpdateArgs<ExtArgs>>): Prisma__FantasyLeagueClient<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FantasyLeagues.
     * @param {FantasyLeagueDeleteManyArgs} args - Arguments to filter FantasyLeagues to delete.
     * @example
     * // Delete a few FantasyLeagues
     * const { count } = await prisma.fantasyLeague.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FantasyLeagueDeleteManyArgs>(args?: SelectSubset<T, FantasyLeagueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FantasyLeagues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FantasyLeagues
     * const fantasyLeague = await prisma.fantasyLeague.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FantasyLeagueUpdateManyArgs>(args: SelectSubset<T, FantasyLeagueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FantasyLeagues and returns the data updated in the database.
     * @param {FantasyLeagueUpdateManyAndReturnArgs} args - Arguments to update many FantasyLeagues.
     * @example
     * // Update many FantasyLeagues
     * const fantasyLeague = await prisma.fantasyLeague.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FantasyLeagues and only return the `id`
     * const fantasyLeagueWithIdOnly = await prisma.fantasyLeague.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FantasyLeagueUpdateManyAndReturnArgs>(args: SelectSubset<T, FantasyLeagueUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FantasyLeague.
     * @param {FantasyLeagueUpsertArgs} args - Arguments to update or create a FantasyLeague.
     * @example
     * // Update or create a FantasyLeague
     * const fantasyLeague = await prisma.fantasyLeague.upsert({
     *   create: {
     *     // ... data to create a FantasyLeague
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FantasyLeague we want to update
     *   }
     * })
     */
    upsert<T extends FantasyLeagueUpsertArgs>(args: SelectSubset<T, FantasyLeagueUpsertArgs<ExtArgs>>): Prisma__FantasyLeagueClient<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FantasyLeagues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueCountArgs} args - Arguments to filter FantasyLeagues to count.
     * @example
     * // Count the number of FantasyLeagues
     * const count = await prisma.fantasyLeague.count({
     *   where: {
     *     // ... the filter for the FantasyLeagues we want to count
     *   }
     * })
    **/
    count<T extends FantasyLeagueCountArgs>(
      args?: Subset<T, FantasyLeagueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FantasyLeagueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FantasyLeague.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FantasyLeagueAggregateArgs>(args: Subset<T, FantasyLeagueAggregateArgs>): Prisma.PrismaPromise<GetFantasyLeagueAggregateType<T>>

    /**
     * Group by FantasyLeague.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FantasyLeagueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FantasyLeagueGroupByArgs['orderBy'] }
        : { orderBy?: FantasyLeagueGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FantasyLeagueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFantasyLeagueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FantasyLeague model
   */
  readonly fields: FantasyLeagueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FantasyLeague.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FantasyLeagueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends FantasyLeague$ownerArgs<ExtArgs> = {}>(args?: Subset<T, FantasyLeague$ownerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    members<T extends FantasyLeague$membersArgs<ExtArgs> = {}>(args?: Subset<T, FantasyLeague$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    gameweek<T extends GameweekDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameweekDefaultArgs<ExtArgs>>): Prisma__GameweekClient<$Result.GetResult<Prisma.$GameweekPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    transactions<T extends FantasyLeague$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, FantasyLeague$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FantasyLeague model
   */
  interface FantasyLeagueFieldRefs {
    readonly id: FieldRef<"FantasyLeague", 'String'>
    readonly name: FieldRef<"FantasyLeague", 'String'>
    readonly description: FieldRef<"FantasyLeague", 'String'>
    readonly stake: FieldRef<"FantasyLeague", 'String'>
    readonly limit: FieldRef<"FantasyLeague", 'Int'>
    readonly leagueType: FieldRef<"FantasyLeague", 'String'>
    readonly leagueMode: FieldRef<"FantasyLeague", 'String'>
    readonly winners: FieldRef<"FantasyLeague", 'Int'>
    readonly code: FieldRef<"FantasyLeague", 'String'>
    readonly ownerId: FieldRef<"FantasyLeague", 'String'>
    readonly realLifeLeague: FieldRef<"FantasyLeague", 'RealLifeLeague'>
    readonly status: FieldRef<"FantasyLeague", 'String'>
    readonly winnersArray: FieldRef<"FantasyLeague", 'String[]'>
    readonly entryFeeUsd: FieldRef<"FantasyLeague", 'Decimal'>
    readonly totalPoolUsd: FieldRef<"FantasyLeague", 'Decimal'>
    readonly currentParticipants: FieldRef<"FantasyLeague", 'Int'>
    readonly blockchainTxHash: FieldRef<"FantasyLeague", 'String'>
    readonly prizeDistribution: FieldRef<"FantasyLeague", 'Json'>
    readonly paymentMethod: FieldRef<"FantasyLeague", 'String'>
    readonly commissionRate: FieldRef<"FantasyLeague", 'Decimal'>
    readonly creatorCommission: FieldRef<"FantasyLeague", 'Decimal'>
    readonly gameweekId: FieldRef<"FantasyLeague", 'Int'>
    readonly createdAt: FieldRef<"FantasyLeague", 'DateTime'>
    readonly updatedAt: FieldRef<"FantasyLeague", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FantasyLeague findUnique
   */
  export type FantasyLeagueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeague
     */
    select?: FantasyLeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeague
     */
    omit?: FantasyLeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueInclude<ExtArgs> | null
    /**
     * Filter, which FantasyLeague to fetch.
     */
    where: FantasyLeagueWhereUniqueInput
  }

  /**
   * FantasyLeague findUniqueOrThrow
   */
  export type FantasyLeagueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeague
     */
    select?: FantasyLeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeague
     */
    omit?: FantasyLeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueInclude<ExtArgs> | null
    /**
     * Filter, which FantasyLeague to fetch.
     */
    where: FantasyLeagueWhereUniqueInput
  }

  /**
   * FantasyLeague findFirst
   */
  export type FantasyLeagueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeague
     */
    select?: FantasyLeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeague
     */
    omit?: FantasyLeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueInclude<ExtArgs> | null
    /**
     * Filter, which FantasyLeague to fetch.
     */
    where?: FantasyLeagueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FantasyLeagues to fetch.
     */
    orderBy?: FantasyLeagueOrderByWithRelationInput | FantasyLeagueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FantasyLeagues.
     */
    cursor?: FantasyLeagueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FantasyLeagues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FantasyLeagues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FantasyLeagues.
     */
    distinct?: FantasyLeagueScalarFieldEnum | FantasyLeagueScalarFieldEnum[]
  }

  /**
   * FantasyLeague findFirstOrThrow
   */
  export type FantasyLeagueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeague
     */
    select?: FantasyLeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeague
     */
    omit?: FantasyLeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueInclude<ExtArgs> | null
    /**
     * Filter, which FantasyLeague to fetch.
     */
    where?: FantasyLeagueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FantasyLeagues to fetch.
     */
    orderBy?: FantasyLeagueOrderByWithRelationInput | FantasyLeagueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FantasyLeagues.
     */
    cursor?: FantasyLeagueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FantasyLeagues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FantasyLeagues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FantasyLeagues.
     */
    distinct?: FantasyLeagueScalarFieldEnum | FantasyLeagueScalarFieldEnum[]
  }

  /**
   * FantasyLeague findMany
   */
  export type FantasyLeagueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeague
     */
    select?: FantasyLeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeague
     */
    omit?: FantasyLeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueInclude<ExtArgs> | null
    /**
     * Filter, which FantasyLeagues to fetch.
     */
    where?: FantasyLeagueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FantasyLeagues to fetch.
     */
    orderBy?: FantasyLeagueOrderByWithRelationInput | FantasyLeagueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FantasyLeagues.
     */
    cursor?: FantasyLeagueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FantasyLeagues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FantasyLeagues.
     */
    skip?: number
    distinct?: FantasyLeagueScalarFieldEnum | FantasyLeagueScalarFieldEnum[]
  }

  /**
   * FantasyLeague create
   */
  export type FantasyLeagueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeague
     */
    select?: FantasyLeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeague
     */
    omit?: FantasyLeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueInclude<ExtArgs> | null
    /**
     * The data needed to create a FantasyLeague.
     */
    data: XOR<FantasyLeagueCreateInput, FantasyLeagueUncheckedCreateInput>
  }

  /**
   * FantasyLeague createMany
   */
  export type FantasyLeagueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FantasyLeagues.
     */
    data: FantasyLeagueCreateManyInput | FantasyLeagueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FantasyLeague createManyAndReturn
   */
  export type FantasyLeagueCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeague
     */
    select?: FantasyLeagueSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeague
     */
    omit?: FantasyLeagueOmit<ExtArgs> | null
    /**
     * The data used to create many FantasyLeagues.
     */
    data: FantasyLeagueCreateManyInput | FantasyLeagueCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FantasyLeague update
   */
  export type FantasyLeagueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeague
     */
    select?: FantasyLeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeague
     */
    omit?: FantasyLeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueInclude<ExtArgs> | null
    /**
     * The data needed to update a FantasyLeague.
     */
    data: XOR<FantasyLeagueUpdateInput, FantasyLeagueUncheckedUpdateInput>
    /**
     * Choose, which FantasyLeague to update.
     */
    where: FantasyLeagueWhereUniqueInput
  }

  /**
   * FantasyLeague updateMany
   */
  export type FantasyLeagueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FantasyLeagues.
     */
    data: XOR<FantasyLeagueUpdateManyMutationInput, FantasyLeagueUncheckedUpdateManyInput>
    /**
     * Filter which FantasyLeagues to update
     */
    where?: FantasyLeagueWhereInput
    /**
     * Limit how many FantasyLeagues to update.
     */
    limit?: number
  }

  /**
   * FantasyLeague updateManyAndReturn
   */
  export type FantasyLeagueUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeague
     */
    select?: FantasyLeagueSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeague
     */
    omit?: FantasyLeagueOmit<ExtArgs> | null
    /**
     * The data used to update FantasyLeagues.
     */
    data: XOR<FantasyLeagueUpdateManyMutationInput, FantasyLeagueUncheckedUpdateManyInput>
    /**
     * Filter which FantasyLeagues to update
     */
    where?: FantasyLeagueWhereInput
    /**
     * Limit how many FantasyLeagues to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FantasyLeague upsert
   */
  export type FantasyLeagueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeague
     */
    select?: FantasyLeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeague
     */
    omit?: FantasyLeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueInclude<ExtArgs> | null
    /**
     * The filter to search for the FantasyLeague to update in case it exists.
     */
    where: FantasyLeagueWhereUniqueInput
    /**
     * In case the FantasyLeague found by the `where` argument doesn't exist, create a new FantasyLeague with this data.
     */
    create: XOR<FantasyLeagueCreateInput, FantasyLeagueUncheckedCreateInput>
    /**
     * In case the FantasyLeague was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FantasyLeagueUpdateInput, FantasyLeagueUncheckedUpdateInput>
  }

  /**
   * FantasyLeague delete
   */
  export type FantasyLeagueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeague
     */
    select?: FantasyLeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeague
     */
    omit?: FantasyLeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueInclude<ExtArgs> | null
    /**
     * Filter which FantasyLeague to delete.
     */
    where: FantasyLeagueWhereUniqueInput
  }

  /**
   * FantasyLeague deleteMany
   */
  export type FantasyLeagueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FantasyLeagues to delete
     */
    where?: FantasyLeagueWhereInput
    /**
     * Limit how many FantasyLeagues to delete.
     */
    limit?: number
  }

  /**
   * FantasyLeague.owner
   */
  export type FantasyLeague$ownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * FantasyLeague.members
   */
  export type FantasyLeague$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembership
     */
    select?: FantasyLeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembership
     */
    omit?: FantasyLeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipInclude<ExtArgs> | null
    where?: FantasyLeagueMembershipWhereInput
    orderBy?: FantasyLeagueMembershipOrderByWithRelationInput | FantasyLeagueMembershipOrderByWithRelationInput[]
    cursor?: FantasyLeagueMembershipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FantasyLeagueMembershipScalarFieldEnum | FantasyLeagueMembershipScalarFieldEnum[]
  }

  /**
   * FantasyLeague.transactions
   */
  export type FantasyLeague$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * FantasyLeague without action
   */
  export type FantasyLeagueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeague
     */
    select?: FantasyLeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeague
     */
    omit?: FantasyLeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueInclude<ExtArgs> | null
  }


  /**
   * Model FantasyLeagueMembership
   */

  export type AggregateFantasyLeagueMembership = {
    _count: FantasyLeagueMembershipCountAggregateOutputType | null
    _avg: FantasyLeagueMembershipAvgAggregateOutputType | null
    _sum: FantasyLeagueMembershipSumAggregateOutputType | null
    _min: FantasyLeagueMembershipMinAggregateOutputType | null
    _max: FantasyLeagueMembershipMaxAggregateOutputType | null
  }

  export type FantasyLeagueMembershipAvgAggregateOutputType = {
    stakeAmount: Decimal | null
    position: number | null
    score: Decimal | null
    payoutAmount: Decimal | null
  }

  export type FantasyLeagueMembershipSumAggregateOutputType = {
    stakeAmount: Decimal | null
    position: number | null
    score: Decimal | null
    payoutAmount: Decimal | null
  }

  export type FantasyLeagueMembershipMinAggregateOutputType = {
    id: string | null
    userId: string | null
    leagueId: string | null
    teamName: string | null
    stakeAmount: Decimal | null
    position: number | null
    score: Decimal | null
    payoutAmount: Decimal | null
    payoutStatus: string | null
    blockchainTxHash: string | null
    status: string | null
    joinedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FantasyLeagueMembershipMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    leagueId: string | null
    teamName: string | null
    stakeAmount: Decimal | null
    position: number | null
    score: Decimal | null
    payoutAmount: Decimal | null
    payoutStatus: string | null
    blockchainTxHash: string | null
    status: string | null
    joinedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FantasyLeagueMembershipCountAggregateOutputType = {
    id: number
    userId: number
    leagueId: number
    teamName: number
    stakeAmount: number
    position: number
    score: number
    payoutAmount: number
    payoutStatus: number
    blockchainTxHash: number
    status: number
    joinedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FantasyLeagueMembershipAvgAggregateInputType = {
    stakeAmount?: true
    position?: true
    score?: true
    payoutAmount?: true
  }

  export type FantasyLeagueMembershipSumAggregateInputType = {
    stakeAmount?: true
    position?: true
    score?: true
    payoutAmount?: true
  }

  export type FantasyLeagueMembershipMinAggregateInputType = {
    id?: true
    userId?: true
    leagueId?: true
    teamName?: true
    stakeAmount?: true
    position?: true
    score?: true
    payoutAmount?: true
    payoutStatus?: true
    blockchainTxHash?: true
    status?: true
    joinedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FantasyLeagueMembershipMaxAggregateInputType = {
    id?: true
    userId?: true
    leagueId?: true
    teamName?: true
    stakeAmount?: true
    position?: true
    score?: true
    payoutAmount?: true
    payoutStatus?: true
    blockchainTxHash?: true
    status?: true
    joinedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FantasyLeagueMembershipCountAggregateInputType = {
    id?: true
    userId?: true
    leagueId?: true
    teamName?: true
    stakeAmount?: true
    position?: true
    score?: true
    payoutAmount?: true
    payoutStatus?: true
    blockchainTxHash?: true
    status?: true
    joinedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FantasyLeagueMembershipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FantasyLeagueMembership to aggregate.
     */
    where?: FantasyLeagueMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FantasyLeagueMemberships to fetch.
     */
    orderBy?: FantasyLeagueMembershipOrderByWithRelationInput | FantasyLeagueMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FantasyLeagueMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FantasyLeagueMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FantasyLeagueMemberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FantasyLeagueMemberships
    **/
    _count?: true | FantasyLeagueMembershipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FantasyLeagueMembershipAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FantasyLeagueMembershipSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FantasyLeagueMembershipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FantasyLeagueMembershipMaxAggregateInputType
  }

  export type GetFantasyLeagueMembershipAggregateType<T extends FantasyLeagueMembershipAggregateArgs> = {
        [P in keyof T & keyof AggregateFantasyLeagueMembership]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFantasyLeagueMembership[P]>
      : GetScalarType<T[P], AggregateFantasyLeagueMembership[P]>
  }




  export type FantasyLeagueMembershipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FantasyLeagueMembershipWhereInput
    orderBy?: FantasyLeagueMembershipOrderByWithAggregationInput | FantasyLeagueMembershipOrderByWithAggregationInput[]
    by: FantasyLeagueMembershipScalarFieldEnum[] | FantasyLeagueMembershipScalarFieldEnum
    having?: FantasyLeagueMembershipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FantasyLeagueMembershipCountAggregateInputType | true
    _avg?: FantasyLeagueMembershipAvgAggregateInputType
    _sum?: FantasyLeagueMembershipSumAggregateInputType
    _min?: FantasyLeagueMembershipMinAggregateInputType
    _max?: FantasyLeagueMembershipMaxAggregateInputType
  }

  export type FantasyLeagueMembershipGroupByOutputType = {
    id: string
    userId: string
    leagueId: string
    teamName: string | null
    stakeAmount: Decimal | null
    position: number | null
    score: Decimal | null
    payoutAmount: Decimal | null
    payoutStatus: string
    blockchainTxHash: string | null
    status: string
    joinedAt: Date
    createdAt: Date
    updatedAt: Date
    _count: FantasyLeagueMembershipCountAggregateOutputType | null
    _avg: FantasyLeagueMembershipAvgAggregateOutputType | null
    _sum: FantasyLeagueMembershipSumAggregateOutputType | null
    _min: FantasyLeagueMembershipMinAggregateOutputType | null
    _max: FantasyLeagueMembershipMaxAggregateOutputType | null
  }

  type GetFantasyLeagueMembershipGroupByPayload<T extends FantasyLeagueMembershipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FantasyLeagueMembershipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FantasyLeagueMembershipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FantasyLeagueMembershipGroupByOutputType[P]>
            : GetScalarType<T[P], FantasyLeagueMembershipGroupByOutputType[P]>
        }
      >
    >


  export type FantasyLeagueMembershipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    leagueId?: boolean
    teamName?: boolean
    stakeAmount?: boolean
    position?: boolean
    score?: boolean
    payoutAmount?: boolean
    payoutStatus?: boolean
    blockchainTxHash?: boolean
    status?: boolean
    joinedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    league?: boolean | FantasyLeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fantasyLeagueMembership"]>

  export type FantasyLeagueMembershipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    leagueId?: boolean
    teamName?: boolean
    stakeAmount?: boolean
    position?: boolean
    score?: boolean
    payoutAmount?: boolean
    payoutStatus?: boolean
    blockchainTxHash?: boolean
    status?: boolean
    joinedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    league?: boolean | FantasyLeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fantasyLeagueMembership"]>

  export type FantasyLeagueMembershipSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    leagueId?: boolean
    teamName?: boolean
    stakeAmount?: boolean
    position?: boolean
    score?: boolean
    payoutAmount?: boolean
    payoutStatus?: boolean
    blockchainTxHash?: boolean
    status?: boolean
    joinedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    league?: boolean | FantasyLeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fantasyLeagueMembership"]>

  export type FantasyLeagueMembershipSelectScalar = {
    id?: boolean
    userId?: boolean
    leagueId?: boolean
    teamName?: boolean
    stakeAmount?: boolean
    position?: boolean
    score?: boolean
    payoutAmount?: boolean
    payoutStatus?: boolean
    blockchainTxHash?: boolean
    status?: boolean
    joinedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FantasyLeagueMembershipOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "leagueId" | "teamName" | "stakeAmount" | "position" | "score" | "payoutAmount" | "payoutStatus" | "blockchainTxHash" | "status" | "joinedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["fantasyLeagueMembership"]>
  export type FantasyLeagueMembershipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    league?: boolean | FantasyLeagueDefaultArgs<ExtArgs>
  }
  export type FantasyLeagueMembershipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    league?: boolean | FantasyLeagueDefaultArgs<ExtArgs>
  }
  export type FantasyLeagueMembershipIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    league?: boolean | FantasyLeagueDefaultArgs<ExtArgs>
  }

  export type $FantasyLeagueMembershipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FantasyLeagueMembership"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      league: Prisma.$FantasyLeaguePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      leagueId: string
      teamName: string | null
      stakeAmount: Prisma.Decimal | null
      position: number | null
      score: Prisma.Decimal | null
      payoutAmount: Prisma.Decimal | null
      payoutStatus: string
      blockchainTxHash: string | null
      status: string
      joinedAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["fantasyLeagueMembership"]>
    composites: {}
  }

  type FantasyLeagueMembershipGetPayload<S extends boolean | null | undefined | FantasyLeagueMembershipDefaultArgs> = $Result.GetResult<Prisma.$FantasyLeagueMembershipPayload, S>

  type FantasyLeagueMembershipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FantasyLeagueMembershipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FantasyLeagueMembershipCountAggregateInputType | true
    }

  export interface FantasyLeagueMembershipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FantasyLeagueMembership'], meta: { name: 'FantasyLeagueMembership' } }
    /**
     * Find zero or one FantasyLeagueMembership that matches the filter.
     * @param {FantasyLeagueMembershipFindUniqueArgs} args - Arguments to find a FantasyLeagueMembership
     * @example
     * // Get one FantasyLeagueMembership
     * const fantasyLeagueMembership = await prisma.fantasyLeagueMembership.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FantasyLeagueMembershipFindUniqueArgs>(args: SelectSubset<T, FantasyLeagueMembershipFindUniqueArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FantasyLeagueMembership that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FantasyLeagueMembershipFindUniqueOrThrowArgs} args - Arguments to find a FantasyLeagueMembership
     * @example
     * // Get one FantasyLeagueMembership
     * const fantasyLeagueMembership = await prisma.fantasyLeagueMembership.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FantasyLeagueMembershipFindUniqueOrThrowArgs>(args: SelectSubset<T, FantasyLeagueMembershipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FantasyLeagueMembership that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueMembershipFindFirstArgs} args - Arguments to find a FantasyLeagueMembership
     * @example
     * // Get one FantasyLeagueMembership
     * const fantasyLeagueMembership = await prisma.fantasyLeagueMembership.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FantasyLeagueMembershipFindFirstArgs>(args?: SelectSubset<T, FantasyLeagueMembershipFindFirstArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FantasyLeagueMembership that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueMembershipFindFirstOrThrowArgs} args - Arguments to find a FantasyLeagueMembership
     * @example
     * // Get one FantasyLeagueMembership
     * const fantasyLeagueMembership = await prisma.fantasyLeagueMembership.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FantasyLeagueMembershipFindFirstOrThrowArgs>(args?: SelectSubset<T, FantasyLeagueMembershipFindFirstOrThrowArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FantasyLeagueMemberships that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueMembershipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FantasyLeagueMemberships
     * const fantasyLeagueMemberships = await prisma.fantasyLeagueMembership.findMany()
     * 
     * // Get first 10 FantasyLeagueMemberships
     * const fantasyLeagueMemberships = await prisma.fantasyLeagueMembership.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fantasyLeagueMembershipWithIdOnly = await prisma.fantasyLeagueMembership.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FantasyLeagueMembershipFindManyArgs>(args?: SelectSubset<T, FantasyLeagueMembershipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FantasyLeagueMembership.
     * @param {FantasyLeagueMembershipCreateArgs} args - Arguments to create a FantasyLeagueMembership.
     * @example
     * // Create one FantasyLeagueMembership
     * const FantasyLeagueMembership = await prisma.fantasyLeagueMembership.create({
     *   data: {
     *     // ... data to create a FantasyLeagueMembership
     *   }
     * })
     * 
     */
    create<T extends FantasyLeagueMembershipCreateArgs>(args: SelectSubset<T, FantasyLeagueMembershipCreateArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FantasyLeagueMemberships.
     * @param {FantasyLeagueMembershipCreateManyArgs} args - Arguments to create many FantasyLeagueMemberships.
     * @example
     * // Create many FantasyLeagueMemberships
     * const fantasyLeagueMembership = await prisma.fantasyLeagueMembership.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FantasyLeagueMembershipCreateManyArgs>(args?: SelectSubset<T, FantasyLeagueMembershipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FantasyLeagueMemberships and returns the data saved in the database.
     * @param {FantasyLeagueMembershipCreateManyAndReturnArgs} args - Arguments to create many FantasyLeagueMemberships.
     * @example
     * // Create many FantasyLeagueMemberships
     * const fantasyLeagueMembership = await prisma.fantasyLeagueMembership.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FantasyLeagueMemberships and only return the `id`
     * const fantasyLeagueMembershipWithIdOnly = await prisma.fantasyLeagueMembership.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FantasyLeagueMembershipCreateManyAndReturnArgs>(args?: SelectSubset<T, FantasyLeagueMembershipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FantasyLeagueMembership.
     * @param {FantasyLeagueMembershipDeleteArgs} args - Arguments to delete one FantasyLeagueMembership.
     * @example
     * // Delete one FantasyLeagueMembership
     * const FantasyLeagueMembership = await prisma.fantasyLeagueMembership.delete({
     *   where: {
     *     // ... filter to delete one FantasyLeagueMembership
     *   }
     * })
     * 
     */
    delete<T extends FantasyLeagueMembershipDeleteArgs>(args: SelectSubset<T, FantasyLeagueMembershipDeleteArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FantasyLeagueMembership.
     * @param {FantasyLeagueMembershipUpdateArgs} args - Arguments to update one FantasyLeagueMembership.
     * @example
     * // Update one FantasyLeagueMembership
     * const fantasyLeagueMembership = await prisma.fantasyLeagueMembership.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FantasyLeagueMembershipUpdateArgs>(args: SelectSubset<T, FantasyLeagueMembershipUpdateArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FantasyLeagueMemberships.
     * @param {FantasyLeagueMembershipDeleteManyArgs} args - Arguments to filter FantasyLeagueMemberships to delete.
     * @example
     * // Delete a few FantasyLeagueMemberships
     * const { count } = await prisma.fantasyLeagueMembership.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FantasyLeagueMembershipDeleteManyArgs>(args?: SelectSubset<T, FantasyLeagueMembershipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FantasyLeagueMemberships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueMembershipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FantasyLeagueMemberships
     * const fantasyLeagueMembership = await prisma.fantasyLeagueMembership.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FantasyLeagueMembershipUpdateManyArgs>(args: SelectSubset<T, FantasyLeagueMembershipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FantasyLeagueMemberships and returns the data updated in the database.
     * @param {FantasyLeagueMembershipUpdateManyAndReturnArgs} args - Arguments to update many FantasyLeagueMemberships.
     * @example
     * // Update many FantasyLeagueMemberships
     * const fantasyLeagueMembership = await prisma.fantasyLeagueMembership.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FantasyLeagueMemberships and only return the `id`
     * const fantasyLeagueMembershipWithIdOnly = await prisma.fantasyLeagueMembership.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FantasyLeagueMembershipUpdateManyAndReturnArgs>(args: SelectSubset<T, FantasyLeagueMembershipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FantasyLeagueMembership.
     * @param {FantasyLeagueMembershipUpsertArgs} args - Arguments to update or create a FantasyLeagueMembership.
     * @example
     * // Update or create a FantasyLeagueMembership
     * const fantasyLeagueMembership = await prisma.fantasyLeagueMembership.upsert({
     *   create: {
     *     // ... data to create a FantasyLeagueMembership
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FantasyLeagueMembership we want to update
     *   }
     * })
     */
    upsert<T extends FantasyLeagueMembershipUpsertArgs>(args: SelectSubset<T, FantasyLeagueMembershipUpsertArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FantasyLeagueMemberships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueMembershipCountArgs} args - Arguments to filter FantasyLeagueMemberships to count.
     * @example
     * // Count the number of FantasyLeagueMemberships
     * const count = await prisma.fantasyLeagueMembership.count({
     *   where: {
     *     // ... the filter for the FantasyLeagueMemberships we want to count
     *   }
     * })
    **/
    count<T extends FantasyLeagueMembershipCountArgs>(
      args?: Subset<T, FantasyLeagueMembershipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FantasyLeagueMembershipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FantasyLeagueMembership.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueMembershipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FantasyLeagueMembershipAggregateArgs>(args: Subset<T, FantasyLeagueMembershipAggregateArgs>): Prisma.PrismaPromise<GetFantasyLeagueMembershipAggregateType<T>>

    /**
     * Group by FantasyLeagueMembership.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueMembershipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FantasyLeagueMembershipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FantasyLeagueMembershipGroupByArgs['orderBy'] }
        : { orderBy?: FantasyLeagueMembershipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FantasyLeagueMembershipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFantasyLeagueMembershipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FantasyLeagueMembership model
   */
  readonly fields: FantasyLeagueMembershipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FantasyLeagueMembership.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FantasyLeagueMembershipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    league<T extends FantasyLeagueDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FantasyLeagueDefaultArgs<ExtArgs>>): Prisma__FantasyLeagueClient<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FantasyLeagueMembership model
   */
  interface FantasyLeagueMembershipFieldRefs {
    readonly id: FieldRef<"FantasyLeagueMembership", 'String'>
    readonly userId: FieldRef<"FantasyLeagueMembership", 'String'>
    readonly leagueId: FieldRef<"FantasyLeagueMembership", 'String'>
    readonly teamName: FieldRef<"FantasyLeagueMembership", 'String'>
    readonly stakeAmount: FieldRef<"FantasyLeagueMembership", 'Decimal'>
    readonly position: FieldRef<"FantasyLeagueMembership", 'Int'>
    readonly score: FieldRef<"FantasyLeagueMembership", 'Decimal'>
    readonly payoutAmount: FieldRef<"FantasyLeagueMembership", 'Decimal'>
    readonly payoutStatus: FieldRef<"FantasyLeagueMembership", 'String'>
    readonly blockchainTxHash: FieldRef<"FantasyLeagueMembership", 'String'>
    readonly status: FieldRef<"FantasyLeagueMembership", 'String'>
    readonly joinedAt: FieldRef<"FantasyLeagueMembership", 'DateTime'>
    readonly createdAt: FieldRef<"FantasyLeagueMembership", 'DateTime'>
    readonly updatedAt: FieldRef<"FantasyLeagueMembership", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FantasyLeagueMembership findUnique
   */
  export type FantasyLeagueMembershipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembership
     */
    select?: FantasyLeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembership
     */
    omit?: FantasyLeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipInclude<ExtArgs> | null
    /**
     * Filter, which FantasyLeagueMembership to fetch.
     */
    where: FantasyLeagueMembershipWhereUniqueInput
  }

  /**
   * FantasyLeagueMembership findUniqueOrThrow
   */
  export type FantasyLeagueMembershipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembership
     */
    select?: FantasyLeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembership
     */
    omit?: FantasyLeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipInclude<ExtArgs> | null
    /**
     * Filter, which FantasyLeagueMembership to fetch.
     */
    where: FantasyLeagueMembershipWhereUniqueInput
  }

  /**
   * FantasyLeagueMembership findFirst
   */
  export type FantasyLeagueMembershipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembership
     */
    select?: FantasyLeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembership
     */
    omit?: FantasyLeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipInclude<ExtArgs> | null
    /**
     * Filter, which FantasyLeagueMembership to fetch.
     */
    where?: FantasyLeagueMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FantasyLeagueMemberships to fetch.
     */
    orderBy?: FantasyLeagueMembershipOrderByWithRelationInput | FantasyLeagueMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FantasyLeagueMemberships.
     */
    cursor?: FantasyLeagueMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FantasyLeagueMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FantasyLeagueMemberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FantasyLeagueMemberships.
     */
    distinct?: FantasyLeagueMembershipScalarFieldEnum | FantasyLeagueMembershipScalarFieldEnum[]
  }

  /**
   * FantasyLeagueMembership findFirstOrThrow
   */
  export type FantasyLeagueMembershipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembership
     */
    select?: FantasyLeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembership
     */
    omit?: FantasyLeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipInclude<ExtArgs> | null
    /**
     * Filter, which FantasyLeagueMembership to fetch.
     */
    where?: FantasyLeagueMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FantasyLeagueMemberships to fetch.
     */
    orderBy?: FantasyLeagueMembershipOrderByWithRelationInput | FantasyLeagueMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FantasyLeagueMemberships.
     */
    cursor?: FantasyLeagueMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FantasyLeagueMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FantasyLeagueMemberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FantasyLeagueMemberships.
     */
    distinct?: FantasyLeagueMembershipScalarFieldEnum | FantasyLeagueMembershipScalarFieldEnum[]
  }

  /**
   * FantasyLeagueMembership findMany
   */
  export type FantasyLeagueMembershipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembership
     */
    select?: FantasyLeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembership
     */
    omit?: FantasyLeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipInclude<ExtArgs> | null
    /**
     * Filter, which FantasyLeagueMemberships to fetch.
     */
    where?: FantasyLeagueMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FantasyLeagueMemberships to fetch.
     */
    orderBy?: FantasyLeagueMembershipOrderByWithRelationInput | FantasyLeagueMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FantasyLeagueMemberships.
     */
    cursor?: FantasyLeagueMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FantasyLeagueMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FantasyLeagueMemberships.
     */
    skip?: number
    distinct?: FantasyLeagueMembershipScalarFieldEnum | FantasyLeagueMembershipScalarFieldEnum[]
  }

  /**
   * FantasyLeagueMembership create
   */
  export type FantasyLeagueMembershipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembership
     */
    select?: FantasyLeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembership
     */
    omit?: FantasyLeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipInclude<ExtArgs> | null
    /**
     * The data needed to create a FantasyLeagueMembership.
     */
    data: XOR<FantasyLeagueMembershipCreateInput, FantasyLeagueMembershipUncheckedCreateInput>
  }

  /**
   * FantasyLeagueMembership createMany
   */
  export type FantasyLeagueMembershipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FantasyLeagueMemberships.
     */
    data: FantasyLeagueMembershipCreateManyInput | FantasyLeagueMembershipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FantasyLeagueMembership createManyAndReturn
   */
  export type FantasyLeagueMembershipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembership
     */
    select?: FantasyLeagueMembershipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembership
     */
    omit?: FantasyLeagueMembershipOmit<ExtArgs> | null
    /**
     * The data used to create many FantasyLeagueMemberships.
     */
    data: FantasyLeagueMembershipCreateManyInput | FantasyLeagueMembershipCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FantasyLeagueMembership update
   */
  export type FantasyLeagueMembershipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembership
     */
    select?: FantasyLeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembership
     */
    omit?: FantasyLeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipInclude<ExtArgs> | null
    /**
     * The data needed to update a FantasyLeagueMembership.
     */
    data: XOR<FantasyLeagueMembershipUpdateInput, FantasyLeagueMembershipUncheckedUpdateInput>
    /**
     * Choose, which FantasyLeagueMembership to update.
     */
    where: FantasyLeagueMembershipWhereUniqueInput
  }

  /**
   * FantasyLeagueMembership updateMany
   */
  export type FantasyLeagueMembershipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FantasyLeagueMemberships.
     */
    data: XOR<FantasyLeagueMembershipUpdateManyMutationInput, FantasyLeagueMembershipUncheckedUpdateManyInput>
    /**
     * Filter which FantasyLeagueMemberships to update
     */
    where?: FantasyLeagueMembershipWhereInput
    /**
     * Limit how many FantasyLeagueMemberships to update.
     */
    limit?: number
  }

  /**
   * FantasyLeagueMembership updateManyAndReturn
   */
  export type FantasyLeagueMembershipUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembership
     */
    select?: FantasyLeagueMembershipSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembership
     */
    omit?: FantasyLeagueMembershipOmit<ExtArgs> | null
    /**
     * The data used to update FantasyLeagueMemberships.
     */
    data: XOR<FantasyLeagueMembershipUpdateManyMutationInput, FantasyLeagueMembershipUncheckedUpdateManyInput>
    /**
     * Filter which FantasyLeagueMemberships to update
     */
    where?: FantasyLeagueMembershipWhereInput
    /**
     * Limit how many FantasyLeagueMemberships to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FantasyLeagueMembership upsert
   */
  export type FantasyLeagueMembershipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembership
     */
    select?: FantasyLeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembership
     */
    omit?: FantasyLeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipInclude<ExtArgs> | null
    /**
     * The filter to search for the FantasyLeagueMembership to update in case it exists.
     */
    where: FantasyLeagueMembershipWhereUniqueInput
    /**
     * In case the FantasyLeagueMembership found by the `where` argument doesn't exist, create a new FantasyLeagueMembership with this data.
     */
    create: XOR<FantasyLeagueMembershipCreateInput, FantasyLeagueMembershipUncheckedCreateInput>
    /**
     * In case the FantasyLeagueMembership was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FantasyLeagueMembershipUpdateInput, FantasyLeagueMembershipUncheckedUpdateInput>
  }

  /**
   * FantasyLeagueMembership delete
   */
  export type FantasyLeagueMembershipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembership
     */
    select?: FantasyLeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembership
     */
    omit?: FantasyLeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipInclude<ExtArgs> | null
    /**
     * Filter which FantasyLeagueMembership to delete.
     */
    where: FantasyLeagueMembershipWhereUniqueInput
  }

  /**
   * FantasyLeagueMembership deleteMany
   */
  export type FantasyLeagueMembershipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FantasyLeagueMemberships to delete
     */
    where?: FantasyLeagueMembershipWhereInput
    /**
     * Limit how many FantasyLeagueMemberships to delete.
     */
    limit?: number
  }

  /**
   * FantasyLeagueMembership without action
   */
  export type FantasyLeagueMembershipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembership
     */
    select?: FantasyLeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembership
     */
    omit?: FantasyLeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipInclude<ExtArgs> | null
  }


  /**
   * Model Gameweek
   */

  export type AggregateGameweek = {
    _count: GameweekCountAggregateOutputType | null
    _avg: GameweekAvgAggregateOutputType | null
    _sum: GameweekSumAggregateOutputType | null
    _min: GameweekMinAggregateOutputType | null
    _max: GameweekMaxAggregateOutputType | null
  }

  export type GameweekAvgAggregateOutputType = {
    id: number | null
  }

  export type GameweekSumAggregateOutputType = {
    id: number | null
  }

  export type GameweekMinAggregateOutputType = {
    id: number | null
    deadline: Date | null
    isActive: boolean | null
    realLifeLeague: $Enums.RealLifeLeague | null
  }

  export type GameweekMaxAggregateOutputType = {
    id: number | null
    deadline: Date | null
    isActive: boolean | null
    realLifeLeague: $Enums.RealLifeLeague | null
  }

  export type GameweekCountAggregateOutputType = {
    id: number
    deadline: number
    isActive: number
    realLifeLeague: number
    _all: number
  }


  export type GameweekAvgAggregateInputType = {
    id?: true
  }

  export type GameweekSumAggregateInputType = {
    id?: true
  }

  export type GameweekMinAggregateInputType = {
    id?: true
    deadline?: true
    isActive?: true
    realLifeLeague?: true
  }

  export type GameweekMaxAggregateInputType = {
    id?: true
    deadline?: true
    isActive?: true
    realLifeLeague?: true
  }

  export type GameweekCountAggregateInputType = {
    id?: true
    deadline?: true
    isActive?: true
    realLifeLeague?: true
    _all?: true
  }

  export type GameweekAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Gameweek to aggregate.
     */
    where?: GameweekWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gameweeks to fetch.
     */
    orderBy?: GameweekOrderByWithRelationInput | GameweekOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameweekWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gameweeks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gameweeks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Gameweeks
    **/
    _count?: true | GameweekCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameweekAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameweekSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameweekMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameweekMaxAggregateInputType
  }

  export type GetGameweekAggregateType<T extends GameweekAggregateArgs> = {
        [P in keyof T & keyof AggregateGameweek]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameweek[P]>
      : GetScalarType<T[P], AggregateGameweek[P]>
  }




  export type GameweekGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameweekWhereInput
    orderBy?: GameweekOrderByWithAggregationInput | GameweekOrderByWithAggregationInput[]
    by: GameweekScalarFieldEnum[] | GameweekScalarFieldEnum
    having?: GameweekScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameweekCountAggregateInputType | true
    _avg?: GameweekAvgAggregateInputType
    _sum?: GameweekSumAggregateInputType
    _min?: GameweekMinAggregateInputType
    _max?: GameweekMaxAggregateInputType
  }

  export type GameweekGroupByOutputType = {
    id: number
    deadline: Date
    isActive: boolean
    realLifeLeague: $Enums.RealLifeLeague
    _count: GameweekCountAggregateOutputType | null
    _avg: GameweekAvgAggregateOutputType | null
    _sum: GameweekSumAggregateOutputType | null
    _min: GameweekMinAggregateOutputType | null
    _max: GameweekMaxAggregateOutputType | null
  }

  type GetGameweekGroupByPayload<T extends GameweekGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameweekGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameweekGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameweekGroupByOutputType[P]>
            : GetScalarType<T[P], GameweekGroupByOutputType[P]>
        }
      >
    >


  export type GameweekSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deadline?: boolean
    isActive?: boolean
    realLifeLeague?: boolean
    leagues?: boolean | Gameweek$leaguesArgs<ExtArgs>
    _count?: boolean | GameweekCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameweek"]>

  export type GameweekSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deadline?: boolean
    isActive?: boolean
    realLifeLeague?: boolean
  }, ExtArgs["result"]["gameweek"]>

  export type GameweekSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deadline?: boolean
    isActive?: boolean
    realLifeLeague?: boolean
  }, ExtArgs["result"]["gameweek"]>

  export type GameweekSelectScalar = {
    id?: boolean
    deadline?: boolean
    isActive?: boolean
    realLifeLeague?: boolean
  }

  export type GameweekOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "deadline" | "isActive" | "realLifeLeague", ExtArgs["result"]["gameweek"]>
  export type GameweekInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    leagues?: boolean | Gameweek$leaguesArgs<ExtArgs>
    _count?: boolean | GameweekCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GameweekIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type GameweekIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GameweekPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Gameweek"
    objects: {
      leagues: Prisma.$FantasyLeaguePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      deadline: Date
      isActive: boolean
      realLifeLeague: $Enums.RealLifeLeague
    }, ExtArgs["result"]["gameweek"]>
    composites: {}
  }

  type GameweekGetPayload<S extends boolean | null | undefined | GameweekDefaultArgs> = $Result.GetResult<Prisma.$GameweekPayload, S>

  type GameweekCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameweekFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameweekCountAggregateInputType | true
    }

  export interface GameweekDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Gameweek'], meta: { name: 'Gameweek' } }
    /**
     * Find zero or one Gameweek that matches the filter.
     * @param {GameweekFindUniqueArgs} args - Arguments to find a Gameweek
     * @example
     * // Get one Gameweek
     * const gameweek = await prisma.gameweek.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameweekFindUniqueArgs>(args: SelectSubset<T, GameweekFindUniqueArgs<ExtArgs>>): Prisma__GameweekClient<$Result.GetResult<Prisma.$GameweekPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Gameweek that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameweekFindUniqueOrThrowArgs} args - Arguments to find a Gameweek
     * @example
     * // Get one Gameweek
     * const gameweek = await prisma.gameweek.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameweekFindUniqueOrThrowArgs>(args: SelectSubset<T, GameweekFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameweekClient<$Result.GetResult<Prisma.$GameweekPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Gameweek that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameweekFindFirstArgs} args - Arguments to find a Gameweek
     * @example
     * // Get one Gameweek
     * const gameweek = await prisma.gameweek.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameweekFindFirstArgs>(args?: SelectSubset<T, GameweekFindFirstArgs<ExtArgs>>): Prisma__GameweekClient<$Result.GetResult<Prisma.$GameweekPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Gameweek that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameweekFindFirstOrThrowArgs} args - Arguments to find a Gameweek
     * @example
     * // Get one Gameweek
     * const gameweek = await prisma.gameweek.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameweekFindFirstOrThrowArgs>(args?: SelectSubset<T, GameweekFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameweekClient<$Result.GetResult<Prisma.$GameweekPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Gameweeks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameweekFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Gameweeks
     * const gameweeks = await prisma.gameweek.findMany()
     * 
     * // Get first 10 Gameweeks
     * const gameweeks = await prisma.gameweek.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameweekWithIdOnly = await prisma.gameweek.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameweekFindManyArgs>(args?: SelectSubset<T, GameweekFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameweekPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Gameweek.
     * @param {GameweekCreateArgs} args - Arguments to create a Gameweek.
     * @example
     * // Create one Gameweek
     * const Gameweek = await prisma.gameweek.create({
     *   data: {
     *     // ... data to create a Gameweek
     *   }
     * })
     * 
     */
    create<T extends GameweekCreateArgs>(args: SelectSubset<T, GameweekCreateArgs<ExtArgs>>): Prisma__GameweekClient<$Result.GetResult<Prisma.$GameweekPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Gameweeks.
     * @param {GameweekCreateManyArgs} args - Arguments to create many Gameweeks.
     * @example
     * // Create many Gameweeks
     * const gameweek = await prisma.gameweek.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameweekCreateManyArgs>(args?: SelectSubset<T, GameweekCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Gameweeks and returns the data saved in the database.
     * @param {GameweekCreateManyAndReturnArgs} args - Arguments to create many Gameweeks.
     * @example
     * // Create many Gameweeks
     * const gameweek = await prisma.gameweek.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Gameweeks and only return the `id`
     * const gameweekWithIdOnly = await prisma.gameweek.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameweekCreateManyAndReturnArgs>(args?: SelectSubset<T, GameweekCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameweekPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Gameweek.
     * @param {GameweekDeleteArgs} args - Arguments to delete one Gameweek.
     * @example
     * // Delete one Gameweek
     * const Gameweek = await prisma.gameweek.delete({
     *   where: {
     *     // ... filter to delete one Gameweek
     *   }
     * })
     * 
     */
    delete<T extends GameweekDeleteArgs>(args: SelectSubset<T, GameweekDeleteArgs<ExtArgs>>): Prisma__GameweekClient<$Result.GetResult<Prisma.$GameweekPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Gameweek.
     * @param {GameweekUpdateArgs} args - Arguments to update one Gameweek.
     * @example
     * // Update one Gameweek
     * const gameweek = await prisma.gameweek.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameweekUpdateArgs>(args: SelectSubset<T, GameweekUpdateArgs<ExtArgs>>): Prisma__GameweekClient<$Result.GetResult<Prisma.$GameweekPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Gameweeks.
     * @param {GameweekDeleteManyArgs} args - Arguments to filter Gameweeks to delete.
     * @example
     * // Delete a few Gameweeks
     * const { count } = await prisma.gameweek.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameweekDeleteManyArgs>(args?: SelectSubset<T, GameweekDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Gameweeks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameweekUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Gameweeks
     * const gameweek = await prisma.gameweek.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameweekUpdateManyArgs>(args: SelectSubset<T, GameweekUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Gameweeks and returns the data updated in the database.
     * @param {GameweekUpdateManyAndReturnArgs} args - Arguments to update many Gameweeks.
     * @example
     * // Update many Gameweeks
     * const gameweek = await prisma.gameweek.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Gameweeks and only return the `id`
     * const gameweekWithIdOnly = await prisma.gameweek.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameweekUpdateManyAndReturnArgs>(args: SelectSubset<T, GameweekUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameweekPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Gameweek.
     * @param {GameweekUpsertArgs} args - Arguments to update or create a Gameweek.
     * @example
     * // Update or create a Gameweek
     * const gameweek = await prisma.gameweek.upsert({
     *   create: {
     *     // ... data to create a Gameweek
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Gameweek we want to update
     *   }
     * })
     */
    upsert<T extends GameweekUpsertArgs>(args: SelectSubset<T, GameweekUpsertArgs<ExtArgs>>): Prisma__GameweekClient<$Result.GetResult<Prisma.$GameweekPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Gameweeks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameweekCountArgs} args - Arguments to filter Gameweeks to count.
     * @example
     * // Count the number of Gameweeks
     * const count = await prisma.gameweek.count({
     *   where: {
     *     // ... the filter for the Gameweeks we want to count
     *   }
     * })
    **/
    count<T extends GameweekCountArgs>(
      args?: Subset<T, GameweekCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameweekCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Gameweek.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameweekAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameweekAggregateArgs>(args: Subset<T, GameweekAggregateArgs>): Prisma.PrismaPromise<GetGameweekAggregateType<T>>

    /**
     * Group by Gameweek.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameweekGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameweekGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameweekGroupByArgs['orderBy'] }
        : { orderBy?: GameweekGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameweekGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameweekGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Gameweek model
   */
  readonly fields: GameweekFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Gameweek.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameweekClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    leagues<T extends Gameweek$leaguesArgs<ExtArgs> = {}>(args?: Subset<T, Gameweek$leaguesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Gameweek model
   */
  interface GameweekFieldRefs {
    readonly id: FieldRef<"Gameweek", 'Int'>
    readonly deadline: FieldRef<"Gameweek", 'DateTime'>
    readonly isActive: FieldRef<"Gameweek", 'Boolean'>
    readonly realLifeLeague: FieldRef<"Gameweek", 'RealLifeLeague'>
  }
    

  // Custom InputTypes
  /**
   * Gameweek findUnique
   */
  export type GameweekFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gameweek
     */
    select?: GameweekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gameweek
     */
    omit?: GameweekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameweekInclude<ExtArgs> | null
    /**
     * Filter, which Gameweek to fetch.
     */
    where: GameweekWhereUniqueInput
  }

  /**
   * Gameweek findUniqueOrThrow
   */
  export type GameweekFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gameweek
     */
    select?: GameweekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gameweek
     */
    omit?: GameweekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameweekInclude<ExtArgs> | null
    /**
     * Filter, which Gameweek to fetch.
     */
    where: GameweekWhereUniqueInput
  }

  /**
   * Gameweek findFirst
   */
  export type GameweekFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gameweek
     */
    select?: GameweekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gameweek
     */
    omit?: GameweekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameweekInclude<ExtArgs> | null
    /**
     * Filter, which Gameweek to fetch.
     */
    where?: GameweekWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gameweeks to fetch.
     */
    orderBy?: GameweekOrderByWithRelationInput | GameweekOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Gameweeks.
     */
    cursor?: GameweekWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gameweeks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gameweeks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Gameweeks.
     */
    distinct?: GameweekScalarFieldEnum | GameweekScalarFieldEnum[]
  }

  /**
   * Gameweek findFirstOrThrow
   */
  export type GameweekFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gameweek
     */
    select?: GameweekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gameweek
     */
    omit?: GameweekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameweekInclude<ExtArgs> | null
    /**
     * Filter, which Gameweek to fetch.
     */
    where?: GameweekWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gameweeks to fetch.
     */
    orderBy?: GameweekOrderByWithRelationInput | GameweekOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Gameweeks.
     */
    cursor?: GameweekWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gameweeks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gameweeks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Gameweeks.
     */
    distinct?: GameweekScalarFieldEnum | GameweekScalarFieldEnum[]
  }

  /**
   * Gameweek findMany
   */
  export type GameweekFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gameweek
     */
    select?: GameweekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gameweek
     */
    omit?: GameweekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameweekInclude<ExtArgs> | null
    /**
     * Filter, which Gameweeks to fetch.
     */
    where?: GameweekWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gameweeks to fetch.
     */
    orderBy?: GameweekOrderByWithRelationInput | GameweekOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Gameweeks.
     */
    cursor?: GameweekWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gameweeks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gameweeks.
     */
    skip?: number
    distinct?: GameweekScalarFieldEnum | GameweekScalarFieldEnum[]
  }

  /**
   * Gameweek create
   */
  export type GameweekCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gameweek
     */
    select?: GameweekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gameweek
     */
    omit?: GameweekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameweekInclude<ExtArgs> | null
    /**
     * The data needed to create a Gameweek.
     */
    data: XOR<GameweekCreateInput, GameweekUncheckedCreateInput>
  }

  /**
   * Gameweek createMany
   */
  export type GameweekCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Gameweeks.
     */
    data: GameweekCreateManyInput | GameweekCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Gameweek createManyAndReturn
   */
  export type GameweekCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gameweek
     */
    select?: GameweekSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Gameweek
     */
    omit?: GameweekOmit<ExtArgs> | null
    /**
     * The data used to create many Gameweeks.
     */
    data: GameweekCreateManyInput | GameweekCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Gameweek update
   */
  export type GameweekUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gameweek
     */
    select?: GameweekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gameweek
     */
    omit?: GameweekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameweekInclude<ExtArgs> | null
    /**
     * The data needed to update a Gameweek.
     */
    data: XOR<GameweekUpdateInput, GameweekUncheckedUpdateInput>
    /**
     * Choose, which Gameweek to update.
     */
    where: GameweekWhereUniqueInput
  }

  /**
   * Gameweek updateMany
   */
  export type GameweekUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Gameweeks.
     */
    data: XOR<GameweekUpdateManyMutationInput, GameweekUncheckedUpdateManyInput>
    /**
     * Filter which Gameweeks to update
     */
    where?: GameweekWhereInput
    /**
     * Limit how many Gameweeks to update.
     */
    limit?: number
  }

  /**
   * Gameweek updateManyAndReturn
   */
  export type GameweekUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gameweek
     */
    select?: GameweekSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Gameweek
     */
    omit?: GameweekOmit<ExtArgs> | null
    /**
     * The data used to update Gameweeks.
     */
    data: XOR<GameweekUpdateManyMutationInput, GameweekUncheckedUpdateManyInput>
    /**
     * Filter which Gameweeks to update
     */
    where?: GameweekWhereInput
    /**
     * Limit how many Gameweeks to update.
     */
    limit?: number
  }

  /**
   * Gameweek upsert
   */
  export type GameweekUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gameweek
     */
    select?: GameweekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gameweek
     */
    omit?: GameweekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameweekInclude<ExtArgs> | null
    /**
     * The filter to search for the Gameweek to update in case it exists.
     */
    where: GameweekWhereUniqueInput
    /**
     * In case the Gameweek found by the `where` argument doesn't exist, create a new Gameweek with this data.
     */
    create: XOR<GameweekCreateInput, GameweekUncheckedCreateInput>
    /**
     * In case the Gameweek was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameweekUpdateInput, GameweekUncheckedUpdateInput>
  }

  /**
   * Gameweek delete
   */
  export type GameweekDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gameweek
     */
    select?: GameweekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gameweek
     */
    omit?: GameweekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameweekInclude<ExtArgs> | null
    /**
     * Filter which Gameweek to delete.
     */
    where: GameweekWhereUniqueInput
  }

  /**
   * Gameweek deleteMany
   */
  export type GameweekDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Gameweeks to delete
     */
    where?: GameweekWhereInput
    /**
     * Limit how many Gameweeks to delete.
     */
    limit?: number
  }

  /**
   * Gameweek.leagues
   */
  export type Gameweek$leaguesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeague
     */
    select?: FantasyLeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeague
     */
    omit?: FantasyLeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueInclude<ExtArgs> | null
    where?: FantasyLeagueWhereInput
    orderBy?: FantasyLeagueOrderByWithRelationInput | FantasyLeagueOrderByWithRelationInput[]
    cursor?: FantasyLeagueWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FantasyLeagueScalarFieldEnum | FantasyLeagueScalarFieldEnum[]
  }

  /**
   * Gameweek without action
   */
  export type GameweekDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gameweek
     */
    select?: GameweekSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gameweek
     */
    omit?: GameweekOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameweekInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    amount: Decimal | null
    blockNumber: number | null
  }

  export type TransactionSumAggregateOutputType = {
    amount: Decimal | null
    blockNumber: number | null
  }

  export type TransactionMinAggregateOutputType = {
    id: string | null
    txHash: string | null
    type: string | null
    leagueId: string | null
    userId: string | null
    amount: Decimal | null
    status: string | null
    blockNumber: number | null
    gasUsed: string | null
    errorMessage: string | null
    createdAt: Date | null
    confirmedAt: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: string | null
    txHash: string | null
    type: string | null
    leagueId: string | null
    userId: string | null
    amount: Decimal | null
    status: string | null
    blockNumber: number | null
    gasUsed: string | null
    errorMessage: string | null
    createdAt: Date | null
    confirmedAt: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    txHash: number
    type: number
    leagueId: number
    userId: number
    amount: number
    status: number
    blockNumber: number
    gasUsed: number
    errorMessage: number
    metadata: number
    createdAt: number
    confirmedAt: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    amount?: true
    blockNumber?: true
  }

  export type TransactionSumAggregateInputType = {
    amount?: true
    blockNumber?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    txHash?: true
    type?: true
    leagueId?: true
    userId?: true
    amount?: true
    status?: true
    blockNumber?: true
    gasUsed?: true
    errorMessage?: true
    createdAt?: true
    confirmedAt?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    txHash?: true
    type?: true
    leagueId?: true
    userId?: true
    amount?: true
    status?: true
    blockNumber?: true
    gasUsed?: true
    errorMessage?: true
    createdAt?: true
    confirmedAt?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    txHash?: true
    type?: true
    leagueId?: true
    userId?: true
    amount?: true
    status?: true
    blockNumber?: true
    gasUsed?: true
    errorMessage?: true
    metadata?: true
    createdAt?: true
    confirmedAt?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: string
    txHash: string
    type: string
    leagueId: string | null
    userId: string | null
    amount: Decimal | null
    status: string
    blockNumber: number | null
    gasUsed: string | null
    errorMessage: string | null
    metadata: JsonValue | null
    createdAt: Date
    confirmedAt: Date | null
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    txHash?: boolean
    type?: boolean
    leagueId?: boolean
    userId?: boolean
    amount?: boolean
    status?: boolean
    blockNumber?: boolean
    gasUsed?: boolean
    errorMessage?: boolean
    metadata?: boolean
    createdAt?: boolean
    confirmedAt?: boolean
    league?: boolean | Transaction$leagueArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    txHash?: boolean
    type?: boolean
    leagueId?: boolean
    userId?: boolean
    amount?: boolean
    status?: boolean
    blockNumber?: boolean
    gasUsed?: boolean
    errorMessage?: boolean
    metadata?: boolean
    createdAt?: boolean
    confirmedAt?: boolean
    league?: boolean | Transaction$leagueArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    txHash?: boolean
    type?: boolean
    leagueId?: boolean
    userId?: boolean
    amount?: boolean
    status?: boolean
    blockNumber?: boolean
    gasUsed?: boolean
    errorMessage?: boolean
    metadata?: boolean
    createdAt?: boolean
    confirmedAt?: boolean
    league?: boolean | Transaction$leagueArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectScalar = {
    id?: boolean
    txHash?: boolean
    type?: boolean
    leagueId?: boolean
    userId?: boolean
    amount?: boolean
    status?: boolean
    blockNumber?: boolean
    gasUsed?: boolean
    errorMessage?: boolean
    metadata?: boolean
    createdAt?: boolean
    confirmedAt?: boolean
  }

  export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "txHash" | "type" | "leagueId" | "userId" | "amount" | "status" | "blockNumber" | "gasUsed" | "errorMessage" | "metadata" | "createdAt" | "confirmedAt", ExtArgs["result"]["transaction"]>
  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    league?: boolean | Transaction$leagueArgs<ExtArgs>
  }
  export type TransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    league?: boolean | Transaction$leagueArgs<ExtArgs>
  }
  export type TransactionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    league?: boolean | Transaction$leagueArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      league: Prisma.$FantasyLeaguePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      txHash: string
      type: string
      leagueId: string | null
      userId: string | null
      amount: Prisma.Decimal | null
      status: string
      blockNumber: number | null
      gasUsed: string | null
      errorMessage: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      confirmedAt: Date | null
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions and returns the data updated in the database.
     * @param {TransactionUpdateManyAndReturnArgs} args - Arguments to update many Transactions.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TransactionUpdateManyAndReturnArgs>(args: SelectSubset<T, TransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    league<T extends Transaction$leagueArgs<ExtArgs> = {}>(args?: Subset<T, Transaction$leagueArgs<ExtArgs>>): Prisma__FantasyLeagueClient<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'String'>
    readonly txHash: FieldRef<"Transaction", 'String'>
    readonly type: FieldRef<"Transaction", 'String'>
    readonly leagueId: FieldRef<"Transaction", 'String'>
    readonly userId: FieldRef<"Transaction", 'String'>
    readonly amount: FieldRef<"Transaction", 'Decimal'>
    readonly status: FieldRef<"Transaction", 'String'>
    readonly blockNumber: FieldRef<"Transaction", 'Int'>
    readonly gasUsed: FieldRef<"Transaction", 'String'>
    readonly errorMessage: FieldRef<"Transaction", 'String'>
    readonly metadata: FieldRef<"Transaction", 'Json'>
    readonly createdAt: FieldRef<"Transaction", 'DateTime'>
    readonly confirmedAt: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
  }

  /**
   * Transaction updateManyAndReturn
   */
  export type TransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number
  }

  /**
   * Transaction.league
   */
  export type Transaction$leagueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeague
     */
    select?: FantasyLeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeague
     */
    omit?: FantasyLeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueInclude<ExtArgs> | null
    where?: FantasyLeagueWhereInput
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    image: 'image',
    password: 'password',
    country: 'country',
    currency: 'currency',
    coins: 'coins',
    balanceUsd: 'balanceUsd',
    totalDeposited: 'totalDeposited',
    totalWithdrawn: 'totalWithdrawn',
    walletAddress: 'walletAddress',
    kycStatus: 'kycStatus',
    mobileMoneyNumber: 'mobileMoneyNumber',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const WalletScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    address: 'address',
    encryptedPrivateKey: 'encryptedPrivateKey',
    balance: 'balance',
    lastBalanceUpdate: 'lastBalanceUpdate',
    createdAt: 'createdAt'
  };

  export type WalletScalarFieldEnum = (typeof WalletScalarFieldEnum)[keyof typeof WalletScalarFieldEnum]


  export const TeamScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    realLifeLeague: 'realLifeLeague',
    teamValue: 'teamValue',
    teamPlayers: 'teamPlayers',
    captainId: 'captainId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TeamScalarFieldEnum = (typeof TeamScalarFieldEnum)[keyof typeof TeamScalarFieldEnum]


  export const FantasyLeagueScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    stake: 'stake',
    limit: 'limit',
    leagueType: 'leagueType',
    leagueMode: 'leagueMode',
    winners: 'winners',
    code: 'code',
    ownerId: 'ownerId',
    realLifeLeague: 'realLifeLeague',
    status: 'status',
    winnersArray: 'winnersArray',
    entryFeeUsd: 'entryFeeUsd',
    totalPoolUsd: 'totalPoolUsd',
    currentParticipants: 'currentParticipants',
    blockchainTxHash: 'blockchainTxHash',
    prizeDistribution: 'prizeDistribution',
    paymentMethod: 'paymentMethod',
    commissionRate: 'commissionRate',
    creatorCommission: 'creatorCommission',
    gameweekId: 'gameweekId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FantasyLeagueScalarFieldEnum = (typeof FantasyLeagueScalarFieldEnum)[keyof typeof FantasyLeagueScalarFieldEnum]


  export const FantasyLeagueMembershipScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    leagueId: 'leagueId',
    teamName: 'teamName',
    stakeAmount: 'stakeAmount',
    position: 'position',
    score: 'score',
    payoutAmount: 'payoutAmount',
    payoutStatus: 'payoutStatus',
    blockchainTxHash: 'blockchainTxHash',
    status: 'status',
    joinedAt: 'joinedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FantasyLeagueMembershipScalarFieldEnum = (typeof FantasyLeagueMembershipScalarFieldEnum)[keyof typeof FantasyLeagueMembershipScalarFieldEnum]


  export const GameweekScalarFieldEnum: {
    id: 'id',
    deadline: 'deadline',
    isActive: 'isActive',
    realLifeLeague: 'realLifeLeague'
  };

  export type GameweekScalarFieldEnum = (typeof GameweekScalarFieldEnum)[keyof typeof GameweekScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    txHash: 'txHash',
    type: 'type',
    leagueId: 'leagueId',
    userId: 'userId',
    amount: 'amount',
    status: 'status',
    blockNumber: 'blockNumber',
    gasUsed: 'gasUsed',
    errorMessage: 'errorMessage',
    metadata: 'metadata',
    createdAt: 'createdAt',
    confirmedAt: 'confirmedAt'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'RealLifeLeague'
   */
  export type EnumRealLifeLeagueFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RealLifeLeague'>
    


  /**
   * Reference to a field of type 'RealLifeLeague[]'
   */
  export type ListEnumRealLifeLeagueFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RealLifeLeague[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    image?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    currency?: StringNullableFilter<"User"> | string | null
    coins?: IntFilter<"User"> | number
    balanceUsd?: DecimalFilter<"User"> | Decimal | DecimalJsLike | number | string
    totalDeposited?: DecimalFilter<"User"> | Decimal | DecimalJsLike | number | string
    totalWithdrawn?: DecimalFilter<"User"> | Decimal | DecimalJsLike | number | string
    walletAddress?: StringNullableFilter<"User"> | string | null
    kycStatus?: StringFilter<"User"> | string
    mobileMoneyNumber?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    teams?: TeamListRelationFilter
    leagues?: FantasyLeagueMembershipListRelationFilter
    ownedLeagues?: FantasyLeagueListRelationFilter
    wallet?: XOR<WalletNullableScalarRelationFilter, WalletWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    currency?: SortOrderInput | SortOrder
    coins?: SortOrder
    balanceUsd?: SortOrder
    totalDeposited?: SortOrder
    totalWithdrawn?: SortOrder
    walletAddress?: SortOrderInput | SortOrder
    kycStatus?: SortOrder
    mobileMoneyNumber?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    teams?: TeamOrderByRelationAggregateInput
    leagues?: FantasyLeagueMembershipOrderByRelationAggregateInput
    ownedLeagues?: FantasyLeagueOrderByRelationAggregateInput
    wallet?: WalletOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    walletAddress?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    image?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    currency?: StringNullableFilter<"User"> | string | null
    coins?: IntFilter<"User"> | number
    balanceUsd?: DecimalFilter<"User"> | Decimal | DecimalJsLike | number | string
    totalDeposited?: DecimalFilter<"User"> | Decimal | DecimalJsLike | number | string
    totalWithdrawn?: DecimalFilter<"User"> | Decimal | DecimalJsLike | number | string
    kycStatus?: StringFilter<"User"> | string
    mobileMoneyNumber?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    teams?: TeamListRelationFilter
    leagues?: FantasyLeagueMembershipListRelationFilter
    ownedLeagues?: FantasyLeagueListRelationFilter
    wallet?: XOR<WalletNullableScalarRelationFilter, WalletWhereInput> | null
  }, "id" | "email" | "walletAddress">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    currency?: SortOrderInput | SortOrder
    coins?: SortOrder
    balanceUsd?: SortOrder
    totalDeposited?: SortOrder
    totalWithdrawn?: SortOrder
    walletAddress?: SortOrderInput | SortOrder
    kycStatus?: SortOrder
    mobileMoneyNumber?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    country?: StringNullableWithAggregatesFilter<"User"> | string | null
    currency?: StringNullableWithAggregatesFilter<"User"> | string | null
    coins?: IntWithAggregatesFilter<"User"> | number
    balanceUsd?: DecimalWithAggregatesFilter<"User"> | Decimal | DecimalJsLike | number | string
    totalDeposited?: DecimalWithAggregatesFilter<"User"> | Decimal | DecimalJsLike | number | string
    totalWithdrawn?: DecimalWithAggregatesFilter<"User"> | Decimal | DecimalJsLike | number | string
    walletAddress?: StringNullableWithAggregatesFilter<"User"> | string | null
    kycStatus?: StringWithAggregatesFilter<"User"> | string
    mobileMoneyNumber?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type WalletWhereInput = {
    AND?: WalletWhereInput | WalletWhereInput[]
    OR?: WalletWhereInput[]
    NOT?: WalletWhereInput | WalletWhereInput[]
    id?: StringFilter<"Wallet"> | string
    userId?: StringFilter<"Wallet"> | string
    address?: StringFilter<"Wallet"> | string
    encryptedPrivateKey?: StringFilter<"Wallet"> | string
    balance?: DecimalFilter<"Wallet"> | Decimal | DecimalJsLike | number | string
    lastBalanceUpdate?: DateTimeNullableFilter<"Wallet"> | Date | string | null
    createdAt?: DateTimeFilter<"Wallet"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type WalletOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    address?: SortOrder
    encryptedPrivateKey?: SortOrder
    balance?: SortOrder
    lastBalanceUpdate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type WalletWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    address?: string
    AND?: WalletWhereInput | WalletWhereInput[]
    OR?: WalletWhereInput[]
    NOT?: WalletWhereInput | WalletWhereInput[]
    encryptedPrivateKey?: StringFilter<"Wallet"> | string
    balance?: DecimalFilter<"Wallet"> | Decimal | DecimalJsLike | number | string
    lastBalanceUpdate?: DateTimeNullableFilter<"Wallet"> | Date | string | null
    createdAt?: DateTimeFilter<"Wallet"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId" | "address">

  export type WalletOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    address?: SortOrder
    encryptedPrivateKey?: SortOrder
    balance?: SortOrder
    lastBalanceUpdate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: WalletCountOrderByAggregateInput
    _avg?: WalletAvgOrderByAggregateInput
    _max?: WalletMaxOrderByAggregateInput
    _min?: WalletMinOrderByAggregateInput
    _sum?: WalletSumOrderByAggregateInput
  }

  export type WalletScalarWhereWithAggregatesInput = {
    AND?: WalletScalarWhereWithAggregatesInput | WalletScalarWhereWithAggregatesInput[]
    OR?: WalletScalarWhereWithAggregatesInput[]
    NOT?: WalletScalarWhereWithAggregatesInput | WalletScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Wallet"> | string
    userId?: StringWithAggregatesFilter<"Wallet"> | string
    address?: StringWithAggregatesFilter<"Wallet"> | string
    encryptedPrivateKey?: StringWithAggregatesFilter<"Wallet"> | string
    balance?: DecimalWithAggregatesFilter<"Wallet"> | Decimal | DecimalJsLike | number | string
    lastBalanceUpdate?: DateTimeNullableWithAggregatesFilter<"Wallet"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Wallet"> | Date | string
  }

  export type TeamWhereInput = {
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    id?: StringFilter<"Team"> | string
    userId?: StringFilter<"Team"> | string
    realLifeLeague?: EnumRealLifeLeagueFilter<"Team"> | $Enums.RealLifeLeague
    teamValue?: IntFilter<"Team"> | number
    teamPlayers?: IntNullableListFilter<"Team">
    captainId?: IntNullableFilter<"Team"> | number | null
    createdAt?: DateTimeFilter<"Team"> | Date | string
    updatedAt?: DateTimeFilter<"Team"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TeamOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    realLifeLeague?: SortOrder
    teamValue?: SortOrder
    teamPlayers?: SortOrder
    captainId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TeamWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_realLifeLeague?: TeamUserIdRealLifeLeagueCompoundUniqueInput
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    userId?: StringFilter<"Team"> | string
    realLifeLeague?: EnumRealLifeLeagueFilter<"Team"> | $Enums.RealLifeLeague
    teamValue?: IntFilter<"Team"> | number
    teamPlayers?: IntNullableListFilter<"Team">
    captainId?: IntNullableFilter<"Team"> | number | null
    createdAt?: DateTimeFilter<"Team"> | Date | string
    updatedAt?: DateTimeFilter<"Team"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_realLifeLeague">

  export type TeamOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    realLifeLeague?: SortOrder
    teamValue?: SortOrder
    teamPlayers?: SortOrder
    captainId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TeamCountOrderByAggregateInput
    _avg?: TeamAvgOrderByAggregateInput
    _max?: TeamMaxOrderByAggregateInput
    _min?: TeamMinOrderByAggregateInput
    _sum?: TeamSumOrderByAggregateInput
  }

  export type TeamScalarWhereWithAggregatesInput = {
    AND?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    OR?: TeamScalarWhereWithAggregatesInput[]
    NOT?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Team"> | string
    userId?: StringWithAggregatesFilter<"Team"> | string
    realLifeLeague?: EnumRealLifeLeagueWithAggregatesFilter<"Team"> | $Enums.RealLifeLeague
    teamValue?: IntWithAggregatesFilter<"Team"> | number
    teamPlayers?: IntNullableListFilter<"Team">
    captainId?: IntNullableWithAggregatesFilter<"Team"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Team"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Team"> | Date | string
  }

  export type FantasyLeagueWhereInput = {
    AND?: FantasyLeagueWhereInput | FantasyLeagueWhereInput[]
    OR?: FantasyLeagueWhereInput[]
    NOT?: FantasyLeagueWhereInput | FantasyLeagueWhereInput[]
    id?: StringFilter<"FantasyLeague"> | string
    name?: StringFilter<"FantasyLeague"> | string
    description?: StringNullableFilter<"FantasyLeague"> | string | null
    stake?: StringNullableFilter<"FantasyLeague"> | string | null
    limit?: IntFilter<"FantasyLeague"> | number
    leagueType?: StringFilter<"FantasyLeague"> | string
    leagueMode?: StringFilter<"FantasyLeague"> | string
    winners?: IntFilter<"FantasyLeague"> | number
    code?: StringFilter<"FantasyLeague"> | string
    ownerId?: StringNullableFilter<"FantasyLeague"> | string | null
    realLifeLeague?: EnumRealLifeLeagueFilter<"FantasyLeague"> | $Enums.RealLifeLeague
    status?: StringFilter<"FantasyLeague"> | string
    winnersArray?: StringNullableListFilter<"FantasyLeague">
    entryFeeUsd?: DecimalFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFilter<"FantasyLeague"> | number
    blockchainTxHash?: StringNullableFilter<"FantasyLeague"> | string | null
    prizeDistribution?: JsonNullableFilter<"FantasyLeague">
    paymentMethod?: StringFilter<"FantasyLeague"> | string
    commissionRate?: DecimalFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    gameweekId?: IntFilter<"FantasyLeague"> | number
    createdAt?: DateTimeFilter<"FantasyLeague"> | Date | string
    updatedAt?: DateTimeFilter<"FantasyLeague"> | Date | string
    owner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    members?: FantasyLeagueMembershipListRelationFilter
    gameweek?: XOR<GameweekScalarRelationFilter, GameweekWhereInput>
    transactions?: TransactionListRelationFilter
  }

  export type FantasyLeagueOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    stake?: SortOrderInput | SortOrder
    limit?: SortOrder
    leagueType?: SortOrder
    leagueMode?: SortOrder
    winners?: SortOrder
    code?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    realLifeLeague?: SortOrder
    status?: SortOrder
    winnersArray?: SortOrder
    entryFeeUsd?: SortOrder
    totalPoolUsd?: SortOrder
    currentParticipants?: SortOrder
    blockchainTxHash?: SortOrderInput | SortOrder
    prizeDistribution?: SortOrderInput | SortOrder
    paymentMethod?: SortOrder
    commissionRate?: SortOrder
    creatorCommission?: SortOrder
    gameweekId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    owner?: UserOrderByWithRelationInput
    members?: FantasyLeagueMembershipOrderByRelationAggregateInput
    gameweek?: GameweekOrderByWithRelationInput
    transactions?: TransactionOrderByRelationAggregateInput
  }

  export type FantasyLeagueWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    blockchainTxHash?: string
    AND?: FantasyLeagueWhereInput | FantasyLeagueWhereInput[]
    OR?: FantasyLeagueWhereInput[]
    NOT?: FantasyLeagueWhereInput | FantasyLeagueWhereInput[]
    name?: StringFilter<"FantasyLeague"> | string
    description?: StringNullableFilter<"FantasyLeague"> | string | null
    stake?: StringNullableFilter<"FantasyLeague"> | string | null
    limit?: IntFilter<"FantasyLeague"> | number
    leagueType?: StringFilter<"FantasyLeague"> | string
    leagueMode?: StringFilter<"FantasyLeague"> | string
    winners?: IntFilter<"FantasyLeague"> | number
    ownerId?: StringNullableFilter<"FantasyLeague"> | string | null
    realLifeLeague?: EnumRealLifeLeagueFilter<"FantasyLeague"> | $Enums.RealLifeLeague
    status?: StringFilter<"FantasyLeague"> | string
    winnersArray?: StringNullableListFilter<"FantasyLeague">
    entryFeeUsd?: DecimalFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFilter<"FantasyLeague"> | number
    prizeDistribution?: JsonNullableFilter<"FantasyLeague">
    paymentMethod?: StringFilter<"FantasyLeague"> | string
    commissionRate?: DecimalFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    gameweekId?: IntFilter<"FantasyLeague"> | number
    createdAt?: DateTimeFilter<"FantasyLeague"> | Date | string
    updatedAt?: DateTimeFilter<"FantasyLeague"> | Date | string
    owner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    members?: FantasyLeagueMembershipListRelationFilter
    gameweek?: XOR<GameweekScalarRelationFilter, GameweekWhereInput>
    transactions?: TransactionListRelationFilter
  }, "id" | "code" | "blockchainTxHash">

  export type FantasyLeagueOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    stake?: SortOrderInput | SortOrder
    limit?: SortOrder
    leagueType?: SortOrder
    leagueMode?: SortOrder
    winners?: SortOrder
    code?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    realLifeLeague?: SortOrder
    status?: SortOrder
    winnersArray?: SortOrder
    entryFeeUsd?: SortOrder
    totalPoolUsd?: SortOrder
    currentParticipants?: SortOrder
    blockchainTxHash?: SortOrderInput | SortOrder
    prizeDistribution?: SortOrderInput | SortOrder
    paymentMethod?: SortOrder
    commissionRate?: SortOrder
    creatorCommission?: SortOrder
    gameweekId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FantasyLeagueCountOrderByAggregateInput
    _avg?: FantasyLeagueAvgOrderByAggregateInput
    _max?: FantasyLeagueMaxOrderByAggregateInput
    _min?: FantasyLeagueMinOrderByAggregateInput
    _sum?: FantasyLeagueSumOrderByAggregateInput
  }

  export type FantasyLeagueScalarWhereWithAggregatesInput = {
    AND?: FantasyLeagueScalarWhereWithAggregatesInput | FantasyLeagueScalarWhereWithAggregatesInput[]
    OR?: FantasyLeagueScalarWhereWithAggregatesInput[]
    NOT?: FantasyLeagueScalarWhereWithAggregatesInput | FantasyLeagueScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FantasyLeague"> | string
    name?: StringWithAggregatesFilter<"FantasyLeague"> | string
    description?: StringNullableWithAggregatesFilter<"FantasyLeague"> | string | null
    stake?: StringNullableWithAggregatesFilter<"FantasyLeague"> | string | null
    limit?: IntWithAggregatesFilter<"FantasyLeague"> | number
    leagueType?: StringWithAggregatesFilter<"FantasyLeague"> | string
    leagueMode?: StringWithAggregatesFilter<"FantasyLeague"> | string
    winners?: IntWithAggregatesFilter<"FantasyLeague"> | number
    code?: StringWithAggregatesFilter<"FantasyLeague"> | string
    ownerId?: StringNullableWithAggregatesFilter<"FantasyLeague"> | string | null
    realLifeLeague?: EnumRealLifeLeagueWithAggregatesFilter<"FantasyLeague"> | $Enums.RealLifeLeague
    status?: StringWithAggregatesFilter<"FantasyLeague"> | string
    winnersArray?: StringNullableListFilter<"FantasyLeague">
    entryFeeUsd?: DecimalWithAggregatesFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalWithAggregatesFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntWithAggregatesFilter<"FantasyLeague"> | number
    blockchainTxHash?: StringNullableWithAggregatesFilter<"FantasyLeague"> | string | null
    prizeDistribution?: JsonNullableWithAggregatesFilter<"FantasyLeague">
    paymentMethod?: StringWithAggregatesFilter<"FantasyLeague"> | string
    commissionRate?: DecimalWithAggregatesFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalWithAggregatesFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    gameweekId?: IntWithAggregatesFilter<"FantasyLeague"> | number
    createdAt?: DateTimeWithAggregatesFilter<"FantasyLeague"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FantasyLeague"> | Date | string
  }

  export type FantasyLeagueMembershipWhereInput = {
    AND?: FantasyLeagueMembershipWhereInput | FantasyLeagueMembershipWhereInput[]
    OR?: FantasyLeagueMembershipWhereInput[]
    NOT?: FantasyLeagueMembershipWhereInput | FantasyLeagueMembershipWhereInput[]
    id?: StringFilter<"FantasyLeagueMembership"> | string
    userId?: StringFilter<"FantasyLeagueMembership"> | string
    leagueId?: StringFilter<"FantasyLeagueMembership"> | string
    teamName?: StringNullableFilter<"FantasyLeagueMembership"> | string | null
    stakeAmount?: DecimalNullableFilter<"FantasyLeagueMembership"> | Decimal | DecimalJsLike | number | string | null
    position?: IntNullableFilter<"FantasyLeagueMembership"> | number | null
    score?: DecimalNullableFilter<"FantasyLeagueMembership"> | Decimal | DecimalJsLike | number | string | null
    payoutAmount?: DecimalNullableFilter<"FantasyLeagueMembership"> | Decimal | DecimalJsLike | number | string | null
    payoutStatus?: StringFilter<"FantasyLeagueMembership"> | string
    blockchainTxHash?: StringNullableFilter<"FantasyLeagueMembership"> | string | null
    status?: StringFilter<"FantasyLeagueMembership"> | string
    joinedAt?: DateTimeFilter<"FantasyLeagueMembership"> | Date | string
    createdAt?: DateTimeFilter<"FantasyLeagueMembership"> | Date | string
    updatedAt?: DateTimeFilter<"FantasyLeagueMembership"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    league?: XOR<FantasyLeagueScalarRelationFilter, FantasyLeagueWhereInput>
  }

  export type FantasyLeagueMembershipOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    leagueId?: SortOrder
    teamName?: SortOrderInput | SortOrder
    stakeAmount?: SortOrderInput | SortOrder
    position?: SortOrderInput | SortOrder
    score?: SortOrderInput | SortOrder
    payoutAmount?: SortOrderInput | SortOrder
    payoutStatus?: SortOrder
    blockchainTxHash?: SortOrderInput | SortOrder
    status?: SortOrder
    joinedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    league?: FantasyLeagueOrderByWithRelationInput
  }

  export type FantasyLeagueMembershipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_leagueId?: FantasyLeagueMembershipUserIdLeagueIdCompoundUniqueInput
    AND?: FantasyLeagueMembershipWhereInput | FantasyLeagueMembershipWhereInput[]
    OR?: FantasyLeagueMembershipWhereInput[]
    NOT?: FantasyLeagueMembershipWhereInput | FantasyLeagueMembershipWhereInput[]
    userId?: StringFilter<"FantasyLeagueMembership"> | string
    leagueId?: StringFilter<"FantasyLeagueMembership"> | string
    teamName?: StringNullableFilter<"FantasyLeagueMembership"> | string | null
    stakeAmount?: DecimalNullableFilter<"FantasyLeagueMembership"> | Decimal | DecimalJsLike | number | string | null
    position?: IntNullableFilter<"FantasyLeagueMembership"> | number | null
    score?: DecimalNullableFilter<"FantasyLeagueMembership"> | Decimal | DecimalJsLike | number | string | null
    payoutAmount?: DecimalNullableFilter<"FantasyLeagueMembership"> | Decimal | DecimalJsLike | number | string | null
    payoutStatus?: StringFilter<"FantasyLeagueMembership"> | string
    blockchainTxHash?: StringNullableFilter<"FantasyLeagueMembership"> | string | null
    status?: StringFilter<"FantasyLeagueMembership"> | string
    joinedAt?: DateTimeFilter<"FantasyLeagueMembership"> | Date | string
    createdAt?: DateTimeFilter<"FantasyLeagueMembership"> | Date | string
    updatedAt?: DateTimeFilter<"FantasyLeagueMembership"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    league?: XOR<FantasyLeagueScalarRelationFilter, FantasyLeagueWhereInput>
  }, "id" | "userId_leagueId">

  export type FantasyLeagueMembershipOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    leagueId?: SortOrder
    teamName?: SortOrderInput | SortOrder
    stakeAmount?: SortOrderInput | SortOrder
    position?: SortOrderInput | SortOrder
    score?: SortOrderInput | SortOrder
    payoutAmount?: SortOrderInput | SortOrder
    payoutStatus?: SortOrder
    blockchainTxHash?: SortOrderInput | SortOrder
    status?: SortOrder
    joinedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FantasyLeagueMembershipCountOrderByAggregateInput
    _avg?: FantasyLeagueMembershipAvgOrderByAggregateInput
    _max?: FantasyLeagueMembershipMaxOrderByAggregateInput
    _min?: FantasyLeagueMembershipMinOrderByAggregateInput
    _sum?: FantasyLeagueMembershipSumOrderByAggregateInput
  }

  export type FantasyLeagueMembershipScalarWhereWithAggregatesInput = {
    AND?: FantasyLeagueMembershipScalarWhereWithAggregatesInput | FantasyLeagueMembershipScalarWhereWithAggregatesInput[]
    OR?: FantasyLeagueMembershipScalarWhereWithAggregatesInput[]
    NOT?: FantasyLeagueMembershipScalarWhereWithAggregatesInput | FantasyLeagueMembershipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FantasyLeagueMembership"> | string
    userId?: StringWithAggregatesFilter<"FantasyLeagueMembership"> | string
    leagueId?: StringWithAggregatesFilter<"FantasyLeagueMembership"> | string
    teamName?: StringNullableWithAggregatesFilter<"FantasyLeagueMembership"> | string | null
    stakeAmount?: DecimalNullableWithAggregatesFilter<"FantasyLeagueMembership"> | Decimal | DecimalJsLike | number | string | null
    position?: IntNullableWithAggregatesFilter<"FantasyLeagueMembership"> | number | null
    score?: DecimalNullableWithAggregatesFilter<"FantasyLeagueMembership"> | Decimal | DecimalJsLike | number | string | null
    payoutAmount?: DecimalNullableWithAggregatesFilter<"FantasyLeagueMembership"> | Decimal | DecimalJsLike | number | string | null
    payoutStatus?: StringWithAggregatesFilter<"FantasyLeagueMembership"> | string
    blockchainTxHash?: StringNullableWithAggregatesFilter<"FantasyLeagueMembership"> | string | null
    status?: StringWithAggregatesFilter<"FantasyLeagueMembership"> | string
    joinedAt?: DateTimeWithAggregatesFilter<"FantasyLeagueMembership"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"FantasyLeagueMembership"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FantasyLeagueMembership"> | Date | string
  }

  export type GameweekWhereInput = {
    AND?: GameweekWhereInput | GameweekWhereInput[]
    OR?: GameweekWhereInput[]
    NOT?: GameweekWhereInput | GameweekWhereInput[]
    id?: IntFilter<"Gameweek"> | number
    deadline?: DateTimeFilter<"Gameweek"> | Date | string
    isActive?: BoolFilter<"Gameweek"> | boolean
    realLifeLeague?: EnumRealLifeLeagueFilter<"Gameweek"> | $Enums.RealLifeLeague
    leagues?: FantasyLeagueListRelationFilter
  }

  export type GameweekOrderByWithRelationInput = {
    id?: SortOrder
    deadline?: SortOrder
    isActive?: SortOrder
    realLifeLeague?: SortOrder
    leagues?: FantasyLeagueOrderByRelationAggregateInput
  }

  export type GameweekWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: GameweekWhereInput | GameweekWhereInput[]
    OR?: GameweekWhereInput[]
    NOT?: GameweekWhereInput | GameweekWhereInput[]
    deadline?: DateTimeFilter<"Gameweek"> | Date | string
    isActive?: BoolFilter<"Gameweek"> | boolean
    realLifeLeague?: EnumRealLifeLeagueFilter<"Gameweek"> | $Enums.RealLifeLeague
    leagues?: FantasyLeagueListRelationFilter
  }, "id">

  export type GameweekOrderByWithAggregationInput = {
    id?: SortOrder
    deadline?: SortOrder
    isActive?: SortOrder
    realLifeLeague?: SortOrder
    _count?: GameweekCountOrderByAggregateInput
    _avg?: GameweekAvgOrderByAggregateInput
    _max?: GameweekMaxOrderByAggregateInput
    _min?: GameweekMinOrderByAggregateInput
    _sum?: GameweekSumOrderByAggregateInput
  }

  export type GameweekScalarWhereWithAggregatesInput = {
    AND?: GameweekScalarWhereWithAggregatesInput | GameweekScalarWhereWithAggregatesInput[]
    OR?: GameweekScalarWhereWithAggregatesInput[]
    NOT?: GameweekScalarWhereWithAggregatesInput | GameweekScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Gameweek"> | number
    deadline?: DateTimeWithAggregatesFilter<"Gameweek"> | Date | string
    isActive?: BoolWithAggregatesFilter<"Gameweek"> | boolean
    realLifeLeague?: EnumRealLifeLeagueWithAggregatesFilter<"Gameweek"> | $Enums.RealLifeLeague
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: StringFilter<"Transaction"> | string
    txHash?: StringFilter<"Transaction"> | string
    type?: StringFilter<"Transaction"> | string
    leagueId?: StringNullableFilter<"Transaction"> | string | null
    userId?: StringNullableFilter<"Transaction"> | string | null
    amount?: DecimalNullableFilter<"Transaction"> | Decimal | DecimalJsLike | number | string | null
    status?: StringFilter<"Transaction"> | string
    blockNumber?: IntNullableFilter<"Transaction"> | number | null
    gasUsed?: StringNullableFilter<"Transaction"> | string | null
    errorMessage?: StringNullableFilter<"Transaction"> | string | null
    metadata?: JsonNullableFilter<"Transaction">
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    confirmedAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    league?: XOR<FantasyLeagueNullableScalarRelationFilter, FantasyLeagueWhereInput> | null
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    txHash?: SortOrder
    type?: SortOrder
    leagueId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    amount?: SortOrderInput | SortOrder
    status?: SortOrder
    blockNumber?: SortOrderInput | SortOrder
    gasUsed?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    confirmedAt?: SortOrderInput | SortOrder
    league?: FantasyLeagueOrderByWithRelationInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    txHash?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    type?: StringFilter<"Transaction"> | string
    leagueId?: StringNullableFilter<"Transaction"> | string | null
    userId?: StringNullableFilter<"Transaction"> | string | null
    amount?: DecimalNullableFilter<"Transaction"> | Decimal | DecimalJsLike | number | string | null
    status?: StringFilter<"Transaction"> | string
    blockNumber?: IntNullableFilter<"Transaction"> | number | null
    gasUsed?: StringNullableFilter<"Transaction"> | string | null
    errorMessage?: StringNullableFilter<"Transaction"> | string | null
    metadata?: JsonNullableFilter<"Transaction">
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    confirmedAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
    league?: XOR<FantasyLeagueNullableScalarRelationFilter, FantasyLeagueWhereInput> | null
  }, "id" | "txHash">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    txHash?: SortOrder
    type?: SortOrder
    leagueId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    amount?: SortOrderInput | SortOrder
    status?: SortOrder
    blockNumber?: SortOrderInput | SortOrder
    gasUsed?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    confirmedAt?: SortOrderInput | SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transaction"> | string
    txHash?: StringWithAggregatesFilter<"Transaction"> | string
    type?: StringWithAggregatesFilter<"Transaction"> | string
    leagueId?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    userId?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    amount?: DecimalNullableWithAggregatesFilter<"Transaction"> | Decimal | DecimalJsLike | number | string | null
    status?: StringWithAggregatesFilter<"Transaction"> | string
    blockNumber?: IntNullableWithAggregatesFilter<"Transaction"> | number | null
    gasUsed?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    errorMessage?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"Transaction">
    createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
    confirmedAt?: DateTimeNullableWithAggregatesFilter<"Transaction"> | Date | string | null
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    image?: string | null
    password?: string | null
    country?: string | null
    currency?: string | null
    coins?: number
    balanceUsd?: Decimal | DecimalJsLike | number | string
    totalDeposited?: Decimal | DecimalJsLike | number | string
    totalWithdrawn?: Decimal | DecimalJsLike | number | string
    walletAddress?: string | null
    kycStatus?: string
    mobileMoneyNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    teams?: TeamCreateNestedManyWithoutUserInput
    leagues?: FantasyLeagueMembershipCreateNestedManyWithoutUserInput
    ownedLeagues?: FantasyLeagueCreateNestedManyWithoutOwnerInput
    wallet?: WalletCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    image?: string | null
    password?: string | null
    country?: string | null
    currency?: string | null
    coins?: number
    balanceUsd?: Decimal | DecimalJsLike | number | string
    totalDeposited?: Decimal | DecimalJsLike | number | string
    totalWithdrawn?: Decimal | DecimalJsLike | number | string
    walletAddress?: string | null
    kycStatus?: string
    mobileMoneyNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    teams?: TeamUncheckedCreateNestedManyWithoutUserInput
    leagues?: FantasyLeagueMembershipUncheckedCreateNestedManyWithoutUserInput
    ownedLeagues?: FantasyLeagueUncheckedCreateNestedManyWithoutOwnerInput
    wallet?: WalletUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    coins?: IntFieldUpdateOperationsInput | number
    balanceUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeposited?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWithdrawn?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: StringFieldUpdateOperationsInput | string
    mobileMoneyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teams?: TeamUpdateManyWithoutUserNestedInput
    leagues?: FantasyLeagueMembershipUpdateManyWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUpdateManyWithoutOwnerNestedInput
    wallet?: WalletUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    coins?: IntFieldUpdateOperationsInput | number
    balanceUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeposited?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWithdrawn?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: StringFieldUpdateOperationsInput | string
    mobileMoneyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teams?: TeamUncheckedUpdateManyWithoutUserNestedInput
    leagues?: FantasyLeagueMembershipUncheckedUpdateManyWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUncheckedUpdateManyWithoutOwnerNestedInput
    wallet?: WalletUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    image?: string | null
    password?: string | null
    country?: string | null
    currency?: string | null
    coins?: number
    balanceUsd?: Decimal | DecimalJsLike | number | string
    totalDeposited?: Decimal | DecimalJsLike | number | string
    totalWithdrawn?: Decimal | DecimalJsLike | number | string
    walletAddress?: string | null
    kycStatus?: string
    mobileMoneyNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    coins?: IntFieldUpdateOperationsInput | number
    balanceUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeposited?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWithdrawn?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: StringFieldUpdateOperationsInput | string
    mobileMoneyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    coins?: IntFieldUpdateOperationsInput | number
    balanceUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeposited?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWithdrawn?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: StringFieldUpdateOperationsInput | string
    mobileMoneyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletCreateInput = {
    id?: string
    address: string
    encryptedPrivateKey: string
    balance?: Decimal | DecimalJsLike | number | string
    lastBalanceUpdate?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutWalletInput
  }

  export type WalletUncheckedCreateInput = {
    id?: string
    userId: string
    address: string
    encryptedPrivateKey: string
    balance?: Decimal | DecimalJsLike | number | string
    lastBalanceUpdate?: Date | string | null
    createdAt?: Date | string
  }

  export type WalletUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    encryptedPrivateKey?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastBalanceUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWalletNestedInput
  }

  export type WalletUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    encryptedPrivateKey?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastBalanceUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletCreateManyInput = {
    id?: string
    userId: string
    address: string
    encryptedPrivateKey: string
    balance?: Decimal | DecimalJsLike | number | string
    lastBalanceUpdate?: Date | string | null
    createdAt?: Date | string
  }

  export type WalletUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    encryptedPrivateKey?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastBalanceUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    encryptedPrivateKey?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastBalanceUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamCreateInput = {
    id?: string
    realLifeLeague?: $Enums.RealLifeLeague
    teamValue?: number
    teamPlayers?: TeamCreateteamPlayersInput | number[]
    captainId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTeamsInput
  }

  export type TeamUncheckedCreateInput = {
    id?: string
    userId: string
    realLifeLeague?: $Enums.RealLifeLeague
    teamValue?: number
    teamPlayers?: TeamCreateteamPlayersInput | number[]
    captainId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TeamUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    teamValue?: IntFieldUpdateOperationsInput | number
    teamPlayers?: TeamUpdateteamPlayersInput | number[]
    captainId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTeamsNestedInput
  }

  export type TeamUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    teamValue?: IntFieldUpdateOperationsInput | number
    teamPlayers?: TeamUpdateteamPlayersInput | number[]
    captainId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamCreateManyInput = {
    id?: string
    userId: string
    realLifeLeague?: $Enums.RealLifeLeague
    teamValue?: number
    teamPlayers?: TeamCreateteamPlayersInput | number[]
    captainId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TeamUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    teamValue?: IntFieldUpdateOperationsInput | number
    teamPlayers?: TeamUpdateteamPlayersInput | number[]
    captainId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    teamValue?: IntFieldUpdateOperationsInput | number
    teamPlayers?: TeamUpdateteamPlayersInput | number[]
    captainId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueCreateInput = {
    id?: string
    name: string
    description?: string | null
    stake?: string | null
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    code: string
    realLifeLeague?: $Enums.RealLifeLeague
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    entryFeeUsd?: Decimal | DecimalJsLike | number | string
    totalPoolUsd?: Decimal | DecimalJsLike | number | string
    currentParticipants?: number
    blockchainTxHash?: string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: string
    commissionRate?: Decimal | DecimalJsLike | number | string
    creatorCommission?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutOwnedLeaguesInput
    members?: FantasyLeagueMembershipCreateNestedManyWithoutLeagueInput
    gameweek: GameweekCreateNestedOneWithoutLeaguesInput
    transactions?: TransactionCreateNestedManyWithoutLeagueInput
  }

  export type FantasyLeagueUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    stake?: string | null
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    code: string
    ownerId?: string | null
    realLifeLeague?: $Enums.RealLifeLeague
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    entryFeeUsd?: Decimal | DecimalJsLike | number | string
    totalPoolUsd?: Decimal | DecimalJsLike | number | string
    currentParticipants?: number
    blockchainTxHash?: string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: string
    commissionRate?: Decimal | DecimalJsLike | number | string
    creatorCommission?: Decimal | DecimalJsLike | number | string
    gameweekId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: FantasyLeagueMembershipUncheckedCreateNestedManyWithoutLeagueInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutLeagueInput
  }

  export type FantasyLeagueUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    stake?: NullableStringFieldUpdateOperationsInput | string | null
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    entryFeeUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFieldUpdateOperationsInput | number
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: StringFieldUpdateOperationsInput | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwnedLeaguesNestedInput
    members?: FantasyLeagueMembershipUpdateManyWithoutLeagueNestedInput
    gameweek?: GameweekUpdateOneRequiredWithoutLeaguesNestedInput
    transactions?: TransactionUpdateManyWithoutLeagueNestedInput
  }

  export type FantasyLeagueUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    stake?: NullableStringFieldUpdateOperationsInput | string | null
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    entryFeeUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFieldUpdateOperationsInput | number
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: StringFieldUpdateOperationsInput | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gameweekId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: FantasyLeagueMembershipUncheckedUpdateManyWithoutLeagueNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutLeagueNestedInput
  }

  export type FantasyLeagueCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    stake?: string | null
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    code: string
    ownerId?: string | null
    realLifeLeague?: $Enums.RealLifeLeague
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    entryFeeUsd?: Decimal | DecimalJsLike | number | string
    totalPoolUsd?: Decimal | DecimalJsLike | number | string
    currentParticipants?: number
    blockchainTxHash?: string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: string
    commissionRate?: Decimal | DecimalJsLike | number | string
    creatorCommission?: Decimal | DecimalJsLike | number | string
    gameweekId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    stake?: NullableStringFieldUpdateOperationsInput | string | null
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    entryFeeUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFieldUpdateOperationsInput | number
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: StringFieldUpdateOperationsInput | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    stake?: NullableStringFieldUpdateOperationsInput | string | null
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    entryFeeUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFieldUpdateOperationsInput | number
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: StringFieldUpdateOperationsInput | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gameweekId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipCreateInput = {
    id?: string
    teamName?: string | null
    stakeAmount?: Decimal | DecimalJsLike | number | string | null
    position?: number | null
    score?: Decimal | DecimalJsLike | number | string | null
    payoutAmount?: Decimal | DecimalJsLike | number | string | null
    payoutStatus?: string
    blockchainTxHash?: string | null
    status?: string
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutLeaguesInput
    league: FantasyLeagueCreateNestedOneWithoutMembersInput
  }

  export type FantasyLeagueMembershipUncheckedCreateInput = {
    id?: string
    userId: string
    leagueId: string
    teamName?: string | null
    stakeAmount?: Decimal | DecimalJsLike | number | string | null
    position?: number | null
    score?: Decimal | DecimalJsLike | number | string | null
    payoutAmount?: Decimal | DecimalJsLike | number | string | null
    payoutStatus?: string
    blockchainTxHash?: string | null
    status?: string
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueMembershipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    stakeAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutStatus?: StringFieldUpdateOperationsInput | string
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLeaguesNestedInput
    league?: FantasyLeagueUpdateOneRequiredWithoutMembersNestedInput
  }

  export type FantasyLeagueMembershipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    stakeAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutStatus?: StringFieldUpdateOperationsInput | string
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipCreateManyInput = {
    id?: string
    userId: string
    leagueId: string
    teamName?: string | null
    stakeAmount?: Decimal | DecimalJsLike | number | string | null
    position?: number | null
    score?: Decimal | DecimalJsLike | number | string | null
    payoutAmount?: Decimal | DecimalJsLike | number | string | null
    payoutStatus?: string
    blockchainTxHash?: string | null
    status?: string
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueMembershipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    stakeAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutStatus?: StringFieldUpdateOperationsInput | string
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    stakeAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutStatus?: StringFieldUpdateOperationsInput | string
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameweekCreateInput = {
    id: number
    deadline: Date | string
    isActive?: boolean
    realLifeLeague?: $Enums.RealLifeLeague
    leagues?: FantasyLeagueCreateNestedManyWithoutGameweekInput
  }

  export type GameweekUncheckedCreateInput = {
    id: number
    deadline: Date | string
    isActive?: boolean
    realLifeLeague?: $Enums.RealLifeLeague
    leagues?: FantasyLeagueUncheckedCreateNestedManyWithoutGameweekInput
  }

  export type GameweekUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    leagues?: FantasyLeagueUpdateManyWithoutGameweekNestedInput
  }

  export type GameweekUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    leagues?: FantasyLeagueUncheckedUpdateManyWithoutGameweekNestedInput
  }

  export type GameweekCreateManyInput = {
    id: number
    deadline: Date | string
    isActive?: boolean
    realLifeLeague?: $Enums.RealLifeLeague
  }

  export type GameweekUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
  }

  export type GameweekUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
  }

  export type TransactionCreateInput = {
    id?: string
    txHash: string
    type: string
    userId?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    status?: string
    blockNumber?: number | null
    gasUsed?: string | null
    errorMessage?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    confirmedAt?: Date | string | null
    league?: FantasyLeagueCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: string
    txHash: string
    type: string
    leagueId?: string | null
    userId?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    status?: string
    blockNumber?: number | null
    gasUsed?: string | null
    errorMessage?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    confirmedAt?: Date | string | null
  }

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    gasUsed?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    league?: FantasyLeagueUpdateOneWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    leagueId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    gasUsed?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionCreateManyInput = {
    id?: string
    txHash: string
    type: string
    leagueId?: string | null
    userId?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    status?: string
    blockNumber?: number | null
    gasUsed?: string | null
    errorMessage?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    confirmedAt?: Date | string | null
  }

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    gasUsed?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    leagueId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    gasUsed?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TeamListRelationFilter = {
    every?: TeamWhereInput
    some?: TeamWhereInput
    none?: TeamWhereInput
  }

  export type FantasyLeagueMembershipListRelationFilter = {
    every?: FantasyLeagueMembershipWhereInput
    some?: FantasyLeagueMembershipWhereInput
    none?: FantasyLeagueMembershipWhereInput
  }

  export type FantasyLeagueListRelationFilter = {
    every?: FantasyLeagueWhereInput
    some?: FantasyLeagueWhereInput
    none?: FantasyLeagueWhereInput
  }

  export type WalletNullableScalarRelationFilter = {
    is?: WalletWhereInput | null
    isNot?: WalletWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TeamOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FantasyLeagueMembershipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FantasyLeagueOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    image?: SortOrder
    password?: SortOrder
    country?: SortOrder
    currency?: SortOrder
    coins?: SortOrder
    balanceUsd?: SortOrder
    totalDeposited?: SortOrder
    totalWithdrawn?: SortOrder
    walletAddress?: SortOrder
    kycStatus?: SortOrder
    mobileMoneyNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    coins?: SortOrder
    balanceUsd?: SortOrder
    totalDeposited?: SortOrder
    totalWithdrawn?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    image?: SortOrder
    password?: SortOrder
    country?: SortOrder
    currency?: SortOrder
    coins?: SortOrder
    balanceUsd?: SortOrder
    totalDeposited?: SortOrder
    totalWithdrawn?: SortOrder
    walletAddress?: SortOrder
    kycStatus?: SortOrder
    mobileMoneyNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    image?: SortOrder
    password?: SortOrder
    country?: SortOrder
    currency?: SortOrder
    coins?: SortOrder
    balanceUsd?: SortOrder
    totalDeposited?: SortOrder
    totalWithdrawn?: SortOrder
    walletAddress?: SortOrder
    kycStatus?: SortOrder
    mobileMoneyNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    coins?: SortOrder
    balanceUsd?: SortOrder
    totalDeposited?: SortOrder
    totalWithdrawn?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type WalletCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    address?: SortOrder
    encryptedPrivateKey?: SortOrder
    balance?: SortOrder
    lastBalanceUpdate?: SortOrder
    createdAt?: SortOrder
  }

  export type WalletAvgOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type WalletMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    address?: SortOrder
    encryptedPrivateKey?: SortOrder
    balance?: SortOrder
    lastBalanceUpdate?: SortOrder
    createdAt?: SortOrder
  }

  export type WalletMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    address?: SortOrder
    encryptedPrivateKey?: SortOrder
    balance?: SortOrder
    lastBalanceUpdate?: SortOrder
    createdAt?: SortOrder
  }

  export type WalletSumOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumRealLifeLeagueFilter<$PrismaModel = never> = {
    equals?: $Enums.RealLifeLeague | EnumRealLifeLeagueFieldRefInput<$PrismaModel>
    in?: $Enums.RealLifeLeague[] | ListEnumRealLifeLeagueFieldRefInput<$PrismaModel>
    notIn?: $Enums.RealLifeLeague[] | ListEnumRealLifeLeagueFieldRefInput<$PrismaModel>
    not?: NestedEnumRealLifeLeagueFilter<$PrismaModel> | $Enums.RealLifeLeague
  }

  export type IntNullableListFilter<$PrismaModel = never> = {
    equals?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    has?: number | IntFieldRefInput<$PrismaModel> | null
    hasEvery?: number[] | ListIntFieldRefInput<$PrismaModel>
    hasSome?: number[] | ListIntFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type TeamUserIdRealLifeLeagueCompoundUniqueInput = {
    userId: string
    realLifeLeague: $Enums.RealLifeLeague
  }

  export type TeamCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    realLifeLeague?: SortOrder
    teamValue?: SortOrder
    teamPlayers?: SortOrder
    captainId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TeamAvgOrderByAggregateInput = {
    teamValue?: SortOrder
    teamPlayers?: SortOrder
    captainId?: SortOrder
  }

  export type TeamMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    realLifeLeague?: SortOrder
    teamValue?: SortOrder
    captainId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TeamMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    realLifeLeague?: SortOrder
    teamValue?: SortOrder
    captainId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TeamSumOrderByAggregateInput = {
    teamValue?: SortOrder
    teamPlayers?: SortOrder
    captainId?: SortOrder
  }

  export type EnumRealLifeLeagueWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RealLifeLeague | EnumRealLifeLeagueFieldRefInput<$PrismaModel>
    in?: $Enums.RealLifeLeague[] | ListEnumRealLifeLeagueFieldRefInput<$PrismaModel>
    notIn?: $Enums.RealLifeLeague[] | ListEnumRealLifeLeagueFieldRefInput<$PrismaModel>
    not?: NestedEnumRealLifeLeagueWithAggregatesFilter<$PrismaModel> | $Enums.RealLifeLeague
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRealLifeLeagueFilter<$PrismaModel>
    _max?: NestedEnumRealLifeLeagueFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type GameweekScalarRelationFilter = {
    is?: GameweekWhereInput
    isNot?: GameweekWhereInput
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FantasyLeagueCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    stake?: SortOrder
    limit?: SortOrder
    leagueType?: SortOrder
    leagueMode?: SortOrder
    winners?: SortOrder
    code?: SortOrder
    ownerId?: SortOrder
    realLifeLeague?: SortOrder
    status?: SortOrder
    winnersArray?: SortOrder
    entryFeeUsd?: SortOrder
    totalPoolUsd?: SortOrder
    currentParticipants?: SortOrder
    blockchainTxHash?: SortOrder
    prizeDistribution?: SortOrder
    paymentMethod?: SortOrder
    commissionRate?: SortOrder
    creatorCommission?: SortOrder
    gameweekId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FantasyLeagueAvgOrderByAggregateInput = {
    limit?: SortOrder
    winners?: SortOrder
    entryFeeUsd?: SortOrder
    totalPoolUsd?: SortOrder
    currentParticipants?: SortOrder
    commissionRate?: SortOrder
    creatorCommission?: SortOrder
    gameweekId?: SortOrder
  }

  export type FantasyLeagueMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    stake?: SortOrder
    limit?: SortOrder
    leagueType?: SortOrder
    leagueMode?: SortOrder
    winners?: SortOrder
    code?: SortOrder
    ownerId?: SortOrder
    realLifeLeague?: SortOrder
    status?: SortOrder
    entryFeeUsd?: SortOrder
    totalPoolUsd?: SortOrder
    currentParticipants?: SortOrder
    blockchainTxHash?: SortOrder
    paymentMethod?: SortOrder
    commissionRate?: SortOrder
    creatorCommission?: SortOrder
    gameweekId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FantasyLeagueMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    stake?: SortOrder
    limit?: SortOrder
    leagueType?: SortOrder
    leagueMode?: SortOrder
    winners?: SortOrder
    code?: SortOrder
    ownerId?: SortOrder
    realLifeLeague?: SortOrder
    status?: SortOrder
    entryFeeUsd?: SortOrder
    totalPoolUsd?: SortOrder
    currentParticipants?: SortOrder
    blockchainTxHash?: SortOrder
    paymentMethod?: SortOrder
    commissionRate?: SortOrder
    creatorCommission?: SortOrder
    gameweekId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FantasyLeagueSumOrderByAggregateInput = {
    limit?: SortOrder
    winners?: SortOrder
    entryFeeUsd?: SortOrder
    totalPoolUsd?: SortOrder
    currentParticipants?: SortOrder
    commissionRate?: SortOrder
    creatorCommission?: SortOrder
    gameweekId?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type FantasyLeagueScalarRelationFilter = {
    is?: FantasyLeagueWhereInput
    isNot?: FantasyLeagueWhereInput
  }

  export type FantasyLeagueMembershipUserIdLeagueIdCompoundUniqueInput = {
    userId: string
    leagueId: string
  }

  export type FantasyLeagueMembershipCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    leagueId?: SortOrder
    teamName?: SortOrder
    stakeAmount?: SortOrder
    position?: SortOrder
    score?: SortOrder
    payoutAmount?: SortOrder
    payoutStatus?: SortOrder
    blockchainTxHash?: SortOrder
    status?: SortOrder
    joinedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FantasyLeagueMembershipAvgOrderByAggregateInput = {
    stakeAmount?: SortOrder
    position?: SortOrder
    score?: SortOrder
    payoutAmount?: SortOrder
  }

  export type FantasyLeagueMembershipMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    leagueId?: SortOrder
    teamName?: SortOrder
    stakeAmount?: SortOrder
    position?: SortOrder
    score?: SortOrder
    payoutAmount?: SortOrder
    payoutStatus?: SortOrder
    blockchainTxHash?: SortOrder
    status?: SortOrder
    joinedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FantasyLeagueMembershipMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    leagueId?: SortOrder
    teamName?: SortOrder
    stakeAmount?: SortOrder
    position?: SortOrder
    score?: SortOrder
    payoutAmount?: SortOrder
    payoutStatus?: SortOrder
    blockchainTxHash?: SortOrder
    status?: SortOrder
    joinedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FantasyLeagueMembershipSumOrderByAggregateInput = {
    stakeAmount?: SortOrder
    position?: SortOrder
    score?: SortOrder
    payoutAmount?: SortOrder
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type GameweekCountOrderByAggregateInput = {
    id?: SortOrder
    deadline?: SortOrder
    isActive?: SortOrder
    realLifeLeague?: SortOrder
  }

  export type GameweekAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type GameweekMaxOrderByAggregateInput = {
    id?: SortOrder
    deadline?: SortOrder
    isActive?: SortOrder
    realLifeLeague?: SortOrder
  }

  export type GameweekMinOrderByAggregateInput = {
    id?: SortOrder
    deadline?: SortOrder
    isActive?: SortOrder
    realLifeLeague?: SortOrder
  }

  export type GameweekSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FantasyLeagueNullableScalarRelationFilter = {
    is?: FantasyLeagueWhereInput | null
    isNot?: FantasyLeagueWhereInput | null
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    txHash?: SortOrder
    type?: SortOrder
    leagueId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    blockNumber?: SortOrder
    gasUsed?: SortOrder
    errorMessage?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    confirmedAt?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    amount?: SortOrder
    blockNumber?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    txHash?: SortOrder
    type?: SortOrder
    leagueId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    blockNumber?: SortOrder
    gasUsed?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    confirmedAt?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    txHash?: SortOrder
    type?: SortOrder
    leagueId?: SortOrder
    userId?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    blockNumber?: SortOrder
    gasUsed?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    confirmedAt?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    amount?: SortOrder
    blockNumber?: SortOrder
  }

  export type TeamCreateNestedManyWithoutUserInput = {
    create?: XOR<TeamCreateWithoutUserInput, TeamUncheckedCreateWithoutUserInput> | TeamCreateWithoutUserInput[] | TeamUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutUserInput | TeamCreateOrConnectWithoutUserInput[]
    createMany?: TeamCreateManyUserInputEnvelope
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
  }

  export type FantasyLeagueMembershipCreateNestedManyWithoutUserInput = {
    create?: XOR<FantasyLeagueMembershipCreateWithoutUserInput, FantasyLeagueMembershipUncheckedCreateWithoutUserInput> | FantasyLeagueMembershipCreateWithoutUserInput[] | FantasyLeagueMembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FantasyLeagueMembershipCreateOrConnectWithoutUserInput | FantasyLeagueMembershipCreateOrConnectWithoutUserInput[]
    createMany?: FantasyLeagueMembershipCreateManyUserInputEnvelope
    connect?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
  }

  export type FantasyLeagueCreateNestedManyWithoutOwnerInput = {
    create?: XOR<FantasyLeagueCreateWithoutOwnerInput, FantasyLeagueUncheckedCreateWithoutOwnerInput> | FantasyLeagueCreateWithoutOwnerInput[] | FantasyLeagueUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: FantasyLeagueCreateOrConnectWithoutOwnerInput | FantasyLeagueCreateOrConnectWithoutOwnerInput[]
    createMany?: FantasyLeagueCreateManyOwnerInputEnvelope
    connect?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
  }

  export type WalletCreateNestedOneWithoutUserInput = {
    create?: XOR<WalletCreateWithoutUserInput, WalletUncheckedCreateWithoutUserInput>
    connectOrCreate?: WalletCreateOrConnectWithoutUserInput
    connect?: WalletWhereUniqueInput
  }

  export type TeamUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TeamCreateWithoutUserInput, TeamUncheckedCreateWithoutUserInput> | TeamCreateWithoutUserInput[] | TeamUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutUserInput | TeamCreateOrConnectWithoutUserInput[]
    createMany?: TeamCreateManyUserInputEnvelope
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
  }

  export type FantasyLeagueMembershipUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<FantasyLeagueMembershipCreateWithoutUserInput, FantasyLeagueMembershipUncheckedCreateWithoutUserInput> | FantasyLeagueMembershipCreateWithoutUserInput[] | FantasyLeagueMembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FantasyLeagueMembershipCreateOrConnectWithoutUserInput | FantasyLeagueMembershipCreateOrConnectWithoutUserInput[]
    createMany?: FantasyLeagueMembershipCreateManyUserInputEnvelope
    connect?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
  }

  export type FantasyLeagueUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<FantasyLeagueCreateWithoutOwnerInput, FantasyLeagueUncheckedCreateWithoutOwnerInput> | FantasyLeagueCreateWithoutOwnerInput[] | FantasyLeagueUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: FantasyLeagueCreateOrConnectWithoutOwnerInput | FantasyLeagueCreateOrConnectWithoutOwnerInput[]
    createMany?: FantasyLeagueCreateManyOwnerInputEnvelope
    connect?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
  }

  export type WalletUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<WalletCreateWithoutUserInput, WalletUncheckedCreateWithoutUserInput>
    connectOrCreate?: WalletCreateOrConnectWithoutUserInput
    connect?: WalletWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TeamUpdateManyWithoutUserNestedInput = {
    create?: XOR<TeamCreateWithoutUserInput, TeamUncheckedCreateWithoutUserInput> | TeamCreateWithoutUserInput[] | TeamUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutUserInput | TeamCreateOrConnectWithoutUserInput[]
    upsert?: TeamUpsertWithWhereUniqueWithoutUserInput | TeamUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TeamCreateManyUserInputEnvelope
    set?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    disconnect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    delete?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    update?: TeamUpdateWithWhereUniqueWithoutUserInput | TeamUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TeamUpdateManyWithWhereWithoutUserInput | TeamUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TeamScalarWhereInput | TeamScalarWhereInput[]
  }

  export type FantasyLeagueMembershipUpdateManyWithoutUserNestedInput = {
    create?: XOR<FantasyLeagueMembershipCreateWithoutUserInput, FantasyLeagueMembershipUncheckedCreateWithoutUserInput> | FantasyLeagueMembershipCreateWithoutUserInput[] | FantasyLeagueMembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FantasyLeagueMembershipCreateOrConnectWithoutUserInput | FantasyLeagueMembershipCreateOrConnectWithoutUserInput[]
    upsert?: FantasyLeagueMembershipUpsertWithWhereUniqueWithoutUserInput | FantasyLeagueMembershipUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FantasyLeagueMembershipCreateManyUserInputEnvelope
    set?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    disconnect?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    delete?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    connect?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    update?: FantasyLeagueMembershipUpdateWithWhereUniqueWithoutUserInput | FantasyLeagueMembershipUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FantasyLeagueMembershipUpdateManyWithWhereWithoutUserInput | FantasyLeagueMembershipUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FantasyLeagueMembershipScalarWhereInput | FantasyLeagueMembershipScalarWhereInput[]
  }

  export type FantasyLeagueUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<FantasyLeagueCreateWithoutOwnerInput, FantasyLeagueUncheckedCreateWithoutOwnerInput> | FantasyLeagueCreateWithoutOwnerInput[] | FantasyLeagueUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: FantasyLeagueCreateOrConnectWithoutOwnerInput | FantasyLeagueCreateOrConnectWithoutOwnerInput[]
    upsert?: FantasyLeagueUpsertWithWhereUniqueWithoutOwnerInput | FantasyLeagueUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: FantasyLeagueCreateManyOwnerInputEnvelope
    set?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    disconnect?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    delete?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    connect?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    update?: FantasyLeagueUpdateWithWhereUniqueWithoutOwnerInput | FantasyLeagueUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: FantasyLeagueUpdateManyWithWhereWithoutOwnerInput | FantasyLeagueUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: FantasyLeagueScalarWhereInput | FantasyLeagueScalarWhereInput[]
  }

  export type WalletUpdateOneWithoutUserNestedInput = {
    create?: XOR<WalletCreateWithoutUserInput, WalletUncheckedCreateWithoutUserInput>
    connectOrCreate?: WalletCreateOrConnectWithoutUserInput
    upsert?: WalletUpsertWithoutUserInput
    disconnect?: WalletWhereInput | boolean
    delete?: WalletWhereInput | boolean
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutUserInput, WalletUpdateWithoutUserInput>, WalletUncheckedUpdateWithoutUserInput>
  }

  export type TeamUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TeamCreateWithoutUserInput, TeamUncheckedCreateWithoutUserInput> | TeamCreateWithoutUserInput[] | TeamUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamCreateOrConnectWithoutUserInput | TeamCreateOrConnectWithoutUserInput[]
    upsert?: TeamUpsertWithWhereUniqueWithoutUserInput | TeamUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TeamCreateManyUserInputEnvelope
    set?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    disconnect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    delete?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    connect?: TeamWhereUniqueInput | TeamWhereUniqueInput[]
    update?: TeamUpdateWithWhereUniqueWithoutUserInput | TeamUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TeamUpdateManyWithWhereWithoutUserInput | TeamUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TeamScalarWhereInput | TeamScalarWhereInput[]
  }

  export type FantasyLeagueMembershipUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<FantasyLeagueMembershipCreateWithoutUserInput, FantasyLeagueMembershipUncheckedCreateWithoutUserInput> | FantasyLeagueMembershipCreateWithoutUserInput[] | FantasyLeagueMembershipUncheckedCreateWithoutUserInput[]
    connectOrCreate?: FantasyLeagueMembershipCreateOrConnectWithoutUserInput | FantasyLeagueMembershipCreateOrConnectWithoutUserInput[]
    upsert?: FantasyLeagueMembershipUpsertWithWhereUniqueWithoutUserInput | FantasyLeagueMembershipUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: FantasyLeagueMembershipCreateManyUserInputEnvelope
    set?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    disconnect?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    delete?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    connect?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    update?: FantasyLeagueMembershipUpdateWithWhereUniqueWithoutUserInput | FantasyLeagueMembershipUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: FantasyLeagueMembershipUpdateManyWithWhereWithoutUserInput | FantasyLeagueMembershipUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: FantasyLeagueMembershipScalarWhereInput | FantasyLeagueMembershipScalarWhereInput[]
  }

  export type FantasyLeagueUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<FantasyLeagueCreateWithoutOwnerInput, FantasyLeagueUncheckedCreateWithoutOwnerInput> | FantasyLeagueCreateWithoutOwnerInput[] | FantasyLeagueUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: FantasyLeagueCreateOrConnectWithoutOwnerInput | FantasyLeagueCreateOrConnectWithoutOwnerInput[]
    upsert?: FantasyLeagueUpsertWithWhereUniqueWithoutOwnerInput | FantasyLeagueUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: FantasyLeagueCreateManyOwnerInputEnvelope
    set?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    disconnect?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    delete?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    connect?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    update?: FantasyLeagueUpdateWithWhereUniqueWithoutOwnerInput | FantasyLeagueUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: FantasyLeagueUpdateManyWithWhereWithoutOwnerInput | FantasyLeagueUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: FantasyLeagueScalarWhereInput | FantasyLeagueScalarWhereInput[]
  }

  export type WalletUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<WalletCreateWithoutUserInput, WalletUncheckedCreateWithoutUserInput>
    connectOrCreate?: WalletCreateOrConnectWithoutUserInput
    upsert?: WalletUpsertWithoutUserInput
    disconnect?: WalletWhereInput | boolean
    delete?: WalletWhereInput | boolean
    connect?: WalletWhereUniqueInput
    update?: XOR<XOR<WalletUpdateToOneWithWhereWithoutUserInput, WalletUpdateWithoutUserInput>, WalletUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutWalletInput = {
    create?: XOR<UserCreateWithoutWalletInput, UserUncheckedCreateWithoutWalletInput>
    connectOrCreate?: UserCreateOrConnectWithoutWalletInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutWalletNestedInput = {
    create?: XOR<UserCreateWithoutWalletInput, UserUncheckedCreateWithoutWalletInput>
    connectOrCreate?: UserCreateOrConnectWithoutWalletInput
    upsert?: UserUpsertWithoutWalletInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWalletInput, UserUpdateWithoutWalletInput>, UserUncheckedUpdateWithoutWalletInput>
  }

  export type TeamCreateteamPlayersInput = {
    set: number[]
  }

  export type UserCreateNestedOneWithoutTeamsInput = {
    create?: XOR<UserCreateWithoutTeamsInput, UserUncheckedCreateWithoutTeamsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeamsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumRealLifeLeagueFieldUpdateOperationsInput = {
    set?: $Enums.RealLifeLeague
  }

  export type TeamUpdateteamPlayersInput = {
    set?: number[]
    push?: number | number[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutTeamsNestedInput = {
    create?: XOR<UserCreateWithoutTeamsInput, UserUncheckedCreateWithoutTeamsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeamsInput
    upsert?: UserUpsertWithoutTeamsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTeamsInput, UserUpdateWithoutTeamsInput>, UserUncheckedUpdateWithoutTeamsInput>
  }

  export type FantasyLeagueCreatewinnersArrayInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutOwnedLeaguesInput = {
    create?: XOR<UserCreateWithoutOwnedLeaguesInput, UserUncheckedCreateWithoutOwnedLeaguesInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedLeaguesInput
    connect?: UserWhereUniqueInput
  }

  export type FantasyLeagueMembershipCreateNestedManyWithoutLeagueInput = {
    create?: XOR<FantasyLeagueMembershipCreateWithoutLeagueInput, FantasyLeagueMembershipUncheckedCreateWithoutLeagueInput> | FantasyLeagueMembershipCreateWithoutLeagueInput[] | FantasyLeagueMembershipUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: FantasyLeagueMembershipCreateOrConnectWithoutLeagueInput | FantasyLeagueMembershipCreateOrConnectWithoutLeagueInput[]
    createMany?: FantasyLeagueMembershipCreateManyLeagueInputEnvelope
    connect?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
  }

  export type GameweekCreateNestedOneWithoutLeaguesInput = {
    create?: XOR<GameweekCreateWithoutLeaguesInput, GameweekUncheckedCreateWithoutLeaguesInput>
    connectOrCreate?: GameweekCreateOrConnectWithoutLeaguesInput
    connect?: GameweekWhereUniqueInput
  }

  export type TransactionCreateNestedManyWithoutLeagueInput = {
    create?: XOR<TransactionCreateWithoutLeagueInput, TransactionUncheckedCreateWithoutLeagueInput> | TransactionCreateWithoutLeagueInput[] | TransactionUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutLeagueInput | TransactionCreateOrConnectWithoutLeagueInput[]
    createMany?: TransactionCreateManyLeagueInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type FantasyLeagueMembershipUncheckedCreateNestedManyWithoutLeagueInput = {
    create?: XOR<FantasyLeagueMembershipCreateWithoutLeagueInput, FantasyLeagueMembershipUncheckedCreateWithoutLeagueInput> | FantasyLeagueMembershipCreateWithoutLeagueInput[] | FantasyLeagueMembershipUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: FantasyLeagueMembershipCreateOrConnectWithoutLeagueInput | FantasyLeagueMembershipCreateOrConnectWithoutLeagueInput[]
    createMany?: FantasyLeagueMembershipCreateManyLeagueInputEnvelope
    connect?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutLeagueInput = {
    create?: XOR<TransactionCreateWithoutLeagueInput, TransactionUncheckedCreateWithoutLeagueInput> | TransactionCreateWithoutLeagueInput[] | TransactionUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutLeagueInput | TransactionCreateOrConnectWithoutLeagueInput[]
    createMany?: TransactionCreateManyLeagueInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type FantasyLeagueUpdatewinnersArrayInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneWithoutOwnedLeaguesNestedInput = {
    create?: XOR<UserCreateWithoutOwnedLeaguesInput, UserUncheckedCreateWithoutOwnedLeaguesInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedLeaguesInput
    upsert?: UserUpsertWithoutOwnedLeaguesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOwnedLeaguesInput, UserUpdateWithoutOwnedLeaguesInput>, UserUncheckedUpdateWithoutOwnedLeaguesInput>
  }

  export type FantasyLeagueMembershipUpdateManyWithoutLeagueNestedInput = {
    create?: XOR<FantasyLeagueMembershipCreateWithoutLeagueInput, FantasyLeagueMembershipUncheckedCreateWithoutLeagueInput> | FantasyLeagueMembershipCreateWithoutLeagueInput[] | FantasyLeagueMembershipUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: FantasyLeagueMembershipCreateOrConnectWithoutLeagueInput | FantasyLeagueMembershipCreateOrConnectWithoutLeagueInput[]
    upsert?: FantasyLeagueMembershipUpsertWithWhereUniqueWithoutLeagueInput | FantasyLeagueMembershipUpsertWithWhereUniqueWithoutLeagueInput[]
    createMany?: FantasyLeagueMembershipCreateManyLeagueInputEnvelope
    set?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    disconnect?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    delete?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    connect?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    update?: FantasyLeagueMembershipUpdateWithWhereUniqueWithoutLeagueInput | FantasyLeagueMembershipUpdateWithWhereUniqueWithoutLeagueInput[]
    updateMany?: FantasyLeagueMembershipUpdateManyWithWhereWithoutLeagueInput | FantasyLeagueMembershipUpdateManyWithWhereWithoutLeagueInput[]
    deleteMany?: FantasyLeagueMembershipScalarWhereInput | FantasyLeagueMembershipScalarWhereInput[]
  }

  export type GameweekUpdateOneRequiredWithoutLeaguesNestedInput = {
    create?: XOR<GameweekCreateWithoutLeaguesInput, GameweekUncheckedCreateWithoutLeaguesInput>
    connectOrCreate?: GameweekCreateOrConnectWithoutLeaguesInput
    upsert?: GameweekUpsertWithoutLeaguesInput
    connect?: GameweekWhereUniqueInput
    update?: XOR<XOR<GameweekUpdateToOneWithWhereWithoutLeaguesInput, GameweekUpdateWithoutLeaguesInput>, GameweekUncheckedUpdateWithoutLeaguesInput>
  }

  export type TransactionUpdateManyWithoutLeagueNestedInput = {
    create?: XOR<TransactionCreateWithoutLeagueInput, TransactionUncheckedCreateWithoutLeagueInput> | TransactionCreateWithoutLeagueInput[] | TransactionUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutLeagueInput | TransactionCreateOrConnectWithoutLeagueInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutLeagueInput | TransactionUpsertWithWhereUniqueWithoutLeagueInput[]
    createMany?: TransactionCreateManyLeagueInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutLeagueInput | TransactionUpdateWithWhereUniqueWithoutLeagueInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutLeagueInput | TransactionUpdateManyWithWhereWithoutLeagueInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type FantasyLeagueMembershipUncheckedUpdateManyWithoutLeagueNestedInput = {
    create?: XOR<FantasyLeagueMembershipCreateWithoutLeagueInput, FantasyLeagueMembershipUncheckedCreateWithoutLeagueInput> | FantasyLeagueMembershipCreateWithoutLeagueInput[] | FantasyLeagueMembershipUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: FantasyLeagueMembershipCreateOrConnectWithoutLeagueInput | FantasyLeagueMembershipCreateOrConnectWithoutLeagueInput[]
    upsert?: FantasyLeagueMembershipUpsertWithWhereUniqueWithoutLeagueInput | FantasyLeagueMembershipUpsertWithWhereUniqueWithoutLeagueInput[]
    createMany?: FantasyLeagueMembershipCreateManyLeagueInputEnvelope
    set?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    disconnect?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    delete?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    connect?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
    update?: FantasyLeagueMembershipUpdateWithWhereUniqueWithoutLeagueInput | FantasyLeagueMembershipUpdateWithWhereUniqueWithoutLeagueInput[]
    updateMany?: FantasyLeagueMembershipUpdateManyWithWhereWithoutLeagueInput | FantasyLeagueMembershipUpdateManyWithWhereWithoutLeagueInput[]
    deleteMany?: FantasyLeagueMembershipScalarWhereInput | FantasyLeagueMembershipScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutLeagueNestedInput = {
    create?: XOR<TransactionCreateWithoutLeagueInput, TransactionUncheckedCreateWithoutLeagueInput> | TransactionCreateWithoutLeagueInput[] | TransactionUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutLeagueInput | TransactionCreateOrConnectWithoutLeagueInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutLeagueInput | TransactionUpsertWithWhereUniqueWithoutLeagueInput[]
    createMany?: TransactionCreateManyLeagueInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutLeagueInput | TransactionUpdateWithWhereUniqueWithoutLeagueInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutLeagueInput | TransactionUpdateManyWithWhereWithoutLeagueInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutLeaguesInput = {
    create?: XOR<UserCreateWithoutLeaguesInput, UserUncheckedCreateWithoutLeaguesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLeaguesInput
    connect?: UserWhereUniqueInput
  }

  export type FantasyLeagueCreateNestedOneWithoutMembersInput = {
    create?: XOR<FantasyLeagueCreateWithoutMembersInput, FantasyLeagueUncheckedCreateWithoutMembersInput>
    connectOrCreate?: FantasyLeagueCreateOrConnectWithoutMembersInput
    connect?: FantasyLeagueWhereUniqueInput
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type UserUpdateOneRequiredWithoutLeaguesNestedInput = {
    create?: XOR<UserCreateWithoutLeaguesInput, UserUncheckedCreateWithoutLeaguesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLeaguesInput
    upsert?: UserUpsertWithoutLeaguesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLeaguesInput, UserUpdateWithoutLeaguesInput>, UserUncheckedUpdateWithoutLeaguesInput>
  }

  export type FantasyLeagueUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<FantasyLeagueCreateWithoutMembersInput, FantasyLeagueUncheckedCreateWithoutMembersInput>
    connectOrCreate?: FantasyLeagueCreateOrConnectWithoutMembersInput
    upsert?: FantasyLeagueUpsertWithoutMembersInput
    connect?: FantasyLeagueWhereUniqueInput
    update?: XOR<XOR<FantasyLeagueUpdateToOneWithWhereWithoutMembersInput, FantasyLeagueUpdateWithoutMembersInput>, FantasyLeagueUncheckedUpdateWithoutMembersInput>
  }

  export type FantasyLeagueCreateNestedManyWithoutGameweekInput = {
    create?: XOR<FantasyLeagueCreateWithoutGameweekInput, FantasyLeagueUncheckedCreateWithoutGameweekInput> | FantasyLeagueCreateWithoutGameweekInput[] | FantasyLeagueUncheckedCreateWithoutGameweekInput[]
    connectOrCreate?: FantasyLeagueCreateOrConnectWithoutGameweekInput | FantasyLeagueCreateOrConnectWithoutGameweekInput[]
    createMany?: FantasyLeagueCreateManyGameweekInputEnvelope
    connect?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
  }

  export type FantasyLeagueUncheckedCreateNestedManyWithoutGameweekInput = {
    create?: XOR<FantasyLeagueCreateWithoutGameweekInput, FantasyLeagueUncheckedCreateWithoutGameweekInput> | FantasyLeagueCreateWithoutGameweekInput[] | FantasyLeagueUncheckedCreateWithoutGameweekInput[]
    connectOrCreate?: FantasyLeagueCreateOrConnectWithoutGameweekInput | FantasyLeagueCreateOrConnectWithoutGameweekInput[]
    createMany?: FantasyLeagueCreateManyGameweekInputEnvelope
    connect?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type FantasyLeagueUpdateManyWithoutGameweekNestedInput = {
    create?: XOR<FantasyLeagueCreateWithoutGameweekInput, FantasyLeagueUncheckedCreateWithoutGameweekInput> | FantasyLeagueCreateWithoutGameweekInput[] | FantasyLeagueUncheckedCreateWithoutGameweekInput[]
    connectOrCreate?: FantasyLeagueCreateOrConnectWithoutGameweekInput | FantasyLeagueCreateOrConnectWithoutGameweekInput[]
    upsert?: FantasyLeagueUpsertWithWhereUniqueWithoutGameweekInput | FantasyLeagueUpsertWithWhereUniqueWithoutGameweekInput[]
    createMany?: FantasyLeagueCreateManyGameweekInputEnvelope
    set?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    disconnect?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    delete?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    connect?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    update?: FantasyLeagueUpdateWithWhereUniqueWithoutGameweekInput | FantasyLeagueUpdateWithWhereUniqueWithoutGameweekInput[]
    updateMany?: FantasyLeagueUpdateManyWithWhereWithoutGameweekInput | FantasyLeagueUpdateManyWithWhereWithoutGameweekInput[]
    deleteMany?: FantasyLeagueScalarWhereInput | FantasyLeagueScalarWhereInput[]
  }

  export type FantasyLeagueUncheckedUpdateManyWithoutGameweekNestedInput = {
    create?: XOR<FantasyLeagueCreateWithoutGameweekInput, FantasyLeagueUncheckedCreateWithoutGameweekInput> | FantasyLeagueCreateWithoutGameweekInput[] | FantasyLeagueUncheckedCreateWithoutGameweekInput[]
    connectOrCreate?: FantasyLeagueCreateOrConnectWithoutGameweekInput | FantasyLeagueCreateOrConnectWithoutGameweekInput[]
    upsert?: FantasyLeagueUpsertWithWhereUniqueWithoutGameweekInput | FantasyLeagueUpsertWithWhereUniqueWithoutGameweekInput[]
    createMany?: FantasyLeagueCreateManyGameweekInputEnvelope
    set?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    disconnect?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    delete?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    connect?: FantasyLeagueWhereUniqueInput | FantasyLeagueWhereUniqueInput[]
    update?: FantasyLeagueUpdateWithWhereUniqueWithoutGameweekInput | FantasyLeagueUpdateWithWhereUniqueWithoutGameweekInput[]
    updateMany?: FantasyLeagueUpdateManyWithWhereWithoutGameweekInput | FantasyLeagueUpdateManyWithWhereWithoutGameweekInput[]
    deleteMany?: FantasyLeagueScalarWhereInput | FantasyLeagueScalarWhereInput[]
  }

  export type FantasyLeagueCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<FantasyLeagueCreateWithoutTransactionsInput, FantasyLeagueUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: FantasyLeagueCreateOrConnectWithoutTransactionsInput
    connect?: FantasyLeagueWhereUniqueInput
  }

  export type FantasyLeagueUpdateOneWithoutTransactionsNestedInput = {
    create?: XOR<FantasyLeagueCreateWithoutTransactionsInput, FantasyLeagueUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: FantasyLeagueCreateOrConnectWithoutTransactionsInput
    upsert?: FantasyLeagueUpsertWithoutTransactionsInput
    disconnect?: FantasyLeagueWhereInput | boolean
    delete?: FantasyLeagueWhereInput | boolean
    connect?: FantasyLeagueWhereUniqueInput
    update?: XOR<XOR<FantasyLeagueUpdateToOneWithWhereWithoutTransactionsInput, FantasyLeagueUpdateWithoutTransactionsInput>, FantasyLeagueUncheckedUpdateWithoutTransactionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumRealLifeLeagueFilter<$PrismaModel = never> = {
    equals?: $Enums.RealLifeLeague | EnumRealLifeLeagueFieldRefInput<$PrismaModel>
    in?: $Enums.RealLifeLeague[] | ListEnumRealLifeLeagueFieldRefInput<$PrismaModel>
    notIn?: $Enums.RealLifeLeague[] | ListEnumRealLifeLeagueFieldRefInput<$PrismaModel>
    not?: NestedEnumRealLifeLeagueFilter<$PrismaModel> | $Enums.RealLifeLeague
  }

  export type NestedEnumRealLifeLeagueWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RealLifeLeague | EnumRealLifeLeagueFieldRefInput<$PrismaModel>
    in?: $Enums.RealLifeLeague[] | ListEnumRealLifeLeagueFieldRefInput<$PrismaModel>
    notIn?: $Enums.RealLifeLeague[] | ListEnumRealLifeLeagueFieldRefInput<$PrismaModel>
    not?: NestedEnumRealLifeLeagueWithAggregatesFilter<$PrismaModel> | $Enums.RealLifeLeague
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRealLifeLeagueFilter<$PrismaModel>
    _max?: NestedEnumRealLifeLeagueFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type TeamCreateWithoutUserInput = {
    id?: string
    realLifeLeague?: $Enums.RealLifeLeague
    teamValue?: number
    teamPlayers?: TeamCreateteamPlayersInput | number[]
    captainId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TeamUncheckedCreateWithoutUserInput = {
    id?: string
    realLifeLeague?: $Enums.RealLifeLeague
    teamValue?: number
    teamPlayers?: TeamCreateteamPlayersInput | number[]
    captainId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TeamCreateOrConnectWithoutUserInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutUserInput, TeamUncheckedCreateWithoutUserInput>
  }

  export type TeamCreateManyUserInputEnvelope = {
    data: TeamCreateManyUserInput | TeamCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FantasyLeagueMembershipCreateWithoutUserInput = {
    id?: string
    teamName?: string | null
    stakeAmount?: Decimal | DecimalJsLike | number | string | null
    position?: number | null
    score?: Decimal | DecimalJsLike | number | string | null
    payoutAmount?: Decimal | DecimalJsLike | number | string | null
    payoutStatus?: string
    blockchainTxHash?: string | null
    status?: string
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    league: FantasyLeagueCreateNestedOneWithoutMembersInput
  }

  export type FantasyLeagueMembershipUncheckedCreateWithoutUserInput = {
    id?: string
    leagueId: string
    teamName?: string | null
    stakeAmount?: Decimal | DecimalJsLike | number | string | null
    position?: number | null
    score?: Decimal | DecimalJsLike | number | string | null
    payoutAmount?: Decimal | DecimalJsLike | number | string | null
    payoutStatus?: string
    blockchainTxHash?: string | null
    status?: string
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueMembershipCreateOrConnectWithoutUserInput = {
    where: FantasyLeagueMembershipWhereUniqueInput
    create: XOR<FantasyLeagueMembershipCreateWithoutUserInput, FantasyLeagueMembershipUncheckedCreateWithoutUserInput>
  }

  export type FantasyLeagueMembershipCreateManyUserInputEnvelope = {
    data: FantasyLeagueMembershipCreateManyUserInput | FantasyLeagueMembershipCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FantasyLeagueCreateWithoutOwnerInput = {
    id?: string
    name: string
    description?: string | null
    stake?: string | null
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    code: string
    realLifeLeague?: $Enums.RealLifeLeague
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    entryFeeUsd?: Decimal | DecimalJsLike | number | string
    totalPoolUsd?: Decimal | DecimalJsLike | number | string
    currentParticipants?: number
    blockchainTxHash?: string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: string
    commissionRate?: Decimal | DecimalJsLike | number | string
    creatorCommission?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: FantasyLeagueMembershipCreateNestedManyWithoutLeagueInput
    gameweek: GameweekCreateNestedOneWithoutLeaguesInput
    transactions?: TransactionCreateNestedManyWithoutLeagueInput
  }

  export type FantasyLeagueUncheckedCreateWithoutOwnerInput = {
    id?: string
    name: string
    description?: string | null
    stake?: string | null
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    code: string
    realLifeLeague?: $Enums.RealLifeLeague
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    entryFeeUsd?: Decimal | DecimalJsLike | number | string
    totalPoolUsd?: Decimal | DecimalJsLike | number | string
    currentParticipants?: number
    blockchainTxHash?: string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: string
    commissionRate?: Decimal | DecimalJsLike | number | string
    creatorCommission?: Decimal | DecimalJsLike | number | string
    gameweekId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: FantasyLeagueMembershipUncheckedCreateNestedManyWithoutLeagueInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutLeagueInput
  }

  export type FantasyLeagueCreateOrConnectWithoutOwnerInput = {
    where: FantasyLeagueWhereUniqueInput
    create: XOR<FantasyLeagueCreateWithoutOwnerInput, FantasyLeagueUncheckedCreateWithoutOwnerInput>
  }

  export type FantasyLeagueCreateManyOwnerInputEnvelope = {
    data: FantasyLeagueCreateManyOwnerInput | FantasyLeagueCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type WalletCreateWithoutUserInput = {
    id?: string
    address: string
    encryptedPrivateKey: string
    balance?: Decimal | DecimalJsLike | number | string
    lastBalanceUpdate?: Date | string | null
    createdAt?: Date | string
  }

  export type WalletUncheckedCreateWithoutUserInput = {
    id?: string
    address: string
    encryptedPrivateKey: string
    balance?: Decimal | DecimalJsLike | number | string
    lastBalanceUpdate?: Date | string | null
    createdAt?: Date | string
  }

  export type WalletCreateOrConnectWithoutUserInput = {
    where: WalletWhereUniqueInput
    create: XOR<WalletCreateWithoutUserInput, WalletUncheckedCreateWithoutUserInput>
  }

  export type TeamUpsertWithWhereUniqueWithoutUserInput = {
    where: TeamWhereUniqueInput
    update: XOR<TeamUpdateWithoutUserInput, TeamUncheckedUpdateWithoutUserInput>
    create: XOR<TeamCreateWithoutUserInput, TeamUncheckedCreateWithoutUserInput>
  }

  export type TeamUpdateWithWhereUniqueWithoutUserInput = {
    where: TeamWhereUniqueInput
    data: XOR<TeamUpdateWithoutUserInput, TeamUncheckedUpdateWithoutUserInput>
  }

  export type TeamUpdateManyWithWhereWithoutUserInput = {
    where: TeamScalarWhereInput
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyWithoutUserInput>
  }

  export type TeamScalarWhereInput = {
    AND?: TeamScalarWhereInput | TeamScalarWhereInput[]
    OR?: TeamScalarWhereInput[]
    NOT?: TeamScalarWhereInput | TeamScalarWhereInput[]
    id?: StringFilter<"Team"> | string
    userId?: StringFilter<"Team"> | string
    realLifeLeague?: EnumRealLifeLeagueFilter<"Team"> | $Enums.RealLifeLeague
    teamValue?: IntFilter<"Team"> | number
    teamPlayers?: IntNullableListFilter<"Team">
    captainId?: IntNullableFilter<"Team"> | number | null
    createdAt?: DateTimeFilter<"Team"> | Date | string
    updatedAt?: DateTimeFilter<"Team"> | Date | string
  }

  export type FantasyLeagueMembershipUpsertWithWhereUniqueWithoutUserInput = {
    where: FantasyLeagueMembershipWhereUniqueInput
    update: XOR<FantasyLeagueMembershipUpdateWithoutUserInput, FantasyLeagueMembershipUncheckedUpdateWithoutUserInput>
    create: XOR<FantasyLeagueMembershipCreateWithoutUserInput, FantasyLeagueMembershipUncheckedCreateWithoutUserInput>
  }

  export type FantasyLeagueMembershipUpdateWithWhereUniqueWithoutUserInput = {
    where: FantasyLeagueMembershipWhereUniqueInput
    data: XOR<FantasyLeagueMembershipUpdateWithoutUserInput, FantasyLeagueMembershipUncheckedUpdateWithoutUserInput>
  }

  export type FantasyLeagueMembershipUpdateManyWithWhereWithoutUserInput = {
    where: FantasyLeagueMembershipScalarWhereInput
    data: XOR<FantasyLeagueMembershipUpdateManyMutationInput, FantasyLeagueMembershipUncheckedUpdateManyWithoutUserInput>
  }

  export type FantasyLeagueMembershipScalarWhereInput = {
    AND?: FantasyLeagueMembershipScalarWhereInput | FantasyLeagueMembershipScalarWhereInput[]
    OR?: FantasyLeagueMembershipScalarWhereInput[]
    NOT?: FantasyLeagueMembershipScalarWhereInput | FantasyLeagueMembershipScalarWhereInput[]
    id?: StringFilter<"FantasyLeagueMembership"> | string
    userId?: StringFilter<"FantasyLeagueMembership"> | string
    leagueId?: StringFilter<"FantasyLeagueMembership"> | string
    teamName?: StringNullableFilter<"FantasyLeagueMembership"> | string | null
    stakeAmount?: DecimalNullableFilter<"FantasyLeagueMembership"> | Decimal | DecimalJsLike | number | string | null
    position?: IntNullableFilter<"FantasyLeagueMembership"> | number | null
    score?: DecimalNullableFilter<"FantasyLeagueMembership"> | Decimal | DecimalJsLike | number | string | null
    payoutAmount?: DecimalNullableFilter<"FantasyLeagueMembership"> | Decimal | DecimalJsLike | number | string | null
    payoutStatus?: StringFilter<"FantasyLeagueMembership"> | string
    blockchainTxHash?: StringNullableFilter<"FantasyLeagueMembership"> | string | null
    status?: StringFilter<"FantasyLeagueMembership"> | string
    joinedAt?: DateTimeFilter<"FantasyLeagueMembership"> | Date | string
    createdAt?: DateTimeFilter<"FantasyLeagueMembership"> | Date | string
    updatedAt?: DateTimeFilter<"FantasyLeagueMembership"> | Date | string
  }

  export type FantasyLeagueUpsertWithWhereUniqueWithoutOwnerInput = {
    where: FantasyLeagueWhereUniqueInput
    update: XOR<FantasyLeagueUpdateWithoutOwnerInput, FantasyLeagueUncheckedUpdateWithoutOwnerInput>
    create: XOR<FantasyLeagueCreateWithoutOwnerInput, FantasyLeagueUncheckedCreateWithoutOwnerInput>
  }

  export type FantasyLeagueUpdateWithWhereUniqueWithoutOwnerInput = {
    where: FantasyLeagueWhereUniqueInput
    data: XOR<FantasyLeagueUpdateWithoutOwnerInput, FantasyLeagueUncheckedUpdateWithoutOwnerInput>
  }

  export type FantasyLeagueUpdateManyWithWhereWithoutOwnerInput = {
    where: FantasyLeagueScalarWhereInput
    data: XOR<FantasyLeagueUpdateManyMutationInput, FantasyLeagueUncheckedUpdateManyWithoutOwnerInput>
  }

  export type FantasyLeagueScalarWhereInput = {
    AND?: FantasyLeagueScalarWhereInput | FantasyLeagueScalarWhereInput[]
    OR?: FantasyLeagueScalarWhereInput[]
    NOT?: FantasyLeagueScalarWhereInput | FantasyLeagueScalarWhereInput[]
    id?: StringFilter<"FantasyLeague"> | string
    name?: StringFilter<"FantasyLeague"> | string
    description?: StringNullableFilter<"FantasyLeague"> | string | null
    stake?: StringNullableFilter<"FantasyLeague"> | string | null
    limit?: IntFilter<"FantasyLeague"> | number
    leagueType?: StringFilter<"FantasyLeague"> | string
    leagueMode?: StringFilter<"FantasyLeague"> | string
    winners?: IntFilter<"FantasyLeague"> | number
    code?: StringFilter<"FantasyLeague"> | string
    ownerId?: StringNullableFilter<"FantasyLeague"> | string | null
    realLifeLeague?: EnumRealLifeLeagueFilter<"FantasyLeague"> | $Enums.RealLifeLeague
    status?: StringFilter<"FantasyLeague"> | string
    winnersArray?: StringNullableListFilter<"FantasyLeague">
    entryFeeUsd?: DecimalFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFilter<"FantasyLeague"> | number
    blockchainTxHash?: StringNullableFilter<"FantasyLeague"> | string | null
    prizeDistribution?: JsonNullableFilter<"FantasyLeague">
    paymentMethod?: StringFilter<"FantasyLeague"> | string
    commissionRate?: DecimalFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFilter<"FantasyLeague"> | Decimal | DecimalJsLike | number | string
    gameweekId?: IntFilter<"FantasyLeague"> | number
    createdAt?: DateTimeFilter<"FantasyLeague"> | Date | string
    updatedAt?: DateTimeFilter<"FantasyLeague"> | Date | string
  }

  export type WalletUpsertWithoutUserInput = {
    update: XOR<WalletUpdateWithoutUserInput, WalletUncheckedUpdateWithoutUserInput>
    create: XOR<WalletCreateWithoutUserInput, WalletUncheckedCreateWithoutUserInput>
    where?: WalletWhereInput
  }

  export type WalletUpdateToOneWithWhereWithoutUserInput = {
    where?: WalletWhereInput
    data: XOR<WalletUpdateWithoutUserInput, WalletUncheckedUpdateWithoutUserInput>
  }

  export type WalletUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    encryptedPrivateKey?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastBalanceUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WalletUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    encryptedPrivateKey?: StringFieldUpdateOperationsInput | string
    balance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    lastBalanceUpdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutWalletInput = {
    id?: string
    email: string
    name?: string | null
    image?: string | null
    password?: string | null
    country?: string | null
    currency?: string | null
    coins?: number
    balanceUsd?: Decimal | DecimalJsLike | number | string
    totalDeposited?: Decimal | DecimalJsLike | number | string
    totalWithdrawn?: Decimal | DecimalJsLike | number | string
    walletAddress?: string | null
    kycStatus?: string
    mobileMoneyNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    teams?: TeamCreateNestedManyWithoutUserInput
    leagues?: FantasyLeagueMembershipCreateNestedManyWithoutUserInput
    ownedLeagues?: FantasyLeagueCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutWalletInput = {
    id?: string
    email: string
    name?: string | null
    image?: string | null
    password?: string | null
    country?: string | null
    currency?: string | null
    coins?: number
    balanceUsd?: Decimal | DecimalJsLike | number | string
    totalDeposited?: Decimal | DecimalJsLike | number | string
    totalWithdrawn?: Decimal | DecimalJsLike | number | string
    walletAddress?: string | null
    kycStatus?: string
    mobileMoneyNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    teams?: TeamUncheckedCreateNestedManyWithoutUserInput
    leagues?: FantasyLeagueMembershipUncheckedCreateNestedManyWithoutUserInput
    ownedLeagues?: FantasyLeagueUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutWalletInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWalletInput, UserUncheckedCreateWithoutWalletInput>
  }

  export type UserUpsertWithoutWalletInput = {
    update: XOR<UserUpdateWithoutWalletInput, UserUncheckedUpdateWithoutWalletInput>
    create: XOR<UserCreateWithoutWalletInput, UserUncheckedCreateWithoutWalletInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWalletInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWalletInput, UserUncheckedUpdateWithoutWalletInput>
  }

  export type UserUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    coins?: IntFieldUpdateOperationsInput | number
    balanceUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeposited?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWithdrawn?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: StringFieldUpdateOperationsInput | string
    mobileMoneyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teams?: TeamUpdateManyWithoutUserNestedInput
    leagues?: FantasyLeagueMembershipUpdateManyWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutWalletInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    coins?: IntFieldUpdateOperationsInput | number
    balanceUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeposited?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWithdrawn?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: StringFieldUpdateOperationsInput | string
    mobileMoneyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teams?: TeamUncheckedUpdateManyWithoutUserNestedInput
    leagues?: FantasyLeagueMembershipUncheckedUpdateManyWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type UserCreateWithoutTeamsInput = {
    id?: string
    email: string
    name?: string | null
    image?: string | null
    password?: string | null
    country?: string | null
    currency?: string | null
    coins?: number
    balanceUsd?: Decimal | DecimalJsLike | number | string
    totalDeposited?: Decimal | DecimalJsLike | number | string
    totalWithdrawn?: Decimal | DecimalJsLike | number | string
    walletAddress?: string | null
    kycStatus?: string
    mobileMoneyNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leagues?: FantasyLeagueMembershipCreateNestedManyWithoutUserInput
    ownedLeagues?: FantasyLeagueCreateNestedManyWithoutOwnerInput
    wallet?: WalletCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTeamsInput = {
    id?: string
    email: string
    name?: string | null
    image?: string | null
    password?: string | null
    country?: string | null
    currency?: string | null
    coins?: number
    balanceUsd?: Decimal | DecimalJsLike | number | string
    totalDeposited?: Decimal | DecimalJsLike | number | string
    totalWithdrawn?: Decimal | DecimalJsLike | number | string
    walletAddress?: string | null
    kycStatus?: string
    mobileMoneyNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    leagues?: FantasyLeagueMembershipUncheckedCreateNestedManyWithoutUserInput
    ownedLeagues?: FantasyLeagueUncheckedCreateNestedManyWithoutOwnerInput
    wallet?: WalletUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTeamsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTeamsInput, UserUncheckedCreateWithoutTeamsInput>
  }

  export type UserUpsertWithoutTeamsInput = {
    update: XOR<UserUpdateWithoutTeamsInput, UserUncheckedUpdateWithoutTeamsInput>
    create: XOR<UserCreateWithoutTeamsInput, UserUncheckedCreateWithoutTeamsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTeamsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTeamsInput, UserUncheckedUpdateWithoutTeamsInput>
  }

  export type UserUpdateWithoutTeamsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    coins?: IntFieldUpdateOperationsInput | number
    balanceUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeposited?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWithdrawn?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: StringFieldUpdateOperationsInput | string
    mobileMoneyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leagues?: FantasyLeagueMembershipUpdateManyWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUpdateManyWithoutOwnerNestedInput
    wallet?: WalletUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTeamsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    coins?: IntFieldUpdateOperationsInput | number
    balanceUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeposited?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWithdrawn?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: StringFieldUpdateOperationsInput | string
    mobileMoneyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leagues?: FantasyLeagueMembershipUncheckedUpdateManyWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUncheckedUpdateManyWithoutOwnerNestedInput
    wallet?: WalletUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutOwnedLeaguesInput = {
    id?: string
    email: string
    name?: string | null
    image?: string | null
    password?: string | null
    country?: string | null
    currency?: string | null
    coins?: number
    balanceUsd?: Decimal | DecimalJsLike | number | string
    totalDeposited?: Decimal | DecimalJsLike | number | string
    totalWithdrawn?: Decimal | DecimalJsLike | number | string
    walletAddress?: string | null
    kycStatus?: string
    mobileMoneyNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    teams?: TeamCreateNestedManyWithoutUserInput
    leagues?: FantasyLeagueMembershipCreateNestedManyWithoutUserInput
    wallet?: WalletCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOwnedLeaguesInput = {
    id?: string
    email: string
    name?: string | null
    image?: string | null
    password?: string | null
    country?: string | null
    currency?: string | null
    coins?: number
    balanceUsd?: Decimal | DecimalJsLike | number | string
    totalDeposited?: Decimal | DecimalJsLike | number | string
    totalWithdrawn?: Decimal | DecimalJsLike | number | string
    walletAddress?: string | null
    kycStatus?: string
    mobileMoneyNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    teams?: TeamUncheckedCreateNestedManyWithoutUserInput
    leagues?: FantasyLeagueMembershipUncheckedCreateNestedManyWithoutUserInput
    wallet?: WalletUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOwnedLeaguesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOwnedLeaguesInput, UserUncheckedCreateWithoutOwnedLeaguesInput>
  }

  export type FantasyLeagueMembershipCreateWithoutLeagueInput = {
    id?: string
    teamName?: string | null
    stakeAmount?: Decimal | DecimalJsLike | number | string | null
    position?: number | null
    score?: Decimal | DecimalJsLike | number | string | null
    payoutAmount?: Decimal | DecimalJsLike | number | string | null
    payoutStatus?: string
    blockchainTxHash?: string | null
    status?: string
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutLeaguesInput
  }

  export type FantasyLeagueMembershipUncheckedCreateWithoutLeagueInput = {
    id?: string
    userId: string
    teamName?: string | null
    stakeAmount?: Decimal | DecimalJsLike | number | string | null
    position?: number | null
    score?: Decimal | DecimalJsLike | number | string | null
    payoutAmount?: Decimal | DecimalJsLike | number | string | null
    payoutStatus?: string
    blockchainTxHash?: string | null
    status?: string
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueMembershipCreateOrConnectWithoutLeagueInput = {
    where: FantasyLeagueMembershipWhereUniqueInput
    create: XOR<FantasyLeagueMembershipCreateWithoutLeagueInput, FantasyLeagueMembershipUncheckedCreateWithoutLeagueInput>
  }

  export type FantasyLeagueMembershipCreateManyLeagueInputEnvelope = {
    data: FantasyLeagueMembershipCreateManyLeagueInput | FantasyLeagueMembershipCreateManyLeagueInput[]
    skipDuplicates?: boolean
  }

  export type GameweekCreateWithoutLeaguesInput = {
    id: number
    deadline: Date | string
    isActive?: boolean
    realLifeLeague?: $Enums.RealLifeLeague
  }

  export type GameweekUncheckedCreateWithoutLeaguesInput = {
    id: number
    deadline: Date | string
    isActive?: boolean
    realLifeLeague?: $Enums.RealLifeLeague
  }

  export type GameweekCreateOrConnectWithoutLeaguesInput = {
    where: GameweekWhereUniqueInput
    create: XOR<GameweekCreateWithoutLeaguesInput, GameweekUncheckedCreateWithoutLeaguesInput>
  }

  export type TransactionCreateWithoutLeagueInput = {
    id?: string
    txHash: string
    type: string
    userId?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    status?: string
    blockNumber?: number | null
    gasUsed?: string | null
    errorMessage?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    confirmedAt?: Date | string | null
  }

  export type TransactionUncheckedCreateWithoutLeagueInput = {
    id?: string
    txHash: string
    type: string
    userId?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    status?: string
    blockNumber?: number | null
    gasUsed?: string | null
    errorMessage?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    confirmedAt?: Date | string | null
  }

  export type TransactionCreateOrConnectWithoutLeagueInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutLeagueInput, TransactionUncheckedCreateWithoutLeagueInput>
  }

  export type TransactionCreateManyLeagueInputEnvelope = {
    data: TransactionCreateManyLeagueInput | TransactionCreateManyLeagueInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutOwnedLeaguesInput = {
    update: XOR<UserUpdateWithoutOwnedLeaguesInput, UserUncheckedUpdateWithoutOwnedLeaguesInput>
    create: XOR<UserCreateWithoutOwnedLeaguesInput, UserUncheckedCreateWithoutOwnedLeaguesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOwnedLeaguesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOwnedLeaguesInput, UserUncheckedUpdateWithoutOwnedLeaguesInput>
  }

  export type UserUpdateWithoutOwnedLeaguesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    coins?: IntFieldUpdateOperationsInput | number
    balanceUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeposited?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWithdrawn?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: StringFieldUpdateOperationsInput | string
    mobileMoneyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teams?: TeamUpdateManyWithoutUserNestedInput
    leagues?: FantasyLeagueMembershipUpdateManyWithoutUserNestedInput
    wallet?: WalletUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOwnedLeaguesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    coins?: IntFieldUpdateOperationsInput | number
    balanceUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeposited?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWithdrawn?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: StringFieldUpdateOperationsInput | string
    mobileMoneyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teams?: TeamUncheckedUpdateManyWithoutUserNestedInput
    leagues?: FantasyLeagueMembershipUncheckedUpdateManyWithoutUserNestedInput
    wallet?: WalletUncheckedUpdateOneWithoutUserNestedInput
  }

  export type FantasyLeagueMembershipUpsertWithWhereUniqueWithoutLeagueInput = {
    where: FantasyLeagueMembershipWhereUniqueInput
    update: XOR<FantasyLeagueMembershipUpdateWithoutLeagueInput, FantasyLeagueMembershipUncheckedUpdateWithoutLeagueInput>
    create: XOR<FantasyLeagueMembershipCreateWithoutLeagueInput, FantasyLeagueMembershipUncheckedCreateWithoutLeagueInput>
  }

  export type FantasyLeagueMembershipUpdateWithWhereUniqueWithoutLeagueInput = {
    where: FantasyLeagueMembershipWhereUniqueInput
    data: XOR<FantasyLeagueMembershipUpdateWithoutLeagueInput, FantasyLeagueMembershipUncheckedUpdateWithoutLeagueInput>
  }

  export type FantasyLeagueMembershipUpdateManyWithWhereWithoutLeagueInput = {
    where: FantasyLeagueMembershipScalarWhereInput
    data: XOR<FantasyLeagueMembershipUpdateManyMutationInput, FantasyLeagueMembershipUncheckedUpdateManyWithoutLeagueInput>
  }

  export type GameweekUpsertWithoutLeaguesInput = {
    update: XOR<GameweekUpdateWithoutLeaguesInput, GameweekUncheckedUpdateWithoutLeaguesInput>
    create: XOR<GameweekCreateWithoutLeaguesInput, GameweekUncheckedCreateWithoutLeaguesInput>
    where?: GameweekWhereInput
  }

  export type GameweekUpdateToOneWithWhereWithoutLeaguesInput = {
    where?: GameweekWhereInput
    data: XOR<GameweekUpdateWithoutLeaguesInput, GameweekUncheckedUpdateWithoutLeaguesInput>
  }

  export type GameweekUpdateWithoutLeaguesInput = {
    id?: IntFieldUpdateOperationsInput | number
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
  }

  export type GameweekUncheckedUpdateWithoutLeaguesInput = {
    id?: IntFieldUpdateOperationsInput | number
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
  }

  export type TransactionUpsertWithWhereUniqueWithoutLeagueInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutLeagueInput, TransactionUncheckedUpdateWithoutLeagueInput>
    create: XOR<TransactionCreateWithoutLeagueInput, TransactionUncheckedCreateWithoutLeagueInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutLeagueInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutLeagueInput, TransactionUncheckedUpdateWithoutLeagueInput>
  }

  export type TransactionUpdateManyWithWhereWithoutLeagueInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutLeagueInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: StringFilter<"Transaction"> | string
    txHash?: StringFilter<"Transaction"> | string
    type?: StringFilter<"Transaction"> | string
    leagueId?: StringNullableFilter<"Transaction"> | string | null
    userId?: StringNullableFilter<"Transaction"> | string | null
    amount?: DecimalNullableFilter<"Transaction"> | Decimal | DecimalJsLike | number | string | null
    status?: StringFilter<"Transaction"> | string
    blockNumber?: IntNullableFilter<"Transaction"> | number | null
    gasUsed?: StringNullableFilter<"Transaction"> | string | null
    errorMessage?: StringNullableFilter<"Transaction"> | string | null
    metadata?: JsonNullableFilter<"Transaction">
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    confirmedAt?: DateTimeNullableFilter<"Transaction"> | Date | string | null
  }

  export type UserCreateWithoutLeaguesInput = {
    id?: string
    email: string
    name?: string | null
    image?: string | null
    password?: string | null
    country?: string | null
    currency?: string | null
    coins?: number
    balanceUsd?: Decimal | DecimalJsLike | number | string
    totalDeposited?: Decimal | DecimalJsLike | number | string
    totalWithdrawn?: Decimal | DecimalJsLike | number | string
    walletAddress?: string | null
    kycStatus?: string
    mobileMoneyNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    teams?: TeamCreateNestedManyWithoutUserInput
    ownedLeagues?: FantasyLeagueCreateNestedManyWithoutOwnerInput
    wallet?: WalletCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLeaguesInput = {
    id?: string
    email: string
    name?: string | null
    image?: string | null
    password?: string | null
    country?: string | null
    currency?: string | null
    coins?: number
    balanceUsd?: Decimal | DecimalJsLike | number | string
    totalDeposited?: Decimal | DecimalJsLike | number | string
    totalWithdrawn?: Decimal | DecimalJsLike | number | string
    walletAddress?: string | null
    kycStatus?: string
    mobileMoneyNumber?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    teams?: TeamUncheckedCreateNestedManyWithoutUserInput
    ownedLeagues?: FantasyLeagueUncheckedCreateNestedManyWithoutOwnerInput
    wallet?: WalletUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLeaguesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLeaguesInput, UserUncheckedCreateWithoutLeaguesInput>
  }

  export type FantasyLeagueCreateWithoutMembersInput = {
    id?: string
    name: string
    description?: string | null
    stake?: string | null
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    code: string
    realLifeLeague?: $Enums.RealLifeLeague
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    entryFeeUsd?: Decimal | DecimalJsLike | number | string
    totalPoolUsd?: Decimal | DecimalJsLike | number | string
    currentParticipants?: number
    blockchainTxHash?: string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: string
    commissionRate?: Decimal | DecimalJsLike | number | string
    creatorCommission?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutOwnedLeaguesInput
    gameweek: GameweekCreateNestedOneWithoutLeaguesInput
    transactions?: TransactionCreateNestedManyWithoutLeagueInput
  }

  export type FantasyLeagueUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    description?: string | null
    stake?: string | null
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    code: string
    ownerId?: string | null
    realLifeLeague?: $Enums.RealLifeLeague
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    entryFeeUsd?: Decimal | DecimalJsLike | number | string
    totalPoolUsd?: Decimal | DecimalJsLike | number | string
    currentParticipants?: number
    blockchainTxHash?: string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: string
    commissionRate?: Decimal | DecimalJsLike | number | string
    creatorCommission?: Decimal | DecimalJsLike | number | string
    gameweekId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutLeagueInput
  }

  export type FantasyLeagueCreateOrConnectWithoutMembersInput = {
    where: FantasyLeagueWhereUniqueInput
    create: XOR<FantasyLeagueCreateWithoutMembersInput, FantasyLeagueUncheckedCreateWithoutMembersInput>
  }

  export type UserUpsertWithoutLeaguesInput = {
    update: XOR<UserUpdateWithoutLeaguesInput, UserUncheckedUpdateWithoutLeaguesInput>
    create: XOR<UserCreateWithoutLeaguesInput, UserUncheckedCreateWithoutLeaguesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLeaguesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLeaguesInput, UserUncheckedUpdateWithoutLeaguesInput>
  }

  export type UserUpdateWithoutLeaguesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    coins?: IntFieldUpdateOperationsInput | number
    balanceUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeposited?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWithdrawn?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: StringFieldUpdateOperationsInput | string
    mobileMoneyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teams?: TeamUpdateManyWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUpdateManyWithoutOwnerNestedInput
    wallet?: WalletUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLeaguesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    coins?: IntFieldUpdateOperationsInput | number
    balanceUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalDeposited?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalWithdrawn?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    walletAddress?: NullableStringFieldUpdateOperationsInput | string | null
    kycStatus?: StringFieldUpdateOperationsInput | string
    mobileMoneyNumber?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teams?: TeamUncheckedUpdateManyWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUncheckedUpdateManyWithoutOwnerNestedInput
    wallet?: WalletUncheckedUpdateOneWithoutUserNestedInput
  }

  export type FantasyLeagueUpsertWithoutMembersInput = {
    update: XOR<FantasyLeagueUpdateWithoutMembersInput, FantasyLeagueUncheckedUpdateWithoutMembersInput>
    create: XOR<FantasyLeagueCreateWithoutMembersInput, FantasyLeagueUncheckedCreateWithoutMembersInput>
    where?: FantasyLeagueWhereInput
  }

  export type FantasyLeagueUpdateToOneWithWhereWithoutMembersInput = {
    where?: FantasyLeagueWhereInput
    data: XOR<FantasyLeagueUpdateWithoutMembersInput, FantasyLeagueUncheckedUpdateWithoutMembersInput>
  }

  export type FantasyLeagueUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    stake?: NullableStringFieldUpdateOperationsInput | string | null
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    entryFeeUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFieldUpdateOperationsInput | number
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: StringFieldUpdateOperationsInput | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwnedLeaguesNestedInput
    gameweek?: GameweekUpdateOneRequiredWithoutLeaguesNestedInput
    transactions?: TransactionUpdateManyWithoutLeagueNestedInput
  }

  export type FantasyLeagueUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    stake?: NullableStringFieldUpdateOperationsInput | string | null
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    entryFeeUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFieldUpdateOperationsInput | number
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: StringFieldUpdateOperationsInput | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gameweekId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutLeagueNestedInput
  }

  export type FantasyLeagueCreateWithoutGameweekInput = {
    id?: string
    name: string
    description?: string | null
    stake?: string | null
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    code: string
    realLifeLeague?: $Enums.RealLifeLeague
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    entryFeeUsd?: Decimal | DecimalJsLike | number | string
    totalPoolUsd?: Decimal | DecimalJsLike | number | string
    currentParticipants?: number
    blockchainTxHash?: string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: string
    commissionRate?: Decimal | DecimalJsLike | number | string
    creatorCommission?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutOwnedLeaguesInput
    members?: FantasyLeagueMembershipCreateNestedManyWithoutLeagueInput
    transactions?: TransactionCreateNestedManyWithoutLeagueInput
  }

  export type FantasyLeagueUncheckedCreateWithoutGameweekInput = {
    id?: string
    name: string
    description?: string | null
    stake?: string | null
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    code: string
    ownerId?: string | null
    realLifeLeague?: $Enums.RealLifeLeague
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    entryFeeUsd?: Decimal | DecimalJsLike | number | string
    totalPoolUsd?: Decimal | DecimalJsLike | number | string
    currentParticipants?: number
    blockchainTxHash?: string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: string
    commissionRate?: Decimal | DecimalJsLike | number | string
    creatorCommission?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: FantasyLeagueMembershipUncheckedCreateNestedManyWithoutLeagueInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutLeagueInput
  }

  export type FantasyLeagueCreateOrConnectWithoutGameweekInput = {
    where: FantasyLeagueWhereUniqueInput
    create: XOR<FantasyLeagueCreateWithoutGameweekInput, FantasyLeagueUncheckedCreateWithoutGameweekInput>
  }

  export type FantasyLeagueCreateManyGameweekInputEnvelope = {
    data: FantasyLeagueCreateManyGameweekInput | FantasyLeagueCreateManyGameweekInput[]
    skipDuplicates?: boolean
  }

  export type FantasyLeagueUpsertWithWhereUniqueWithoutGameweekInput = {
    where: FantasyLeagueWhereUniqueInput
    update: XOR<FantasyLeagueUpdateWithoutGameweekInput, FantasyLeagueUncheckedUpdateWithoutGameweekInput>
    create: XOR<FantasyLeagueCreateWithoutGameweekInput, FantasyLeagueUncheckedCreateWithoutGameweekInput>
  }

  export type FantasyLeagueUpdateWithWhereUniqueWithoutGameweekInput = {
    where: FantasyLeagueWhereUniqueInput
    data: XOR<FantasyLeagueUpdateWithoutGameweekInput, FantasyLeagueUncheckedUpdateWithoutGameweekInput>
  }

  export type FantasyLeagueUpdateManyWithWhereWithoutGameweekInput = {
    where: FantasyLeagueScalarWhereInput
    data: XOR<FantasyLeagueUpdateManyMutationInput, FantasyLeagueUncheckedUpdateManyWithoutGameweekInput>
  }

  export type FantasyLeagueCreateWithoutTransactionsInput = {
    id?: string
    name: string
    description?: string | null
    stake?: string | null
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    code: string
    realLifeLeague?: $Enums.RealLifeLeague
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    entryFeeUsd?: Decimal | DecimalJsLike | number | string
    totalPoolUsd?: Decimal | DecimalJsLike | number | string
    currentParticipants?: number
    blockchainTxHash?: string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: string
    commissionRate?: Decimal | DecimalJsLike | number | string
    creatorCommission?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutOwnedLeaguesInput
    members?: FantasyLeagueMembershipCreateNestedManyWithoutLeagueInput
    gameweek: GameweekCreateNestedOneWithoutLeaguesInput
  }

  export type FantasyLeagueUncheckedCreateWithoutTransactionsInput = {
    id?: string
    name: string
    description?: string | null
    stake?: string | null
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    code: string
    ownerId?: string | null
    realLifeLeague?: $Enums.RealLifeLeague
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    entryFeeUsd?: Decimal | DecimalJsLike | number | string
    totalPoolUsd?: Decimal | DecimalJsLike | number | string
    currentParticipants?: number
    blockchainTxHash?: string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: string
    commissionRate?: Decimal | DecimalJsLike | number | string
    creatorCommission?: Decimal | DecimalJsLike | number | string
    gameweekId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: FantasyLeagueMembershipUncheckedCreateNestedManyWithoutLeagueInput
  }

  export type FantasyLeagueCreateOrConnectWithoutTransactionsInput = {
    where: FantasyLeagueWhereUniqueInput
    create: XOR<FantasyLeagueCreateWithoutTransactionsInput, FantasyLeagueUncheckedCreateWithoutTransactionsInput>
  }

  export type FantasyLeagueUpsertWithoutTransactionsInput = {
    update: XOR<FantasyLeagueUpdateWithoutTransactionsInput, FantasyLeagueUncheckedUpdateWithoutTransactionsInput>
    create: XOR<FantasyLeagueCreateWithoutTransactionsInput, FantasyLeagueUncheckedCreateWithoutTransactionsInput>
    where?: FantasyLeagueWhereInput
  }

  export type FantasyLeagueUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: FantasyLeagueWhereInput
    data: XOR<FantasyLeagueUpdateWithoutTransactionsInput, FantasyLeagueUncheckedUpdateWithoutTransactionsInput>
  }

  export type FantasyLeagueUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    stake?: NullableStringFieldUpdateOperationsInput | string | null
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    entryFeeUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFieldUpdateOperationsInput | number
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: StringFieldUpdateOperationsInput | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwnedLeaguesNestedInput
    members?: FantasyLeagueMembershipUpdateManyWithoutLeagueNestedInput
    gameweek?: GameweekUpdateOneRequiredWithoutLeaguesNestedInput
  }

  export type FantasyLeagueUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    stake?: NullableStringFieldUpdateOperationsInput | string | null
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    entryFeeUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFieldUpdateOperationsInput | number
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: StringFieldUpdateOperationsInput | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gameweekId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: FantasyLeagueMembershipUncheckedUpdateManyWithoutLeagueNestedInput
  }

  export type TeamCreateManyUserInput = {
    id?: string
    realLifeLeague?: $Enums.RealLifeLeague
    teamValue?: number
    teamPlayers?: TeamCreateteamPlayersInput | number[]
    captainId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueMembershipCreateManyUserInput = {
    id?: string
    leagueId: string
    teamName?: string | null
    stakeAmount?: Decimal | DecimalJsLike | number | string | null
    position?: number | null
    score?: Decimal | DecimalJsLike | number | string | null
    payoutAmount?: Decimal | DecimalJsLike | number | string | null
    payoutStatus?: string
    blockchainTxHash?: string | null
    status?: string
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueCreateManyOwnerInput = {
    id?: string
    name: string
    description?: string | null
    stake?: string | null
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    code: string
    realLifeLeague?: $Enums.RealLifeLeague
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    entryFeeUsd?: Decimal | DecimalJsLike | number | string
    totalPoolUsd?: Decimal | DecimalJsLike | number | string
    currentParticipants?: number
    blockchainTxHash?: string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: string
    commissionRate?: Decimal | DecimalJsLike | number | string
    creatorCommission?: Decimal | DecimalJsLike | number | string
    gameweekId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TeamUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    teamValue?: IntFieldUpdateOperationsInput | number
    teamPlayers?: TeamUpdateteamPlayersInput | number[]
    captainId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    teamValue?: IntFieldUpdateOperationsInput | number
    teamPlayers?: TeamUpdateteamPlayersInput | number[]
    captainId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    teamValue?: IntFieldUpdateOperationsInput | number
    teamPlayers?: TeamUpdateteamPlayersInput | number[]
    captainId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    stakeAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutStatus?: StringFieldUpdateOperationsInput | string
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    league?: FantasyLeagueUpdateOneRequiredWithoutMembersNestedInput
  }

  export type FantasyLeagueMembershipUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    stakeAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutStatus?: StringFieldUpdateOperationsInput | string
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    stakeAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutStatus?: StringFieldUpdateOperationsInput | string
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    stake?: NullableStringFieldUpdateOperationsInput | string | null
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    entryFeeUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFieldUpdateOperationsInput | number
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: StringFieldUpdateOperationsInput | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: FantasyLeagueMembershipUpdateManyWithoutLeagueNestedInput
    gameweek?: GameweekUpdateOneRequiredWithoutLeaguesNestedInput
    transactions?: TransactionUpdateManyWithoutLeagueNestedInput
  }

  export type FantasyLeagueUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    stake?: NullableStringFieldUpdateOperationsInput | string | null
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    entryFeeUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFieldUpdateOperationsInput | number
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: StringFieldUpdateOperationsInput | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gameweekId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: FantasyLeagueMembershipUncheckedUpdateManyWithoutLeagueNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutLeagueNestedInput
  }

  export type FantasyLeagueUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    stake?: NullableStringFieldUpdateOperationsInput | string | null
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    entryFeeUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFieldUpdateOperationsInput | number
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: StringFieldUpdateOperationsInput | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    gameweekId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipCreateManyLeagueInput = {
    id?: string
    userId: string
    teamName?: string | null
    stakeAmount?: Decimal | DecimalJsLike | number | string | null
    position?: number | null
    score?: Decimal | DecimalJsLike | number | string | null
    payoutAmount?: Decimal | DecimalJsLike | number | string | null
    payoutStatus?: string
    blockchainTxHash?: string | null
    status?: string
    joinedAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateManyLeagueInput = {
    id?: string
    txHash: string
    type: string
    userId?: string | null
    amount?: Decimal | DecimalJsLike | number | string | null
    status?: string
    blockNumber?: number | null
    gasUsed?: string | null
    errorMessage?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    confirmedAt?: Date | string | null
  }

  export type FantasyLeagueMembershipUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    stakeAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutStatus?: StringFieldUpdateOperationsInput | string
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLeaguesNestedInput
  }

  export type FantasyLeagueMembershipUncheckedUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    stakeAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutStatus?: StringFieldUpdateOperationsInput | string
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipUncheckedUpdateManyWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    stakeAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    position?: NullableIntFieldUpdateOperationsInput | number | null
    score?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutAmount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    payoutStatus?: StringFieldUpdateOperationsInput | string
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    gasUsed?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionUncheckedUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    gasUsed?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TransactionUncheckedUpdateManyWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    txHash?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: StringFieldUpdateOperationsInput | string
    blockNumber?: NullableIntFieldUpdateOperationsInput | number | null
    gasUsed?: NullableStringFieldUpdateOperationsInput | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FantasyLeagueCreateManyGameweekInput = {
    id?: string
    name: string
    description?: string | null
    stake?: string | null
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    code: string
    ownerId?: string | null
    realLifeLeague?: $Enums.RealLifeLeague
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    entryFeeUsd?: Decimal | DecimalJsLike | number | string
    totalPoolUsd?: Decimal | DecimalJsLike | number | string
    currentParticipants?: number
    blockchainTxHash?: string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: string
    commissionRate?: Decimal | DecimalJsLike | number | string
    creatorCommission?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueUpdateWithoutGameweekInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    stake?: NullableStringFieldUpdateOperationsInput | string | null
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    entryFeeUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFieldUpdateOperationsInput | number
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: StringFieldUpdateOperationsInput | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwnedLeaguesNestedInput
    members?: FantasyLeagueMembershipUpdateManyWithoutLeagueNestedInput
    transactions?: TransactionUpdateManyWithoutLeagueNestedInput
  }

  export type FantasyLeagueUncheckedUpdateWithoutGameweekInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    stake?: NullableStringFieldUpdateOperationsInput | string | null
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    entryFeeUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFieldUpdateOperationsInput | number
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: StringFieldUpdateOperationsInput | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: FantasyLeagueMembershipUncheckedUpdateManyWithoutLeagueNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutLeagueNestedInput
  }

  export type FantasyLeagueUncheckedUpdateManyWithoutGameweekInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    stake?: NullableStringFieldUpdateOperationsInput | string | null
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    realLifeLeague?: EnumRealLifeLeagueFieldUpdateOperationsInput | $Enums.RealLifeLeague
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    entryFeeUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    totalPoolUsd?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentParticipants?: IntFieldUpdateOperationsInput | number
    blockchainTxHash?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDistribution?: NullableJsonNullValueInput | InputJsonValue
    paymentMethod?: StringFieldUpdateOperationsInput | string
    commissionRate?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    creatorCommission?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}