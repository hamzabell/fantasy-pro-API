import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadGetterTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function storeTupleDeploy(source: Deploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadGetterTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function storeTupleDeployOk(source: DeployOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type CreateLeague = {
    $$type: 'CreateLeague';
    leagueId: string;
    userId: string;
    commissionPercentage: bigint;
    feeAmount: bigint;
    initialStake: bigint;
}

export function storeCreateLeague(src: CreateLeague) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3598845671, 32);
        b_0.storeStringRefTail(src.leagueId);
        b_0.storeStringRefTail(src.userId);
        b_0.storeUint(src.commissionPercentage, 64);
        b_0.storeCoins(src.feeAmount);
        b_0.storeCoins(src.initialStake);
    };
}

export function loadCreateLeague(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3598845671) { throw Error('Invalid prefix'); }
    const _leagueId = sc_0.loadStringRefTail();
    const _userId = sc_0.loadStringRefTail();
    const _commissionPercentage = sc_0.loadUintBig(64);
    const _feeAmount = sc_0.loadCoins();
    const _initialStake = sc_0.loadCoins();
    return { $$type: 'CreateLeague' as const, leagueId: _leagueId, userId: _userId, commissionPercentage: _commissionPercentage, feeAmount: _feeAmount, initialStake: _initialStake };
}

export function loadTupleCreateLeague(source: TupleReader) {
    const _leagueId = source.readString();
    const _userId = source.readString();
    const _commissionPercentage = source.readBigNumber();
    const _feeAmount = source.readBigNumber();
    const _initialStake = source.readBigNumber();
    return { $$type: 'CreateLeague' as const, leagueId: _leagueId, userId: _userId, commissionPercentage: _commissionPercentage, feeAmount: _feeAmount, initialStake: _initialStake };
}

export function loadGetterTupleCreateLeague(source: TupleReader) {
    const _leagueId = source.readString();
    const _userId = source.readString();
    const _commissionPercentage = source.readBigNumber();
    const _feeAmount = source.readBigNumber();
    const _initialStake = source.readBigNumber();
    return { $$type: 'CreateLeague' as const, leagueId: _leagueId, userId: _userId, commissionPercentage: _commissionPercentage, feeAmount: _feeAmount, initialStake: _initialStake };
}

export function storeTupleCreateLeague(source: CreateLeague) {
    const builder = new TupleBuilder();
    builder.writeString(source.leagueId);
    builder.writeString(source.userId);
    builder.writeNumber(source.commissionPercentage);
    builder.writeNumber(source.feeAmount);
    builder.writeNumber(source.initialStake);
    return builder.build();
}

export function dictValueParserCreateLeague(): DictionaryValue<CreateLeague> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCreateLeague(src)).endCell());
        },
        parse: (src) => {
            return loadCreateLeague(src.loadRef().beginParse());
        }
    }
}

export type Stake = {
    $$type: 'Stake';
    leagueId: string;
    userId: string;
    amount: bigint;
}

export function storeStake(src: Stake) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1454696319, 32);
        b_0.storeStringRefTail(src.leagueId);
        b_0.storeStringRefTail(src.userId);
        b_0.storeCoins(src.amount);
    };
}

export function loadStake(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1454696319) { throw Error('Invalid prefix'); }
    const _leagueId = sc_0.loadStringRefTail();
    const _userId = sc_0.loadStringRefTail();
    const _amount = sc_0.loadCoins();
    return { $$type: 'Stake' as const, leagueId: _leagueId, userId: _userId, amount: _amount };
}

export function loadTupleStake(source: TupleReader) {
    const _leagueId = source.readString();
    const _userId = source.readString();
    const _amount = source.readBigNumber();
    return { $$type: 'Stake' as const, leagueId: _leagueId, userId: _userId, amount: _amount };
}

export function loadGetterTupleStake(source: TupleReader) {
    const _leagueId = source.readString();
    const _userId = source.readString();
    const _amount = source.readBigNumber();
    return { $$type: 'Stake' as const, leagueId: _leagueId, userId: _userId, amount: _amount };
}

export function storeTupleStake(source: Stake) {
    const builder = new TupleBuilder();
    builder.writeString(source.leagueId);
    builder.writeString(source.userId);
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserStake(): DictionaryValue<Stake> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStake(src)).endCell());
        },
        parse: (src) => {
            return loadStake(src.loadRef().beginParse());
        }
    }
}

export type CreatePublicLeague = {
    $$type: 'CreatePublicLeague';
    leagueId: string;
    commissionPercentage: bigint;
    feeAmount: bigint;
}

export function storeCreatePublicLeague(src: CreatePublicLeague) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1462801691, 32);
        b_0.storeStringRefTail(src.leagueId);
        b_0.storeUint(src.commissionPercentage, 64);
        b_0.storeCoins(src.feeAmount);
    };
}

