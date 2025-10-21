// ===== QUIZ INTERATIVO ACESSÍVEL =====
document.addEventListener('DOMContentLoaded', function() {
    const quizContainer = document.querySelector('.quiz-container');
    
    if (!quizContainer) return;

// ===== DADOS DO QUIZ =====
    const quizData = {
        title: "Quiz: Proclamação da República",
        description: "Teste seus conhecimentos sobre a Proclamação da República do Brasil",
        questions: [
            {
                id: 1,
                question: "Em que data foi proclamada a República do Brasil?",
                options: [
                    "15 de novembro de 1888",
                    "15 de novembro de 1889",
                    "15 de novembro de 1890",
                    "15 de novembro de 1891"
                ],
        correct: 1,
        explanation: "A Proclamação da República ocorreu em 15 de novembro de 1889, no Campo de Santana, Rio de Janeiro."
    },
    {
                id: 2,
                question: "Quem foi o líder militar que proclamou a República?",
                options: [
                    "Floriano Peixoto",
                    "Benjamin Constant",
                    "Deodoro da Fonseca",
                    "Quintino Bocaiuva"
                ],
        correct: 2,
                explanation: "O Marechal Deodoro da Fonseca foi o líder militar que proclamou a República e tornou-se o primeiro presidente do Brasil."
            },
            {
                id: 3,
                question: "Qual foi o último imperador do Brasil?",
                options: [
                    "Dom Pedro I",
                    "Dom Pedro II",
                    "Princesa Isabel",
                    "Dom João VI"
                ],
                correct: 1,
                explanation: "Dom Pedro II foi o último imperador do Brasil, deposto em 15 de novembro de 1889."
            },
            {
                id: 4,
                question: "Onde ocorreu a Proclamação da República?",
                options: [
                    "Praça da República, São Paulo",
                    "Campo de Santana, Rio de Janeiro",
                    "Praça da Liberdade, Belo Horizonte",
                    "Praça da República, Salvador"
                ],
        correct: 1,
                explanation: "A Proclamação da República ocorreu no Campo de Santana, no Rio de Janeiro, então capital do Brasil."
            },
            {
                id: 5,
                question: "Qual documento estabeleceu as bases ideológicas do movimento republicano?",
                options: [
                    "Constituição de 1891",
                    "Manifesto Republicano de 1870",
                    "Lei Áurea de 1888",
                    "Proclamação de 1889"
                ],
        correct: 1,
                explanation: "O Manifesto Republicano de 1870 estabeleceu as bases ideológicas do movimento republicano brasileiro."
            },
            {
                id: 6,
                question: "Quem assinou a Lei Áurea em 1888, abolindo a escravidão?",
                options: [
                    "Dom Pedro II",
                    "Princesa Isabel",
                    "Deodoro da Fonseca",
                    "Rui Barbosa"
                ],
                correct: 1,
                explanation: "A Princesa Isabel, regente do Brasil, assinou a Lei Áurea em 13 de maio de 1888, abolindo definitivamente a escravidão no Brasil."
            },
            {
                id: 7,
                question: "Qual militar ficou conhecido como 'Marechal de Ferro'?",
                options: [
                    "Deodoro da Fonseca",
                    "Benjamin Constant",
                    "Floriano Peixoto",
                    "Quintino Bocaiuva"
                ],
                correct: 2,
                explanation: "Floriano Peixoto, segundo presidente do Brasil, ficou conhecido como 'Marechal de Ferro' por sua firmeza ao consolidar a República."
            },
            {
                id: 8,
                question: "Qual foi o principal redator da Constituição de 1891?",
                options: [
                    "Benjamin Constant",
                    "Quintino Bocaiuva",
                    "Rui Barbosa",
                    "José do Patrocínio"
                ],
                correct: 2,
                explanation: "Rui Barbosa foi o principal redator da primeira Constituição republicana brasileira, promulgada em 24 de fevereiro de 1891."
            },
            {
                id: 9,
                question: "Que conflito contribuiu para a politização do Exército brasileiro?",
                options: [
                    "Guerra dos Farrapos",
                    "Guerra do Paraguai",
                    "Revolta da Armada",
                    "Guerra de Canudos"
                ],
                correct: 1,
                explanation: "A Guerra do Paraguai (1864-1870) politizou o Exército brasileiro, criando oficiais que questionavam o regime imperial."
            },
            {
                id: 10,
                question: "Qual foi a primeira forma de governo da República brasileira?",
                options: [
                    "Parlamentarismo",
                    "Monarquia Constitucional",
                    "Governo Provisório",
                    "Ditadura Militar"
                ],
                correct: 2,
                explanation: "Após a Proclamação, foi estabelecido um Governo Provisório liderado por Deodoro da Fonseca, até a promulgação da Constituição de 1891."
            }
        ]
    };

    let currentQuestion = 0;
    let userAnswers = [];
    let startTime = null;
    let quizCompleted = false;

    // ===== INICIALIZAR QUIZ =====
    function initializeQuiz() {
        renderQuiz();
        startTime = Date.now();
        
        // Anunciar início do quiz
        if (window.A11yUtils) {
            window.A11yUtils.announceToScreenReader('Quiz iniciado. Primeira pergunta carregada.');
        }
    }

    // ===== RENDERIZAR QUIZ =====
    function renderQuiz() {
        quizContainer.innerHTML = `
            <div class="quiz-header">
                <h1>${quizData.title}</h1>
                <p>${quizData.description}</p>
            </div>
            
            <div class="quiz-progress-container">
                <div class="quiz-progress" role="progressbar" 
                     aria-valuenow="${currentQuestion + 1}" 
                     aria-valuemin="1" 
                     aria-valuemax="${quizData.questions.length}"
                     aria-label="Progresso do quiz">
                    <div class="quiz-progress-fill" 
                         style="width: ${((currentQuestion + 1) / quizData.questions.length) * 100}%"></div>
                </div>
                <div class="quiz-progress-text">
                    Pergunta ${currentQuestion + 1} de ${quizData.questions.length}
                </div>
            </div>
            
            <div class="quiz-question-container">
                ${renderQuestion()}
            </div>
            
            <div class="quiz-controls">
                <button class="btn btn-outline" id="prev-btn" ${currentQuestion === 0 ? 'disabled' : ''}>
                    ← Anterior
                </button>
                <button class="btn btn-primary" id="next-btn" ${currentQuestion === quizData.questions.length - 1 ? 'style="display: none;"' : ''}>
                    Próxima →
                </button>
                <button class="btn btn-primary" id="finish-btn" style="display: none;">
                    Finalizar Quiz
                </button>
            </div>
            
            <div class="quiz-results" id="quiz-results" style="display: none;"></div>
        `;
        
        setupQuizEventListeners();
    }

    // ===== RENDERIZAR PERGUNTA =====
    function renderQuestion() {
        const question = quizData.questions[currentQuestion];
        const userAnswer = userAnswers[currentQuestion];
        
        return `
            <div class="quiz-question" role="group" aria-labelledby="question-${question.id}">
                <h2 id="question-${question.id}" class="question-text">
                    ${question.question}
                </h2>
                
                <ul class="options-list" role="radiogroup" aria-labelledby="question-${question.id}">
                    ${question.options.map((option, index) => `
                        <li class="option-item">
                            <button class="option-button ${userAnswer === index ? 'selected' : ''}" 
                                    data-option="${index}"
                                    role="radio"
                                    aria-checked="${userAnswer === index}"
                                    aria-describedby="option-${question.id}-${index}">
                                <span id="option-${question.id}-${index}">${option}</span>
                            </button>
                        </li>
                    `).join('')}
                </ul>
                
                <!-- Explicação removida na pergunta; será mostrada apenas no resumo final -->
            </div>
        `;
    }

    // ===== CONFIGURAR EVENT LISTENERS =====
    function setupQuizEventListeners() {
        // Botões de opção
        const optionButtons = document.querySelectorAll('.option-button');
        optionButtons.forEach(button => {
            button.addEventListener('click', function() {
                selectOption(parseInt(this.dataset.option));
            });
            
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectOption(parseInt(this.dataset.option));
                }
            });
        });

        // Botões de navegação
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const finishBtn = document.getElementById('finish-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', goToPreviousQuestion);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', goToNextQuestion);
        }

        if (finishBtn) {
            finishBtn.addEventListener('click', finishQuiz);
        }

        // Navegação por teclado
        document.addEventListener('keydown', handleKeyboardNavigation);
    }

    // ===== SELECIONAR OPÇÃO =====
    function selectOption(optionIndex) {
        userAnswers[currentQuestion] = optionIndex;
        
        // Atualizar interface
        const optionButtons = document.querySelectorAll('.option-button');
        optionButtons.forEach((button, index) => {
            button.classList.remove('selected');
            button.setAttribute('aria-checked', 'false');
            
            if (index === optionIndex) {
                button.classList.add('selected');
                button.setAttribute('aria-checked', 'true');
            }
        });
        
        // Não mostrar explicação imediata; feedback apenas no resultado final
        
        // Anunciar seleção
        if (window.A11yUtils) {
            const question = quizData.questions[currentQuestion];
            window.A11yUtils.announceToScreenReader(
                `Opção selecionada: ${question.options[optionIndex]}`
            );
        }
        
        // Atualizar botões de navegação
        updateNavigationButtons();
    }

    // ===== MOSTRAR EXPLICAÇÃO =====
    function showExplanation() {
        const question = quizData.questions[currentQuestion];
        const explanation = document.getElementById(`explanation-${question.id}`);
        
        if (explanation) {
            explanation.style.display = 'block';
            
            // Adicionar classe de animação
            explanation.classList.add('fade-in');
        }
    }

    // ===== NAVEGAÇÃO ENTRE PERGUNTAS =====
    function goToPreviousQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            renderQuiz();
            
            // Anunciar mudança
            if (window.A11yUtils) {
                window.A11yUtils.announceToScreenReader(
                    `Pergunta ${currentQuestion + 1}: ${quizData.questions[currentQuestion].question}`
                );
            }
        }
    }

    function goToNextQuestion() {
        if (currentQuestion < quizData.questions.length - 1) {
        currentQuestion++;
            renderQuiz();
            
            // Anunciar mudança
            if (window.A11yUtils) {
                window.A11yUtils.announceToScreenReader(
                    `Pergunta ${currentQuestion + 1}: ${quizData.questions[currentQuestion].question}`
                );
            }
        }
    }

    // ===== ATUALIZAR BOTÕES DE NAVEGAÇÃO =====
    function updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const finishBtn = document.getElementById('finish-btn');
        
        if (prevBtn) {
            prevBtn.disabled = currentQuestion === 0;
        }
        
        if (currentQuestion === quizData.questions.length - 1) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (finishBtn) finishBtn.style.display = 'inline-block';
        } else {
            if (nextBtn) nextBtn.style.display = 'inline-block';
            if (finishBtn) finishBtn.style.display = 'none';
        }
    }

    // ===== FINALIZAR QUIZ =====
    function finishQuiz() {
        quizCompleted = true;
        const endTime = Date.now();
        const timeSpent = Math.round((endTime - startTime) / 1000);
        
        // Calcular pontuação
        let correctAnswers = 0;
        quizData.questions.forEach((question, index) => {
            if (userAnswers[index] === question.correct) {
                correctAnswers++;
            }
        });
        
        const score = Math.round((correctAnswers / quizData.questions.length) * 100);
        
        // Renderizar resultados
        renderResults(correctAnswers, score, timeSpent);
        
        // Salvar resultado
        saveQuizResult(score, timeSpent);
        
        // Anunciar conclusão
        if (window.A11yUtils) {
            window.A11yUtils.announceToScreenReader(
                `Quiz finalizado. Você acertou ${correctAnswers} de ${quizData.questions.length} perguntas. Pontuação: ${score}%`
            );
        }
    }

    // ===== RENDERIZAR RESULTADOS =====
    function renderResults(correctAnswers, score, timeSpent) {
        const resultsContainer = document.getElementById('quiz-results');
        
        let performanceMessage = '';
        let performanceClass = '';
        
        if (score >= 90) {
            performanceMessage = 'Excelente! Você demonstra um conhecimento excepcional sobre a Proclamação da República.';
            performanceClass = 'excellent';
        } else if (score >= 70) {
            performanceMessage = 'Muito bom! Você tem um bom conhecimento sobre o tema.';
            performanceClass = 'good';
        } else if (score >= 50) {
            performanceMessage = 'Bom! Continue estudando para melhorar seu conhecimento.';
            performanceClass = 'average';
        } else {
            performanceMessage = 'Que tal revisar o conteúdo? Há muito mais para aprender!';
            performanceClass = 'needs-improvement';
        }
        
        resultsContainer.innerHTML = `
            <div class="quiz-results-content ${performanceClass}">
                <h2>Resultado do Quiz</h2>
                
                <div class="score-display">
                    <div class="score-circle">
                        <span class="score-number">${score}%</span>
                    </div>
                    <div class="score-details">
                        <p><strong>${correctAnswers}</strong> de <strong>${quizData.questions.length}</strong> perguntas corretas</p>
                        <p>Tempo: <strong>${formatTime(timeSpent)}</strong></p>
                    </div>
                </div>
                
                <div class="performance-message">
                    <p>${performanceMessage}</p>
                </div>
                
                <div class="detailed-results">
                    <h3>Respostas Detalhadas</h3>
                    ${quizData.questions.map((question, index) => {
                        const userAnswer = userAnswers[index];
                        const isCorrect = userAnswer === question.correct;
                        const userOption = question.options[userAnswer] || 'Não respondida';
                        const correctOption = question.options[question.correct];
                        
                        return `
                            <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
                                <h4>Pergunta ${index + 1}</h4>
                                <p class="question-text">${question.question}</p>
                                <div class="answer-comparison">
                                    <p><strong>Sua resposta:</strong> ${userOption}</p>
                                    <p><strong>Resposta correta:</strong> ${correctOption}</p>
                                </div>
                                <p class="explanation">${question.explanation}</p>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="quiz-actions">
                    <button class="btn btn-primary" id="retake-quiz">
                        Refazer Quiz
                    </button>
                    <button class="btn btn-outline" id="share-results">
                        Compartilhar Resultado
                    </button>
                </div>
            </div>
        `;
        
        resultsContainer.style.display = 'block';
        
        // Configurar botões de ação
        const retakeBtn = document.getElementById('retake-quiz');
        const shareBtn = document.getElementById('share-results');
        
        if (retakeBtn) {
            retakeBtn.addEventListener('click', retakeQuiz);
        }
        
        if (shareBtn) {
            shareBtn.addEventListener('click', shareResults);
        }
    }

    // ===== REFAZER QUIZ =====
    function retakeQuiz() {
        currentQuestion = 0;
        userAnswers = [];
        startTime = Date.now();
        quizCompleted = false;
        
        renderQuiz();
        
        // Anunciar reinício
        if (window.A11yUtils) {
            window.A11yUtils.announceToScreenReader('Quiz reiniciado. Primeira pergunta carregada.');
        }
    }

    // ===== COMPARTILHAR RESULTADOS =====
    function shareResults() {
        const correctAnswers = userAnswers.filter((answer, index) => 
            answer === quizData.questions[index].correct
        ).length;
        const score = Math.round((correctAnswers / quizData.questions.length) * 100);
        
        const shareText = `Acabei de fazer o quiz sobre a Proclamação da República e acertei ${correctAnswers} de ${quizData.questions.length} perguntas (${score}%)! Teste seus conhecimentos também!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Quiz - Proclamação da República',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copiar para clipboard
            navigator.clipboard.writeText(`${shareText} ${window.location.href}`).then(() => {
                if (window.ProclamacaoUtils) {
                    window.ProclamacaoUtils.showNotification('Resultado copiado para a área de transferência!', 'success');
                }
            });
        }
    }

    // ===== SALVAR RESULTADO =====
    function saveQuizResult(score, timeSpent) {
        const result = {
            score: score,
            timeSpent: timeSpent,
            date: new Date().toISOString(),
            answers: userAnswers
        };
        
        if (window.ProclamacaoUtils) {
            const results = window.ProclamacaoUtils.getFromStorage('quiz_results') || [];
            results.push(result);

        // Manter apenas os últimos 10 resultados
        if (results.length > 10) {
                results.splice(0, results.length - 10);
            }
            
            window.ProclamacaoUtils.saveToStorage('quiz_results', results);
        }
    }

    // ===== NAVEGAÇÃO POR TECLADO =====
    function handleKeyboardNavigation(e) {
        if (quizCompleted) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                goToPreviousQuestion();
                break;
            case 'ArrowRight':
                e.preventDefault();
                goToNextQuestion();
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                e.preventDefault();
            const optionIndex = parseInt(e.key) - 1;
                if (optionIndex < quizData.questions[currentQuestion].options.length) {
                selectOption(optionIndex);
            }
                break;
        }
    }

    // ===== UTILITÁRIOS =====
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        } else {
            return `${remainingSeconds}s`;
        }
    }

    // ===== INICIALIZAÇÃO =====
    initializeQuiz();
});