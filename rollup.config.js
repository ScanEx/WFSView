import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { eslint } from 'rollup-plugin-eslint';
import json from 'rollup-plugin-json';
import css from 'rollup-plugin-css-porter';
import babel from 'rollup-plugin-babel';
// import cpy from 'rollup-plugin-cpy';
// import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
    {
        input: './src/index.js',
        output: {
            file: pkg.browser,
            format: 'iife',
            sourcemap: true,
            name: 'WFSV',
        },
        plugins: [
            svelte(),        
            resolve(),
            commonjs(),
            json(),
            css({dest: 'public/main.css', minified: true}),
            eslint(),
            // cpy({
            //     files: ['src/*.png'],
            //     dest: 'wwwroot'
            // }),
            babel({
                include: ['src/**'],
                exclude: 'node_modules/**'
            }),
            // terser(),
        ]
    },
    {
        input: './src/View.svelte',
        output: {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,            
        },
        plugins: [
            svelte(),        
            resolve(),
            commonjs(),
            json(),
            css({dest: 'dist/main.css', minified: true}),
            eslint(),
            // cpy({
            //     files: ['src/*.png'],
            //     dest: 'wwwroot'
            // }),
            babel({
                include: ['src/**'],
                exclude: 'node_modules/**'
            }),
            // terser(),
        ]
    }
];