export function loadCreatePublicLeague(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1462801691) { throw Error('Invalid prefix'); }
    const _leagueId = sc_0.loadStringRefTail();
    const _commissionPercentage = sc_0.loadUintBig(64);
    const _feeAmount = sc_0.loadCoins();
    return { $$type: 'CreatePublicLeague' as const, leagueId: _leagueId, commissionPercentage: _commissionPercentage, feeAmount: _feeAmount };
}

export function loadTupleCreatePublicLeague(source: TupleReader) {
    const _leagueId = source.readString();
    const _commissionPercentage = source.readBigNumber();
    const _feeAmount = source.readBigNumber();
    return { $$type: 'CreatePublicLeague' as const, leagueId: _leagueId, commissionPercentage: _commissionPercentage, feeAmount: _feeAmount };
}

export function loadGetterTupleCreatePublicLeague(source: TupleReader) {
    const _leagueId = source.readString();
    const _commissionPercentage = source.readBigNumber();
    const _feeAmount = source.readBigNumber();
    return { $$type: 'CreatePublicLeague' as const, leagueId: _leagueId, commissionPercentage: _commissionPercentage, feeAmount: _feeAmount };
}

export function storeTupleCreatePublicLeague(source: CreatePublicLeague) {
    const builder = new TupleBuilder();
    builder.writeString(source.leagueId);
    builder.writeNumber(source.commissionPercentage);
    builder.writeNumber(source.feeAmount);
    return builder.build();
}

export function dictValueParserCreatePublicLeague(): DictionaryValue<CreatePublicLeague> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCreatePublicLeague(src)).endCell());
        },
        parse: (src) => {
            return loadCreatePublicLeague(src.loadRef().beginParse());
        }
    }
}

export type PayoutWinners = {
    $$type: 'PayoutWinners';
    leagueId: string;
    winningPercentages: Dictionary<bigint, bigint>;
    winners: Dictionary<bigint, Address>;
    count: bigint;
    commissionPercentage: bigint;
}

export function storePayoutWinners(src: PayoutWinners) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2704136465, 32);
        b_0.storeStringRefTail(src.leagueId);
        b_0.storeDict(src.winningPercentages, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
        b_0.storeDict(src.winners, Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
        b_0.storeUint(src.count, 8);
        b_0.storeUint(src.commissionPercentage, 64);
    };
}

export function loadPayoutWinners(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2704136465) { throw Error('Invalid prefix'); }
    const _leagueId = sc_0.loadStringRefTail();
    const _winningPercentages = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_0);
    const _winners = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), sc_0);
    const _count = sc_0.loadUintBig(8);
    const _commissionPercentage = sc_0.loadUintBig(64);
    return { $$type: 'PayoutWinners' as const, leagueId: _leagueId, winningPercentages: _winningPercentages, winners: _winners, count: _count, commissionPercentage: _commissionPercentage };
}

export function loadTuplePayoutWinners(source: TupleReader) {
    const _leagueId = source.readString();
    const _winningPercentages = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _winners = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    const _count = source.readBigNumber();
    const _commissionPercentage = source.readBigNumber();
    return { $$type: 'PayoutWinners' as const, leagueId: _leagueId, winningPercentages: _winningPercentages, winners: _winners, count: _count, commissionPercentage: _commissionPercentage };
}

export function loadGetterTuplePayoutWinners(source: TupleReader) {
    const _leagueId = source.readString();
    const _winningPercentages = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _winners = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    const _count = source.readBigNumber();
    const _commissionPercentage = source.readBigNumber();
    return { $$type: 'PayoutWinners' as const, leagueId: _leagueId, winningPercentages: _winningPercentages, winners: _winners, count: _count, commissionPercentage: _commissionPercentage };
}

export function storeTuplePayoutWinners(source: PayoutWinners) {
    const builder = new TupleBuilder();
    builder.writeString(source.leagueId);
    builder.writeCell(source.winningPercentages.size > 0 ? beginCell().storeDictDirect(source.winningPercentages, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeCell(source.winners.size > 0 ? beginCell().storeDictDirect(source.winners, Dictionary.Keys.BigInt(257), Dictionary.Values.Address()).endCell() : null);
    builder.writeNumber(source.count);
    builder.writeNumber(source.commissionPercentage);
    return builder.build();
}

export function dictValueParserPayoutWinners(): DictionaryValue<PayoutWinners> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePayoutWinners(src)).endCell());
        },
        parse: (src) => {
            return loadPayoutWinners(src.loadRef().beginParse());
        }
    }
}

export type PayoutItem = {
    $$type: 'PayoutItem';
    leagueId: string;
    winningPercentages: Dictionary<bigint, bigint>;
    winners: Dictionary<bigint, Address>;
    count: bigint;
    commissionPercentage: bigint;
}

export function storePayoutItem(src: PayoutItem) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeStringRefTail(src.leagueId);
        b_0.storeDict(src.winningPercentages, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
        b_0.storeDict(src.winners, Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
        b_0.storeUint(src.count, 8);
        b_0.storeUint(src.commissionPercentage, 64);
    };
}

