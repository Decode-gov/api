import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/**/*.ts", "!src/**/*.test.ts"],
	format: ["esm"],
	dts: false, // Desabilitar geração de .d.ts para evitar conflitos
	splitting: false,
	sourcemap: true,
	clean: true,
	// Não fazer bundle de dependências externas e módulos nativos do Node.js
	noExternal: [],
	external: [
		// Prisma
		"@prisma/client",
		".prisma/client",
		// Todos os módulos do node_modules
		/^[^./]|^\.[^./]|^\.\.[^/]/,
	],
	// Mantém os imports dinâmicos
	shims: false,
	platform: "node",
	target: "node20",
	// Não minificar para facilitar debug em produção se necessário
	minify: false,
});
