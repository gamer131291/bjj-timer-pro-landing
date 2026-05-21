/**
 * JLDynamics - Motor Interactivo Principal
 * Versión Corporativa con integración de productos
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================
    // 1. INICIALIZACIÓN DE SKIN (Tema por defecto)
    // ============================================
    document.documentElement.setAttribute('data-theme', 'default');
    
    // ============================================
    // 2. CURSOR MAGNÉTICO (solo desktop)
    // ============================================
    if (window.innerWidth > 768) {
        const cursor = document.getElementById('custom-cursor');
        const blurCursor = document.getElementById('custom-cursor-blur');
        
        if (cursor && blurCursor) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                blurCursor.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
            });
            
            // Micro-interacciones hover
            const interactiveElements = document.querySelectorAll('.product-btn, .theme-btn, .pillar-card, .modal-close');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.style.width = '24px';
                    cursor.style.height = '24px';
                    cursor.style.backgroundColor = 'transparent';
                    cursor.style.border = '2px solid var(--primary)';
                });
                el.addEventListener('mouseleave', () => {
                    cursor.style.width = '8px';
                    cursor.style.height = '8px';
                    cursor.style.backgroundColor = 'var(--primary)';
                    cursor.style.border = 'none';
                });
            });
        }
    }
    
    // ============================================
    // 3. CONMUTADOR DE SKINS (Theme Switcher)
    // ============================================
    const swatches = document.querySelectorAll('.theme-btn');
    swatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            const selectedTheme = e.currentTarget.getAttribute('data-swatch');
            document.documentElement.setAttribute('data-theme', selectedTheme);
            
            // Guardar preferencia en localStorage
            localStorage.setItem('jldynamics-theme', selectedTheme);
        });
    });
    
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('jldynamics-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // ============================================
    // 4. TILT 3D EN TARJETAS (Efecto de inclinación)
    // ============================================
    const cards = document.querySelectorAll('.pillar-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const angleX = (yc - y) / 15;
            const angleY = (x - xc) / 15;
            card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
    
    // ============================================
    // 5. MODAL DE PRODUCTOS (Integración BJJ Timer Pro)
    // ============================================
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.querySelector('.modal-close');
    
    // Función para cargar contenido del producto
    function loadProductContent(productId) {
        modalBody.innerHTML = '<div class="modal-loading">Cargando interfaz...</div>';
        
        switch(productId) {
            case 'bjj':
                modalTitle.textContent = 'BJJ Timer Pro';
                // Renderizar el timer interactivo
                setTimeout(() => {
                    renderBJTTimer();
                }, 100);
                break;
            case 'fintech':
                modalTitle.textContent = 'Paga tus Deudas';
                renderFintechDemo();
                break;
            case 'edtech':
                modalTitle.textContent = 'Tutor al Mando';
                renderEdTechDemo();
                break;
            default:
                modalBody.innerHTML = '<p>Producto no disponible</p>';
        }
    }
    
    // Renderizador de BJJ Timer Pro (versión funcional)
    function renderBJTTimer() {
        modalBody.innerHTML = `
            <div class="bjj-timer-container">
                <div class="bjj-timer-display" id="timerDisplay">00:00</div>
                <div class="bjj-timer-controls">
                    <button class="bjj-btn" id="startTimer">▶ Iniciar</button>
                    <button class="bjj-btn" id="pauseTimer">⏸ Pausa</button>
                    <button class="bjj-btn" id="resetTimer">⟳ Reiniciar</button>
                </div>
                <div class="bjj-mode-selector">
                    <button class="bjj-mode active" data-mode="fight">Combate (5min)</button>
                    <button class="bjj-mode" data-mode="training">Entrenamiento (3min)</button>
                    <button class="bjj-mode" data-mode="custom">Personalizado</button>
                </div>
                <div class="bjj-custom-time" style="margin-top: 1rem; display: none;">
                    <input type="number" id="customMinutes" placeholder="Minutos" min="1" max="60" style="background:rgba(255,255,255,0.1); border:1px solid var(--border-glass); padding:8px; border-radius:8px; color:white;">
                    <button id="setCustomBtn" class="bjj-btn">Aplicar</button>
                </div>
            </div>
        `;
        
        // Lógica del timer
        let timeLeft = 300; // 5 minutos en segundos
        let timerInterval = null;
        let isRunning = false;
        let currentMode = 'fight';
        
        const timerDisplay = document.getElementById('timerDisplay');
        const startBtn = document.getElementById('startTimer');
        const pauseBtn = document.getElementById('pauseTimer');
        const resetBtn = document.getElementById('resetTimer');
        const modeBtns = document.querySelectorAll('.bjj-mode');
        const customDiv = document.querySelector('.bjj-custom-time');
        const customMinutes = document.getElementById('customMinutes');
        const setCustomBtn = document.getElementById('setCustomBtn');
        
        function updateDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        function startTimer() {
            if (timerInterval) clearInterval(timerInterval);
            isRunning = true;
            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                } else {
                    clearInterval(timerInterval);
                    isRunning = false;
                    timerDisplay.textContent = "¡TIEMPO!";
                }
            }, 1000);
        }
        
        function pauseTimer() {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
                isRunning = false;
            }
        }
        
        function resetTimer() {
            pauseTimer();
            switch(currentMode) {
                case 'fight': timeLeft = 300; break;
                case 'training': timeLeft = 180; break;
                case 'custom': 
                    const customVal = parseInt(customMinutes?.value) || 5;
                    timeLeft = customVal * 60;
                    break;
                default: timeLeft = 300;
            }
            updateDisplay();
        }
        
        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);
        
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentMode = btn.getAttribute('data-mode');
                
                if (currentMode === 'custom') {
                    customDiv.style.display = 'block';
                } else {
                    customDiv.style.display = 'none';
                }
                
                resetTimer();
            });
        });
        
        if (setCustomBtn) {
            setCustomBtn.addEventListener('click', () => {
                resetTimer();
            });
        }
        
        updateDisplay();
    }
    
    function renderFintechDemo() {
        modalBody.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">Método Bola de Nieve</h3>
                <p>Simulador financiero para liquidación inteligente de deudas.</p>
                <div style="background: var(--surface-glass); border-radius: 16px; padding: 1.5rem; margin-top: 1rem;">
                    <p style="margin-bottom: 1rem;">💡 Demo interactiva próximamente en versión completa.</p>
                    <p style="font-size: 0.9rem;">📊 Análisis de flujo de caja | ⚡ Optimización de pagos | 🔒 Datos encriptados</p>
                </div>
            </div>
        `;
    }
    
    function renderEdTechDemo() {
        modalBody.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: var(--primary); margin-bottom: 1rem;">Tutor al Mando</h3>
                <p>Control parental y protección activa para entornos digitales.</p>
                <div style="background: var(--surface-glass); border-radius: 16px; padding: 1.5rem; margin-top: 1rem;">
                    <p>🛡️ Filtrado de contenido</p>
                    <p>⏱️ Gestión de tiempo de pantalla</p>
                    <p>📱 Monitoreo remoto</p>
                    <p style="margin-top: 1rem; font-size: 0.85rem;">Software disponible para Windows, Android e iOS</p>
                </div>
            </div>
        `;
    }
    
    // Abrir modal al hacer clic en botones de productos
    const productBtns = document.querySelectorAll('.product-btn');
    productBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = btn.closest('.product-card');
            let productId = 'bjj'; // default
            
            if (productCard) {
                const productAttr = productCard.getAttribute('data-product');
                if (productAttr) productId = productAttr;
            }
            
            loadProductContent(productId);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Cerrar modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            // Detener cualquier timer si existe
            if (window.bjjTimerInterval) {
                clearInterval(window.bjjTimerInterval);
            }
        });
    }
    
    // Cerrar modal al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // ============================================
    // 6. INTERSECTION OBSERVER (Animaciones al scroll)
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Aplicar animación inicial a secciones
    const sections = document.querySelectorAll('.pillars-section, .ecosystem-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Forzar visibilidad en móvil
    if (window.innerWidth <= 768) {
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
    }
    
    console.log('JLDynamics - Plataforma Corporativa Cargada ✅');
});
