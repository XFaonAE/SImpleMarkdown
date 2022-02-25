import EventEmitter from "events";

export interface Token {
    value: string;
    line: number;
    column: number;
    index: number;
}

export class Lexer {
    public raw: string;

    public tokens: Token[] = [];

    public cursorIndex = 0;

    constructor(contents: string) {
        this.raw = contents.replace(/\r\n/g, "\n");
        const chars = (this.raw + '\n').split("");
        let currentLine = 0;
        let currentChar = 0;

        const reset = () => {
            currentLine++;
            currentChar = 0;
        }

        chars.forEach((char, index) => {
            if (char === "\n") {
                this.tokens.push({
                    value: char,
                    line: currentLine,
                    column: 0,
                    index
                });

                reset();
            } else {
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

    peek(relativeIndex: number) {
        if (relativeIndex === 0) {
            return this.tokens[this.cursorIndex];
        }

        const selected = this.tokens[this.cursorIndex + relativeIndex];

        if (!selected && this.cursorIndex + relativeIndex < 0) {
            return this.tokens[0];
        } else if (!selected && this.cursorIndex + relativeIndex > this.tokens.length - 1) {
            return this.tokens[this.tokens.length - 1];
        }

        return selected;
    }
}

enum Reserved {
    IF = 'When',
    ELSE = 'OtherWise',
    WHILE = 'KeepDoing',
    ELSEIF = 'OtherWiseIf',
    INT = 'NumberUwU',
    STRING = 'StringUwU',
    BOOLEAN = 'BooleanUwU',
    VERSION = "VERSION"
}

enum DefaultClasses {
    Kit,
    SystemCat
}

export class Parser extends EventEmitter {
    lexer: Lexer;

    constructor(md: string) {
        super();
        this.lexer = new Lexer(md);
    }

    #err(token: Token, res: string) {
        console.log(`Error: ${res} \n  at line ${token.line} column ${token.column}\n`);
        
        const lineTokens = this.lexer.tokens.filter(t => t.line === token.line).map(tkn => tkn.value);
        console.log(`  ${lineTokens.join('')}${' '.repeat(token.column)}^ ~~~`)

        console.log(`\nPlease check your source code`);
        process.exit(1);
    }

    printPercent() {
        const progressPercent = Math.floor((this.lexer.cursorIndex / this.lexer.tokens.length) * 100);
        const doneChar = "#";
        const todoChar = " ";

        const done = /* doneChar.repeat((progressPercent * process.stdout.columns / 2) / 100) */ "";
        const notDone = /* todoChar.repeat((process.stdout.columns / 2) - (progressPercent * process.stdout.columns / 2) / 100); */ ""

        process.stdout.write(done + notDone + " " + progressPercent + "% { CurrentToken = " + this.lexer.cursorIndex + "; MaxTokens = " + this.lexer.tokens.length + " } \r")
    }

    parse(): string {
        const state = {
            string: {
                open: false,
                value: ""
            },
            keyword: {
                open: false,
                name: null as Reserved | null,
                fParam: "",
                stageArg: 0
            },
            parsingLine: 0,
            isComment: false,
            commentLine: 0,
            comment: ""
        }

        const comments = [] as string[];
        let tokenIndex = 0;
        let jumperTokens = 1;
        let result = "";

        this.lexer.tokens.forEach((token, index) => {
            console.log("\n" + "DEBUG: LOEX " + index)
            console.log("\n" + "DEBUG: LOEX " + index)
            console.log("\n" + "DEBUG: LOEX " + index)
            console.log("\n" + "DEBUG: LOEX " + index)

            if (!state.isComment && !state.string.open && !state.keyword.open && (
                this.lexer.peek(-1).value === '/'
                && token.value === '/'
            )) {
                state.isComment = true;
                state.commentLine = token.line;
            } else if (state.isComment && state.commentLine === token.line &&  this.lexer.cursorIndex !== this.lexer.tokens.length - 1 && token.value !== '\n') {
                state.comment += token.value;
            } else if (state.isComment && (state.commentLine !== token.line || this.lexer.cursorIndex === this.lexer.tokens.length - 1 || token.value === '\n')) {
                comments.push(state.comment);
                state.isComment = false;

                result += `//${state.comment}\n`;
                state.comment = "";
            } else if (
                !state.keyword.open 
                && this.lexer.peek(-14)?.value === "V" 
                && this.lexer.peek(-13)?.value === "e" 
                && this.lexer.peek(-12)?.value === "r"
                && this.lexer.peek(-11)?.value === "s"
                && this.lexer.peek(-10)?.value === "i"
                && this.lexer.peek(-9)?.value === "o"
                && this.lexer.peek(-8)?.value === "n"
                && this.lexer.peek(-7)?.value === ":"
                && this.lexer.peek(-6)?.value === ":"
                && this.lexer.peek(-5)?.value === "l"
                && this.lexer.peek(-4)?.value === "o"
                && this.lexer.peek(-3)?.value === "g"
                && this.lexer.peek(-2)?.value === "("
                && this.lexer.peek(-1)?.value === ")"
                && this.lexer.peek(0)?.value === ";"
            ) {
                state.keyword.open = false;
                state.keyword.name = Reserved.VERSION;
                state.keyword.fParam = "";
                state.keyword.stageArg = 0;

                result += `console.log("Version: Unknown");\n`;
            }

            this.printPercent();
            this.printPercent();
            this.printPercent();
            this.printPercent();
            this.lexer.cursorIndex++;
        });

        console.log("\n" + result)
        this.emit('write', result);
        return ">> DONE";
    }
}
