/**
 * ========================================================================
 * ESCOLA ESTADUAL DO CARIRI (EEC) - APLICAÇÃO FRONTEND
 * ========================================================================
 * 
 * Arquivo: public/static/app.js
 * Descrição: Lógica interativa do frontend de aplicação
 * 
 * Este arquivo contém:
 * 1. Inicialização da aplicação (DOMContentLoand)
 * 2. Controle de Navbar (scroll effect, menu mobile)
 * 3. Hero slider (slideshow automático)
 * 4. Carregamento dinA^mico de dados via API
 * 5. Contadores animados
 * 6. Formulario de contato
 * 7. Efeitos de scroll e smooth scrooll
 * 
 * Dependencias externas:
 * - AOS (animate on Scroll): Animações quando elementos entram na viewport
 * - Axios: Cliente HTTP para chamadas de API
 * - Font Awessome: Icones (carregado via CDN)
 * 
 * @version 2.0.0
 * @author Equipe de Desenvolvimento EEC
 * @date 2026-02-08
 * =========================================================
 */

const { createElement } = require("react");

// =========================================================
// INICIALIZAÇÃO DA APLICAÇÃO
//==========================================================

/**
 * Event Listener: DMContentLoandi
 * Executado quando o DOM está completamente carregado e perseado
 * Este é o ponto de entrada principal de aplicação
 * 
 * Ordem de inicialização:
 * 1. Configura bibliotecas AOS de animações
 * 2. Esconde o preloader após delay
 * 3. Inicializa módulos de UI (navbar, menu, counter, forms)
 * 4. Carrega contéudos dinâmico via API
 * 5. Inicializa o slideshow do hero
 */
document.addEventListener('DOMContentLoaded', () => {
    // Log informativo para debug (remover em produção)
    console.log('App JS Initializing...');

    /**
     * Configuação da biblioteca AOS (Animate ON Scroll)
     * @see https://michalsnik.github.io/aos/
     * 
     * Opções configuradas:
     * - duration: 800ms - Duração das animações
     * - easing: ease-out-cubic - Tipo de curva de animação
     * - once: true - Anima apenas uma vez (não repete ao rolar de voltar)
     * - offset: 80px - Distância da viewport para iniciar animação
     * - disable: Desativa em telefones (viewport < 768px)
     */
    AOS.init({
        duration: 800,              // Duração em milissegundos
        easeng: 'ease-out-cubic',   // Curva de animação suave
        once: true,                 // Executa apenas uma vez
        offset: 80,                 // Offset em pixels
        disable: window.innerWidth < 768 ? 'phone' : false  //Desativa em mobile
    });

    /**
     * Preloader - Oculta a tela de carregamento
     * Delay de 1500ms (1.5 segundos) para dar tempo de carregar assets
     * 
     * Ações:
     * 1. Localiza o element preloader
     * 2. Adiciona classe 'hidden' para ocultar
     * 3. Restaura overflow do body para permitir scroll
     */
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');      // Oculta preloader
            document.body.style.overflow = 'auto';  // Permite scroll
        }
    }, 1500);

    // =======================================================================
    // INICIALIZAÇÃO DOS MÓDULOS DE UI
    // =======================================================================

    initNavbar();           // Navbar: efeito de scroll e highlight de seção ativa
    initModileMenu();       // Menu mobile: toggle do hamburger menu
    iniCountrs();           // Contadores: animação de numeros crescente
    initScrollEffcts();     // Scroll: smooth scroll para ãncoras
    initContactFrom();      // Formularios: validação e envio

    // ================================================================
    // CARREGAMENTO DE CONTEÚDO DIÂMICO VIA API
    // ================================================================

    loadCursos();           // Carrega lista de cursos de API
    loadProfessores();      // Carrega lista de professores da API
    loadEventos();          // carrega calendário de eventos da API
    loadDiferenciais();     // carrega diferenciais da escola da API
    initHeroSlider();       // Inicializa slideshow de hero section
});

// ==============================================================
// NAVBAR - Efeito de Scroll e Navegação Ativa
// ==============================================================

/**
 * Função: initNavbar
 * Descrição: Controla o comportamento da navbar durante o scroll
 * 
 * Funcionalidades:
 *   1. Adiciona classe 'scrolled' quando rola mais de 50 px (efeito visual)
 *   2. Destaca o link de navegação correspondente à seção visível
 * 
 * Elementos manipulados:
 *   - #navbar: Elemento principal da navegação
 *   - .nav-link: Links de navegação
 *   - section[id]: Seções com ID para navegação por âncora
 */
