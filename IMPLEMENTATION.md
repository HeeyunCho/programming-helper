# IMPLEMENTATION: Programming Expert

## Overview
A knowledge-based MCP server that catalogs official resources and idiomatic guidance for various programming languages.

## Tools (Methods)

### 1. `get_language_guidance`
**Description**: Returns a curated set of resources for a chosen language.
- **Parameters**:
  - `language` (enum): `java`, `go`, `c`, `cpp`, `javascript`, `typescript`, `nodejs`, `python`, `powershell`.
- **Returns**: A report with official documentation URLs, grammar specs, best practices, and common patterns.

### 2. `get_pattern_guidance`
**Description**: Provides language-specific implementation advice for a design pattern.
- **Parameters**:
  - `language` (enum): Same as above.
  - `pattern` (string): The name of the pattern.
- **Returns**: Implementation guidance focused on language-specific idioms (e.g., RAII in C++ vs. Context Managers in Python).

### 3. `ping`
**Description**: Simple diagnostic tool.
- **Returns**: "pong".

## Resource Registry
The server maintains an internal `LANGUAGE_RESOURCES` dictionary with validated links to official documentation (Oracle, MDN, Go.dev, etc.).
