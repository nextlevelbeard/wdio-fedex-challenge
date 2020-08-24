module.exports = {
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
    },
    plugins: ["wdio", "eslint-plugin-import"],
    extends: ["eslint:recommended", "plugin:wdio/recommended"],
    settings: {
        "import/resolver": {
            "babel-module": {},
        },
    },
    rules: {
        "arrow-parens": ["error", "as-needed"],
        "comma-dangle": ["error", "never"],
        "no-multiple-empty-lines": ["error", { "max": 1 }],
        "lines-between-class-members": ["error", "always"],
		"no-console": ["error"],
		"getter-return": "error",
		yoda: "error",
		indent: ["error", "tab", { "SwitchCase": 1 }]

    },
    env: {
        node: true,
        es6: true,
        mocha: true,
    },
    globals: {
        browser: true,
        window: true,
        $: true,
        $$: true,
        expect: true,
        describe: true,
        it: true,
		supplyDB: true,
		modelDB: true
    },
};