export function loadPayoutItem(slice: Slice) {
    const sc_0 = slice;
    const _leagueId = sc_0.loadStringRefTail();
    const _winningPercentages = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_0);
    const _winners = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), sc_0);
    const _count = sc_0.loadUintBig(8);
    const _commissionPercentage = sc_0.loadUintBig(64);
    return { $$type: 'PayoutItem' as const, leagueId: _leagueId, winningPercentages: _winningPercentages, winners: _winners, count: _count, commissionPercentage: _commissionPercentage };
}

export function loadTuplePayoutItem(source: TupleReader) {
    const _leagueId = source.readString();
    const _winningPercentages = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _winners = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    const _count = source.readBigNumber();
    const _commissionPercentage = source.readBigNumber();
    return { $$type: 'PayoutItem' as const, leagueId: _leagueId, winningPercentages: _winningPercentages, winners: _winners, count: _count, commissionPercentage: _commissionPercentage };
}

export function loadGetterTuplePayoutItem(source: TupleReader) {
    const _leagueId = source.readString();
    const _winningPercentages = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _winners = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    const _count = source.readBigNumber();
    const _commissionPercentage = source.readBigNumber();
    return { $$type: 'PayoutItem' as const, leagueId: _leagueId, winningPercentages: _winningPercentages, winners: _winners, count: _count, commissionPercentage: _commissionPercentage };
}

export function storeTuplePayoutItem(source: PayoutItem) {
    const builder = new TupleBuilder();
    builder.writeString(source.leagueId);
    builder.writeCell(source.winningPercentages.size > 0 ? beginCell().storeDictDirect(source.winningPercentages, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeCell(source.winners.size > 0 ? beginCell().storeDictDirect(source.winners, Dictionary.Keys.BigInt(257), Dictionary.Values.Address()).endCell() : null);
    builder.writeNumber(source.count);
    builder.writeNumber(source.commissionPercentage);
    return builder.build();
}

export function dictValueParserPayoutItem(): DictionaryValue<PayoutItem> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePayoutItem(src)).endCell());
        },
        parse: (src) => {
            return loadPayoutItem(src.loadRef().beginParse());
        }
    }
}

export type BatchPayoutWinners = {
    $$type: 'BatchPayoutWinners';
    items: Dictionary<bigint, PayoutItem>;
    count: bigint;
}

export function storeBatchPayoutWinners(src: BatchPayoutWinners) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(743933829, 32);
        b_0.storeDict(src.items, Dictionary.Keys.BigInt(257), dictValueParserPayoutItem());
        b_0.storeUint(src.count, 8);
    };
}

export function loadBatchPayoutWinners(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 743933829) { throw Error('Invalid prefix'); }
    const _items = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserPayoutItem(), sc_0);
    const _count = sc_0.loadUintBig(8);
    return { $$type: 'BatchPayoutWinners' as const, items: _items, count: _count };
}

export function loadTupleBatchPayoutWinners(source: TupleReader) {
    const _items = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserPayoutItem(), source.readCellOpt());
    const _count = source.readBigNumber();
    return { $$type: 'BatchPayoutWinners' as const, items: _items, count: _count };
}

export function loadGetterTupleBatchPayoutWinners(source: TupleReader) {
    const _items = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserPayoutItem(), source.readCellOpt());
    const _count = source.readBigNumber();
    return { $$type: 'BatchPayoutWinners' as const, items: _items, count: _count };
}

export function storeTupleBatchPayoutWinners(source: BatchPayoutWinners) {
    const builder = new TupleBuilder();
    builder.writeCell(source.items.size > 0 ? beginCell().storeDictDirect(source.items, Dictionary.Keys.BigInt(257), dictValueParserPayoutItem()).endCell() : null);
    builder.writeNumber(source.count);
    return builder.build();
}

export function dictValueParserBatchPayoutWinners(): DictionaryValue<BatchPayoutWinners> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBatchPayoutWinners(src)).endCell());
        },
        parse: (src) => {
            return loadBatchPayoutWinners(src.loadRef().beginParse());
        }
    }
}

export type Withdraw = {
    $$type: 'Withdraw';
    amount: bigint;
}

export function storeWithdraw(src: Withdraw) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(195467089, 32);
        b_0.storeCoins(src.amount);
    };
}

export function loadWithdraw(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 195467089) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadCoins();
    return { $$type: 'Withdraw' as const, amount: _amount };
}

export function loadTupleWithdraw(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'Withdraw' as const, amount: _amount };
}

export function loadGetterTupleWithdraw(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'Withdraw' as const, amount: _amount };
}

export function storeTupleWithdraw(source: Withdraw) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserWithdraw(): DictionaryValue<Withdraw> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWithdraw(src)).endCell());
        },
        parse: (src) => {
            return loadWithdraw(src.loadRef().beginParse());
        }
    }
}