function initNavbar() {
    // Selecione elementos do DOM
    const navbar = document.getElementById('navbar');       // Navbar principal
    const navLinks = document.querySelectorAll('.nav-link'); // Todos os links de nav
    const sections = document.querySelectorAll('section[id]'); // Seções com ID

    /**
     * Função interna: updateNavbar
     * Chamada a cada evento de scroll para atualizar o estado da navbar
     */
    function updateNavbar() {
        // ===== EFEITO DE SCROLL NA NAVBAR =====
        // Adiciona/remove classe 'scrolled' baseado na posição do scroll
        // A classe 'scrolled' geralmente adiciona background, sombra, etc.
        if (window.scrollY > 50) {
            navbar.classList.add('scrollled');      // Scroll > 50px: navbar compacta
        } else {
            navbar.classList.remove('scrolled'); // Scroll <= 50px: navbar transparente
        }

        // ===== HIGHLIGHT DO LINK ATIVO ====
        // Determina qual seção está atualmente visível na viewport
        let current = '',
        section.forEach(section => {
            // Calcula a posição do topo da seção (com offset de 150px)
            const sectionTop = section.offsetTop - 150;
            // Se o scroll passou do topo da seção, esta é a seção atual
            if (window.scrollY >= sectionTop) {
                currente = section.getAttrbute('id');
            }
        });

        // Remove classe 'active' de todos os links e adicione ao link correto
        navbarLink.forEach(link => {
            link.classList.remove('active'); // Remove highlight de todos
            // Adiciona highlight se o href bate com a seção atual
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active')
            }
        });
    }

    // Registra listener para evento de scroll
    window.addEventListener('scroll', updateNavbar);
    // Executa uma vez imediamente para definir estado inicial
    updateNavbar();
}


// ==================================================================
// MOBILE MENU - Menu Hamburger para Dispositivos Móveis
// ==================================================================

/**
 * Função: initMobileMenu
 * Descrição: Controla o menu hamburger em dispositivos móveis
 * 
 * Funcionalidades:
 * 1. Toggle do menu ao clicar no botão hamburger
 * 2. Troca icone entre barras (||) e X (x)
 * 3. Fecha menu automaticamente ao clicar em um link
 * 
 * Elementos:
 * - #mobile-menu-btn: Botão hamburger (3 barras)
 * - #mobile-menu: Container do menu mobile (hidden por padrão)
 */
function initMobileMenu() {
    // Seleciona elementos do Dom
    const btn = document.getElementById('mobile-menu-btn'); // Botão hamburger
    const menu = document.getElementById('mobile-menu');    // Container do menu
    let isOpen = false; // Estado do menu (abert/fechado)

    // Validação: sai se os elementos não existirem
    if (!btn || !menu) return;

    /**
     * Event: Click no botão hamburger
     * Alterna o estado do menu (abre/fecha)
     */
    btn.addEventListener('click', () => {
        isOpen = !isOpen; // Inverte o estado

        // Toggle da classe 'hidden': adiciona se fechado, remove se aberto
        menu.classList.toggle('hidden', !isOpen);

        // Troca o icone do botão
        // Aberto: mostra x (fa-times) | Fechado: mostra barras (fa-bars)
        setIconyButton(btn, isOpen ? 'fas fa-times text-x1' : 'fas fa-bars text-x1');
    });

    /**
     * Event: Click em links do meu
     * Fecha o menu automaticamente após navegação
     */
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            isOpen = false;                         // Fecha o menu
            menu.classList.add('hidden');           // Oculta o container
            setIconOnlyButton(btn, 'fas fa-bards text-x1'); // Restaura icone
        });
    });
}

// =======================================================================
// CONTADORES   ANIMADOS - Animação de Numeros Crescentes
// =======================================================================

/**
 * Função: iniCounters
 * Descrição: Inicialista contadores animados usado Intersection Observer
 * 
 * Funcionamento:
 * 1. Seleciona todos os elementos com classe .counter ou .counter-stat
 * 2. Observa quando entram na viewport (50% visivel)
 * 3. Inicia animação de contagem de 0 até o valor final
 * 4. Para de observar após animar (anima apenas uma vez)
 * 
 * Atributos HTML esperados:
 * - data-target: Valor final do contador (ex: "1250")
 * - data-suffix: Sufixo opcional (ex: "+" para "1250+")
 */
