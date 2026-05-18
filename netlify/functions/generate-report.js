export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const vars = await req.json()

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
  const RESEND_KEY = process.env.RESEND_API_KEY
  const TO_EMAIL = process.env.KATHARINE_EMAIL || 'contato@katharinelouise.com'

  // Montar prompt com todos os dados
  const diagnosticText = `
DIAGNÓSTICO — O NOVO NASCER FINANCEIRO
Cliente: ${vars.nome || 'N/A'} | Cidade: ${vars.cidade || 'N/A'}

EMERGÊNCIA: ${vars.emergencia || 'N/A'}
${vars.servicos_emergencia ? `Serviços de emergência: ${vars.servicos_emergencia}` : ''}
${vars.clientes_antigas ? `Clientes antigas: ${vars.clientes_antigas}` : ''}
${vars.itens_vender ? `Itens para vender: ${vars.itens_vender}` : ''}

TEMPO DISPONÍVEL: ${vars.tempo_disponivel || 'N/A'}
Horário: ${vars.horario_disponivel || 'N/A'}

FINANCEIRO:
Renda mensal: R$ ${vars.renda_mensal || 'N/A'}
Gastos fixos: R$ ${vars.gastos_fixos || 'N/A'}
Dívidas: ${vars.dividas || 'N/A'}
Reserva: ${vars.reserva || 'N/A'}

ATIVOS DORMENTES: ${vars.ativos_dormentes || 'N/A'}

CONHECIMENTO:
Formações: ${vars.formacoes || 'N/A'}
Pergunta frequente: ${vars.pergunta_frequente || 'N/A'}
Transformação causada: ${vars.transformacao || 'N/A'}

OBJETIVOS:
Meta sobreviver: R$ ${vars.meta_sobreviver || 'N/A'}/mês
Meta respirar: R$ ${vars.meta_respirar || 'N/A'}/mês
Meta liberdade: R$ ${vars.meta_liberdade || 'N/A'}/mês
Planos de localização: ${vars.planos_localizacao || 'N/A'}
Tipo de liberdade: ${vars.tipo_liberdade || 'N/A'}
Estilo de trabalho: ${vars.estilo_trabalho || 'N/A'}

EMOCIONAL:
Emoção ao investir: ${vars.emocao_investir || 'N/A'}
Experiência de perda: ${vars.experiencia_perda || 'N/A'}
Recurso intocável: ${vars.recurso_intocavel || 'N/A'}
Maior medo: ${vars.maior_medo || 'N/A'}
Dependentes: ${vars.dependentes || 'N/A'}

PRISÃO INVISÍVEL:
Ligação com relacionamento: ${vars.prisao_relacionamento || 'Pulou esta seção'}
Herança familiar: ${vars.heranca_familiar || 'Pulou esta seção'}
Mudança de poder: ${vars.mudanca_poder || 'Pulou esta seção'}
  `.trim()

  // Chamar Claude para gerar relatório HTML
  let reportHtml = ''
  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 8000,
        system: `Você é o motor de análise do O Novo Nascer Financeiro, criado por Katharine Louise.
Receba os dados de diagnóstico e gere um relatório HTML completo pronto para imprimir como PDF.
Retorne APENAS o HTML começando com <!DOCTYPE html>.

O relatório deve incluir:
- Capa em branco marfim (#FAFAF7) e dourado (#C9A84C) com nome da cliente e data
- Radiografia financeira: renda, gastos, saldo (renda - gastos), análise de dívidas
- Escada de 4 estágios: Sobrevivência / Organização / Construção / Expansão — destacar o estágio atual
- Mapa de ativos dormentes com receita potencial estimada
- Perfil psicoemocional baseado nas respostas emocionais
- Calculadora de liberdade com 3 marcos (sobreviver / respirar / livre) e quanto falta para cada um
- Plano de 6 meses com linha do tempo concreta
- Rotina semanal personalizada baseada no tempo disponível
- Guia de investimentos progressivo (Tesouro Selic → CDB → FII → ETF exterior se mencionar Portugal/exterior)
- Carta personalizada e calorosa assinada por Katharine Louise

CSS embutido: fundo #FAFAF7, dourado #C9A84C, fonte Cormorant Garamond nos títulos, Inter no corpo.
Calcule todos os números. Classifique no estágio correto. Seja específica e personalizada.`,
        messages: [{ role: 'user', content: diagnosticText }],
      }),
    })

    const claudeData = await claudeRes.json()
    reportHtml = claudeData.content?.[0]?.text || ''
  } catch (e) {
    console.error('Erro Claude:', e)
    reportHtml = `<html><body><pre>${diagnosticText}</pre></body></html>`
  }

  // Enviar email via Resend
  if (RESEND_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'O Novo Nascer <onboarding@resend.dev>',
          to: [TO_EMAIL],
          subject: `[O Novo Nascer] Nova análise — ${vars.nome} — ${vars.cidade}`,
          html: `
            <h2>Nova análise recebida</h2>
            <p><strong>Cliente:</strong> ${vars.nome}</p>
            <p><strong>Cidade:</strong> ${vars.cidade}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
            <hr/>
            <h3>Dados do diagnóstico:</h3>
            <pre style="font-family:monospace;font-size:13px;background:#f5f5f5;padding:16px;border-radius:8px;">${diagnosticText}</pre>
            <hr/>
            <h3>Relatório HTML completo:</h3>
            ${reportHtml}
          `,
        }),
      })
    } catch (e) {
      console.error('Erro Resend:', e)
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/api/generate-report' }