export type LeagueCreated = {
    $$type: 'LeagueCreated';
    leagueId: string;
}

export function storeLeagueCreated(src: LeagueCreated) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1156593961, 32);
        b_0.storeStringRefTail(src.leagueId);
    };
}

export function loadLeagueCreated(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1156593961) { throw Error('Invalid prefix'); }
    const _leagueId = sc_0.loadStringRefTail();
    return { $$type: 'LeagueCreated' as const, leagueId: _leagueId };
}

export function loadTupleLeagueCreated(source: TupleReader) {
    const _leagueId = source.readString();
    return { $$type: 'LeagueCreated' as const, leagueId: _leagueId };
}

export function loadGetterTupleLeagueCreated(source: TupleReader) {
    const _leagueId = source.readString();
    return { $$type: 'LeagueCreated' as const, leagueId: _leagueId };
}

export function storeTupleLeagueCreated(source: LeagueCreated) {
    const builder = new TupleBuilder();
    builder.writeString(source.leagueId);
    return builder.build();
}

export function dictValueParserLeagueCreated(): DictionaryValue<LeagueCreated> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLeagueCreated(src)).endCell());
        },
        parse: (src) => {
            return loadLeagueCreated(src.loadRef().beginParse());
        }
    }
}

export type StakeEvent = {
    $$type: 'StakeEvent';
    leagueId: string;
    userId: string;
    amount: bigint;
}

export function storeStakeEvent(src: StakeEvent) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1638663196, 32);
        b_0.storeStringRefTail(src.leagueId);
        b_0.storeStringRefTail(src.userId);
        b_0.storeCoins(src.amount);
    };
}

export function loadStakeEvent(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1638663196) { throw Error('Invalid prefix'); }
    const _leagueId = sc_0.loadStringRefTail();
    const _userId = sc_0.loadStringRefTail();
    const _amount = sc_0.loadCoins();
    return { $$type: 'StakeEvent' as const, leagueId: _leagueId, userId: _userId, amount: _amount };
}

export function loadTupleStakeEvent(source: TupleReader) {
    const _leagueId = source.readString();
    const _userId = source.readString();
    const _amount = source.readBigNumber();
    return { $$type: 'StakeEvent' as const, leagueId: _leagueId, userId: _userId, amount: _amount };
}

export function loadGetterTupleStakeEvent(source: TupleReader) {
    const _leagueId = source.readString();
    const _userId = source.readString();
    const _amount = source.readBigNumber();
    return { $$type: 'StakeEvent' as const, leagueId: _leagueId, userId: _userId, amount: _amount };
}

export function storeTupleStakeEvent(source: StakeEvent) {
    const builder = new TupleBuilder();
    builder.writeString(source.leagueId);
    builder.writeString(source.userId);
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserStakeEvent(): DictionaryValue<StakeEvent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStakeEvent(src)).endCell());
        },
        parse: (src) => {
            return loadStakeEvent(src.loadRef().beginParse());
        }
    }
}

export type PayoutEvent = {
    $$type: 'PayoutEvent';
    leagueId: string;
    winner: Address;
    amount: bigint;
}

export function storePayoutEvent(src: PayoutEvent) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1136431651, 32);
        b_0.storeStringRefTail(src.leagueId);
        b_0.storeAddress(src.winner);
        b_0.storeCoins(src.amount);
    };
}

export function loadPayoutEvent(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1136431651) { throw Error('Invalid prefix'); }
    const _leagueId = sc_0.loadStringRefTail();
    const _winner = sc_0.loadAddress();
    const _amount = sc_0.loadCoins();
    return { $$type: 'PayoutEvent' as const, leagueId: _leagueId, winner: _winner, amount: _amount };
}

export function loadTuplePayoutEvent(source: TupleReader) {
    const _leagueId = source.readString();
    const _winner = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'PayoutEvent' as const, leagueId: _leagueId, winner: _winner, amount: _amount };
}

export function loadGetterTuplePayoutEvent(source: TupleReader) {
    const _leagueId = source.readString();
    const _winner = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'PayoutEvent' as const, leagueId: _leagueId, winner: _winner, amount: _amount };
}

export function storeTuplePayoutEvent(source: PayoutEvent) {
    const builder = new TupleBuilder();
    builder.writeString(source.leagueId);
    builder.writeAddress(source.winner);
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserPayoutEvent(): DictionaryValue<PayoutEvent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePayoutEvent(src)).endCell());
        },
        parse: (src) => {
            return loadPayoutEvent(src.loadRef().beginParse());
        }
    }
}

export type PayoutCompletedEvent = {
    $$type: 'PayoutCompletedEvent';
    leagueId: string;
}

export function storePayoutCompletedEvent(src: PayoutCompletedEvent) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(979085414, 32);
        b_0.storeStringRefTail(src.leagueId);
    };
}

