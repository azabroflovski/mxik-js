import { expect, test } from 'bun:test'
import pkg from '../package.json' with { type: 'json' }
import server from '../server.json' with { type: 'json' }

test('server.json matches package.json', () => {
  expect(server.name).toBe(pkg.mcpName)
  expect(server.version).toBe(pkg.version)
  expect(server.packages[0].identifier).toBe(pkg.name)
  expect(server.packages[0].version).toBe(pkg.version)
})
