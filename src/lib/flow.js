export const FLOW = [
  // ABERTURA
  {
    id: 'welcome',
    type: 'agent',
    text: 'Olá 💜 Que bom que você chegou até aqui. Sou o agente O Novo Nascer Financeiro — criado pela Katharine Louise para te ajudar a enxergar com clareza onde você está e qual o caminho mais honesto para a sua liberdade financeira. Aqui não tem julgamento. O que você compartilhar vai se tornar o mapa da sua nova vida. 🌱',
    next: 'ask_name',
  },
  {
    id: 'ask_name',
    type: 'input',
    placeholder: 'Qual é o seu nome?',
    variable: 'nome',
    next: 'ask_city',
  },
  {
    id: 'ask_city',
    type: 'input',
    placeholder: (vars) => `De onde você está falando, ${vars.nome}? (cidade e país)`,
    variable: 'cidade',
    next: 'emergency_check_msg',
  },

  // CHECK DE EMERGÊNCIA
  {
    id: 'emergency_check_msg',
    type: 'agent',
    text: (vars) => `${vars.nome}, antes de tudo — hoje você está passando por alguma emergência financeira? Sem dinheiro para o básico neste momento?`,
    next: 'emergency_check',
  },
  {
    id: 'emergency_check',
    type: 'choice',
    options: ['Sim, estou em crise agora', 'Não, estou ok', 'Estou apertada, mas dá para o mês'],
    variable: 'emergencia',
    next: (answer) => answer === 'Sim, estou em crise agora' ? 'emergency_response' : 'layer0_msg',
  },

  // EMERGÊNCIA
  {
    id: 'emergency_response',
    type: 'agent',
    text: 'Obrigada por me contar. Vamos focar no que importa agora: gerar dinheiro nos próximos dias.',
    next: 'emergency_services',
  },
  {
    id: 'emergency_services',
    type: 'input',
    placeholder: 'O que você pode oferecer como serviço hoje? (massagem, consultoria, aula, qualquer coisa que sabe fazer)',
    variable: 'servicos_emergencia',
    next: 'emergency_clients',
  },
  {
    id: 'emergency_clients',
    type: 'input',
    placeholder: 'Tem clientes antigas para reativar com uma mensagem simples?',
    variable: 'clientes_antigas',
    next: 'emergency_sell',
  },
  {
    id: 'emergency_sell',
    type: 'input',
    placeholder: 'Tem algo em casa para vender? (Enjoei, OLX, Shopee)',
    variable: 'itens_vender',
    next: 'emergency_close',
  },
  {
    id: 'emergency_close',
    type: 'agent',
    text: 'Anotei tudo. Agora vamos também fazer o diagnóstico completo para construir sua liberdade definitiva.',
    next: 'layer0_msg',
  },

  // CAMADA 0 — TEMPO
  {
    id: 'layer0_msg',
    type: 'agent',
    text: 'Antes de falar sobre dinheiro, preciso entender quanto tempo você tem. Qualquer plano que não cabe na sua vida real não é um plano — é uma fonte de culpa.',
    layer: 1,
    next: 'layer0_time',
  },
  {
    id: 'layer0_time',
    type: 'choice',
    options: ['Menos de 30 min/dia', '30 min a 1h/dia', '1 a 2h/dia', '2 a 3h/dia', 'Mais de 3h/dia'],
    variable: 'tempo_disponivel',
    next: 'layer0_schedule',
  },
  {
    id: 'layer0_schedule',
    type: 'input',
    placeholder: 'Em qual horário você costuma ter esse tempo? (manhã, noite, finais de semana...)',
    variable: 'horario_disponivel',
    next: 'layer1_msg',
  },

  // CAMADA 1 — RADIOGRAFIA FINANCEIRA
  {
    id: 'layer1_msg',
    type: 'agent',
    text: 'Agora vamos olhar para os números. Respira fundo — isso não é julgamento, é diagnóstico. Como uma consulta médica.',
    layer: 2,
    next: 'layer1_income',
  },
  {
    id: 'layer1_income',
    type: 'input',
    inputType: 'number',
    placeholder: 'Qual é a sua renda mensal total? (R$) Some tudo. Estimativa já está ótimo.',
    variable: 'renda_mensal',
    next: 'layer1_expenses',
  },
  {
    id: 'layer1_expenses',
    type: 'input',
    inputType: 'number',
    placeholder: 'E os seus gastos fixos mensais? (R$) (aluguel, contas, escola, alimentação, transporte...)',
    variable: 'gastos_fixos',
    next: 'layer1_debt',
  },
  {
    id: 'layer1_debt',
    type: 'input',
    placeholder: 'Você tem dívidas? Quanto deve no total e tem juros altos rodando?',
    variable: 'dividas',
    next: 'layer1_savings',
  },
  {
    id: 'layer1_savings',
    type: 'input',
    placeholder: 'Tem alguma reserva guardada? Qualquer valor — se não tiver, tudo bem.',
    variable: 'reserva',
    next: 'layer2_msg',
  },

  // CAMADA 2 — ATIVOS DORMENTES
  {
    id: 'layer2_msg',
    type: 'agent',
    text: 'Agora vem uma pergunta que a maioria nunca fez para si mesma — e as respostas costumam surpreender.',
    layer: 3,
    next: 'layer2_assets',
  },
  {
    id: 'layer2_assets',
    type: 'input',
    placeholder: 'Você tem algo que não está gerando dinheiro mas poderia estar? Produto digital parado, conhecimento não cobrado, seguidores não monetizados, clientes antigas, espaço ou equipamento parado...',
    variable: 'ativos_dormentes',
    next: 'layer3_msg',
  },

  // CAMADA 3 — CONHECIMENTO
  {
    id: 'layer3_msg',
    type: 'agent',
    text: 'O que você sabe provavelmente vale muito mais do que você imagina.',
    layer: 3,
    next: 'layer3_skills',
  },
  {
    id: 'layer3_skills',
    type: 'input',
    placeholder: 'Quais são suas formações e especialidades? Liste tudo, mesmo o que parece pequeno.',
    variable: 'formacoes',
    next: 'layer3_question',
  },
  {
    id: 'layer3_question',
    type: 'input',
    placeholder: 'Qual é a pergunta que as pessoas SEMPRE te fazem — o assunto que te procuram quando precisam de ajuda?',
    variable: 'pergunta_frequente',
    next: 'layer3_transformation',
  },
  {
    id: 'layer3_transformation',
    type: 'input',
    placeholder: 'Que transformação você já causou na vida de alguém que pagaria para aprender com você?',
    variable: 'transformacao',
    next: 'layer4_msg',
  },

  // CAMADA 4 — OBJETIVOS DE LIBERDADE
  {
    id: 'layer4_msg',
    type: 'agent',
    text: 'Agora vamos falar sobre o que você realmente quer. Sem filtro. Aqui é sobre o que você deseja de verdade.',
    layer: 4,
    next: 'layer4_survive',
  },
  {
    id: 'layer4_survive',
    type: 'input',
    inputType: 'number',
    placeholder: 'Quanto você precisaria ganhar por mês para sobreviver bem? (R$) — sem aperto, sem cortar o essencial',
    variable: 'meta_sobreviver',
    next: 'layer4_breathe',
  },
  {
    id: 'layer4_breathe',
    type: 'input',
    inputType: 'number',
    placeholder: 'E quanto para respirar? (R$) — pagar tudo com tranquilidade e ter uma folga',
    variable: 'meta_respirar',
    next: 'layer4_free',
  },
  {
    id: 'layer4_free',
    type: 'input',
    inputType: 'number',
    placeholder: 'E o número da sua LIBERDADE (R$) — quanto faria você se sentir verdadeiramente livre?',
    variable: 'meta_liberdade',
    next: 'layer4_location',
  },
  {
    id: 'layer4_location',
    type: 'input',
    placeholder: 'Você quer ficar no Brasil ou tem planos de se mudar? Para onde? Em quanto tempo?',
    variable: 'planos_localizacao',
    next: 'layer4_freedom_type',
  },
  {
    id: 'layer4_freedom_type',
    type: 'choice',
    options: [
      'Liberdade de tempo (estar mais presente)',
      'Liberdade financeira (mais dinheiro)',
      'Liberdade de localização (morar onde quiser)',
      'Todas as três',
    ],
    variable: 'tipo_liberdade',
    next: 'layer4_work_style',
  },
  {
    id: 'layer4_work_style',
    type: 'choice',
    options: ['Trabalhar sozinha, no meu ritmo', 'Com uma pequena equipe', 'Com equipe grande', 'Ainda não sei'],
    variable: 'estilo_trabalho',
    next: 'layer5_msg',
  },

  // CAMADA 5 — RELAÇÃO EMOCIONAL COM DINHEIRO
  {
    id: 'layer5_msg',
    type: 'agent',
    text: 'Agora perguntas sobre sua relação emocional com o dinheiro. Não tem resposta certa. Seja honesta consigo mesma. 💜',
    layer: 5,
    next: 'layer5_invest_emotion',
  },
  {
    id: 'layer5_invest_emotion',
    type: 'input',
    placeholder: 'Qual emoção você sente quando pensa em investir dinheiro?',
    variable: 'emocao_investir',
    next: 'layer5_loss',
  },
  {
    id: 'layer5_loss',
    type: 'input',
    placeholder: 'Você já perdeu dinheiro tentando crescer? Se sim, como foi essa experiência?',
    variable: 'experiencia_perda',
    next: 'layer5_untouchable',
  },
  {
    id: 'layer5_untouchable',
    type: 'input',
    placeholder: 'Tem algum recurso que você nunca tocaria, não importa o aperto? Por quê?',
    variable: 'recurso_intocavel',
    next: 'layer5_fear',
  },
  {
    id: 'layer5_fear',
    type: 'choice',
    options: [
      'Medo de perder o que tenho',
      'Medo de errar e me sentir burra',
      'Medo de depender de outra pessoa',
      'Não sei por onde começar',
    ],
    variable: 'maior_medo',
    next: 'layer5_dependents',
  },
  {
    id: 'layer5_dependents',
    type: 'input',
    placeholder: 'Tem alguém que depende financeiramente de você? Filhos, pais, parceiro(a)?',
    variable: 'dependentes',
    next: 'layer6_msg',
  },

  // CAMADA 6 — PRISÃO INVISÍVEL
  {
    id: 'layer6_msg',
    type: 'agent',
    text: 'Chegamos na camada mais profunda — e a mais transformadora. Baseada em constelação familiar e pensamento sistêmico. Pode pular se preferir, mas se responder, seu diagnóstico ficará muito mais preciso.',
    layer: 6,
    next: 'layer6_choice',
  },
  {
    id: 'layer6_choice',
    type: 'choice',
    options: ['Quero responder', 'Prefiro pular'],
    variable: 'responde_camada6',
    next: (answer) => answer === 'Quero responder' ? 'layer6_relationship' : 'final_msg',
  },
  {
    id: 'layer6_relationship',
    type: 'input',
    placeholder: 'Sua situação financeira está ligada a uma situação de relacionamento? Você sente que não pode sair porque não tem como se sustentar — ou que não consegue prosperar porque ainda está presa em algo?',
    variable: 'prisao_relacionamento',
    next: 'layer6_family',
  },
  {
    id: 'layer6_family',
    type: 'input',
    placeholder: 'Na sua família, as mulheres tinham independência financeira? O dinheiro era motivo de conflito ou vergonha?',
    variable: 'heranca_familiar',
    next: 'layer6_power',
  },
  {
    id: 'layer6_power',
    type: 'input',
    placeholder: 'O que mudaria nos seus relacionamentos se você tivesse R$5.000 por mês, só seus? Alguém perderia poder sobre você?',
    variable: 'mudanca_poder',
    next: 'final_msg',
  },

  // FINALIZAÇÃO
  {
    id: 'final_msg',
    type: 'agent',
    text: (vars) => `${vars.nome}, obrigada por cada resposta. Você acabou de completar o diagnóstico mais profundo que uma mulher pode fazer sobre a sua própria liberdade financeira. Estou analisando tudo para montar o seu relatório personalizado... 🌱`,
    next: 'generating',
  },
  {
    id: 'generating',
    type: 'generating',
    next: 'done',
  },
  {
    id: 'done',
    type: 'done',
  },
]

export const TOTAL_LAYERS = 6

export function getStep(id) {
  return FLOW.find((s) => s.id === id)
}
