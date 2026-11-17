# Venhagenda 💅

**Agendamento automático pelo WhatsApp para profissionais de beleza.**
Nasceu de uma cliente real: uma manicure que perdia horas por semana respondendo mensagem para marcar horário. Com o Venhagenda, ela **economizou 8 horas por semana**.

🔗 **No ar:** [venhagenda.com.br](https://venhagenda.com.br) · **Teste como cliente:** [agende num estúdio de demonstração](https://venhagenda.com.br/book/demo)

## O problema

Profissional autônoma atende pelo WhatsApp entre um cliente e outro. Marcar, confirmar, lembrar e remarcar horário toma tempo, e esquecimento vira falta.

## A solução

1. **Bot no WhatsApp:** a cliente conversa normalmente ("quero fazer pé e mão sexta de tarde"). Um LLM entende o pedido e devolve dados estruturados; o agendamento em si é feito pela API, que valida horários livres e evita duplicata. O LLM nunca marca um horário sozinho.
2. **Página de agendamento** (`/book/:slug`): a cliente agenda sem login nem senha, só com o telefone.
3. **Painel da profissional:** agenda, serviços, bloqueio de datas e área da cliente para remarcar ou cancelar.
4. **Avisos automáticos:** confirmação, lembrete 2 dias antes, resumo da agenda do dia e resumo semanal para a dona do estúdio.

## Decisões de arquitetura

- **LLM só interpreta, a regra de negócio decide:** horários vêm de uma função no Postgres que respeita expediente, bloqueios e conflitos.
- **Multi-tenant desde o início:** cada estúdio tem seu slug, serviços e horários; isolamento por Row-Level Security no Postgres.
- **Zero login para a cliente final:** decisão de produto, porque a cliente já está no WhatsApp.
- **Segurança:** JWT no painel, rate limit nas rotas públicas, CORS restrito, lookup por telefone que não permite enumerar números.

## Stack

React 19 + Vite + TypeScript · Express + TypeScript · PostgreSQL (RLS) · n8n · WhatsApp (UazAPI) · OpenAI · node-cron · Docker Compose

## Rodando localmente

```bash
docker compose up -d   # postgres, n8n, redis, api e frontend
npm install
npm run dev
```

Os fluxos do bot estão em [`/n8n`](./n8n) e podem ser importados no n8n.

Como o bot do WhatsApp depende de um número conectado, a demonstração pública cobre a página de agendamento online.
