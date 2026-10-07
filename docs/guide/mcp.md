# MCP server

`mxik-mcp` is an [MCP](https://modelcontextprotocol.io) server: it lets Claude, Cursor and other AI assistants search MXIK codes on their own. Ask "find the MXIK code for this barcode" and the assistant calls the API for you.

It's a separate package, so the `mxik` library stays free of dependencies. It's listed in the official [MCP Registry](https://registry.modelcontextprotocol.io/v0/servers?search=io.github.azabroflovski/mxik) as `io.github.azabroflovski/mxik`.

## Setup

Requires Node.js 20 or newer on a machine that can reach tasnif.soliq.uz.

::: code-group

```sh [Claude Code]
claude mcp add mxik -- npx -y mxik-mcp
```

```json [Claude Desktop, Cursor]
{
  "mcpServers": {
    "mxik": {
      "command": "npx",
      "args": ["-y", "mxik-mcp"]
    }
  }
}
```

:::

For Claude Desktop the JSON goes into `claude_desktop_config.json`, for Cursor into `.cursor/mcp.json`.

## Tools

| Tool                   | What it does                                                        |
| ---------------------- | ------------------------------------------------------------------- |
| `search_mxik_codes`    | Full-text search by product name, brand or code                     |
| `filter_mxik_codes`    | Find codes by barcode, brand, words or exact code                   |
| `search_product_types` | Generic codes for a product type, without a brand                   |
| `get_mxik_card`        | Card of a code: catalog names, barcode, tax benefit, package units  |
| `browse_catalog`       | Walk the catalog tree from groups down to codes                     |
| `get_tax_benefit`      | Tax benefit by id, with the legal document that grants it           |

Tools return compact JSON without empty fields, to save the model's context. Results are cached in memory for an hour.

## Example prompts

- Find the MXIK code for Maccoffee 3in1 20g sachets
- Which MXIK code has barcode 6934177746536?
- What tax benefit applies to code 03004999096001001?
- Show the sub-positions of the coffee class
