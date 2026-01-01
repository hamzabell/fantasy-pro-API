"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaguePayout = exports.LeaguePayout_getterMapping = exports.LeaguePayout_errors_backward = exports.LeaguePayout_errors = void 0;
exports.storeDataSize = storeDataSize;
exports.loadDataSize = loadDataSize;
exports.loadTupleDataSize = loadTupleDataSize;
exports.loadGetterTupleDataSize = loadGetterTupleDataSize;
exports.storeTupleDataSize = storeTupleDataSize;
exports.dictValueParserDataSize = dictValueParserDataSize;
exports.storeSignedBundle = storeSignedBundle;
exports.loadSignedBundle = loadSignedBundle;
exports.loadTupleSignedBundle = loadTupleSignedBundle;
exports.loadGetterTupleSignedBundle = loadGetterTupleSignedBundle;
exports.storeTupleSignedBundle = storeTupleSignedBundle;
exports.dictValueParserSignedBundle = dictValueParserSignedBundle;
exports.storeStateInit = storeStateInit;
exports.loadStateInit = loadStateInit;
exports.loadTupleStateInit = loadTupleStateInit;
exports.loadGetterTupleStateInit = loadGetterTupleStateInit;
exports.storeTupleStateInit = storeTupleStateInit;
exports.dictValueParserStateInit = dictValueParserStateInit;
exports.storeContext = storeContext;
exports.loadContext = loadContext;
exports.loadTupleContext = loadTupleContext;
exports.loadGetterTupleContext = loadGetterTupleContext;
exports.storeTupleContext = storeTupleContext;
exports.dictValueParserContext = dictValueParserContext;
exports.storeSendParameters = storeSendParameters;
exports.loadSendParameters = loadSendParameters;
exports.loadTupleSendParameters = loadTupleSendParameters;
exports.loadGetterTupleSendParameters = loadGetterTupleSendParameters;
exports.storeTupleSendParameters = storeTupleSendParameters;
exports.dictValueParserSendParameters = dictValueParserSendParameters;
exports.storeMessageParameters = storeMessageParameters;
exports.loadMessageParameters = loadMessageParameters;
exports.loadTupleMessageParameters = loadTupleMessageParameters;
exports.loadGetterTupleMessageParameters = loadGetterTupleMessageParameters;
exports.storeTupleMessageParameters = storeTupleMessageParameters;
exports.dictValueParserMessageParameters = dictValueParserMessageParameters;
exports.storeDeployParameters = storeDeployParameters;
exports.loadDeployParameters = loadDeployParameters;
exports.loadTupleDeployParameters = loadTupleDeployParameters;
exports.loadGetterTupleDeployParameters = loadGetterTupleDeployParameters;
exports.storeTupleDeployParameters = storeTupleDeployParameters;
exports.dictValueParserDeployParameters = dictValueParserDeployParameters;
exports.storeStdAddress = storeStdAddress;
exports.loadStdAddress = loadStdAddress;
exports.loadTupleStdAddress = loadTupleStdAddress;
exports.loadGetterTupleStdAddress = loadGetterTupleStdAddress;
exports.storeTupleStdAddress = storeTupleStdAddress;
exports.dictValueParserStdAddress = dictValueParserStdAddress;
exports.storeVarAddress = storeVarAddress;
exports.loadVarAddress = loadVarAddress;
exports.loadTupleVarAddress = loadTupleVarAddress;
exports.loadGetterTupleVarAddress = loadGetterTupleVarAddress;
exports.storeTupleVarAddress = storeTupleVarAddress;
exports.dictValueParserVarAddress = dictValueParserVarAddress;
exports.storeBasechainAddress = storeBasechainAddress;
exports.loadBasechainAddress = loadBasechainAddress;
exports.loadTupleBasechainAddress = loadTupleBasechainAddress;
exports.loadGetterTupleBasechainAddress = loadGetterTupleBasechainAddress;
exports.storeTupleBasechainAddress = storeTupleBasechainAddress;
exports.dictValueParserBasechainAddress = dictValueParserBasechainAddress;
exports.storeDeploy = storeDeploy;
exports.loadDeploy = loadDeploy;
exports.loadTupleDeploy = loadTupleDeploy;
exports.loadGetterTupleDeploy = loadGetterTupleDeploy;
exports.storeTupleDeploy = storeTupleDeploy;
exports.dictValueParserDeploy = dictValueParserDeploy;
exports.storeDeployOk = storeDeployOk;
exports.loadDeployOk = loadDeployOk;
exports.loadTupleDeployOk = loadTupleDeployOk;
exports.loadGetterTupleDeployOk = loadGetterTupleDeployOk;
exports.storeTupleDeployOk = storeTupleDeployOk;
exports.dictValueParserDeployOk = dictValueParserDeployOk;
exports.storeCreateLeague = storeCreateLeague;
exports.loadCreateLeague = loadCreateLeague;
exports.loadTupleCreateLeague = loadTupleCreateLeague;
exports.loadGetterTupleCreateLeague = loadGetterTupleCreateLeague;
exports.storeTupleCreateLeague = storeTupleCreateLeague;
exports.dictValueParserCreateLeague = dictValueParserCreateLeague;
exports.storeStake = storeStake;
exports.loadStake = loadStake;
exports.loadTupleStake = loadTupleStake;
exports.loadGetterTupleStake = loadGetterTupleStake;
exports.storeTupleStake = storeTupleStake;
exports.dictValueParserStake = dictValueParserStake;
exports.storePayoutWinners = storePayoutWinners;
exports.loadPayoutWinners = loadPayoutWinners;
exports.loadTuplePayoutWinners = loadTuplePayoutWinners;
exports.loadGetterTuplePayoutWinners = loadGetterTuplePayoutWinners;
exports.storeTuplePayoutWinners = storeTuplePayoutWinners;
exports.dictValueParserPayoutWinners = dictValueParserPayoutWinners;
exports.storeWithdraw = storeWithdraw;
exports.loadWithdraw = loadWithdraw;
exports.loadTupleWithdraw = loadTupleWithdraw;
exports.loadGetterTupleWithdraw = loadGetterTupleWithdraw;
exports.storeTupleWithdraw = storeTupleWithdraw;
exports.dictValueParserWithdraw = dictValueParserWithdraw;
exports.storeLeagueCreated = storeLeagueCreated;
exports.loadLeagueCreated = loadLeagueCreated;
exports.loadTupleLeagueCreated = loadTupleLeagueCreated;
exports.loadGetterTupleLeagueCreated = loadGetterTupleLeagueCreated;
exports.storeTupleLeagueCreated = storeTupleLeagueCreated;
exports.dictValueParserLeagueCreated = dictValueParserLeagueCreated;
exports.storeStakeEvent = storeStakeEvent;
exports.loadStakeEvent = loadStakeEvent;
exports.loadTupleStakeEvent = loadTupleStakeEvent;
exports.loadGetterTupleStakeEvent = loadGetterTupleStakeEvent;
exports.storeTupleStakeEvent = storeTupleStakeEvent;
exports.dictValueParserStakeEvent = dictValueParserStakeEvent;
exports.storePayoutEvent = storePayoutEvent;
exports.loadPayoutEvent = loadPayoutEvent;
exports.loadTuplePayoutEvent = loadTuplePayoutEvent;
exports.loadGetterTuplePayoutEvent = loadGetterTuplePayoutEvent;
exports.storeTuplePayoutEvent = storeTuplePayoutEvent;
exports.dictValueParserPayoutEvent = dictValueParserPayoutEvent;
exports.storePayoutCompletedEvent = storePayoutCompletedEvent;
exports.loadPayoutCompletedEvent = loadPayoutCompletedEvent;
exports.loadTuplePayoutCompletedEvent = loadTuplePayoutCompletedEvent;
exports.loadGetterTuplePayoutCompletedEvent = loadGetterTuplePayoutCompletedEvent;
exports.storeTuplePayoutCompletedEvent = storeTuplePayoutCompletedEvent;
exports.dictValueParserPayoutCompletedEvent = dictValueParserPayoutCompletedEvent;
exports.storeLeaguePayout$Data = storeLeaguePayout$Data;
exports.loadLeaguePayout$Data = loadLeaguePayout$Data;
exports.loadTupleLeaguePayout$Data = loadTupleLeaguePayout$Data;
exports.loadGetterTupleLeaguePayout$Data = loadGetterTupleLeaguePayout$Data;
exports.storeTupleLeaguePayout$Data = storeTupleLeaguePayout$Data;
exports.dictValueParserLeaguePayout$Data = dictValueParserLeaguePayout$Data;
exports.storeLeagueInfo = storeLeagueInfo;
exports.loadLeagueInfo = loadLeagueInfo;
exports.loadTupleLeagueInfo = loadTupleLeagueInfo;
exports.loadGetterTupleLeagueInfo = loadGetterTupleLeagueInfo;
exports.storeTupleLeagueInfo = storeTupleLeagueInfo;
exports.dictValueParserLeagueInfo = dictValueParserLeagueInfo;
exports.storeStakeInfo = storeStakeInfo;
exports.loadStakeInfo = loadStakeInfo;
exports.loadTupleStakeInfo = loadTupleStakeInfo;
exports.loadGetterTupleStakeInfo = loadGetterTupleStakeInfo;
exports.storeTupleStakeInfo = storeTupleStakeInfo;
exports.dictValueParserStakeInfo = dictValueParserStakeInfo;
const core_1 = require("@ton/core");
function storeDataSize(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}
function loadDataSize(slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize', cells: _cells, bits: _bits, refs: _refs };
}
function loadTupleDataSize(source) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize', cells: _cells, bits: _bits, refs: _refs };
}
function loadGetterTupleDataSize(source) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize', cells: _cells, bits: _bits, refs: _refs };
}
function storeTupleDataSize(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}
function dictValueParserDataSize() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    };
}
function storeSignedBundle(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}
function loadSignedBundle(slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle', signature: _signature, signedData: _signedData };
}
function loadTupleSignedBundle(source) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle', signature: _signature, signedData: _signedData };
}
function loadGetterTupleSignedBundle(source) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle', signature: _signature, signedData: _signedData };
}
function storeTupleSignedBundle(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}
function dictValueParserSignedBundle() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    };
}
function storeStateInit(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}
function loadStateInit(slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit', code: _code, data: _data };
}
function loadTupleStateInit(source) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit', code: _code, data: _data };
}
function loadGetterTupleStateInit(source) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit', code: _code, data: _data };
}
function storeTupleStateInit(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}
function dictValueParserStateInit() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    };
}
function storeContext(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}
function loadContext(slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context', bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}
function loadTupleContext(source) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context', bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}
function loadGetterTupleContext(source) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context', bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}
function storeTupleContext(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}
function dictValueParserContext() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    };
}
function storeSendParameters(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) {
            b_0.storeBit(true).storeRef(src.body);
        }
        else {
            b_0.storeBit(false);
        }
        if (src.code !== null && src.code !== undefined) {
            b_0.storeBit(true).storeRef(src.code);
        }
        else {
            b_0.storeBit(false);
        }
        if (src.data !== null && src.data !== undefined) {
            b_0.storeBit(true).storeRef(src.data);
        }
        else {
            b_0.storeBit(false);
        }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}
