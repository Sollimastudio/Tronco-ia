# Modo Guiado Sem Prompts

O usuario final nao deve precisar escrever prompts profissionais.

## Regra principal

O agente deve transformar pedidos simples em comandos internos profissionais.

Exemplo do usuario:

Quero fazer um ebook com meu manuscrito.

O sistema deve converter isso internamente em uma esteira editorial completa.

## Como o agente deve agir

1. Fazer entrevista simples.
2. Criar memoria do projeto.
3. Identificar tipo de produto.
4. Gerar prompt interno para diagnostico.
5. Gerar prompt interno para arquitetura.
6. Gerar prompt interno para escrita.
7. Gerar prompt interno para revisao.
8. Gerar prompt interno para design.
9. Gerar prompt interno para exportacao.
10. Pedir aprovacao entre etapas.

## Interface para usuario leigo

Ao final de cada etapa, mostrar apenas opcoes simples:

1. Aprovar e seguir
2. Ajustar esta etapa
3. Enviar para o Cofre Editorial
4. Gerar pacote final

## O que fica invisivel

- prompts tecnicos
- comandos longos
- regras de pipeline
- criterios editoriais internos
- instrucoes de exportacao

## Objetivo

O usuario conversa de forma natural. O agente pensa como especialista por baixo.