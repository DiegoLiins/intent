# INTENT

> Transformar intenção em ação.

MVP web responsivo para encontrar restaurantes e destinos de viagem a partir de pedidos em linguagem natural.
Feito apenas com HTML, CSS e JavaScript (sem dependências, sem build, sem integrações externas).

## Como executar

Abra `index.html` diretamente no navegador, ou sirva a pasta localmente:

```bash
python3 -m http.server 8080
# acesse http://localhost:8080
```

## Telas (navegação por hash)

| Rota | Tela |
| --- | --- |
| `#/` | Início — campo de intenção, exemplos, acessos a Restaurantes e Viagens |
| `#/restaurantes` | Busca, filtros (categoria, preço, refeição), ordenação, lista/mapa |
| `#/restaurantes/:id` | Detalhes, avaliações e localização demonstrativas |
| `#/viagens` | Busca e filtros de destinos (tipo, região, custo, clima) |
| `#/viagens/:id` | Detalhes com galeria de ilustrações e informações indicativas |
| `#/resultados?q=...` | Interpretação do pedido + opções compatíveis |
| `#/comparar/restaurantes` · `#/comparar/viagens` | Comparação lado a lado (até 3) |
| `#/ideias` | Quadro de ideias de viagem (Ideias → Planejando → Decidido) e restaurantes salvos |

## Estrutura

```
index.html
css/styles.css
js/data.js           dados de demonstração
js/illustrations.js  ilustrações SVG geradas localmente e mapa fictício
js/intent.js         interpretação demonstrativa do texto (palavras-chave) e pontuação
js/store.js          estado (favoritos, comparação, ideias) em localStorage
js/components.js     componentes reutilizáveis (cards, chips, ícones, toast…)
js/views.js          telas
js/app.js            roteador, ações globais, barra de comparação
```

## Sobre os dados

- Restaurantes, endereços, bairros, horários e avaliações são **fictícios**, criados para testes.
- Destinos são lugares reais com descrições gerais; custos relativos e épocas são **indicativos** e não devem ser usados para planejamento real.
- Não há reservas, pagamentos ou integrações externas. As imagens são ilustrações vetoriais geradas no próprio app.
