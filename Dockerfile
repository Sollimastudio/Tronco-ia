FROM python:3.11-slim

WORKDIR /app

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copia requirements e instala dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o código da aplicação
COPY . .

# Cria diretórios necessários
RUN mkdir -p uploads chroma_db

# Expõe a porta
EXPOSE 8000

# Define variáveis de ambiente padrão
ENV HOST=0.0.0.0
ENV PORT=8000
ENV DEBUG=False

# Comando para iniciar a aplicação
CMD ["python", "main.py"]
