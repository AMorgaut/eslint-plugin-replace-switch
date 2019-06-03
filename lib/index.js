
/**
 * @fileoverview An ESLint rule to disallow and fix switch statements
 * @author Alexandre Morgaut
 */
'use strict';

const reqAll = require('req-all');
const createIndex = require('create-eslint-index');
const rules = reqAll('rules', {camelize: false});

const recommendedRules = createIndex.createConfig({
    plugin: 'replace-switch',
    field: 'meta.docs.recommended'
}, rules);

module.exports = {
    rules,
    configs: {
        recommended: {
            rules: Object.assign({}, recommendedRules)
        }
    }
};