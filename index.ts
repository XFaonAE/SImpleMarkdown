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
        const chars = this.raw.split("");
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

export class Parser {
    lexer: Lexer;

    constructor(md: string) {
        this.lexer = new Lexer(md);
    }

    #err(token: Token) {
        console.log(`Error at line: ${token.line} column: ${token.column}`);
        
        const lineTokens = this.lexer.tokens.filter(t => t.line === token.line).map(tkn => tkn.value);
        console.log(`  ${lineTokens.join('')}`)

        console.log(`  ${' '.repeat(token.column)}^ ~~~`);
    }

    parse(): string {
        let result = "";

        this.lexer.tokens.forEach((token) => {
            if (token.value === 'u' && this.lexer.peek(1).value === 'w' && this.lexer.peek(2).value === 'u') {
                this.#err(token);
            }
            
            this.lexer.cursorIndex++;
        });

        return result;
    }
}
