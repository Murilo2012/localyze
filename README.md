# Localyze · site

Site de foto e vídeo (Canoas e região). Só HTML, CSS e JavaScript: não precisa de build nem de servidor.

## Publicar no Cloudflare Pages (grátis)

1. Crie uma conta em https://dash.cloudflare.com
2. Vá em **Workers & Pages → Create application → Pages → Connect to Git** e escolha este repositório.
3. Configure:
   - **Project name:** vira o endereço (`nome.pages.dev`)
   - **Production branch:** `main`
   - **Framework preset:** None
   - **Build command:** deixe vazio
   - **Build output directory:** deixe vazio (o site está na raiz)
4. Salve. Em um ou dois minutos o site abre em `https://nome.pages.dev`.

Depois de saber o endereço final, troque `localyze.pages.dev` no `index.html` (procure por ele,
aparece 2 vezes) pelo endereço real. Isso faz a prévia do link aparecer certa no WhatsApp.

## Onde mudar as coisas

| O quê | Onde |
|---|---|
| Textos, serviços, perguntas | `index.html` |
| Telefone do WhatsApp | `index.html` (links `wa.me/5551989006644`) e `script.js` (linha `var ZAP`) |
| Cores | `style.css`, bloco `:root` no começo (`--azul` é o azul claro) |
| Fotos | pasta `img/` (formato `.webp`) |
| Seção "Trabalhos" (desligada) | `index.html`, `<section id="trabalhos" hidden>`: apague `hidden` e coloque as fotos |
| Imagem da prévia do link | `img/og.jpg` (1200 × 630) |

## O que o site faz

- Tema claro (azul) e escuro, com botão para trocar; a escolha fica salva no aparelho.
- Todos os botões de WhatsApp já abrem com mensagem pronta; cada serviço tem a sua.
- Formulário "Monte sua mensagem": junta nome, tipo de negócio e o que a pessoa precisa
  e abre o WhatsApp com tudo escrito. Não guarda nenhum dado.
- No celular, aparece um botão fixo de WhatsApp depois da abertura.
- Página `404.html` para links quebrados e `_headers` com cache das fontes e imagens.

## Fontes
Barlow e Barlow Condensed (licença SIL OFL), hospedadas na pasta `fonts/`.