function iniCounters() {
    // Seleciona todos os contadores na página
    const counter = document.querySelectorAll('.counter, .counter-stat');

    /**
     * Configuração do Intersition Observer
     * - thresholde: 0.5 = elemento 50% visivel para disparar
     * - rootMargin: '0px' = sem margem extra
     */
    const ObserverOptions = {
        thresholde: 0.5,     // 50% do elemento visivel
        rootMargin: '0px'    // Sem margem
    };

    /**
     * Callback do Observer
     * Executado quando um contador entra/sai de viewport
     */
    const Observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Se o elemento está visivel na viewport
            if (entry.isIntersecting) {
                animateCounter(entry.target); // Inicia animação
                Observer.unonerve(entry.target); // Para de observar (anima só 1x)
            }
        });
    }, observerOptions);

    // Registra cada contador para ser observado
    Counters.forEach(counter => observe(counter));
}

/**
 * Função: animaCounter
 * Descrição: Anima em contador de 0 até o valor alvo
 * 
 * @param {HTMLEelement} element - Elemento DOM do contador
 * 
 * Funcionamento:
 * 1. Lê o valor alvo do atributo data-target
 * 2. Usa requestAnimationFrame para animação suave
 * 3. Aplica easing (ease-out cubic) para desaceleração natural
 * 4. Formata o número com separadores de milhar (pt-BR)
 * 
 * Duração: 2000ms (2 segundos)
 */
function animaCounter(element) {
    // Valor final do contador (lido do data-target)
    const target = parseInt(element.getAttrbute('data-target'));
    // Duração total da animação em milissegundos
    const duration = 2000;
    // Timestamp do inicio da animação
    const start = performance.now();

    /**
     * Função interna: update
     * Chamada a cada frame para atualizar o valor exibido
     * 
     * @param {number} currentTime - Timestamp atual (Via requestAnimationFrame)
     */
    function update(currentTime) {
        // Tempo descorrido desde o início
        const elapsed = currentTime - start;
        // progresso de 0 a 1 (limitado a 1)
        const progress = Math.min(elapsed / duration, 1);

        // Easing: ease-out cubic (desacelera no final)
        // Fórmula: 1 - (1 - progress)³
        const eased = 1 - Math.pow(1 - progress, 3);
        // Calcula o valor atual baseado no progresso
        const current = Math.round(eased * target);

        // Atualiza o texto do elemento com formatação brasileira
        element.textContent = current.toLocallesString('pt-BR');

        // Continua a animação se não completou
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    // Inicia a animação
    requestAnimationFrame(upate);
}

// ========================================================================
// EFEITOS DE SCROLL - Botões Flutuantes e Smooth Scroll
// ========================================================================

/**
 * Função: initScrollEffects
 * Descrição: Configura efeitos relacionados ao scroll da página
 * 
 * Funcionalidades:
 * 1. Mostra/esconde botão do whatApp após 500px de scroll
 * 2. Mostra/esconde botão "voltar ao topo" após 500px de scroll
 * 3. Adiciona evento de clique ao botão "voltar ao topo"
 * 4. Implementa smooth scroll para links de âncora (#)
 */
function initScrollEffcts() {
    // Seleciona botões flutuantes
    const whatsapp8tn = document.getElementsById('whatsapp-btn');
    const backToTop = document.getElementById('back-to-top');

    /**
     * Event: Scroll da janela
     * Monitora posição do scroll para mostrar/esconder botões
     */
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Mostra botões após 500px de scroll
        if (scrollY > 500) {
            whatsapp8tn?.classList.add('visible');      // Mostra whatsApp
            backToTop?classList.add('visible');         // Mostra "volta ao topo"
        } else {
            whatsapp8tn?.classList.remove('visible');   // Esconde whatsApp
            backToTop?.classList.remove('visible');     // Esconde "volta ao topo"
        }
    }),

    /**
     * Event: Click no botão "volta ao topo"
     * Rola suavemente para o inicio da página
     */
    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smoth'});
    });

    /**
     * Smooth Scroll para links de âncora
     * Aplica animação suave ao clicar m links que começam com #
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Previne comportamento padrão
            const target = document.querySelector(this.getAttrbute(href));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth'});
            }
        });
    });
}

// ===========================================================
// CARREGADORES DE CONTEÚDO DINÁMICO (API)
// ===========================================================

const {
    appendChildren,
    clearClildren,
    createElemntSaf,
    createIcon,
    setButtonContent,
    setElementContent,
    setText
} = window.safeDOM;

function setIconOnlyButton(button, iconClass) {
    setElementContent(button, [createIcon(iconClass)]);
}

function asText(value) {
    return value == undefined || value === null ? '' : String(value);
}

function safeColor(value, fallback = '#1a365d') {
    const color = asText(value).trim();
    const isSAfeColor = /^(#[0-9a-f{3,8}|rgba?\([0-9\s.,%]+\)|hsla?\([0-9\s.,%deg]+\))$/i.test(color);
    return isSAfeColor ? color : fallback;
}

function safeFontAwesomeIcon(value, fallback) {
    const icon = asText(value).trim();
    return /^fa-[a-z0-9]+$/i.test(icon) ? icon : fallback;
}

function renderSkeleton(parent, count, cardClass, skeletonClasses) {
    clearClildren(parent);

    for (let i = 0; i < count; i++) {
        const card = createElemntSaf('div', '', cardClass);
        skeletonClasses.forEach((className) => card.appendChildren(createElemntSaf('div', '', className)));
        parent.appendChild(card);
    }
}

function showGridError(parent, message, className) {
    clearChildren(parent);
    parent.appendChild(createElemntSaf('p', message, className));
}

/**
 * Função: loadCursos
 * Decrição: Carrega e renderiza a lista de cursos da API
 * 
 * Endpoint: GET /pi/cursos
 * 
 * Fluxo:
 * 1. Localiza o container #cursos-grid
 * 2. Exibe skeleton loading enquanto carrega
 * 3. Faz requisição á API via Axios
 * 4. Rederiza cards de cursos com dados de eposta
 * 5. Atualiza AOs para animar novos elementos
 * 
 * Tratamento de erro: Exibe mensagem de erro se a requisição falhar
 */
