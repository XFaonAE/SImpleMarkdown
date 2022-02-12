/**
 * Script entry class
 */
export default class Main {
    toHTML(markdown) {
        const lines = markdown.split('\n');
        const state = {
            string: {
                open: false,
                result: '',
            },
            pred: '',
            predC: false,
            prev: '',
            rules: {},
            resultHTML: '',
        };

        lines.forEach((line, index) => {
            const chars = line.split("");

            chars.forEach((char, charID) => {
                if (charID === 0 && char === '#') {
                    state.pred = 'h1';
                    const maxExtensions = 5;
                    let extension = 1;

                    const checkNextExtension = () => {
                        if (extension > 6) {
                            state.pred = 'p';
                        } else if (chars[charID + extension] === '#') {
                            extension++;
                            state.pred = `h${charID + extension}`;
                            checkNextExtension();
                        } else if (chars[charID + extension] === ' ') {
                            state.predC = true;
                        }
                    }
                    checkNextExtension();

                    if (state.pred && !line.startsWith('#'.repeat(extension) + ' ')) {
                        state.pred = 'p';
                    }

                    console.log(state.pred, state.predC, '#'.repeat(extension) + ' ');
                }
            });
        });

        return state.resultHTML;
    }
}
