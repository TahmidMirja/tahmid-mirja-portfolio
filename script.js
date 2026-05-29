document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================================================
    // TYPEWRITER EFFECT (Cycling Subtitles)
    // ==========================================================================
    const typewriterElement = document.getElementById('typewriter-text');
    const subtitles = [
        "AI Agent Developer",
        "AI Automation Specialist",
        "AI Chatbot Developer & Specialist",
        "I Build Systems That Work While You Sleep"
    ];
    
    let subtitleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function handleTypewriter() {
        if (!typewriterElement) return;
        
        const currentText = subtitles[subtitleIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster when erasing
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }
        
        // Wait transitions
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            subtitleIndex = (subtitleIndex + 1) % subtitles.length;
            typingSpeed = 500; // Short pause before typing next word
        }
        
        setTimeout(handleTypewriter, typingSpeed);
    }
    
    // Start Typewriter
    setTimeout(handleTypewriter, 1000);

    // ==========================================================================
    // CUSTOM DUAL CURSOR
    // ==========================================================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice && cursorDot && cursorOutline) {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });
        
        const animateOutline = () => {
            const ease = 0.15;
            outlineX += (mouseX - outlineX) * ease;
            outlineY += (mouseY - outlineY) * ease;
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            requestAnimationFrame(animateOutline);
        };
        requestAnimationFrame(animateOutline);
        
        const updateHoverState = () => {
            const interactables = document.querySelectorAll('a, button, .project-text-card, .service-card, .social-icon-btn, .training-tag, .blueprint-node, .sim-btn');
            interactables.forEach((el) => {
                el.removeEventListener('mouseenter', addHoverClass);
                el.removeEventListener('mouseleave', removeHoverClass);
                el.addEventListener('mouseenter', addHoverClass);
                el.addEventListener('mouseleave', removeHoverClass);
            });
        };
        
        function addHoverClass() {
            document.body.classList.add('cursor-hovering');
        }
        function removeHoverClass() {
            document.body.classList.remove('cursor-hovering');
        }
        
        updateHoverState();
        
        const observer = new MutationObserver(updateHoverState);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ==========================================================================
    // MAGNETIC HOVERS
    // ==========================================================================
    if (!isTouchDevice) {
        const setMagneticButtons = () => {
            document.querySelectorAll('.hover-magnetic').forEach((btn) => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
                });
                
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translate(0px, 0px)';
                });
            });
        };
        setMagneticButtons();
    }

    // ==========================================================================
    // NAVIGATION / MOBILE MENU
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('.menu-icon') : null;
    const closeIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('.close-icon') : null;
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll shrink
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            if (navbar) navbar.classList.add('scrolled');
        } else {
            if (navbar) navbar.classList.remove('scrolled');
        }
        highlightActiveLink();
    });
    
    // Toggle Mobile menu
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            if (isOpen) {
                if (menuIcon) menuIcon.classList.add('hidden');
                if (closeIcon) closeIcon.classList.remove('hidden');
            } else {
                if (menuIcon) menuIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');
            }
        });
    }
    
    // Close Mobile menu
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (menuIcon) menuIcon.classList.remove('hidden');
            if (closeIcon) closeIcon.classList.add('hidden');
        });
    });
    
    // Active Link Scroll Tracker
    const sections = document.querySelectorAll('section');
    function highlightActiveLink() {
        let scrollY = window.pageYOffset;
        
        sections.forEach((section) => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.remove('active');
            }
        });
    }

    // ==========================================================================
    // SERVICES TAB FILTER
    // ==========================================================================
    const serviceFilterBtns = document.querySelectorAll('.service-filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceFilterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            serviceFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.serviceCat;
            
            serviceCards.forEach((card) => {
                const cardCategory = card.dataset.serviceCategory;
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.transform = 'scale(1)';
                        card.style.opacity = '1';
                    }, 50);
                } else {
                    card.style.transform = 'scale(0.95)';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==========================================================================
    // n8n WORKFLOW VISUAL SIMULATOR & INSPECTOR
    // ==========================================================================
    const nodes = document.querySelectorAll('.blueprint-node');
    const inspectorBody = document.getElementById('inspector-body');
    const consoleBody = document.getElementById('console-body');
    const clearConsoleBtn = document.getElementById('console-clear-btn');
    
    // Simulation Buttons
    const simBtnChat = document.getElementById('sim-btn-chat');
    const simBtnCollab = document.getElementById('sim-btn-collab');
    const simBtnIngest = document.getElementById('sim-btn-ingest');
    const simBtnError = document.getElementById('sim-btn-error');

    let isSimulating = false;

    // Node Specification database from user's actual JSON
    const nodeSpecs = {
        'chat-trigger': {
            name: 'When chat message received',
            type: '@n8n/n8n-nodes-langchain.chatTrigger',
            version: '1.4',
            desc: 'Listens for inbound user chat messages, triggering webhook requests on client communication channels.',
            params: {
                'Webhook ID': 'bd9a9e61-0a77-4a61-92f9-eabe1d8fae63',
                'Response Mode': 'When Last Node Finishes',
                'Input Variable': 'chatInput'
            }
        },
        'form-trigger': {
            name: 'On form submission',
            type: 'n8n-nodes-base.formTrigger',
            version: '2.5',
            desc: 'Triggers when a system administrator submits a PDF attachment, starting the automated database knowledge update.',
            params: {
                'Webhook ID': '479f1dd8-3f2a-450d-9451-173fd329236f',
                'Form Field': 'Attachment (type: file, required: true)',
                'Description': 'Accepts documentation uploads for vector store synchronization.'
            }
        },
        'classifier': {
            name: 'Text Classifier',
            type: '@n8n/n8n-nodes-langchain.textClassifier',
            version: '1.1',
            desc: 'Evaluates inputs using gpt-4.1-mini to classify intent into CUSTOMER_SUPPORT AI or business_team. Runs smart matching rules.',
            params: {
                'Language Model': 'gpt-4.1-mini (OpenAI Chat Model)',
                'Categories': 'CUSTOMER_SUPPORT AI (General inquiries, pricing, support) OR business_team (Partnerships, management contact, deals)',
                'System Rules': '"tumi shono jodi er baire kisu hoi kintu nijer budhi diye tumi bujso je eita ei rleted to oitake oi catgorytei athai diba ok smartly" (Smart Banglish Fallback logic)'
            }
        },
        'extractor': {
            name: 'Extract from File',
            type: 'n8n-nodes-base.extractFromFile',
            version: '1.1',
            desc: 'Extracts formatting and layouts from uploaded attachments, converting PDF content into structured plain text.',
            params: {
                'Operation': 'Read PDF File',
                'Source Property': 'Attachment',
                'Output Property': 'text'
            }
        },
        'rag-agent': {
            name: 'AI Agent (Support)',
            type: '@n8n/n8n-nodes-langchain.agent',
            version: '3.1',
            desc: 'Retrieves facts from the vector store index to answer support queries. Follows strict system parameters.',
            params: {
                'Language Model': 'gpt-4.1-mini',
                'Memory': 'Simple Memory (Buffer Window Length: 50)',
                'System Prompt': '"You are a helpful assistant. Answer user queries using information retrieved from the vector store only. Respond strictly based on retrieved info. Do not add extra explanations, filler, or opinions."'
            }
        },
        'lead-agent': {
            name: 'AI Agent1 (Lead Generator)',
            type: '@n8n/n8n-nodes-langchain.agent',
            version: '3.1',
            desc: 'Reviews business deals and partner requests, generating structured emails addressed to the owner or manager.',
            params: {
                'Language Model': 'gpt-4.1-mini',
                'Output Parser': 'Structured Output Parser (subject, body properties)',
                'System Prompt': '"Identify user intent, compose a professional email to owner/manager. Output only JSON structured Subject + Body, without distortions."'
            }
        },
        'pinecone-db': {
            name: 'Pinecone Vector Store',
            type: '@n8n/n8n-nodes-langchain.vectorStorePinecone',
            version: '1.3',
            desc: 'Links workflow data streams to the bongodigitalkng Pinecone index, retrieving or writing vectorized contextual embeddings.',
            params: {
                'Pinecone Index': 'bongodigitalkng',
                'Embedding System': 'Embeddings OpenAI (embeddingsOpenAi v1.2)',
                'Ingest Data Loader': 'Default Data Loader (for PDF writes)'
            }
        },
        'gmail': {
            name: 'Send a message (Gmail)',
            type: 'n8n-nodes-base.gmail',
            version: '2.2',
            desc: 'Sends outreach emails containing structured business leads generated by the AI agent.',
            params: {
                'Resource': 'Message',
                'Operation': 'Send',
                'Subject': '={{ $json.subject }}',
                'Recipient': 'tahmidmirja25@gmail.com'
            }
        },
        'failsafe': {
            name: 'Global Emergency Watchdog',
            type: 'Custom n8n Error Watcher',
            version: '1.0',
            desc: 'Watchdog node that intercepts errors in the workflow. If an API rate limit or database query crash occurs, it automatically dispatches emergency alerts.',
            params: {
                'Triggers On': 'All Node Failures (Error Flow Redirect)',
                'Alert Platforms': 'WhatsApp Chat (Twilio API), Telegram Channel, Email',
                'Backup Fallback': 'Fallback model logic + 3x auto-retry'
            }
        }
    };

    // Inspector events on hover
    nodes.forEach(node => {
        const nodeKey = node.dataset.node;
        if (!nodeKey || !nodeSpecs[nodeKey]) return;

        node.addEventListener('mouseenter', () => {
            const spec = nodeSpecs[nodeKey];
            let paramsHTML = '';
            
            for (const [key, value] of Object.entries(spec.params)) {
                paramsHTML += `
                    <div class="spec-param-group">
                        <strong>${key}</strong>
                        <span>${value}</span>
                    </div>
                `;
            }

            inspectorBody.innerHTML = `
                <div class="inspector-spec-box">
                    <div class="spec-header">
                        <h3>${spec.name}</h3>
                        <span class="type-code">${spec.type} (v${spec.version})</span>
                    </div>
                    <div class="spec-description">${spec.desc}</div>
                    <div class="spec-params-title">Node Config Parameters</div>
                    ${paramsHTML}
                </div>
            `;
        });

        node.addEventListener('mouseleave', () => {
            inspectorBody.innerHTML = `
                <div class="inspector-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer-click"><path d="m9 9 5 12 1.77-4.51L20 18l-2-4.23L22 12l-12-3Z"/><path d="M3 3v.01"/><path d="M8 3v.01"/><path d="M13 3v.01"/><path d="M18 3v.01"/><path d="M3 8v.01"/><path d="M3 13v.01"/><path d="M3 18v.01"/></svg>
                    <p>Hover over any node in the canvas layout to inspect its credentials, system prompts, and configuration variables.</p>
                </div>
            `;
        });
    });

    // Console Logging Function
    function logToConsole(message, type = 'system') {
        if (!consoleBody) return;
        const time = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.className = `console-line line-${type}`;
        line.innerHTML = `<span>[${time}]</span> ${message}`;
        consoleBody.appendChild(line);
        consoleBody.scrollTop = consoleBody.scrollHeight;
    }

    // Clear logs
    if (clearConsoleBtn) {
        clearConsoleBtn.addEventListener('click', () => {
            if (consoleBody) {
                consoleBody.innerHTML = '<div class="console-line line-system">[SYSTEM] Console logs cleared.</div>';
            }
        });
    }

    // ==========================================================================
    // n8n WORKFLOW DYNAMIC SVG CONNECTION LINES
    // ==========================================================================
    const svgConnections = document.getElementById('n8n-svg-connections');
    const canvasElement = document.getElementById('n8n-canvas');
    
    const connectionsList = [
        { from: 'chat-trigger', to: 'classifier', id: 'wire-chat-classifier' },
        { from: 'form-trigger', to: 'extractor', id: 'wire-form-extractor' },
        { from: 'classifier', to: 'rag-agent', id: 'wire-classifier-rag' },
        { from: 'classifier', to: 'lead-agent', id: 'wire-classifier-lead' },
        { from: 'extractor', to: 'pinecone-db', id: 'wire-extractor-pinecone' },
        { from: 'rag-agent', to: 'pinecone-db', id: 'wire-rag-pinecone' },
        { from: 'lead-agent', to: 'gmail', id: 'wire-lead-gmail' },
        { from: 'pinecone-db', to: 'failsafe', id: 'wire-pinecone-failsafe' }
    ];

    function drawConnections() {
        if (!svgConnections || !canvasElement) return;
        
        svgConnections.innerHTML = '';
        const canvasRect = canvasElement.getBoundingClientRect();
        const isVertical = window.innerWidth <= 850;
        
        connectionsList.forEach(conn => {
            const fromEl = document.getElementById(`node-${conn.from}`);
            const toEl = document.getElementById(`node-${conn.to}`);
            
            if (!fromEl || !toEl) return;
            
            const fromRect = fromEl.getBoundingClientRect();
            const toRect = toEl.getBoundingClientRect();
            
            let x1, y1, x2, y2;
            
            if (!isVertical) {
                // Horizontal (Desktop layout)
                x1 = fromRect.right - canvasRect.left;
                y1 = fromRect.top - canvasRect.top + fromRect.height / 2;
                x2 = toRect.left - canvasRect.left;
                y2 = toRect.top - canvasRect.top + toRect.height / 2;
            } else {
                // Vertical (Mobile stack layout)
                x1 = fromRect.left - canvasRect.left + fromRect.width / 2;
                y1 = fromRect.bottom - canvasRect.top;
                x2 = toRect.left - canvasRect.left + toRect.width / 2;
                y2 = toRect.top - canvasRect.top;
            }
            
            let dPath;
            if (!isVertical) {
                const dx = Math.abs(x2 - x1) * 0.4;
                dPath = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
            } else {
                const dy = Math.abs(y2 - y1) * 0.45;
                dPath = `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`;
            }
            
            // Create SVG base underlay path (background grey line)
            const pathBase = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathBase.setAttribute('d', dPath);
            pathBase.setAttribute('class', 'wire-base');
            
            // Create SVG glow overlay path (for animation routing)
            const pathGlow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathGlow.setAttribute('d', dPath);
            pathGlow.setAttribute('class', 'wire-glow');
            pathGlow.setAttribute('id', conn.id);
            
            svgConnections.appendChild(pathBase);
            svgConnections.appendChild(pathGlow);
        });
    }

    // Initial draw connection wires with slight delay to ensure clientBounding rects are ready
    setTimeout(drawConnections, 250);
    
    // Resize & scroll observers for canvas
    window.addEventListener('resize', drawConnections);
    if (canvasElement) {
        canvasElement.addEventListener('scroll', drawConnections);
    }

    // Node highlight management helpers
    function clearWires() {
        document.querySelectorAll('.wire-glow').forEach(w => {
            w.className = 'wire-glow'; // reset classes
            w.classList.remove('wire-active', 'wire-error-active', 'wire-failsafe-active');
        });
    }

    function setWireActive(id, state = 'active') {
        const wire = document.getElementById(id);
        if (wire) {
            if (state === 'active') {
                wire.classList.add('wire-active');
            } else if (state === 'error') {
                wire.classList.add('wire-error-active');
            } else if (state === 'failsafe') {
                wire.classList.add('wire-failsafe-active');
            }
        }
    }

    function clearNodePulse() {
        nodes.forEach(n => n.classList.remove('node-pulse-active'));
        clearWires();
    }

    function setNodePulse(id, active = true) {
        const node = document.getElementById(id);
        if (node) {
            if (active) node.classList.add('node-pulse-active');
            else node.classList.remove('node-pulse-active');
        }
    }

    // Simulator execution coordination
    function runSimulation(type) {
        if (isSimulating) return;
        isSimulating = true;

        // Toggle active states on sim triggers
        document.querySelectorAll('.sim-btn').forEach(btn => btn.classList.remove('active-run'));
        
        if (type === 'chat') {
            simBtnChat.classList.add('active-run');
            executeChatSimulation();
        } else if (type === 'collab') {
            simBtnCollab.classList.add('active-run');
            executeCollabSimulation();
        } else if (type === 'ingest') {
            simBtnIngest.classList.add('active-run');
            executeIngestSimulation();
        } else if (type === 'error') {
            simBtnError.classList.add('active-run');
            executeErrorSimulation();
        }
    }

    if (simBtnChat) simBtnChat.addEventListener('click', () => runSimulation('chat'));
    if (simBtnCollab) simBtnCollab.addEventListener('click', () => runSimulation('collab'));
    if (simBtnIngest) simBtnIngest.addEventListener('click', () => runSimulation('ingest'));
    if (simBtnError) simBtnError.addEventListener('click', () => runSimulation('error'));

    // Simulation 1: Chat Support Flow
    function executeChatSimulation() {
        setTimeout(() => {
            setNodePulse('node-chat-trigger');
        }, 100);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-classifier');
            setWireActive('wire-chat-classifier');
        }, 1300);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-rag-agent');
            setWireActive('wire-classifier-rag');
        }, 3000);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-pinecone-db');
            setWireActive('wire-rag-pinecone');
        }, 4500);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-rag-agent');
        }, 6000);

        setTimeout(() => {
            clearNodePulse();
            isSimulating = false;
            simBtnChat.classList.remove('active-run');
        }, 7500);
    }

    // Simulation 2: Business Partnership Lead Flow
    function executeCollabSimulation() {
        setTimeout(() => {
            setNodePulse('node-chat-trigger');
        }, 100);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-classifier');
            setWireActive('wire-chat-classifier');
        }, 1300);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-lead-agent');
            setWireActive('wire-classifier-lead');
        }, 3000);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-gmail');
            setWireActive('wire-lead-gmail');
        }, 4800);

        setTimeout(() => {
            clearNodePulse();
            isSimulating = false;
            simBtnCollab.classList.remove('active-run');
        }, 6500);
    }

    // Simulation 3: PDF Ingest Flow
    function executeIngestSimulation() {
        setTimeout(() => {
            setNodePulse('node-form-trigger');
        }, 100);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-extractor');
            setWireActive('wire-form-extractor');
        }, 1300);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-pinecone-db');
            setWireActive('wire-extractor-pinecone');
        }, 3000);

        setTimeout(() => {
            clearNodePulse();
            isSimulating = false;
            simBtnIngest.classList.remove('active-run');
        }, 4800);
    }

    // Simulation 4: Error Fail-Safe Watchdog Flow
    function executeErrorSimulation() {
        setTimeout(() => {
            setNodePulse('node-chat-trigger');
        }, 100);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-classifier');
            setWireActive('wire-chat-classifier');
        }, 1200);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-rag-agent');
            setWireActive('wire-classifier-rag');
        }, 2500);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-pinecone-db');
            setWireActive('wire-rag-pinecone');
        }, 3800);

        setTimeout(() => {
            clearNodePulse();
            // Vector Store crashed
            setNodePulse('node-pinecone-db');
            setWireActive('wire-rag-pinecone', 'error');
        }, 4800);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-failsafe');
            setWireActive('wire-pinecone-failsafe', 'failsafe');
        }, 5800);

        setTimeout(() => {
            clearNodePulse();
            isSimulating = false;
            simBtnError.classList.remove('active-run');
        }, 7800);
    }

    // ==========================================================================
    // CONTACT CARD INTERACTIONS (Copy Button, Mobile Dialer & Smart Gmail Link)
    // ==========================================================================
    const copyButtons = document.querySelectorAll('.contact-copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                btn.classList.add('copied');
                
                // Reset copy icon state after 2 seconds
                setTimeout(() => {
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy contact details: ', err);
            });
        });
    });

    const emailLink = document.getElementById('contact-email-link');
    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            // If user clicked the copy button, let copy handler do its job and do not navigate
            if (e.target.closest('.contact-copy-btn')) {
                return;
            }
            
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (!isMobile) {
                // Prevent mailto default app prompt and redirect directly to Gmail compose in browser
                e.preventDefault();
                window.open('https://mail.google.com/mail/?view=cm&fs=1&to=tahmidmirja25@gmail.com', '_blank');
            }
            // If on mobile, let the default mailto link trigger native Gmail app or Mail client
        });
    }

    const phoneLink = document.getElementById('contact-phone-link');
    if (phoneLink) {
        phoneLink.addEventListener('click', (e) => {
            if (e.target.closest('.contact-copy-btn')) {
                return;
            }
            
            // Standard tel: link handles default dialing application across mobile platforms perfectly
        });
    }

    // ==========================================================================
    // GLOBAL SCROLL REVEAL (Intersection Observer Engine)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide-left, .reveal-slide-right');
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    observer.unobserve(entry.target); // Unobserve to trigger only once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }
});