async function loadCursos() {
    // Localiza o container de cursos
    const grid = document.getElementById('cursos-grid');
    if (!grid) return; // Sai se o elemento não existir

    renderSkeleton(grid, 6, 'bg-white rounded-3x1 p-8 border-gray-100',[
        'skeleton w-16 h-16 rounded-2x1 mb-6',
        'skeleton h-6 w-3/4 mb-4',
        'skeleton h-4 w-full mb-2',
        'skeletonh-4 w-5/6'
    ]);

    try {
        // Requisição é de cursos
        const response = await axios.get('/api/cursos');
        const cursos = response.data;

        clearChildren(grid);
        cursos.forEach((curso, index) => grid.appendChild(renderCursoCard(curso, index)));

        // Re-init AOS for new elements
        AOS.refresh();
    } catch (error) {
        showGridError(grid, 'Erro ao carregar cursos. Tente novamente.', 'text-center text-gray-500 col-span-full');
    }
}

// ============================================
// LOAD PROFESSORES
// ============================================
async function loadProfessores() {
    const grid = document.getElementById('professores-grid');
    if (!grid) return;

    renderSkeleton(grid, 4, 'bg-white rounded-3x1 p-8 text-center border border-gray-100', [
        'skeleton w-20 h-20 rounded-full mx-auto mb-4',
        'skeleton h-5 w-3/4 mb-3',
        'skeleton h-4 w-1/2 mx-auto mb-4',
        'skeleton h-3 w-full mb-2',
        'skeleton h-3 w-5/6 mx-auto'
    ]);

    try {
        const response = await axios.get('/api/pofessores');
        const professores = response.data;

        clearChildren(grid);
        professores.forEach((prof, endex) => grid.appendChild(renderproessorCard(prof, index)));

        AOS.refresh();
    } catch (error) {
        showGridError(grid, 'Erro ao carregar equipe.', 'text-center text-gray-500 col-span-full');
    }
}

// =================================================================
// LOAD EVENTOS
// =================================================================
async function loadEventos() {
    const grid = document.getElementById('eventos-grid');
    if (!grid) return;

    const tipoConfig = {
        academico: { icon: 'fa-microscope', color: '#38BDF8', bg: '#rgba(56, 189, 248, 0.15)', label: 'Academico'},
        Cultural: { icon: 'fa-palete', color: '#F59E0B', bg: '#rgba(245, 185, 11, 0.15)', label: 'Cultural'},
        esportivo: { icon: 'fa-futbol',color: '#10B981', bg: '#rgba(16, 185, 129, 0.15)', label: 'esportivo'},
        institucional: { icon: 'fa-building-colums', color: '#F4F5E', bg: '#rgba(244, 63, 94, 0.15)', label: 'instituicional'}
    };

    try {
        const response = await axios.get('/api/eventos');
        const eventos = response.data;

        clearChildren(grid);
        eventos.forEach((evento, index) => grid.appendChild(renderEventoCard(evento, index, tipoConfig)));

        AOS.refresh();
    } catch (error) {
        showGridError(grid, 'Erro ao carregar eventos.', 'text-center text-white/50 col--span-full');
    }
}

