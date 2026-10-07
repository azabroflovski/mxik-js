# MCP server

`mxik-mcp` — [MCP](https://modelcontextprotocol.io) server: u bilan Claude, Cursor va boshqa AI yordamchilar MXIK kodlarini oʻzlari qidiradi. “Shu shtrix-kod uchun MXIK kodini top” deb soʻrang, yordamchi APIʼga oʻzi murojaat qiladi.

Bu alohida paket, shuning uchun `mxik` kutubxonasi bogʻliqliklarsiz qoladi. Server rasmiy [MCP Registry](https://registry.modelcontextprotocol.io/v0/servers?search=io.github.azabroflovski/mxik)da `io.github.azabroflovski/mxik` nomi bilan roʻyxatdan oʻtgan.

## Ulash {#setup}

tasnif.soliq.uzga ulana oladigan kompyuterda Node.js 20 yoki undan yangisi kerak.

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

Claude Desktop uchun JSON `claude_desktop_config.json`ga, Cursor uchun `.cursor/mcp.json`ga qoʻshiladi.

## Instrumentlar {#tools}

| Instrument             | Nima qiladi                                                         |
| ---------------------- | ------------------------------------------------------------------- |
| `search_mxik_codes`    | Mahsulot nomi, brend yoki kod boʻyicha toʻliq matnli qidiruv        |
| `filter_mxik_codes`    | Shtrix-kod, brend, soʻzlar yoki aniq kod boʻyicha kodlarni topish   |
| `search_product_types` | Mahsulot turining brendsiz umumiy kodlari                           |
| `get_mxik_card`        | Kod kartochkasi: katalogdagi nomlar, shtrix-kod, imtiyoz, qadoqlar  |
| `browse_catalog`       | Katalog daraxtini guruhlardan kodlargacha aylanib chiqish           |
| `get_tax_benefit`      | id boʻyicha imtiyoz va uni belgilovchi hujjat                       |

Model kontekstini tejash uchun instrumentlar boʻsh maydonlarsiz ixcham JSON qaytaradi. Natijalar xotirada bir soat keshlanadi.

## Soʻrov misollari {#example-prompts}

- Maccoffee 3in1 20 g paketchalari uchun MXIK kodini top
- 6934177746536 shtrix-kodli mahsulotning MXIK kodi qaysi?
- 03004999096001001 kodiga qaysi imtiyoz qoʻllaniladi?
- “Kofe” sinfining subpozitsiyalarini koʻrsat
