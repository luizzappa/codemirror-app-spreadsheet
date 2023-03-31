import { nodeResolve } from "@rollup/plugin-node-resolve"
import typescript from "rollup-plugin-ts"
import serve from 'rollup-plugin-serve'

export default {
  input: "./src/editor.ts",
  output: {
    file: "./dist/editor.bundle.js",
    format: "iife",
  },
  plugins: [
    typescript(),
    nodeResolve(),
    serve({
      open: true,
      verbose: true,
      contentBase: ['demo', 'dist'],
      host: 'localhost',
      port: 10001
    }),
  ],
};