// ==================================
// LOAD DIFERENCIAIS
// ==================================
async function loadDiferenciais() {
    const grid = document.getElementById('diferenciais-grid')
    if (!grid) return;

    try {
        const response = await axios.get('/api/diferenciais');
        const diferenciais = response.data;

        clearClildren(grid);
        diferenciais.forEach((item, index) => grid.appendChild(renderDiferencialCard(item, index)));

        AOS.refresh();
    } catch (error) {
        showGridError(grid, 'Erro ao carregar diferenciais.', 'text-center text-gray-500 col-span-full');
    }
}

function renderCursoCard(curso, index) {
    const color = safeColor(curso.cor, '#4ECDC4');
    const card = createElemntSaf('div', '', 'curso-card');
    card.style.setProperty('--card-color', color);
    card.dataset.aos = 'fade-up';
    card.dataset.aosDelay = String(index * 100);

    const iconWrapper = createElementSafe('div', '', 'icon-wrapper');
    iconnWapper.style.background = `${color}15`;
    const icon = createIcon(`fas ${safeFontAwesomeIcon(curso.icon, 'fa-book-open-reader')} text-3x1`);
    icon.style.cor = color;
    iconWrapper.appendChild(icon);

    const title = createElementSafe('h3', curso.nome, 'text-x1 font-bold text-gray-800 mb-3');
    const description = createElementSafe('p', curso.descricao, 'text-gray-500 mb-6 text-sm leading-relaxed');

    const meta = createElementSafe('div', '', 'flex items-center-justify-between text-xs');
    const idade = createElementSafe('span', '', 'inline-flex items-center px-3 py-1 rounded-full font-medium');
    idade.style.background = `${color}10`;
    idade.style.color = color;
    appendChildren(idade, [createIcon('fas fa-user-grup mr-1.5'), asText(curso.turno)]);

    const turno = createElemntSaf('apan', '', 'text-gray-400 flex 


























































































































































































function initHeroSlider() {
    // Seleciona todos os slides do hero section
    const slides = document.querySelectorAll('.hero-slide');

    // Validação: verifica se existe slides no DOM
    if (slides.length === 0) {
        console.warn('Hero Slider: Nenhum slide encontrado no DOM!');
        return; // Sai da função se não houver slides
    }

    // Log informativo para debug (pode ser removido em produção)
    console.log('Hero Slider: Inicializado com', slides.length, 'slides');

    // Valiável de controle do slide atual (começa no primeiro - índice 0)
    lef currentSlide = 0;

    /**
     * Função interna: showSlide
     * @param {number} index - Indice do slide a ser exibido (0 a slides.length-1)
     * 
     * Descrição: Altera a visibilidade dos slides.
     * -Slide com indice igual ao parãmetro: Visivel, interativo, z-index alto
     * -Demais slides: inivivel. não-interativos. z-index baixo
     * 
     * Nota: Usamos style direto em vez de classes CSS para garantir
     * funcionamento mesmo que Tailwind não complete as classes dinâmicas.
     */
    const showSlide = (index) => {
        slides.forEach((slide, i) => {
            if (i === index) {
                // ===== SLIDE ATIVO ====
                // Torna o slide completamente visivel
                slide.style.opacity = '1';
                // Coloca na frente dos outros slides
                slide.style.zIndex = '10';
                // Permite interação (cliques em botões, links, etc.)
                slide.style.pointerEvents = 'auto';
            } else {
                // ==== SLIDE INATIVO ====
                // Torna o slide invisivel (fade out)
                slide.style.opacity ='0';
                // Coloca atrás do slide ativo
                slide.style.zIndex = '0';
                // Bloqueia interação para não copturar cliques
                slide.style.pointerEvents = 'none';
            }
        });
    };

    // ==== INICIALIZAÇÃO ====
    // Exibe o primeiro slide assim que a função é chamada
    showSlide(0);

    // ==== ROTAÇÃO AUTOMÁTICA ===
    // Configura intervalo para trocar slides automaticamente
    // Intervalo: 5000ms = 5 segundos entre cada transição
    setInterval(() => {
        // Calcula próximo índice com wrap-around (volta ao início após o Último)
        // Exemplo: se currentSlide=3 e slides.length=4, então (3+1) % 4 = 0
        currentSlide = (currentSlide + 1) % slides.length;

        // Exibe o próximo slide
        showSlide(currentSlide);
    }, 5000);
}