export function loadPayoutCompletedEvent(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 979085414) { throw Error('Invalid prefix'); }
    const _leagueId = sc_0.loadStringRefTail();
    return { $$type: 'PayoutCompletedEvent' as const, leagueId: _leagueId };
}

export function loadTuplePayoutCompletedEvent(source: TupleReader) {
    const _leagueId = source.readString();
    return { $$type: 'PayoutCompletedEvent' as const, leagueId: _leagueId };
}

export function loadGetterTuplePayoutCompletedEvent(source: TupleReader) {
    const _leagueId = source.readString();
    return { $$type: 'PayoutCompletedEvent' as const, leagueId: _leagueId };
}

export function storeTuplePayoutCompletedEvent(source: PayoutCompletedEvent) {
    const builder = new TupleBuilder();
    builder.writeString(source.leagueId);
    return builder.build();
}

export function dictValueParserPayoutCompletedEvent(): DictionaryValue<PayoutCompletedEvent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePayoutCompletedEvent(src)).endCell());
        },
        parse: (src) => {
            return loadPayoutCompletedEvent(src.loadRef().beginParse());
        }
    }
}

export type LeaguePayout$Data = {
    $$type: 'LeaguePayout$Data';
    owner: Address;
    leagues: Dictionary<bigint, LeagueInfo>;
    stakes: Dictionary<bigint, StakeInfo>;
}

export function storeLeaguePayout$Data(src: LeaguePayout$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeDict(src.leagues, Dictionary.Keys.BigInt(257), dictValueParserLeagueInfo());
        b_0.storeDict(src.stakes, Dictionary.Keys.BigInt(257), dictValueParserStakeInfo());
    };
}

export function loadLeaguePayout$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _leagues = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserLeagueInfo(), sc_0);
    const _stakes = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserStakeInfo(), sc_0);
    return { $$type: 'LeaguePayout$Data' as const, owner: _owner, leagues: _leagues, stakes: _stakes };
}

export function loadTupleLeaguePayout$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _leagues = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserLeagueInfo(), source.readCellOpt());
    const _stakes = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserStakeInfo(), source.readCellOpt());
    return { $$type: 'LeaguePayout$Data' as const, owner: _owner, leagues: _leagues, stakes: _stakes };
}

export function loadGetterTupleLeaguePayout$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _leagues = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserLeagueInfo(), source.readCellOpt());
    const _stakes = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserStakeInfo(), source.readCellOpt());
    return { $$type: 'LeaguePayout$Data' as const, owner: _owner, leagues: _leagues, stakes: _stakes };
}

export function storeTupleLeaguePayout$Data(source: LeaguePayout$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeCell(source.leagues.size > 0 ? beginCell().storeDictDirect(source.leagues, Dictionary.Keys.BigInt(257), dictValueParserLeagueInfo()).endCell() : null);
    builder.writeCell(source.stakes.size > 0 ? beginCell().storeDictDirect(source.stakes, Dictionary.Keys.BigInt(257), dictValueParserStakeInfo()).endCell() : null);
    return builder.build();
}

export function dictValueParserLeaguePayout$Data(): DictionaryValue<LeaguePayout$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLeaguePayout$Data(src)).endCell());
        },
        parse: (src) => {
            return loadLeaguePayout$Data(src.loadRef().beginParse());
        }
    }
}

export type LeagueInfo = {
    $$type: 'LeagueInfo';
    owner: Address;
    leagueId: string;
    commissionPercentage: bigint;
    feePaid: boolean;
    totalStaked: bigint;
}

export function storeLeagueInfo(src: LeagueInfo) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeStringRefTail(src.leagueId);
        b_0.storeInt(src.commissionPercentage, 257);
        b_0.storeBit(src.feePaid);
        b_0.storeCoins(src.totalStaked);
    };
}

export function loadLeagueInfo(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _leagueId = sc_0.loadStringRefTail();
    const _commissionPercentage = sc_0.loadIntBig(257);
    const _feePaid = sc_0.loadBit();
    const _totalStaked = sc_0.loadCoins();
    return { $$type: 'LeagueInfo' as const, owner: _owner, leagueId: _leagueId, commissionPercentage: _commissionPercentage, feePaid: _feePaid, totalStaked: _totalStaked };
}

export function loadTupleLeagueInfo(source: TupleReader) {
    const _owner = source.readAddress();
    const _leagueId = source.readString();
    const _commissionPercentage = source.readBigNumber();
    const _feePaid = source.readBoolean();
    const _totalStaked = source.readBigNumber();
    return { $$type: 'LeagueInfo' as const, owner: _owner, leagueId: _leagueId, commissionPercentage: _commissionPercentage, feePaid: _feePaid, totalStaked: _totalStaked };
}

