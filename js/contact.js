// ===== FORMULÁRIO DE CONTATO ACESSÍVEL =====
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-btn');
    
    if (!contactForm) return;

    // ===== VALIDAÇÃO EM TEMPO REAL =====
    function setupRealTimeValidation() {
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Validação ao perder foco
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Limpar erros ao digitar
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }

    // ===== VALIDAÇÃO DE CAMPO =====
    function validateField(field) {
        const value = field.value.trim();
        const errorElement = document.getElementById(`${field.id}-error`);
        
        // Limpar erro anterior
        clearFieldError(field);
        
        let isValid = true;
        let errorMessage = '';
        
        // Validação obrigatória
        if (field.hasAttribute('required') && !value) {
            errorMessage = `${getFieldLabel(field)} é obrigatório.`;
            isValid = false;
        }
        
        // Validação de e-mail
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Por favor, insira um e-mail válido.';
                isValid = false;
            }
        }
        
        // Validação de telefone
        if (field.type === 'tel' && value) {
            const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
            if (!phoneRegex.test(value)) {
                errorMessage = 'Por favor, insira um telefone válido (ex: (11) 99999-9999).';
                isValid = false;
            }
        }
        
        // Validação de mensagem
        if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
            errorMessage = 'A mensagem deve ter pelo menos 10 caracteres.';
            isValid = false;
        }
        
        // Validação de checkbox de termos
        if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
            errorMessage = 'Você deve aceitar os termos de uso.';
            isValid = false;
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        }
        
        return isValid;
    }

    // ===== EXIBIR ERRO DE CAMPO =====
    function showFieldError(field, message) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('active');
        }
        
        // Anunciar erro para leitores de tela
        if (window.A11yUtils) {
            window.A11yUtils.announceToScreenReader(`Erro: ${message}`);
        }
    }

    // ===== LIMPAR ERRO DE CAMPO =====
    function clearFieldError(field) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('active');
        }
    }

    // ===== OBTER LABEL DO CAMPO =====
    function getFieldLabel(field) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label) {
            return label.textContent.replace('*', '').trim();
        }
        return field.name || field.id;
    }

    // ===== VALIDAÇÃO COMPLETA DO FORMULÁRIO =====
    function validateForm() {
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        let isValid = true;
        let firstErrorField = null;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
                if (!firstErrorField) {
                    firstErrorField = input;
                }
            }
        });
        
        // Focar no primeiro campo com erro
        if (!isValid && firstErrorField) {
            firstErrorField.focus();
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return isValid;
    }

    // ===== ENVIO DO FORMULÁRIO =====
    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            if (window.ProclamacaoUtils) {
                window.ProclamacaoUtils.showNotification('Por favor, corrija os erros no formulário.', 'error');
            }
            return;
        }
        
        // Mostrar estado de carregamento
        showLoadingState();
        
        // Simular envio (substitua por envio real)
        setTimeout(() => {
            hideLoadingState();
            showSuccessMessage();
            resetForm();
        }, 2000);
    }

    // ===== ESTADO DE CARREGAMENTO =====
    function showLoadingState() {
        const btnText = submitButton.querySelector('.btn-text');
        const btnLoading = submitButton.querySelector('.btn-loading');
        
        if (btnText && btnLoading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
        }
        
        submitButton.disabled = true;
        submitButton.setAttribute('aria-busy', 'true');
        
        // Desabilitar todos os campos
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.disabled = true;
        });
    }

    function hideLoadingState() {
        const btnText = submitButton.querySelector('.btn-text');
        const btnLoading = submitButton.querySelector('.btn-loading');
        
        if (btnText && btnLoading) {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
        
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
        
        // Reabilitar todos os campos
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.disabled = false;
        });
    }

    // ===== MENSAGEM DE SUCESSO =====
    function showSuccessMessage() {
        if (window.ProclamacaoUtils) {
            window.ProclamacaoUtils.showNotification(
                'Mensagem enviada com sucesso! Entraremos em contato em breve.',
                'success',
                6000
            );
        }
        
        // Anunciar para leitores de tela
        if (window.A11yUtils) {
            window.A11yUtils.announceToScreenReader('Formulário enviado com sucesso');
        }
    }

    // ===== RESET DO FORMULÁRIO =====
    function resetForm() {
        contactForm.reset();
        
        // Limpar todos os erros
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            clearFieldError(input);
        });
        
        // Focar no primeiro campo
        const firstInput = contactForm.querySelector('input, textarea, select');
        if (firstInput) {
            firstInput.focus();
        }
    }

    // ===== AUTOCOMPLETE E SUGESTÕES =====
    function setupAutocomplete() {
        const emailInput = document.getElementById('email');
        const nameInput = document.getElementById('nome');
        
        // Salvar dados no localStorage para autocomplete
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                if (this.value && window.ProclamacaoUtils) {
                    window.ProclamacaoUtils.saveToStorage('contact_email', this.value);
                }
            });
            
            // Carregar e-mail salvo
            if (window.ProclamacaoUtils) {
                const savedEmail = window.ProclamacaoUtils.getFromStorage('contact_email');
                if (savedEmail) {
                    emailInput.value = savedEmail;
                }
            }
        }
        
        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                if (this.value && window.ProclamacaoUtils) {
                    window.ProclamacaoUtils.saveToStorage('contact_name', this.value);
                }
            });
            
            // Carregar nome salvo
            if (window.ProclamacaoUtils) {
                const savedName = window.ProclamacaoUtils.getFromStorage('contact_name');
                if (savedName) {
                    nameInput.value = savedName;
                }
            }
        }
    }

    // ===== CONTADOR DE CARACTERES =====
    function setupCharacterCounter() {
        const messageTextarea = document.getElementById('mensagem');
        
        if (messageTextarea) {
            // Criar contador
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.style.cssText = `
                text-align: right;
                font-size: 0.9rem;
                color: var(--cinza-medio);
                margin-top: 0.5rem;
            `;
            
            messageTextarea.parentNode.appendChild(counter);
            
            function updateCounter() {
                const length = messageTextarea.value.length;
                const maxLength = messageTextarea.getAttribute('maxlength') || 1000;
                
                counter.textContent = `${length}/${maxLength} caracteres`;
                
                if (length > maxLength * 0.9) {
                    counter.style.color = 'var(--vermelho)';
                } else if (length > maxLength * 0.7) {
                    counter.style.color = '#f57c00';
                } else {
                    counter.style.color = 'var(--cinza-medio)';
                }
            }
            
            messageTextarea.addEventListener('input', updateCounter);
            updateCounter(); // Contador inicial
        }
    }

    // ===== VALIDAÇÃO DE ASSUNTO =====
    function setupSubjectValidation() {
        const assuntoSelect = document.getElementById('assunto');
        
        if (assuntoSelect) {
            assuntoSelect.addEventListener('change', function() {
                const mensagemTextarea = document.getElementById('mensagem');
                
                if (this.value && mensagemTextarea) {
                    // Sugerir conteúdo baseado no assunto
                    const suggestions = {
                        'duvida': 'Olá,\n\nGostaria de esclarecer uma dúvida sobre:\n\n',
                        'sugestao': 'Olá,\n\nGostaria de sugerir uma melhoria:\n\n',
                        'erro': 'Olá,\n\nEncontrei um erro no site:\n\n',
                        'acessibilidade': 'Olá,\n\nEncontrei uma questão de acessibilidade:\n\n',
                        'parceria': 'Olá,\n\nGostaria de propor uma parceria:\n\n'
                    };
                    
                    if (suggestions[this.value] && !mensagemTextarea.value) {
                        mensagemTextarea.value = suggestions[this.value];
                        mensagemTextarea.focus();
                    }
                }
            });
        }
    }

    // ===== PREVENÇÃO DE PERDA DE DADOS =====
    function setupDataLossPrevention() {
        let hasUnsavedChanges = false;
        
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                hasUnsavedChanges = true;
            });
        });
        
        // Avisar antes de sair da página
        window.addEventListener('beforeunload', function(e) {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?';
                return e.returnValue;
            }
        });
        
        // Limpar flag ao enviar
        contactForm.addEventListener('submit', function() {
            hasUnsavedChanges = false;
        });
    }

    // ===== EVENT LISTENERS =====
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // ===== INICIALIZAÇÃO =====
    setupRealTimeValidation();
    setupAutocomplete();
    setupCharacterCounter();
    setupSubjectValidation();
    setupDataLossPrevention();
    
    // ===== FUNCIONALIDADES EXTRAS =====
    
    // Salvar rascunho automaticamente
    function setupAutoSave() {
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('input', debounce(function() {
                const formData = new FormData(contactForm);
                const data = {};
                
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }
                
                if (window.ProclamacaoUtils) {
                    window.ProclamacaoUtils.saveToStorage('contact_draft', data);
                }
            }, 1000));
        });
        
        // Carregar rascunho salvo
        if (window.ProclamacaoUtils) {
            const draft = window.ProclamacaoUtils.getFromStorage('contact_draft');
            if (draft) {
                Object.keys(draft).forEach(key => {
                    const field = contactForm.querySelector(`[name="${key}"]`);
                    if (field && field.type !== 'checkbox') {
                        field.value = draft[key];
                    } else if (field && field.type === 'checkbox') {
                        field.checked = draft[key] === 'on';
                    }
                });
            }
        }
    }
    
    setupAutoSave();
    
    // Limpar rascunho ao enviar
    contactForm.addEventListener('submit', function() {
        if (window.ProclamacaoUtils) {
            window.ProclamacaoUtils.saveToStorage('contact_draft', null);
        }
    });
    
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
});