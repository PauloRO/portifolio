# Portfólio — Paulo Oliveira

Este é meu site pessoal em Angular 21: uma single-page para apresentar meu perfil, experiência e projetos. Tudo é responsivo, com animações suaves, navegação fixa e modal para ver detalhes dos projetos. O build já sai pronto para SSR, então posso publicar como site estático ou rodar em Node.

## O que você encontra
- Hero com animação “typewriter”, CTA para baixar meu currículo e falar comigo.
- Seções “Sobre”, “Experiência”, “Projetos”, “Tecnologias” e “Contato” em uma página.
- Grid de projetos com pré-visualização e modal de detalhes usando Angular Signals.
- Navegação fixa no desktop e barra inferior dedicada para mobile.
- Animações de entrada via `IntersectionObserver`, respeitando quem prefere menos movimento.

## Stack e arquitetura
- Angular 21 (standalone), TypeScript e SCSS.
- SSR via `@angular/ssr` (`outputMode: server`).
- Estilos principais em `src/app/app.scss`, tema escuro/esmeralda.
- Dados e layout em `src/app/app.ts` e `src/app/app.html`.
- Imagens e currículo em `src/assets` e `public/assets`.

## Rodando localmente
Pré-requisitos: Node 20+ (npm 11 incluso) e npm instalado.

```bash
npm install          # instala dependências
npm start            # ng serve em modo dev (http://localhost:4200)
```

## Build e execução
```bash
npm run build                     # build otimizado (browser + server em dist/portifolio)
npm run serve:ssr:portifolio      # serve a versão SSR (node dist/portifolio/server/server.mjs)
```

- Para deploy estático, publico `dist/portifolio/browser`.
- Para deploy SSR/Node, uso `dist/portifolio/server/server.mjs` (ou container conforme a infra).

## Testes
```bash
npm test   # Vitest integrado pelo Angular CLI
```

## Scripts disponíveis
- `npm start` — servidor de desenvolvimento com recarregamento automático.
- `npm run build` — build de produção (gera browser e server).
- `npm run serve:ssr:portifolio` — serve o bundle SSR gerado em `dist`.
- `npm test` — roda a suíte de testes unitários.