export function loadGetterTupleLeagueInfo(source: TupleReader) {
    const _owner = source.readAddress();
    const _leagueId = source.readString();
    const _commissionPercentage = source.readBigNumber();
    const _feePaid = source.readBoolean();
    const _totalStaked = source.readBigNumber();
    return { $$type: 'LeagueInfo' as const, owner: _owner, leagueId: _leagueId, commissionPercentage: _commissionPercentage, feePaid: _feePaid, totalStaked: _totalStaked };
}

export function storeTupleLeagueInfo(source: LeagueInfo) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeString(source.leagueId);
    builder.writeNumber(source.commissionPercentage);
    builder.writeBoolean(source.feePaid);
    builder.writeNumber(source.totalStaked);
    return builder.build();
}

export function dictValueParserLeagueInfo(): DictionaryValue<LeagueInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLeagueInfo(src)).endCell());
        },
        parse: (src) => {
            return loadLeagueInfo(src.loadRef().beginParse());
        }
    }
}

export type StakeInfo = {
    $$type: 'StakeInfo';
    user: Address;
    amount: bigint;
    hasStaked: boolean;
}

export function storeStakeInfo(src: StakeInfo) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.user);
        b_0.storeInt(src.amount, 257);
        b_0.storeBit(src.hasStaked);
    };
}

export function loadStakeInfo(slice: Slice) {
    const sc_0 = slice;
    const _user = sc_0.loadAddress();
    const _amount = sc_0.loadIntBig(257);
    const _hasStaked = sc_0.loadBit();
    return { $$type: 'StakeInfo' as const, user: _user, amount: _amount, hasStaked: _hasStaked };
}

export function loadTupleStakeInfo(source: TupleReader) {
    const _user = source.readAddress();
    const _amount = source.readBigNumber();
    const _hasStaked = source.readBoolean();
    return { $$type: 'StakeInfo' as const, user: _user, amount: _amount, hasStaked: _hasStaked };
}

export function loadGetterTupleStakeInfo(source: TupleReader) {
    const _user = source.readAddress();
    const _amount = source.readBigNumber();
    const _hasStaked = source.readBoolean();
    return { $$type: 'StakeInfo' as const, user: _user, amount: _amount, hasStaked: _hasStaked };
}

export function storeTupleStakeInfo(source: StakeInfo) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.user);
    builder.writeNumber(source.amount);
    builder.writeBoolean(source.hasStaked);
    return builder.build();
}

export function dictValueParserStakeInfo(): DictionaryValue<StakeInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStakeInfo(src)).endCell());
        },
        parse: (src) => {
            return loadStakeInfo(src.loadRef().beginParse());
        }
    }
}

 type LeaguePayout_init_args = {
    $$type: 'LeaguePayout_init_args';
}

function initLeaguePayout_init_args(src: LeaguePayout_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
    };
}

