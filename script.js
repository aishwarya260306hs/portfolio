document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       THEME TOGGLE
       ========================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const htmlElement = document.documentElement;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Re-render chart if it exists to update text/grid colors for the new theme
        if (typeof updateChartColors === 'function') {
            updateChartColors(newTheme);
        }
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeToggleIcon.className = 'fa-solid fa-sun';
            themeToggleBtn.title = 'Switch to Light Mode';
        } else {
            themeToggleIcon.className = 'fa-solid fa-moon';
            themeToggleBtn.title = 'Switch to Dark Mode';
        }
    }


    /* ==========================================
       SCROLL EFFECT FOR HEADER
       ========================================== */
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    /* ==========================================
       MOBILE DRAWER NAVIGATION
       ========================================== */
    const mobileNavToggleBtn = document.getElementById('mobile-nav-toggle-btn');
    const mobileDrawerMenu = document.getElementById('mobile-drawer-menu');
    const drawerCloseBtn = document.getElementById('drawer-close');
    const drawerMenuOverlay = document.getElementById('drawer-menu-overlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        mobileDrawerMenu.classList.add('active');
        drawerMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when open
    }

    function closeDrawer() {
        mobileDrawerMenu.classList.remove('active');
        drawerMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }

    mobileNavToggleBtn.addEventListener('click', openDrawer);
    drawerCloseBtn.addEventListener('click', closeDrawer);
    drawerMenuOverlay.addEventListener('click', closeDrawer);
    
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });


    /* ==========================================
       TYPEWRITER EFFECT FOR HERO SUBTITLE
       ========================================== */
    const typewriterTarget = document.getElementById('typewriter-target');
    const words = ['Data Analyst', 'Data Scientist', 'Key Account Manager'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterTarget.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            typewriterTarget.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Natural typing speed
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at the end of the word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Brief pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }
    
    // Start the typewriter effect
    setTimeout(type, 1000);


    /* ==========================================
       SCROLL SPY (ACTIVE NAV LINK)
       ========================================== */
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // Offset for header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================
       INTERACTIVE DATA SHOWCASE (CHART.JS)
       ========================================== */
    const chartCanvas = document.getElementById('dashboard-chart');
    const dashboardInsightsText = document.getElementById('insights-text-container');
    const dashboardActiveTitle = document.getElementById('dashboard-active-title');
    const tabButtons = document.querySelectorAll('.dashboard-tab-btn');
    
    let activeChart = null;

    // Color tokens matching CSS themes
    const colors = {
        dark: {
            text: '#f3f4f6',
            grid: 'rgba(255, 255, 255, 0.08)',
            primary: '#3b82f6',
            primaryGlow: 'rgba(59, 130, 246, 0.45)',
            accent: '#06b6d4',
            accentGlow: 'rgba(6, 182, 212, 0.45)',
            neutralGlow: 'rgba(255, 255, 255, 0.05)',
            palette: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6']
        },
        light: {
            text: '#0f172a',
            grid: 'rgba(15, 23, 42, 0.08)',
            primary: '#2563eb',
            primaryGlow: 'rgba(37, 99, 235, 0.4)',
            accent: '#0891b2',
            accentGlow: 'rgba(8, 145, 178, 0.4)',
            neutralGlow: 'rgba(15, 23, 42, 0.05)',
            palette: ['#2563eb', '#0891b2', '#059669', '#d97706', '#7c3aed']
        }
    };

    // Datasets configuration
    const datasetsConfig = {
        customer: {
            title: 'Customer Segment Distribution',
            type: 'doughnut',
            data: {
                labels: ['Enterprise Accounts', 'Mid-Market Clients', 'SMEs / Startup Portfolios', 'Academic Partners'],
                datasets: [{
                    label: 'Client Portfolio %',
                    data: [45, 30, 15, 10],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            },
            insights: `
                <p><strong>Primary Driver:</strong> High-value Enterprise Accounts make up the largest portion (45%) of client engagement. This highlights Aishwarya's capacity to direct communications and solutions for large organizations.</p>
                <p><strong>Retention Focus:</strong> Mid-market clients represent 30% of accounts. Advanced predictive modeling tools are used to evaluate retention data, mitigating churn before contract renewal periods.</p>
                <p><strong>Academic Synergy:</strong> Leveraging university pipelines (10%) connects REVA University's advanced tech research directly with operational client pipelines.</p>
            `
        },
        sales: {
            title: 'Account Retention & Revenue Growth %',
            type: 'line',
            data: {
                labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025 (Est)'],
                datasets: [{
                    label: 'Growth rate (%)',
                    data: [12, 18, 26, 35, 48, 55],
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { callback: value => value + '%' }
                    }
                }
            },
            insights: `
                <p><strong>Consistently Positive Trajectory:</strong> Under modern Key Account Management practices, account value growth metrics increased from 12% in Q1 2024 to a projected 55% in Q2 2025.</p>
                <p><strong>Impact of Data Auditing:</strong> The sharp incline in Q4 2024 (rising from 26% to 35%) matches the deployment of Python data models to automate operational client reports.</p>
                <p><strong>Efficiency:</strong> Streamlined tracking protocols reduced response delays, increasing customer satisfaction indices across high-value portfolios.</p>
            `
        },
        skills: {
            title: 'Multidisciplinary Skill Web',
            type: 'radar',
            data: {
                labels: ['Python Scripting', 'Jupyter Analysis', 'Pandas & SQL', 'Key Account Growth', 'Client Relations', 'Requirements Auditing'],
                datasets: [{
                    label: 'Self-Assessed Score (100 Max)',
                    data: [90, 95, 88, 95, 92, 89],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { display: true },
                        suggestedMin: 50,
                        suggestedMax: 100
                    }
                }
            },
            insights: `
                <p><strong>A Unique Professional Web:</strong> The visual web showcases a hybrid profile. Aishwarya scores 95% in both client relations and Jupyter analysis platforms.</p>
                <p><strong>Bridging the Gap:</strong> Instead of focusing exclusively on syntax compilation or commercial sales pitches, this profile brings technical auditing (89%) straight to client presentation meetings.</p>
                <p><strong>Continuous Optimization:</strong> Data storage skills (SQL, 88%) are paired with analytical tooling to extract database intelligence directly for client use. </p>
            `
        }
    };

    function renderChart(datasetKey) {
        const theme = htmlElement.getAttribute('data-theme') || 'dark';
        const config = datasetsConfig[datasetKey];
        const currentColors = colors[theme];
        
        // 1. Update Section Title
        dashboardActiveTitle.textContent = config.title;

        // 2. Clear previous chart instance to avoid rendering overlaps
        if (activeChart) {
            activeChart.destroy();
        }

        // 3. Deep Copy the configuration data to modify styling properties
        const chartData = JSON.parse(JSON.stringify(config.data));
        const chartOptions = JSON.parse(JSON.stringify(config.options));

        // 4. Apply Dynamic Styling elements depending on chart type and current theme
        const ctx = chartCanvas.getContext('2d');
        
        if (config.type === 'doughnut') {
            chartData.datasets[0].backgroundColor = currentColors.palette;
            chartData.datasets[0].borderColor = theme === 'dark' ? '#121b2d' : '#ffffff';
        } 
        else if (config.type === 'line') {
            // Apply line gradients
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, currentColors.primaryGlow);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            chartData.datasets[0].backgroundColor = gradient;
            chartData.datasets[0].borderColor = currentColors.primary;
            chartData.datasets[0].pointBackgroundColor = currentColors.accent;
            chartData.datasets[0].pointBorderColor = theme === 'dark' ? '#121b2d' : '#ffffff';
            chartData.datasets[0].pointHoverBackgroundColor = '#ffffff';
            chartData.datasets[0].pointHoverBorderColor = currentColors.primary;
            chartData.datasets[0].pointRadius = 5;
            chartData.datasets[0].pointHoverRadius = 7;
        } 
        else if (config.type === 'radar') {
            chartData.datasets[0].backgroundColor = currentColors.primaryGlow;
            chartData.datasets[0].borderColor = currentColors.primary;
            chartData.datasets[0].pointBackgroundColor = currentColors.accent;
            chartData.datasets[0].pointBorderColor = theme === 'dark' ? '#121b2d' : '#ffffff';
        }

        // 5. Apply Universal Theme Colors (text, grids) to chart options
        applyThemeToChartOptions(chartOptions, currentColors, config.type);

        // 6. Build the Chart
        activeChart = new Chart(chartCanvas, {
            type: config.type,
            data: chartData,
            options: chartOptions
        });

        // 7. Render Text Insights
        dashboardInsightsText.innerHTML = config.insights;
    }

    function applyThemeToChartOptions(options, themeColors, chartType) {
        // Universal Font Family
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.font.size = 12;
        Chart.defaults.color = themeColors.text;

        // Grid colors and border lines
        if (chartType === 'line' || chartType === 'bar') {
            if (!options.scales) options.scales = {};
            
            options.scales.x = {
                grid: { color: themeColors.grid },
                ticks: { color: themeColors.text }
            };
            options.scales.y = {
                grid: { color: themeColors.grid },
                ticks: { color: themeColors.text }
            };
        } 
        else if (chartType === 'radar') {
            if (!options.scales) options.scales = {};
            options.scales.r = {
                angleLines: { color: themeColors.grid },
                grid: { color: themeColors.grid },
                pointLabels: {
                    color: themeColors.text,
                    font: {
                        family: "'Outfit', sans-serif",
                        size: 11,
                        weight: '600'
                    }
                },
                ticks: {
                    backdropColor: 'transparent',
                    color: themeColors.text
                }
            };
        }

        // Legends
        if (!options.plugins) options.plugins = {};
        options.plugins.legend = {
            labels: {
                color: themeColors.text,
                font: { weight: '500' }
            }
        };
    }

    // Bind theme switching updates to Chart rendering
    window.updateChartColors = function(newTheme) {
        const activeTab = document.querySelector('.dashboard-tab-btn.active');
        const activeKey = activeTab ? activeTab.getAttribute('data-dataset') : 'customer';
        renderChart(activeKey);
    };

    // Tab switcher events
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active style from other tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active style to selected tab
            const btn = e.currentTarget;
            btn.classList.add('active');
            
            // Render the targeted dataset
            const datasetKey = btn.getAttribute('data-dataset');
            renderChart(datasetKey);
        });
    });

    // Initial Dashboard Render
    if (chartCanvas) {
        renderChart('customer');
    }


    /* ==========================================
       CONTACT FORM VALIDATION & SUCCESS FEEDBACK
       ========================================== */
    const contactForm = document.getElementById('contact-form');
    const toastSuccess = document.getElementById('toast-success');
    const submitBtn = document.getElementById('btn-submit');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop standard form submission reload

            // Basic validation check
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !subject || !message) {
                alert('Please fill out all the fields in the contact form.');
                return;
            }

            // Disable submit button and show submitting state
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

            // Simulate server network request delay
            setTimeout(() => {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Show success toast notification
                toastSuccess.classList.add('show');
                
                // Clear all input elements
                contactForm.reset();

                // Hide success toast after 4 seconds
                setTimeout(() => {
                    toastSuccess.classList.remove('show');
                }, 4000);

            }, 1200);
        });
    }
});
