#!/usr/bin/env node
import process from 'node:process'
import pkg from '../../package.json' with { type: 'json' }
import { createMxik } from '../client'
import { run } from './run'

const code = await run(process.argv.slice(2), {
  mxik: lang => createMxik({ lang }),
  stdout: line => console.log(line),
  stderr: line => console.error(line),
  version: pkg.version,
})
process.exitCode = code
