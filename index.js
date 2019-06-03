/**
 * @fileoverview Rule to disallow switch usage and replace it by a Map
 * @author Alexandre Morgaut
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "disallow switch usage",
            category: "Best Practices Errors",
            recommended: true,
            url: "https://eslint.org/docs/rules/no-switch"
        },
        fixable: "code",
        schema: [] // no options
    },
    create(context) {
        const s = context.getSourceCode();
        const multicase = new Map();

        function getPrevious() {
            const {size} = multicase;
            if (!size) {
                return null;
            }
            return Array.from(multicase.entries())[size - 1];
        }

        function getStatementsCode(statements) {
            return statements
                .map(statement => {
                    const pad = ' '.repeat(statement.loc.start.column);
                    return `${pad}${s.getText(statement)}`;
                })
                .join('\n');
        }

        function getCode({test, consequent = []}) {
            if (!consequent.length) {
                const previous = getPrevious();
                if (!previous || !previous[1]) {
                    multicase.set(test, null);
                    return null;
                } else {
                    multicase.set(test, `${getStatementsCode(previous[1])}`);
                    return `casesHandlers.get(${s.getText(previous[0])})`;
                }
            }

            const statements = consequent[0].type === 'BlockStatement' ?
                consequent[0].body :
                consequent;

            if (!statements.find(statement => statement.type === 'BreakStatement')) {
                // multicase.forEach((v, k) => {
                // });
                multicase.set(test, statements);
                return null;
            }

            return getStatementsCode(statements)
                .replace(/\n\s*break;$/, '')
                .replace('break;', 'return;')
        }

        return {
            SwitchStatement(node) {
                context.report({
                    node,
                    message: 'Do not use Switch Statements',

                    fix(fixer) {
                        let needAwait = false;
                        const condition = s.getText(node.discriminant);
                        const cases = node.cases.filter(c => c.test).map(function (currentCase) {
                            const name = s.getText(currentCase.test);
                            let code = getCode(currentCase);
                            let isAsync = false;
                            if (!code) {
                                return '';
                            }
                            /*
                            multicase.forEach((v, k)=> {
                              code = `${code}
                casesHandlers.get(${s.getText(k)})()`
                            });
                            */
                            if (code.match(/await/)) {
                                needAwait = true;
                                isAsync = true;
                            }
                            return `    casesHandlers.add(
            ${name},
            ${isAsync ? 'async ' : ''}function () {
    ${code}
            }
        );
    `
                        }).join('\n');
                        const def = getCode(node.cases.find(c => !c.test));
                        return [
                            fixer.replaceText(node, `
        // TODO: Try to put that handlers map out of the current function if possible
        // stack: ${''}
        const casesHandlers = new Map();
    
    ${cases}
        const handler = casesHandlers.get(${condition}) || function () {${def}};
    
        ${needAwait ? 'await ' : ''}handler();
    `)
                        ];
                    },
                });
            }
        };
    }
};
