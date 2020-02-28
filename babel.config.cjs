const presets = [
    [
        "@babel/env", {    
            "useBuiltIns": "entry",
            "corejs": {
                "version": "3.6.4",
                "proposals": false
            },
            "targets": "ie 10"
        }
    ]
];

const plugins = [];

module.exports = { presets, plugins };