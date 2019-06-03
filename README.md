# eslint-plugin-replace-switch

[![Build Status](https://travis-ci.org/AMorgaut/eslint-plugin-replace-switch.svg?branch=master)](https://travis-ci.org/AMorgaut/eslint-plugin-replace-switch)
[![npm version](https://badge.fury.io/js/eslint-plugin-replace-switch.svg)](https://www.npmjs.com/package/eslint-plugin-replace-switch)

ESLint rule for disallowing the switch statement AND FIX IT

## Why

- Complexity: 
  - Lot of rules and with syntaxes that can conflict with each others. 
  - Code analyser calculating cyclomatic complexity ([Plato](https://github.com/es-analysis/plato)/[escomplex](https://github.com/escomplex/complexity-report), [eslint complexity rule](https://eslint.org/docs/rules/complexity)) will handle each 'case' as an additional complexity (at least by default for escomplex)
  - Using other approaches often allow to better handle each cases, including the default one
- Performances:
  - JIT (Just-in-Time) JavaScript compilers are 'function based', and `switch` block can include code for a lot of cases that may not need to be handled in most common usages -> handling each case in dedicated functions can help

There is plenty of plugins to disallow the switch statement usage:

- [The "smells" plugin from Elijah Manor](https://github.com/elijahmanor/eslint-plugin-smells/blob/master/docs/rules/no-switch.md)
- [The SonarJS "no-small" rule](https://github.com/SonarSource/eslint-plugin-sonarjs/blob/master/docs/rules/no-small-switch.md) *(based on MISRA C/C++ guidelines)*
- [The "no-switch-statements" rule from Andreas Wiedel](https://github.com/Kaishiyoku/eslint-plugin-no-switch-statements)

The goal of this one, in addition, is to try **to help you to refactor your code** without "switch".

## Install

```bash
npm install --save-dev eslint eslint-plugin-replace-switch
```

## Usage

Configure it in `package.json`.

<!-- EXAMPLE_CONFIGURATION:START -->
```json
{
  "name": "my-awesome-project",
  "eslintConfig": {
    "plugins": [
      "replace-switch"
    ],
    "rules": {
      "replace-switch/replace-switch": "error"
    }
  }
}
```
<!-- EXAMPLE_CONFIGURATION:END -->

## Recommended configuration

This plugin exports a [`recommended` configuration](lib/index.js) that enforces good practices.

To enable this configuration, use the `extends` property in your `package.json`.

```json
{
  "name": "my-awesome-project",
  "eslintConfig": {
    "plugins": [
      "replace-switch"
    ],
    "extends": "plugin:replace-switch/recommended"
  }
}
```

See [ESLint documentation](http://eslint.org/docs/user-guide/configuring#extending-configuration-files) for more information about extending configuration files.

ISC © [Alexandre Morgaut](https://github.com/AMorgaut)
