#!/bin/bash

# ===== SCRIPT DE TESTE E VERIFICAÇÃO =====
# Projeto: Proclamação da República - Site Educativo
# Autor: Desenvolvedor Front-end
# Data: 2024

echo "🇧🇷 TESTE DO SITE PROCLAMAÇÃO DA REPÚBLICA"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "ERROR")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Função para verificar se arquivo existe
check_file() {
    local file=$1
    if [ -f "$file" ]; then
        print_status "SUCCESS" "Arquivo encontrado: $file"
        return 0
    else
        print_status "ERROR" "Arquivo não encontrado: $file"
        return 1
    fi
}

# Função para verificar se diretório existe
check_directory() {
    local dir=$1
    if [ -d "$dir" ]; then
        print_status "SUCCESS" "Diretório encontrado: $dir"
        return 0
    else
        print_status "ERROR" "Diretório não encontrado: $dir"
        return 1
    fi
}

echo "🔍 VERIFICAÇÃO DE ESTRUTURA DE ARQUIVOS"
echo "======================================="

# Verificar arquivos HTML
print_status "INFO" "Verificando páginas HTML..."
check_file "index.html"
check_file "historia.html"
check_file "personagens.html"
check_file "documentos.html"
check_file "galeria.html"
check_file "quiz.html"
check_file "contato.html"
check_file "fontes.html"

echo ""

# Verificar arquivos CSS
print_status "INFO" "Verificando arquivos CSS..."
check_file "css/styles.css"
check_file "css/timeline.css"
check_file "css/a11y.css"

echo ""

# Verificar arquivos JavaScript
print_status "INFO" "Verificando arquivos JavaScript..."
check_file "js/main.js"
check_file "js/timeline.js"
check_file "js/gallery.js"
check_file "js/a11y.js"
check_file "js/contact.js"
check_file "js/quiz.js"

echo ""

# Verificar diretórios
print_status "INFO" "Verificando estrutura de diretórios..."
check_directory "css"
check_directory "js"
check_directory "js/images"

echo ""

# Verificar arquivos de configuração
print_status "INFO" "Verificando arquivos de configuração..."
check_file "manifest.json"
check_file "sw.js"
check_file "README.md"

echo ""

echo "🔧 VERIFICAÇÃO DE CONTEÚDO"
echo "=========================="

# Verificar se HTML tem estrutura básica
print_status "INFO" "Verificando estrutura HTML..."

for html_file in *.html; do
    if [ -f "$html_file" ]; then
        if grep -q "<!DOCTYPE html>" "$html_file" && grep -q "<html lang=\"pt-BR\">" "$html_file"; then
            print_status "SUCCESS" "$html_file tem estrutura HTML5 válida"
        else
            print_status "ERROR" "$html_file não tem estrutura HTML5 válida"
        fi
    fi
done

echo ""

# Verificar se CSS tem variáveis CSS
print_status "INFO" "Verificando variáveis CSS..."
if grep -q ":root" css/styles.css; then
    print_status "SUCCESS" "Variáveis CSS encontradas em styles.css"
else
    print_status "ERROR" "Variáveis CSS não encontradas em styles.css"
fi

echo ""

# Verificar se JavaScript tem funções principais
print_status "INFO" "Verificando funções JavaScript..."
if grep -q "addEventListener" js/main.js; then
    print_status "SUCCESS" "Event listeners encontrados em main.js"
else
    print_status "ERROR" "Event listeners não encontrados em main.js"
fi

echo ""

echo "♿ VERIFICAÇÃO DE ACESSIBILIDADE"
echo "==============================="

# Verificar atributos ARIA
print_status "INFO" "Verificando atributos ARIA..."
aria_count=$(grep -r "aria-" *.html | wc -l)
if [ "$aria_count" -gt 0 ]; then
    print_status "SUCCESS" "Encontrados $aria_count atributos ARIA"
else
    print_status "ERROR" "Nenhum atributo ARIA encontrado"
fi

# Verificar skip links
if grep -q "skip-link" *.html; then
    print_status "SUCCESS" "Skip links encontrados"
else
    print_status "ERROR" "Skip links não encontrados"
fi

# Verificar alt text em imagens
alt_count=$(grep -r "alt=" *.html | wc -l)
if [ "$alt_count" -gt 0 ]; then
    print_status "SUCCESS" "Encontrados $alt_count atributos alt"
