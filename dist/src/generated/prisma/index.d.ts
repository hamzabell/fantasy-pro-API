
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
 * Model PowerUp
 * 
 */
export type PowerUp = $Result.DefaultSelection<Prisma.$PowerUpPayload>
/**
 * Model PowerUpCategory
 * 
 */
export type PowerUpCategory = $Result.DefaultSelection<Prisma.$PowerUpCategoryPayload>
/**
 * Model PowerUpUsage
 * 
 */
export type PowerUpUsage = $Result.DefaultSelection<Prisma.$PowerUpUsagePayload>
/**
 * Model FantasyLeagueMembershipPowerUp
 * 
 */
export type FantasyLeagueMembershipPowerUp = $Result.DefaultSelection<Prisma.$FantasyLeagueMembershipPowerUpPayload>

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
   * `prisma.powerUp`: Exposes CRUD operations for the **PowerUp** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PowerUps
    * const powerUps = await prisma.powerUp.findMany()
    * ```
    */
  get powerUp(): Prisma.PowerUpDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.powerUpCategory`: Exposes CRUD operations for the **PowerUpCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PowerUpCategories
    * const powerUpCategories = await prisma.powerUpCategory.findMany()
    * ```
    */
  get powerUpCategory(): Prisma.PowerUpCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.powerUpUsage`: Exposes CRUD operations for the **PowerUpUsage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PowerUpUsages
    * const powerUpUsages = await prisma.powerUpUsage.findMany()
    * ```
    */
  get powerUpUsage(): Prisma.PowerUpUsageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fantasyLeagueMembershipPowerUp`: Exposes CRUD operations for the **FantasyLeagueMembershipPowerUp** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FantasyLeagueMembershipPowerUps
    * const fantasyLeagueMembershipPowerUps = await prisma.fantasyLeagueMembershipPowerUp.findMany()
    * ```
    */
  get fantasyLeagueMembershipPowerUp(): Prisma.FantasyLeagueMembershipPowerUpDelegate<ExtArgs, ClientOptions>;
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
    Team: 'Team',
    FantasyLeague: 'FantasyLeague',
    FantasyLeagueMembership: 'FantasyLeagueMembership',
    Gameweek: 'Gameweek',
    PowerUp: 'PowerUp',
    PowerUpCategory: 'PowerUpCategory',
    PowerUpUsage: 'PowerUpUsage',
    FantasyLeagueMembershipPowerUp: 'FantasyLeagueMembershipPowerUp'
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
      modelProps: "user" | "team" | "fantasyLeague" | "fantasyLeagueMembership" | "gameweek" | "powerUp" | "powerUpCategory" | "powerUpUsage" | "fantasyLeagueMembershipPowerUp"
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
      PowerUp: {
        payload: Prisma.$PowerUpPayload<ExtArgs>
        fields: Prisma.PowerUpFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PowerUpFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PowerUpFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpPayload>
          }
          findFirst: {
            args: Prisma.PowerUpFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PowerUpFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpPayload>
          }
          findMany: {
            args: Prisma.PowerUpFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpPayload>[]
          }
          create: {
            args: Prisma.PowerUpCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpPayload>
          }
          createMany: {
            args: Prisma.PowerUpCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PowerUpCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpPayload>[]
          }
          delete: {
            args: Prisma.PowerUpDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpPayload>
          }
          update: {
            args: Prisma.PowerUpUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpPayload>
          }
          deleteMany: {
            args: Prisma.PowerUpDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PowerUpUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PowerUpUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpPayload>[]
          }
          upsert: {
            args: Prisma.PowerUpUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpPayload>
          }
          aggregate: {
            args: Prisma.PowerUpAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePowerUp>
          }
          groupBy: {
            args: Prisma.PowerUpGroupByArgs<ExtArgs>
            result: $Utils.Optional<PowerUpGroupByOutputType>[]
          }
          count: {
            args: Prisma.PowerUpCountArgs<ExtArgs>
            result: $Utils.Optional<PowerUpCountAggregateOutputType> | number
          }
        }
      }
      PowerUpCategory: {
        payload: Prisma.$PowerUpCategoryPayload<ExtArgs>
        fields: Prisma.PowerUpCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PowerUpCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PowerUpCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpCategoryPayload>
          }
          findFirst: {
            args: Prisma.PowerUpCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PowerUpCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpCategoryPayload>
          }
          findMany: {
            args: Prisma.PowerUpCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpCategoryPayload>[]
          }
          create: {
            args: Prisma.PowerUpCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpCategoryPayload>
          }
          createMany: {
            args: Prisma.PowerUpCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PowerUpCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpCategoryPayload>[]
          }
          delete: {
            args: Prisma.PowerUpCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpCategoryPayload>
          }
          update: {
            args: Prisma.PowerUpCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpCategoryPayload>
          }
          deleteMany: {
            args: Prisma.PowerUpCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PowerUpCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PowerUpCategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpCategoryPayload>[]
          }
          upsert: {
            args: Prisma.PowerUpCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpCategoryPayload>
          }
          aggregate: {
            args: Prisma.PowerUpCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePowerUpCategory>
          }
          groupBy: {
            args: Prisma.PowerUpCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<PowerUpCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.PowerUpCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<PowerUpCategoryCountAggregateOutputType> | number
          }
        }
      }
      PowerUpUsage: {
        payload: Prisma.$PowerUpUsagePayload<ExtArgs>
        fields: Prisma.PowerUpUsageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PowerUpUsageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpUsagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PowerUpUsageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpUsagePayload>
          }
          findFirst: {
            args: Prisma.PowerUpUsageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpUsagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PowerUpUsageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpUsagePayload>
          }
          findMany: {
            args: Prisma.PowerUpUsageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpUsagePayload>[]
          }
          create: {
            args: Prisma.PowerUpUsageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpUsagePayload>
          }
          createMany: {
            args: Prisma.PowerUpUsageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PowerUpUsageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpUsagePayload>[]
          }
          delete: {
            args: Prisma.PowerUpUsageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpUsagePayload>
          }
          update: {
            args: Prisma.PowerUpUsageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpUsagePayload>
          }
          deleteMany: {
            args: Prisma.PowerUpUsageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PowerUpUsageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PowerUpUsageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpUsagePayload>[]
          }
          upsert: {
            args: Prisma.PowerUpUsageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PowerUpUsagePayload>
          }
          aggregate: {
            args: Prisma.PowerUpUsageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePowerUpUsage>
          }
          groupBy: {
            args: Prisma.PowerUpUsageGroupByArgs<ExtArgs>
            result: $Utils.Optional<PowerUpUsageGroupByOutputType>[]
          }
          count: {
            args: Prisma.PowerUpUsageCountArgs<ExtArgs>
            result: $Utils.Optional<PowerUpUsageCountAggregateOutputType> | number
          }
        }
      }
      FantasyLeagueMembershipPowerUp: {
        payload: Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs>
        fields: Prisma.FantasyLeagueMembershipPowerUpFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FantasyLeagueMembershipPowerUpFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPowerUpPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FantasyLeagueMembershipPowerUpFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPowerUpPayload>
          }
          findFirst: {
            args: Prisma.FantasyLeagueMembershipPowerUpFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPowerUpPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FantasyLeagueMembershipPowerUpFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPowerUpPayload>
          }
          findMany: {
            args: Prisma.FantasyLeagueMembershipPowerUpFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPowerUpPayload>[]
          }
          create: {
            args: Prisma.FantasyLeagueMembershipPowerUpCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPowerUpPayload>
          }
          createMany: {
            args: Prisma.FantasyLeagueMembershipPowerUpCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FantasyLeagueMembershipPowerUpCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPowerUpPayload>[]
          }
          delete: {
            args: Prisma.FantasyLeagueMembershipPowerUpDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPowerUpPayload>
          }
          update: {
            args: Prisma.FantasyLeagueMembershipPowerUpUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPowerUpPayload>
          }
          deleteMany: {
            args: Prisma.FantasyLeagueMembershipPowerUpDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FantasyLeagueMembershipPowerUpUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FantasyLeagueMembershipPowerUpUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPowerUpPayload>[]
          }
          upsert: {
            args: Prisma.FantasyLeagueMembershipPowerUpUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FantasyLeagueMembershipPowerUpPayload>
          }
          aggregate: {
            args: Prisma.FantasyLeagueMembershipPowerUpAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFantasyLeagueMembershipPowerUp>
          }
          groupBy: {
            args: Prisma.FantasyLeagueMembershipPowerUpGroupByArgs<ExtArgs>
            result: $Utils.Optional<FantasyLeagueMembershipPowerUpGroupByOutputType>[]
          }
          count: {
            args: Prisma.FantasyLeagueMembershipPowerUpCountArgs<ExtArgs>
            result: $Utils.Optional<FantasyLeagueMembershipPowerUpCountAggregateOutputType> | number
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
    team?: TeamOmit
    fantasyLeague?: FantasyLeagueOmit
    fantasyLeagueMembership?: FantasyLeagueMembershipOmit
    gameweek?: GameweekOmit
    powerUp?: PowerUpOmit
    powerUpCategory?: PowerUpCategoryOmit
    powerUpUsage?: PowerUpUsageOmit
    fantasyLeagueMembershipPowerUp?: FantasyLeagueMembershipPowerUpOmit
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
    leagues: number
    ownedLeagues: number
    powerUpUsages: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    leagues?: boolean | UserCountOutputTypeCountLeaguesArgs
    ownedLeagues?: boolean | UserCountOutputTypeCountOwnedLeaguesArgs
    powerUpUsages?: boolean | UserCountOutputTypeCountPowerUpUsagesArgs
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
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPowerUpUsagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PowerUpUsageWhereInput
  }


  /**
   * Count Type FantasyLeagueCountOutputType
   */

  export type FantasyLeagueCountOutputType = {
    members: number
  }

  export type FantasyLeagueCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | FantasyLeagueCountOutputTypeCountMembersArgs
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
   * Count Type FantasyLeagueMembershipCountOutputType
   */

  export type FantasyLeagueMembershipCountOutputType = {
    powerUps: number
  }

  export type FantasyLeagueMembershipCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    powerUps?: boolean | FantasyLeagueMembershipCountOutputTypeCountPowerUpsArgs
  }

  // Custom InputTypes
  /**
   * FantasyLeagueMembershipCountOutputType without action
   */
  export type FantasyLeagueMembershipCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembershipCountOutputType
     */
    select?: FantasyLeagueMembershipCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FantasyLeagueMembershipCountOutputType without action
   */
  export type FantasyLeagueMembershipCountOutputTypeCountPowerUpsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FantasyLeagueMembershipPowerUpWhereInput
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
   * Count Type PowerUpCountOutputType
   */

  export type PowerUpCountOutputType = {
    powerUpUsages: number
  }

  export type PowerUpCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    powerUpUsages?: boolean | PowerUpCountOutputTypeCountPowerUpUsagesArgs
  }

  // Custom InputTypes
  /**
   * PowerUpCountOutputType without action
   */
  export type PowerUpCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpCountOutputType
     */
    select?: PowerUpCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PowerUpCountOutputType without action
   */
  export type PowerUpCountOutputTypeCountPowerUpUsagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PowerUpUsageWhereInput
  }


  /**
   * Count Type PowerUpCategoryCountOutputType
   */

  export type PowerUpCategoryCountOutputType = {
    powerUps: number
  }

  export type PowerUpCategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    powerUps?: boolean | PowerUpCategoryCountOutputTypeCountPowerUpsArgs
  }

  // Custom InputTypes
  /**
   * PowerUpCategoryCountOutputType without action
   */
  export type PowerUpCategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpCategoryCountOutputType
     */
    select?: PowerUpCategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PowerUpCategoryCountOutputType without action
   */
  export type PowerUpCategoryCountOutputTypeCountPowerUpsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PowerUpWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
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
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
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
    createdAt?: boolean
    updatedAt?: boolean
    team?: boolean | User$teamArgs<ExtArgs>
    leagues?: boolean | User$leaguesArgs<ExtArgs>
    ownedLeagues?: boolean | User$ownedLeaguesArgs<ExtArgs>
    powerUpUsages?: boolean | User$powerUpUsagesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    team?: boolean | User$teamArgs<ExtArgs>
    leagues?: boolean | User$leaguesArgs<ExtArgs>
    ownedLeagues?: boolean | User$ownedLeaguesArgs<ExtArgs>
    powerUpUsages?: boolean | User$powerUpUsagesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      team: Prisma.$TeamPayload<ExtArgs> | null
      leagues: Prisma.$FantasyLeagueMembershipPayload<ExtArgs>[]
      ownedLeagues: Prisma.$FantasyLeaguePayload<ExtArgs>[]
      powerUpUsages: Prisma.$PowerUpUsagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
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
    team<T extends User$teamArgs<ExtArgs> = {}>(args?: Subset<T, User$teamArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    leagues<T extends User$leaguesArgs<ExtArgs> = {}>(args?: Subset<T, User$leaguesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ownedLeagues<T extends User$ownedLeaguesArgs<ExtArgs> = {}>(args?: Subset<T, User$ownedLeaguesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeaguePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    powerUpUsages<T extends User$powerUpUsagesArgs<ExtArgs> = {}>(args?: Subset<T, User$powerUpUsagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerUpUsagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * User.team
   */
  export type User$teamArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * User.powerUpUsages
   */
  export type User$powerUpUsagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpUsage
     */
    select?: PowerUpUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpUsage
     */
    omit?: PowerUpUsageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpUsageInclude<ExtArgs> | null
    where?: PowerUpUsageWhereInput
    orderBy?: PowerUpUsageOrderByWithRelationInput | PowerUpUsageOrderByWithRelationInput[]
    cursor?: PowerUpUsageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PowerUpUsageScalarFieldEnum | PowerUpUsageScalarFieldEnum[]
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
    teamValue: number | null
    captainId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TeamMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    teamValue: number | null
    captainId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TeamCountAggregateOutputType = {
    id: number
    userId: number
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
    teamValue?: true
    captainId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TeamMaxAggregateInputType = {
    id?: true
    userId?: true
    teamValue?: true
    captainId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TeamCountAggregateInputType = {
    id?: true
    userId?: true
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
    teamValue?: boolean
    teamPlayers?: boolean
    captainId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TeamOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "teamValue" | "teamPlayers" | "captainId" | "createdAt" | "updatedAt", ExtArgs["result"]["team"]>
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
    gameweekId: number | null
  }

  export type FantasyLeagueSumAggregateOutputType = {
    limit: number | null
    winners: number | null
    gameweekId: number | null
  }

  export type FantasyLeagueMinAggregateOutputType = {
    id: string | null
    name: string | null
    stake: string | null
    limit: number | null
    leagueType: string | null
    leagueMode: string | null
    winners: number | null
    allowPowerUps: boolean | null
    description: string | null
    code: string | null
    ownerId: string | null
    status: string | null
    gameweekId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FantasyLeagueMaxAggregateOutputType = {
    id: string | null
    name: string | null
    stake: string | null
    limit: number | null
    leagueType: string | null
    leagueMode: string | null
    winners: number | null
    allowPowerUps: boolean | null
    description: string | null
    code: string | null
    ownerId: string | null
    status: string | null
    gameweekId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FantasyLeagueCountAggregateOutputType = {
    id: number
    name: number
    stake: number
    limit: number
    leagueType: number
    leagueMode: number
    winners: number
    allowPowerUps: number
    description: number
    code: number
    ownerId: number
    status: number
    winnersArray: number
    gameweekId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FantasyLeagueAvgAggregateInputType = {
    limit?: true
    winners?: true
    gameweekId?: true
  }

  export type FantasyLeagueSumAggregateInputType = {
    limit?: true
    winners?: true
    gameweekId?: true
  }

  export type FantasyLeagueMinAggregateInputType = {
    id?: true
    name?: true
    stake?: true
    limit?: true
    leagueType?: true
    leagueMode?: true
    winners?: true
    allowPowerUps?: true
    description?: true
    code?: true
    ownerId?: true
    status?: true
    gameweekId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FantasyLeagueMaxAggregateInputType = {
    id?: true
    name?: true
    stake?: true
    limit?: true
    leagueType?: true
    leagueMode?: true
    winners?: true
    allowPowerUps?: true
    description?: true
    code?: true
    ownerId?: true
    status?: true
    gameweekId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FantasyLeagueCountAggregateInputType = {
    id?: true
    name?: true
    stake?: true
    limit?: true
    leagueType?: true
    leagueMode?: true
    winners?: true
    allowPowerUps?: true
    description?: true
    code?: true
    ownerId?: true
    status?: true
    winnersArray?: true
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
    stake: string
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    allowPowerUps: boolean
    description: string | null
    code: string
    ownerId: string
    status: string
    winnersArray: string[]
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
    stake?: boolean
    limit?: boolean
    leagueType?: boolean
    leagueMode?: boolean
    winners?: boolean
    allowPowerUps?: boolean
    description?: boolean
    code?: boolean
    ownerId?: boolean
    status?: boolean
    winnersArray?: boolean
    gameweekId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    members?: boolean | FantasyLeague$membersArgs<ExtArgs>
    gameweek?: boolean | GameweekDefaultArgs<ExtArgs>
    _count?: boolean | FantasyLeagueCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fantasyLeague"]>

  export type FantasyLeagueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    stake?: boolean
    limit?: boolean
    leagueType?: boolean
    leagueMode?: boolean
    winners?: boolean
    allowPowerUps?: boolean
    description?: boolean
    code?: boolean
    ownerId?: boolean
    status?: boolean
    winnersArray?: boolean
    gameweekId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    gameweek?: boolean | GameweekDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fantasyLeague"]>

  export type FantasyLeagueSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    stake?: boolean
    limit?: boolean
    leagueType?: boolean
    leagueMode?: boolean
    winners?: boolean
    allowPowerUps?: boolean
    description?: boolean
    code?: boolean
    ownerId?: boolean
    status?: boolean
    winnersArray?: boolean
    gameweekId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    gameweek?: boolean | GameweekDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fantasyLeague"]>

  export type FantasyLeagueSelectScalar = {
    id?: boolean
    name?: boolean
    stake?: boolean
    limit?: boolean
    leagueType?: boolean
    leagueMode?: boolean
    winners?: boolean
    allowPowerUps?: boolean
    description?: boolean
    code?: boolean
    ownerId?: boolean
    status?: boolean
    winnersArray?: boolean
    gameweekId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FantasyLeagueOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "stake" | "limit" | "leagueType" | "leagueMode" | "winners" | "allowPowerUps" | "description" | "code" | "ownerId" | "status" | "winnersArray" | "gameweekId" | "createdAt" | "updatedAt", ExtArgs["result"]["fantasyLeague"]>
  export type FantasyLeagueInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    members?: boolean | FantasyLeague$membersArgs<ExtArgs>
    gameweek?: boolean | GameweekDefaultArgs<ExtArgs>
    _count?: boolean | FantasyLeagueCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FantasyLeagueIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    gameweek?: boolean | GameweekDefaultArgs<ExtArgs>
  }
  export type FantasyLeagueIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    gameweek?: boolean | GameweekDefaultArgs<ExtArgs>
  }

  export type $FantasyLeaguePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FantasyLeague"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>
      members: Prisma.$FantasyLeagueMembershipPayload<ExtArgs>[]
      gameweek: Prisma.$GameweekPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      stake: string
      limit: number
      leagueType: string
      leagueMode: string
      winners: number
      allowPowerUps: boolean
      description: string | null
      code: string
      ownerId: string
      status: string
      winnersArray: string[]
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
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    members<T extends FantasyLeague$membersArgs<ExtArgs> = {}>(args?: Subset<T, FantasyLeague$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    gameweek<T extends GameweekDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameweekDefaultArgs<ExtArgs>>): Prisma__GameweekClient<$Result.GetResult<Prisma.$GameweekPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
    readonly stake: FieldRef<"FantasyLeague", 'String'>
    readonly limit: FieldRef<"FantasyLeague", 'Int'>
    readonly leagueType: FieldRef<"FantasyLeague", 'String'>
    readonly leagueMode: FieldRef<"FantasyLeague", 'String'>
    readonly winners: FieldRef<"FantasyLeague", 'Int'>
    readonly allowPowerUps: FieldRef<"FantasyLeague", 'Boolean'>
    readonly description: FieldRef<"FantasyLeague", 'String'>
    readonly code: FieldRef<"FantasyLeague", 'String'>
    readonly ownerId: FieldRef<"FantasyLeague", 'String'>
    readonly status: FieldRef<"FantasyLeague", 'String'>
    readonly winnersArray: FieldRef<"FantasyLeague", 'String[]'>
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
    _min: FantasyLeagueMembershipMinAggregateOutputType | null
    _max: FantasyLeagueMembershipMaxAggregateOutputType | null
  }

  export type FantasyLeagueMembershipMinAggregateOutputType = {
    id: string | null
    userId: string | null
    leagueId: string | null
    teamName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FantasyLeagueMembershipMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    leagueId: string | null
    teamName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FantasyLeagueMembershipCountAggregateOutputType = {
    id: number
    userId: number
    leagueId: number
    teamName: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FantasyLeagueMembershipMinAggregateInputType = {
    id?: true
    userId?: true
    leagueId?: true
    teamName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FantasyLeagueMembershipMaxAggregateInputType = {
    id?: true
    userId?: true
    leagueId?: true
    teamName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FantasyLeagueMembershipCountAggregateInputType = {
    id?: true
    userId?: true
    leagueId?: true
    teamName?: true
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
    _min?: FantasyLeagueMembershipMinAggregateInputType
    _max?: FantasyLeagueMembershipMaxAggregateInputType
  }

  export type FantasyLeagueMembershipGroupByOutputType = {
    id: string
    userId: string
    leagueId: string
    teamName: string | null
    createdAt: Date
    updatedAt: Date
    _count: FantasyLeagueMembershipCountAggregateOutputType | null
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
    createdAt?: boolean
    updatedAt?: boolean
    powerUps?: boolean | FantasyLeagueMembership$powerUpsArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    league?: boolean | FantasyLeagueDefaultArgs<ExtArgs>
    _count?: boolean | FantasyLeagueMembershipCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fantasyLeagueMembership"]>

  export type FantasyLeagueMembershipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    leagueId?: boolean
    teamName?: boolean
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
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FantasyLeagueMembershipOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "leagueId" | "teamName" | "createdAt" | "updatedAt", ExtArgs["result"]["fantasyLeagueMembership"]>
  export type FantasyLeagueMembershipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    powerUps?: boolean | FantasyLeagueMembership$powerUpsArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    league?: boolean | FantasyLeagueDefaultArgs<ExtArgs>
    _count?: boolean | FantasyLeagueMembershipCountOutputTypeDefaultArgs<ExtArgs>
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
      powerUps: Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs>
      league: Prisma.$FantasyLeaguePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      leagueId: string
      teamName: string | null
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
    powerUps<T extends FantasyLeagueMembership$powerUpsArgs<ExtArgs> = {}>(args?: Subset<T, FantasyLeagueMembership$powerUpsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * FantasyLeagueMembership.powerUps
   */
  export type FantasyLeagueMembership$powerUpsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembershipPowerUp
     */
    select?: FantasyLeagueMembershipPowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembershipPowerUp
     */
    omit?: FantasyLeagueMembershipPowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipPowerUpInclude<ExtArgs> | null
    where?: FantasyLeagueMembershipPowerUpWhereInput
    orderBy?: FantasyLeagueMembershipPowerUpOrderByWithRelationInput | FantasyLeagueMembershipPowerUpOrderByWithRelationInput[]
    cursor?: FantasyLeagueMembershipPowerUpWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FantasyLeagueMembershipPowerUpScalarFieldEnum | FantasyLeagueMembershipPowerUpScalarFieldEnum[]
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
  }

  export type GameweekMaxAggregateOutputType = {
    id: number | null
    deadline: Date | null
    isActive: boolean | null
  }

  export type GameweekCountAggregateOutputType = {
    id: number
    deadline: number
    isActive: number
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
  }

  export type GameweekMaxAggregateInputType = {
    id?: true
    deadline?: true
    isActive?: true
  }

  export type GameweekCountAggregateInputType = {
    id?: true
    deadline?: true
    isActive?: true
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
    leagues?: boolean | Gameweek$leaguesArgs<ExtArgs>
    _count?: boolean | GameweekCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameweek"]>

  export type GameweekSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deadline?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["gameweek"]>

  export type GameweekSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deadline?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["gameweek"]>

  export type GameweekSelectScalar = {
    id?: boolean
    deadline?: boolean
    isActive?: boolean
  }

  export type GameweekOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "deadline" | "isActive", ExtArgs["result"]["gameweek"]>
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
   * Model PowerUp
   */

  export type AggregatePowerUp = {
    _count: PowerUpCountAggregateOutputType | null
    _min: PowerUpMinAggregateOutputType | null
    _max: PowerUpMaxAggregateOutputType | null
  }

  export type PowerUpMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    categoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PowerUpMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    categoryId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PowerUpCountAggregateOutputType = {
    id: number
    name: number
    description: number
    categoryId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PowerUpMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PowerUpMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PowerUpCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    categoryId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PowerUpAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PowerUp to aggregate.
     */
    where?: PowerUpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerUps to fetch.
     */
    orderBy?: PowerUpOrderByWithRelationInput | PowerUpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PowerUpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerUps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerUps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PowerUps
    **/
    _count?: true | PowerUpCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PowerUpMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PowerUpMaxAggregateInputType
  }

  export type GetPowerUpAggregateType<T extends PowerUpAggregateArgs> = {
        [P in keyof T & keyof AggregatePowerUp]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePowerUp[P]>
      : GetScalarType<T[P], AggregatePowerUp[P]>
  }




  export type PowerUpGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PowerUpWhereInput
    orderBy?: PowerUpOrderByWithAggregationInput | PowerUpOrderByWithAggregationInput[]
    by: PowerUpScalarFieldEnum[] | PowerUpScalarFieldEnum
    having?: PowerUpScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PowerUpCountAggregateInputType | true
    _min?: PowerUpMinAggregateInputType
    _max?: PowerUpMaxAggregateInputType
  }

  export type PowerUpGroupByOutputType = {
    id: string
    name: string
    description: string
    categoryId: string | null
    createdAt: Date
    updatedAt: Date
    _count: PowerUpCountAggregateOutputType | null
    _min: PowerUpMinAggregateOutputType | null
    _max: PowerUpMaxAggregateOutputType | null
  }

  type GetPowerUpGroupByPayload<T extends PowerUpGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PowerUpGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PowerUpGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PowerUpGroupByOutputType[P]>
            : GetScalarType<T[P], PowerUpGroupByOutputType[P]>
        }
      >
    >


  export type PowerUpSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | PowerUp$categoryArgs<ExtArgs>
    powerUpUsages?: boolean | PowerUp$powerUpUsagesArgs<ExtArgs>
    _count?: boolean | PowerUpCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["powerUp"]>

  export type PowerUpSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | PowerUp$categoryArgs<ExtArgs>
  }, ExtArgs["result"]["powerUp"]>

  export type PowerUpSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    category?: boolean | PowerUp$categoryArgs<ExtArgs>
  }, ExtArgs["result"]["powerUp"]>

  export type PowerUpSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    categoryId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PowerUpOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "categoryId" | "createdAt" | "updatedAt", ExtArgs["result"]["powerUp"]>
  export type PowerUpInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | PowerUp$categoryArgs<ExtArgs>
    powerUpUsages?: boolean | PowerUp$powerUpUsagesArgs<ExtArgs>
    _count?: boolean | PowerUpCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PowerUpIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | PowerUp$categoryArgs<ExtArgs>
  }
  export type PowerUpIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | PowerUp$categoryArgs<ExtArgs>
  }

  export type $PowerUpPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PowerUp"
    objects: {
      category: Prisma.$PowerUpCategoryPayload<ExtArgs> | null
      powerUpUsages: Prisma.$PowerUpUsagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      categoryId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["powerUp"]>
    composites: {}
  }

  type PowerUpGetPayload<S extends boolean | null | undefined | PowerUpDefaultArgs> = $Result.GetResult<Prisma.$PowerUpPayload, S>

  type PowerUpCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PowerUpFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PowerUpCountAggregateInputType | true
    }

  export interface PowerUpDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PowerUp'], meta: { name: 'PowerUp' } }
    /**
     * Find zero or one PowerUp that matches the filter.
     * @param {PowerUpFindUniqueArgs} args - Arguments to find a PowerUp
     * @example
     * // Get one PowerUp
     * const powerUp = await prisma.powerUp.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PowerUpFindUniqueArgs>(args: SelectSubset<T, PowerUpFindUniqueArgs<ExtArgs>>): Prisma__PowerUpClient<$Result.GetResult<Prisma.$PowerUpPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PowerUp that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PowerUpFindUniqueOrThrowArgs} args - Arguments to find a PowerUp
     * @example
     * // Get one PowerUp
     * const powerUp = await prisma.powerUp.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PowerUpFindUniqueOrThrowArgs>(args: SelectSubset<T, PowerUpFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PowerUpClient<$Result.GetResult<Prisma.$PowerUpPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PowerUp that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpFindFirstArgs} args - Arguments to find a PowerUp
     * @example
     * // Get one PowerUp
     * const powerUp = await prisma.powerUp.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PowerUpFindFirstArgs>(args?: SelectSubset<T, PowerUpFindFirstArgs<ExtArgs>>): Prisma__PowerUpClient<$Result.GetResult<Prisma.$PowerUpPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PowerUp that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpFindFirstOrThrowArgs} args - Arguments to find a PowerUp
     * @example
     * // Get one PowerUp
     * const powerUp = await prisma.powerUp.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PowerUpFindFirstOrThrowArgs>(args?: SelectSubset<T, PowerUpFindFirstOrThrowArgs<ExtArgs>>): Prisma__PowerUpClient<$Result.GetResult<Prisma.$PowerUpPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PowerUps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PowerUps
     * const powerUps = await prisma.powerUp.findMany()
     * 
     * // Get first 10 PowerUps
     * const powerUps = await prisma.powerUp.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const powerUpWithIdOnly = await prisma.powerUp.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PowerUpFindManyArgs>(args?: SelectSubset<T, PowerUpFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerUpPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PowerUp.
     * @param {PowerUpCreateArgs} args - Arguments to create a PowerUp.
     * @example
     * // Create one PowerUp
     * const PowerUp = await prisma.powerUp.create({
     *   data: {
     *     // ... data to create a PowerUp
     *   }
     * })
     * 
     */
    create<T extends PowerUpCreateArgs>(args: SelectSubset<T, PowerUpCreateArgs<ExtArgs>>): Prisma__PowerUpClient<$Result.GetResult<Prisma.$PowerUpPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PowerUps.
     * @param {PowerUpCreateManyArgs} args - Arguments to create many PowerUps.
     * @example
     * // Create many PowerUps
     * const powerUp = await prisma.powerUp.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PowerUpCreateManyArgs>(args?: SelectSubset<T, PowerUpCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PowerUps and returns the data saved in the database.
     * @param {PowerUpCreateManyAndReturnArgs} args - Arguments to create many PowerUps.
     * @example
     * // Create many PowerUps
     * const powerUp = await prisma.powerUp.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PowerUps and only return the `id`
     * const powerUpWithIdOnly = await prisma.powerUp.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PowerUpCreateManyAndReturnArgs>(args?: SelectSubset<T, PowerUpCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerUpPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PowerUp.
     * @param {PowerUpDeleteArgs} args - Arguments to delete one PowerUp.
     * @example
     * // Delete one PowerUp
     * const PowerUp = await prisma.powerUp.delete({
     *   where: {
     *     // ... filter to delete one PowerUp
     *   }
     * })
     * 
     */
    delete<T extends PowerUpDeleteArgs>(args: SelectSubset<T, PowerUpDeleteArgs<ExtArgs>>): Prisma__PowerUpClient<$Result.GetResult<Prisma.$PowerUpPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PowerUp.
     * @param {PowerUpUpdateArgs} args - Arguments to update one PowerUp.
     * @example
     * // Update one PowerUp
     * const powerUp = await prisma.powerUp.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PowerUpUpdateArgs>(args: SelectSubset<T, PowerUpUpdateArgs<ExtArgs>>): Prisma__PowerUpClient<$Result.GetResult<Prisma.$PowerUpPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PowerUps.
     * @param {PowerUpDeleteManyArgs} args - Arguments to filter PowerUps to delete.
     * @example
     * // Delete a few PowerUps
     * const { count } = await prisma.powerUp.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PowerUpDeleteManyArgs>(args?: SelectSubset<T, PowerUpDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PowerUps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PowerUps
     * const powerUp = await prisma.powerUp.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PowerUpUpdateManyArgs>(args: SelectSubset<T, PowerUpUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PowerUps and returns the data updated in the database.
     * @param {PowerUpUpdateManyAndReturnArgs} args - Arguments to update many PowerUps.
     * @example
     * // Update many PowerUps
     * const powerUp = await prisma.powerUp.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PowerUps and only return the `id`
     * const powerUpWithIdOnly = await prisma.powerUp.updateManyAndReturn({
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
    updateManyAndReturn<T extends PowerUpUpdateManyAndReturnArgs>(args: SelectSubset<T, PowerUpUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerUpPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PowerUp.
     * @param {PowerUpUpsertArgs} args - Arguments to update or create a PowerUp.
     * @example
     * // Update or create a PowerUp
     * const powerUp = await prisma.powerUp.upsert({
     *   create: {
     *     // ... data to create a PowerUp
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PowerUp we want to update
     *   }
     * })
     */
    upsert<T extends PowerUpUpsertArgs>(args: SelectSubset<T, PowerUpUpsertArgs<ExtArgs>>): Prisma__PowerUpClient<$Result.GetResult<Prisma.$PowerUpPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PowerUps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpCountArgs} args - Arguments to filter PowerUps to count.
     * @example
     * // Count the number of PowerUps
     * const count = await prisma.powerUp.count({
     *   where: {
     *     // ... the filter for the PowerUps we want to count
     *   }
     * })
    **/
    count<T extends PowerUpCountArgs>(
      args?: Subset<T, PowerUpCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PowerUpCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PowerUp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PowerUpAggregateArgs>(args: Subset<T, PowerUpAggregateArgs>): Prisma.PrismaPromise<GetPowerUpAggregateType<T>>

    /**
     * Group by PowerUp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpGroupByArgs} args - Group by arguments.
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
      T extends PowerUpGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PowerUpGroupByArgs['orderBy'] }
        : { orderBy?: PowerUpGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PowerUpGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPowerUpGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PowerUp model
   */
  readonly fields: PowerUpFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PowerUp.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PowerUpClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends PowerUp$categoryArgs<ExtArgs> = {}>(args?: Subset<T, PowerUp$categoryArgs<ExtArgs>>): Prisma__PowerUpCategoryClient<$Result.GetResult<Prisma.$PowerUpCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    powerUpUsages<T extends PowerUp$powerUpUsagesArgs<ExtArgs> = {}>(args?: Subset<T, PowerUp$powerUpUsagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerUpUsagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the PowerUp model
   */
  interface PowerUpFieldRefs {
    readonly id: FieldRef<"PowerUp", 'String'>
    readonly name: FieldRef<"PowerUp", 'String'>
    readonly description: FieldRef<"PowerUp", 'String'>
    readonly categoryId: FieldRef<"PowerUp", 'String'>
    readonly createdAt: FieldRef<"PowerUp", 'DateTime'>
    readonly updatedAt: FieldRef<"PowerUp", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PowerUp findUnique
   */
  export type PowerUpFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUp
     */
    select?: PowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUp
     */
    omit?: PowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpInclude<ExtArgs> | null
    /**
     * Filter, which PowerUp to fetch.
     */
    where: PowerUpWhereUniqueInput
  }

  /**
   * PowerUp findUniqueOrThrow
   */
  export type PowerUpFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUp
     */
    select?: PowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUp
     */
    omit?: PowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpInclude<ExtArgs> | null
    /**
     * Filter, which PowerUp to fetch.
     */
    where: PowerUpWhereUniqueInput
  }

  /**
   * PowerUp findFirst
   */
  export type PowerUpFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUp
     */
    select?: PowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUp
     */
    omit?: PowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpInclude<ExtArgs> | null
    /**
     * Filter, which PowerUp to fetch.
     */
    where?: PowerUpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerUps to fetch.
     */
    orderBy?: PowerUpOrderByWithRelationInput | PowerUpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PowerUps.
     */
    cursor?: PowerUpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerUps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerUps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PowerUps.
     */
    distinct?: PowerUpScalarFieldEnum | PowerUpScalarFieldEnum[]
  }

  /**
   * PowerUp findFirstOrThrow
   */
  export type PowerUpFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUp
     */
    select?: PowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUp
     */
    omit?: PowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpInclude<ExtArgs> | null
    /**
     * Filter, which PowerUp to fetch.
     */
    where?: PowerUpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerUps to fetch.
     */
    orderBy?: PowerUpOrderByWithRelationInput | PowerUpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PowerUps.
     */
    cursor?: PowerUpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerUps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerUps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PowerUps.
     */
    distinct?: PowerUpScalarFieldEnum | PowerUpScalarFieldEnum[]
  }

  /**
   * PowerUp findMany
   */
  export type PowerUpFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUp
     */
    select?: PowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUp
     */
    omit?: PowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpInclude<ExtArgs> | null
    /**
     * Filter, which PowerUps to fetch.
     */
    where?: PowerUpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerUps to fetch.
     */
    orderBy?: PowerUpOrderByWithRelationInput | PowerUpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PowerUps.
     */
    cursor?: PowerUpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerUps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerUps.
     */
    skip?: number
    distinct?: PowerUpScalarFieldEnum | PowerUpScalarFieldEnum[]
  }

  /**
   * PowerUp create
   */
  export type PowerUpCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUp
     */
    select?: PowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUp
     */
    omit?: PowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpInclude<ExtArgs> | null
    /**
     * The data needed to create a PowerUp.
     */
    data: XOR<PowerUpCreateInput, PowerUpUncheckedCreateInput>
  }

  /**
   * PowerUp createMany
   */
  export type PowerUpCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PowerUps.
     */
    data: PowerUpCreateManyInput | PowerUpCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PowerUp createManyAndReturn
   */
  export type PowerUpCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUp
     */
    select?: PowerUpSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUp
     */
    omit?: PowerUpOmit<ExtArgs> | null
    /**
     * The data used to create many PowerUps.
     */
    data: PowerUpCreateManyInput | PowerUpCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PowerUp update
   */
  export type PowerUpUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUp
     */
    select?: PowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUp
     */
    omit?: PowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpInclude<ExtArgs> | null
    /**
     * The data needed to update a PowerUp.
     */
    data: XOR<PowerUpUpdateInput, PowerUpUncheckedUpdateInput>
    /**
     * Choose, which PowerUp to update.
     */
    where: PowerUpWhereUniqueInput
  }

  /**
   * PowerUp updateMany
   */
  export type PowerUpUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PowerUps.
     */
    data: XOR<PowerUpUpdateManyMutationInput, PowerUpUncheckedUpdateManyInput>
    /**
     * Filter which PowerUps to update
     */
    where?: PowerUpWhereInput
    /**
     * Limit how many PowerUps to update.
     */
    limit?: number
  }

  /**
   * PowerUp updateManyAndReturn
   */
  export type PowerUpUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUp
     */
    select?: PowerUpSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUp
     */
    omit?: PowerUpOmit<ExtArgs> | null
    /**
     * The data used to update PowerUps.
     */
    data: XOR<PowerUpUpdateManyMutationInput, PowerUpUncheckedUpdateManyInput>
    /**
     * Filter which PowerUps to update
     */
    where?: PowerUpWhereInput
    /**
     * Limit how many PowerUps to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PowerUp upsert
   */
  export type PowerUpUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUp
     */
    select?: PowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUp
     */
    omit?: PowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpInclude<ExtArgs> | null
    /**
     * The filter to search for the PowerUp to update in case it exists.
     */
    where: PowerUpWhereUniqueInput
    /**
     * In case the PowerUp found by the `where` argument doesn't exist, create a new PowerUp with this data.
     */
    create: XOR<PowerUpCreateInput, PowerUpUncheckedCreateInput>
    /**
     * In case the PowerUp was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PowerUpUpdateInput, PowerUpUncheckedUpdateInput>
  }

  /**
   * PowerUp delete
   */
  export type PowerUpDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUp
     */
    select?: PowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUp
     */
    omit?: PowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpInclude<ExtArgs> | null
    /**
     * Filter which PowerUp to delete.
     */
    where: PowerUpWhereUniqueInput
  }

  /**
   * PowerUp deleteMany
   */
  export type PowerUpDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PowerUps to delete
     */
    where?: PowerUpWhereInput
    /**
     * Limit how many PowerUps to delete.
     */
    limit?: number
  }

  /**
   * PowerUp.category
   */
  export type PowerUp$categoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpCategory
     */
    select?: PowerUpCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpCategory
     */
    omit?: PowerUpCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpCategoryInclude<ExtArgs> | null
    where?: PowerUpCategoryWhereInput
  }

  /**
   * PowerUp.powerUpUsages
   */
  export type PowerUp$powerUpUsagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpUsage
     */
    select?: PowerUpUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpUsage
     */
    omit?: PowerUpUsageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpUsageInclude<ExtArgs> | null
    where?: PowerUpUsageWhereInput
    orderBy?: PowerUpUsageOrderByWithRelationInput | PowerUpUsageOrderByWithRelationInput[]
    cursor?: PowerUpUsageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PowerUpUsageScalarFieldEnum | PowerUpUsageScalarFieldEnum[]
  }

  /**
   * PowerUp without action
   */
  export type PowerUpDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUp
     */
    select?: PowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUp
     */
    omit?: PowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpInclude<ExtArgs> | null
  }


  /**
   * Model PowerUpCategory
   */

  export type AggregatePowerUpCategory = {
    _count: PowerUpCategoryCountAggregateOutputType | null
    _min: PowerUpCategoryMinAggregateOutputType | null
    _max: PowerUpCategoryMaxAggregateOutputType | null
  }

  export type PowerUpCategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PowerUpCategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PowerUpCategoryCountAggregateOutputType = {
    id: number
    name: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PowerUpCategoryMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PowerUpCategoryMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PowerUpCategoryCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PowerUpCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PowerUpCategory to aggregate.
     */
    where?: PowerUpCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerUpCategories to fetch.
     */
    orderBy?: PowerUpCategoryOrderByWithRelationInput | PowerUpCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PowerUpCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerUpCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerUpCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PowerUpCategories
    **/
    _count?: true | PowerUpCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PowerUpCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PowerUpCategoryMaxAggregateInputType
  }

  export type GetPowerUpCategoryAggregateType<T extends PowerUpCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregatePowerUpCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePowerUpCategory[P]>
      : GetScalarType<T[P], AggregatePowerUpCategory[P]>
  }




  export type PowerUpCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PowerUpCategoryWhereInput
    orderBy?: PowerUpCategoryOrderByWithAggregationInput | PowerUpCategoryOrderByWithAggregationInput[]
    by: PowerUpCategoryScalarFieldEnum[] | PowerUpCategoryScalarFieldEnum
    having?: PowerUpCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PowerUpCategoryCountAggregateInputType | true
    _min?: PowerUpCategoryMinAggregateInputType
    _max?: PowerUpCategoryMaxAggregateInputType
  }

  export type PowerUpCategoryGroupByOutputType = {
    id: string
    name: string
    description: string
    createdAt: Date
    updatedAt: Date
    _count: PowerUpCategoryCountAggregateOutputType | null
    _min: PowerUpCategoryMinAggregateOutputType | null
    _max: PowerUpCategoryMaxAggregateOutputType | null
  }

  type GetPowerUpCategoryGroupByPayload<T extends PowerUpCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PowerUpCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PowerUpCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PowerUpCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], PowerUpCategoryGroupByOutputType[P]>
        }
      >
    >


  export type PowerUpCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    powerUps?: boolean | PowerUpCategory$powerUpsArgs<ExtArgs>
    _count?: boolean | PowerUpCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["powerUpCategory"]>

  export type PowerUpCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["powerUpCategory"]>

  export type PowerUpCategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["powerUpCategory"]>

  export type PowerUpCategorySelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PowerUpCategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["powerUpCategory"]>
  export type PowerUpCategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    powerUps?: boolean | PowerUpCategory$powerUpsArgs<ExtArgs>
    _count?: boolean | PowerUpCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PowerUpCategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PowerUpCategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PowerUpCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PowerUpCategory"
    objects: {
      powerUps: Prisma.$PowerUpPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["powerUpCategory"]>
    composites: {}
  }

  type PowerUpCategoryGetPayload<S extends boolean | null | undefined | PowerUpCategoryDefaultArgs> = $Result.GetResult<Prisma.$PowerUpCategoryPayload, S>

  type PowerUpCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PowerUpCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PowerUpCategoryCountAggregateInputType | true
    }

  export interface PowerUpCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PowerUpCategory'], meta: { name: 'PowerUpCategory' } }
    /**
     * Find zero or one PowerUpCategory that matches the filter.
     * @param {PowerUpCategoryFindUniqueArgs} args - Arguments to find a PowerUpCategory
     * @example
     * // Get one PowerUpCategory
     * const powerUpCategory = await prisma.powerUpCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PowerUpCategoryFindUniqueArgs>(args: SelectSubset<T, PowerUpCategoryFindUniqueArgs<ExtArgs>>): Prisma__PowerUpCategoryClient<$Result.GetResult<Prisma.$PowerUpCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PowerUpCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PowerUpCategoryFindUniqueOrThrowArgs} args - Arguments to find a PowerUpCategory
     * @example
     * // Get one PowerUpCategory
     * const powerUpCategory = await prisma.powerUpCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PowerUpCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, PowerUpCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PowerUpCategoryClient<$Result.GetResult<Prisma.$PowerUpCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PowerUpCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpCategoryFindFirstArgs} args - Arguments to find a PowerUpCategory
     * @example
     * // Get one PowerUpCategory
     * const powerUpCategory = await prisma.powerUpCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PowerUpCategoryFindFirstArgs>(args?: SelectSubset<T, PowerUpCategoryFindFirstArgs<ExtArgs>>): Prisma__PowerUpCategoryClient<$Result.GetResult<Prisma.$PowerUpCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PowerUpCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpCategoryFindFirstOrThrowArgs} args - Arguments to find a PowerUpCategory
     * @example
     * // Get one PowerUpCategory
     * const powerUpCategory = await prisma.powerUpCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PowerUpCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, PowerUpCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__PowerUpCategoryClient<$Result.GetResult<Prisma.$PowerUpCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PowerUpCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PowerUpCategories
     * const powerUpCategories = await prisma.powerUpCategory.findMany()
     * 
     * // Get first 10 PowerUpCategories
     * const powerUpCategories = await prisma.powerUpCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const powerUpCategoryWithIdOnly = await prisma.powerUpCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PowerUpCategoryFindManyArgs>(args?: SelectSubset<T, PowerUpCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerUpCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PowerUpCategory.
     * @param {PowerUpCategoryCreateArgs} args - Arguments to create a PowerUpCategory.
     * @example
     * // Create one PowerUpCategory
     * const PowerUpCategory = await prisma.powerUpCategory.create({
     *   data: {
     *     // ... data to create a PowerUpCategory
     *   }
     * })
     * 
     */
    create<T extends PowerUpCategoryCreateArgs>(args: SelectSubset<T, PowerUpCategoryCreateArgs<ExtArgs>>): Prisma__PowerUpCategoryClient<$Result.GetResult<Prisma.$PowerUpCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PowerUpCategories.
     * @param {PowerUpCategoryCreateManyArgs} args - Arguments to create many PowerUpCategories.
     * @example
     * // Create many PowerUpCategories
     * const powerUpCategory = await prisma.powerUpCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PowerUpCategoryCreateManyArgs>(args?: SelectSubset<T, PowerUpCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PowerUpCategories and returns the data saved in the database.
     * @param {PowerUpCategoryCreateManyAndReturnArgs} args - Arguments to create many PowerUpCategories.
     * @example
     * // Create many PowerUpCategories
     * const powerUpCategory = await prisma.powerUpCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PowerUpCategories and only return the `id`
     * const powerUpCategoryWithIdOnly = await prisma.powerUpCategory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PowerUpCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, PowerUpCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerUpCategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PowerUpCategory.
     * @param {PowerUpCategoryDeleteArgs} args - Arguments to delete one PowerUpCategory.
     * @example
     * // Delete one PowerUpCategory
     * const PowerUpCategory = await prisma.powerUpCategory.delete({
     *   where: {
     *     // ... filter to delete one PowerUpCategory
     *   }
     * })
     * 
     */
    delete<T extends PowerUpCategoryDeleteArgs>(args: SelectSubset<T, PowerUpCategoryDeleteArgs<ExtArgs>>): Prisma__PowerUpCategoryClient<$Result.GetResult<Prisma.$PowerUpCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PowerUpCategory.
     * @param {PowerUpCategoryUpdateArgs} args - Arguments to update one PowerUpCategory.
     * @example
     * // Update one PowerUpCategory
     * const powerUpCategory = await prisma.powerUpCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PowerUpCategoryUpdateArgs>(args: SelectSubset<T, PowerUpCategoryUpdateArgs<ExtArgs>>): Prisma__PowerUpCategoryClient<$Result.GetResult<Prisma.$PowerUpCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PowerUpCategories.
     * @param {PowerUpCategoryDeleteManyArgs} args - Arguments to filter PowerUpCategories to delete.
     * @example
     * // Delete a few PowerUpCategories
     * const { count } = await prisma.powerUpCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PowerUpCategoryDeleteManyArgs>(args?: SelectSubset<T, PowerUpCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PowerUpCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PowerUpCategories
     * const powerUpCategory = await prisma.powerUpCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PowerUpCategoryUpdateManyArgs>(args: SelectSubset<T, PowerUpCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PowerUpCategories and returns the data updated in the database.
     * @param {PowerUpCategoryUpdateManyAndReturnArgs} args - Arguments to update many PowerUpCategories.
     * @example
     * // Update many PowerUpCategories
     * const powerUpCategory = await prisma.powerUpCategory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PowerUpCategories and only return the `id`
     * const powerUpCategoryWithIdOnly = await prisma.powerUpCategory.updateManyAndReturn({
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
    updateManyAndReturn<T extends PowerUpCategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, PowerUpCategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerUpCategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PowerUpCategory.
     * @param {PowerUpCategoryUpsertArgs} args - Arguments to update or create a PowerUpCategory.
     * @example
     * // Update or create a PowerUpCategory
     * const powerUpCategory = await prisma.powerUpCategory.upsert({
     *   create: {
     *     // ... data to create a PowerUpCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PowerUpCategory we want to update
     *   }
     * })
     */
    upsert<T extends PowerUpCategoryUpsertArgs>(args: SelectSubset<T, PowerUpCategoryUpsertArgs<ExtArgs>>): Prisma__PowerUpCategoryClient<$Result.GetResult<Prisma.$PowerUpCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PowerUpCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpCategoryCountArgs} args - Arguments to filter PowerUpCategories to count.
     * @example
     * // Count the number of PowerUpCategories
     * const count = await prisma.powerUpCategory.count({
     *   where: {
     *     // ... the filter for the PowerUpCategories we want to count
     *   }
     * })
    **/
    count<T extends PowerUpCategoryCountArgs>(
      args?: Subset<T, PowerUpCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PowerUpCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PowerUpCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PowerUpCategoryAggregateArgs>(args: Subset<T, PowerUpCategoryAggregateArgs>): Prisma.PrismaPromise<GetPowerUpCategoryAggregateType<T>>

    /**
     * Group by PowerUpCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpCategoryGroupByArgs} args - Group by arguments.
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
      T extends PowerUpCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PowerUpCategoryGroupByArgs['orderBy'] }
        : { orderBy?: PowerUpCategoryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PowerUpCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPowerUpCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PowerUpCategory model
   */
  readonly fields: PowerUpCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PowerUpCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PowerUpCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    powerUps<T extends PowerUpCategory$powerUpsArgs<ExtArgs> = {}>(args?: Subset<T, PowerUpCategory$powerUpsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerUpPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the PowerUpCategory model
   */
  interface PowerUpCategoryFieldRefs {
    readonly id: FieldRef<"PowerUpCategory", 'String'>
    readonly name: FieldRef<"PowerUpCategory", 'String'>
    readonly description: FieldRef<"PowerUpCategory", 'String'>
    readonly createdAt: FieldRef<"PowerUpCategory", 'DateTime'>
    readonly updatedAt: FieldRef<"PowerUpCategory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PowerUpCategory findUnique
   */
  export type PowerUpCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpCategory
     */
    select?: PowerUpCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpCategory
     */
    omit?: PowerUpCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpCategoryInclude<ExtArgs> | null
    /**
     * Filter, which PowerUpCategory to fetch.
     */
    where: PowerUpCategoryWhereUniqueInput
  }

  /**
   * PowerUpCategory findUniqueOrThrow
   */
  export type PowerUpCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpCategory
     */
    select?: PowerUpCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpCategory
     */
    omit?: PowerUpCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpCategoryInclude<ExtArgs> | null
    /**
     * Filter, which PowerUpCategory to fetch.
     */
    where: PowerUpCategoryWhereUniqueInput
  }

  /**
   * PowerUpCategory findFirst
   */
  export type PowerUpCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpCategory
     */
    select?: PowerUpCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpCategory
     */
    omit?: PowerUpCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpCategoryInclude<ExtArgs> | null
    /**
     * Filter, which PowerUpCategory to fetch.
     */
    where?: PowerUpCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerUpCategories to fetch.
     */
    orderBy?: PowerUpCategoryOrderByWithRelationInput | PowerUpCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PowerUpCategories.
     */
    cursor?: PowerUpCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerUpCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerUpCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PowerUpCategories.
     */
    distinct?: PowerUpCategoryScalarFieldEnum | PowerUpCategoryScalarFieldEnum[]
  }

  /**
   * PowerUpCategory findFirstOrThrow
   */
  export type PowerUpCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpCategory
     */
    select?: PowerUpCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpCategory
     */
    omit?: PowerUpCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpCategoryInclude<ExtArgs> | null
    /**
     * Filter, which PowerUpCategory to fetch.
     */
    where?: PowerUpCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerUpCategories to fetch.
     */
    orderBy?: PowerUpCategoryOrderByWithRelationInput | PowerUpCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PowerUpCategories.
     */
    cursor?: PowerUpCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerUpCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerUpCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PowerUpCategories.
     */
    distinct?: PowerUpCategoryScalarFieldEnum | PowerUpCategoryScalarFieldEnum[]
  }

  /**
   * PowerUpCategory findMany
   */
  export type PowerUpCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpCategory
     */
    select?: PowerUpCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpCategory
     */
    omit?: PowerUpCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpCategoryInclude<ExtArgs> | null
    /**
     * Filter, which PowerUpCategories to fetch.
     */
    where?: PowerUpCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerUpCategories to fetch.
     */
    orderBy?: PowerUpCategoryOrderByWithRelationInput | PowerUpCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PowerUpCategories.
     */
    cursor?: PowerUpCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerUpCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerUpCategories.
     */
    skip?: number
    distinct?: PowerUpCategoryScalarFieldEnum | PowerUpCategoryScalarFieldEnum[]
  }

  /**
   * PowerUpCategory create
   */
  export type PowerUpCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpCategory
     */
    select?: PowerUpCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpCategory
     */
    omit?: PowerUpCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpCategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a PowerUpCategory.
     */
    data: XOR<PowerUpCategoryCreateInput, PowerUpCategoryUncheckedCreateInput>
  }

  /**
   * PowerUpCategory createMany
   */
  export type PowerUpCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PowerUpCategories.
     */
    data: PowerUpCategoryCreateManyInput | PowerUpCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PowerUpCategory createManyAndReturn
   */
  export type PowerUpCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpCategory
     */
    select?: PowerUpCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpCategory
     */
    omit?: PowerUpCategoryOmit<ExtArgs> | null
    /**
     * The data used to create many PowerUpCategories.
     */
    data: PowerUpCategoryCreateManyInput | PowerUpCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PowerUpCategory update
   */
  export type PowerUpCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpCategory
     */
    select?: PowerUpCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpCategory
     */
    omit?: PowerUpCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpCategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a PowerUpCategory.
     */
    data: XOR<PowerUpCategoryUpdateInput, PowerUpCategoryUncheckedUpdateInput>
    /**
     * Choose, which PowerUpCategory to update.
     */
    where: PowerUpCategoryWhereUniqueInput
  }

  /**
   * PowerUpCategory updateMany
   */
  export type PowerUpCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PowerUpCategories.
     */
    data: XOR<PowerUpCategoryUpdateManyMutationInput, PowerUpCategoryUncheckedUpdateManyInput>
    /**
     * Filter which PowerUpCategories to update
     */
    where?: PowerUpCategoryWhereInput
    /**
     * Limit how many PowerUpCategories to update.
     */
    limit?: number
  }

  /**
   * PowerUpCategory updateManyAndReturn
   */
  export type PowerUpCategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpCategory
     */
    select?: PowerUpCategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpCategory
     */
    omit?: PowerUpCategoryOmit<ExtArgs> | null
    /**
     * The data used to update PowerUpCategories.
     */
    data: XOR<PowerUpCategoryUpdateManyMutationInput, PowerUpCategoryUncheckedUpdateManyInput>
    /**
     * Filter which PowerUpCategories to update
     */
    where?: PowerUpCategoryWhereInput
    /**
     * Limit how many PowerUpCategories to update.
     */
    limit?: number
  }

  /**
   * PowerUpCategory upsert
   */
  export type PowerUpCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpCategory
     */
    select?: PowerUpCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpCategory
     */
    omit?: PowerUpCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpCategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the PowerUpCategory to update in case it exists.
     */
    where: PowerUpCategoryWhereUniqueInput
    /**
     * In case the PowerUpCategory found by the `where` argument doesn't exist, create a new PowerUpCategory with this data.
     */
    create: XOR<PowerUpCategoryCreateInput, PowerUpCategoryUncheckedCreateInput>
    /**
     * In case the PowerUpCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PowerUpCategoryUpdateInput, PowerUpCategoryUncheckedUpdateInput>
  }

  /**
   * PowerUpCategory delete
   */
  export type PowerUpCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpCategory
     */
    select?: PowerUpCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpCategory
     */
    omit?: PowerUpCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpCategoryInclude<ExtArgs> | null
    /**
     * Filter which PowerUpCategory to delete.
     */
    where: PowerUpCategoryWhereUniqueInput
  }

  /**
   * PowerUpCategory deleteMany
   */
  export type PowerUpCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PowerUpCategories to delete
     */
    where?: PowerUpCategoryWhereInput
    /**
     * Limit how many PowerUpCategories to delete.
     */
    limit?: number
  }

  /**
   * PowerUpCategory.powerUps
   */
  export type PowerUpCategory$powerUpsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUp
     */
    select?: PowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUp
     */
    omit?: PowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpInclude<ExtArgs> | null
    where?: PowerUpWhereInput
    orderBy?: PowerUpOrderByWithRelationInput | PowerUpOrderByWithRelationInput[]
    cursor?: PowerUpWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PowerUpScalarFieldEnum | PowerUpScalarFieldEnum[]
  }

  /**
   * PowerUpCategory without action
   */
  export type PowerUpCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpCategory
     */
    select?: PowerUpCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpCategory
     */
    omit?: PowerUpCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpCategoryInclude<ExtArgs> | null
  }


  /**
   * Model PowerUpUsage
   */

  export type AggregatePowerUpUsage = {
    _count: PowerUpUsageCountAggregateOutputType | null
    _min: PowerUpUsageMinAggregateOutputType | null
    _max: PowerUpUsageMaxAggregateOutputType | null
  }

  export type PowerUpUsageMinAggregateOutputType = {
    id: string | null
    userId: string | null
    powerUpId: string | null
    transactionId: string | null
    isVerified: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PowerUpUsageMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    powerUpId: string | null
    transactionId: string | null
    isVerified: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PowerUpUsageCountAggregateOutputType = {
    id: number
    userId: number
    powerUpId: number
    transactionId: number
    isVerified: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PowerUpUsageMinAggregateInputType = {
    id?: true
    userId?: true
    powerUpId?: true
    transactionId?: true
    isVerified?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PowerUpUsageMaxAggregateInputType = {
    id?: true
    userId?: true
    powerUpId?: true
    transactionId?: true
    isVerified?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PowerUpUsageCountAggregateInputType = {
    id?: true
    userId?: true
    powerUpId?: true
    transactionId?: true
    isVerified?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PowerUpUsageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PowerUpUsage to aggregate.
     */
    where?: PowerUpUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerUpUsages to fetch.
     */
    orderBy?: PowerUpUsageOrderByWithRelationInput | PowerUpUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PowerUpUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerUpUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerUpUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PowerUpUsages
    **/
    _count?: true | PowerUpUsageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PowerUpUsageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PowerUpUsageMaxAggregateInputType
  }

  export type GetPowerUpUsageAggregateType<T extends PowerUpUsageAggregateArgs> = {
        [P in keyof T & keyof AggregatePowerUpUsage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePowerUpUsage[P]>
      : GetScalarType<T[P], AggregatePowerUpUsage[P]>
  }




  export type PowerUpUsageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PowerUpUsageWhereInput
    orderBy?: PowerUpUsageOrderByWithAggregationInput | PowerUpUsageOrderByWithAggregationInput[]
    by: PowerUpUsageScalarFieldEnum[] | PowerUpUsageScalarFieldEnum
    having?: PowerUpUsageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PowerUpUsageCountAggregateInputType | true
    _min?: PowerUpUsageMinAggregateInputType
    _max?: PowerUpUsageMaxAggregateInputType
  }

  export type PowerUpUsageGroupByOutputType = {
    id: string
    userId: string
    powerUpId: string
    transactionId: string
    isVerified: boolean
    createdAt: Date
    updatedAt: Date
    _count: PowerUpUsageCountAggregateOutputType | null
    _min: PowerUpUsageMinAggregateOutputType | null
    _max: PowerUpUsageMaxAggregateOutputType | null
  }

  type GetPowerUpUsageGroupByPayload<T extends PowerUpUsageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PowerUpUsageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PowerUpUsageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PowerUpUsageGroupByOutputType[P]>
            : GetScalarType<T[P], PowerUpUsageGroupByOutputType[P]>
        }
      >
    >


  export type PowerUpUsageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    powerUpId?: boolean
    transactionId?: boolean
    isVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    powerUp?: boolean | PowerUpDefaultArgs<ExtArgs>
    leagueMembershipPowerUp?: boolean | PowerUpUsage$leagueMembershipPowerUpArgs<ExtArgs>
  }, ExtArgs["result"]["powerUpUsage"]>

  export type PowerUpUsageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    powerUpId?: boolean
    transactionId?: boolean
    isVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    powerUp?: boolean | PowerUpDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["powerUpUsage"]>

  export type PowerUpUsageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    powerUpId?: boolean
    transactionId?: boolean
    isVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    powerUp?: boolean | PowerUpDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["powerUpUsage"]>

  export type PowerUpUsageSelectScalar = {
    id?: boolean
    userId?: boolean
    powerUpId?: boolean
    transactionId?: boolean
    isVerified?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PowerUpUsageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "powerUpId" | "transactionId" | "isVerified" | "createdAt" | "updatedAt", ExtArgs["result"]["powerUpUsage"]>
  export type PowerUpUsageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    powerUp?: boolean | PowerUpDefaultArgs<ExtArgs>
    leagueMembershipPowerUp?: boolean | PowerUpUsage$leagueMembershipPowerUpArgs<ExtArgs>
  }
  export type PowerUpUsageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    powerUp?: boolean | PowerUpDefaultArgs<ExtArgs>
  }
  export type PowerUpUsageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    powerUp?: boolean | PowerUpDefaultArgs<ExtArgs>
  }

  export type $PowerUpUsagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PowerUpUsage"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      powerUp: Prisma.$PowerUpPayload<ExtArgs>
      leagueMembershipPowerUp: Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      powerUpId: string
      transactionId: string
      isVerified: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["powerUpUsage"]>
    composites: {}
  }

  type PowerUpUsageGetPayload<S extends boolean | null | undefined | PowerUpUsageDefaultArgs> = $Result.GetResult<Prisma.$PowerUpUsagePayload, S>

  type PowerUpUsageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PowerUpUsageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PowerUpUsageCountAggregateInputType | true
    }

  export interface PowerUpUsageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PowerUpUsage'], meta: { name: 'PowerUpUsage' } }
    /**
     * Find zero or one PowerUpUsage that matches the filter.
     * @param {PowerUpUsageFindUniqueArgs} args - Arguments to find a PowerUpUsage
     * @example
     * // Get one PowerUpUsage
     * const powerUpUsage = await prisma.powerUpUsage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PowerUpUsageFindUniqueArgs>(args: SelectSubset<T, PowerUpUsageFindUniqueArgs<ExtArgs>>): Prisma__PowerUpUsageClient<$Result.GetResult<Prisma.$PowerUpUsagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PowerUpUsage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PowerUpUsageFindUniqueOrThrowArgs} args - Arguments to find a PowerUpUsage
     * @example
     * // Get one PowerUpUsage
     * const powerUpUsage = await prisma.powerUpUsage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PowerUpUsageFindUniqueOrThrowArgs>(args: SelectSubset<T, PowerUpUsageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PowerUpUsageClient<$Result.GetResult<Prisma.$PowerUpUsagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PowerUpUsage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpUsageFindFirstArgs} args - Arguments to find a PowerUpUsage
     * @example
     * // Get one PowerUpUsage
     * const powerUpUsage = await prisma.powerUpUsage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PowerUpUsageFindFirstArgs>(args?: SelectSubset<T, PowerUpUsageFindFirstArgs<ExtArgs>>): Prisma__PowerUpUsageClient<$Result.GetResult<Prisma.$PowerUpUsagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PowerUpUsage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpUsageFindFirstOrThrowArgs} args - Arguments to find a PowerUpUsage
     * @example
     * // Get one PowerUpUsage
     * const powerUpUsage = await prisma.powerUpUsage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PowerUpUsageFindFirstOrThrowArgs>(args?: SelectSubset<T, PowerUpUsageFindFirstOrThrowArgs<ExtArgs>>): Prisma__PowerUpUsageClient<$Result.GetResult<Prisma.$PowerUpUsagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PowerUpUsages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpUsageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PowerUpUsages
     * const powerUpUsages = await prisma.powerUpUsage.findMany()
     * 
     * // Get first 10 PowerUpUsages
     * const powerUpUsages = await prisma.powerUpUsage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const powerUpUsageWithIdOnly = await prisma.powerUpUsage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PowerUpUsageFindManyArgs>(args?: SelectSubset<T, PowerUpUsageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerUpUsagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PowerUpUsage.
     * @param {PowerUpUsageCreateArgs} args - Arguments to create a PowerUpUsage.
     * @example
     * // Create one PowerUpUsage
     * const PowerUpUsage = await prisma.powerUpUsage.create({
     *   data: {
     *     // ... data to create a PowerUpUsage
     *   }
     * })
     * 
     */
    create<T extends PowerUpUsageCreateArgs>(args: SelectSubset<T, PowerUpUsageCreateArgs<ExtArgs>>): Prisma__PowerUpUsageClient<$Result.GetResult<Prisma.$PowerUpUsagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PowerUpUsages.
     * @param {PowerUpUsageCreateManyArgs} args - Arguments to create many PowerUpUsages.
     * @example
     * // Create many PowerUpUsages
     * const powerUpUsage = await prisma.powerUpUsage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PowerUpUsageCreateManyArgs>(args?: SelectSubset<T, PowerUpUsageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PowerUpUsages and returns the data saved in the database.
     * @param {PowerUpUsageCreateManyAndReturnArgs} args - Arguments to create many PowerUpUsages.
     * @example
     * // Create many PowerUpUsages
     * const powerUpUsage = await prisma.powerUpUsage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PowerUpUsages and only return the `id`
     * const powerUpUsageWithIdOnly = await prisma.powerUpUsage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PowerUpUsageCreateManyAndReturnArgs>(args?: SelectSubset<T, PowerUpUsageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerUpUsagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PowerUpUsage.
     * @param {PowerUpUsageDeleteArgs} args - Arguments to delete one PowerUpUsage.
     * @example
     * // Delete one PowerUpUsage
     * const PowerUpUsage = await prisma.powerUpUsage.delete({
     *   where: {
     *     // ... filter to delete one PowerUpUsage
     *   }
     * })
     * 
     */
    delete<T extends PowerUpUsageDeleteArgs>(args: SelectSubset<T, PowerUpUsageDeleteArgs<ExtArgs>>): Prisma__PowerUpUsageClient<$Result.GetResult<Prisma.$PowerUpUsagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PowerUpUsage.
     * @param {PowerUpUsageUpdateArgs} args - Arguments to update one PowerUpUsage.
     * @example
     * // Update one PowerUpUsage
     * const powerUpUsage = await prisma.powerUpUsage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PowerUpUsageUpdateArgs>(args: SelectSubset<T, PowerUpUsageUpdateArgs<ExtArgs>>): Prisma__PowerUpUsageClient<$Result.GetResult<Prisma.$PowerUpUsagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PowerUpUsages.
     * @param {PowerUpUsageDeleteManyArgs} args - Arguments to filter PowerUpUsages to delete.
     * @example
     * // Delete a few PowerUpUsages
     * const { count } = await prisma.powerUpUsage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PowerUpUsageDeleteManyArgs>(args?: SelectSubset<T, PowerUpUsageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PowerUpUsages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpUsageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PowerUpUsages
     * const powerUpUsage = await prisma.powerUpUsage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PowerUpUsageUpdateManyArgs>(args: SelectSubset<T, PowerUpUsageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PowerUpUsages and returns the data updated in the database.
     * @param {PowerUpUsageUpdateManyAndReturnArgs} args - Arguments to update many PowerUpUsages.
     * @example
     * // Update many PowerUpUsages
     * const powerUpUsage = await prisma.powerUpUsage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PowerUpUsages and only return the `id`
     * const powerUpUsageWithIdOnly = await prisma.powerUpUsage.updateManyAndReturn({
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
    updateManyAndReturn<T extends PowerUpUsageUpdateManyAndReturnArgs>(args: SelectSubset<T, PowerUpUsageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PowerUpUsagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PowerUpUsage.
     * @param {PowerUpUsageUpsertArgs} args - Arguments to update or create a PowerUpUsage.
     * @example
     * // Update or create a PowerUpUsage
     * const powerUpUsage = await prisma.powerUpUsage.upsert({
     *   create: {
     *     // ... data to create a PowerUpUsage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PowerUpUsage we want to update
     *   }
     * })
     */
    upsert<T extends PowerUpUsageUpsertArgs>(args: SelectSubset<T, PowerUpUsageUpsertArgs<ExtArgs>>): Prisma__PowerUpUsageClient<$Result.GetResult<Prisma.$PowerUpUsagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PowerUpUsages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpUsageCountArgs} args - Arguments to filter PowerUpUsages to count.
     * @example
     * // Count the number of PowerUpUsages
     * const count = await prisma.powerUpUsage.count({
     *   where: {
     *     // ... the filter for the PowerUpUsages we want to count
     *   }
     * })
    **/
    count<T extends PowerUpUsageCountArgs>(
      args?: Subset<T, PowerUpUsageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PowerUpUsageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PowerUpUsage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpUsageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PowerUpUsageAggregateArgs>(args: Subset<T, PowerUpUsageAggregateArgs>): Prisma.PrismaPromise<GetPowerUpUsageAggregateType<T>>

    /**
     * Group by PowerUpUsage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PowerUpUsageGroupByArgs} args - Group by arguments.
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
      T extends PowerUpUsageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PowerUpUsageGroupByArgs['orderBy'] }
        : { orderBy?: PowerUpUsageGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PowerUpUsageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPowerUpUsageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PowerUpUsage model
   */
  readonly fields: PowerUpUsageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PowerUpUsage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PowerUpUsageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    powerUp<T extends PowerUpDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PowerUpDefaultArgs<ExtArgs>>): Prisma__PowerUpClient<$Result.GetResult<Prisma.$PowerUpPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    leagueMembershipPowerUp<T extends PowerUpUsage$leagueMembershipPowerUpArgs<ExtArgs> = {}>(args?: Subset<T, PowerUpUsage$leagueMembershipPowerUpArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipPowerUpClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the PowerUpUsage model
   */
  interface PowerUpUsageFieldRefs {
    readonly id: FieldRef<"PowerUpUsage", 'String'>
    readonly userId: FieldRef<"PowerUpUsage", 'String'>
    readonly powerUpId: FieldRef<"PowerUpUsage", 'String'>
    readonly transactionId: FieldRef<"PowerUpUsage", 'String'>
    readonly isVerified: FieldRef<"PowerUpUsage", 'Boolean'>
    readonly createdAt: FieldRef<"PowerUpUsage", 'DateTime'>
    readonly updatedAt: FieldRef<"PowerUpUsage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PowerUpUsage findUnique
   */
  export type PowerUpUsageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpUsage
     */
    select?: PowerUpUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpUsage
     */
    omit?: PowerUpUsageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpUsageInclude<ExtArgs> | null
    /**
     * Filter, which PowerUpUsage to fetch.
     */
    where: PowerUpUsageWhereUniqueInput
  }

  /**
   * PowerUpUsage findUniqueOrThrow
   */
  export type PowerUpUsageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpUsage
     */
    select?: PowerUpUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpUsage
     */
    omit?: PowerUpUsageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpUsageInclude<ExtArgs> | null
    /**
     * Filter, which PowerUpUsage to fetch.
     */
    where: PowerUpUsageWhereUniqueInput
  }

  /**
   * PowerUpUsage findFirst
   */
  export type PowerUpUsageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpUsage
     */
    select?: PowerUpUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpUsage
     */
    omit?: PowerUpUsageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpUsageInclude<ExtArgs> | null
    /**
     * Filter, which PowerUpUsage to fetch.
     */
    where?: PowerUpUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerUpUsages to fetch.
     */
    orderBy?: PowerUpUsageOrderByWithRelationInput | PowerUpUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PowerUpUsages.
     */
    cursor?: PowerUpUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerUpUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerUpUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PowerUpUsages.
     */
    distinct?: PowerUpUsageScalarFieldEnum | PowerUpUsageScalarFieldEnum[]
  }

  /**
   * PowerUpUsage findFirstOrThrow
   */
  export type PowerUpUsageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpUsage
     */
    select?: PowerUpUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpUsage
     */
    omit?: PowerUpUsageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpUsageInclude<ExtArgs> | null
    /**
     * Filter, which PowerUpUsage to fetch.
     */
    where?: PowerUpUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerUpUsages to fetch.
     */
    orderBy?: PowerUpUsageOrderByWithRelationInput | PowerUpUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PowerUpUsages.
     */
    cursor?: PowerUpUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerUpUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerUpUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PowerUpUsages.
     */
    distinct?: PowerUpUsageScalarFieldEnum | PowerUpUsageScalarFieldEnum[]
  }

  /**
   * PowerUpUsage findMany
   */
  export type PowerUpUsageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpUsage
     */
    select?: PowerUpUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpUsage
     */
    omit?: PowerUpUsageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpUsageInclude<ExtArgs> | null
    /**
     * Filter, which PowerUpUsages to fetch.
     */
    where?: PowerUpUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PowerUpUsages to fetch.
     */
    orderBy?: PowerUpUsageOrderByWithRelationInput | PowerUpUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PowerUpUsages.
     */
    cursor?: PowerUpUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PowerUpUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PowerUpUsages.
     */
    skip?: number
    distinct?: PowerUpUsageScalarFieldEnum | PowerUpUsageScalarFieldEnum[]
  }

  /**
   * PowerUpUsage create
   */
  export type PowerUpUsageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpUsage
     */
    select?: PowerUpUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpUsage
     */
    omit?: PowerUpUsageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpUsageInclude<ExtArgs> | null
    /**
     * The data needed to create a PowerUpUsage.
     */
    data: XOR<PowerUpUsageCreateInput, PowerUpUsageUncheckedCreateInput>
  }

  /**
   * PowerUpUsage createMany
   */
  export type PowerUpUsageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PowerUpUsages.
     */
    data: PowerUpUsageCreateManyInput | PowerUpUsageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PowerUpUsage createManyAndReturn
   */
  export type PowerUpUsageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpUsage
     */
    select?: PowerUpUsageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpUsage
     */
    omit?: PowerUpUsageOmit<ExtArgs> | null
    /**
     * The data used to create many PowerUpUsages.
     */
    data: PowerUpUsageCreateManyInput | PowerUpUsageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpUsageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PowerUpUsage update
   */
  export type PowerUpUsageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpUsage
     */
    select?: PowerUpUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpUsage
     */
    omit?: PowerUpUsageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpUsageInclude<ExtArgs> | null
    /**
     * The data needed to update a PowerUpUsage.
     */
    data: XOR<PowerUpUsageUpdateInput, PowerUpUsageUncheckedUpdateInput>
    /**
     * Choose, which PowerUpUsage to update.
     */
    where: PowerUpUsageWhereUniqueInput
  }

  /**
   * PowerUpUsage updateMany
   */
  export type PowerUpUsageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PowerUpUsages.
     */
    data: XOR<PowerUpUsageUpdateManyMutationInput, PowerUpUsageUncheckedUpdateManyInput>
    /**
     * Filter which PowerUpUsages to update
     */
    where?: PowerUpUsageWhereInput
    /**
     * Limit how many PowerUpUsages to update.
     */
    limit?: number
  }

  /**
   * PowerUpUsage updateManyAndReturn
   */
  export type PowerUpUsageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpUsage
     */
    select?: PowerUpUsageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpUsage
     */
    omit?: PowerUpUsageOmit<ExtArgs> | null
    /**
     * The data used to update PowerUpUsages.
     */
    data: XOR<PowerUpUsageUpdateManyMutationInput, PowerUpUsageUncheckedUpdateManyInput>
    /**
     * Filter which PowerUpUsages to update
     */
    where?: PowerUpUsageWhereInput
    /**
     * Limit how many PowerUpUsages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpUsageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PowerUpUsage upsert
   */
  export type PowerUpUsageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpUsage
     */
    select?: PowerUpUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpUsage
     */
    omit?: PowerUpUsageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpUsageInclude<ExtArgs> | null
    /**
     * The filter to search for the PowerUpUsage to update in case it exists.
     */
    where: PowerUpUsageWhereUniqueInput
    /**
     * In case the PowerUpUsage found by the `where` argument doesn't exist, create a new PowerUpUsage with this data.
     */
    create: XOR<PowerUpUsageCreateInput, PowerUpUsageUncheckedCreateInput>
    /**
     * In case the PowerUpUsage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PowerUpUsageUpdateInput, PowerUpUsageUncheckedUpdateInput>
  }

  /**
   * PowerUpUsage delete
   */
  export type PowerUpUsageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpUsage
     */
    select?: PowerUpUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpUsage
     */
    omit?: PowerUpUsageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpUsageInclude<ExtArgs> | null
    /**
     * Filter which PowerUpUsage to delete.
     */
    where: PowerUpUsageWhereUniqueInput
  }

  /**
   * PowerUpUsage deleteMany
   */
  export type PowerUpUsageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PowerUpUsages to delete
     */
    where?: PowerUpUsageWhereInput
    /**
     * Limit how many PowerUpUsages to delete.
     */
    limit?: number
  }

  /**
   * PowerUpUsage.leagueMembershipPowerUp
   */
  export type PowerUpUsage$leagueMembershipPowerUpArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembershipPowerUp
     */
    select?: FantasyLeagueMembershipPowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembershipPowerUp
     */
    omit?: FantasyLeagueMembershipPowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipPowerUpInclude<ExtArgs> | null
    where?: FantasyLeagueMembershipPowerUpWhereInput
  }

  /**
   * PowerUpUsage without action
   */
  export type PowerUpUsageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PowerUpUsage
     */
    select?: PowerUpUsageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PowerUpUsage
     */
    omit?: PowerUpUsageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PowerUpUsageInclude<ExtArgs> | null
  }


  /**
   * Model FantasyLeagueMembershipPowerUp
   */

  export type AggregateFantasyLeagueMembershipPowerUp = {
    _count: FantasyLeagueMembershipPowerUpCountAggregateOutputType | null
    _min: FantasyLeagueMembershipPowerUpMinAggregateOutputType | null
    _max: FantasyLeagueMembershipPowerUpMaxAggregateOutputType | null
  }

  export type FantasyLeagueMembershipPowerUpMinAggregateOutputType = {
    id: string | null
    fantasyLeagueMembershipId: string | null
    powerUpUsageId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FantasyLeagueMembershipPowerUpMaxAggregateOutputType = {
    id: string | null
    fantasyLeagueMembershipId: string | null
    powerUpUsageId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FantasyLeagueMembershipPowerUpCountAggregateOutputType = {
    id: number
    fantasyLeagueMembershipId: number
    powerUpUsageId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FantasyLeagueMembershipPowerUpMinAggregateInputType = {
    id?: true
    fantasyLeagueMembershipId?: true
    powerUpUsageId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FantasyLeagueMembershipPowerUpMaxAggregateInputType = {
    id?: true
    fantasyLeagueMembershipId?: true
    powerUpUsageId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FantasyLeagueMembershipPowerUpCountAggregateInputType = {
    id?: true
    fantasyLeagueMembershipId?: true
    powerUpUsageId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FantasyLeagueMembershipPowerUpAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FantasyLeagueMembershipPowerUp to aggregate.
     */
    where?: FantasyLeagueMembershipPowerUpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FantasyLeagueMembershipPowerUps to fetch.
     */
    orderBy?: FantasyLeagueMembershipPowerUpOrderByWithRelationInput | FantasyLeagueMembershipPowerUpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FantasyLeagueMembershipPowerUpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FantasyLeagueMembershipPowerUps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FantasyLeagueMembershipPowerUps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FantasyLeagueMembershipPowerUps
    **/
    _count?: true | FantasyLeagueMembershipPowerUpCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FantasyLeagueMembershipPowerUpMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FantasyLeagueMembershipPowerUpMaxAggregateInputType
  }

  export type GetFantasyLeagueMembershipPowerUpAggregateType<T extends FantasyLeagueMembershipPowerUpAggregateArgs> = {
        [P in keyof T & keyof AggregateFantasyLeagueMembershipPowerUp]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFantasyLeagueMembershipPowerUp[P]>
      : GetScalarType<T[P], AggregateFantasyLeagueMembershipPowerUp[P]>
  }




  export type FantasyLeagueMembershipPowerUpGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FantasyLeagueMembershipPowerUpWhereInput
    orderBy?: FantasyLeagueMembershipPowerUpOrderByWithAggregationInput | FantasyLeagueMembershipPowerUpOrderByWithAggregationInput[]
    by: FantasyLeagueMembershipPowerUpScalarFieldEnum[] | FantasyLeagueMembershipPowerUpScalarFieldEnum
    having?: FantasyLeagueMembershipPowerUpScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FantasyLeagueMembershipPowerUpCountAggregateInputType | true
    _min?: FantasyLeagueMembershipPowerUpMinAggregateInputType
    _max?: FantasyLeagueMembershipPowerUpMaxAggregateInputType
  }

  export type FantasyLeagueMembershipPowerUpGroupByOutputType = {
    id: string
    fantasyLeagueMembershipId: string
    powerUpUsageId: string
    createdAt: Date
    updatedAt: Date
    _count: FantasyLeagueMembershipPowerUpCountAggregateOutputType | null
    _min: FantasyLeagueMembershipPowerUpMinAggregateOutputType | null
    _max: FantasyLeagueMembershipPowerUpMaxAggregateOutputType | null
  }

  type GetFantasyLeagueMembershipPowerUpGroupByPayload<T extends FantasyLeagueMembershipPowerUpGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FantasyLeagueMembershipPowerUpGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FantasyLeagueMembershipPowerUpGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FantasyLeagueMembershipPowerUpGroupByOutputType[P]>
            : GetScalarType<T[P], FantasyLeagueMembershipPowerUpGroupByOutputType[P]>
        }
      >
    >


  export type FantasyLeagueMembershipPowerUpSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fantasyLeagueMembershipId?: boolean
    powerUpUsageId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fantasyLeagueMembership?: boolean | FantasyLeagueMembershipDefaultArgs<ExtArgs>
    powerUpUsage?: boolean | PowerUpUsageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fantasyLeagueMembershipPowerUp"]>

  export type FantasyLeagueMembershipPowerUpSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fantasyLeagueMembershipId?: boolean
    powerUpUsageId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fantasyLeagueMembership?: boolean | FantasyLeagueMembershipDefaultArgs<ExtArgs>
    powerUpUsage?: boolean | PowerUpUsageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fantasyLeagueMembershipPowerUp"]>

  export type FantasyLeagueMembershipPowerUpSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fantasyLeagueMembershipId?: boolean
    powerUpUsageId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fantasyLeagueMembership?: boolean | FantasyLeagueMembershipDefaultArgs<ExtArgs>
    powerUpUsage?: boolean | PowerUpUsageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fantasyLeagueMembershipPowerUp"]>

  export type FantasyLeagueMembershipPowerUpSelectScalar = {
    id?: boolean
    fantasyLeagueMembershipId?: boolean
    powerUpUsageId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FantasyLeagueMembershipPowerUpOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fantasyLeagueMembershipId" | "powerUpUsageId" | "createdAt" | "updatedAt", ExtArgs["result"]["fantasyLeagueMembershipPowerUp"]>
  export type FantasyLeagueMembershipPowerUpInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fantasyLeagueMembership?: boolean | FantasyLeagueMembershipDefaultArgs<ExtArgs>
    powerUpUsage?: boolean | PowerUpUsageDefaultArgs<ExtArgs>
  }
  export type FantasyLeagueMembershipPowerUpIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fantasyLeagueMembership?: boolean | FantasyLeagueMembershipDefaultArgs<ExtArgs>
    powerUpUsage?: boolean | PowerUpUsageDefaultArgs<ExtArgs>
  }
  export type FantasyLeagueMembershipPowerUpIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fantasyLeagueMembership?: boolean | FantasyLeagueMembershipDefaultArgs<ExtArgs>
    powerUpUsage?: boolean | PowerUpUsageDefaultArgs<ExtArgs>
  }

  export type $FantasyLeagueMembershipPowerUpPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FantasyLeagueMembershipPowerUp"
    objects: {
      fantasyLeagueMembership: Prisma.$FantasyLeagueMembershipPayload<ExtArgs>
      powerUpUsage: Prisma.$PowerUpUsagePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fantasyLeagueMembershipId: string
      powerUpUsageId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["fantasyLeagueMembershipPowerUp"]>
    composites: {}
  }

  type FantasyLeagueMembershipPowerUpGetPayload<S extends boolean | null | undefined | FantasyLeagueMembershipPowerUpDefaultArgs> = $Result.GetResult<Prisma.$FantasyLeagueMembershipPowerUpPayload, S>

  type FantasyLeagueMembershipPowerUpCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FantasyLeagueMembershipPowerUpFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FantasyLeagueMembershipPowerUpCountAggregateInputType | true
    }

  export interface FantasyLeagueMembershipPowerUpDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FantasyLeagueMembershipPowerUp'], meta: { name: 'FantasyLeagueMembershipPowerUp' } }
    /**
     * Find zero or one FantasyLeagueMembershipPowerUp that matches the filter.
     * @param {FantasyLeagueMembershipPowerUpFindUniqueArgs} args - Arguments to find a FantasyLeagueMembershipPowerUp
     * @example
     * // Get one FantasyLeagueMembershipPowerUp
     * const fantasyLeagueMembershipPowerUp = await prisma.fantasyLeagueMembershipPowerUp.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FantasyLeagueMembershipPowerUpFindUniqueArgs>(args: SelectSubset<T, FantasyLeagueMembershipPowerUpFindUniqueArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipPowerUpClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FantasyLeagueMembershipPowerUp that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FantasyLeagueMembershipPowerUpFindUniqueOrThrowArgs} args - Arguments to find a FantasyLeagueMembershipPowerUp
     * @example
     * // Get one FantasyLeagueMembershipPowerUp
     * const fantasyLeagueMembershipPowerUp = await prisma.fantasyLeagueMembershipPowerUp.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FantasyLeagueMembershipPowerUpFindUniqueOrThrowArgs>(args: SelectSubset<T, FantasyLeagueMembershipPowerUpFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipPowerUpClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FantasyLeagueMembershipPowerUp that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueMembershipPowerUpFindFirstArgs} args - Arguments to find a FantasyLeagueMembershipPowerUp
     * @example
     * // Get one FantasyLeagueMembershipPowerUp
     * const fantasyLeagueMembershipPowerUp = await prisma.fantasyLeagueMembershipPowerUp.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FantasyLeagueMembershipPowerUpFindFirstArgs>(args?: SelectSubset<T, FantasyLeagueMembershipPowerUpFindFirstArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipPowerUpClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FantasyLeagueMembershipPowerUp that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueMembershipPowerUpFindFirstOrThrowArgs} args - Arguments to find a FantasyLeagueMembershipPowerUp
     * @example
     * // Get one FantasyLeagueMembershipPowerUp
     * const fantasyLeagueMembershipPowerUp = await prisma.fantasyLeagueMembershipPowerUp.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FantasyLeagueMembershipPowerUpFindFirstOrThrowArgs>(args?: SelectSubset<T, FantasyLeagueMembershipPowerUpFindFirstOrThrowArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipPowerUpClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FantasyLeagueMembershipPowerUps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueMembershipPowerUpFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FantasyLeagueMembershipPowerUps
     * const fantasyLeagueMembershipPowerUps = await prisma.fantasyLeagueMembershipPowerUp.findMany()
     * 
     * // Get first 10 FantasyLeagueMembershipPowerUps
     * const fantasyLeagueMembershipPowerUps = await prisma.fantasyLeagueMembershipPowerUp.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fantasyLeagueMembershipPowerUpWithIdOnly = await prisma.fantasyLeagueMembershipPowerUp.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FantasyLeagueMembershipPowerUpFindManyArgs>(args?: SelectSubset<T, FantasyLeagueMembershipPowerUpFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FantasyLeagueMembershipPowerUp.
     * @param {FantasyLeagueMembershipPowerUpCreateArgs} args - Arguments to create a FantasyLeagueMembershipPowerUp.
     * @example
     * // Create one FantasyLeagueMembershipPowerUp
     * const FantasyLeagueMembershipPowerUp = await prisma.fantasyLeagueMembershipPowerUp.create({
     *   data: {
     *     // ... data to create a FantasyLeagueMembershipPowerUp
     *   }
     * })
     * 
     */
    create<T extends FantasyLeagueMembershipPowerUpCreateArgs>(args: SelectSubset<T, FantasyLeagueMembershipPowerUpCreateArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipPowerUpClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FantasyLeagueMembershipPowerUps.
     * @param {FantasyLeagueMembershipPowerUpCreateManyArgs} args - Arguments to create many FantasyLeagueMembershipPowerUps.
     * @example
     * // Create many FantasyLeagueMembershipPowerUps
     * const fantasyLeagueMembershipPowerUp = await prisma.fantasyLeagueMembershipPowerUp.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FantasyLeagueMembershipPowerUpCreateManyArgs>(args?: SelectSubset<T, FantasyLeagueMembershipPowerUpCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FantasyLeagueMembershipPowerUps and returns the data saved in the database.
     * @param {FantasyLeagueMembershipPowerUpCreateManyAndReturnArgs} args - Arguments to create many FantasyLeagueMembershipPowerUps.
     * @example
     * // Create many FantasyLeagueMembershipPowerUps
     * const fantasyLeagueMembershipPowerUp = await prisma.fantasyLeagueMembershipPowerUp.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FantasyLeagueMembershipPowerUps and only return the `id`
     * const fantasyLeagueMembershipPowerUpWithIdOnly = await prisma.fantasyLeagueMembershipPowerUp.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FantasyLeagueMembershipPowerUpCreateManyAndReturnArgs>(args?: SelectSubset<T, FantasyLeagueMembershipPowerUpCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FantasyLeagueMembershipPowerUp.
     * @param {FantasyLeagueMembershipPowerUpDeleteArgs} args - Arguments to delete one FantasyLeagueMembershipPowerUp.
     * @example
     * // Delete one FantasyLeagueMembershipPowerUp
     * const FantasyLeagueMembershipPowerUp = await prisma.fantasyLeagueMembershipPowerUp.delete({
     *   where: {
     *     // ... filter to delete one FantasyLeagueMembershipPowerUp
     *   }
     * })
     * 
     */
    delete<T extends FantasyLeagueMembershipPowerUpDeleteArgs>(args: SelectSubset<T, FantasyLeagueMembershipPowerUpDeleteArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipPowerUpClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FantasyLeagueMembershipPowerUp.
     * @param {FantasyLeagueMembershipPowerUpUpdateArgs} args - Arguments to update one FantasyLeagueMembershipPowerUp.
     * @example
     * // Update one FantasyLeagueMembershipPowerUp
     * const fantasyLeagueMembershipPowerUp = await prisma.fantasyLeagueMembershipPowerUp.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FantasyLeagueMembershipPowerUpUpdateArgs>(args: SelectSubset<T, FantasyLeagueMembershipPowerUpUpdateArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipPowerUpClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FantasyLeagueMembershipPowerUps.
     * @param {FantasyLeagueMembershipPowerUpDeleteManyArgs} args - Arguments to filter FantasyLeagueMembershipPowerUps to delete.
     * @example
     * // Delete a few FantasyLeagueMembershipPowerUps
     * const { count } = await prisma.fantasyLeagueMembershipPowerUp.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FantasyLeagueMembershipPowerUpDeleteManyArgs>(args?: SelectSubset<T, FantasyLeagueMembershipPowerUpDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FantasyLeagueMembershipPowerUps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueMembershipPowerUpUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FantasyLeagueMembershipPowerUps
     * const fantasyLeagueMembershipPowerUp = await prisma.fantasyLeagueMembershipPowerUp.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FantasyLeagueMembershipPowerUpUpdateManyArgs>(args: SelectSubset<T, FantasyLeagueMembershipPowerUpUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FantasyLeagueMembershipPowerUps and returns the data updated in the database.
     * @param {FantasyLeagueMembershipPowerUpUpdateManyAndReturnArgs} args - Arguments to update many FantasyLeagueMembershipPowerUps.
     * @example
     * // Update many FantasyLeagueMembershipPowerUps
     * const fantasyLeagueMembershipPowerUp = await prisma.fantasyLeagueMembershipPowerUp.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FantasyLeagueMembershipPowerUps and only return the `id`
     * const fantasyLeagueMembershipPowerUpWithIdOnly = await prisma.fantasyLeagueMembershipPowerUp.updateManyAndReturn({
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
    updateManyAndReturn<T extends FantasyLeagueMembershipPowerUpUpdateManyAndReturnArgs>(args: SelectSubset<T, FantasyLeagueMembershipPowerUpUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FantasyLeagueMembershipPowerUp.
     * @param {FantasyLeagueMembershipPowerUpUpsertArgs} args - Arguments to update or create a FantasyLeagueMembershipPowerUp.
     * @example
     * // Update or create a FantasyLeagueMembershipPowerUp
     * const fantasyLeagueMembershipPowerUp = await prisma.fantasyLeagueMembershipPowerUp.upsert({
     *   create: {
     *     // ... data to create a FantasyLeagueMembershipPowerUp
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FantasyLeagueMembershipPowerUp we want to update
     *   }
     * })
     */
    upsert<T extends FantasyLeagueMembershipPowerUpUpsertArgs>(args: SelectSubset<T, FantasyLeagueMembershipPowerUpUpsertArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipPowerUpClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPowerUpPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FantasyLeagueMembershipPowerUps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueMembershipPowerUpCountArgs} args - Arguments to filter FantasyLeagueMembershipPowerUps to count.
     * @example
     * // Count the number of FantasyLeagueMembershipPowerUps
     * const count = await prisma.fantasyLeagueMembershipPowerUp.count({
     *   where: {
     *     // ... the filter for the FantasyLeagueMembershipPowerUps we want to count
     *   }
     * })
    **/
    count<T extends FantasyLeagueMembershipPowerUpCountArgs>(
      args?: Subset<T, FantasyLeagueMembershipPowerUpCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FantasyLeagueMembershipPowerUpCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FantasyLeagueMembershipPowerUp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueMembershipPowerUpAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FantasyLeagueMembershipPowerUpAggregateArgs>(args: Subset<T, FantasyLeagueMembershipPowerUpAggregateArgs>): Prisma.PrismaPromise<GetFantasyLeagueMembershipPowerUpAggregateType<T>>

    /**
     * Group by FantasyLeagueMembershipPowerUp.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FantasyLeagueMembershipPowerUpGroupByArgs} args - Group by arguments.
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
      T extends FantasyLeagueMembershipPowerUpGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FantasyLeagueMembershipPowerUpGroupByArgs['orderBy'] }
        : { orderBy?: FantasyLeagueMembershipPowerUpGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FantasyLeagueMembershipPowerUpGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFantasyLeagueMembershipPowerUpGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FantasyLeagueMembershipPowerUp model
   */
  readonly fields: FantasyLeagueMembershipPowerUpFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FantasyLeagueMembershipPowerUp.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FantasyLeagueMembershipPowerUpClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    fantasyLeagueMembership<T extends FantasyLeagueMembershipDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FantasyLeagueMembershipDefaultArgs<ExtArgs>>): Prisma__FantasyLeagueMembershipClient<$Result.GetResult<Prisma.$FantasyLeagueMembershipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    powerUpUsage<T extends PowerUpUsageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PowerUpUsageDefaultArgs<ExtArgs>>): Prisma__PowerUpUsageClient<$Result.GetResult<Prisma.$PowerUpUsagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the FantasyLeagueMembershipPowerUp model
   */
  interface FantasyLeagueMembershipPowerUpFieldRefs {
    readonly id: FieldRef<"FantasyLeagueMembershipPowerUp", 'String'>
    readonly fantasyLeagueMembershipId: FieldRef<"FantasyLeagueMembershipPowerUp", 'String'>
    readonly powerUpUsageId: FieldRef<"FantasyLeagueMembershipPowerUp", 'String'>
    readonly createdAt: FieldRef<"FantasyLeagueMembershipPowerUp", 'DateTime'>
    readonly updatedAt: FieldRef<"FantasyLeagueMembershipPowerUp", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FantasyLeagueMembershipPowerUp findUnique
   */
  export type FantasyLeagueMembershipPowerUpFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembershipPowerUp
     */
    select?: FantasyLeagueMembershipPowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembershipPowerUp
     */
    omit?: FantasyLeagueMembershipPowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipPowerUpInclude<ExtArgs> | null
    /**
     * Filter, which FantasyLeagueMembershipPowerUp to fetch.
     */
    where: FantasyLeagueMembershipPowerUpWhereUniqueInput
  }

  /**
   * FantasyLeagueMembershipPowerUp findUniqueOrThrow
   */
  export type FantasyLeagueMembershipPowerUpFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembershipPowerUp
     */
    select?: FantasyLeagueMembershipPowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembershipPowerUp
     */
    omit?: FantasyLeagueMembershipPowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipPowerUpInclude<ExtArgs> | null
    /**
     * Filter, which FantasyLeagueMembershipPowerUp to fetch.
     */
    where: FantasyLeagueMembershipPowerUpWhereUniqueInput
  }

  /**
   * FantasyLeagueMembershipPowerUp findFirst
   */
  export type FantasyLeagueMembershipPowerUpFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembershipPowerUp
     */
    select?: FantasyLeagueMembershipPowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembershipPowerUp
     */
    omit?: FantasyLeagueMembershipPowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipPowerUpInclude<ExtArgs> | null
    /**
     * Filter, which FantasyLeagueMembershipPowerUp to fetch.
     */
    where?: FantasyLeagueMembershipPowerUpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FantasyLeagueMembershipPowerUps to fetch.
     */
    orderBy?: FantasyLeagueMembershipPowerUpOrderByWithRelationInput | FantasyLeagueMembershipPowerUpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FantasyLeagueMembershipPowerUps.
     */
    cursor?: FantasyLeagueMembershipPowerUpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FantasyLeagueMembershipPowerUps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FantasyLeagueMembershipPowerUps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FantasyLeagueMembershipPowerUps.
     */
    distinct?: FantasyLeagueMembershipPowerUpScalarFieldEnum | FantasyLeagueMembershipPowerUpScalarFieldEnum[]
  }

  /**
   * FantasyLeagueMembershipPowerUp findFirstOrThrow
   */
  export type FantasyLeagueMembershipPowerUpFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembershipPowerUp
     */
    select?: FantasyLeagueMembershipPowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembershipPowerUp
     */
    omit?: FantasyLeagueMembershipPowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipPowerUpInclude<ExtArgs> | null
    /**
     * Filter, which FantasyLeagueMembershipPowerUp to fetch.
     */
    where?: FantasyLeagueMembershipPowerUpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FantasyLeagueMembershipPowerUps to fetch.
     */
    orderBy?: FantasyLeagueMembershipPowerUpOrderByWithRelationInput | FantasyLeagueMembershipPowerUpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FantasyLeagueMembershipPowerUps.
     */
    cursor?: FantasyLeagueMembershipPowerUpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FantasyLeagueMembershipPowerUps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FantasyLeagueMembershipPowerUps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FantasyLeagueMembershipPowerUps.
     */
    distinct?: FantasyLeagueMembershipPowerUpScalarFieldEnum | FantasyLeagueMembershipPowerUpScalarFieldEnum[]
  }

  /**
   * FantasyLeagueMembershipPowerUp findMany
   */
  export type FantasyLeagueMembershipPowerUpFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembershipPowerUp
     */
    select?: FantasyLeagueMembershipPowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembershipPowerUp
     */
    omit?: FantasyLeagueMembershipPowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipPowerUpInclude<ExtArgs> | null
    /**
     * Filter, which FantasyLeagueMembershipPowerUps to fetch.
     */
    where?: FantasyLeagueMembershipPowerUpWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FantasyLeagueMembershipPowerUps to fetch.
     */
    orderBy?: FantasyLeagueMembershipPowerUpOrderByWithRelationInput | FantasyLeagueMembershipPowerUpOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FantasyLeagueMembershipPowerUps.
     */
    cursor?: FantasyLeagueMembershipPowerUpWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FantasyLeagueMembershipPowerUps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FantasyLeagueMembershipPowerUps.
     */
    skip?: number
    distinct?: FantasyLeagueMembershipPowerUpScalarFieldEnum | FantasyLeagueMembershipPowerUpScalarFieldEnum[]
  }

  /**
   * FantasyLeagueMembershipPowerUp create
   */
  export type FantasyLeagueMembershipPowerUpCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembershipPowerUp
     */
    select?: FantasyLeagueMembershipPowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembershipPowerUp
     */
    omit?: FantasyLeagueMembershipPowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipPowerUpInclude<ExtArgs> | null
    /**
     * The data needed to create a FantasyLeagueMembershipPowerUp.
     */
    data: XOR<FantasyLeagueMembershipPowerUpCreateInput, FantasyLeagueMembershipPowerUpUncheckedCreateInput>
  }

  /**
   * FantasyLeagueMembershipPowerUp createMany
   */
  export type FantasyLeagueMembershipPowerUpCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FantasyLeagueMembershipPowerUps.
     */
    data: FantasyLeagueMembershipPowerUpCreateManyInput | FantasyLeagueMembershipPowerUpCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FantasyLeagueMembershipPowerUp createManyAndReturn
   */
  export type FantasyLeagueMembershipPowerUpCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembershipPowerUp
     */
    select?: FantasyLeagueMembershipPowerUpSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembershipPowerUp
     */
    omit?: FantasyLeagueMembershipPowerUpOmit<ExtArgs> | null
    /**
     * The data used to create many FantasyLeagueMembershipPowerUps.
     */
    data: FantasyLeagueMembershipPowerUpCreateManyInput | FantasyLeagueMembershipPowerUpCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipPowerUpIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FantasyLeagueMembershipPowerUp update
   */
  export type FantasyLeagueMembershipPowerUpUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembershipPowerUp
     */
    select?: FantasyLeagueMembershipPowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembershipPowerUp
     */
    omit?: FantasyLeagueMembershipPowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipPowerUpInclude<ExtArgs> | null
    /**
     * The data needed to update a FantasyLeagueMembershipPowerUp.
     */
    data: XOR<FantasyLeagueMembershipPowerUpUpdateInput, FantasyLeagueMembershipPowerUpUncheckedUpdateInput>
    /**
     * Choose, which FantasyLeagueMembershipPowerUp to update.
     */
    where: FantasyLeagueMembershipPowerUpWhereUniqueInput
  }

  /**
   * FantasyLeagueMembershipPowerUp updateMany
   */
  export type FantasyLeagueMembershipPowerUpUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FantasyLeagueMembershipPowerUps.
     */
    data: XOR<FantasyLeagueMembershipPowerUpUpdateManyMutationInput, FantasyLeagueMembershipPowerUpUncheckedUpdateManyInput>
    /**
     * Filter which FantasyLeagueMembershipPowerUps to update
     */
    where?: FantasyLeagueMembershipPowerUpWhereInput
    /**
     * Limit how many FantasyLeagueMembershipPowerUps to update.
     */
    limit?: number
  }

  /**
   * FantasyLeagueMembershipPowerUp updateManyAndReturn
   */
  export type FantasyLeagueMembershipPowerUpUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembershipPowerUp
     */
    select?: FantasyLeagueMembershipPowerUpSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembershipPowerUp
     */
    omit?: FantasyLeagueMembershipPowerUpOmit<ExtArgs> | null
    /**
     * The data used to update FantasyLeagueMembershipPowerUps.
     */
    data: XOR<FantasyLeagueMembershipPowerUpUpdateManyMutationInput, FantasyLeagueMembershipPowerUpUncheckedUpdateManyInput>
    /**
     * Filter which FantasyLeagueMembershipPowerUps to update
     */
    where?: FantasyLeagueMembershipPowerUpWhereInput
    /**
     * Limit how many FantasyLeagueMembershipPowerUps to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipPowerUpIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FantasyLeagueMembershipPowerUp upsert
   */
  export type FantasyLeagueMembershipPowerUpUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembershipPowerUp
     */
    select?: FantasyLeagueMembershipPowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembershipPowerUp
     */
    omit?: FantasyLeagueMembershipPowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipPowerUpInclude<ExtArgs> | null
    /**
     * The filter to search for the FantasyLeagueMembershipPowerUp to update in case it exists.
     */
    where: FantasyLeagueMembershipPowerUpWhereUniqueInput
    /**
     * In case the FantasyLeagueMembershipPowerUp found by the `where` argument doesn't exist, create a new FantasyLeagueMembershipPowerUp with this data.
     */
    create: XOR<FantasyLeagueMembershipPowerUpCreateInput, FantasyLeagueMembershipPowerUpUncheckedCreateInput>
    /**
     * In case the FantasyLeagueMembershipPowerUp was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FantasyLeagueMembershipPowerUpUpdateInput, FantasyLeagueMembershipPowerUpUncheckedUpdateInput>
  }

  /**
   * FantasyLeagueMembershipPowerUp delete
   */
  export type FantasyLeagueMembershipPowerUpDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembershipPowerUp
     */
    select?: FantasyLeagueMembershipPowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembershipPowerUp
     */
    omit?: FantasyLeagueMembershipPowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipPowerUpInclude<ExtArgs> | null
    /**
     * Filter which FantasyLeagueMembershipPowerUp to delete.
     */
    where: FantasyLeagueMembershipPowerUpWhereUniqueInput
  }

  /**
   * FantasyLeagueMembershipPowerUp deleteMany
   */
  export type FantasyLeagueMembershipPowerUpDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FantasyLeagueMembershipPowerUps to delete
     */
    where?: FantasyLeagueMembershipPowerUpWhereInput
    /**
     * Limit how many FantasyLeagueMembershipPowerUps to delete.
     */
    limit?: number
  }

  /**
   * FantasyLeagueMembershipPowerUp without action
   */
  export type FantasyLeagueMembershipPowerUpDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FantasyLeagueMembershipPowerUp
     */
    select?: FantasyLeagueMembershipPowerUpSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FantasyLeagueMembershipPowerUp
     */
    omit?: FantasyLeagueMembershipPowerUpOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FantasyLeagueMembershipPowerUpInclude<ExtArgs> | null
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
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TeamScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
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
    stake: 'stake',
    limit: 'limit',
    leagueType: 'leagueType',
    leagueMode: 'leagueMode',
    winners: 'winners',
    allowPowerUps: 'allowPowerUps',
    description: 'description',
    code: 'code',
    ownerId: 'ownerId',
    status: 'status',
    winnersArray: 'winnersArray',
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
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FantasyLeagueMembershipScalarFieldEnum = (typeof FantasyLeagueMembershipScalarFieldEnum)[keyof typeof FantasyLeagueMembershipScalarFieldEnum]


  export const GameweekScalarFieldEnum: {
    id: 'id',
    deadline: 'deadline',
    isActive: 'isActive'
  };

  export type GameweekScalarFieldEnum = (typeof GameweekScalarFieldEnum)[keyof typeof GameweekScalarFieldEnum]


  export const PowerUpScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    categoryId: 'categoryId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PowerUpScalarFieldEnum = (typeof PowerUpScalarFieldEnum)[keyof typeof PowerUpScalarFieldEnum]


  export const PowerUpCategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PowerUpCategoryScalarFieldEnum = (typeof PowerUpCategoryScalarFieldEnum)[keyof typeof PowerUpCategoryScalarFieldEnum]


  export const PowerUpUsageScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    powerUpId: 'powerUpId',
    transactionId: 'transactionId',
    isVerified: 'isVerified',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PowerUpUsageScalarFieldEnum = (typeof PowerUpUsageScalarFieldEnum)[keyof typeof PowerUpUsageScalarFieldEnum]


  export const FantasyLeagueMembershipPowerUpScalarFieldEnum: {
    id: 'id',
    fantasyLeagueMembershipId: 'fantasyLeagueMembershipId',
    powerUpUsageId: 'powerUpUsageId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FantasyLeagueMembershipPowerUpScalarFieldEnum = (typeof FantasyLeagueMembershipPowerUpScalarFieldEnum)[keyof typeof FantasyLeagueMembershipPowerUpScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


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
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
    leagues?: FantasyLeagueMembershipListRelationFilter
    ownedLeagues?: FantasyLeagueListRelationFilter
    powerUpUsages?: PowerUpUsageListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    team?: TeamOrderByWithRelationInput
    leagues?: FantasyLeagueMembershipOrderByRelationAggregateInput
    ownedLeagues?: FantasyLeagueOrderByRelationAggregateInput
    powerUpUsages?: PowerUpUsageOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
    leagues?: FantasyLeagueMembershipListRelationFilter
    ownedLeagues?: FantasyLeagueListRelationFilter
    powerUpUsages?: PowerUpUsageListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type TeamWhereInput = {
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    id?: StringFilter<"Team"> | string
    userId?: StringFilter<"Team"> | string
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
    teamValue?: SortOrder
    teamPlayers?: SortOrder
    captainId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TeamWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    teamValue?: IntFilter<"Team"> | number
    teamPlayers?: IntNullableListFilter<"Team">
    captainId?: IntNullableFilter<"Team"> | number | null
    createdAt?: DateTimeFilter<"Team"> | Date | string
    updatedAt?: DateTimeFilter<"Team"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type TeamOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
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
    stake?: StringFilter<"FantasyLeague"> | string
    limit?: IntFilter<"FantasyLeague"> | number
    leagueType?: StringFilter<"FantasyLeague"> | string
    leagueMode?: StringFilter<"FantasyLeague"> | string
    winners?: IntFilter<"FantasyLeague"> | number
    allowPowerUps?: BoolFilter<"FantasyLeague"> | boolean
    description?: StringNullableFilter<"FantasyLeague"> | string | null
    code?: StringFilter<"FantasyLeague"> | string
    ownerId?: StringFilter<"FantasyLeague"> | string
    status?: StringFilter<"FantasyLeague"> | string
    winnersArray?: StringNullableListFilter<"FantasyLeague">
    gameweekId?: IntFilter<"FantasyLeague"> | number
    createdAt?: DateTimeFilter<"FantasyLeague"> | Date | string
    updatedAt?: DateTimeFilter<"FantasyLeague"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    members?: FantasyLeagueMembershipListRelationFilter
    gameweek?: XOR<GameweekScalarRelationFilter, GameweekWhereInput>
  }

  export type FantasyLeagueOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    stake?: SortOrder
    limit?: SortOrder
    leagueType?: SortOrder
    leagueMode?: SortOrder
    winners?: SortOrder
    allowPowerUps?: SortOrder
    description?: SortOrderInput | SortOrder
    code?: SortOrder
    ownerId?: SortOrder
    status?: SortOrder
    winnersArray?: SortOrder
    gameweekId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    owner?: UserOrderByWithRelationInput
    members?: FantasyLeagueMembershipOrderByRelationAggregateInput
    gameweek?: GameweekOrderByWithRelationInput
  }

  export type FantasyLeagueWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: FantasyLeagueWhereInput | FantasyLeagueWhereInput[]
    OR?: FantasyLeagueWhereInput[]
    NOT?: FantasyLeagueWhereInput | FantasyLeagueWhereInput[]
    name?: StringFilter<"FantasyLeague"> | string
    stake?: StringFilter<"FantasyLeague"> | string
    limit?: IntFilter<"FantasyLeague"> | number
    leagueType?: StringFilter<"FantasyLeague"> | string
    leagueMode?: StringFilter<"FantasyLeague"> | string
    winners?: IntFilter<"FantasyLeague"> | number
    allowPowerUps?: BoolFilter<"FantasyLeague"> | boolean
    description?: StringNullableFilter<"FantasyLeague"> | string | null
    ownerId?: StringFilter<"FantasyLeague"> | string
    status?: StringFilter<"FantasyLeague"> | string
    winnersArray?: StringNullableListFilter<"FantasyLeague">
    gameweekId?: IntFilter<"FantasyLeague"> | number
    createdAt?: DateTimeFilter<"FantasyLeague"> | Date | string
    updatedAt?: DateTimeFilter<"FantasyLeague"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    members?: FantasyLeagueMembershipListRelationFilter
    gameweek?: XOR<GameweekScalarRelationFilter, GameweekWhereInput>
  }, "id" | "code">

  export type FantasyLeagueOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    stake?: SortOrder
    limit?: SortOrder
    leagueType?: SortOrder
    leagueMode?: SortOrder
    winners?: SortOrder
    allowPowerUps?: SortOrder
    description?: SortOrderInput | SortOrder
    code?: SortOrder
    ownerId?: SortOrder
    status?: SortOrder
    winnersArray?: SortOrder
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
    stake?: StringWithAggregatesFilter<"FantasyLeague"> | string
    limit?: IntWithAggregatesFilter<"FantasyLeague"> | number
    leagueType?: StringWithAggregatesFilter<"FantasyLeague"> | string
    leagueMode?: StringWithAggregatesFilter<"FantasyLeague"> | string
    winners?: IntWithAggregatesFilter<"FantasyLeague"> | number
    allowPowerUps?: BoolWithAggregatesFilter<"FantasyLeague"> | boolean
    description?: StringNullableWithAggregatesFilter<"FantasyLeague"> | string | null
    code?: StringWithAggregatesFilter<"FantasyLeague"> | string
    ownerId?: StringWithAggregatesFilter<"FantasyLeague"> | string
    status?: StringWithAggregatesFilter<"FantasyLeague"> | string
    winnersArray?: StringNullableListFilter<"FantasyLeague">
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
    createdAt?: DateTimeFilter<"FantasyLeagueMembership"> | Date | string
    updatedAt?: DateTimeFilter<"FantasyLeagueMembership"> | Date | string
    powerUps?: FantasyLeagueMembershipPowerUpListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    league?: XOR<FantasyLeagueScalarRelationFilter, FantasyLeagueWhereInput>
  }

  export type FantasyLeagueMembershipOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    leagueId?: SortOrder
    teamName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    powerUps?: FantasyLeagueMembershipPowerUpOrderByRelationAggregateInput
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
    createdAt?: DateTimeFilter<"FantasyLeagueMembership"> | Date | string
    updatedAt?: DateTimeFilter<"FantasyLeagueMembership"> | Date | string
    powerUps?: FantasyLeagueMembershipPowerUpListRelationFilter
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    league?: XOR<FantasyLeagueScalarRelationFilter, FantasyLeagueWhereInput>
  }, "id" | "userId_leagueId">

  export type FantasyLeagueMembershipOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    leagueId?: SortOrder
    teamName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FantasyLeagueMembershipCountOrderByAggregateInput
    _max?: FantasyLeagueMembershipMaxOrderByAggregateInput
    _min?: FantasyLeagueMembershipMinOrderByAggregateInput
  }

  export type FantasyLeagueMembershipScalarWhereWithAggregatesInput = {
    AND?: FantasyLeagueMembershipScalarWhereWithAggregatesInput | FantasyLeagueMembershipScalarWhereWithAggregatesInput[]
    OR?: FantasyLeagueMembershipScalarWhereWithAggregatesInput[]
    NOT?: FantasyLeagueMembershipScalarWhereWithAggregatesInput | FantasyLeagueMembershipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FantasyLeagueMembership"> | string
    userId?: StringWithAggregatesFilter<"FantasyLeagueMembership"> | string
    leagueId?: StringWithAggregatesFilter<"FantasyLeagueMembership"> | string
    teamName?: StringNullableWithAggregatesFilter<"FantasyLeagueMembership"> | string | null
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
    leagues?: FantasyLeagueListRelationFilter
  }

  export type GameweekOrderByWithRelationInput = {
    id?: SortOrder
    deadline?: SortOrder
    isActive?: SortOrder
    leagues?: FantasyLeagueOrderByRelationAggregateInput
  }

  export type GameweekWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: GameweekWhereInput | GameweekWhereInput[]
    OR?: GameweekWhereInput[]
    NOT?: GameweekWhereInput | GameweekWhereInput[]
    deadline?: DateTimeFilter<"Gameweek"> | Date | string
    isActive?: BoolFilter<"Gameweek"> | boolean
    leagues?: FantasyLeagueListRelationFilter
  }, "id">

  export type GameweekOrderByWithAggregationInput = {
    id?: SortOrder
    deadline?: SortOrder
    isActive?: SortOrder
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
  }

  export type PowerUpWhereInput = {
    AND?: PowerUpWhereInput | PowerUpWhereInput[]
    OR?: PowerUpWhereInput[]
    NOT?: PowerUpWhereInput | PowerUpWhereInput[]
    id?: StringFilter<"PowerUp"> | string
    name?: StringFilter<"PowerUp"> | string
    description?: StringFilter<"PowerUp"> | string
    categoryId?: StringNullableFilter<"PowerUp"> | string | null
    createdAt?: DateTimeFilter<"PowerUp"> | Date | string
    updatedAt?: DateTimeFilter<"PowerUp"> | Date | string
    category?: XOR<PowerUpCategoryNullableScalarRelationFilter, PowerUpCategoryWhereInput> | null
    powerUpUsages?: PowerUpUsageListRelationFilter
  }

  export type PowerUpOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    category?: PowerUpCategoryOrderByWithRelationInput
    powerUpUsages?: PowerUpUsageOrderByRelationAggregateInput
  }

  export type PowerUpWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PowerUpWhereInput | PowerUpWhereInput[]
    OR?: PowerUpWhereInput[]
    NOT?: PowerUpWhereInput | PowerUpWhereInput[]
    name?: StringFilter<"PowerUp"> | string
    description?: StringFilter<"PowerUp"> | string
    categoryId?: StringNullableFilter<"PowerUp"> | string | null
    createdAt?: DateTimeFilter<"PowerUp"> | Date | string
    updatedAt?: DateTimeFilter<"PowerUp"> | Date | string
    category?: XOR<PowerUpCategoryNullableScalarRelationFilter, PowerUpCategoryWhereInput> | null
    powerUpUsages?: PowerUpUsageListRelationFilter
  }, "id">

  export type PowerUpOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PowerUpCountOrderByAggregateInput
    _max?: PowerUpMaxOrderByAggregateInput
    _min?: PowerUpMinOrderByAggregateInput
  }

  export type PowerUpScalarWhereWithAggregatesInput = {
    AND?: PowerUpScalarWhereWithAggregatesInput | PowerUpScalarWhereWithAggregatesInput[]
    OR?: PowerUpScalarWhereWithAggregatesInput[]
    NOT?: PowerUpScalarWhereWithAggregatesInput | PowerUpScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PowerUp"> | string
    name?: StringWithAggregatesFilter<"PowerUp"> | string
    description?: StringWithAggregatesFilter<"PowerUp"> | string
    categoryId?: StringNullableWithAggregatesFilter<"PowerUp"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PowerUp"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PowerUp"> | Date | string
  }

  export type PowerUpCategoryWhereInput = {
    AND?: PowerUpCategoryWhereInput | PowerUpCategoryWhereInput[]
    OR?: PowerUpCategoryWhereInput[]
    NOT?: PowerUpCategoryWhereInput | PowerUpCategoryWhereInput[]
    id?: StringFilter<"PowerUpCategory"> | string
    name?: StringFilter<"PowerUpCategory"> | string
    description?: StringFilter<"PowerUpCategory"> | string
    createdAt?: DateTimeFilter<"PowerUpCategory"> | Date | string
    updatedAt?: DateTimeFilter<"PowerUpCategory"> | Date | string
    powerUps?: PowerUpListRelationFilter
  }

  export type PowerUpCategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    powerUps?: PowerUpOrderByRelationAggregateInput
  }

  export type PowerUpCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: PowerUpCategoryWhereInput | PowerUpCategoryWhereInput[]
    OR?: PowerUpCategoryWhereInput[]
    NOT?: PowerUpCategoryWhereInput | PowerUpCategoryWhereInput[]
    description?: StringFilter<"PowerUpCategory"> | string
    createdAt?: DateTimeFilter<"PowerUpCategory"> | Date | string
    updatedAt?: DateTimeFilter<"PowerUpCategory"> | Date | string
    powerUps?: PowerUpListRelationFilter
  }, "id" | "name">

  export type PowerUpCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PowerUpCategoryCountOrderByAggregateInput
    _max?: PowerUpCategoryMaxOrderByAggregateInput
    _min?: PowerUpCategoryMinOrderByAggregateInput
  }

  export type PowerUpCategoryScalarWhereWithAggregatesInput = {
    AND?: PowerUpCategoryScalarWhereWithAggregatesInput | PowerUpCategoryScalarWhereWithAggregatesInput[]
    OR?: PowerUpCategoryScalarWhereWithAggregatesInput[]
    NOT?: PowerUpCategoryScalarWhereWithAggregatesInput | PowerUpCategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PowerUpCategory"> | string
    name?: StringWithAggregatesFilter<"PowerUpCategory"> | string
    description?: StringWithAggregatesFilter<"PowerUpCategory"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PowerUpCategory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PowerUpCategory"> | Date | string
  }

  export type PowerUpUsageWhereInput = {
    AND?: PowerUpUsageWhereInput | PowerUpUsageWhereInput[]
    OR?: PowerUpUsageWhereInput[]
    NOT?: PowerUpUsageWhereInput | PowerUpUsageWhereInput[]
    id?: StringFilter<"PowerUpUsage"> | string
    userId?: StringFilter<"PowerUpUsage"> | string
    powerUpId?: StringFilter<"PowerUpUsage"> | string
    transactionId?: StringFilter<"PowerUpUsage"> | string
    isVerified?: BoolFilter<"PowerUpUsage"> | boolean
    createdAt?: DateTimeFilter<"PowerUpUsage"> | Date | string
    updatedAt?: DateTimeFilter<"PowerUpUsage"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    powerUp?: XOR<PowerUpScalarRelationFilter, PowerUpWhereInput>
    leagueMembershipPowerUp?: XOR<FantasyLeagueMembershipPowerUpNullableScalarRelationFilter, FantasyLeagueMembershipPowerUpWhereInput> | null
  }

  export type PowerUpUsageOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    powerUpId?: SortOrder
    transactionId?: SortOrder
    isVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    powerUp?: PowerUpOrderByWithRelationInput
    leagueMembershipPowerUp?: FantasyLeagueMembershipPowerUpOrderByWithRelationInput
  }

  export type PowerUpUsageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    transactionId?: string
    AND?: PowerUpUsageWhereInput | PowerUpUsageWhereInput[]
    OR?: PowerUpUsageWhereInput[]
    NOT?: PowerUpUsageWhereInput | PowerUpUsageWhereInput[]
    userId?: StringFilter<"PowerUpUsage"> | string
    powerUpId?: StringFilter<"PowerUpUsage"> | string
    isVerified?: BoolFilter<"PowerUpUsage"> | boolean
    createdAt?: DateTimeFilter<"PowerUpUsage"> | Date | string
    updatedAt?: DateTimeFilter<"PowerUpUsage"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    powerUp?: XOR<PowerUpScalarRelationFilter, PowerUpWhereInput>
    leagueMembershipPowerUp?: XOR<FantasyLeagueMembershipPowerUpNullableScalarRelationFilter, FantasyLeagueMembershipPowerUpWhereInput> | null
  }, "id" | "transactionId">

  export type PowerUpUsageOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    powerUpId?: SortOrder
    transactionId?: SortOrder
    isVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PowerUpUsageCountOrderByAggregateInput
    _max?: PowerUpUsageMaxOrderByAggregateInput
    _min?: PowerUpUsageMinOrderByAggregateInput
  }

  export type PowerUpUsageScalarWhereWithAggregatesInput = {
    AND?: PowerUpUsageScalarWhereWithAggregatesInput | PowerUpUsageScalarWhereWithAggregatesInput[]
    OR?: PowerUpUsageScalarWhereWithAggregatesInput[]
    NOT?: PowerUpUsageScalarWhereWithAggregatesInput | PowerUpUsageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PowerUpUsage"> | string
    userId?: StringWithAggregatesFilter<"PowerUpUsage"> | string
    powerUpId?: StringWithAggregatesFilter<"PowerUpUsage"> | string
    transactionId?: StringWithAggregatesFilter<"PowerUpUsage"> | string
    isVerified?: BoolWithAggregatesFilter<"PowerUpUsage"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"PowerUpUsage"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PowerUpUsage"> | Date | string
  }

  export type FantasyLeagueMembershipPowerUpWhereInput = {
    AND?: FantasyLeagueMembershipPowerUpWhereInput | FantasyLeagueMembershipPowerUpWhereInput[]
    OR?: FantasyLeagueMembershipPowerUpWhereInput[]
    NOT?: FantasyLeagueMembershipPowerUpWhereInput | FantasyLeagueMembershipPowerUpWhereInput[]
    id?: StringFilter<"FantasyLeagueMembershipPowerUp"> | string
    fantasyLeagueMembershipId?: StringFilter<"FantasyLeagueMembershipPowerUp"> | string
    powerUpUsageId?: StringFilter<"FantasyLeagueMembershipPowerUp"> | string
    createdAt?: DateTimeFilter<"FantasyLeagueMembershipPowerUp"> | Date | string
    updatedAt?: DateTimeFilter<"FantasyLeagueMembershipPowerUp"> | Date | string
    fantasyLeagueMembership?: XOR<FantasyLeagueMembershipScalarRelationFilter, FantasyLeagueMembershipWhereInput>
    powerUpUsage?: XOR<PowerUpUsageScalarRelationFilter, PowerUpUsageWhereInput>
  }

  export type FantasyLeagueMembershipPowerUpOrderByWithRelationInput = {
    id?: SortOrder
    fantasyLeagueMembershipId?: SortOrder
    powerUpUsageId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fantasyLeagueMembership?: FantasyLeagueMembershipOrderByWithRelationInput
    powerUpUsage?: PowerUpUsageOrderByWithRelationInput
  }

  export type FantasyLeagueMembershipPowerUpWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    powerUpUsageId?: string
    AND?: FantasyLeagueMembershipPowerUpWhereInput | FantasyLeagueMembershipPowerUpWhereInput[]
    OR?: FantasyLeagueMembershipPowerUpWhereInput[]
    NOT?: FantasyLeagueMembershipPowerUpWhereInput | FantasyLeagueMembershipPowerUpWhereInput[]
    fantasyLeagueMembershipId?: StringFilter<"FantasyLeagueMembershipPowerUp"> | string
    createdAt?: DateTimeFilter<"FantasyLeagueMembershipPowerUp"> | Date | string
    updatedAt?: DateTimeFilter<"FantasyLeagueMembershipPowerUp"> | Date | string
    fantasyLeagueMembership?: XOR<FantasyLeagueMembershipScalarRelationFilter, FantasyLeagueMembershipWhereInput>
    powerUpUsage?: XOR<PowerUpUsageScalarRelationFilter, PowerUpUsageWhereInput>
  }, "id" | "powerUpUsageId">

  export type FantasyLeagueMembershipPowerUpOrderByWithAggregationInput = {
    id?: SortOrder
    fantasyLeagueMembershipId?: SortOrder
    powerUpUsageId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FantasyLeagueMembershipPowerUpCountOrderByAggregateInput
    _max?: FantasyLeagueMembershipPowerUpMaxOrderByAggregateInput
    _min?: FantasyLeagueMembershipPowerUpMinOrderByAggregateInput
  }

  export type FantasyLeagueMembershipPowerUpScalarWhereWithAggregatesInput = {
    AND?: FantasyLeagueMembershipPowerUpScalarWhereWithAggregatesInput | FantasyLeagueMembershipPowerUpScalarWhereWithAggregatesInput[]
    OR?: FantasyLeagueMembershipPowerUpScalarWhereWithAggregatesInput[]
    NOT?: FantasyLeagueMembershipPowerUpScalarWhereWithAggregatesInput | FantasyLeagueMembershipPowerUpScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FantasyLeagueMembershipPowerUp"> | string
    fantasyLeagueMembershipId?: StringWithAggregatesFilter<"FantasyLeagueMembershipPowerUp"> | string
    powerUpUsageId?: StringWithAggregatesFilter<"FantasyLeagueMembershipPowerUp"> | string
    createdAt?: DateTimeWithAggregatesFilter<"FantasyLeagueMembershipPowerUp"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FantasyLeagueMembershipPowerUp"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    team?: TeamCreateNestedOneWithoutUserInput
    leagues?: FantasyLeagueMembershipCreateNestedManyWithoutUserInput
    ownedLeagues?: FantasyLeagueCreateNestedManyWithoutOwnerInput
    powerUpUsages?: PowerUpUsageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    team?: TeamUncheckedCreateNestedOneWithoutUserInput
    leagues?: FantasyLeagueMembershipUncheckedCreateNestedManyWithoutUserInput
    ownedLeagues?: FantasyLeagueUncheckedCreateNestedManyWithoutOwnerInput
    powerUpUsages?: PowerUpUsageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUpdateOneWithoutUserNestedInput
    leagues?: FantasyLeagueMembershipUpdateManyWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUpdateManyWithoutOwnerNestedInput
    powerUpUsages?: PowerUpUsageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUncheckedUpdateOneWithoutUserNestedInput
    leagues?: FantasyLeagueMembershipUncheckedUpdateManyWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUncheckedUpdateManyWithoutOwnerNestedInput
    powerUpUsages?: PowerUpUsageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamCreateInput = {
    id?: string
    teamValue?: number
    teamPlayers?: TeamCreateteamPlayersInput | number[]
    captainId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTeamInput
  }

  export type TeamUncheckedCreateInput = {
    id?: string
    userId: string
    teamValue?: number
    teamPlayers?: TeamCreateteamPlayersInput | number[]
    captainId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TeamUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamValue?: IntFieldUpdateOperationsInput | number
    teamPlayers?: TeamUpdateteamPlayersInput | number[]
    captainId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    teamValue?: IntFieldUpdateOperationsInput | number
    teamPlayers?: TeamUpdateteamPlayersInput | number[]
    captainId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamCreateManyInput = {
    id?: string
    userId: string
    teamValue?: number
    teamPlayers?: TeamCreateteamPlayersInput | number[]
    captainId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TeamUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamValue?: IntFieldUpdateOperationsInput | number
    teamPlayers?: TeamUpdateteamPlayersInput | number[]
    captainId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    teamValue?: IntFieldUpdateOperationsInput | number
    teamPlayers?: TeamUpdateteamPlayersInput | number[]
    captainId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueCreateInput = {
    id?: string
    name: string
    stake: string
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    allowPowerUps: boolean
    description?: string | null
    code: string
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutOwnedLeaguesInput
    members?: FantasyLeagueMembershipCreateNestedManyWithoutLeagueInput
    gameweek: GameweekCreateNestedOneWithoutLeaguesInput
  }

  export type FantasyLeagueUncheckedCreateInput = {
    id?: string
    name: string
    stake: string
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    allowPowerUps: boolean
    description?: string | null
    code: string
    ownerId: string
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    gameweekId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: FantasyLeagueMembershipUncheckedCreateNestedManyWithoutLeagueInput
  }

  export type FantasyLeagueUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stake?: StringFieldUpdateOperationsInput | string
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    allowPowerUps?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutOwnedLeaguesNestedInput
    members?: FantasyLeagueMembershipUpdateManyWithoutLeagueNestedInput
    gameweek?: GameweekUpdateOneRequiredWithoutLeaguesNestedInput
  }

  export type FantasyLeagueUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stake?: StringFieldUpdateOperationsInput | string
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    allowPowerUps?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    gameweekId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: FantasyLeagueMembershipUncheckedUpdateManyWithoutLeagueNestedInput
  }

  export type FantasyLeagueCreateManyInput = {
    id?: string
    name: string
    stake: string
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    allowPowerUps: boolean
    description?: string | null
    code: string
    ownerId: string
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    gameweekId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stake?: StringFieldUpdateOperationsInput | string
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    allowPowerUps?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stake?: StringFieldUpdateOperationsInput | string
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    allowPowerUps?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    gameweekId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipCreateInput = {
    id?: string
    teamName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    powerUps?: FantasyLeagueMembershipPowerUpCreateNestedManyWithoutFantasyLeagueMembershipInput
    user: UserCreateNestedOneWithoutLeaguesInput
    league: FantasyLeagueCreateNestedOneWithoutMembersInput
  }

  export type FantasyLeagueMembershipUncheckedCreateInput = {
    id?: string
    userId: string
    leagueId: string
    teamName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    powerUps?: FantasyLeagueMembershipPowerUpUncheckedCreateNestedManyWithoutFantasyLeagueMembershipInput
  }

  export type FantasyLeagueMembershipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    powerUps?: FantasyLeagueMembershipPowerUpUpdateManyWithoutFantasyLeagueMembershipNestedInput
    user?: UserUpdateOneRequiredWithoutLeaguesNestedInput
    league?: FantasyLeagueUpdateOneRequiredWithoutMembersNestedInput
  }

  export type FantasyLeagueMembershipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    powerUps?: FantasyLeagueMembershipPowerUpUncheckedUpdateManyWithoutFantasyLeagueMembershipNestedInput
  }

  export type FantasyLeagueMembershipCreateManyInput = {
    id?: string
    userId: string
    leagueId: string
    teamName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueMembershipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameweekCreateInput = {
    id: number
    deadline: Date | string
    isActive?: boolean
    leagues?: FantasyLeagueCreateNestedManyWithoutGameweekInput
  }

  export type GameweekUncheckedCreateInput = {
    id: number
    deadline: Date | string
    isActive?: boolean
    leagues?: FantasyLeagueUncheckedCreateNestedManyWithoutGameweekInput
  }

  export type GameweekUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    leagues?: FantasyLeagueUpdateManyWithoutGameweekNestedInput
  }

  export type GameweekUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    leagues?: FantasyLeagueUncheckedUpdateManyWithoutGameweekNestedInput
  }

  export type GameweekCreateManyInput = {
    id: number
    deadline: Date | string
    isActive?: boolean
  }

  export type GameweekUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type GameweekUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PowerUpCreateInput = {
    id?: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    category?: PowerUpCategoryCreateNestedOneWithoutPowerUpsInput
    powerUpUsages?: PowerUpUsageCreateNestedManyWithoutPowerUpInput
  }

  export type PowerUpUncheckedCreateInput = {
    id?: string
    name: string
    description: string
    categoryId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    powerUpUsages?: PowerUpUsageUncheckedCreateNestedManyWithoutPowerUpInput
  }

  export type PowerUpUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: PowerUpCategoryUpdateOneWithoutPowerUpsNestedInput
    powerUpUsages?: PowerUpUsageUpdateManyWithoutPowerUpNestedInput
  }

  export type PowerUpUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    powerUpUsages?: PowerUpUsageUncheckedUpdateManyWithoutPowerUpNestedInput
  }

  export type PowerUpCreateManyInput = {
    id?: string
    name: string
    description: string
    categoryId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PowerUpUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PowerUpUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PowerUpCategoryCreateInput = {
    id?: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    powerUps?: PowerUpCreateNestedManyWithoutCategoryInput
  }

  export type PowerUpCategoryUncheckedCreateInput = {
    id?: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    powerUps?: PowerUpUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type PowerUpCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    powerUps?: PowerUpUpdateManyWithoutCategoryNestedInput
  }

  export type PowerUpCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    powerUps?: PowerUpUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type PowerUpCategoryCreateManyInput = {
    id?: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PowerUpCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PowerUpCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PowerUpUsageCreateInput = {
    id?: string
    transactionId: string
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPowerUpUsagesInput
    powerUp: PowerUpCreateNestedOneWithoutPowerUpUsagesInput
    leagueMembershipPowerUp?: FantasyLeagueMembershipPowerUpCreateNestedOneWithoutPowerUpUsageInput
  }

  export type PowerUpUsageUncheckedCreateInput = {
    id?: string
    userId: string
    powerUpId: string
    transactionId: string
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    leagueMembershipPowerUp?: FantasyLeagueMembershipPowerUpUncheckedCreateNestedOneWithoutPowerUpUsageInput
  }

  export type PowerUpUsageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPowerUpUsagesNestedInput
    powerUp?: PowerUpUpdateOneRequiredWithoutPowerUpUsagesNestedInput
    leagueMembershipPowerUp?: FantasyLeagueMembershipPowerUpUpdateOneWithoutPowerUpUsageNestedInput
  }

  export type PowerUpUsageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    powerUpId?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leagueMembershipPowerUp?: FantasyLeagueMembershipPowerUpUncheckedUpdateOneWithoutPowerUpUsageNestedInput
  }

  export type PowerUpUsageCreateManyInput = {
    id?: string
    userId: string
    powerUpId: string
    transactionId: string
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PowerUpUsageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PowerUpUsageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    powerUpId?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipPowerUpCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fantasyLeagueMembership: FantasyLeagueMembershipCreateNestedOneWithoutPowerUpsInput
    powerUpUsage: PowerUpUsageCreateNestedOneWithoutLeagueMembershipPowerUpInput
  }

  export type FantasyLeagueMembershipPowerUpUncheckedCreateInput = {
    id?: string
    fantasyLeagueMembershipId: string
    powerUpUsageId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueMembershipPowerUpUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fantasyLeagueMembership?: FantasyLeagueMembershipUpdateOneRequiredWithoutPowerUpsNestedInput
    powerUpUsage?: PowerUpUsageUpdateOneRequiredWithoutLeagueMembershipPowerUpNestedInput
  }

  export type FantasyLeagueMembershipPowerUpUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fantasyLeagueMembershipId?: StringFieldUpdateOperationsInput | string
    powerUpUsageId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipPowerUpCreateManyInput = {
    id?: string
    fantasyLeagueMembershipId: string
    powerUpUsageId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueMembershipPowerUpUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipPowerUpUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fantasyLeagueMembershipId?: StringFieldUpdateOperationsInput | string
    powerUpUsageId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type TeamNullableScalarRelationFilter = {
    is?: TeamWhereInput | null
    isNot?: TeamWhereInput | null
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

  export type PowerUpUsageListRelationFilter = {
    every?: PowerUpUsageWhereInput
    some?: PowerUpUsageWhereInput
    none?: PowerUpUsageWhereInput
  }

  export type FantasyLeagueMembershipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FantasyLeagueOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PowerUpUsageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TeamCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
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
    teamValue?: SortOrder
    captainId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TeamMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type GameweekScalarRelationFilter = {
    is?: GameweekWhereInput
    isNot?: GameweekWhereInput
  }

  export type FantasyLeagueCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    stake?: SortOrder
    limit?: SortOrder
    leagueType?: SortOrder
    leagueMode?: SortOrder
    winners?: SortOrder
    allowPowerUps?: SortOrder
    description?: SortOrder
    code?: SortOrder
    ownerId?: SortOrder
    status?: SortOrder
    winnersArray?: SortOrder
    gameweekId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FantasyLeagueAvgOrderByAggregateInput = {
    limit?: SortOrder
    winners?: SortOrder
    gameweekId?: SortOrder
  }

  export type FantasyLeagueMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    stake?: SortOrder
    limit?: SortOrder
    leagueType?: SortOrder
    leagueMode?: SortOrder
    winners?: SortOrder
    allowPowerUps?: SortOrder
    description?: SortOrder
    code?: SortOrder
    ownerId?: SortOrder
    status?: SortOrder
    gameweekId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FantasyLeagueMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    stake?: SortOrder
    limit?: SortOrder
    leagueType?: SortOrder
    leagueMode?: SortOrder
    winners?: SortOrder
    allowPowerUps?: SortOrder
    description?: SortOrder
    code?: SortOrder
    ownerId?: SortOrder
    status?: SortOrder
    gameweekId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FantasyLeagueSumOrderByAggregateInput = {
    limit?: SortOrder
    winners?: SortOrder
    gameweekId?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type FantasyLeagueMembershipPowerUpListRelationFilter = {
    every?: FantasyLeagueMembershipPowerUpWhereInput
    some?: FantasyLeagueMembershipPowerUpWhereInput
    none?: FantasyLeagueMembershipPowerUpWhereInput
  }

  export type FantasyLeagueScalarRelationFilter = {
    is?: FantasyLeagueWhereInput
    isNot?: FantasyLeagueWhereInput
  }

  export type FantasyLeagueMembershipPowerUpOrderByRelationAggregateInput = {
    _count?: SortOrder
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
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FantasyLeagueMembershipMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    leagueId?: SortOrder
    teamName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FantasyLeagueMembershipMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    leagueId?: SortOrder
    teamName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GameweekCountOrderByAggregateInput = {
    id?: SortOrder
    deadline?: SortOrder
    isActive?: SortOrder
  }

  export type GameweekAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type GameweekMaxOrderByAggregateInput = {
    id?: SortOrder
    deadline?: SortOrder
    isActive?: SortOrder
  }

  export type GameweekMinOrderByAggregateInput = {
    id?: SortOrder
    deadline?: SortOrder
    isActive?: SortOrder
  }

  export type GameweekSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PowerUpCategoryNullableScalarRelationFilter = {
    is?: PowerUpCategoryWhereInput | null
    isNot?: PowerUpCategoryWhereInput | null
  }

  export type PowerUpCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PowerUpMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PowerUpMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PowerUpListRelationFilter = {
    every?: PowerUpWhereInput
    some?: PowerUpWhereInput
    none?: PowerUpWhereInput
  }

  export type PowerUpOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PowerUpCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PowerUpCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PowerUpCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PowerUpScalarRelationFilter = {
    is?: PowerUpWhereInput
    isNot?: PowerUpWhereInput
  }

  export type FantasyLeagueMembershipPowerUpNullableScalarRelationFilter = {
    is?: FantasyLeagueMembershipPowerUpWhereInput | null
    isNot?: FantasyLeagueMembershipPowerUpWhereInput | null
  }

  export type PowerUpUsageCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    powerUpId?: SortOrder
    transactionId?: SortOrder
    isVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PowerUpUsageMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    powerUpId?: SortOrder
    transactionId?: SortOrder
    isVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PowerUpUsageMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    powerUpId?: SortOrder
    transactionId?: SortOrder
    isVerified?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FantasyLeagueMembershipScalarRelationFilter = {
    is?: FantasyLeagueMembershipWhereInput
    isNot?: FantasyLeagueMembershipWhereInput
  }

  export type PowerUpUsageScalarRelationFilter = {
    is?: PowerUpUsageWhereInput
    isNot?: PowerUpUsageWhereInput
  }

  export type FantasyLeagueMembershipPowerUpCountOrderByAggregateInput = {
    id?: SortOrder
    fantasyLeagueMembershipId?: SortOrder
    powerUpUsageId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FantasyLeagueMembershipPowerUpMaxOrderByAggregateInput = {
    id?: SortOrder
    fantasyLeagueMembershipId?: SortOrder
    powerUpUsageId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FantasyLeagueMembershipPowerUpMinOrderByAggregateInput = {
    id?: SortOrder
    fantasyLeagueMembershipId?: SortOrder
    powerUpUsageId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TeamCreateNestedOneWithoutUserInput = {
    create?: XOR<TeamCreateWithoutUserInput, TeamUncheckedCreateWithoutUserInput>
    connectOrCreate?: TeamCreateOrConnectWithoutUserInput
    connect?: TeamWhereUniqueInput
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

  export type PowerUpUsageCreateNestedManyWithoutUserInput = {
    create?: XOR<PowerUpUsageCreateWithoutUserInput, PowerUpUsageUncheckedCreateWithoutUserInput> | PowerUpUsageCreateWithoutUserInput[] | PowerUpUsageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PowerUpUsageCreateOrConnectWithoutUserInput | PowerUpUsageCreateOrConnectWithoutUserInput[]
    createMany?: PowerUpUsageCreateManyUserInputEnvelope
    connect?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
  }

  export type TeamUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<TeamCreateWithoutUserInput, TeamUncheckedCreateWithoutUserInput>
    connectOrCreate?: TeamCreateOrConnectWithoutUserInput
    connect?: TeamWhereUniqueInput
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

  export type PowerUpUsageUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PowerUpUsageCreateWithoutUserInput, PowerUpUsageUncheckedCreateWithoutUserInput> | PowerUpUsageCreateWithoutUserInput[] | PowerUpUsageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PowerUpUsageCreateOrConnectWithoutUserInput | PowerUpUsageCreateOrConnectWithoutUserInput[]
    createMany?: PowerUpUsageCreateManyUserInputEnvelope
    connect?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TeamUpdateOneWithoutUserNestedInput = {
    create?: XOR<TeamCreateWithoutUserInput, TeamUncheckedCreateWithoutUserInput>
    connectOrCreate?: TeamCreateOrConnectWithoutUserInput
    upsert?: TeamUpsertWithoutUserInput
    disconnect?: TeamWhereInput | boolean
    delete?: TeamWhereInput | boolean
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutUserInput, TeamUpdateWithoutUserInput>, TeamUncheckedUpdateWithoutUserInput>
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

  export type PowerUpUsageUpdateManyWithoutUserNestedInput = {
    create?: XOR<PowerUpUsageCreateWithoutUserInput, PowerUpUsageUncheckedCreateWithoutUserInput> | PowerUpUsageCreateWithoutUserInput[] | PowerUpUsageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PowerUpUsageCreateOrConnectWithoutUserInput | PowerUpUsageCreateOrConnectWithoutUserInput[]
    upsert?: PowerUpUsageUpsertWithWhereUniqueWithoutUserInput | PowerUpUsageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PowerUpUsageCreateManyUserInputEnvelope
    set?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    disconnect?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    delete?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    connect?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    update?: PowerUpUsageUpdateWithWhereUniqueWithoutUserInput | PowerUpUsageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PowerUpUsageUpdateManyWithWhereWithoutUserInput | PowerUpUsageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PowerUpUsageScalarWhereInput | PowerUpUsageScalarWhereInput[]
  }

  export type TeamUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<TeamCreateWithoutUserInput, TeamUncheckedCreateWithoutUserInput>
    connectOrCreate?: TeamCreateOrConnectWithoutUserInput
    upsert?: TeamUpsertWithoutUserInput
    disconnect?: TeamWhereInput | boolean
    delete?: TeamWhereInput | boolean
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutUserInput, TeamUpdateWithoutUserInput>, TeamUncheckedUpdateWithoutUserInput>
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

  export type PowerUpUsageUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PowerUpUsageCreateWithoutUserInput, PowerUpUsageUncheckedCreateWithoutUserInput> | PowerUpUsageCreateWithoutUserInput[] | PowerUpUsageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PowerUpUsageCreateOrConnectWithoutUserInput | PowerUpUsageCreateOrConnectWithoutUserInput[]
    upsert?: PowerUpUsageUpsertWithWhereUniqueWithoutUserInput | PowerUpUsageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PowerUpUsageCreateManyUserInputEnvelope
    set?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    disconnect?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    delete?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    connect?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    update?: PowerUpUsageUpdateWithWhereUniqueWithoutUserInput | PowerUpUsageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PowerUpUsageUpdateManyWithWhereWithoutUserInput | PowerUpUsageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PowerUpUsageScalarWhereInput | PowerUpUsageScalarWhereInput[]
  }

  export type TeamCreateteamPlayersInput = {
    set: number[]
  }

  export type UserCreateNestedOneWithoutTeamInput = {
    create?: XOR<UserCreateWithoutTeamInput, UserUncheckedCreateWithoutTeamInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeamInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
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

  export type UserUpdateOneRequiredWithoutTeamNestedInput = {
    create?: XOR<UserCreateWithoutTeamInput, UserUncheckedCreateWithoutTeamInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeamInput
    upsert?: UserUpsertWithoutTeamInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTeamInput, UserUpdateWithoutTeamInput>, UserUncheckedUpdateWithoutTeamInput>
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

  export type FantasyLeagueMembershipUncheckedCreateNestedManyWithoutLeagueInput = {
    create?: XOR<FantasyLeagueMembershipCreateWithoutLeagueInput, FantasyLeagueMembershipUncheckedCreateWithoutLeagueInput> | FantasyLeagueMembershipCreateWithoutLeagueInput[] | FantasyLeagueMembershipUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: FantasyLeagueMembershipCreateOrConnectWithoutLeagueInput | FantasyLeagueMembershipCreateOrConnectWithoutLeagueInput[]
    createMany?: FantasyLeagueMembershipCreateManyLeagueInputEnvelope
    connect?: FantasyLeagueMembershipWhereUniqueInput | FantasyLeagueMembershipWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type FantasyLeagueUpdatewinnersArrayInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneRequiredWithoutOwnedLeaguesNestedInput = {
    create?: XOR<UserCreateWithoutOwnedLeaguesInput, UserUncheckedCreateWithoutOwnedLeaguesInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedLeaguesInput
    upsert?: UserUpsertWithoutOwnedLeaguesInput
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

  export type FantasyLeagueMembershipPowerUpCreateNestedManyWithoutFantasyLeagueMembershipInput = {
    create?: XOR<FantasyLeagueMembershipPowerUpCreateWithoutFantasyLeagueMembershipInput, FantasyLeagueMembershipPowerUpUncheckedCreateWithoutFantasyLeagueMembershipInput> | FantasyLeagueMembershipPowerUpCreateWithoutFantasyLeagueMembershipInput[] | FantasyLeagueMembershipPowerUpUncheckedCreateWithoutFantasyLeagueMembershipInput[]
    connectOrCreate?: FantasyLeagueMembershipPowerUpCreateOrConnectWithoutFantasyLeagueMembershipInput | FantasyLeagueMembershipPowerUpCreateOrConnectWithoutFantasyLeagueMembershipInput[]
    createMany?: FantasyLeagueMembershipPowerUpCreateManyFantasyLeagueMembershipInputEnvelope
    connect?: FantasyLeagueMembershipPowerUpWhereUniqueInput | FantasyLeagueMembershipPowerUpWhereUniqueInput[]
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

  export type FantasyLeagueMembershipPowerUpUncheckedCreateNestedManyWithoutFantasyLeagueMembershipInput = {
    create?: XOR<FantasyLeagueMembershipPowerUpCreateWithoutFantasyLeagueMembershipInput, FantasyLeagueMembershipPowerUpUncheckedCreateWithoutFantasyLeagueMembershipInput> | FantasyLeagueMembershipPowerUpCreateWithoutFantasyLeagueMembershipInput[] | FantasyLeagueMembershipPowerUpUncheckedCreateWithoutFantasyLeagueMembershipInput[]
    connectOrCreate?: FantasyLeagueMembershipPowerUpCreateOrConnectWithoutFantasyLeagueMembershipInput | FantasyLeagueMembershipPowerUpCreateOrConnectWithoutFantasyLeagueMembershipInput[]
    createMany?: FantasyLeagueMembershipPowerUpCreateManyFantasyLeagueMembershipInputEnvelope
    connect?: FantasyLeagueMembershipPowerUpWhereUniqueInput | FantasyLeagueMembershipPowerUpWhereUniqueInput[]
  }

  export type FantasyLeagueMembershipPowerUpUpdateManyWithoutFantasyLeagueMembershipNestedInput = {
    create?: XOR<FantasyLeagueMembershipPowerUpCreateWithoutFantasyLeagueMembershipInput, FantasyLeagueMembershipPowerUpUncheckedCreateWithoutFantasyLeagueMembershipInput> | FantasyLeagueMembershipPowerUpCreateWithoutFantasyLeagueMembershipInput[] | FantasyLeagueMembershipPowerUpUncheckedCreateWithoutFantasyLeagueMembershipInput[]
    connectOrCreate?: FantasyLeagueMembershipPowerUpCreateOrConnectWithoutFantasyLeagueMembershipInput | FantasyLeagueMembershipPowerUpCreateOrConnectWithoutFantasyLeagueMembershipInput[]
    upsert?: FantasyLeagueMembershipPowerUpUpsertWithWhereUniqueWithoutFantasyLeagueMembershipInput | FantasyLeagueMembershipPowerUpUpsertWithWhereUniqueWithoutFantasyLeagueMembershipInput[]
    createMany?: FantasyLeagueMembershipPowerUpCreateManyFantasyLeagueMembershipInputEnvelope
    set?: FantasyLeagueMembershipPowerUpWhereUniqueInput | FantasyLeagueMembershipPowerUpWhereUniqueInput[]
    disconnect?: FantasyLeagueMembershipPowerUpWhereUniqueInput | FantasyLeagueMembershipPowerUpWhereUniqueInput[]
    delete?: FantasyLeagueMembershipPowerUpWhereUniqueInput | FantasyLeagueMembershipPowerUpWhereUniqueInput[]
    connect?: FantasyLeagueMembershipPowerUpWhereUniqueInput | FantasyLeagueMembershipPowerUpWhereUniqueInput[]
    update?: FantasyLeagueMembershipPowerUpUpdateWithWhereUniqueWithoutFantasyLeagueMembershipInput | FantasyLeagueMembershipPowerUpUpdateWithWhereUniqueWithoutFantasyLeagueMembershipInput[]
    updateMany?: FantasyLeagueMembershipPowerUpUpdateManyWithWhereWithoutFantasyLeagueMembershipInput | FantasyLeagueMembershipPowerUpUpdateManyWithWhereWithoutFantasyLeagueMembershipInput[]
    deleteMany?: FantasyLeagueMembershipPowerUpScalarWhereInput | FantasyLeagueMembershipPowerUpScalarWhereInput[]
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

  export type FantasyLeagueMembershipPowerUpUncheckedUpdateManyWithoutFantasyLeagueMembershipNestedInput = {
    create?: XOR<FantasyLeagueMembershipPowerUpCreateWithoutFantasyLeagueMembershipInput, FantasyLeagueMembershipPowerUpUncheckedCreateWithoutFantasyLeagueMembershipInput> | FantasyLeagueMembershipPowerUpCreateWithoutFantasyLeagueMembershipInput[] | FantasyLeagueMembershipPowerUpUncheckedCreateWithoutFantasyLeagueMembershipInput[]
    connectOrCreate?: FantasyLeagueMembershipPowerUpCreateOrConnectWithoutFantasyLeagueMembershipInput | FantasyLeagueMembershipPowerUpCreateOrConnectWithoutFantasyLeagueMembershipInput[]
    upsert?: FantasyLeagueMembershipPowerUpUpsertWithWhereUniqueWithoutFantasyLeagueMembershipInput | FantasyLeagueMembershipPowerUpUpsertWithWhereUniqueWithoutFantasyLeagueMembershipInput[]
    createMany?: FantasyLeagueMembershipPowerUpCreateManyFantasyLeagueMembershipInputEnvelope
    set?: FantasyLeagueMembershipPowerUpWhereUniqueInput | FantasyLeagueMembershipPowerUpWhereUniqueInput[]
    disconnect?: FantasyLeagueMembershipPowerUpWhereUniqueInput | FantasyLeagueMembershipPowerUpWhereUniqueInput[]
    delete?: FantasyLeagueMembershipPowerUpWhereUniqueInput | FantasyLeagueMembershipPowerUpWhereUniqueInput[]
    connect?: FantasyLeagueMembershipPowerUpWhereUniqueInput | FantasyLeagueMembershipPowerUpWhereUniqueInput[]
    update?: FantasyLeagueMembershipPowerUpUpdateWithWhereUniqueWithoutFantasyLeagueMembershipInput | FantasyLeagueMembershipPowerUpUpdateWithWhereUniqueWithoutFantasyLeagueMembershipInput[]
    updateMany?: FantasyLeagueMembershipPowerUpUpdateManyWithWhereWithoutFantasyLeagueMembershipInput | FantasyLeagueMembershipPowerUpUpdateManyWithWhereWithoutFantasyLeagueMembershipInput[]
    deleteMany?: FantasyLeagueMembershipPowerUpScalarWhereInput | FantasyLeagueMembershipPowerUpScalarWhereInput[]
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

  export type PowerUpCategoryCreateNestedOneWithoutPowerUpsInput = {
    create?: XOR<PowerUpCategoryCreateWithoutPowerUpsInput, PowerUpCategoryUncheckedCreateWithoutPowerUpsInput>
    connectOrCreate?: PowerUpCategoryCreateOrConnectWithoutPowerUpsInput
    connect?: PowerUpCategoryWhereUniqueInput
  }

  export type PowerUpUsageCreateNestedManyWithoutPowerUpInput = {
    create?: XOR<PowerUpUsageCreateWithoutPowerUpInput, PowerUpUsageUncheckedCreateWithoutPowerUpInput> | PowerUpUsageCreateWithoutPowerUpInput[] | PowerUpUsageUncheckedCreateWithoutPowerUpInput[]
    connectOrCreate?: PowerUpUsageCreateOrConnectWithoutPowerUpInput | PowerUpUsageCreateOrConnectWithoutPowerUpInput[]
    createMany?: PowerUpUsageCreateManyPowerUpInputEnvelope
    connect?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
  }

  export type PowerUpUsageUncheckedCreateNestedManyWithoutPowerUpInput = {
    create?: XOR<PowerUpUsageCreateWithoutPowerUpInput, PowerUpUsageUncheckedCreateWithoutPowerUpInput> | PowerUpUsageCreateWithoutPowerUpInput[] | PowerUpUsageUncheckedCreateWithoutPowerUpInput[]
    connectOrCreate?: PowerUpUsageCreateOrConnectWithoutPowerUpInput | PowerUpUsageCreateOrConnectWithoutPowerUpInput[]
    createMany?: PowerUpUsageCreateManyPowerUpInputEnvelope
    connect?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
  }

  export type PowerUpCategoryUpdateOneWithoutPowerUpsNestedInput = {
    create?: XOR<PowerUpCategoryCreateWithoutPowerUpsInput, PowerUpCategoryUncheckedCreateWithoutPowerUpsInput>
    connectOrCreate?: PowerUpCategoryCreateOrConnectWithoutPowerUpsInput
    upsert?: PowerUpCategoryUpsertWithoutPowerUpsInput
    disconnect?: PowerUpCategoryWhereInput | boolean
    delete?: PowerUpCategoryWhereInput | boolean
    connect?: PowerUpCategoryWhereUniqueInput
    update?: XOR<XOR<PowerUpCategoryUpdateToOneWithWhereWithoutPowerUpsInput, PowerUpCategoryUpdateWithoutPowerUpsInput>, PowerUpCategoryUncheckedUpdateWithoutPowerUpsInput>
  }

  export type PowerUpUsageUpdateManyWithoutPowerUpNestedInput = {
    create?: XOR<PowerUpUsageCreateWithoutPowerUpInput, PowerUpUsageUncheckedCreateWithoutPowerUpInput> | PowerUpUsageCreateWithoutPowerUpInput[] | PowerUpUsageUncheckedCreateWithoutPowerUpInput[]
    connectOrCreate?: PowerUpUsageCreateOrConnectWithoutPowerUpInput | PowerUpUsageCreateOrConnectWithoutPowerUpInput[]
    upsert?: PowerUpUsageUpsertWithWhereUniqueWithoutPowerUpInput | PowerUpUsageUpsertWithWhereUniqueWithoutPowerUpInput[]
    createMany?: PowerUpUsageCreateManyPowerUpInputEnvelope
    set?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    disconnect?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    delete?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    connect?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    update?: PowerUpUsageUpdateWithWhereUniqueWithoutPowerUpInput | PowerUpUsageUpdateWithWhereUniqueWithoutPowerUpInput[]
    updateMany?: PowerUpUsageUpdateManyWithWhereWithoutPowerUpInput | PowerUpUsageUpdateManyWithWhereWithoutPowerUpInput[]
    deleteMany?: PowerUpUsageScalarWhereInput | PowerUpUsageScalarWhereInput[]
  }

  export type PowerUpUsageUncheckedUpdateManyWithoutPowerUpNestedInput = {
    create?: XOR<PowerUpUsageCreateWithoutPowerUpInput, PowerUpUsageUncheckedCreateWithoutPowerUpInput> | PowerUpUsageCreateWithoutPowerUpInput[] | PowerUpUsageUncheckedCreateWithoutPowerUpInput[]
    connectOrCreate?: PowerUpUsageCreateOrConnectWithoutPowerUpInput | PowerUpUsageCreateOrConnectWithoutPowerUpInput[]
    upsert?: PowerUpUsageUpsertWithWhereUniqueWithoutPowerUpInput | PowerUpUsageUpsertWithWhereUniqueWithoutPowerUpInput[]
    createMany?: PowerUpUsageCreateManyPowerUpInputEnvelope
    set?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    disconnect?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    delete?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    connect?: PowerUpUsageWhereUniqueInput | PowerUpUsageWhereUniqueInput[]
    update?: PowerUpUsageUpdateWithWhereUniqueWithoutPowerUpInput | PowerUpUsageUpdateWithWhereUniqueWithoutPowerUpInput[]
    updateMany?: PowerUpUsageUpdateManyWithWhereWithoutPowerUpInput | PowerUpUsageUpdateManyWithWhereWithoutPowerUpInput[]
    deleteMany?: PowerUpUsageScalarWhereInput | PowerUpUsageScalarWhereInput[]
  }

  export type PowerUpCreateNestedManyWithoutCategoryInput = {
    create?: XOR<PowerUpCreateWithoutCategoryInput, PowerUpUncheckedCreateWithoutCategoryInput> | PowerUpCreateWithoutCategoryInput[] | PowerUpUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PowerUpCreateOrConnectWithoutCategoryInput | PowerUpCreateOrConnectWithoutCategoryInput[]
    createMany?: PowerUpCreateManyCategoryInputEnvelope
    connect?: PowerUpWhereUniqueInput | PowerUpWhereUniqueInput[]
  }

  export type PowerUpUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<PowerUpCreateWithoutCategoryInput, PowerUpUncheckedCreateWithoutCategoryInput> | PowerUpCreateWithoutCategoryInput[] | PowerUpUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PowerUpCreateOrConnectWithoutCategoryInput | PowerUpCreateOrConnectWithoutCategoryInput[]
    createMany?: PowerUpCreateManyCategoryInputEnvelope
    connect?: PowerUpWhereUniqueInput | PowerUpWhereUniqueInput[]
  }

  export type PowerUpUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<PowerUpCreateWithoutCategoryInput, PowerUpUncheckedCreateWithoutCategoryInput> | PowerUpCreateWithoutCategoryInput[] | PowerUpUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PowerUpCreateOrConnectWithoutCategoryInput | PowerUpCreateOrConnectWithoutCategoryInput[]
    upsert?: PowerUpUpsertWithWhereUniqueWithoutCategoryInput | PowerUpUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: PowerUpCreateManyCategoryInputEnvelope
    set?: PowerUpWhereUniqueInput | PowerUpWhereUniqueInput[]
    disconnect?: PowerUpWhereUniqueInput | PowerUpWhereUniqueInput[]
    delete?: PowerUpWhereUniqueInput | PowerUpWhereUniqueInput[]
    connect?: PowerUpWhereUniqueInput | PowerUpWhereUniqueInput[]
    update?: PowerUpUpdateWithWhereUniqueWithoutCategoryInput | PowerUpUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: PowerUpUpdateManyWithWhereWithoutCategoryInput | PowerUpUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: PowerUpScalarWhereInput | PowerUpScalarWhereInput[]
  }

  export type PowerUpUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<PowerUpCreateWithoutCategoryInput, PowerUpUncheckedCreateWithoutCategoryInput> | PowerUpCreateWithoutCategoryInput[] | PowerUpUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: PowerUpCreateOrConnectWithoutCategoryInput | PowerUpCreateOrConnectWithoutCategoryInput[]
    upsert?: PowerUpUpsertWithWhereUniqueWithoutCategoryInput | PowerUpUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: PowerUpCreateManyCategoryInputEnvelope
    set?: PowerUpWhereUniqueInput | PowerUpWhereUniqueInput[]
    disconnect?: PowerUpWhereUniqueInput | PowerUpWhereUniqueInput[]
    delete?: PowerUpWhereUniqueInput | PowerUpWhereUniqueInput[]
    connect?: PowerUpWhereUniqueInput | PowerUpWhereUniqueInput[]
    update?: PowerUpUpdateWithWhereUniqueWithoutCategoryInput | PowerUpUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: PowerUpUpdateManyWithWhereWithoutCategoryInput | PowerUpUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: PowerUpScalarWhereInput | PowerUpScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPowerUpUsagesInput = {
    create?: XOR<UserCreateWithoutPowerUpUsagesInput, UserUncheckedCreateWithoutPowerUpUsagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPowerUpUsagesInput
    connect?: UserWhereUniqueInput
  }

  export type PowerUpCreateNestedOneWithoutPowerUpUsagesInput = {
    create?: XOR<PowerUpCreateWithoutPowerUpUsagesInput, PowerUpUncheckedCreateWithoutPowerUpUsagesInput>
    connectOrCreate?: PowerUpCreateOrConnectWithoutPowerUpUsagesInput
    connect?: PowerUpWhereUniqueInput
  }

  export type FantasyLeagueMembershipPowerUpCreateNestedOneWithoutPowerUpUsageInput = {
    create?: XOR<FantasyLeagueMembershipPowerUpCreateWithoutPowerUpUsageInput, FantasyLeagueMembershipPowerUpUncheckedCreateWithoutPowerUpUsageInput>
    connectOrCreate?: FantasyLeagueMembershipPowerUpCreateOrConnectWithoutPowerUpUsageInput
    connect?: FantasyLeagueMembershipPowerUpWhereUniqueInput
  }

  export type FantasyLeagueMembershipPowerUpUncheckedCreateNestedOneWithoutPowerUpUsageInput = {
    create?: XOR<FantasyLeagueMembershipPowerUpCreateWithoutPowerUpUsageInput, FantasyLeagueMembershipPowerUpUncheckedCreateWithoutPowerUpUsageInput>
    connectOrCreate?: FantasyLeagueMembershipPowerUpCreateOrConnectWithoutPowerUpUsageInput
    connect?: FantasyLeagueMembershipPowerUpWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPowerUpUsagesNestedInput = {
    create?: XOR<UserCreateWithoutPowerUpUsagesInput, UserUncheckedCreateWithoutPowerUpUsagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutPowerUpUsagesInput
    upsert?: UserUpsertWithoutPowerUpUsagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPowerUpUsagesInput, UserUpdateWithoutPowerUpUsagesInput>, UserUncheckedUpdateWithoutPowerUpUsagesInput>
  }

  export type PowerUpUpdateOneRequiredWithoutPowerUpUsagesNestedInput = {
    create?: XOR<PowerUpCreateWithoutPowerUpUsagesInput, PowerUpUncheckedCreateWithoutPowerUpUsagesInput>
    connectOrCreate?: PowerUpCreateOrConnectWithoutPowerUpUsagesInput
    upsert?: PowerUpUpsertWithoutPowerUpUsagesInput
    connect?: PowerUpWhereUniqueInput
    update?: XOR<XOR<PowerUpUpdateToOneWithWhereWithoutPowerUpUsagesInput, PowerUpUpdateWithoutPowerUpUsagesInput>, PowerUpUncheckedUpdateWithoutPowerUpUsagesInput>
  }

  export type FantasyLeagueMembershipPowerUpUpdateOneWithoutPowerUpUsageNestedInput = {
    create?: XOR<FantasyLeagueMembershipPowerUpCreateWithoutPowerUpUsageInput, FantasyLeagueMembershipPowerUpUncheckedCreateWithoutPowerUpUsageInput>
    connectOrCreate?: FantasyLeagueMembershipPowerUpCreateOrConnectWithoutPowerUpUsageInput
    upsert?: FantasyLeagueMembershipPowerUpUpsertWithoutPowerUpUsageInput
    disconnect?: FantasyLeagueMembershipPowerUpWhereInput | boolean
    delete?: FantasyLeagueMembershipPowerUpWhereInput | boolean
    connect?: FantasyLeagueMembershipPowerUpWhereUniqueInput
    update?: XOR<XOR<FantasyLeagueMembershipPowerUpUpdateToOneWithWhereWithoutPowerUpUsageInput, FantasyLeagueMembershipPowerUpUpdateWithoutPowerUpUsageInput>, FantasyLeagueMembershipPowerUpUncheckedUpdateWithoutPowerUpUsageInput>
  }

  export type FantasyLeagueMembershipPowerUpUncheckedUpdateOneWithoutPowerUpUsageNestedInput = {
    create?: XOR<FantasyLeagueMembershipPowerUpCreateWithoutPowerUpUsageInput, FantasyLeagueMembershipPowerUpUncheckedCreateWithoutPowerUpUsageInput>
    connectOrCreate?: FantasyLeagueMembershipPowerUpCreateOrConnectWithoutPowerUpUsageInput
    upsert?: FantasyLeagueMembershipPowerUpUpsertWithoutPowerUpUsageInput
    disconnect?: FantasyLeagueMembershipPowerUpWhereInput | boolean
    delete?: FantasyLeagueMembershipPowerUpWhereInput | boolean
    connect?: FantasyLeagueMembershipPowerUpWhereUniqueInput
    update?: XOR<XOR<FantasyLeagueMembershipPowerUpUpdateToOneWithWhereWithoutPowerUpUsageInput, FantasyLeagueMembershipPowerUpUpdateWithoutPowerUpUsageInput>, FantasyLeagueMembershipPowerUpUncheckedUpdateWithoutPowerUpUsageInput>
  }

  export type FantasyLeagueMembershipCreateNestedOneWithoutPowerUpsInput = {
    create?: XOR<FantasyLeagueMembershipCreateWithoutPowerUpsInput, FantasyLeagueMembershipUncheckedCreateWithoutPowerUpsInput>
    connectOrCreate?: FantasyLeagueMembershipCreateOrConnectWithoutPowerUpsInput
    connect?: FantasyLeagueMembershipWhereUniqueInput
  }

  export type PowerUpUsageCreateNestedOneWithoutLeagueMembershipPowerUpInput = {
    create?: XOR<PowerUpUsageCreateWithoutLeagueMembershipPowerUpInput, PowerUpUsageUncheckedCreateWithoutLeagueMembershipPowerUpInput>
    connectOrCreate?: PowerUpUsageCreateOrConnectWithoutLeagueMembershipPowerUpInput
    connect?: PowerUpUsageWhereUniqueInput
  }

  export type FantasyLeagueMembershipUpdateOneRequiredWithoutPowerUpsNestedInput = {
    create?: XOR<FantasyLeagueMembershipCreateWithoutPowerUpsInput, FantasyLeagueMembershipUncheckedCreateWithoutPowerUpsInput>
    connectOrCreate?: FantasyLeagueMembershipCreateOrConnectWithoutPowerUpsInput
    upsert?: FantasyLeagueMembershipUpsertWithoutPowerUpsInput
    connect?: FantasyLeagueMembershipWhereUniqueInput
    update?: XOR<XOR<FantasyLeagueMembershipUpdateToOneWithWhereWithoutPowerUpsInput, FantasyLeagueMembershipUpdateWithoutPowerUpsInput>, FantasyLeagueMembershipUncheckedUpdateWithoutPowerUpsInput>
  }

  export type PowerUpUsageUpdateOneRequiredWithoutLeagueMembershipPowerUpNestedInput = {
    create?: XOR<PowerUpUsageCreateWithoutLeagueMembershipPowerUpInput, PowerUpUsageUncheckedCreateWithoutLeagueMembershipPowerUpInput>
    connectOrCreate?: PowerUpUsageCreateOrConnectWithoutLeagueMembershipPowerUpInput
    upsert?: PowerUpUsageUpsertWithoutLeagueMembershipPowerUpInput
    connect?: PowerUpUsageWhereUniqueInput
    update?: XOR<XOR<PowerUpUsageUpdateToOneWithWhereWithoutLeagueMembershipPowerUpInput, PowerUpUsageUpdateWithoutLeagueMembershipPowerUpInput>, PowerUpUsageUncheckedUpdateWithoutLeagueMembershipPowerUpInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type TeamCreateWithoutUserInput = {
    id?: string
    teamValue?: number
    teamPlayers?: TeamCreateteamPlayersInput | number[]
    captainId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TeamUncheckedCreateWithoutUserInput = {
    id?: string
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

  export type FantasyLeagueMembershipCreateWithoutUserInput = {
    id?: string
    teamName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    powerUps?: FantasyLeagueMembershipPowerUpCreateNestedManyWithoutFantasyLeagueMembershipInput
    league: FantasyLeagueCreateNestedOneWithoutMembersInput
  }

  export type FantasyLeagueMembershipUncheckedCreateWithoutUserInput = {
    id?: string
    leagueId: string
    teamName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    powerUps?: FantasyLeagueMembershipPowerUpUncheckedCreateNestedManyWithoutFantasyLeagueMembershipInput
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
    stake: string
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    allowPowerUps: boolean
    description?: string | null
    code: string
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: FantasyLeagueMembershipCreateNestedManyWithoutLeagueInput
    gameweek: GameweekCreateNestedOneWithoutLeaguesInput
  }

  export type FantasyLeagueUncheckedCreateWithoutOwnerInput = {
    id?: string
    name: string
    stake: string
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    allowPowerUps: boolean
    description?: string | null
    code: string
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    gameweekId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: FantasyLeagueMembershipUncheckedCreateNestedManyWithoutLeagueInput
  }

  export type FantasyLeagueCreateOrConnectWithoutOwnerInput = {
    where: FantasyLeagueWhereUniqueInput
    create: XOR<FantasyLeagueCreateWithoutOwnerInput, FantasyLeagueUncheckedCreateWithoutOwnerInput>
  }

  export type FantasyLeagueCreateManyOwnerInputEnvelope = {
    data: FantasyLeagueCreateManyOwnerInput | FantasyLeagueCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type PowerUpUsageCreateWithoutUserInput = {
    id?: string
    transactionId: string
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    powerUp: PowerUpCreateNestedOneWithoutPowerUpUsagesInput
    leagueMembershipPowerUp?: FantasyLeagueMembershipPowerUpCreateNestedOneWithoutPowerUpUsageInput
  }

  export type PowerUpUsageUncheckedCreateWithoutUserInput = {
    id?: string
    powerUpId: string
    transactionId: string
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    leagueMembershipPowerUp?: FantasyLeagueMembershipPowerUpUncheckedCreateNestedOneWithoutPowerUpUsageInput
  }

  export type PowerUpUsageCreateOrConnectWithoutUserInput = {
    where: PowerUpUsageWhereUniqueInput
    create: XOR<PowerUpUsageCreateWithoutUserInput, PowerUpUsageUncheckedCreateWithoutUserInput>
  }

  export type PowerUpUsageCreateManyUserInputEnvelope = {
    data: PowerUpUsageCreateManyUserInput | PowerUpUsageCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TeamUpsertWithoutUserInput = {
    update: XOR<TeamUpdateWithoutUserInput, TeamUncheckedUpdateWithoutUserInput>
    create: XOR<TeamCreateWithoutUserInput, TeamUncheckedCreateWithoutUserInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutUserInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutUserInput, TeamUncheckedUpdateWithoutUserInput>
  }

  export type TeamUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamValue?: IntFieldUpdateOperationsInput | number
    teamPlayers?: TeamUpdateteamPlayersInput | number[]
    captainId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamValue?: IntFieldUpdateOperationsInput | number
    teamPlayers?: TeamUpdateteamPlayersInput | number[]
    captainId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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
    stake?: StringFilter<"FantasyLeague"> | string
    limit?: IntFilter<"FantasyLeague"> | number
    leagueType?: StringFilter<"FantasyLeague"> | string
    leagueMode?: StringFilter<"FantasyLeague"> | string
    winners?: IntFilter<"FantasyLeague"> | number
    allowPowerUps?: BoolFilter<"FantasyLeague"> | boolean
    description?: StringNullableFilter<"FantasyLeague"> | string | null
    code?: StringFilter<"FantasyLeague"> | string
    ownerId?: StringFilter<"FantasyLeague"> | string
    status?: StringFilter<"FantasyLeague"> | string
    winnersArray?: StringNullableListFilter<"FantasyLeague">
    gameweekId?: IntFilter<"FantasyLeague"> | number
    createdAt?: DateTimeFilter<"FantasyLeague"> | Date | string
    updatedAt?: DateTimeFilter<"FantasyLeague"> | Date | string
  }

  export type PowerUpUsageUpsertWithWhereUniqueWithoutUserInput = {
    where: PowerUpUsageWhereUniqueInput
    update: XOR<PowerUpUsageUpdateWithoutUserInput, PowerUpUsageUncheckedUpdateWithoutUserInput>
    create: XOR<PowerUpUsageCreateWithoutUserInput, PowerUpUsageUncheckedCreateWithoutUserInput>
  }

  export type PowerUpUsageUpdateWithWhereUniqueWithoutUserInput = {
    where: PowerUpUsageWhereUniqueInput
    data: XOR<PowerUpUsageUpdateWithoutUserInput, PowerUpUsageUncheckedUpdateWithoutUserInput>
  }

  export type PowerUpUsageUpdateManyWithWhereWithoutUserInput = {
    where: PowerUpUsageScalarWhereInput
    data: XOR<PowerUpUsageUpdateManyMutationInput, PowerUpUsageUncheckedUpdateManyWithoutUserInput>
  }

  export type PowerUpUsageScalarWhereInput = {
    AND?: PowerUpUsageScalarWhereInput | PowerUpUsageScalarWhereInput[]
    OR?: PowerUpUsageScalarWhereInput[]
    NOT?: PowerUpUsageScalarWhereInput | PowerUpUsageScalarWhereInput[]
    id?: StringFilter<"PowerUpUsage"> | string
    userId?: StringFilter<"PowerUpUsage"> | string
    powerUpId?: StringFilter<"PowerUpUsage"> | string
    transactionId?: StringFilter<"PowerUpUsage"> | string
    isVerified?: BoolFilter<"PowerUpUsage"> | boolean
    createdAt?: DateTimeFilter<"PowerUpUsage"> | Date | string
    updatedAt?: DateTimeFilter<"PowerUpUsage"> | Date | string
  }

  export type UserCreateWithoutTeamInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    leagues?: FantasyLeagueMembershipCreateNestedManyWithoutUserInput
    ownedLeagues?: FantasyLeagueCreateNestedManyWithoutOwnerInput
    powerUpUsages?: PowerUpUsageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTeamInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    leagues?: FantasyLeagueMembershipUncheckedCreateNestedManyWithoutUserInput
    ownedLeagues?: FantasyLeagueUncheckedCreateNestedManyWithoutOwnerInput
    powerUpUsages?: PowerUpUsageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTeamInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTeamInput, UserUncheckedCreateWithoutTeamInput>
  }

  export type UserUpsertWithoutTeamInput = {
    update: XOR<UserUpdateWithoutTeamInput, UserUncheckedUpdateWithoutTeamInput>
    create: XOR<UserCreateWithoutTeamInput, UserUncheckedCreateWithoutTeamInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTeamInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTeamInput, UserUncheckedUpdateWithoutTeamInput>
  }

  export type UserUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leagues?: FantasyLeagueMembershipUpdateManyWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUpdateManyWithoutOwnerNestedInput
    powerUpUsages?: PowerUpUsageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leagues?: FantasyLeagueMembershipUncheckedUpdateManyWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUncheckedUpdateManyWithoutOwnerNestedInput
    powerUpUsages?: PowerUpUsageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutOwnedLeaguesInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    team?: TeamCreateNestedOneWithoutUserInput
    leagues?: FantasyLeagueMembershipCreateNestedManyWithoutUserInput
    powerUpUsages?: PowerUpUsageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOwnedLeaguesInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    team?: TeamUncheckedCreateNestedOneWithoutUserInput
    leagues?: FantasyLeagueMembershipUncheckedCreateNestedManyWithoutUserInput
    powerUpUsages?: PowerUpUsageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOwnedLeaguesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOwnedLeaguesInput, UserUncheckedCreateWithoutOwnedLeaguesInput>
  }

  export type FantasyLeagueMembershipCreateWithoutLeagueInput = {
    id?: string
    teamName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    powerUps?: FantasyLeagueMembershipPowerUpCreateNestedManyWithoutFantasyLeagueMembershipInput
    user: UserCreateNestedOneWithoutLeaguesInput
  }

  export type FantasyLeagueMembershipUncheckedCreateWithoutLeagueInput = {
    id?: string
    userId: string
    teamName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    powerUps?: FantasyLeagueMembershipPowerUpUncheckedCreateNestedManyWithoutFantasyLeagueMembershipInput
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
  }

  export type GameweekUncheckedCreateWithoutLeaguesInput = {
    id: number
    deadline: Date | string
    isActive?: boolean
  }

  export type GameweekCreateOrConnectWithoutLeaguesInput = {
    where: GameweekWhereUniqueInput
    create: XOR<GameweekCreateWithoutLeaguesInput, GameweekUncheckedCreateWithoutLeaguesInput>
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUpdateOneWithoutUserNestedInput
    leagues?: FantasyLeagueMembershipUpdateManyWithoutUserNestedInput
    powerUpUsages?: PowerUpUsageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOwnedLeaguesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUncheckedUpdateOneWithoutUserNestedInput
    leagues?: FantasyLeagueMembershipUncheckedUpdateManyWithoutUserNestedInput
    powerUpUsages?: PowerUpUsageUncheckedUpdateManyWithoutUserNestedInput
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
  }

  export type GameweekUncheckedUpdateWithoutLeaguesInput = {
    id?: IntFieldUpdateOperationsInput | number
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type FantasyLeagueMembershipPowerUpCreateWithoutFantasyLeagueMembershipInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    powerUpUsage: PowerUpUsageCreateNestedOneWithoutLeagueMembershipPowerUpInput
  }

  export type FantasyLeagueMembershipPowerUpUncheckedCreateWithoutFantasyLeagueMembershipInput = {
    id?: string
    powerUpUsageId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueMembershipPowerUpCreateOrConnectWithoutFantasyLeagueMembershipInput = {
    where: FantasyLeagueMembershipPowerUpWhereUniqueInput
    create: XOR<FantasyLeagueMembershipPowerUpCreateWithoutFantasyLeagueMembershipInput, FantasyLeagueMembershipPowerUpUncheckedCreateWithoutFantasyLeagueMembershipInput>
  }

  export type FantasyLeagueMembershipPowerUpCreateManyFantasyLeagueMembershipInputEnvelope = {
    data: FantasyLeagueMembershipPowerUpCreateManyFantasyLeagueMembershipInput | FantasyLeagueMembershipPowerUpCreateManyFantasyLeagueMembershipInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutLeaguesInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    team?: TeamCreateNestedOneWithoutUserInput
    ownedLeagues?: FantasyLeagueCreateNestedManyWithoutOwnerInput
    powerUpUsages?: PowerUpUsageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLeaguesInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    team?: TeamUncheckedCreateNestedOneWithoutUserInput
    ownedLeagues?: FantasyLeagueUncheckedCreateNestedManyWithoutOwnerInput
    powerUpUsages?: PowerUpUsageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLeaguesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLeaguesInput, UserUncheckedCreateWithoutLeaguesInput>
  }

  export type FantasyLeagueCreateWithoutMembersInput = {
    id?: string
    name: string
    stake: string
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    allowPowerUps: boolean
    description?: string | null
    code: string
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutOwnedLeaguesInput
    gameweek: GameweekCreateNestedOneWithoutLeaguesInput
  }

  export type FantasyLeagueUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    stake: string
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    allowPowerUps: boolean
    description?: string | null
    code: string
    ownerId: string
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    gameweekId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueCreateOrConnectWithoutMembersInput = {
    where: FantasyLeagueWhereUniqueInput
    create: XOR<FantasyLeagueCreateWithoutMembersInput, FantasyLeagueUncheckedCreateWithoutMembersInput>
  }

  export type FantasyLeagueMembershipPowerUpUpsertWithWhereUniqueWithoutFantasyLeagueMembershipInput = {
    where: FantasyLeagueMembershipPowerUpWhereUniqueInput
    update: XOR<FantasyLeagueMembershipPowerUpUpdateWithoutFantasyLeagueMembershipInput, FantasyLeagueMembershipPowerUpUncheckedUpdateWithoutFantasyLeagueMembershipInput>
    create: XOR<FantasyLeagueMembershipPowerUpCreateWithoutFantasyLeagueMembershipInput, FantasyLeagueMembershipPowerUpUncheckedCreateWithoutFantasyLeagueMembershipInput>
  }

  export type FantasyLeagueMembershipPowerUpUpdateWithWhereUniqueWithoutFantasyLeagueMembershipInput = {
    where: FantasyLeagueMembershipPowerUpWhereUniqueInput
    data: XOR<FantasyLeagueMembershipPowerUpUpdateWithoutFantasyLeagueMembershipInput, FantasyLeagueMembershipPowerUpUncheckedUpdateWithoutFantasyLeagueMembershipInput>
  }

  export type FantasyLeagueMembershipPowerUpUpdateManyWithWhereWithoutFantasyLeagueMembershipInput = {
    where: FantasyLeagueMembershipPowerUpScalarWhereInput
    data: XOR<FantasyLeagueMembershipPowerUpUpdateManyMutationInput, FantasyLeagueMembershipPowerUpUncheckedUpdateManyWithoutFantasyLeagueMembershipInput>
  }

  export type FantasyLeagueMembershipPowerUpScalarWhereInput = {
    AND?: FantasyLeagueMembershipPowerUpScalarWhereInput | FantasyLeagueMembershipPowerUpScalarWhereInput[]
    OR?: FantasyLeagueMembershipPowerUpScalarWhereInput[]
    NOT?: FantasyLeagueMembershipPowerUpScalarWhereInput | FantasyLeagueMembershipPowerUpScalarWhereInput[]
    id?: StringFilter<"FantasyLeagueMembershipPowerUp"> | string
    fantasyLeagueMembershipId?: StringFilter<"FantasyLeagueMembershipPowerUp"> | string
    powerUpUsageId?: StringFilter<"FantasyLeagueMembershipPowerUp"> | string
    createdAt?: DateTimeFilter<"FantasyLeagueMembershipPowerUp"> | Date | string
    updatedAt?: DateTimeFilter<"FantasyLeagueMembershipPowerUp"> | Date | string
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
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUpdateOneWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUpdateManyWithoutOwnerNestedInput
    powerUpUsages?: PowerUpUsageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLeaguesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUncheckedUpdateOneWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUncheckedUpdateManyWithoutOwnerNestedInput
    powerUpUsages?: PowerUpUsageUncheckedUpdateManyWithoutUserNestedInput
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
    stake?: StringFieldUpdateOperationsInput | string
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    allowPowerUps?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutOwnedLeaguesNestedInput
    gameweek?: GameweekUpdateOneRequiredWithoutLeaguesNestedInput
  }

  export type FantasyLeagueUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stake?: StringFieldUpdateOperationsInput | string
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    allowPowerUps?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    gameweekId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueCreateWithoutGameweekInput = {
    id?: string
    name: string
    stake: string
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    allowPowerUps: boolean
    description?: string | null
    code: string
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutOwnedLeaguesInput
    members?: FantasyLeagueMembershipCreateNestedManyWithoutLeagueInput
  }

  export type FantasyLeagueUncheckedCreateWithoutGameweekInput = {
    id?: string
    name: string
    stake: string
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    allowPowerUps: boolean
    description?: string | null
    code: string
    ownerId: string
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: FantasyLeagueMembershipUncheckedCreateNestedManyWithoutLeagueInput
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

  export type PowerUpCategoryCreateWithoutPowerUpsInput = {
    id?: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PowerUpCategoryUncheckedCreateWithoutPowerUpsInput = {
    id?: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PowerUpCategoryCreateOrConnectWithoutPowerUpsInput = {
    where: PowerUpCategoryWhereUniqueInput
    create: XOR<PowerUpCategoryCreateWithoutPowerUpsInput, PowerUpCategoryUncheckedCreateWithoutPowerUpsInput>
  }

  export type PowerUpUsageCreateWithoutPowerUpInput = {
    id?: string
    transactionId: string
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPowerUpUsagesInput
    leagueMembershipPowerUp?: FantasyLeagueMembershipPowerUpCreateNestedOneWithoutPowerUpUsageInput
  }

  export type PowerUpUsageUncheckedCreateWithoutPowerUpInput = {
    id?: string
    userId: string
    transactionId: string
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    leagueMembershipPowerUp?: FantasyLeagueMembershipPowerUpUncheckedCreateNestedOneWithoutPowerUpUsageInput
  }

  export type PowerUpUsageCreateOrConnectWithoutPowerUpInput = {
    where: PowerUpUsageWhereUniqueInput
    create: XOR<PowerUpUsageCreateWithoutPowerUpInput, PowerUpUsageUncheckedCreateWithoutPowerUpInput>
  }

  export type PowerUpUsageCreateManyPowerUpInputEnvelope = {
    data: PowerUpUsageCreateManyPowerUpInput | PowerUpUsageCreateManyPowerUpInput[]
    skipDuplicates?: boolean
  }

  export type PowerUpCategoryUpsertWithoutPowerUpsInput = {
    update: XOR<PowerUpCategoryUpdateWithoutPowerUpsInput, PowerUpCategoryUncheckedUpdateWithoutPowerUpsInput>
    create: XOR<PowerUpCategoryCreateWithoutPowerUpsInput, PowerUpCategoryUncheckedCreateWithoutPowerUpsInput>
    where?: PowerUpCategoryWhereInput
  }

  export type PowerUpCategoryUpdateToOneWithWhereWithoutPowerUpsInput = {
    where?: PowerUpCategoryWhereInput
    data: XOR<PowerUpCategoryUpdateWithoutPowerUpsInput, PowerUpCategoryUncheckedUpdateWithoutPowerUpsInput>
  }

  export type PowerUpCategoryUpdateWithoutPowerUpsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PowerUpCategoryUncheckedUpdateWithoutPowerUpsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PowerUpUsageUpsertWithWhereUniqueWithoutPowerUpInput = {
    where: PowerUpUsageWhereUniqueInput
    update: XOR<PowerUpUsageUpdateWithoutPowerUpInput, PowerUpUsageUncheckedUpdateWithoutPowerUpInput>
    create: XOR<PowerUpUsageCreateWithoutPowerUpInput, PowerUpUsageUncheckedCreateWithoutPowerUpInput>
  }

  export type PowerUpUsageUpdateWithWhereUniqueWithoutPowerUpInput = {
    where: PowerUpUsageWhereUniqueInput
    data: XOR<PowerUpUsageUpdateWithoutPowerUpInput, PowerUpUsageUncheckedUpdateWithoutPowerUpInput>
  }

  export type PowerUpUsageUpdateManyWithWhereWithoutPowerUpInput = {
    where: PowerUpUsageScalarWhereInput
    data: XOR<PowerUpUsageUpdateManyMutationInput, PowerUpUsageUncheckedUpdateManyWithoutPowerUpInput>
  }

  export type PowerUpCreateWithoutCategoryInput = {
    id?: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    powerUpUsages?: PowerUpUsageCreateNestedManyWithoutPowerUpInput
  }

  export type PowerUpUncheckedCreateWithoutCategoryInput = {
    id?: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    powerUpUsages?: PowerUpUsageUncheckedCreateNestedManyWithoutPowerUpInput
  }

  export type PowerUpCreateOrConnectWithoutCategoryInput = {
    where: PowerUpWhereUniqueInput
    create: XOR<PowerUpCreateWithoutCategoryInput, PowerUpUncheckedCreateWithoutCategoryInput>
  }

  export type PowerUpCreateManyCategoryInputEnvelope = {
    data: PowerUpCreateManyCategoryInput | PowerUpCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type PowerUpUpsertWithWhereUniqueWithoutCategoryInput = {
    where: PowerUpWhereUniqueInput
    update: XOR<PowerUpUpdateWithoutCategoryInput, PowerUpUncheckedUpdateWithoutCategoryInput>
    create: XOR<PowerUpCreateWithoutCategoryInput, PowerUpUncheckedCreateWithoutCategoryInput>
  }

  export type PowerUpUpdateWithWhereUniqueWithoutCategoryInput = {
    where: PowerUpWhereUniqueInput
    data: XOR<PowerUpUpdateWithoutCategoryInput, PowerUpUncheckedUpdateWithoutCategoryInput>
  }

  export type PowerUpUpdateManyWithWhereWithoutCategoryInput = {
    where: PowerUpScalarWhereInput
    data: XOR<PowerUpUpdateManyMutationInput, PowerUpUncheckedUpdateManyWithoutCategoryInput>
  }

  export type PowerUpScalarWhereInput = {
    AND?: PowerUpScalarWhereInput | PowerUpScalarWhereInput[]
    OR?: PowerUpScalarWhereInput[]
    NOT?: PowerUpScalarWhereInput | PowerUpScalarWhereInput[]
    id?: StringFilter<"PowerUp"> | string
    name?: StringFilter<"PowerUp"> | string
    description?: StringFilter<"PowerUp"> | string
    categoryId?: StringNullableFilter<"PowerUp"> | string | null
    createdAt?: DateTimeFilter<"PowerUp"> | Date | string
    updatedAt?: DateTimeFilter<"PowerUp"> | Date | string
  }

  export type UserCreateWithoutPowerUpUsagesInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    team?: TeamCreateNestedOneWithoutUserInput
    leagues?: FantasyLeagueMembershipCreateNestedManyWithoutUserInput
    ownedLeagues?: FantasyLeagueCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutPowerUpUsagesInput = {
    id?: string
    email: string
    createdAt?: Date | string
    updatedAt?: Date | string
    team?: TeamUncheckedCreateNestedOneWithoutUserInput
    leagues?: FantasyLeagueMembershipUncheckedCreateNestedManyWithoutUserInput
    ownedLeagues?: FantasyLeagueUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutPowerUpUsagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPowerUpUsagesInput, UserUncheckedCreateWithoutPowerUpUsagesInput>
  }

  export type PowerUpCreateWithoutPowerUpUsagesInput = {
    id?: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
    category?: PowerUpCategoryCreateNestedOneWithoutPowerUpsInput
  }

  export type PowerUpUncheckedCreateWithoutPowerUpUsagesInput = {
    id?: string
    name: string
    description: string
    categoryId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PowerUpCreateOrConnectWithoutPowerUpUsagesInput = {
    where: PowerUpWhereUniqueInput
    create: XOR<PowerUpCreateWithoutPowerUpUsagesInput, PowerUpUncheckedCreateWithoutPowerUpUsagesInput>
  }

  export type FantasyLeagueMembershipPowerUpCreateWithoutPowerUpUsageInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    fantasyLeagueMembership: FantasyLeagueMembershipCreateNestedOneWithoutPowerUpsInput
  }

  export type FantasyLeagueMembershipPowerUpUncheckedCreateWithoutPowerUpUsageInput = {
    id?: string
    fantasyLeagueMembershipId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueMembershipPowerUpCreateOrConnectWithoutPowerUpUsageInput = {
    where: FantasyLeagueMembershipPowerUpWhereUniqueInput
    create: XOR<FantasyLeagueMembershipPowerUpCreateWithoutPowerUpUsageInput, FantasyLeagueMembershipPowerUpUncheckedCreateWithoutPowerUpUsageInput>
  }

  export type UserUpsertWithoutPowerUpUsagesInput = {
    update: XOR<UserUpdateWithoutPowerUpUsagesInput, UserUncheckedUpdateWithoutPowerUpUsagesInput>
    create: XOR<UserCreateWithoutPowerUpUsagesInput, UserUncheckedCreateWithoutPowerUpUsagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPowerUpUsagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPowerUpUsagesInput, UserUncheckedUpdateWithoutPowerUpUsagesInput>
  }

  export type UserUpdateWithoutPowerUpUsagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUpdateOneWithoutUserNestedInput
    leagues?: FantasyLeagueMembershipUpdateManyWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutPowerUpUsagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUncheckedUpdateOneWithoutUserNestedInput
    leagues?: FantasyLeagueMembershipUncheckedUpdateManyWithoutUserNestedInput
    ownedLeagues?: FantasyLeagueUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type PowerUpUpsertWithoutPowerUpUsagesInput = {
    update: XOR<PowerUpUpdateWithoutPowerUpUsagesInput, PowerUpUncheckedUpdateWithoutPowerUpUsagesInput>
    create: XOR<PowerUpCreateWithoutPowerUpUsagesInput, PowerUpUncheckedCreateWithoutPowerUpUsagesInput>
    where?: PowerUpWhereInput
  }

  export type PowerUpUpdateToOneWithWhereWithoutPowerUpUsagesInput = {
    where?: PowerUpWhereInput
    data: XOR<PowerUpUpdateWithoutPowerUpUsagesInput, PowerUpUncheckedUpdateWithoutPowerUpUsagesInput>
  }

  export type PowerUpUpdateWithoutPowerUpUsagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: PowerUpCategoryUpdateOneWithoutPowerUpsNestedInput
  }

  export type PowerUpUncheckedUpdateWithoutPowerUpUsagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipPowerUpUpsertWithoutPowerUpUsageInput = {
    update: XOR<FantasyLeagueMembershipPowerUpUpdateWithoutPowerUpUsageInput, FantasyLeagueMembershipPowerUpUncheckedUpdateWithoutPowerUpUsageInput>
    create: XOR<FantasyLeagueMembershipPowerUpCreateWithoutPowerUpUsageInput, FantasyLeagueMembershipPowerUpUncheckedCreateWithoutPowerUpUsageInput>
    where?: FantasyLeagueMembershipPowerUpWhereInput
  }

  export type FantasyLeagueMembershipPowerUpUpdateToOneWithWhereWithoutPowerUpUsageInput = {
    where?: FantasyLeagueMembershipPowerUpWhereInput
    data: XOR<FantasyLeagueMembershipPowerUpUpdateWithoutPowerUpUsageInput, FantasyLeagueMembershipPowerUpUncheckedUpdateWithoutPowerUpUsageInput>
  }

  export type FantasyLeagueMembershipPowerUpUpdateWithoutPowerUpUsageInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fantasyLeagueMembership?: FantasyLeagueMembershipUpdateOneRequiredWithoutPowerUpsNestedInput
  }

  export type FantasyLeagueMembershipPowerUpUncheckedUpdateWithoutPowerUpUsageInput = {
    id?: StringFieldUpdateOperationsInput | string
    fantasyLeagueMembershipId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipCreateWithoutPowerUpsInput = {
    id?: string
    teamName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutLeaguesInput
    league: FantasyLeagueCreateNestedOneWithoutMembersInput
  }

  export type FantasyLeagueMembershipUncheckedCreateWithoutPowerUpsInput = {
    id?: string
    userId: string
    leagueId: string
    teamName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueMembershipCreateOrConnectWithoutPowerUpsInput = {
    where: FantasyLeagueMembershipWhereUniqueInput
    create: XOR<FantasyLeagueMembershipCreateWithoutPowerUpsInput, FantasyLeagueMembershipUncheckedCreateWithoutPowerUpsInput>
  }

  export type PowerUpUsageCreateWithoutLeagueMembershipPowerUpInput = {
    id?: string
    transactionId: string
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPowerUpUsagesInput
    powerUp: PowerUpCreateNestedOneWithoutPowerUpUsagesInput
  }

  export type PowerUpUsageUncheckedCreateWithoutLeagueMembershipPowerUpInput = {
    id?: string
    userId: string
    powerUpId: string
    transactionId: string
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PowerUpUsageCreateOrConnectWithoutLeagueMembershipPowerUpInput = {
    where: PowerUpUsageWhereUniqueInput
    create: XOR<PowerUpUsageCreateWithoutLeagueMembershipPowerUpInput, PowerUpUsageUncheckedCreateWithoutLeagueMembershipPowerUpInput>
  }

  export type FantasyLeagueMembershipUpsertWithoutPowerUpsInput = {
    update: XOR<FantasyLeagueMembershipUpdateWithoutPowerUpsInput, FantasyLeagueMembershipUncheckedUpdateWithoutPowerUpsInput>
    create: XOR<FantasyLeagueMembershipCreateWithoutPowerUpsInput, FantasyLeagueMembershipUncheckedCreateWithoutPowerUpsInput>
    where?: FantasyLeagueMembershipWhereInput
  }

  export type FantasyLeagueMembershipUpdateToOneWithWhereWithoutPowerUpsInput = {
    where?: FantasyLeagueMembershipWhereInput
    data: XOR<FantasyLeagueMembershipUpdateWithoutPowerUpsInput, FantasyLeagueMembershipUncheckedUpdateWithoutPowerUpsInput>
  }

  export type FantasyLeagueMembershipUpdateWithoutPowerUpsInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLeaguesNestedInput
    league?: FantasyLeagueUpdateOneRequiredWithoutMembersNestedInput
  }

  export type FantasyLeagueMembershipUncheckedUpdateWithoutPowerUpsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PowerUpUsageUpsertWithoutLeagueMembershipPowerUpInput = {
    update: XOR<PowerUpUsageUpdateWithoutLeagueMembershipPowerUpInput, PowerUpUsageUncheckedUpdateWithoutLeagueMembershipPowerUpInput>
    create: XOR<PowerUpUsageCreateWithoutLeagueMembershipPowerUpInput, PowerUpUsageUncheckedCreateWithoutLeagueMembershipPowerUpInput>
    where?: PowerUpUsageWhereInput
  }

  export type PowerUpUsageUpdateToOneWithWhereWithoutLeagueMembershipPowerUpInput = {
    where?: PowerUpUsageWhereInput
    data: XOR<PowerUpUsageUpdateWithoutLeagueMembershipPowerUpInput, PowerUpUsageUncheckedUpdateWithoutLeagueMembershipPowerUpInput>
  }

  export type PowerUpUsageUpdateWithoutLeagueMembershipPowerUpInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPowerUpUsagesNestedInput
    powerUp?: PowerUpUpdateOneRequiredWithoutPowerUpUsagesNestedInput
  }

  export type PowerUpUsageUncheckedUpdateWithoutLeagueMembershipPowerUpInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    powerUpId?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipCreateManyUserInput = {
    id?: string
    leagueId: string
    teamName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueCreateManyOwnerInput = {
    id?: string
    name: string
    stake: string
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    allowPowerUps: boolean
    description?: string | null
    code: string
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    gameweekId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PowerUpUsageCreateManyUserInput = {
    id?: string
    powerUpId: string
    transactionId: string
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueMembershipUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    powerUps?: FantasyLeagueMembershipPowerUpUpdateManyWithoutFantasyLeagueMembershipNestedInput
    league?: FantasyLeagueUpdateOneRequiredWithoutMembersNestedInput
  }

  export type FantasyLeagueMembershipUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    powerUps?: FantasyLeagueMembershipPowerUpUncheckedUpdateManyWithoutFantasyLeagueMembershipNestedInput
  }

  export type FantasyLeagueMembershipUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stake?: StringFieldUpdateOperationsInput | string
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    allowPowerUps?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: FantasyLeagueMembershipUpdateManyWithoutLeagueNestedInput
    gameweek?: GameweekUpdateOneRequiredWithoutLeaguesNestedInput
  }

  export type FantasyLeagueUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stake?: StringFieldUpdateOperationsInput | string
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    allowPowerUps?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    gameweekId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: FantasyLeagueMembershipUncheckedUpdateManyWithoutLeagueNestedInput
  }

  export type FantasyLeagueUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stake?: StringFieldUpdateOperationsInput | string
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    allowPowerUps?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    gameweekId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PowerUpUsageUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    powerUp?: PowerUpUpdateOneRequiredWithoutPowerUpUsagesNestedInput
    leagueMembershipPowerUp?: FantasyLeagueMembershipPowerUpUpdateOneWithoutPowerUpUsageNestedInput
  }

  export type PowerUpUsageUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    powerUpId?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leagueMembershipPowerUp?: FantasyLeagueMembershipPowerUpUncheckedUpdateOneWithoutPowerUpUsageNestedInput
  }

  export type PowerUpUsageUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    powerUpId?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipCreateManyLeagueInput = {
    id?: string
    userId: string
    teamName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueMembershipUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    powerUps?: FantasyLeagueMembershipPowerUpUpdateManyWithoutFantasyLeagueMembershipNestedInput
    user?: UserUpdateOneRequiredWithoutLeaguesNestedInput
  }

  export type FantasyLeagueMembershipUncheckedUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    powerUps?: FantasyLeagueMembershipPowerUpUncheckedUpdateManyWithoutFantasyLeagueMembershipNestedInput
  }

  export type FantasyLeagueMembershipUncheckedUpdateManyWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    teamName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipPowerUpCreateManyFantasyLeagueMembershipInput = {
    id?: string
    powerUpUsageId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueMembershipPowerUpUpdateWithoutFantasyLeagueMembershipInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    powerUpUsage?: PowerUpUsageUpdateOneRequiredWithoutLeagueMembershipPowerUpNestedInput
  }

  export type FantasyLeagueMembershipPowerUpUncheckedUpdateWithoutFantasyLeagueMembershipInput = {
    id?: StringFieldUpdateOperationsInput | string
    powerUpUsageId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueMembershipPowerUpUncheckedUpdateManyWithoutFantasyLeagueMembershipInput = {
    id?: StringFieldUpdateOperationsInput | string
    powerUpUsageId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FantasyLeagueCreateManyGameweekInput = {
    id?: string
    name: string
    stake: string
    limit: number
    leagueType: string
    leagueMode: string
    winners: number
    allowPowerUps: boolean
    description?: string | null
    code: string
    ownerId: string
    status?: string
    winnersArray?: FantasyLeagueCreatewinnersArrayInput | string[]
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FantasyLeagueUpdateWithoutGameweekInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stake?: StringFieldUpdateOperationsInput | string
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    allowPowerUps?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutOwnedLeaguesNestedInput
    members?: FantasyLeagueMembershipUpdateManyWithoutLeagueNestedInput
  }

  export type FantasyLeagueUncheckedUpdateWithoutGameweekInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stake?: StringFieldUpdateOperationsInput | string
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    allowPowerUps?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: FantasyLeagueMembershipUncheckedUpdateManyWithoutLeagueNestedInput
  }

  export type FantasyLeagueUncheckedUpdateManyWithoutGameweekInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    stake?: StringFieldUpdateOperationsInput | string
    limit?: IntFieldUpdateOperationsInput | number
    leagueType?: StringFieldUpdateOperationsInput | string
    leagueMode?: StringFieldUpdateOperationsInput | string
    winners?: IntFieldUpdateOperationsInput | number
    allowPowerUps?: BoolFieldUpdateOperationsInput | boolean
    description?: NullableStringFieldUpdateOperationsInput | string | null
    code?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    winnersArray?: FantasyLeagueUpdatewinnersArrayInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PowerUpUsageCreateManyPowerUpInput = {
    id?: string
    userId: string
    transactionId: string
    isVerified?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PowerUpUsageUpdateWithoutPowerUpInput = {
    id?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPowerUpUsagesNestedInput
    leagueMembershipPowerUp?: FantasyLeagueMembershipPowerUpUpdateOneWithoutPowerUpUsageNestedInput
  }

  export type PowerUpUsageUncheckedUpdateWithoutPowerUpInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leagueMembershipPowerUp?: FantasyLeagueMembershipPowerUpUncheckedUpdateOneWithoutPowerUpUsageNestedInput
  }

  export type PowerUpUsageUncheckedUpdateManyWithoutPowerUpInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    transactionId?: StringFieldUpdateOperationsInput | string
    isVerified?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PowerUpCreateManyCategoryInput = {
    id?: string
    name: string
    description: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PowerUpUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    powerUpUsages?: PowerUpUsageUpdateManyWithoutPowerUpNestedInput
  }

  export type PowerUpUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    powerUpUsages?: PowerUpUsageUncheckedUpdateManyWithoutPowerUpNestedInput
  }

  export type PowerUpUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
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