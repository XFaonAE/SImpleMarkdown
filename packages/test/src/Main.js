import Parser from '@simple-md-xfaon/parser';
import cliHTML from 'cli-html';

const markdown = `
#Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
####### Heading 7
This is some text.
This is some text with a [link](https://www.google.com).
This is some text with a [link](https://www.google.com) and a [link](https://www.google.com) in the middle.
[This is a link](https://www.google.com)
`;

/**
 * Script entry class
 */
export default class Main {
    /**
     * Script entry method
     */
    constructor() {
        const parser = new Parser();
        console.log(cliHTML(parser.toHTML(markdown)));
    }
}

new Main();
