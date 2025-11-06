# 🤝 Guia de Contribuição - Tronco-IA

Obrigado por considerar contribuir com o Tronco-IA! Este guia vai te ajudar a começar.

## 🌟 Como Contribuir

Existem várias formas de contribuir:

1. 🐛 **Reportar bugs**: Encontrou um bug? Abra uma issue
2. 💡 **Sugerir features**: Tem uma ideia? Compartilhe conosco
3. 📝 **Melhorar documentação**: Encontrou algo confuso? Ajude a clarificar
4. 💻 **Contribuir com código**: Implemente features ou corrija bugs
5. 🌍 **Traduções**: Ajude a traduzir a documentação

## 🚀 Começando

### 1. Fork o Repositório

Clique no botão "Fork" no GitHub para criar sua própria cópia do repositório.

### 2. Clone seu Fork

```bash
git clone https://github.com/seu-usuario/Tronco-ia.git
cd Tronco-ia
```

### 3. Configure o Upstream

```bash
git remote add upstream https://github.com/Sollimastudio/Tronco-ia.git
```

### 4. Crie uma Branch

```bash
git checkout -b feature/minha-feature
# ou
git checkout -b fix/meu-bugfix
```

### 5. Configure o Ambiente

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Configure suas API keys no .env
```

## 📝 Processo de Desenvolvimento

### 1. Faça suas Mudanças

- Mantenha o código limpo e legível
- Siga o estilo de código existente
- Comente código complexo
- Teste suas mudanças

### 2. Teste Localmente

```bash
# Execute o servidor
python main.py

# Teste manualmente
# Abra http://localhost:8000

# Execute testes de estrutura
python test_structure.py
```

### 3. Commit suas Mudanças

Use mensagens de commit descritivas:

```bash
git add .
git commit -m "feat: adiciona funcionalidade X"
# ou
git commit -m "fix: corrige bug Y"
# ou
git commit -m "docs: atualiza documentação Z"
```

**Convenção de Commits**:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Formatação, sem mudança de código
- `refactor`: Refatoração de código
- `test`: Adiciona ou corrige testes
- `chore`: Manutenção, configuração

### 4. Push para seu Fork

```bash
git push origin feature/minha-feature
```

### 5. Abra um Pull Request

1. Vá para o repositório original no GitHub
2. Clique em "New Pull Request"
3. Selecione sua branch
4. Descreva suas mudanças claramente
5. Envie o PR!

## 🎨 Padrões de Código

### Python

- Siga PEP 8
- Use type hints quando possível
- Docstrings para funções e classes
- Máximo de 100 caracteres por linha

**Exemplo**:

```python
def processar_documento(filepath: str, tipo: str) -> Dict[str, Any]:
    """
    Processa um documento e retorna metadados.
    
    Args:
        filepath: Caminho para o arquivo
        tipo: Tipo do arquivo (pdf, txt, md)
    
    Returns:
        Dicionário com metadados do documento
    
    Raises:
        ValueError: Se o tipo de arquivo não for suportado
    """
    pass
```

### JavaScript

- Use ES6+
- Nomenclatura camelCase para variáveis
- Comentários para lógica complexa
- Async/await para operações assíncronas

### HTML/CSS

- HTML5 semântico
- Classes CSS descritivas
- Mobile-first responsive design

## 🧪 Testes

Atualmente, os testes são manuais. Contribuições para adicionar testes automatizados são muito bem-vindas!

### Áreas que Precisam de Testes

- [ ] Testes unitários para AI Service
- [ ] Testes para Document Processor
- [ ] Testes de integração para endpoints
- [ ] Testes E2E para frontend
- [ ] Testes de segurança

## 📚 Documentação

Ao adicionar novas features:

1. Atualize o README.md se necessário
2. Adicione exemplos em API.md
3. Atualize QUICKSTART.md se relevante
4. Adicione comentários no código

## 🐛 Reportando Bugs

### Template de Issue para Bugs

```markdown
## Descrição do Bug
Uma descrição clara do que está acontecendo.

