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
            
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        });
        
        const animateOutline = () => {
            const ease = 0.15;
            outlineX += (mouseX - outlineX) * ease;
            outlineY += (mouseY - outlineY) * ease;
            
            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
            
            requestAnimationFrame(animateOutline);
        };
        requestAnimationFrame(animateOutline);
        
        const updateHoverState = () => {
            const interactables = document.querySelectorAll('a, button, .project-text-card, .service-card, .social-icon-btn, .training-tag, .blueprint-node, .sim-btn, .showcase-card, .showcase-thumbnail-card');
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
    const menuCloseLinks = document.querySelectorAll('.nav-link:not(.nav-dropdown-toggle), .nav-dropdown-item');
    menuCloseLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (menuIcon) menuIcon.classList.remove('hidden');
            if (closeIcon) closeIcon.classList.add('hidden');
        });
    });

    // Toggle Dropdowns on Mobile
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                }
            });
        }
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
            desc: 'Evaluates inputs to classify intent into CUSTOMER_SUPPORT AI or business_team. Runs smart matching rules.',
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

    // Helper to evaluate dynamic params based on selector values
    function getDynamicNodeParams(nodeKey) {
        const spec = nodeSpecs[nodeKey];
        if (!spec) return {};
        const params = { ...spec.params };

        const llmModelEl = document.getElementById('config-llm-model');
        const selectedModel = llmModelEl ? llmModelEl.value : 'gpt-4.1-mini';

        if (nodeKey === 'classifier') {
            params['Language Model'] = `${selectedModel} (OpenAI Chat Model)`;
        } else if (nodeKey === 'rag-agent' || nodeKey === 'lead-agent') {
            params['Language Model'] = selectedModel;
        } else if (nodeKey === 'failsafe') {
            const isWhatsapp = document.getElementById('config-toggle-whatsapp')?.classList.contains('active');
            const isEmail = document.getElementById('config-toggle-email')?.classList.contains('active');
            const platforms = [];
            if (isWhatsapp) platforms.push('WhatsApp Alert (Twilio API)');
            if (isEmail) platforms.push('Email Alert (Gmail Dispatch)');
            platforms.push('Telegram Channel'); // Telegram always on
            params['Alert Platforms'] = platforms.join(', ');
        }
        return params;
    }

    // Bind Parameter Config Controls
    const llmSelector = document.getElementById('config-llm-model');
    const toggleWhatsappBtn = document.getElementById('config-toggle-whatsapp');
    const toggleEmailBtn = document.getElementById('config-toggle-email');

    if (llmSelector) {
        llmSelector.addEventListener('change', (e) => {
            logToConsole(`[SYSTEM] Language Model parameter updated to: <strong>${e.target.value}</strong>`, 'system');
        });
    }

    if (toggleWhatsappBtn) {
        toggleWhatsappBtn.addEventListener('click', () => {
            toggleWhatsappBtn.classList.toggle('active');
            const active = toggleWhatsappBtn.classList.contains('active');
            logToConsole(`[SYSTEM] WhatsApp alerts <strong>${active ? 'ENABLED' : 'DISABLED'}</strong>.`, active ? 'success' : 'system');
        });
    }

    if (toggleEmailBtn) {
        toggleEmailBtn.addEventListener('click', () => {
            toggleEmailBtn.classList.toggle('active');
            const active = toggleEmailBtn.classList.contains('active');
            logToConsole(`[SYSTEM] Email alerts <strong>${active ? 'ENABLED' : 'DISABLED'}</strong>.`, active ? 'success' : 'system');
        });
    }

    // Inspector events on hover
    nodes.forEach(node => {
        const nodeKey = node.dataset.node;
        if (!nodeKey || !nodeSpecs[nodeKey]) return;

        node.addEventListener('mouseenter', () => {
            const spec = nodeSpecs[nodeKey];
            const dynamicParams = getDynamicNodeParams(nodeKey);
            let paramsHTML = '';
            
            for (const [key, value] of Object.entries(dynamicParams)) {
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

        // Dismiss active popups
        document.querySelectorAll('.mock-popup').forEach(p => p.classList.remove('show'));

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
        const model = document.getElementById('config-llm-model')?.value || 'gpt-4.1-mini';
        
        logToConsole(`[Trigger] Inbound support request initialized from Website widget.`, 'trigger');
        setTimeout(() => {
            setNodePulse('node-chat-trigger');
            logToConsole(`[Trigger] Chat Trigger listener fired. Payload captured: <em>"Hi, how much does custom software integration cost?"</em>`, 'trigger');
        }, 100);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-classifier');
            setWireActive('wire-chat-classifier');
            logToConsole(`[Classifier] Router evaluating query intent using <strong>${model}</strong>...`, 'logic');
        }, 1300);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-rag-agent');
            setWireActive('wire-classifier-rag');
            logToConsole(`[Classifier] Intent classified as: <strong>CUSTOMER_SUPPORT</strong>. Route dispatched to Support Agent.`, 'logic');
            logToConsole(`[Support Agent] Fetching contextual business facts. Initializing Pinecone database query...`, 'agent');
        }, 3000);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-pinecone-db');
            setWireActive('wire-rag-pinecone');
            logToConsole(`[Pinecone Store] Executing similarity search in vector index "bongodigitalkng".`, 'db');
            logToConsole(`[Pinecone Store] Returned 3 semantic text chunks. Simulating embedding search...`, 'db');
        }, 4500);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-rag-agent');
            logToConsole(`[Support Agent] Injecting retrieved context into system prompt. Invoking Language Model API (<strong>${model}</strong>)...`, 'agent');
        }, 6000);

        setTimeout(() => {
            clearNodePulse();
            isSimulating = false;
            simBtnChat.classList.remove('active-run');
            logToConsole(`[Support Agent] Response compiled. (LLM: <strong>${model}</strong> | Latency: 0.65s). Dispatching response to chat client...`, 'agent');
            logToConsole(`[SYSTEM] Support Chat simulation successfully complete.`, 'success');
            
            // Show WhatsApp Mock Popup Chat
            const outgoingTextEl = document.getElementById('chat-outgoing-text');
            if (outgoingTextEl) {
                outgoingTextEl.innerHTML = `Hello! Our integration services vary depending on complexity. Basic API links start at $500, while multi-agent workflow systems range from $2,500 to $7,500. Can I connect you with our manager to get a precise quote?<br><span style="font-size:0.58rem; opacity:0.6; display:block; margin-top:5px; border-top:1px solid rgba(255,255,255,0.1); padding-top:3px;">Generated using ${model} | System: Live</span>`;
            }
            document.getElementById('mock-popup-chat')?.classList.add('show');
        }, 7500);
    }

    // Simulation 2: Business Partnership Lead Flow
    function executeCollabSimulation() {
        const model = document.getElementById('config-llm-model')?.value || 'gpt-4.1-mini';
        
        logToConsole(`[Trigger] Inbound webhook received from Business Lead form.`, 'trigger');
        setTimeout(() => {
            setNodePulse('node-chat-trigger');
            logToConsole(`[Trigger] Form Trigger listener fired. Form Payload: <em>"B2B Partnership Inquiry from E-commerce brand"</em>`, 'trigger');
        }, 100);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-classifier');
            setWireActive('wire-chat-classifier');
            logToConsole(`[Classifier] Router evaluating query intent using <strong>${model}</strong>...`, 'logic');
        }, 1300);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-lead-agent');
            setWireActive('wire-classifier-lead');
            logToConsole(`[Classifier] Intent classified as: <strong>BUSINESS_TEAM</strong>. Routing to Lead Generator Agent.`, 'logic');
            logToConsole(`[Lead Agent] Formulating structured email draft using model: <strong>${model}</strong>. Parsing payload fields...`, 'agent');
        }, 3000);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-gmail');
            setWireActive('wire-lead-gmail');
            logToConsole(`[Gmail Dispatch] Compiled email subject: <em>"New Partnership Opportunity: E-commerce Client"</em>`, 'action');
            logToConsole(`[Gmail Dispatch] Auto-dispatching email payload to tahmidmirja25@gmail.com...`, 'action');
        }, 4800);

        setTimeout(() => {
            clearNodePulse();
            isSimulating = false;
            simBtnCollab.classList.remove('active-run');
            logToConsole(`[Gmail Dispatch] Email successfully sent. Gmail status: 200 OK.`, 'success');
            logToConsole(`[SYSTEM] Business Lead Inquiry simulation successfully complete.`, 'success');
        }, 6500);
    }

    // Simulation 3: PDF Ingest Flow
    function executeIngestSimulation() {
        logToConsole(`[Trigger] Scheduled cron or manual document upload initiated.`, 'trigger');
        setTimeout(() => {
            setNodePulse('node-form-trigger');
            logToConsole(`[Trigger] Form Trigger listener fired. Uploaded PDF asset path: <em>"/tmp/company_rules_v3.pdf"</em>`, 'trigger');
        }, 100);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-extractor');
            setWireActive('wire-form-extractor');
            logToConsole(`[File Extractor] Reading PDF bytes and extracting raw text formatting...`, 'logic');
            logToConsole(`[File Extractor] Extracted 1,240 tokens. Structuring text into layout chunks.`, 'logic');
        }, 1300);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-pinecone-db');
            setWireActive('wire-extractor-pinecone');
            logToConsole(`[Pinecone Store] Initiating vector embeddings mapping using OpenAI text-embedding-3-small...`, 'db');
            logToConsole(`[Pinecone Store] Vectorizing chunks. Upserting 12 new vectors to index "bongodigitalkng"...`, 'db');
        }, 3000);

        setTimeout(() => {
            clearNodePulse();
            isSimulating = false;
            simBtnIngest.classList.remove('active-run');
            logToConsole(`[Pinecone Store] Upsert transaction completed. 12 vectors successfully indexed.`, 'success');
            logToConsole(`[SYSTEM] Knowledge base ingestion and vector index update complete.`, 'success');
        }, 4800);
    }

    // Simulation 4: Error Fail-Safe Watchdog Flow
    function executeErrorSimulation() {
        const model = document.getElementById('config-llm-model')?.value || 'gpt-4.1-mini';
        const isWhatsapp = document.getElementById('config-toggle-whatsapp')?.classList.contains('active');
        const isEmail = document.getElementById('config-toggle-email')?.classList.contains('active');

        logToConsole(`[Trigger] Scheduled healthcheck watchdog tick.`, 'trigger');
        setTimeout(() => {
            setNodePulse('node-chat-trigger');
            logToConsole(`[Trigger] Healthcheck ping failed. Simulated query initiated...`, 'trigger');
        }, 100);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-classifier');
            setWireActive('wire-chat-classifier');
            logToConsole(`[Classifier] Classifying error flow diagnostics...`, 'logic');
        }, 1200);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-rag-agent');
            setWireActive('wire-classifier-rag');
            logToConsole(`[Support Agent] Requesting database search from Pinecone Vector Store...`, 'agent');
        }, 2500);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-pinecone-db');
            setWireActive('wire-rag-pinecone');
            logToConsole(`[Pinecone Store] Querying vectors...`, 'db');
        }, 3800);

        setTimeout(() => {
            clearNodePulse();
            // Vector Store crashed
            setNodePulse('node-pinecone-db');
            setWireActive('wire-rag-pinecone', 'error');
            logToConsole(`[Pinecone Store] ERROR: Connection timeout. Service unavailable (503 Service Unavailable).`, 'error');
        }, 4800);

        setTimeout(() => {
            clearNodePulse();
            setNodePulse('node-failsafe');
            setWireActive('wire-pinecone-failsafe', 'failsafe');
            logToConsole(`[Watchdog] Intercepted CRITICAL EXCEPTION. Triggering Global Emergency Watchdog...`, 'error');
            
            // Check WhatsApp
            if (isWhatsapp) {
                logToConsole(`[Watchdog] WhatsApp Alert [ACTIVE]: Dispatching incident report to Owner via Twilio API...`, 'action');
            } else {
                logToConsole(`[Watchdog] WhatsApp Alert [DISABLED]: Skipping WhatsApp notification dispatch.`, 'system');
            }

            // Check Email
            if (isEmail) {
                logToConsole(`[Watchdog] Email Alert [ACTIVE]: Dispatching SMTP incident payload via Gmail Dispatch...`, 'action');
            } else {
                logToConsole(`[Watchdog] Email Alert [DISABLED]: Skipping Email notification dispatch.`, 'system');
            }
        }, 5800);

        setTimeout(() => {
            clearNodePulse();
            isSimulating = false;
            simBtnError.classList.remove('active-run');
            
            const activeAlerts = [];
            if (isWhatsapp) activeAlerts.push('WhatsApp');
            if (isEmail) activeAlerts.push('Email');
            activeAlerts.push('Telegram'); // Telegram always on

            logToConsole(`[Watchdog] Incident notifications successfully dispatched to: [${activeAlerts.join(', ')}].`, 'success');
            logToConsole(`[SYSTEM] Watchdog execution completed. System entering monitoring fallback state.`, 'success');

            // Show Slack Mock Popup Card
            const slackChannelsEl = document.getElementById('slack-alert-channels');
            if (slackChannelsEl) {
                slackChannelsEl.innerHTML = activeAlerts.join(', ');
            }
            document.getElementById('mock-popup-slack')?.classList.add('show');
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

    // ==========================================================================
    // DYNAMIC SHOWCASE GALLERY & LIGHTBOX MODAL
    // ==========================================================================
    const thumbnailGrid = document.getElementById('showcase-thumbnail-grid');
    const lightbox = document.getElementById('showcase-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxClose = document.getElementById('lightbox-close');

    // 22 remaining gallery images
    const galleryImages = [
        { file: "Screenshot 2026-05-30 131056.webp", title: "API Endpoint Webhook Receiver", desc: "Listens for inbound webhooks and classifies request parameters." },
        { file: "Screenshot 2026-05-30 131115.webp", title: "Google Sheets Data Syncer", desc: "Pushes raw data entries to Google Sheets for business reporting." },
        { file: "Screenshot 2026-05-30 131136.webp", title: "Slack Incident Notifier", desc: "Sends critical system logs and warnings directly to private Slack channels." },
        { file: "Screenshot 2026-05-30 131154.webp", title: "Stripe Payment Webhook Handler", desc: "Updates user subscriptions in the database automatically on Stripe events." },
        { file: "Screenshot 2026-05-30 131205.webp", title: "PDF Invoice Parser & OCR", desc: "Extracts line items from invoices and validates totals securely." },
        { file: "Screenshot 2026-05-30 131220.webp", title: "Hubspot Lead Synchronizer", desc: "Automatically matches website leads with existing Hubspot CRM contacts." },
        { file: "Screenshot 2026-05-30 131227.webp", title: "Daily Sales Report Generator", desc: "Aggregates revenue metrics and emails a daily executive summary." },
        { file: "Screenshot 2026-05-30 131235.webp", title: "Customer Onboarding Sequence", desc: "Triggers welcome emails and schedules onboarding calls in CRM." },
        { file: "Screenshot 2026-05-30 131243.webp", title: "OpenAI Text Sentiment Classifier", desc: "Analyzes feedback text and marks negative tickets for human follow-up." },
        { file: "Screenshot 2026-05-30 131250.webp", title: "Pinecone Vector Upserter", desc: "Converts documentation text into vectors and pushes them to database indices." },
        { file: "Screenshot 2026-05-30 131259.webp", title: "Dynamic Calendar Scheduler", desc: "Checks Cal.com availability and reserves custom meeting slots dynamically." },
        { file: "Screenshot 2026-05-30 131308.webp", title: "AI Email Draft Assistant", desc: "Drafts personalized replies to customer support emails automatically using LLMs." },
        { file: "Screenshot 2026-05-30 131315.webp", title: "Backup Sync to AWS S3", desc: "Compresses log databases and pushes them to secure cloud storage." },
        { file: "Screenshot 2026-05-30 131329.webp", title: "Database Cleanup Cron Job", desc: "Periodically clears expired tokens and temporary sessions automatically." },
        { file: "Screenshot 2026-05-30 131339.webp", title: "ActiveCampaign Tag Appender", desc: "Appends lifecycle tags to marketing contacts based on user actions." },
        { file: "Screenshot 2026-05-30 131348.webp", title: "Multi-Region API Router", desc: "Routes client API requests to the nearest server region automatically." },
        { file: "Screenshot 2026-05-30 131355.webp", title: "Telegram Notification Dispatcher", desc: "Pushes system health stats and custom alerts to private admin channels." },
        { file: "Screenshot 2026-05-30 131409.webp", title: "CSV Data Import Validator", desc: "Parses uploaded customer files and flags structural format errors before write." },
        { file: "Screenshot 2026-05-30 131417.webp", title: "AI-Powered Lead Enrichment", desc: "Scrapes public profiles to enrich contact entries with business details." },
        { file: "Screenshot 2026-05-30 131425.webp", title: "Weekly Metrics Aggregator", desc: "Calculates weekly growth percentages and alerts slack channels." },
        { file: "Screenshot 2026-05-30 131430.webp", title: "AirTable CRM Sync Engine", desc: "Syncs leads between dynamic AirTable boards and core DB systems." },
        { file: "Screenshot 2026-05-30 131437.webp", title: "Multi-Language Translating Agent", desc: "Detects query language and translates text for AI LLM processing." }
    ];

    // Inject thumbnails
    if (thumbnailGrid) {
        galleryImages.forEach(img => {
            const thumbCard = document.createElement('div');
            thumbCard.className = 'showcase-thumbnail-card';
            thumbCard.setAttribute('data-src', `showcase/${img.file}`);
            thumbCard.setAttribute('data-title', img.title);
            thumbCard.setAttribute('data-desc', img.desc);

            thumbCard.innerHTML = `
                <img src="showcase/${img.file}" class="showcase-thumb-img" alt="${img.title}" loading="lazy">
                <div class="thumb-hover-overlay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-in"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                </div>
            `;
            thumbnailGrid.appendChild(thumbCard);
        });

        // Initialize Lucide Icons for injected items if lucide is loaded
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Lightbox Handlers
    function openLightbox(src, title, desc) {
        if (!lightbox || !lightboxImg || !lightboxTitle || !lightboxDesc) return;
        lightboxImg.src = src;
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Unlock background scroll
        setTimeout(() => {
            if (lightboxImg) lightboxImg.src = '';
        }, 300);
    }

    // Bind Featured Showcase cards
    const showcaseCards = document.querySelectorAll('.showcase-card');
    showcaseCards.forEach(card => {
        card.addEventListener('click', () => {
            const src = card.getAttribute('data-src');
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            openLightbox(src, title, desc);
        });
    });

    // Bind Dynamic Gallery Cards
    if (thumbnailGrid) {
        thumbnailGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.showcase-thumbnail-card');
            if (card) {
                const src = card.getAttribute('data-src');
                const title = card.getAttribute('data-title');
                const desc = card.getAttribute('data-desc');
                openLightbox(src, title, desc);
            }
        });
    }

    // Close Actions
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Escape key to close
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // Re-bind hover interactions so custom cursor grows on showcase cards
    if (typeof updateHoverState === 'function') {
        updateHoverState();
    }
});

// Handle scroll-to-hash on page redirect / load to fix dynamic layout shifts
window.addEventListener('load', () => {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            // Tiny delay to let browser layouts settle completely
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }
    }
});
