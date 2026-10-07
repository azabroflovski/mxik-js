#!/usr/bin/env node
import process from 'node:process'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createMxik } from 'mxik'
import { createServer } from './server'

createServer(createMxik({ cache: true }))
  .connect(new StdioServerTransport())
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