## Como Reproduzir
1. Vá para '...'
2. Clique em '....'
3. Role até '....'
4. Veja o erro

## Comportamento Esperado
O que deveria acontecer.

## Screenshots
Se aplicável, adicione screenshots.

## Ambiente
- OS: [ex: macOS 13.0]
- Python Version: [ex: 3.11]
- Provedor de IA: [ex: Gemini]
- Browser: [ex: Chrome 120]

## Informações Adicionais
Qualquer contexto adicional sobre o problema.
```

## 💡 Sugerindo Features

### Template de Issue para Features

```markdown
## Descrição da Feature
Uma descrição clara da feature proposta.

## Problema que Resolve
Explique que problema esta feature resolveria.

## Solução Proposta
Descreva como a feature funcionaria.

## Alternativas Consideradas
Outras abordagens que você considerou.

## Contexto Adicional
Screenshots, mockups, exemplos de outros projetos, etc.
```

## 🔍 Code Review

Todos os PRs passam por code review. Esperamos:

- ✅ Código limpo e legível
- ✅ Funcionalidade testada
- ✅ Documentação atualizada
- ✅ Sem erros de sintaxe
- ✅ Commits bem descritos

## 🎯 Áreas Prioritárias

Estamos especialmente interessados em contribuições nas seguintes áreas:

### Backend
- [ ] Implementar sistema de autenticação (JWT/OAuth2)
- [ ] Adicionar rate limiting
- [ ] Suporte para mais formatos de documento (DOCX, etc)
- [ ] Otimização de performance
- [ ] Testes automatizados

### Frontend
- [ ] Modo escuro
- [ ] Atalhos de teclado
- [ ] Suporte para markdown na interface
- [ ] Upload com drag-and-drop melhorado
- [ ] PWA (Progressive Web App)

### IA e Processamento
- [ ] Suporte para mais modelos de IA
- [ ] Melhorias no chunking de documentos
- [ ] Sistema de cache para embeddings
- [ ] Fine-tuning de prompts

### DevOps
- [ ] CI/CD com GitHub Actions
- [ ] Deploy automatizado
- [ ] Monitoramento e logs
- [ ] Testes automatizados

### Documentação
- [ ] Tutoriais em vídeo
- [ ] Mais exemplos de uso
- [ ] Tradução para outros idiomas
- [ ] Guias específicos por caso de uso

## 🏆 Reconhecimento

Todos os contribuidores são reconhecidos no projeto! Seu nome será adicionado à lista de contribuidores.

## 📞 Precisa de Ajuda?

- 💬 Abra uma Discussion no GitHub
- 📧 Entre em contato via Issues
- 📖 Consulte a documentação existente

## 📜 Código de Conduta

### Nossa Promessa

Nós nos comprometemos a fazer da participação neste projeto uma experiência livre de assédio para todos, independentemente de idade, tamanho corporal, deficiência visível ou invisível, etnia, características sexuais, identidade e expressão de gênero, nível de experiência, educação, status socioeconômico, nacionalidade, aparência pessoal, raça, religião ou identidade e orientação sexual.

### Nossos Padrões

Exemplos de comportamento que contribuem para criar um ambiente positivo:

- ✅ Usar linguagem acolhedora e inclusiva
- ✅ Respeitar pontos de vista e experiências diferentes
- ✅ Aceitar críticas construtivas graciosamente
- ✅ Focar no que é melhor para a comunidade
- ✅ Mostrar empatia com outros membros da comunidade

Exemplos de comportamento inaceitável:

- ❌ Uso de linguagem ou imagens sexualizadas
- ❌ Trolling, comentários insultuosos ou depreciativos
- ❌ Assédio público ou privado
- ❌ Publicar informações privadas de outros sem permissão
- ❌ Outras condutas que podem ser consideradas inapropriadas

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença MIT do projeto.

---

**Obrigado por contribuir com o Tronco-IA! 🌳**
