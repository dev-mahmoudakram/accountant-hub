# Laravel Boost Setup Notes For Accountant Hub

Use this file as a helper when connecting Laravel Boost to Codex / Claude / other AI agents.

## 1. Install Laravel Boost In The Laravel Backend

From the Laravel backend directory:

```bash
composer require laravel/boost --dev
php artisan boost:install
```

Then follow the installation prompts for your AI tool.

## 2. Start / Use Boost MCP

Laravel Boost exposes an MCP server through Artisan.

Typical command:

```bash
php artisan boost:mcp
```

## 3. Codex MCP Config Example

For Codex, you may need a project-level or global MCP config.

Example `.codex/config.toml`:

```toml
[mcp_servers.laravel-boost]
command = "php"
args = ["artisan", "boost:mcp"]
cwd = "X:\\path\\to\\accountant-hub\\backend"
enabled = true
```

If Codex cannot detect PHP correctly on Windows, use the absolute PHP path:

```toml
[mcp_servers.laravel-boost]
command = "C:\\laragon\\bin\\php\\php-8.4.0\\php.exe"
args = ["artisan", "boost:mcp"]
cwd = "X:\\path\\to\\accountant-hub\\backend"
enabled = true
```

Adjust paths based on your local setup.

## 4. What The AI Agent Must Use Boost For

Before editing Laravel code, the agent should use Boost to:

- Read application info
- Inspect routes
- Inspect database schema
- Search Laravel documentation
- Check logs/errors
- Run or inspect Artisan commands
- Avoid guessing Laravel-specific implementation details

## 5. Prompt Add-On

Paste this at the end of your Codex/Claude prompt:

```txt
Laravel Boost is enabled for this project. Before changing Laravel backend code, use the available Boost MCP tools to inspect app info, routes, database schema, logs, and Laravel documentation. Do not guess Laravel APIs. Use Boost context first, then implement using Laravel best practices.
```
