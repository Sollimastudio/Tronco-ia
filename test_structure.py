#!/usr/bin/env python3
"""
Script de teste para verificar a estrutura do Tronco-IA
"""
import sys
import os

def test_file_structure():
    """Verifica se todos os arquivos necessários existem"""
    required_files = [
        'main.py',
        'models.py',
        'database.py',
        'ai_service.py',
        'document_processor.py',
        'requirements.txt',
        '.env.example',
        '.gitignore',
        'README.md',
        'static/index.html',
        'static/style.css',
        'static/app.js'
    ]
    
    print("🔍 Verificando estrutura de arquivos...")
    all_exist = True
    for file in required_files:
        exists = os.path.exists(file)
        status = "✓" if exists else "✗"
        print(f"  {status} {file}")
        if not exists:
            all_exist = False
    
    return all_exist

def test_imports():
    """Testa se os módulos podem ser importados (sintaxe)"""
    print("\n🔍 Verificando sintaxe dos módulos Python...")
    modules = ['models', 'database', 'ai_service', 'document_processor', 'main']
    
    for module in modules:
        try:
            __import__(module)
            print(f"  ✓ {module}.py - sintaxe válida")
        except ImportError as e:
            print(f"  ⚠ {module}.py - falta dependências: {e}")
        except SyntaxError as e:
            print(f"  ✗ {module}.py - erro de sintaxe: {e}")
            return False
    
    return True

def test_env_config():
    """Verifica se o arquivo .env.example está correto"""
    print("\n🔍 Verificando configurações...")
    if os.path.exists('.env.example'):
        with open('.env.example', 'r') as f:
            content = f.read()
            required_keys = [
                'OPENAI_API_KEY',
                'GOOGLE_API_KEY',
                'OLLAMA_URL',
                'DATABASE_URL',
                'HOST',
                'PORT',
                'AI_PROVIDER'
            ]
            
            for key in required_keys:
                if key in content:
                    print(f"  ✓ {key} presente")
                else:
                    print(f"  ✗ {key} faltando")
                    return False
    else:
        print("  ✗ .env.example não encontrado")
        return False
    
    return True

def test_frontend():
    """Verifica se os arquivos frontend existem e não estão vazios"""
    print("\n🔍 Verificando frontend...")
    frontend_files = {
        'static/index.html': 1000,
        'static/style.css': 1000,
        'static/app.js': 1000
    }
    
    for file, min_size in frontend_files.items():
        if os.path.exists(file):
            size = os.path.getsize(file)
            if size > min_size:
                print(f"  ✓ {file} ({size} bytes)")
            else:
                print(f"  ⚠ {file} muito pequeno ({size} bytes)")
        else:
            print(f"  ✗ {file} não encontrado")
            return False
    
    return True

def main():
    print("=" * 60)
    print("🌳 TESTE DE ESTRUTURA DO TRONCO-IA")
    print("=" * 60)
    
    tests = [
        ("Estrutura de Arquivos", test_file_structure),
        ("Sintaxe Python", test_imports),
        ("Configurações", test_env_config),
        ("Frontend", test_frontend)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n✗ Erro no teste {name}: {e}")
            results.append((name, False))
    
    print("\n" + "=" * 60)
    print("📊 RESULTADOS")
    print("=" * 60)
    
    for name, result in results:
        status = "✓ PASSOU" if result else "✗ FALHOU"
        print(f"{status}: {name}")
    
    all_passed = all(result for _, result in results)
    
    print("\n" + "=" * 60)
    if all_passed:
        print("✓ TODOS OS TESTES PASSARAM!")
        print("\nPróximos passos:")
        print("1. Copie .env.example para .env")
        print("2. Configure suas API keys no arquivo .env")
        print("3. Instale as dependências: pip install -r requirements.txt")
        print("4. Execute o servidor: python main.py")
    else:
        print("✗ ALGUNS TESTES FALHARAM")
        print("\nCorreções necessárias antes de prosseguir.")
    print("=" * 60)
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
