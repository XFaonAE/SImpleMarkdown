"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Parser_instances, _Parser_err;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.Lexer = void 0;
const events_1 = __importDefault(require("events"));
class Lexer {
    constructor(contents) {
        this.tokens = [];
        this.cursorIndex = 0;
        this.raw = contents.replace(/\r\n/g, "\n");
        const chars = (this.raw + '\n').split("");
        let currentLine = 0;
        let currentChar = 0;
        const reset = () => {
            currentLine++;
            currentChar = 0;
        };
        chars.forEach((char, index) => {
            if (char === "\n") {
                this.tokens.push({
                    value: char,
                    line: currentLine,
                    column: 0,
                    index
                });
                reset();
            }
            else {
                this.tokens.push({
                    value: char,
                    line: currentLine,
                    column: currentChar,
                    index
                });
                currentChar++;
            }
        });
    }
    peek(relativeIndex) {
        if (relativeIndex === 0) {
            return this.tokens[this.cursorIndex];
        }
        const selected = this.tokens[this.cursorIndex + relativeIndex];
        if (!selected && this.cursorIndex + relativeIndex < 0) {
            return this.tokens[0];
        }
        else if (!selected && this.cursorIndex + relativeIndex > this.tokens.length - 1) {
            return this.tokens[this.tokens.length - 1];
        }
        return selected;
    }
}
exports.Lexer = Lexer;
var Reserved;
(function (Reserved) {
    Reserved["IF"] = "When";
    Reserved["ELSE"] = "OtherWise";
    Reserved["WHILE"] = "KeepDoing";
    Reserved["ELSEIF"] = "OtherWiseIf";
    Reserved["INT"] = "NumberUwU";
    Reserved["STRING"] = "StringUwU";
    Reserved["BOOLEAN"] = "BooleanUwU";
    Reserved["VERSION"] = "VERSION";
})(Reserved || (Reserved = {}));
var DefaultClasses;
(function (DefaultClasses) {
    DefaultClasses[DefaultClasses["Kit"] = 0] = "Kit";
    DefaultClasses[DefaultClasses["SystemCat"] = 1] = "SystemCat";
})(DefaultClasses || (DefaultClasses = {}));
class Parser extends events_1.default {
    constructor(md) {
        super();
        _Parser_instances.add(this);
        this.lexer = new Lexer(md);
    }
    printPercent() {
        const progressPercent = Math.floor((this.lexer.cursorIndex / this.lexer.tokens.length) * 100);
        const doneChar = "#";
        const todoChar = " ";
        const done = /* doneChar.repeat((progressPercent * process.stdout.columns / 2) / 100) */ "";
        const notDone = /* todoChar.repeat((process.stdout.columns / 2) - (progressPercent * process.stdout.columns / 2) / 100); */ "";
        process.stdout.write(done + notDone + " " + progressPercent + "% { CurrentToken = " + this.lexer.cursorIndex + "; MaxTokens = " + this.lexer.tokens.length + " } \r");
    }
    parse() {
        const state = {
            string: {
                open: false,
                value: ""
            },
            keyword: {
                open: false,
                name: null,
                fParam: "",
                stageArg: 0,
                expect: []
            },
            parsingLine: 0,
            isComment: false,
            commentLine: 0,
            comment: ""
        };
        const comments = [];
        let tokenIndex = 0;
        let jumperTokens = 1;
        let result = [
            `const __c_kittens__ = {`,
            `  version: "1.0.0-dev.0",`,
            `  variables: {},`,
            `}\n`
        ].join("\n");
        this.lexer.tokens.forEach((token, index) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
            if (!state.isComment && !state.string.open && !state.keyword.open && (this.lexer.peek(-1).value === '/'
                && token.value === '/')) {
                state.isComment = true;
                state.commentLine = token.line;
            }
            else if (state.isComment && state.commentLine === token.line && this.lexer.cursorIndex !== this.lexer.tokens.length - 1 && token.value !== '\n') {
                state.comment += token.value;
            }
            else if (state.isComment && (state.commentLine !== token.line || this.lexer.cursorIndex === this.lexer.tokens.length - 1 || token.value === '\n')) {
                comments.push(state.comment);
                state.isComment = false;
                result += `//${state.comment}\n`;
                state.comment = "";
            }
            else if (!state.keyword.open
                && ((_a = this.lexer.peek(-14)) === null || _a === void 0 ? void 0 : _a.value) === "V"
                && ((_b = this.lexer.peek(-13)) === null || _b === void 0 ? void 0 : _b.value) === "e"
                && ((_c = this.lexer.peek(-12)) === null || _c === void 0 ? void 0 : _c.value) === "r"
                && ((_d = this.lexer.peek(-11)) === null || _d === void 0 ? void 0 : _d.value) === "s"
                && ((_e = this.lexer.peek(-10)) === null || _e === void 0 ? void 0 : _e.value) === "i"
                && ((_f = this.lexer.peek(-9)) === null || _f === void 0 ? void 0 : _f.value) === "o"
                && ((_g = this.lexer.peek(-8)) === null || _g === void 0 ? void 0 : _g.value) === "n"
                && ((_h = this.lexer.peek(-7)) === null || _h === void 0 ? void 0 : _h.value) === ":"
                && ((_j = this.lexer.peek(-6)) === null || _j === void 0 ? void 0 : _j.value) === ":"
                && ((_k = this.lexer.peek(-5)) === null || _k === void 0 ? void 0 : _k.value) === "l"
                && ((_l = this.lexer.peek(-4)) === null || _l === void 0 ? void 0 : _l.value) === "o"
                && ((_m = this.lexer.peek(-3)) === null || _m === void 0 ? void 0 : _m.value) === "g"
                && ((_o = this.lexer.peek(-2)) === null || _o === void 0 ? void 0 : _o.value) === "("
                && ((_p = this.lexer.peek(-1)) === null || _p === void 0 ? void 0 : _p.value) === ")"
                && ((_q = this.lexer.peek(0)) === null || _q === void 0 ? void 0 : _q.value) === ";") {
                state.keyword.open = false;
                state.keyword.name = Reserved.VERSION;
                state.keyword.fParam = "";
                state.keyword.stageArg = 0;
                result += `console.log(__c_kittens__.version);\n`;
            }
            else if (!state.keyword.open && token.value === 'K') {
                state.keyword.open = true;
                state.keyword.name = null;
                state.keyword.expect = ["i"];
            }
            else if (state.keyword.open && state.keyword.name === null && JSON.stringify(state.keyword.expect) === JSON.stringify(["i"]) && state.keyword.expect.indexOf(token.value) == -1) {
                __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_err).call(this, token, `Unexpected token '${token.value}'`);
            }
            else if (state.keyword.open && state.keyword.name === null && JSON.stringify(state.keyword.expect) === JSON.stringify(["i"]) && state.keyword.expect.indexOf(token.value) !== -1) {
                state.keyword.expect = ["t"];
            }
            else if (state.keyword.open && state.keyword.name === null && JSON.stringify(state.keyword.expect) === JSON.stringify(["t"]) && state.keyword.expect.indexOf(token.value) == -1) {
                __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_err).call(this, token, `Unexpected token '${token.value}'`);
            }
            else if (state.keyword.open && state.keyword.name === null && JSON.stringify(state.keyword.expect) === JSON.stringify(["t"]) && state.keyword.expect.indexOf(token.value) !== -1) {
                state.keyword.expect = [":"];
            }
            else if (state.keyword.open && state.keyword.name === null && JSON.stringify(state.keyword.expect) === JSON.stringify([":"]) && state.keyword.expect.indexOf(token.value) == -1) {
                __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_err).call(this, token, `Unexpected token '${token.value}'`);
            }
            else if (state.keyword.open && state.keyword.name === null && JSON.stringify(state.keyword.expect) === JSON.stringify([":"]) && state.keyword.expect.indexOf(token.value) !== -1) {
                state.keyword.expect = ["m"];
            }
            else if (state.keyword.open && state.keyword.name === null && JSON.stringify(state.keyword.expect) === JSON.stringify([":"]) && state.keyword.expect.indexOf(token.value) == -1) {
                __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_err).call(this, token, `Unexpected token '${token.value}'`);
            }
            else if (state.keyword.open && state.keyword.name === null && JSON.stringify(state.keyword.expect) === JSON.stringify([":"]) && state.keyword.expect.indexOf(token.value) !== -1) {
                if (((_r = this.lexer.peek(1)) === null || _r === void 0 ? void 0 : _r.value) === "m"
                    && ((_s = this.lexer.peek(2)) === null || _s === void 0 ? void 0 : _s.value) === "e"
                    && ((_t = this.lexer.peek(3)) === null || _t === void 0 ? void 0 : _t.value) === "o"
                    && ((_u = this.lexer.peek(4)) === null || _u === void 0 ? void 0 : _u.value) === "w") {
                }
                else {
                    __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_err).call(this, token, `Unexpected method char '${token.value}'`);
                }
            }
            this.printPercent();
            this.printPercent();
            this.printPercent();
            this.printPercent();
            this.lexer.cursorIndex++;
        });
        console.log("\n" + result);
        this.emit('write', result);
        return ">> DONE";
    }
}
exports.Parser = Parser;
_Parser_instances = new WeakSet(), _Parser_err = function _Parser_err(token, res) {
    console.log(`\nError: ${res} \n  at line ${token.line} column ${token.column}\n`);
    const lineTokens = this.lexer.tokens.filter(t => t.line === token.line).map(tkn => tkn.value);
    console.log(`  ${lineTokens.join('')}${' '.repeat(token.column)}^ ~~~`);
    console.log(`\nPlease check your source code`);
    process.exit(1);
};
