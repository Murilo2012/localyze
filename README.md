# Localyze · site

Site da Localyze: vídeo, foto, sites e gestão de redes sociais para negócios de Canoas e região.
Equipe: Murilo Andrade e Leonardo Luz. Só HTML, CSS e JavaScript: não precisa de build nem de servidor.

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

O site está publicado em https://localyze.pages.dev/ e atualiza sozinho a cada envio para a `main`.
Se um dia mudar o endereço, troque `localyze.pages.dev` no `index.html`.

## Onde mudar as coisas

| O quê | Onde |
|---|---|
| Textos, serviços, perguntas | `index.html` |
| Telefone do WhatsApp | `index.html` (links `wa.me/5551989006644`) e `script.js` (linha `var ZAP`) |
| Instagram | `index.html` (procure `localyze0`) |
| Cores | `style.css`, bloco `:root` no começo (`--azul` é o azul de destaque, `--preto` o fundo) |
| Fotos | pasta `img/` (formato `.webp`) |
| Imagem da prévia do link | `img/og.jpg` (1200 × 630) |

## O que o site faz

- Visual escuro (preto e azul-marinho) com azul vivo de destaque.
- Todos os botões de WhatsApp já abrem com mensagem pronta; cada serviço tem a sua.
- Formulário "Monte sua mensagem": junta nome, tipo de negócio e o que a pessoa precisa
  e abre o WhatsApp com tudo escrito. Não guarda nenhum dado.
- No celular, aparece um botão fixo de WhatsApp depois da abertura.
- Página `404.html` para links quebrados e `_headers` com cache das fontes e imagens.

## Fontes
Barlow e Barlow Condensed (licença SIL OFL), hospedadas na pasta `fonts/`.
