"use strict";
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
        this.lexer = new Lexer(md);
    }
    parse() {
        let result = "";
        let i = 0;
        this.lexer.tokens.forEach(() => {
            process.stdout.write(this.lexer.peek(i).value);
            i++;
        });
        return result;
    }
}
exports.Parser = Parser;
