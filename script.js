import translations from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navigation
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust scroll position for fixed header
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Scroll Animation (Fade Up & Reveal)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up-element, .reveal-wrapper').forEach(el => {
        observer.observe(el);
    });

    // 5. Lightbox for Gallery
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.getAttribute('data-src');
            const captionText = item.querySelector('h5').innerText;
            
            lightboxImg.src = imgSrc;
            lightboxCaption.innerText = captionText;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close Lightbox functions
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
        // Small delay to allow fade out before changing src to prevent flicker
        setTimeout(() => {
            if (!lightbox.classList.contains('active')) {
                lightboxImg.src = '';
            }
        }, 300);
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    // Close lightbox when click outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close lightbox with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // 6. Highlight active nav link on scroll
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links a:not(.btn-primary-outline)');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Add a little offset for better UX
            if (scrollPosition >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // 7. Staggered Text Reveal
    const staggeredTitle = document.querySelector('.staggered-reveal');
    if (staggeredTitle) {
        const text = staggeredTitle.textContent;
        staggeredTitle.innerHTML = '';
        // Memisahkan kata untuk animasi
        const words = text.split(' ');
        words.forEach((word, index) => {
            const span = document.createElement('span');
            // Menambahkan spasi kecil non-breaking jika bukan kata terakhir untuk kerapian
            span.textContent = word + (index < words.length - 1 ? '\\u00A0' : '');
            // Mengatur delay setiap kata
            span.style.animationDelay = `${index * 0.1}s`;
            staggeredTitle.appendChild(span);
        });
    }

    // 8. Parallax Effect for Hero Content
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        if (scrollPosition < window.innerHeight && heroContent) {
            // Memindahkan konten sedikit ke bawah saat di-scroll
            heroContent.style.transform = `translateY(${scrollPosition * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrollPosition / 500);
        }
    });

    // 9. Dark Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check saved theme or system preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        let theme = 'light';
        if (document.body.classList.contains('dark-theme')) {
            theme = 'dark';
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
        
        // Save preference
        localStorage.setItem('theme', theme);
    });

    // 10. Random Daily Verse (Bilingual)
    const bibleVerses = [
        { 
            en: { text: "Let no one despise your youth, but be an example to the believers in word, in conduct, in love, in spirit, in faith, in purity.", ref: "1 Timothy 4:12" },
            id: { text: "Jangan seorangpun menganggap engkau rendah karena engkau muda. Jadilah teladan bagi orang-orang percaya, dalam perkataanmu, dalam tingkah lakumu, dalam kasihmu, dalam kesetiaanmu dan dalam kesucianmu.", ref: "1 Timotius 4:12" }
        },
        { 
            en: { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
            id: { text: "Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.", ref: "Filipi 4:13" }
        },
        { 
            en: { text: "For I know the thoughts that I think toward you, says the Lord, thoughts of peace and not of evil, to give you a future and a hope.", ref: "Jeremiah 29:11" },
            id: { text: "Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan.", ref: "Yeremia 29:11" }
        },
        { 
            en: { text: "Trust in the Lord with all your heart, and lean not on your own understanding; In all your ways acknowledge Him, and He shall direct your paths.", ref: "Proverbs 3:5-6" },
            id: { text: "Percayalah kepada TUHAN dengan segenap hatimu, dan janganlah bersandar kepada pengertianmu sendiri. Akuilah Dia dalam segala lakumu, maka Ia akan meluruskan jalanmu.", ref: "Amsal 3:5-6" }
        },
        { 
            en: { text: "Let your light so shine before men, that they may see your good works and glorify your Father in heaven.", ref: "Matthew 5:16" },
            id: { text: "Demikianlah hendaknya terangmu bercahaya di depan orang, supaya mereka melihat perbuatanmu yang baik dan memuliakan Bapamu yang di sorga.", ref: "Matius 5:16" }
        },
        { 
            en: { text: "But those who wait on the Lord Shall renew their strength; They shall mount up with wings like eagles, They shall run and not be weary, They shall walk and not faint.", ref: "Isaiah 40:31" },
            id: { text: "Tetapi orang-orang yang menanti-nantikan TUHAN mendapat kekuatan baru: mereka seumpama rajawali yang naik terbang dengan kekuatan sayapnya; mereka berlari dan tidak menjadi lesu, mereka berjalan dan tidak menjadi lelah.", ref: "Yesaya 40:31" }
        },
        { 
            en: { text: "And let us consider one another in order to stir up love and good works.", ref: "Hebrews 10:24" },
            id: { text: "Dan marilah kita saling memperhatikan supaya kita saling mendorong dalam kasih dan dalam pekerjaan baik.", ref: "Ibrani 10:24" }
        }
    ];

    const currentVerseIndex = Math.floor(Math.random() * bibleVerses.length);
    const verseEl = document.getElementById('daily-verse-text');
    const refEl = document.getElementById('daily-verse-ref');

    // 11. Gallery Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Animasi fade out
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || filterValue === category) {
                        item.classList.remove('hide');
                        // Animasi fade in
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.classList.add('hide');
                    }
                }, 300); // Wait for fade out
            });
        });
    });

    // 12. Magnetic Buttons
    const magnets = document.querySelectorAll('.magnetic-btn');
    
    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', function(e) {
            const position = magnet.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
            
            // Adjust the multiplier for strength
            magnet.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
        });

        magnet.addEventListener('mouseout', function(e) {
            magnet.style.transform = `translate(0px, 0px)`;
        });
    });

    // 13. Ken Burns Trigger
    // Automatically adds and removes a pan-active class every 15 seconds to simulate continuous, subtle slow panning
    const kbElements = document.querySelectorAll('.ken-burns');
    if (kbElements.length > 0) {
        // Initial setup
        setTimeout(() => {
            kbElements.forEach(el => el.classList.add('pan-active'));
        }, 1000);

        // Toggle every 20 seconds for continuous motion look
        setInterval(() => {
            kbElements.forEach(el => {
                if(el.classList.contains('pan-active')){
                     el.classList.remove('pan-active');
                } else {
                     el.classList.add('pan-active');
                }
            });
        }, 20000);
    }

    // 14. Typographic Splash Screen (Preloader)
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        const chant1 = document.getElementById('chant-1');
        const chant2 = document.getElementById('chant-2');
        const chant3 = document.getElementById('chant-3');
        
        if (preloader) {
            // Sequence timing
            setTimeout(() => chant1.classList.add('reveal'), 200);   // Show line 1
            setTimeout(() => chant2.classList.add('reveal'), 1000);  // Show line 2
            setTimeout(() => chant3.classList.add('reveal'), 1800);  // Show line 3
            
            // Fade out the text slightly before the screen slides up
            setTimeout(() => {
                chant1.classList.add('fade-out');
                chant2.classList.add('fade-out');
                chant3.classList.add('fade-out');
            }, 3500);

            // Slide the entire dark dramatic screen UP to reveal the bright hero section
            setTimeout(() => {
                preloader.classList.add('slide-up');
                
                // Trigger hero text animation manually AFTER splash screen is gone
                // This ensures they don't play underneath the preloader
                const heroElements = document.querySelectorAll('.hero-content .fade-up-element, .hero-content .staggered-reveal');
                heroElements.forEach(el => el.classList.add('visible'));
                
            }, 4000); 
        }
    });

    // 15. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 16. 3D Tilt Effect for Team Cards
    const tiltCards = document.querySelectorAll('.team-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (max 15 degrees)
            const rotateX = ((y - centerY) / centerY) * -15; 
            const rotateY = ((x - centerX) / centerX) * 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    // 17. Internationalization (Language Toggle)
    const langToggleBtn = document.getElementById('lang-toggle');
    const langText = langToggleBtn.querySelector('.lang-text');
    let currentLang = localStorage.getItem('pa-lang') || 'en'; // Default to English
    
    // Function to update the page text
    function updateLanguage(lang) {
        document.documentElement.lang = lang;
        langText.textContent = lang === 'en' ? 'ID' : 'EN';
        
        const elementsToTranslate = document.querySelectorAll('[data-i18n]');
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        // Update Dynamic Daily Verse based on selected language
        if (verseEl && refEl && bibleVerses[currentVerseIndex]) {
            verseEl.textContent = bibleVerses[currentVerseIndex][lang].text;
            refEl.textContent = `- ${bibleVerses[currentVerseIndex][lang].ref}`;
        }
    }

    // Initialize Language
    if (langToggleBtn) {
        updateLanguage(currentLang);
        
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'id' : 'en';
            localStorage.setItem('pa-lang', currentLang);
            updateLanguage(currentLang);
        });
    }

    // 18. Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const scrollBar = document.getElementById('scroll-progress');
        if (scrollBar) {
            scrollBar.style.width = scrolled + "%";
        }
    });

});
