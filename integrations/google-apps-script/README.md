# Leads no Google Sheets e Clint

Planilha: https://docs.google.com/spreadsheets/d/149J9lU9CiEHATONwYJT6pd-04f8T3KEcFUgX5jQ652I/edit

Projeto Apps Script: https://script.google.com/home/projects/1orTphRLQhfa1xQOAvJ7N4V6vS62XuWmq5S--m2ERZ6Pk814RiL6CUfep/edit

O pop-up envia para `/api/lead`. O servidor valida os campos e chama o Apps Script com um segredo. O script grava o lead na aba `Leads`, encaminha ao webhook existente do Clint e marca a coluna `Envio ao Clint` como `Enviado`. A interface só libera os comentários quando ambos confirmam o recebimento.

## Ativação

1. Salvar `Code.gs` no projeto acima.
2. Executar `configureIntegration` e autorizar acesso a planilhas e solicitações externas. A função cria `SPREADSHEET_ID` e `LEADS_SECRET` nas propriedades do script, sem expor o segredo nos logs.
3. Implantar como aplicativo da Web, executar como proprietário, permitir chamadas de qualquer pessoa. O endpoint exige o segredo em todos os POSTs; não há endpoint de leitura pública dos leads.
4. Copiar a URL `/exec` para `GOOGLE_SHEETS_WEBHOOK_URL` e o valor de `LEADS_SECRET` para `GOOGLE_SHEETS_WEBHOOK_SECRET` em `.env.local`. Manter `CLINT_WEBHOOK_URL` com o webhook do CRM.
5. Configurar as mesmas variáveis no ambiente de hospedagem e reiniciar/reimplantar a aplicação. Não colocar os segredos em variáveis `NEXT_PUBLIC_` nem no Git.
6. Enviar um cadastro de teste identificado como teste pelo pop-up e confirmar a linha na planilha e o recebimento no Clint.

## Repetições e falhas

Cada tentativa do mesmo cadastro, enquanto a página permanece aberta, mantém o ID. O script usa um bloqueio para serializar as gravações e não duplica uma linha cujo ID já existe. Se o Clint falhar, o cadastro permanece na planilha como `Pendente`; uma nova tentativa reaproveita a linha e tenta o CRM novamente. Não há retentativa automática de pendências.

Um timeout depois de o Clint ter aceitado o lead, mas antes de o script gravar `Enviado`, ainda pode gerar repetição no CRM. O campo `submission_id` é enviado para permitir deduplicação no destino; a aplicação não pressupõe que o Clint faça essa deduplicação.

Sem as duas variáveis do Google configuradas, `/api/lead` mantém o envio direto ao Clint e retorna `delivery.sheets: "not_configured"`. Os cadastros desse período não são gravados na planilha nem sincronizados retroativamente. O formulário só libera os comentários depois de o Clint aceitar o cadastro. Quando as variáveis estiverem configuradas, passa a exigir sucesso no fluxo Sheets + Clint.

Testes locais: `node --test tests/lead-delivery.test.mjs`.

Referência: https://developers.google.com/apps-script/guides/web
