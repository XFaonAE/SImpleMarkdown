"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Parser_instances, _Parser_err;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.Lexer = void 0;
class Lexer {
    constructor(contents) {
        this.tokens = [];
        this.cursorIndex = 0;
        this.raw = contents.replace(/\r\n/g, "\n");
        const chars = this.raw.split("");
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
class Parser {
    constructor(md) {
        _Parser_instances.add(this);
        this.lexer = new Lexer(md);
    }
    parse() {
        let result = "";
        this.lexer.tokens.forEach((token) => {
            if (token.value === 'u' && this.lexer.peek(1).value === 'w' && this.lexer.peek(2).value === 'u') {
                __classPrivateFieldGet(this, _Parser_instances, "m", _Parser_err).call(this, token);
            }
            this.lexer.cursorIndex++;
        });
        return result;
    }
}
exports.Parser = Parser;
_Parser_instances = new WeakSet(), _Parser_err = function _Parser_err(token) {
    console.log(`Error at line: ${token.line} column: ${token.column}`);
    const lineTokens = this.lexer.tokens.filter(t => t.line === token.line).map(tkn => tkn.value);
    console.log(`  ${lineTokens.join('')}`);
    console.log(`  ${' '.repeat(token.column)}^ ~~~`);
};
