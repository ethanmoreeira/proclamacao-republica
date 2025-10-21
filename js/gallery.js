// ===== GALERIA ACESSÍVEL COM LIGHTBOX =====
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const filterButtons = document.querySelectorAll('.gallery-controls button');

    // Verificar se os elementos existem
    if (!galleryItems.length || !lightbox) return;

    let currentImageIndex = 0;
    let filteredItems = Array.from(galleryItems);
    let currentFilter = 'all';

    // ===== FILTROS DA GALERIA =====
    function setupGalleryFilters() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.id.replace('filter-', '');
                filterGallery(filter);
                
                // Atualizar estado dos botões
                filterButtons.forEach(btn => {
                    btn.setAttribute('aria-pressed', 'false');
                    btn.classList.remove('active');
                });
                this.setAttribute('aria-pressed', 'true');
                this.classList.add('active');
                
                currentFilter = filter;
                
                // Anunciar mudança para leitores de tela
                if (window.ProclamacaoUtils) {
                    window.ProclamacaoUtils.announceToScreenReader(
                        `Filtro aplicado: ${getFilterName(filter)}`
                    );
                }
            });
        });
    }

    function filterGallery(filter) {
        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            item.style.display = shouldShow ? 'block' : 'none';
            item.setAttribute('aria-hidden', !shouldShow);
            
            if (shouldShow) {
                item.classList.add('fade-in');
            }
        });

        // Atualizar lista de itens filtrados
        filteredItems = Array.from(galleryItems).filter(item => 
            item.style.display !== 'none'
        );
    }

    function getFilterName(filter) {
        const names = {
            all: 'Todas as imagens',
            paintings: 'Pinturas',
            photos: 'Fotografias',
            documents: 'Documentos'
        };
        return names[filter] || filter;
    }

    // ===== LIGHTBOX =====
    function openLightbox(index) {
        if (!filteredItems[index]) return;
        
        currentImageIndex = index;
        const item = filteredItems[index];
        const img = item.querySelector('img');
        const title = item.querySelector('h3');
        const description = item.querySelector('p');
        
        // Salvar elemento ativo anterior
        if (window.ProclamacaoUtils) {
            window.ProclamacaoUtils.saveActiveElement();
        }
        
        // Configurar lightbox
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxTitle.textContent = title ? title.textContent : '';
        lightboxDescription.textContent = description ? description.textContent : '';
        
        // Mostrar lightbox
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        
        // Focar no botão de fechar
        lightboxClose.focus();
        
        // Configurar trap de foco
        if (window.ProclamacaoUtils) {
            window.ProclamacaoUtils.trapFocus(lightbox);
        }
        
        // Anunciar para leitores de tela
        if (window.ProclamacaoUtils) {
            window.ProclamacaoUtils.announceToScreenReader(
                `Imagem ${index + 1} de ${filteredItems.length}: ${lightboxTitle.textContent}`
            );
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        
        // Restaurar foco
        if (window.ProclamacaoUtils) {
            window.ProclamacaoUtils.restoreActiveElement();
        }
        
        // Anunciar fechamento
        if (window.ProclamacaoUtils) {
            window.ProclamacaoUtils.announceToScreenReader('Lightbox fechado');
        }
    }

    function showNextImage() {
        const nextIndex = (currentImageIndex + 1) % filteredItems.length;
        openLightbox(nextIndex);
    }

    function showPrevImage() {
        const prevIndex = currentImageIndex === 0 ? filteredItems.length - 1 : currentImageIndex - 1;
        openLightbox(prevIndex);
    }

    // ===== EVENT LISTENERS =====
    
    // Abrir lightbox ao clicar nos itens da galeria
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img) {
            // Clique na imagem
            img.addEventListener('click', function() {
                const filteredIndex = filteredItems.indexOf(item);
                if (filteredIndex !== -1) {
                    openLightbox(filteredIndex);
                }
            });
            
            // Enter/Space no item da galeria
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const filteredIndex = filteredItems.indexOf(item);
                    if (filteredIndex !== -1) {
                        openLightbox(filteredIndex);
                    }
                }
            });
        }
    });

    // Controles do lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    // Fechar lightbox ao clicar no fundo
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // ===== NAVEGAÇÃO POR TECLADO =====
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                e.preventDefault();
                closeLightbox();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                showPrevImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                showNextImage();
                break;
            case 'Home':
                e.preventDefault();
                openLightbox(0);
                break;
            case 'End':
                e.preventDefault();
                openLightbox(filteredItems.length - 1);
                break;
        }
    });

    // ===== LAZY LOADING =====
    function setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Carregar imagem se ainda não foi carregada
                    if (img.dataset.src && !img.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Adicionar classe de carregado
                    img.classList.add('loaded');
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Observar todas as imagens da galeria
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            if (img) {
                imageObserver.observe(img);
            }
        });
    }

    setupLazyLoading();

    // ===== FUNCIONALIDADE DE DOWNLOAD =====
    function setupDownloadFunctionality() {
        // Adicionar botão de download no lightbox se não existir
        let downloadButton = document.querySelector('.lightbox-download');
        if (!downloadButton) {
            downloadButton = document.createElement('button');
            downloadButton.className = 'lightbox-download lightbox-btn';
            downloadButton.innerHTML = '⬇️';
            downloadButton.setAttribute('aria-label', 'Baixar imagem');
            
            const lightboxControls = document.querySelector('.lightbox-controls');
            if (lightboxControls) {
                lightboxControls.appendChild(downloadButton);
            }
        }

        downloadButton.addEventListener('click', function() {
            downloadCurrentImage();
        });
    }

    function downloadCurrentImage() {
        const currentItem = filteredItems[currentImageIndex];
        const img = currentItem.querySelector('img');
        
        if (img) {
            // Criar link de download
            const link = document.createElement('a');
            link.href = img.src;
            link.download = `proclamacao-republica-${currentImageIndex + 1}.jpg`;
            link.click();
            
            if (window.ProclamacaoUtils) {
                window.ProclamacaoUtils.showNotification('Download iniciado!', 'success');
            }
        }
    }

    setupDownloadFunctionality();

    // ===== FUNCIONALIDADE DE COMPARTILHAMENTO =====
    function setupShareFunctionality() {
        // Adicionar botão de compartilhamento no lightbox se não existir
        let shareButton = document.querySelector('.lightbox-share');
        if (!shareButton) {
            shareButton = document.createElement('button');
            shareButton.className = 'lightbox-share lightbox-btn';
            shareButton.innerHTML = '📤';
            shareButton.setAttribute('aria-label', 'Compartilhar imagem');
            
            const lightboxControls = document.querySelector('.lightbox-controls');
            if (lightboxControls) {
                lightboxControls.appendChild(shareButton);
            }
        }

        shareButton.addEventListener('click', function() {
            shareCurrentImage();
        });
    }

    function shareCurrentImage() {
        const currentItem = filteredItems[currentImageIndex];
        const img = currentItem.querySelector('img');
        const title = currentItem.querySelector('h3');
        
    if (navigator.share) {
        navigator.share({
                title: title ? title.textContent : 'Imagem da Proclamação da República',
            text: 'Confira esta imagem histórica da Proclamação da República do Brasil',
            url: window.location.href
        });
    } else {
            // Fallback: copiar link para clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                if (window.ProclamacaoUtils) {
                    window.ProclamacaoUtils.showNotification('Link copiado para a área de transferência!', 'success');
                }
            });
        }
    }

    setupShareFunctionality();

    // ===== FUNCIONALIDADE DE ZOOM =====
    function setupZoomFunctionality() {
        let zoomInButton = document.querySelector('.lightbox-zoom-in');
        let zoomOutButton = document.querySelector('.lightbox-zoom-out');
        
        if (!zoomInButton) {
            zoomInButton = document.createElement('button');
            zoomInButton.className = 'lightbox-zoom-in lightbox-btn';
            zoomInButton.innerHTML = '🔍+';
            zoomInButton.setAttribute('aria-label', 'Aumentar zoom');
            
            const lightboxControls = document.querySelector('.lightbox-controls');
            if (lightboxControls) {
                lightboxControls.appendChild(zoomInButton);
            }
        }
        
        if (!zoomOutButton) {
            zoomOutButton = document.createElement('button');
            zoomOutButton.className = 'lightbox-zoom-out lightbox-btn';
            zoomOutButton.innerHTML = '🔍-';
            zoomOutButton.setAttribute('aria-label', 'Diminuir zoom');
            
            const lightboxControls = document.querySelector('.lightbox-controls');
            if (lightboxControls) {
                lightboxControls.appendChild(zoomOutButton);
            }
        }

        let currentZoom = 1;
        const maxZoom = 3;
        const minZoom = 0.5;

        zoomInButton.addEventListener('click', function() {
            if (currentZoom < maxZoom) {
                currentZoom += 0.25;
                lightboxImage.style.transform = `scale(${currentZoom})`;
                updateZoomButtons();
            }
        });

        zoomOutButton.addEventListener('click', function() {
            if (currentZoom > minZoom) {
                currentZoom -= 0.25;
                lightboxImage.style.transform = `scale(${currentZoom})`;
                updateZoomButtons();
            }
        });

        function updateZoomButtons() {
            zoomInButton.disabled = currentZoom >= maxZoom;
            zoomOutButton.disabled = currentZoom <= minZoom;
        }

        // Reset zoom ao abrir nova imagem
        const originalOpenLightbox = openLightbox;
        openLightbox = function(index) {
            currentZoom = 1;
            lightboxImage.style.transform = 'scale(1)';
            updateZoomButtons();
            originalOpenLightbox(index);
        };
    }

    setupZoomFunctionality();

    // ===== INICIALIZAÇÃO =====
    setupGalleryFilters();
    
    // Garantir que todas as imagens sejam visíveis inicialmente
    filterGallery('all');
    
    // ===== RESPONSIVIDADE =====
    function handleResize() {
        // Ajustar layout em telas pequenas
        if (window.innerWidth < 768) {
            // Em mobile, ajustar controles do lightbox
            const lightboxControls = document.querySelector('.lightbox-controls');
            if (lightboxControls) {
                lightboxControls.style.flexDirection = 'column';
            }
        } else {
            const lightboxControls = document.querySelector('.lightbox-controls');
            if (lightboxControls) {
                lightboxControls.style.flexDirection = 'row';
            }
        }
    }

    window.addEventListener('resize', debounce(handleResize, 250));
    handleResize(); // Executar na inicialização

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