# 🚀 Guia de Início Rápido - Tronco-IA

Este guia vai te ajudar a colocar o Tronco-IA funcionando em **menos de 5 minutos**!

## 📋 Pré-requisitos

- Python 3.8 ou superior
- 5-10 minutos do seu tempo
- Uma chave de API de IA (recomendamos Google Gemini - é grátis!)

## 🎯 Instalação Rápida

### 1. Clone o Repositório

```bash
git clone https://github.com/Sollimastudio/Tronco-ia.git
cd Tronco-ia
```

### 2. Execute o Script de Instalação

**No Mac/Linux:**
```bash
./install.sh
```

**No Windows:**
```bash
pip install -r requirements.txt
copy .env.example .env
```

### 3. Configure sua Chave de API

Abra o arquivo `.env` e adicione sua chave de API:

**Opção 1: Google Gemini (Recomendado - Grátis)**
1. Acesse https://makersuite.google.com/app/apikey
2. Clique em "Create API Key"
3. Copie a chave
4. Cole no arquivo `.env`:
   ```
   GOOGLE_API_KEY=sua_chave_aqui
   AI_PROVIDER=gemini
   ```

**Opção 2: OpenAI**
1. Acesse https://platform.openai.com/api-keys
2. Crie uma nova chave
3. Configure no `.env`:
   ```
   OPENAI_API_KEY=sua_chave_aqui
   AI_PROVIDER=openai
   ```

**Opção 3: Ollama (Local - Sem API Key)**
1. Instale o Ollama: https://ollama.ai/
2. Execute: `ollama pull llama2`
3. Configure no `.env`:
   ```
   AI_PROVIDER=ollama
   ```

### 4. Inicie o Servidor

**No Mac/Linux:**
```bash
./start.sh
```

**No Windows:**
```bash
start.bat
```

**Ou diretamente:**
```bash
python main.py
```

### 5. Acesse a Interface

Abra seu navegador e acesse:
```
http://localhost:8000
```

## ✨ Primeiros Passos

### 1️⃣ Faça sua Primeira Pergunta

Digite qualquer pergunta na caixa de chat e pressione Enter:
```
Olá! Quem é você?
```

### 2️⃣ Envie um Documento

1. Clique em "Enviar Documento" na barra lateral
2. Selecione um arquivo PDF, TXT ou MD
3. Aguarde a indexação (pode levar alguns segundos)

### 3️⃣ Faça Perguntas Sobre o Documento

Agora você pode fazer perguntas sobre o conteúdo do documento:
```
Qual é o tema principal do documento?
Me dê um resumo do documento em 3 pontos.
```

### 4️⃣ Crie uma Nota

1. Clique em "Nova Nota"
2. Preencha título e conteúdo
3. Salve!

## 🎨 Dicas de Uso

### Chat Inteligente
- ✅ Use contexto de documentos (checkbox marcado) para perguntas específicas sobre seus arquivos
- ✅ Desmarque o contexto para conversas gerais
- ✅ O histórico de conversas é salvo automaticamente

### Documentos
- ✅ Formatos aceitos: PDF, TXT, MD
- ✅ Tamanho recomendado: até 50MB por arquivo
- ✅ Aguarde a indexação completa antes de fazer perguntas

### Notas
- ✅ Use tags para organizar (separadas por vírgula)
- ✅ Notas podem servir como referência para a IA
- ✅ Edite o arquivo `notes` no banco de dados se necessário

## 🔧 Resolução Rápida de Problemas

### Erro: "Provedor de IA não inicializado"
**Solução:** Verifique se você configurou corretamente a chave de API no arquivo `.env`

### Erro: "Module not found"
**Solução:** Execute: `pip install -r requirements.txt`

### Erro ao fazer upload de documento
**Solução:** Verifique se o arquivo não está corrompido ou protegido por senha

### Interface não carrega
**Solução:** Verifique se o servidor está rodando na porta 8000

## 📚 Próximos Passos

Agora que você já tem o Tronco-IA funcionando:

1. 📖 Leia o [README.md](README.md) completo para entender toda a arquitetura
2. 🔌 Explore a [Documentação da API](http://localhost:8000/docs)
3. 🛠️ Personalize as configurações no arquivo `.env`
4. 🚀 Integre com suas ferramentas favoritas

## ❓ Precisa de Ajuda?

- 📖 Consulte o [README.md](README.md) completo
- 🐛 Abra uma [Issue no GitHub](https://github.com/Sollimastudio/Tronco-ia/issues)
- 💬 Pergunte para o próprio Tronco-IA! (meta, né? 😄)

---

**Divirta-se com o Tronco-IA! 🌳**
