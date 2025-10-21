// ===== MÓDULO DE ACESSIBILIDADE AVANÇADA =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SKIP LINKS =====
    function setupSkipLinks() {
        const skipLinks = document.querySelectorAll('.skip-link');
        skipLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.focus();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ===== FOCO VISÍVEL =====
    function setupFocusManagement() {
        // Adicionar classe quando elemento recebe foco via teclado
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        // Remover classe quando elemento recebe foco via mouse
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });

        // Adicionar estilos CSS para foco visível
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 3px solid var(--amarelo) !important;
                outline-offset: 2px !important;
            }
            
            .keyboard-navigation *:focus:not(:focus-visible) {
                outline: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== TRAP DE FOCO PARA MODAIS =====
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        function handleTabKey(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        }

        element.addEventListener('keydown', handleTabKey);
        
        // Retornar função para remover listener
        return () => {
            element.removeEventListener('keydown', handleTabKey);
        };
    }

    // ===== GERENCIAMENTO DE MODAIS =====
    function setupModalAccessibility() {
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            const closeButton = modal.querySelector('.modal-close');
            const modalContent = modal.querySelector('.modal-content');
            
            if (closeButton) {
                closeButton.addEventListener('click', function() {
                    closeModal(modal);
                });
            }
            
            // Fechar modal ao clicar no fundo
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
            
            // Fechar modal com ESC
            modal.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeModal(modal);
                }
            });
        });
    }

    function openModal(modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        
        // Salvar elemento ativo anterior
        const activeElement = document.activeElement;
        modal.dataset.previousActiveElement = activeElement.id || activeElement.className;
        
        // Configurar trap de foco
        const removeTrap = trapFocus(modal);
        modal.dataset.removeTrap = removeTrap;
        
        // Focar no primeiro elemento focável
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        
        // Remover trap de foco
        if (modal.dataset.removeTrap) {
            modal.dataset.removeTrap();
        }
        
        // Restaurar foco
        const previousElementId = modal.dataset.previousActiveElement;
        if (previousElementId) {
            const previousElement = document.getElementById(previousElementId) || 
                                  document.querySelector(`.${previousElementId}`);
            if (previousElement) {
                previousElement.focus();
            }
        }
        
        // Restaurar scroll do body
        document.body.style.overflow = '';
    }

    // ===== ACCORDION ACESSÍVEL =====
    function setupAccordionAccessibility() {
        const accordionTriggers = document.querySelectorAll('.accordion-trigger');
        
        accordionTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                const content = document.getElementById(this.getAttribute('aria-controls'));
                
                // Atualizar estado
                this.setAttribute('aria-expanded', !isExpanded);
                content.classList.toggle('active');
                
                // Anunciar mudança para leitores de tela
                announceToScreenReader(
                    `${isExpanded ? 'Recolhido' : 'Expandido'}: ${this.textContent.trim()}`
                );
            });
        });
    }

    // ===== FORMULÁRIOS ACESSÍVEIS =====
    function setupFormAccessibility() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Validação em tempo real
                input.addEventListener('blur', function() {
                    validateField(this);
                });
                
                // Limpar erros ao digitar
                input.addEventListener('input', function() {
                    clearFieldError(this);
                });
            });
            
            // Validação no submit
            form.addEventListener('submit', function(e) {
                if (!validateForm(this)) {
                    e.preventDefault();
                }
            });
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        const errorElement = document.getElementById(`${field.id}-error`);
        
        // Limpar erro anterior
        clearFieldError(field);
        
        // Validações
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, `${getFieldLabel(field)} é obrigatório.`);
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Por favor, insira um e-mail válido.');
                return false;
            }
        }
        
        if (field.type === 'tel' && value) {
            const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
            if (!phoneRegex.test(value)) {
                showFieldError(field, 'Por favor, insira um telefone válido.');
                return false;
            }
        }
        
        return true;
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('active');
        }
        
        // Anunciar erro para leitores de tela
        announceToScreenReader(`Erro: ${message}`);
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('active');
        }
    }

    function getFieldLabel(field) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label) {
            return label.textContent.replace('*', '').trim();
        }
        return field.name || field.id;
    }

    // ===== ANÚNCIOS PARA LEITORES DE TELA =====
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);
    }

    // ===== NAVEGAÇÃO POR TECLADO =====
    function setupKeyboardNavigation() {
        // Navegação por setas em listas
        const lists = document.querySelectorAll('ul, ol');
        lists.forEach(list => {
            const items = list.querySelectorAll('li');
            items.forEach((item, index) => {
                item.setAttribute('tabindex', '0');
                
                item.addEventListener('keydown', function(e) {
                    switch(e.key) {
                        case 'ArrowDown':
                            e.preventDefault();
                            const nextItem = items[index + 1];
                            if (nextItem) nextItem.focus();
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            const prevItem = items[index - 1];
                            if (prevItem) prevItem.focus();
                            break;
                        case 'Home':
                            e.preventDefault();
                            items[0].focus();
                            break;
                        case 'End':
                            e.preventDefault();
                            items[items.length - 1].focus();
                            break;
                    }
                });
            });
        });
    }

    // ===== REDUÇÃO DE MOVIMENTO =====
    function setupReducedMotion() {
        // Verificar preferência do usuário
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        function handleMotionChange() {
            if (prefersReducedMotion.matches) {
                document.body.classList.add('reduced-motion');
                // Desabilitar animações
                const style = document.createElement('style');
                style.textContent = `
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                `;
                document.head.appendChild(style);
            } else {
                document.body.classList.remove('reduced-motion');
            }
        }
        
        handleMotionChange();
        prefersReducedMotion.addEventListener('change', handleMotionChange);
    }

    // ===== ALTO CONTRASTE =====
    function setupHighContrast() {
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
        
        function handleContrastChange() {
            if (prefersHighContrast.matches) {
                document.body.classList.add('high-contrast');
                // Aplicar estilos de alto contraste
                const style = document.createElement('style');
                style.textContent = `
                    .high-contrast {
                        --verde: #000000;
                        --amarelo: #FFFF00;
                        --preto: #000000;
                        --branco: #FFFFFF;
                    }
                    
                    .high-contrast .card {
                        border: 2px solid var(--preto);
                    }
                    
                    .high-contrast .btn {
                        border: 2px solid var(--preto);
                    }
                `;
                document.head.appendChild(style);
            } else {
                document.body.classList.remove('high-contrast');
            }
        }
        
        handleContrastChange();
        prefersHighContrast.addEventListener('change', handleContrastChange);
    }

    // ===== INDICADORES DE CARREGAMENTO =====
    function setupLoadingIndicators() {
        // Adicionar indicador de carregamento para links externos
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        externalLinks.forEach(link => {
            link.addEventListener('click', function() {
                const indicator = document.createElement('div');
                indicator.className = 'loading-indicator';
                indicator.setAttribute('aria-live', 'polite');
                indicator.textContent = 'Carregando página externa...';
                indicator.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: var(--verde);
                    color: var(--branco);
                    padding: 1rem 2rem;
                    border-radius: var(--borda-radius);
                    z-index: 10000;
                `;
                document.body.appendChild(indicator);
                
                // Remover após 3 segundos
                setTimeout(() => {
                    if (indicator.parentNode) {
                        indicator.parentNode.removeChild(indicator);
                    }
                }, 3000);
            });
        });
    }

    // ===== VERIFICAÇÃO DE ACESSIBILIDADE =====
    function runAccessibilityChecks() {
        const issues = [];
        
        // Verificar imagens sem alt
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        imagesWithoutAlt.forEach(img => {
            issues.push(`Imagem sem texto alternativo: ${img.src}`);
        });
        
        // Verificar links sem texto
        const linksWithoutText = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
        linksWithoutText.forEach(link => {
            if (!link.textContent.trim() && !link.querySelector('img[alt]')) {
                issues.push(`Link sem texto: ${link.href}`);
            }
        });
        
        // Verificar formulários sem labels
        const inputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        inputsWithoutLabels.forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (!label) {
                issues.push(`Campo sem label: ${input.id || input.name}`);
            }
        });
        
        // Log dos problemas encontrados
        if (issues.length > 0) {
            console.warn('Problemas de acessibilidade encontrados:', issues);
        }
        
        return issues;
    }

    // ===== INICIALIZAÇÃO =====
    setupSkipLinks();
    setupFocusManagement();
    setupModalAccessibility();
    setupAccordionAccessibility();
    setupFormAccessibility();
    setupKeyboardNavigation();
    setupReducedMotion();
    setupHighContrast();
    setupLoadingIndicators();
    
    // Executar verificações após carregamento completo
    window.addEventListener('load', function() {
        setTimeout(runAccessibilityChecks, 1000);
    });

    // ===== EXPORTAR FUNÇÕES =====
    window.A11yUtils = {
        trapFocus,
        openModal,
        closeModal,
        announceToScreenReader,
        validateField,
        showFieldError,
        clearFieldError,
        runAccessibilityChecks
    };
});
