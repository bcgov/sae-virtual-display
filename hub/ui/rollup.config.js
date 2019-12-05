import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';

const env = process.env.NODE_ENV;
const isProduction = env === 'production';

export default {
  input: 'src/index.js',
  output: {
    file: './assets/js/bundle.js',
    format: 'iife',
    name: 'workbench',
    sourcemap: true,
  },
  plugins: [
    resolve({
      browser: true,
      extensions: ['.mjs', '.js', '.jsx', '.json'],
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    babel({
      plugins: [
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-class-properties',
        'transform-react-remove-prop-types',
      ],
      exclude: 'node_modules/**',
    }),
    json({
      include: 'node_modules/**',
    }),
    commonjs({
      include: ['node_modules/**'],
      exclude: ['node_modules/process-es6/**'],
      namedExports: {
        exenv: ['canUseDOM'],
        humps: ['camelizeKeys', 'decamelizeKeys'],
        'react-is': ['ForwardRef', 'isElement', 'isValidElementType'],
        react: [
          'Children',
          'Component',
          'PropTypes',
          'cloneElement',
          'createContext',
          'createElement',
          'PureComponent',
          'forwardRef',
          'useCallback',
          'useContext',
          'useEffect',
          'useReducer',
          'useRef',
          'useState',
        ],
        'react-dom': ['createPortal', 'findDOMNode', 'render'],
      },
    }),
    isProduction && terser(),
  ],
};
