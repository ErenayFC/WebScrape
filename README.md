# WebScrape

A modern web scraping library with Zod schema validation for type-safe data extraction.

## Features

- Intelligent web scraping with schema validation
- Type-safe data extraction using Zod schemas
- Built with Bun for optimal performance
- Robust error handling and validation
- Clean and intuitive API
- AI-powered content extraction
- Automatic result saving with UUID naming

## Installation

```bash
bun install
```

## Quick Start

```bash
bun run start
```

## Configuration

- Edit the `src/config.ts` file,
- Or edit the `.env` file (Recommended).

## API Reference

### `Provider`

Main scraping class that handles AI-powered content extraction.

#### Methods

- `init()` - Initialize the provider
- `generateSchema(zodSchema)` - Convert Zod schema to extraction format
- `sendMessage(page, schema)` - Extract data from page using schema

### Schema Definition

Use Zod schemas to define the structure of data you want to extract:

```typescript
const schema = z.object({
  products: z.array(z.object({
    name: z.string(),
    price: z.number(),
    rating: z.number().min(0).max(5)
  })).describe("List of products on the page")
});
```

## Performance

- Automatic performance tracking
- Configurable timeouts and wait conditions
- Efficient memory usage with proper cleanup

## Error Handling

The library includes comprehensive error handling for:
- Network timeouts
- Invalid schemas
- Parsing failures
- Browser automation errors

## Requirements

- Bun v1.2.17+
- Node.js 18+ (if using Node.js runtime)
- Puppeteer for browser automation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

This project is inspired by [llm-scraper](https://github.com/mishushakov/llm-scraper) by [mishushakov](https://github.com/mishushakov). Portions of the scraping logic are derived from the original implementation.

## License

MIT License - see [LICENSE.md](LICENSE.md) for details.

---

**Built with ❤️ by [Erenay](https://erenaydev.com.tr) in Turkey**