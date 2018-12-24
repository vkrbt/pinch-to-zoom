import typescript from 'rollup-plugin-typescript';

import pkg from './package.json'

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'iife',
            name: 'pinchToZoom'
        },
        {
            file: pkg.module,
            format: 'es',
        },
    ],
    plugins: [
        typescript(),
    ]
};