async function LeaguePayout_init() {
    const __code = Cell.fromHex('b5ee9c7241021e0100091a000114ff00f4a413f4bcf2c80b01020162021c04c6d001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200019afa40f404f40455206c1396306d6df84259e204925f04e002d70d1ff2e082218210d68206e7bae3022182105730951bbae30221821056b4e77fbae302218210a12dd911ba03090b0e02f831d401d001d401d001d33ffa00fa0030f8416f243032269b9320d74a91d5e868f90400da1181265d2a8101012359f40d6fa192306ddf206e92306d8e16d0fa40d401d001810101d700d200fa0055406c156f05e26ef2f4707026c200923025de25c2009225a0de048200f3e905be14f2f424c2009134e30d7023c20004060186327270882a0407552010246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00027f0105002e000000004c6561677565204372656174696f6e2046656501ea923335e30d2510450345150443138101015025c855405045ce02c8ce12cd810101cf00ca0001fa02c9103512206e953059f45a30944133f415e202c801821044f0392958cb1f01c8cecdc9c88258c000000000000000000000000101cb67ccc970fb0002c87f01ca0055205023cef400f400c9ed540701fc30c85240cbff21cf16c9f9008200e41c2b8101012359f40d6fa192306ddf206e92306d8e10d0fa40810101d700d20055206c136f03e26ef2f453137f028101015023c855205023ce810101cf00ca00c9103c12206e953059f45a30944133f415e2545663c85520821061ac041c5004cb1f02c8ce12cd01c8cecd01fa02c9080034c88258c000000000000000000000000101cb67ccc970fb00104801fe31d401d001d33f30f8416f245b814ab63224c705f2f4219b9320d74a91d5e868f90400da1181265d258101012359f40d6fa192306ddf206e92306d8e16d0fa40d401d001810101d700d200fa0055406c156f05e26ef2f470702551354533050443138101015025c855405045ce02c8ce12cd810101cf00ca0001fa02c910350a009412206e953059f45a30944133f415e202c801821044f0392958cb1f01c8cecdc9c88258c000000000000000000000000101cb67ccc970fb0002c87f01ca0055205023cef400f400c9ed5401ea31d401d001d401d001fa0030f8416f243032249b9320d74a91d5e868f90400da11278101012259f40d6fa192306ddf206e92306d8e16d0fa40d401d001810101d700d200fa0055406c156f05e26f2581483c5189be18f2f4c85250cbff26cf16c9f9008200e41c2e8101012359f40d6fa192306ddf0c01fc206e92306d8e10d0fa40810101d700d20055206c136f03e26ef2f451687f028101015023c855205023ce810101cf00ca00c9103e4170206e953059f45a30944133f415e2541876c85520821061ac041c5004cb1f02c8ce12cd01c8cecd01fa02c9c88258c000000000000000000000000101cb67ccc970fb005034a045880d007c81010109c855405045ce02c8ce12cd810101cf00ca0001fa02c910344550206e953059f45a30944133f415e258c87f01ca0055205023cef400f400c9ed5404a28eb231d401d001f404f404d307d33f30f8416f245b82008a343227c705f2f41057db3cc87f01ca0055205023cef400f400c9ed54e02182102c578785bae3022182100ba69751bae302018210946a98b6ba100f191b01be31f404d30730f8416f245b82008a343224c705f2f470018eb2218101012259f40d6fa192306ddf206e92306d8e13d0d401d001f404f404d307d33f55406c156f05e26f255e35db3c04a413e45b02c87f01ca0055205023cef400f400c9ed541001f6249b9320d74a91d5e868f90400da11278101012259f40d6fa192306ddf206e92306d8e16d0fa40d401d001810101d700d200fa0055406c156f05e26f258200f27621c200f2f421998200ac8f27c000f2f4de705302b39328c2009170e299315218a8812710a9049138e223c2009a375302a8812710a90407de53071104faa012a121c2008ec072708856110405552010246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb009131e226c2009136e30d7052088ae430353535354430810101505470c855405045ce02c8ce12cd810101cf00ca0001fa02c910351212131518001c00000000436f6d6d697373696f6e017e72708827040a552010246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0014002c0000000043726561746f7220436f6d6d697373696f6e01de288101012259f40c6fa192306ddf810101545b0052404133f40c6fa19401d70030925b6de2c85280cbff22cf16c9f90081170e8101015610401359f40d6fa192306ddf206e92306d8e10d0fa40810101d700d20055206c136f03e26eb3f2f45280a8812710a90420c200915be30da41601e8727088245134413310246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00545c22c85520821043bc92235004cb1f02c8ce12cdce01fa02c9c88258c000000000000000000000000101cb67ccc970fb0018a007170014000000005061796f7574006e206e953059f45a30944133f415e202c80182103a5ba86658cb1f01c8cecdc9c88258c000000000000000000000000101cb67ccc970fb0001c231fa0030f8416f245b8168c93223c705f2f472708824553010246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0002c87f01ca0055205023cef400f400c9ed541a001c000000005769746864726177616c00d28e61d33f30f84270804003c8018210aff90f5758cb1fcb3fc941305a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0002c87f01ca0055205023cef400f400c9ed54e05f04f2c0820165a12885da89a1a4000335f481e809e808aa40d8272c60dadbf084b3c4aa05b678d86240dd2460db28de4ade0bc440dd2460dbbd1d0076810101019b9320d74a91d5e868f90400da11235959f40d6fa192306ddf206e92306d8e16d0fa40d401d001810101d700d200fa0055406c156f05e2548b4b25');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initLeaguePayout_init_args({ $$type: 'LeaguePayout_init_args' })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const LeaguePayout_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    5902: { message: "Winner did not stake" },
    9821: { message: "League already exists" },
    18492: { message: "Insufficient stake amount sent" },
    19126: { message: "Only owner can create public leagues" },
    26825: { message: "Only owner can withdraw" },
    35380: { message: "Only owner can payout" },
    44175: { message: "Fee paid, no commission allowed" },
    58396: { message: "User already staked" },
    62070: { message: "No funds in league" },
    62441: { message: "Insufficient value sent" },
} as const

export const LeaguePayout_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Winner did not stake": 5902,
    "League already exists": 9821,
    "Insufficient stake amount sent": 18492,
    "Only owner can create public leagues": 19126,
    "Only owner can withdraw": 26825,
    "Only owner can payout": 35380,
    "Fee paid, no commission allowed": 44175,
    "User already staked": 58396,
    "No funds in league": 62070,
    "Insufficient value sent": 62441,
} as const

