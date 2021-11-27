module.exports = {
    "root": true,
    "extends": [
        "airbnb",
        "airbnb-typescript",
        "airbnb/hooks"
    ],
    "parserOptions": {
        "project": './tsconfig.json',
    },
    "rules": {
        "@typescript-eslint/comma-dangle": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/indent": ["error", 4],
        "@typescript-eslint/lines-between-class-members": "off",
        "@typescript-eslint/no-explicit-any": "error",
        "arrow-parens": "off",
        "comma-dangle": "off",
        "curly": ["error", "multi"],
        "implicit-arrow-linebreak": "off",
        "import/no-extraneous-dependencies": "off",
        "import/no-unresolved": "off",
        "import/prefer-default-export": "off",
        "indent": ["error", 4],
        "lines-between-class-members": "off",
        "max-classes-per-file": "off",
        "max-len": ["error", { "code": 150 }],
        "no-plusplus": "off",
        "no-undef": "off",
        "no-underscore-dangle": "off",
        "nonblock-statement-body-position": "off",
        "object-curly-newline": ["error", { "multiline": true, "consistent": true }],
        "padded-blocks": "off",
        "react/jsx-fragments": "off",
        "react/jsx-indent-props": ["error", 4],
        "react/jsx-indent": ["error", 4],
        "react/jsx-one-expression-per-line": "off",
        "react/jsx-props-no-spreading": "off",
        "react/prefer-stateless-function": "off",
        "react/prop-types": "off",
        "react/require-default-props": "off"
    },
    "env": {
        "node": true,
        "jest": true,
        "browser": true
    }
}
