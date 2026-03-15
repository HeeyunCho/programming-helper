import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
const server = new Server({ name: "programming-expert", version: "1.0.0" }, { capabilities: { tools: {} } });
const LANGUAGE_RESOURCES = {
    "java": {
        official: "https://docs.oracle.com/en/java/javase/",
        grammar: "https://docs.oracle.com/javase/specs/jls/se21/html/index.html",
        best_practices: "https://www.oracle.com/java/technologies/javase/codeconventions-introduction.html",
        common_patterns: "Abstract Factory, Singleton, Observer, Decorator"
    },
    "go": {
        official: "https://go.dev/doc/",
        grammar: "https://go.dev/ref/spec",
        best_practices: "https://go.dev/doc/effective_go",
        common_patterns: "Producer-Consumer, Fan-out/Fan-in, Options Pattern"
    },
    "c": {
        official: "https://en.cppreference.com/w/c",
        grammar: "https://www.iso.org/standard/74528.html (ISO/IEC 9899)",
        best_practices: "https://users.ece.cmu.edu/~eno/coding/CCodingStandard.html",
        common_patterns: "Opaque Pointers, Function Tables (Polymorphism), State Machines"
    },
    "cpp": {
        official: "https://en.cppreference.com/w/cpp",
        grammar: "https://isocpp.org/std/the-standard",
        best_practices: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines",
        common_patterns: "RAII, CRTP, SFINAE, Pimpl idiom"
    },
    "javascript": {
        official: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        grammar: "https://tc39.es/ecma262/",
        best_practices: "https://github.com/airbnb/javascript",
        common_patterns: "Module pattern, Prototype pattern, Revealing Module"
    },
    "typescript": {
        official: "https://www.typescriptlang.org/docs/",
        grammar: "https://github.com/microsoft/TypeScript/blob/main/doc/spec.md",
        best_practices: "https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html",
        common_patterns: "Discriminated Unions, Generic Mixins, Exhaustive checking"
    },
    "nodejs": {
        official: "https://nodejs.org/en/docs/",
        grammar: "https://nodejs.org/api/",
        best_practices: "https://github.com/goldbergyoni/nodebestpractices",
        common_patterns: "Middleware, EventEmitter, Callback/Promises, Streams"
    },
    "python": {
        official: "https://docs.python.org/3/",
        grammar: "https://docs.python.org/3/reference/grammar.html",
        best_practices: "https://peps.python.org/pep-0008/",
        common_patterns: "Decorators, Context Managers, Iterators/Generators"
    },
    "powershell": {
        official: "https://learn.microsoft.com/en-us/powershell/scripting/overview",
        grammar: "https://learn.microsoft.com/en-us/powershell/scripting/lang-spec/about-language-spec",
        best_practices: "https://github.com/PoshCode/PowerShellPracticeAndStyle",
        common_patterns: "Pipeline-ready functions, ErrorActionPreference usage, Splatting"
    }
};
const LanguageSchema = z.object({
    language: z.enum(["java", "go", "c", "cpp", "javascript", "typescript", "nodejs", "python", "powershell"]).describe("The programming language to get information for"),
});
const PatternSchema = z.object({
    language: z.enum(["java", "go", "c", "cpp", "javascript", "typescript", "nodejs", "python", "powershell"]),
    pattern: z.string().describe("The name of the design pattern (e.g., Singleton, RAII)"),
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_language_guidance",
                description: "Get official documentation, grammar specs, and best practices for a specific programming language.",
                inputSchema: {
                    type: "object",
                    properties: {
                        language: {
                            type: "string",
                            enum: ["java", "go", "c", "cpp", "javascript", "typescript", "nodejs", "python", "powershell"],
                            description: "The target language"
                        },
                    },
                    required: ["language"],
                },
            },
            {
                name: "get_pattern_guidance",
                description: "Get guidance on idiomatic design patterns for a specific language.",
                inputSchema: {
                    type: "object",
                    properties: {
                        language: { type: "string", enum: ["java", "go", "c", "cpp", "javascript", "typescript", "nodejs", "python", "powershell"] },
                        pattern: { type: "string", description: "The pattern to look up" }
                    },
                    required: ["language", "pattern"],
                },
            },
            {
                name: "ping",
                description: "Simple ping to verify server status.",
                inputSchema: { type: "object", properties: {} },
            }
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === "ping") {
        return { content: [{ type: "text", text: "pong" }] };
    }
    if (name === "get_language_guidance") {
        const { language } = LanguageSchema.parse(args);
        const data = LANGUAGE_RESOURCES[language];
        const text = `Expert Guidance for ${language.toUpperCase()}:
- Official Documentation: ${data.official}
- Formal Grammar/Spec: ${data.grammar}
- Industry Best Practices: ${data.best_practices}
- Idiomatic Patterns: ${data.common_patterns}

Note: To ensure grammatical and logical correctness, always cross-reference your implementation with the Formal Grammar/Spec above.`;
        return { content: [{ type: "text", text }] };
    }
    if (name === "get_pattern_guidance") {
        const { language, pattern } = PatternSchema.parse(args);
        const data = LANGUAGE_RESOURCES[language];
        const text = `Design Pattern [${pattern}] for ${language.toUpperCase()}:
Implementing '${pattern}' in ${language} should follow the language-specific idioms and best practices.
Refer to: ${data.best_practices} for more context on idiomatic structures in ${language}.
For ${language}, it is particularly important to handle ${language === 'cpp' ? 'memory safety (RAII)' : language === 'go' ? 'composition and error handling' : 'the language-specific runtime model'} correctly.`;
        return { content: [{ type: "text", text }] };
    }
    throw new Error(`Tool not found: ${name}`);
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch(console.error);
