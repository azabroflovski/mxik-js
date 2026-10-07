# mxik-mcp

MCP server for [tasnif.soliq.uz](https://tasnif.soliq.uz): lets Claude, Cursor and other AI assistants search MXIK (ИКПУ) codes, the national catalogue of goods and services of Uzbekistan.

Unofficial, not affiliated with the Tax Committee of Uzbekistan or tasnif.soliq.uz. Built on the [`mxik`](https://www.npmjs.com/package/mxik) client.

## Setup

Requires Node.js 20 or newer.

**Claude Code**

```sh
claude mcp add mxik -- npx -y mxik-mcp
```

**Claude Desktop**, **Cursor** and other clients with a JSON config (`claude_desktop_config.json`, `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "mxik": {
      "command": "npx",
      "args": ["-y", "mxik-mcp"]
    }
  }
}
```

## Tools

| Tool                   | What it does                                                        |
| ---------------------- | ------------------------------------------------------------------- |
| `search_mxik_codes`    | Full-text search by product name, brand or code                     |
| `filter_mxik_codes`    | Find codes by barcode, brand, words or exact code                   |
| `search_product_types` | Generic codes for a product type, without a brand                   |
| `get_mxik_card`        | Card of a code: catalog names, barcode, tax benefit, package units  |
| `browse_catalog`       | Walk the catalog tree from groups down to codes                     |
| `get_tax_benefit`      | Tax benefit by id, with the legal document that grants it           |

Results are cached in memory for an hour.

## Example prompts

- "Find the MXIK code for Maccoffee 3in1 20g sachets"
- "Which MXIK code has barcode 6934177746536?"
- "What tax benefit applies to code 03004999096001001?"

## Good to know

The tasnif.soliq.uz API may not respond to servers outside Uzbekistan. Run the server on a machine that can reach it.

## License

[MIT](https://github.com/azabroflovski/mxik-js/blob/master/LICENSE)
