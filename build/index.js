"use strict";
var _Parser_instances, _Parser_err;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.Lexer = void 0;
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
})(Reserved || (Reserved = {}));
var DefaultClasses;
(function (DefaultClasses) {
    DefaultClasses[DefaultClasses["Kit"] = 0] = "Kit";
    DefaultClasses[DefaultClasses["SystemCat"] = 1] = "SystemCat";
})(DefaultClasses || (DefaultClasses = {}));
class Parser {
    constructor(md) {
        _Parser_instances.add(this);
        this.lexer = new Lexer(md);
    }
    printPercent() {
        const progressPercent = Math.floor((this.lexer.cursorIndex / this.lexer.tokens.length) * 100);
        const doneChar = "#";
        const todoChar = " ";
        const done = doneChar.repeat((progressPercent * process.stdout.columns / 2) / 100);
        process.stdout.write(done + " " + progressPercent + "% { CurrentToken = " + this.lexer.cursorIndex + "; MaxTokens = " + this.lexer.tokens.length + " } \r");
    }
    parse() {
        let result = "";
        const state = {
            string: {
                open: false,
                value: ""
            },
            keyword: {
                open: false,
                name: null,
                fParam: "",
                stageArg: 0
            },
            parsingLine: 0,
            isComment: false,
            commentLine: 0,
            comment: ""
        };
        const comments = [];
        let tokenIndex = 0;
        while (tokenIndex < this.lexer.tokens.length - 1) {
            const token = this.lexer.tokens[tokenIndex];
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
            if (!state.keyword.open) {
            }
            this.lexer.cursorIndex++;
            this.printPercent();
            tokenIndex++;
        }
        return result;
    }
}
exports.Parser = Parser;
_Parser_instances = new WeakSet(), _Parser_err = function _Parser_err(token, res) {
    console.log(`Error: ${res} \n  at line ${token.line} column ${token.column}\n`);
    const lineTokens = this.lexer.tokens.filter(t => t.line === token.line).map(tkn => tkn.value);
    console.log(`  ${lineTokens.join('')}${' '.repeat(token.column)}^ ~~~`);
    console.log(`\nPlease check your source code`);
    process.exit(1);
};
