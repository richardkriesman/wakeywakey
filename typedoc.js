module.exports = {
    "disableOutputCheck": true,
    "exclude": [
        "**/__tests__/*",
        "**/__mocks__/*",
        "src/navigation/*" // no modules, stop being annoying about it typedoc -sL
    ],
    "excludeExternals": true,
    "excludeNotExported": true,
    "mode": "modules",
    "name": "WakeyWakey",
    "out": "docs",
    "target": "ES6"
};
