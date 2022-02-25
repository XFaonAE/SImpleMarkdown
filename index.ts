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
}

enum DefaultClasses {
    Kit,
    SystemCat
}

export class Parser {
    lexer: Lexer;

    constructor(md: string) {
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

        const done = doneChar.repeat((progressPercent * process.stdout.columns / 2) / 100);
        process.stdout.write(done + " " + progressPercent + "% { CurrentToken = " + this.lexer.cursorIndex + "; MaxTokens = " + this.lexer.tokens.length + " } \r")
    }

    parse(): string {
        let result = "";

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

        while (tokenIndex < this.lexer.tokens.length - 1) {
            const token = this.lexer.tokens[tokenIndex];

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
