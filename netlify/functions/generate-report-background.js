export default async (req) => {
  console.log('FUNÇÃO INICIADA — método:', req.method)

  const RESEND_KEY = process.env.RESEND_API_KEY
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY
  const TO_EMAIL = process.env.KATHARINE_EMAIL || 'katharine.rodrigues4@gmail.com'

  let vars = {}
  try {
    vars = await req.json()
    console.log('Dados recebidos para:', vars.nome, '|', vars.cidade)
  } catch (e) {
    console.error('Erro ao parsear body:', e.message)
    return new Response('Bad request', { status: 400 })
  }

  const diagnosticText = `
DIAGNÓSTICO — O NOVO NASCER FINANCEIRO
Data: ${new Date().toLocaleDateString('pt-BR')}
Cliente: ${vars.nome || 'N/A'} | Cidade: ${vars.cidade || 'N/A'}

EMERGÊNCIA: ${vars.emergencia || 'N/A'}
TEMPO DISPONÍVEL: ${vars.tempo_disponivel || 'N/A'} | Horário: ${vars.horario_disponivel || 'N/A'}

FINANCEIRO:
Renda: R$ ${vars.renda_mensal || 'N/A'} | Gastos: R$ ${vars.gastos_fixos || 'N/A'}
Dívidas: ${vars.dividas || 'N/A'} | Reserva: ${vars.reserva || 'N/A'}

ATIVOS DORMENTES: ${vars.ativos_dormentes || 'N/A'}

CONHECIMENTO:
Formações: ${vars.formacoes || 'N/A'}
Pergunta frequente: ${vars.pergunta_frequente || 'N/A'}
Transformação: ${vars.transformacao || 'N/A'}

OBJETIVOS:
Sobreviver: R$ ${vars.meta_sobreviver || 'N/A'}/mês
Respirar: R$ ${vars.meta_respirar || 'N/A'}/mês
Liberdade: R$ ${vars.meta_liberdade || 'N/A'}/mês
Localização: ${vars.planos_localizacao || 'N/A'}
Tipo de liberdade: ${vars.tipo_liberdade || 'N/A'}
Estilo trabalho: ${vars.estilo_trabalho || 'N/A'}

EMOCIONAL:
Emoção ao investir: ${vars.emocao_investir || 'N/A'}
Experiência de perda: ${vars.experiencia_perda || 'N/A'}
Recurso intocável: ${vars.recurso_intocavel || 'N/A'}
Maior medo: ${vars.maior_medo || 'N/A'}
Dependentes: ${vars.dependentes || 'N/A'}

CAMADA PROFUNDA:
Relacionamento: ${vars.prisao_relacionamento || 'Pulou'}
Herança familiar: ${vars.heranca_familiar || 'Pulou'}
Mudança de poder: ${vars.mudanca_poder || 'Pulou'}
  `.trim()

  // PASSO 1: Enviar email com dados brutos (rápido)
  if (RESEND_KEY) {
    try {
      console.log('Enviando email para:', TO_EMAIL)
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'O Novo Nascer <onboarding@resend.dev>',
          to: [TO_EMAIL],
          subject: `[Novo Nascer] ${vars.nome} — ${vars.cidade}`,
          html: `<h2>Nova cliente: ${vars.nome}</h2><pre style="font-family:monospace;background:#f5f5f5;padding:16px;border-radius:8px;font-size:13px;">${diagnosticText}</pre>`,
        }),
      })
      const emailData = await emailRes.json()
      console.log('Email enviado:', JSON.stringify(emailData))
    } catch (e) {
      console.error('Erro ao enviar email:', e.message)
    }
  } else {
    console.log('RESEND_KEY não encontrada')
  }

  // PASSO 2: Gerar relatório com Claude e enviar segundo email
  if (ANTHROPIC_KEY) {
    try {
      console.log('Chamando Claude para relatório...')
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
Gere um relatório HTML completo pronto para imprimir como PDF.
Retorne APENAS o HTML começando com <!DOCTYPE html>.
Inclua: capa em branco marfim (#FAFAF7) e dourado (#C9A84C), radiografia financeira, estágio atual (Sobrevivência/Organização/Construção/Expansão), ativos dormentes, calculadora de liberdade (sobreviver/respirar/livre), plano 6 meses, rotina semanal, guia de investimentos e carta personalizada assinada por Katharine Louise.
CSS embutido com fundo #FAFAF7, dourado #C9A84C, Cormorant Garamond nos títulos.`,
          messages: [{ role: 'user', content: diagnosticText }],
        }),
      })
      const claudeData = await claudeRes.json()
      const reportHtml = claudeData.content?.[0]?.text || ''
      console.log('Claude respondeu, tamanho:', reportHtml.length)

      if (RESEND_KEY && reportHtml) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${RESEND_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'O Novo Nascer <onboarding@resend.dev>',
            to: [TO_EMAIL],
            subject: `[Novo Nascer] RELATÓRIO COMPLETO — ${vars.nome}`,
            html: reportHtml,
          }),
        })
        console.log('Relatório HTML enviado por email')
      }
    } catch (e) {
      console.error('Erro Claude:', e.message)
    }
  }

  console.log('FUNÇÃO CONCLUÍDA')
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
