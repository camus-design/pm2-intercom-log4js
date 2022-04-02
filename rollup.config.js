import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import eslint from '@rollup/plugin-eslint';
import del from 'rollup-plugin-delete';

const src = 'src';
const dist = 'dist';

export default {
  input: `${src}/index.ts`,
  output: {
    file: `${dist}/index.min.js`,
    format: 'cjs',
    exports: 'auto',
  },
  plugins: [
    eslint(),
    del({ targets: `${dist}/*` }),
    typescript(),
    json(),
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    terser(),
  ],
};
