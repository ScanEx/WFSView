import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-porter';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
// import cpy from 'rollup-plugin-cpy';
// import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
    {
        input: './src/browser.js',
        output: {
            file: pkg.browser,
            format: 'iife',
            sourcemap: true,
            name: 'WFS_WMS',
            globals: {
                leaflet: 'L',     
            }
        },
        plugins: [
            svelte(),        
            resolve(),
            commonjs(),
            json(),
            css({dest: 'public/main.css', minified: true}),
            babel({                
                extensions: ['.js','.mjs','.svelte'],
                include: ['src/**','node_modules/svelte/**']
            }),
            // terser(),
        ]
    },
    {
        input: './src/main.js',
        output: {
            file: pkg.main,
            format: 'umd',
            sourcemap: true, 
            name: 'WFS_WMS',
            globals: {
                leaflet: 'L',     
            }           
        },
        external: ['leaflet'],
        plugins: [
            svelte(),        
            resolve(),
            commonjs(),
            json(),
            css({dest: pkg.css, minified: true}),
            babel({                
                extensions: ['.js','.mjs','.svelte'],
                include: ['src/**','node_modules/svelte/**']
            }),
            // terser(),
        ]
    }
];