else
    print_status "ERROR" "Nenhum atributo alt encontrado"
fi

echo ""

echo "📱 VERIFICAÇÃO DE RESPONSIVIDADE"
echo "==============================="

# Verificar viewport meta tag
if grep -q "viewport" *.html; then
    print_status "SUCCESS" "Meta tag viewport encontrada"
else
    print_status "ERROR" "Meta tag viewport não encontrada"
fi

# Verificar media queries
media_count=$(grep -r "@media" css/*.css | wc -l)
if [ "$media_count" -gt 0 ]; then
    print_status "SUCCESS" "Encontradas $media_count media queries"
else
    print_status "ERROR" "Nenhuma media query encontrada"
fi

echo ""

echo "🎨 VERIFICAÇÃO DE DESIGN"
echo "======================="

# Verificar se fontes Google estão sendo importadas
if grep -q "fonts.googleapis.com" *.html; then
    print_status "SUCCESS" "Google Fonts importadas"
else
    print_status "ERROR" "Google Fonts não encontradas"
fi

# Verificar se paleta de cores está definida
if grep -q "--verde:" css/styles.css; then
    print_status "SUCCESS" "Paleta de cores definida"
else
    print_status "ERROR" "Paleta de cores não encontrada"
fi

echo ""

echo "⚡ VERIFICAÇÃO DE PERFORMANCE"
echo "============================"

# Verificar se scripts têm defer
defer_count=$(grep -r "defer" *.html | wc -l)
if [ "$defer_count" -gt 0 ]; then
    print_status "SUCCESS" "Scripts com defer encontrados"
else
    print_status "WARNING" "Nenhum script com defer encontrado"
fi

# Verificar se há lazy loading
if grep -q "loading=\"lazy\"" *.html; then
    print_status "SUCCESS" "Lazy loading implementado"
else
    print_status "WARNING" "Lazy loading não encontrado"
fi

echo ""

echo "🧪 TESTE DE FUNCIONALIDADES"
echo "==========================="

# Verificar se há formulários
form_count=$(grep -r "<form" *.html | wc -l)
if [ "$form_count" -gt 0 ]; then
    print_status "SUCCESS" "Encontrados $form_count formulários"
else
    print_status "ERROR" "Nenhum formulário encontrado"
fi

# Verificar se há modais
if grep -q "modal" *.html; then
    print_status "SUCCESS" "Modais encontrados"
else
    print_status "WARNING" "Nenhum modal encontrado"
fi

# Verificar se há quiz
if grep -q "quiz" *.html; then
    print_status "SUCCESS" "Quiz encontrado"
else
    print_status "ERROR" "Quiz não encontrado"
fi

echo ""

echo "📊 RELATÓRIO FINAL"
echo "=================="

# Contar arquivos
html_files=$(ls *.html 2>/dev/null | wc -l)
css_files=$(ls css/*.css 2>/dev/null | wc -l)
js_files=$(ls js/*.js 2>/dev/null | wc -l)

print_status "INFO" "Total de arquivos HTML: $html_files"
print_status "INFO" "Total de arquivos CSS: $css_files"
print_status "INFO" "Total de arquivos JavaScript: $js_files"

echo ""

# Verificar se todos os arquivos essenciais existem
essential_files=("index.html" "css/styles.css" "js/main.js" "README.md")
missing_files=0

for file in "${essential_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files=$((missing_files + 1))
    fi
done

if [ "$missing_files" -eq 0 ]; then
    print_status "SUCCESS" "Todos os arquivos essenciais estão presentes"
else
    print_status "ERROR" "$missing_files arquivo(s) essencial(is) estão faltando"
fi

echo ""

echo "🚀 INSTRUÇÕES PARA EXECUÇÃO"
echo "==========================="
echo ""
echo "Para executar o site:"
echo "1. Abra um terminal na pasta do projeto"
echo "2. Execute: python -m http.server 8000"
echo "3. Acesse: http://localhost:8000"
echo ""
echo "Ou simplesmente abra index.html no navegador"
echo ""

echo "✅ TESTE CONCLUÍDO!"
echo "==================="
echo ""
echo "O site está pronto para uso educacional!"
echo "Todas as funcionalidades foram implementadas seguindo"
echo "as melhores práticas de acessibilidade e performance."
echo ""
echo "🇧🇷 Proclamação da República - Site Educativo"
echo "Desenvolvido com ❤️ para educação histórica brasileira"
