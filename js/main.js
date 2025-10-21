// ===== NAVEGAÇÃO RESPONSIVA E ACESSÍVEL =====
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu mobile com acessibilidade
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Focar no primeiro link do menu quando abrir
            if (!isExpanded) {
                const firstLink = navMenu.querySelector('.nav-link');
                if (firstLink) {
                    firstLink.focus();
                }
            }
        });
    }

    // Fechar menu ao clicar em link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // ===== SCROLL SUAVE =====
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Focar no elemento após scroll
                setTimeout(() => {
                    targetElement.focus();
                }, 500);
            }
        });
    });

    // ===== ANIMAÇÕES NO SCROLL =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.overview-card, .timeline-item, .audio-player, .personagem-card, .gallery-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // ===== LAZY LOADING DE IMAGENS =====
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // ===== CONTROLE DE ÁUDIO =====
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.volume = 0.5; // Volume padrão 50%

        audio.addEventListener('play', function() {
            // Pausar outros áudios quando um começar
            audioElements.forEach(otherAudio => {
                if (otherAudio !== audio) {
                    otherAudio.pause();
                }
            });
        });
    });

    // ===== ACESSIBILIDADE - NAVEGAÇÃO POR TECLADO =====
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Fechar menu mobile com ESC
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');

            // Fechar modais com ESC
            const modals = document.querySelectorAll('.modal.active');
            modals.forEach(modal => {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
            });

            // Fechar lightbox com ESC
            const lightbox = document.getElementById('lightbox');
            if (lightbox && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                lightbox.setAttribute('aria-hidden', 'true');
            }
        }
    });

    // ===== NOTIFICAÇÃO DE CARREGAMENTO =====
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');

        // Remover loading state se existir
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(el => {
            el.classList.remove('loading');
        });
    });

    // ===== HEADER STICKY =====
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', debounce(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, 10));

    // ===== MARCADOR DE PÁGINA ATIVA =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksArray = Array.from(navLinks);
    
    navLinksArray.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.setAttribute('aria-current', 'page');
            link.classList.add('active');
        } else {
            link.removeAttribute('aria-current');
            link.classList.remove('active');
        }
    });
});

// ===== FUNÇÕES UTILITÁRIAS =====

// Debounce para otimizar eventos de scroll/resize
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

// Função para mostrar notificações acessíveis
function showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    const icon = getNotificationIcon(type);
    const title = getNotificationTitle(type);
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon" aria-hidden="true">${icon}</div>
            <div class="notification-text">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" aria-label="Fechar notificação">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `;

    // Estilos inline para garantir visibilidade
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--branco);
        padding: var(--espacamento-md);
        border-radius: var(--borda-radius);
        box-shadow: var(--sombra-forte);
        z-index: 10000;
        max-width: 400px;
        border-left: 4px solid ${getNotificationColor(type)};
        transform: translateX(100%);
        transition: var(--transicao-normal);
    `;

    document.body.appendChild(notification);

    // Mostrar notificação
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Botão de fechar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });

    // Remover após duração especificada
    setTimeout(() => {
        hideNotification(notification);
    }, duration);
}

function hideNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

function getNotificationTitle(type) {
    const titles = {
        success: 'Sucesso',
        error: 'Erro',
        warning: 'Atenção',
        info: 'Informação'
    };
    return titles[type] || titles.info;
}

function getNotificationColor(type) {
    const colors = {
        success: 'var(--verde)',
        error: 'var(--vermelho)',
        warning: '#f57c00',
        info: '#1976d2'
    };
    return colors[type] || colors.info;
}

// Função para validar formulários com acessibilidade
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    let firstError = null;

    inputs.forEach(input => {
        const value = input.value.trim();
        const errorElement = document.getElementById(`${input.name}-error`) || 
                            document.getElementById(`${input.id}-error`);

        // Reset previous errors
        input.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('active');
            errorElement.textContent = '';
        }

        // Required validation
        if (input.hasAttribute('required') && !value) {
            const errorMsg = `${getFieldLabel(input)} é obrigatório.`;
            showFieldError(input, errorMsg, errorElement);
            isValid = false;
            if (!firstError) firstError = input;
        }

        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                const errorMsg = 'Por favor, insira um e-mail válido.';
                showFieldError(input, errorMsg, errorElement);
                isValid = false;
                if (!firstError) firstError = input;
            }
        }

        // Phone validation (Brazilian format)
        if (input.type === 'tel' && value) {
            const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
            if (!phoneRegex.test(value)) {
                const errorMsg = 'Por favor, insira um telefone válido (ex: (11) 99999-9999).';
                showFieldError(input, errorMsg, errorElement);
                isValid = false;
                if (!firstError) firstError = input;
            }
        }

        // Textarea minimum length
        if (input.tagName === 'TEXTAREA' && value && value.length < 10) {
            const errorMsg = 'A mensagem deve ter pelo menos 10 caracteres.';
            showFieldError(input, errorMsg, errorElement);
            isValid = false;
            if (!firstError) firstError = input;
        }
    });

    // Focar no primeiro erro
    if (!isValid && firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
}

function showFieldError(input, message, errorElement) {
    input.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }
}

function getFieldLabel(input) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) {
        return label.textContent.replace('*', '').trim();
    }
    return input.name || input.id;
}

// Função para salvar dados no localStorage
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.warn('LocalStorage não disponível:', e);
        return false;
    }
}

// Função para recuperar dados do localStorage
function getFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.warn('Erro ao recuperar dados do localStorage:', e);
        return null;
    }
}

// ===== PERFORMANCE E SEO =====

// Preload de páginas importantes
function preloadPage(href) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
}

// Precarregar páginas principais após carregamento
window.addEventListener('load', function() {
    const importantPages = ['historia.html', 'personagens.html', 'quiz.html'];
    importantPages.forEach(page => {
        setTimeout(() => preloadPage(page), 2000);
    });
});

// ===== TRATAMENTO DE ERROS =====
window.addEventListener('error', function(e) {
    console.error('Erro JavaScript:', e.error);
    // Em produção, você pode enviar erros para um serviço de monitoramento
});

// Service Worker registration (se existir)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registrado:', registration.scope);
            })
            .catch(function(error) {
                console.log('Falha no SW:', error);
            });
    });
}

// ===== ANALYTICS E TRACKING (OPCIONAL) =====
function trackEvent(category, action, label) {
    // Integração com Google Analytics ou similar
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    console.log(`Evento: ${category} - ${action} - ${label}`);
}

// Rastrear cliques em links importantes
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link) {
        const href = link.getAttribute('href');
        if (href && href.endsWith('.html')) {
            trackEvent('Navigation', 'Page Click', href);
        }
    }
});

// ===== UTILITÁRIOS DE ACESSIBILIDADE =====

// Função para anunciar mudanças para leitores de tela
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Função para gerenciar foco em modais
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
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
    });
}

// Função para restaurar foco após fechar modal
let previousActiveElement = null;

function saveActiveElement() {
    previousActiveElement = document.activeElement;
}

function restoreActiveElement() {
    if (previousActiveElement) {
        previousActiveElement.focus();
        previousActiveElement = null;
    }
}

// ===== EXPORTAR FUNÇÕES PARA USO EM OUTROS MÓDULOS =====
window.ProclamacaoUtils = {
    showNotification,
    validateForm,
    saveToStorage,
    getFromStorage,
    trackEvent,
    announceToScreenReader,
    trapFocus,
    saveActiveElement,
    restoreActiveElement,
    debounce
};