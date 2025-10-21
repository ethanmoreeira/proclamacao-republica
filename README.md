# Eco da República — Proclamação da República do Brasil (1889)

Projeto acadêmico de Desenvolvimento de Web Sites — site educativo e acessível sobre a Proclamação da República do Brasil (1889), com foco em leitura confortável, organização visual histórica moderna e navegação simples.

– © 2025 Italo&Rakel

## Índice

- [Destaques do Projeto (2025)](#destaques-do-projeto-2025)
- [Páginas](#páginas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Tecnologias](#tecnologias)
- [Instalação e Execução](#instalação-e-execução)
- [Acessibilidade](#acessibilidade)
- [SEO e PWA](#seo-e-pwa)
- [Suporte e Contato](#suporte-e-contato)
- [Direitos Autorais](#direitos-autorais)
- [Roadmap](#roadmap-próximos-passos)

## Destaques do Projeto (2025)

- **Nova identidade**: nome do site atualizado para “Eco da República” e tipografia histórica legível (Cinzel para títulos, Merriweather/Open Sans para textos).
- **Página inicial**:
  - Hero com texto mais legível (cores otimizadas + sombras).
  - Carrossel animado com 12 bandeiras históricas do Brasil (1500-1889) em movimento horizontal contínuo.
  - Esquema didático visual mostrando causas, processo e consequências da Proclamação.
  - Seção "Áudio" com fundo verde-bandeira e brasão sutil ao fundo.
- **História** (`historia.html`):
  - Removidos controles interativos (ficou navegação por rolagem apenas).
  - Texto organizado em parágrafos curtos para melhor leitura.
  - Imagens reduzidas (600px e 450px) para melhor proporção na página.
  - Correção histórica: Barão de Ladário descrito como preso pelas tropas republicanas.
  - Adição: "A família imperial embarca no navio Alagoas rumo ao exílio na Europa".
  - Inclusão de imagens: Constituição de 1891 e "República da Espada/Primeira República".
- **Personagens** (`personagens.html`):
  - Fundo verde claro (#C8E6A0) aplicado em toda a página.
  - 8 personagens com biografias completas: Deodoro, Benjamin, Rui Barbosa, Quintino, Patrocínio, Floriano, Dom Pedro II e Princesa Isabel.
  - Cards com fundo branco semitransparente, imagem à esquerda (380px) e texto à direita.
  - Modal "Detalhar" com fundo amarelo forte (#FFE066) para destaque e legibilidade.
- **Galeria** (`galeria.html`):
  - Títulos "Ala" removidos; mantida estrutura em grades temáticas.
  - Descrições enriquecidas com contexto histórico de cada imagem.
  - Todas as imagens preservadas sem duplicação.
- **Quiz** (`quiz.html`):
  - Expandido de 5 para 10 questões educativas.
  - Resultado e explicações detalhadas apenas ao final do quiz.
  - Sistema de pontuação e feedback personalizado.
- **Documentos e Contato**:
  - Fundo "verde abacate" aplicado em todas as páginas.
  - Contato: informações atualizadas (e-mail, WhatsApp, localização).
  - Fontes: adicionado ao menu de navegação em todas as páginas.
- **Organização de arquivos**:
  - Todas as imagens de conteúdo movidas para `images/conteudo/`.
  - Imagens da galeria em `images/galeria/`.
  - Backgrounds em `images/site/backgrounds/`.
  - Caminhos atualizados em todos os arquivos HTML.

## Páginas

### Início (`index.html`)
- Hero com tipografia legível e contraste reforçado
- Carrossel horizontal animado com 12 bandeiras históricas do Brasil (1500-1889)
- Animação contínua com pausa no hover e loop infinito
- Esquema didático visual mostrando processo, proclamação e consequências
- Seção de áudio com fundo verde-bandeira e brasão sutil

### História (`historia.html`)
- Linha do tempo navegável por rolagem (controles removidos)
- Texto dividido em parágrafos curtos para melhor legibilidade
- Imagens otimizadas com tamanhos reduzidos (600px e 450px)
- Correções históricas e novas imagens (1891 e "República da Espada")

### Personagens (`personagens.html`)
- Fundo verde claro (#C8E6A0) aplicado em toda a página
- 8 personagens com biografias completas
- Cards com fundo branco semitransparente para melhor organização visual
- Modal com fundo amarelo forte (#FFE066) para melhor legibilidade

### Documentos (`documentos.html`)
- Fundo "verde abacate" padronizado
- Documentos visuais da época organizados em grid
- Caminhos de imagens atualizados para `images/conteudo/`

### Galeria (`galeria.html`)
- Títulos "Ala" removidos; mantida estrutura em grades temáticas
- Descrições enriquecidas com contexto histórico
- Todas as imagens preservadas sem duplicação

### Quiz (`quiz.html`)
- 10 questões educativas sobre a Proclamação
- Resultado e explicações detalhadas apenas no final do quiz
- Sistema de pontuação e feedback personalizado

### Fontes (`fontes.html`)
- Bibliografia completa e fontes primárias
- Adicionado ao menu de navegação

### Contato (`contato.html`)
- Informações atualizadas: e-mail, WhatsApp e localização
- Formulário de contato acessível
- Seção de perguntas frequentes

## Estrutura do Projeto

```
proclamacao-republica-site/
├── audio/
│   └── Hino da Proclamação da República.mp3
├── css/
│   ├── styles.css          # Estilos principais (hero, cards, páginas, modal, etc.)
│   ├── timeline.css        # Estilos da timeline de História
│   └── a11y.css            # Estilos de acessibilidade
├── images/
│   ├── conteudo/           # Imagens de conteúdo das páginas (personagens, documentos, história)
│   ├── galeria/            # Imagens da galeria (grades temáticas)
│   └── site/
│       ├── backgrounds/    # Fundos (ex.: hero, seções)
│       └── ui/             # Elementos de interface (ícones, brasões, etc.)
├── js/
│   ├── main.js
│   ├── gallery.js
│   ├── contact.js
│   ├── quiz.js             # Ajustado para mostrar resultados só no final
│   ├── timeline.js
│   └── a11y.js
├── contato.html
├── documentos.html
├── fontes.html
├── galeria.html
├── historia.html
├── index.html
├── personagens.html
├── quiz.html
├── manifest.json
├── sw.js
└── README.md
```

## Tecnologias

- HTML5 semântico
- CSS3 (Grid/Flexbox, variáveis CSS, animações leves)
- JavaScript ES6+ (sem frameworks)
- Google Fonts: Cinzel (títulos), Merriweather e Open Sans (textos)

## Instalação e Execução

1) Servidor local (recomendado)

```bash
# Python 3
python -m http.server 8000

# Node.js (se disponível)
npx serve .
```

Abra: `http://localhost:8000`

2) Abertura direta: clique em `index.html` (alguns recursos podem exigir servidor devido a CORS).

## Acessibilidade

- Skip link para conteúdo principal
- Roles e rótulos ARIA principais no cabeçalho/navegação
- Foco visível e navegação por teclado
- Preferência de redução de movimento respeitada no CSS

Status: revisão adicional pendente para checar cabeçalhos únicos, ids duplicados e `alt` nas imagens-chave (tarefa interna: “audit-a11y”).

## SEO e PWA

- Metadados SEO/OG/Twitter configurados em `index.html`
- `manifest.json` atualizado: nome “Eco da República” e cores do tema
- `sw.js` presente (estrutura para PWA)

## Suporte e Contato

- E-mail: `itallomoreeira@hotmail.com`
- WhatsApp: `32 99822-2520`
- Localização: Juiz de Fora, MG — Brasil

## © Direitos Autorais

© 2025 Italo&Rakel — Proclamação da República. Todos os direitos reservados.

“Projeto acadêmico de Desenvolvimento de Web Sites – Proclamação da República do Brasil (1889)”.

## Roadmap

### Concluído
- Organização de imagens em `images/conteudo/` e `images/galeria/`
- Carrossel animado com 12 bandeiras históricas na página inicial
- Esquema didático visual na página inicial
- Página Personagens com 8 biografias completas (Deodoro, Benjamin, Rui, Quintino, Patrocínio, Floriano, Dom Pedro II, Princesa Isabel)
- Fundo verde claro (#C8E6A0) em Personagens com cards brancos semitransparentes
- Modal amarelo (#FFE066) para biografias detalhadas
- Galeria sem títulos "Ala" com descrições enriquecidas
- Texto da História organizado em parágrafos curtos
- Quiz expandido para 10 questões educativas
- Fontes adicionado ao menu de navegação em todas as páginas
- Caminhos de imagens corrigidos (images/conteudo/)
- Consistência de navbar em todas as 8 páginas
- Remoção do "BR" do nome do site em todas as páginas

### Pendente
- Revisão de acessibilidade completa (alt de imagens e estrutura de headings)
- Melhorias de performance (otimização adicional de imagens)
- Microanimações acessíveis

—

Desenvolvido com foco em acessibilidade, educação histórica e experiência do usuário.