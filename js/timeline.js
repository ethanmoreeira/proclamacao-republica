// ===== TIMELINE INTERATIVA ACESSÍVEL =====
document.addEventListener('DOMContentLoaded', function() {
    const timelineVisual = document.getElementById('timeline-visual');
    const timelineList = document.getElementById('timeline-list');
    const timelineContainer = document.getElementById('timeline-container');
    const timelineListContainer = document.getElementById('timeline-list-container');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineListItems = document.querySelectorAll('.timeline-list-item');

    // Verificar se os elementos existem
    if (!timelineVisual || !timelineList) return;

    // ===== CONTROLE DE VISUALIZAÇÃO =====
    function showTimelineVisual() {
        timelineVisual.setAttribute('aria-pressed', 'true');
        timelineVisual.classList.add('active');
        timelineList.setAttribute('aria-pressed', 'false');
        timelineList.classList.remove('active');
        
        timelineContainer.style.display = 'block';
        timelineListContainer.style.display = 'none';
        timelineListContainer.classList.remove('active');
        
        // Anunciar mudança para leitores de tela
        if (window.ProclamacaoUtils) {
            window.ProclamacaoUtils.announceToScreenReader('Modo visual da timeline ativado');
        }
    }

    function showTimelineList() {
        timelineList.setAttribute('aria-pressed', 'true');
        timelineList.classList.add('active');
        timelineVisual.setAttribute('aria-pressed', 'false');
        timelineVisual.classList.remove('active');
        
        timelineContainer.style.display = 'none';
        timelineListContainer.style.display = 'block';
        timelineListContainer.classList.add('active');
        
        // Anunciar mudança para leitores de tela
        if (window.ProclamacaoUtils) {
            window.ProclamacaoUtils.announceToScreenReader('Modo lista da timeline ativado');
        }
    }

    // Event listeners para os botões
    timelineVisual.addEventListener('click', showTimelineVisual);
    timelineList.addEventListener('click', showTimelineList);

    // ===== ANIMAÇÃO DOS ITENS DA TIMELINE =====
    function animateTimelineItems() {
    const observerOptions = {
            threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const timelineObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
            if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.classList.add('animate');
                    
                    // Adicionar delay escalonado
                    const index = Array.from(timelineItems).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.2}s`;
            }
        });
    }, observerOptions);

        timelineItems.forEach(item => {
        timelineObserver.observe(item);
        });
    }

    // Inicializar animações
    animateTimelineItems();

    // ===== NAVEGAÇÃO POR TECLADO NA TIMELINE =====
    function setupTimelineKeyboardNavigation() {
        timelineItems.forEach((item, index) => {
            item.addEventListener('keydown', function(e) {
                switch(e.key) {
                    case 'ArrowDown':
                    case 'ArrowRight':
                        e.preventDefault();
                        const nextItem = timelineItems[index + 1];
                        if (nextItem) {
                            nextItem.focus();
                        }
                        break;
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        e.preventDefault();
                        const prevItem = timelineItems[index - 1];
                        if (prevItem) {
                            prevItem.focus();
                        }
                        break;
                    case 'Home':
                        e.preventDefault();
                        timelineItems[0].focus();
                        break;
                    case 'End':
                        e.preventDefault();
                        timelineItems[timelineItems.length - 1].focus();
                        break;
                    case 'Enter':
                    case ' ':
            e.preventDefault();
                        // Expandir/colapsar conteúdo se aplicável
                        const content = item.querySelector('.timeline-content');
                        if (content) {
                            content.classList.toggle('expanded');
                        }
                        break;
            }
        });
    });
    }

    setupTimelineKeyboardNavigation();

    // ===== FUNCIONALIDADE DE EXPANSÃO/COLAPSO =====
    function setupTimelineExpansion() {
        timelineItems.forEach(item => {
            const content = item.querySelector('.timeline-content');
            const marker = item.querySelector('.timeline-marker');
            
            if (content && marker) {
                // Adicionar botão de expansão se não existir
                let expandButton = content.querySelector('.expand-button');
                if (!expandButton) {
                    expandButton = document.createElement('button');
                    expandButton.className = 'expand-button sr-only';
                    expandButton.setAttribute('aria-label', 'Expandir detalhes do evento');
                    expandButton.innerHTML = '<span aria-hidden="true">+</span>';
                    content.appendChild(expandButton);
                }

                // Event listener para expansão
                expandButton.addEventListener('click', function() {
                    const isExpanded = content.classList.contains('expanded');
                    content.classList.toggle('expanded');
                    expandButton.setAttribute('aria-expanded', !isExpanded);
                    expandButton.setAttribute('aria-label', 
                        isExpanded ? 'Expandir detalhes do evento' : 'Recolher detalhes do evento'
                    );
                    expandButton.querySelector('span').textContent = isExpanded ? '+' : '−';
                });

                // Expansão por clique no marcador
                marker.addEventListener('click', function() {
                    expandButton.click();
                });
            }
        });
    }

    setupTimelineExpansion();

    // ===== FUNCIONALIDADE DE BUSCA NA TIMELINE =====
    function setupTimelineSearch() {
        // Criar campo de busca se não existir
        let searchContainer = document.querySelector('.timeline-search');
        if (!searchContainer) {
            searchContainer = document.createElement('div');
            searchContainer.className = 'timeline-search';
            searchContainer.innerHTML = `
                <label for="timeline-search-input" class="sr-only">Buscar eventos na timeline</label>
                <input type="search" 
                       id="timeline-search-input" 
                       placeholder="Buscar eventos..."
                       aria-describedby="timeline-search-help">
                <div id="timeline-search-help" class="sr-only">
                    Digite palavras-chave para filtrar os eventos da timeline
                </div>
            `;
            
            // Inserir antes dos controles
            const controls = document.querySelector('.timeline-controls');
            if (controls) {
                controls.parentNode.insertBefore(searchContainer, controls);
            }
        }

        const searchInput = document.getElementById('timeline-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function() {
                const searchTerm = this.value.toLowerCase();
                filterTimelineItems(searchTerm);
            }, 300));
        }
    }

    function filterTimelineItems(searchTerm) {
        timelineItems.forEach(item => {
            const content = item.querySelector('.timeline-content');
            const text = content ? content.textContent.toLowerCase() : '';
            const matches = text.includes(searchTerm);
            
            item.style.display = matches ? 'block' : 'none';
            item.setAttribute('aria-hidden', !matches);
        });

        // Anunciar resultado da busca
        const visibleItems = Array.from(timelineItems).filter(item => 
            item.style.display !== 'none'
        ).length;
        
        if (window.ProclamacaoUtils) {
            window.ProclamacaoUtils.announceToScreenReader(
                `${visibleItems} eventos encontrados`
            );
        }
    }

    setupTimelineSearch();

    // ===== FUNCIONALIDADE DE IMPRESSÃO =====
    function setupTimelinePrint() {
        // Adicionar botão de impressão se não existir
        let printButton = document.querySelector('.timeline-print');
        if (!printButton) {
            printButton = document.createElement('button');
            printButton.className = 'timeline-print btn btn-outline';
            printButton.innerHTML = '🖨️ Imprimir Timeline';
            printButton.setAttribute('aria-label', 'Imprimir timeline');
            
            const controls = document.querySelector('.timeline-controls');
            if (controls) {
                controls.appendChild(printButton);
            }
        }

        printButton.addEventListener('click', function() {
            printTimeline();
        });
    }

    function printTimeline() {
        // Criar versão para impressão
        const printWindow = window.open('', '_blank');
        const timelineData = Array.from(timelineItems).map(item => {
            const date = item.querySelector('.timeline-date');
            const title = item.querySelector('h3');
            const content = item.querySelector('p');
            
            return {
                date: date ? date.textContent : '',
                title: title ? title.textContent : '',
                content: content ? content.textContent : ''
            };
        });

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Timeline - Proclamação da República</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .timeline-item { margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
                    .timeline-date { font-weight: bold; color: #1B5E20; }
                    .timeline-title { font-size: 1.2em; margin: 5px 0; }
                    .timeline-content { margin: 5px 0; }
                </style>
            </head>
            <body>
                <h1>Timeline - Proclamação da República do Brasil</h1>
                ${timelineData.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-date">${item.date}</div>
                        <div class="timeline-title">${item.title}</div>
                        <div class="timeline-content">${item.content}</div>
                    </div>
                `).join('')}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }

    setupTimelinePrint();

    // ===== FUNCIONALIDADE DE COMPARTILHAMENTO =====
    function setupTimelineShare() {
        // Adicionar botão de compartilhamento se não existir
        let shareButton = document.querySelector('.timeline-share');
        if (!shareButton) {
            shareButton = document.createElement('button');
            shareButton.className = 'timeline-share btn btn-outline';
            shareButton.innerHTML = '📤 Compartilhar';
            shareButton.setAttribute('aria-label', 'Compartilhar timeline');
            
            const controls = document.querySelector('.timeline-controls');
            if (controls) {
                controls.appendChild(shareButton);
            }
        }

        shareButton.addEventListener('click', function() {
            shareTimeline();
        });
    }

    function shareTimeline() {
        if (navigator.share) {
            navigator.share({
                title: 'Timeline - Proclamação da República',
                text: 'Confira esta timeline interativa sobre a Proclamação da República do Brasil',
                url: window.location.href
            });
        } else {
            // Fallback: copiar URL para clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                if (window.ProclamacaoUtils) {
                    window.ProclamacaoUtils.showNotification('Link copiado para a área de transferência!', 'success');
                }
            });
        }
    }

    setupTimelineShare();

    // ===== UTILITÁRIOS =====
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ===== INICIALIZAÇÃO =====
    // Garantir que a timeline visual seja exibida por padrão
    showTimelineVisual();

    // ===== EVENTOS DE ACESSIBILIDADE =====
    // Anunciar mudanças de estado para leitores de tela
    timelineItems.forEach(item => {
        item.addEventListener('focus', function() {
            const title = this.querySelector('h3');
            const date = this.querySelector('.timeline-date');
            if (title && date) {
                if (window.ProclamacaoUtils) {
                    window.ProclamacaoUtils.announceToScreenReader(
                        `Evento: ${date.textContent} - ${title.textContent}`
                    );
                }
            }
        });
    });

    // ===== RESPONSIVIDADE =====
    function handleResize() {
        // Ajustar layout em telas pequenas
        if (window.innerWidth < 768) {
            // Em mobile, sempre mostrar lista
            showTimelineList();
        }
    }

    window.addEventListener('resize', debounce(handleResize, 250));
    handleResize(); // Executar na inicialização
});