const LeaguePayout_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SignedBundle","header":null,"fields":[{"name":"signature","type":{"kind":"simple","type":"fixed-bytes","optional":false,"format":64}},{"name":"signedData","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"CreateLeague","header":3598845671,"fields":[{"name":"leagueId","type":{"kind":"simple","type":"string","optional":false}},{"name":"userId","type":{"kind":"simple","type":"string","optional":false}},{"name":"commissionPercentage","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"feeAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"initialStake","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"Stake","header":1454696319,"fields":[{"name":"leagueId","type":{"kind":"simple","type":"string","optional":false}},{"name":"userId","type":{"kind":"simple","type":"string","optional":false}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"CreatePublicLeague","header":1462801691,"fields":[{"name":"leagueId","type":{"kind":"simple","type":"string","optional":false}},{"name":"commissionPercentage","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"feeAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"PayoutWinners","header":2704136465,"fields":[{"name":"leagueId","type":{"kind":"simple","type":"string","optional":false}},{"name":"winningPercentages","type":{"kind":"dict","key":"int","value":"int"}},{"name":"winners","type":{"kind":"dict","key":"int","value":"address"}},{"name":"count","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"commissionPercentage","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"PayoutItem","header":null,"fields":[{"name":"leagueId","type":{"kind":"simple","type":"string","optional":false}},{"name":"winningPercentages","type":{"kind":"dict","key":"int","value":"int"}},{"name":"winners","type":{"kind":"dict","key":"int","value":"address"}},{"name":"count","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"commissionPercentage","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"BatchPayoutWinners","header":743933829,"fields":[{"name":"items","type":{"kind":"dict","key":"int","value":"PayoutItem","valueFormat":"ref"}},{"name":"count","type":{"kind":"simple","type":"uint","optional":false,"format":8}}]},
    {"name":"Withdraw","header":195467089,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"LeagueCreated","header":1156593961,"fields":[{"name":"leagueId","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"StakeEvent","header":1638663196,"fields":[{"name":"leagueId","type":{"kind":"simple","type":"string","optional":false}},{"name":"userId","type":{"kind":"simple","type":"string","optional":false}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"PayoutEvent","header":1136431651,"fields":[{"name":"leagueId","type":{"kind":"simple","type":"string","optional":false}},{"name":"winner","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"PayoutCompletedEvent","header":979085414,"fields":[{"name":"leagueId","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"LeaguePayout$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"leagues","type":{"kind":"dict","key":"int","value":"LeagueInfo","valueFormat":"ref"}},{"name":"stakes","type":{"kind":"dict","key":"int","value":"StakeInfo","valueFormat":"ref"}}]},
    {"name":"LeagueInfo","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"leagueId","type":{"kind":"simple","type":"string","optional":false}},{"name":"commissionPercentage","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"feePaid","type":{"kind":"simple","type":"bool","optional":false}},{"name":"totalStaked","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"StakeInfo","header":null,"fields":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"hasStaked","type":{"kind":"simple","type":"bool","optional":false}}]},
]

const LeaguePayout_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "CreateLeague": 3598845671,
    "Stake": 1454696319,
    "CreatePublicLeague": 1462801691,
    "PayoutWinners": 2704136465,
    "BatchPayoutWinners": 743933829,
    "Withdraw": 195467089,
    "LeagueCreated": 1156593961,
    "StakeEvent": 1638663196,
    "PayoutEvent": 1136431651,
    "PayoutCompletedEvent": 979085414,
}

const LeaguePayout_getters: ABIGetter[] = [
    {"name":"league","methodId":103490,"arguments":[{"name":"id","type":{"kind":"simple","type":"string","optional":false}}],"returnType":{"kind":"simple","type":"LeagueInfo","optional":true}},
]

export const LeaguePayout_getterMapping: { [key: string]: string } = {
    'league': 'getLeague',
}

const LeaguePayout_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"CreateLeague"}},
    {"receiver":"internal","message":{"kind":"typed","type":"CreatePublicLeague"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Stake"}},
    {"receiver":"internal","message":{"kind":"typed","type":"PayoutWinners"}},
    {"receiver":"internal","message":{"kind":"typed","type":"BatchPayoutWinners"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Withdraw"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]


export class LeaguePayout implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = LeaguePayout_errors_backward;
    public static readonly opcodes = LeaguePayout_opcodes;
    
    static async init() {
        return await LeaguePayout_init();
    }
    
    static async fromInit() {
        const __gen_init = await LeaguePayout_init();
        const address = contractAddress(0, __gen_init);
        return new LeaguePayout(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new LeaguePayout(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  LeaguePayout_types,
        getters: LeaguePayout_getters,
        receivers: LeaguePayout_receivers,
        errors: LeaguePayout_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: CreateLeague | CreatePublicLeague | Stake | PayoutWinners | BatchPayoutWinners | Withdraw | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'CreateLeague') {
            body = beginCell().store(storeCreateLeague(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'CreatePublicLeague') {
            body = beginCell().store(storeCreatePublicLeague(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Stake') {
            body = beginCell().store(storeStake(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'PayoutWinners') {
            body = beginCell().store(storePayoutWinners(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'BatchPayoutWinners') {
            body = beginCell().store(storeBatchPayoutWinners(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Withdraw') {
            body = beginCell().store(storeWithdraw(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getLeague(provider: ContractProvider, id: string) {
        const builder = new TupleBuilder();
        builder.writeString(id);
        const source = (await provider.get('league', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleLeagueInfo(result_p) : null;
        return result;
    }
    
}