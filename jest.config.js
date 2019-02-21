module.exports = {
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "ios.ts",
        "ios.tsx",
        "android.ts",
        "android.tsx"
    ],
    "preset": "jest-expo",
    "testMatch": undefined, // unset jest-expo's matching
    "testRegex": "(/__tests__/.*|/src/.*\\.(test|spec))\\.(jsx?|tsx?)$",
    "transform": {
        "^.+\\.jsx?$": "<rootDir>/node_modules/babel-jest",
        "^.+\\.tsx?$": "ts-jest"
    }
};