function loadSendParameters(slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters', mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}
function loadTupleSendParameters(source) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters', mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}
function loadGetterTupleSendParameters(source) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters', mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}
function storeTupleSendParameters(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}
function dictValueParserSendParameters() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    };
}
function storeMessageParameters(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) {
            b_0.storeBit(true).storeRef(src.body);
        }
        else {
            b_0.storeBit(false);
        }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}
function loadMessageParameters(slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters', mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}
function loadTupleMessageParameters(source) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters', mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}
function loadGetterTupleMessageParameters(source) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters', mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}
function storeTupleMessageParameters(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}
function dictValueParserMessageParameters() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    };
}
function storeDeployParameters(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) {
            b_0.storeBit(true).storeRef(src.body);
        }
        else {
            b_0.storeBit(false);
        }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}
function loadDeployParameters(slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters', mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}
function loadTupleDeployParameters(source) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters', mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}
function loadGetterTupleDeployParameters(source) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters', mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}
function storeTupleDeployParameters(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}
function dictValueParserDeployParameters() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    };
}
function storeStdAddress(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}
function loadStdAddress(slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress', workchain: _workchain, address: _address };
}
function loadTupleStdAddress(source) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress', workchain: _workchain, address: _address };
}
function loadGetterTupleStdAddress(source) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress', workchain: _workchain, address: _address };
}
function storeTupleStdAddress(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}
function dictValueParserStdAddress() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    };
}
function storeVarAddress(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}
function loadVarAddress(slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress', workchain: _workchain, address: _address };
}
function loadTupleVarAddress(source) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress', workchain: _workchain, address: _address };
}
function loadGetterTupleVarAddress(source) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress', workchain: _workchain, address: _address };
}
function storeTupleVarAddress(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}
function dictValueParserVarAddress() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    };
}
function storeBasechainAddress(src) {
    return (builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) {
            b_0.storeBit(true).storeInt(src.hash, 257);
        }
        else {
            b_0.storeBit(false);
        }
    };
}
function loadBasechainAddress(slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress', hash: _hash };
}
function loadTupleBasechainAddress(source) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress', hash: _hash };
}
function loadGetterTupleBasechainAddress(source) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress', hash: _hash };
}
function storeTupleBasechainAddress(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}
function dictValueParserBasechainAddress() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    };
}
function storeDeploy(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}
function loadDeploy(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) {
        throw Error('Invalid prefix');
    }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy', queryId: _queryId };
}
function loadTupleDeploy(source) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy', queryId: _queryId };
}
function loadGetterTupleDeploy(source) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy', queryId: _queryId };
}
function storeTupleDeploy(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}
function dictValueParserDeploy() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    };
}
function storeDeployOk(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}
function loadDeployOk(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) {
        throw Error('Invalid prefix');
    }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk', queryId: _queryId };
}
function loadTupleDeployOk(source) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk', queryId: _queryId };
}
function loadGetterTupleDeployOk(source) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk', queryId: _queryId };
}
function storeTupleDeployOk(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}
function dictValueParserDeployOk() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    };
}
function storeCreateLeague(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(226823229, 32);
        b_0.storeStringRefTail(src.leagueId);
        b_0.storeStringRefTail(src.userId);
        b_0.storeUint(src.commissionPercentage, 64);
        b_0.storeCoins(src.feeAmount);
    };
}
function loadCreateLeague(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 226823229) {
        throw Error('Invalid prefix');
    }
    const _leagueId = sc_0.loadStringRefTail();
    const _userId = sc_0.loadStringRefTail();
    const _commissionPercentage = sc_0.loadUintBig(64);
    const _feeAmount = sc_0.loadCoins();
    return { $$type: 'CreateLeague', leagueId: _leagueId, userId: _userId, commissionPercentage: _commissionPercentage, feeAmount: _feeAmount };
}
function loadTupleCreateLeague(source) {
    const _leagueId = source.readString();
    const _userId = source.readString();
    const _commissionPercentage = source.readBigNumber();
    const _feeAmount = source.readBigNumber();
    return { $$type: 'CreateLeague', leagueId: _leagueId, userId: _userId, commissionPercentage: _commissionPercentage, feeAmount: _feeAmount };
}
function loadGetterTupleCreateLeague(source) {
    const _leagueId = source.readString();
    const _userId = source.readString();
    const _commissionPercentage = source.readBigNumber();
    const _feeAmount = source.readBigNumber();
    return { $$type: 'CreateLeague', leagueId: _leagueId, userId: _userId, commissionPercentage: _commissionPercentage, feeAmount: _feeAmount };
}
function storeTupleCreateLeague(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeString(source.leagueId);
    builder.writeString(source.userId);
    builder.writeNumber(source.commissionPercentage);
    builder.writeNumber(source.feeAmount);
    return builder.build();
}
function dictValueParserCreateLeague() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeCreateLeague(src)).endCell());
        },
        parse: (src) => {
            return loadCreateLeague(src.loadRef().beginParse());
        }
    };
}
function storeStake(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1454696319, 32);
        b_0.storeStringRefTail(src.leagueId);
        b_0.storeStringRefTail(src.userId);
        b_0.storeCoins(src.amount);
    };
}
function loadStake(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1454696319) {
        throw Error('Invalid prefix');
    }
    const _leagueId = sc_0.loadStringRefTail();
    const _userId = sc_0.loadStringRefTail();
    const _amount = sc_0.loadCoins();
    return { $$type: 'Stake', leagueId: _leagueId, userId: _userId, amount: _amount };
}
function loadTupleStake(source) {
    const _leagueId = source.readString();
    const _userId = source.readString();
    const _amount = source.readBigNumber();
    return { $$type: 'Stake', leagueId: _leagueId, userId: _userId, amount: _amount };
}
function loadGetterTupleStake(source) {
    const _leagueId = source.readString();
    const _userId = source.readString();
    const _amount = source.readBigNumber();
    return { $$type: 'Stake', leagueId: _leagueId, userId: _userId, amount: _amount };
}
function storeTupleStake(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeString(source.leagueId);
    builder.writeString(source.userId);
    builder.writeNumber(source.amount);
    return builder.build();
}
function dictValueParserStake() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeStake(src)).endCell());
        },
        parse: (src) => {
            return loadStake(src.loadRef().beginParse());
        }
    };
}
function storePayoutWinners(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(2704136465, 32);
        b_0.storeStringRefTail(src.leagueId);
        b_0.storeDict(src.winningPercentages, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257));
        b_0.storeDict(src.winners, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address());
        b_0.storeUint(src.count, 8);
        b_0.storeUint(src.commissionPercentage, 64);
    };
}
function loadPayoutWinners(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2704136465) {
        throw Error('Invalid prefix');
    }
    const _leagueId = sc_0.loadStringRefTail();
    const _winningPercentages = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257), sc_0);
    const _winners = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address(), sc_0);
    const _count = sc_0.loadUintBig(8);
    const _commissionPercentage = sc_0.loadUintBig(64);
    return { $$type: 'PayoutWinners', leagueId: _leagueId, winningPercentages: _winningPercentages, winners: _winners, count: _count, commissionPercentage: _commissionPercentage };
}
function loadTuplePayoutWinners(source) {
    const _leagueId = source.readString();
    const _winningPercentages = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257), source.readCellOpt());
    const _winners = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address(), source.readCellOpt());
    const _count = source.readBigNumber();
    const _commissionPercentage = source.readBigNumber();
    return { $$type: 'PayoutWinners', leagueId: _leagueId, winningPercentages: _winningPercentages, winners: _winners, count: _count, commissionPercentage: _commissionPercentage };
}
function loadGetterTuplePayoutWinners(source) {
    const _leagueId = source.readString();
    const _winningPercentages = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257), source.readCellOpt());
    const _winners = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address(), source.readCellOpt());
    const _count = source.readBigNumber();
    const _commissionPercentage = source.readBigNumber();
    return { $$type: 'PayoutWinners', leagueId: _leagueId, winningPercentages: _winningPercentages, winners: _winners, count: _count, commissionPercentage: _commissionPercentage };
}
function storeTuplePayoutWinners(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeString(source.leagueId);
    builder.writeCell(source.winningPercentages.size > 0 ? (0, core_1.beginCell)().storeDictDirect(source.winningPercentages, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeCell(source.winners.size > 0 ? (0, core_1.beginCell)().storeDictDirect(source.winners, core_1.Dictionary.Keys.BigInt(257), core_1.Dictionary.Values.Address()).endCell() : null);
    builder.writeNumber(source.count);
    builder.writeNumber(source.commissionPercentage);
    return builder.build();
}
function dictValueParserPayoutWinners() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storePayoutWinners(src)).endCell());
        },
        parse: (src) => {
            return loadPayoutWinners(src.loadRef().beginParse());
        }
    };
}
function storeWithdraw(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(195467089, 32);
        b_0.storeCoins(src.amount);
    };
}
function loadWithdraw(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 195467089) {
        throw Error('Invalid prefix');
    }
    const _amount = sc_0.loadCoins();
    return { $$type: 'Withdraw', amount: _amount };
}
function loadTupleWithdraw(source) {
    const _amount = source.readBigNumber();
    return { $$type: 'Withdraw', amount: _amount };
}
function loadGetterTupleWithdraw(source) {
    const _amount = source.readBigNumber();
    return { $$type: 'Withdraw', amount: _amount };
}
function storeTupleWithdraw(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}
function dictValueParserWithdraw() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeWithdraw(src)).endCell());
        },
        parse: (src) => {
            return loadWithdraw(src.loadRef().beginParse());
        }
    };
}
function storeLeagueCreated(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1156593961, 32);
        b_0.storeStringRefTail(src.leagueId);
    };
}
function loadLeagueCreated(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1156593961) {
        throw Error('Invalid prefix');
    }
    const _leagueId = sc_0.loadStringRefTail();
    return { $$type: 'LeagueCreated', leagueId: _leagueId };
}
function loadTupleLeagueCreated(source) {
    const _leagueId = source.readString();
    return { $$type: 'LeagueCreated', leagueId: _leagueId };
}
function loadGetterTupleLeagueCreated(source) {
    const _leagueId = source.readString();
    return { $$type: 'LeagueCreated', leagueId: _leagueId };
}
function storeTupleLeagueCreated(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeString(source.leagueId);
    return builder.build();
}
function dictValueParserLeagueCreated() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeLeagueCreated(src)).endCell());
        },
        parse: (src) => {
            return loadLeagueCreated(src.loadRef().beginParse());
        }
    };
}
function storeStakeEvent(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1638663196, 32);
        b_0.storeStringRefTail(src.leagueId);
        b_0.storeStringRefTail(src.userId);
        b_0.storeCoins(src.amount);
    };
}
function loadStakeEvent(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1638663196) {
        throw Error('Invalid prefix');
    }
    const _leagueId = sc_0.loadStringRefTail();
    const _userId = sc_0.loadStringRefTail();
    const _amount = sc_0.loadCoins();
    return { $$type: 'StakeEvent', leagueId: _leagueId, userId: _userId, amount: _amount };
}
function loadTupleStakeEvent(source) {
    const _leagueId = source.readString();
    const _userId = source.readString();
    const _amount = source.readBigNumber();
    return { $$type: 'StakeEvent', leagueId: _leagueId, userId: _userId, amount: _amount };
}
function loadGetterTupleStakeEvent(source) {
    const _leagueId = source.readString();
    const _userId = source.readString();
    const _amount = source.readBigNumber();
    return { $$type: 'StakeEvent', leagueId: _leagueId, userId: _userId, amount: _amount };
}
function storeTupleStakeEvent(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeString(source.leagueId);
    builder.writeString(source.userId);
    builder.writeNumber(source.amount);
    return builder.build();
}
function dictValueParserStakeEvent() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeStakeEvent(src)).endCell());
        },
        parse: (src) => {
            return loadStakeEvent(src.loadRef().beginParse());
        }
    };
}
function storePayoutEvent(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(1136431651, 32);
        b_0.storeStringRefTail(src.leagueId);
        b_0.storeAddress(src.winner);
        b_0.storeCoins(src.amount);
    };
}
function loadPayoutEvent(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1136431651) {
        throw Error('Invalid prefix');
    }
    const _leagueId = sc_0.loadStringRefTail();
    const _winner = sc_0.loadAddress();
    const _amount = sc_0.loadCoins();
    return { $$type: 'PayoutEvent', leagueId: _leagueId, winner: _winner, amount: _amount };
}
function loadTuplePayoutEvent(source) {
    const _leagueId = source.readString();
    const _winner = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'PayoutEvent', leagueId: _leagueId, winner: _winner, amount: _amount };
}
function loadGetterTuplePayoutEvent(source) {
    const _leagueId = source.readString();
    const _winner = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'PayoutEvent', leagueId: _leagueId, winner: _winner, amount: _amount };
}
function storeTuplePayoutEvent(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeString(source.leagueId);
    builder.writeAddress(source.winner);
    builder.writeNumber(source.amount);
    return builder.build();
}
function dictValueParserPayoutEvent() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storePayoutEvent(src)).endCell());
        },
        parse: (src) => {
            return loadPayoutEvent(src.loadRef().beginParse());
        }
    };
}
function storePayoutCompletedEvent(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeUint(979085414, 32);
        b_0.storeStringRefTail(src.leagueId);
    };
}
function loadPayoutCompletedEvent(slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 979085414) {
        throw Error('Invalid prefix');
    }
    const _leagueId = sc_0.loadStringRefTail();
    return { $$type: 'PayoutCompletedEvent', leagueId: _leagueId };
}
function loadTuplePayoutCompletedEvent(source) {
    const _leagueId = source.readString();
    return { $$type: 'PayoutCompletedEvent', leagueId: _leagueId };
}
function loadGetterTuplePayoutCompletedEvent(source) {
    const _leagueId = source.readString();
    return { $$type: 'PayoutCompletedEvent', leagueId: _leagueId };
}
function storeTuplePayoutCompletedEvent(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeString(source.leagueId);
    return builder.build();
}
function dictValueParserPayoutCompletedEvent() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storePayoutCompletedEvent(src)).endCell());
        },
        parse: (src) => {
            return loadPayoutCompletedEvent(src.loadRef().beginParse());
        }
    };
}
function storeLeaguePayout$Data(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeDict(src.leagues, core_1.Dictionary.Keys.BigInt(257), dictValueParserLeagueInfo());
        b_0.storeDict(src.stakes, core_1.Dictionary.Keys.BigInt(257), dictValueParserStakeInfo());
    };
}
function loadLeaguePayout$Data(slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _leagues = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), dictValueParserLeagueInfo(), sc_0);
    const _stakes = core_1.Dictionary.load(core_1.Dictionary.Keys.BigInt(257), dictValueParserStakeInfo(), sc_0);
    return { $$type: 'LeaguePayout$Data', owner: _owner, leagues: _leagues, stakes: _stakes };
}
function loadTupleLeaguePayout$Data(source) {
    const _owner = source.readAddress();
    const _leagues = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), dictValueParserLeagueInfo(), source.readCellOpt());
    const _stakes = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), dictValueParserStakeInfo(), source.readCellOpt());
    return { $$type: 'LeaguePayout$Data', owner: _owner, leagues: _leagues, stakes: _stakes };
}
function loadGetterTupleLeaguePayout$Data(source) {
    const _owner = source.readAddress();
    const _leagues = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), dictValueParserLeagueInfo(), source.readCellOpt());
    const _stakes = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.BigInt(257), dictValueParserStakeInfo(), source.readCellOpt());
    return { $$type: 'LeaguePayout$Data', owner: _owner, leagues: _leagues, stakes: _stakes };
}
function storeTupleLeaguePayout$Data(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeCell(source.leagues.size > 0 ? (0, core_1.beginCell)().storeDictDirect(source.leagues, core_1.Dictionary.Keys.BigInt(257), dictValueParserLeagueInfo()).endCell() : null);
    builder.writeCell(source.stakes.size > 0 ? (0, core_1.beginCell)().storeDictDirect(source.stakes, core_1.Dictionary.Keys.BigInt(257), dictValueParserStakeInfo()).endCell() : null);
    return builder.build();
}
function dictValueParserLeaguePayout$Data() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeLeaguePayout$Data(src)).endCell());
        },
        parse: (src) => {
            return loadLeaguePayout$Data(src.loadRef().beginParse());
        }
    };
}
function storeLeagueInfo(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeStringRefTail(src.leagueId);
        b_0.storeInt(src.commissionPercentage, 257);
        b_0.storeBit(src.feePaid);
        b_0.storeCoins(src.totalStaked);
    };
}
function loadLeagueInfo(slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _leagueId = sc_0.loadStringRefTail();
    const _commissionPercentage = sc_0.loadIntBig(257);
    const _feePaid = sc_0.loadBit();
    const _totalStaked = sc_0.loadCoins();
    return { $$type: 'LeagueInfo', owner: _owner, leagueId: _leagueId, commissionPercentage: _commissionPercentage, feePaid: _feePaid, totalStaked: _totalStaked };
}
function loadTupleLeagueInfo(source) {
    const _owner = source.readAddress();
    const _leagueId = source.readString();
    const _commissionPercentage = source.readBigNumber();
    const _feePaid = source.readBoolean();
    const _totalStaked = source.readBigNumber();
    return { $$type: 'LeagueInfo', owner: _owner, leagueId: _leagueId, commissionPercentage: _commissionPercentage, feePaid: _feePaid, totalStaked: _totalStaked };
}
function loadGetterTupleLeagueInfo(source) {
    const _owner = source.readAddress();
    const _leagueId = source.readString();
    const _commissionPercentage = source.readBigNumber();
    const _feePaid = source.readBoolean();
    const _totalStaked = source.readBigNumber();
    return { $$type: 'LeagueInfo', owner: _owner, leagueId: _leagueId, commissionPercentage: _commissionPercentage, feePaid: _feePaid, totalStaked: _totalStaked };
}
function storeTupleLeagueInfo(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeString(source.leagueId);
    builder.writeNumber(source.commissionPercentage);
    builder.writeBoolean(source.feePaid);
    builder.writeNumber(source.totalStaked);
    return builder.build();
}
function dictValueParserLeagueInfo() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeLeagueInfo(src)).endCell());
        },
        parse: (src) => {
            return loadLeagueInfo(src.loadRef().beginParse());
        }
    };
}
function storeStakeInfo(src) {
    return (builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.user);
        b_0.storeInt(src.amount, 257);
        b_0.storeBit(src.hasStaked);
    };
}
function loadStakeInfo(slice) {
    const sc_0 = slice;
    const _user = sc_0.loadAddress();
    const _amount = sc_0.loadIntBig(257);
    const _hasStaked = sc_0.loadBit();
    return { $$type: 'StakeInfo', user: _user, amount: _amount, hasStaked: _hasStaked };
}
function loadTupleStakeInfo(source) {
    const _user = source.readAddress();
    const _amount = source.readBigNumber();
    const _hasStaked = source.readBoolean();
    return { $$type: 'StakeInfo', user: _user, amount: _amount, hasStaked: _hasStaked };
}
function loadGetterTupleStakeInfo(source) {
    const _user = source.readAddress();
    const _amount = source.readBigNumber();
    const _hasStaked = source.readBoolean();
    return { $$type: 'StakeInfo', user: _user, amount: _amount, hasStaked: _hasStaked };
}
function storeTupleStakeInfo(source) {
    const builder = new core_1.TupleBuilder();
    builder.writeAddress(source.user);
    builder.writeNumber(source.amount);
    builder.writeBoolean(source.hasStaked);
    return builder.build();
}
function dictValueParserStakeInfo() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeStakeInfo(src)).endCell());
        },
        parse: (src) => {
            return loadStakeInfo(src.loadRef().beginParse());
        }
    };
}
function initLeaguePayout_init_args(src) {
    return (builder) => {
        const b_0 = builder;
    };
}
function LeaguePayout_init() {
    return __awaiter(this, void 0, void 0, function* () {
        const __code = core_1.Cell.fromHex('b5ee9c724102160100069e000114ff00f4a413f4bcf2c80b01020162021404c6d001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200019afa40f404f40455206c1396306d6df84259e204925f04e002d70d1ff2e0822182100d850c3dbae30221821056b4e77fbae302218210a12dd911bae3022182100ba69751ba03070a1102fe31d401d001d431d33ffa0030f8416f243032249b9320d74a91d5e868f90400da1181265d288101012359f40d6fa192306ddf206e92306d8e16d0fa40d401d001810101d700d200fa0055406c156f05e26ef2f47024c200923333e30d54443014700443138101015025c855405045ce02c8ce12cd810101cf00ca0001fa02c90406019630816a205134be13f2f4727088280406552010246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb007f5805002e000000004c6561677565204372656174696f6e204665650098103512206e953059f45a30944133f415e202c801821044f0392958cb1f01c8cecdc9c88258c000000000000000000000000101cb67ccc970fb0002c87f01ca0055205023cef400f400c9ed5401ea31d401d001d401d001fa0030f8416f243032249b9320d74a91d5e868f90400da11278101012259f40d6fa192306ddf206e92306d8e16d0fa40d401d001810101d700d200fa0055406c156f05e26f2581483c5189be18f2f4c85250cbff26cf16c9f9008200e41c2e8101012359f40d6fa192306ddf0801fc206e92306d8e10d0fa40810101d700d20055206c136f03e26ef2f451687f028101015023c855205023ce810101cf00ca00c9103e4170206e953059f45a30944133f415e2541876c85520821061ac041c5004cb1f02c8ce12cd01c8cecd01fa02c9c88258c000000000000000000000000101cb67ccc970fb005034a0458809007c81010109c855405045ce02c8ce12cd810101cf00ca0001fa02c910344550206e953059f45a30944133f415e258c87f01ca0055205023cef400f400c9ed5402fe31d401d001f404f404d307d33f30f8416f245b82008a343227c705f2f4249b9320d74a91d5e868f90400da11278101012259f40d6fa192306ddf206e92306d8e16d0fa40d401d001810101d700d200fa0055406c156f05e26f258200f27621c200f2f421998200ac8f27c000f2f4de5301b39327c2009170e2923730e30d700b0d01a6305207a8812710a9045166a126c2008ebf7270882e040a552010246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb009136e20c001c00000000436f6d6d697373696f6e02fc52088eef288101012259f40c6fa192306ddf810101545b0052404133f40c6fa19401d70030925b6de2c85280cbff22cf16c9f90081170e8101015612401359f40d6fa192306ddf206e92306d8e10d0fa40810101d700d20055206c136f03e26eb3f2f45280a8812710a90420c200915be30da4e4303535353544308101010e1001e8727088245134413310246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00545c22c85520821043bc92235004cb1f02c8ce12cdce01fa02c9c88258c000000000000000000000000101cb67ccc970fb0018a0070f0014000000005061796f757400ca505470c855405045ce02c8ce12cd810101cf00ca0001fa02c9103512206e953059f45a30944133f415e202c80182103a5ba86658cb1f01c8cecdc9c88258c000000000000000000000000101cb67ccc970fb0002c87f01ca0055205023cef400f400c9ed5402e68ee131fa0030f8416f245b8168c93223c705f2f472708824553010246d50436d03c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0002c87f01ca0055205023cef400f400c9ed54e0018210946a98b6bae3025f04f2c0821213001c000000005769746864726177616c00c2d33f30f84270804003c8018210aff90f5758cb1fcb3fc941305a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0002c87f01ca0055205023cef400f400c9ed540165a12885da89a1a4000335f481e809e808aa40d8272c60dadbf084b3c4aa05b678d86240dd2460db28de4ade0bc440dd2460dbbd150076810101019b9320d74a91d5e868f90400da11235959f40d6fa192306ddf206e92306d8e16d0fa40d401d001810101d700d200fa0055406c156f05e2af13d3b7');
        const builder = (0, core_1.beginCell)();
        builder.storeUint(0, 1);
        initLeaguePayout_init_args({ $$type: 'LeaguePayout_init_args' })(builder);
        const __data = builder.endCell();
        return { code: __code, data: __data };
    });
}
exports.LeaguePayout_errors = {
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
    26825: { message: "Only owner can withdraw" },
    27168: { message: "Insufficient fee sent" },
    35380: { message: "Only owner can payout" },
    44175: { message: "Fee paid, no commission allowed" },
    58396: { message: "User already staked" },
    62070: { message: "No funds in league" },
};
exports.LeaguePayout_errors_backward = {
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
    "Only owner can withdraw": 26825,
    "Insufficient fee sent": 27168,
    "Only owner can payout": 35380,
    "Fee paid, no commission allowed": 44175,
    "User already staked": 58396,
    "No funds in league": 62070,
};
const LeaguePayout_types = [
    { "name": "DataSize", "header": null, "fields": [{ "name": "cells", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "bits", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "refs", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }] },
    { "name": "SignedBundle", "header": null, "fields": [{ "name": "signature", "type": { "kind": "simple", "type": "fixed-bytes", "optional": false, "format": 64 } }, { "name": "signedData", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
    { "name": "StateInit", "header": null, "fields": [{ "name": "code", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "Context", "header": null, "fields": [{ "name": "bounceable", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "raw", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "SendParameters", "header": null, "fields": [{ "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "code", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
    { "name": "MessageParameters", "header": null, "fields": [{ "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
    { "name": "DeployParameters", "header": null, "fields": [{ "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "init", "type": { "kind": "simple", "type": "StateInit", "optional": false } }] },
    { "name": "StdAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 8 } }, { "name": "address", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "VarAddress", "header": null, "fields": [{ "name": "workchain", "type": { "kind": "simple", "type": "int", "optional": false, "format": 32 } }, { "name": "address", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "BasechainAddress", "header": null, "fields": [{ "name": "hash", "type": { "kind": "simple", "type": "int", "optional": true, "format": 257 } }] },
    { "name": "Deploy", "header": 2490013878, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "DeployOk", "header": 2952335191, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "CreateLeague", "header": 226823229, "fields": [{ "name": "leagueId", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "userId", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "commissionPercentage", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "feeAmount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "Stake", "header": 1454696319, "fields": [{ "name": "leagueId", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "userId", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "PayoutWinners", "header": 2704136465, "fields": [{ "name": "leagueId", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "winningPercentages", "type": { "kind": "dict", "key": "int", "value": "int" } }, { "name": "winners", "type": { "kind": "dict", "key": "int", "value": "address" } }, { "name": "count", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 8 } }, { "name": "commissionPercentage", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "Withdraw", "header": 195467089, "fields": [{ "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "LeagueCreated", "header": 1156593961, "fields": [{ "name": "leagueId", "type": { "kind": "simple", "type": "string", "optional": false } }] },
    { "name": "StakeEvent", "header": 1638663196, "fields": [{ "name": "leagueId", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "userId", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "PayoutEvent", "header": 1136431651, "fields": [{ "name": "leagueId", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "winner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "PayoutCompletedEvent", "header": 979085414, "fields": [{ "name": "leagueId", "type": { "kind": "simple", "type": "string", "optional": false } }] },
    { "name": "LeaguePayout$Data", "header": null, "fields": [{ "name": "owner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "leagues", "type": { "kind": "dict", "key": "int", "value": "LeagueInfo", "valueFormat": "ref" } }, { "name": "stakes", "type": { "kind": "dict", "key": "int", "value": "StakeInfo", "valueFormat": "ref" } }] },
    { "name": "LeagueInfo", "header": null, "fields": [{ "name": "owner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "leagueId", "type": { "kind": "simple", "type": "string", "optional": false } }, { "name": "commissionPercentage", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "feePaid", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "totalStaked", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "StakeInfo", "header": null, "fields": [{ "name": "user", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "amount", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "hasStaked", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
];
const LeaguePayout_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "CreateLeague": 226823229,
    "Stake": 1454696319,
    "PayoutWinners": 2704136465,
    "Withdraw": 195467089,
    "LeagueCreated": 1156593961,
    "StakeEvent": 1638663196,
    "PayoutEvent": 1136431651,
    "PayoutCompletedEvent": 979085414,
};
const LeaguePayout_getters = [
    { "name": "league", "methodId": 103490, "arguments": [{ "name": "id", "type": { "kind": "simple", "type": "string", "optional": false } }], "returnType": { "kind": "simple", "type": "LeagueInfo", "optional": true } },
];
exports.LeaguePayout_getterMapping = {
    'league': 'getLeague',
};
const LeaguePayout_receivers = [
    { "receiver": "internal", "message": { "kind": "typed", "type": "CreateLeague" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Stake" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "PayoutWinners" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Withdraw" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Deploy" } },
];
class LeaguePayout {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LeaguePayout_init();
        });
    }
    static fromInit() {
        return __awaiter(this, void 0, void 0, function* () {
            const __gen_init = yield LeaguePayout_init();
            const address = (0, core_1.contractAddress)(0, __gen_init);
            return new LeaguePayout(address, __gen_init);
        });
    }
    static fromAddress(address) {
        return new LeaguePayout(address);
    }
    constructor(address, init) {
        this.abi = {
            types: LeaguePayout_types,
            getters: LeaguePayout_getters,
            receivers: LeaguePayout_receivers,
            errors: exports.LeaguePayout_errors,
        };
        this.address = address;
        this.init = init;
    }
    send(provider, via, args, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = null;
            if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'CreateLeague') {
                body = (0, core_1.beginCell)().store(storeCreateLeague(message)).endCell();
            }
            if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'Stake') {
                body = (0, core_1.beginCell)().store(storeStake(message)).endCell();
            }
            if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'PayoutWinners') {
                body = (0, core_1.beginCell)().store(storePayoutWinners(message)).endCell();
            }
            if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'Withdraw') {
                body = (0, core_1.beginCell)().store(storeWithdraw(message)).endCell();
            }
            if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'Deploy') {
                body = (0, core_1.beginCell)().store(storeDeploy(message)).endCell();
            }
            if (body === null) {
                throw new Error('Invalid message type');
            }
            yield provider.internal(via, Object.assign(Object.assign({}, args), { body: body }));
        });
    }
    getLeague(provider, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const builder = new core_1.TupleBuilder();
            builder.writeString(id);
            const source = (yield provider.get('league', builder.build())).stack;
            const result_p = source.readTupleOpt();
            const result = result_p ? loadTupleLeagueInfo(result_p) : null;
            return result;
        });
    }
}
exports.LeaguePayout = LeaguePayout;
LeaguePayout.storageReserve = 0n;
LeaguePayout.errors = exports.LeaguePayout_errors_backward;
LeaguePayout.opcodes = LeaguePayout_opcodes;
