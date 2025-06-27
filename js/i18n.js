<<<<<<< HEAD
// Internationalization core functionality with embedded translations
class I18nManager {
=======
class I18n {
>>>>>>> origin/main
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {};
    this.defaultLanguage = 'en';
    this.supportedLanguages = ['en', 'ja'];
<<<<<<< HEAD
    this.observers = [];
    this.isInitialized = false;
    
    // Load embedded translations immediately
    this.loadEmbeddedTranslations();
  }

  // Load embedded translations
  loadEmbeddedTranslations() {
    this.translations = {
      en: this.getEmbeddedEnglishTranslations(),
      ja: this.getEmbeddedJapaneseTranslations()
    };
  }

  // Initialize the i18n system
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Check URL parameters first
      const urlLang = this.getLanguageFromUrl();
      
      // Then check stored preference
      const savedLanguage = this.getStoredLanguage();
      
      // Set language with priority: URL > localStorage > default to English
      this.currentLanguage = urlLang || savedLanguage || this.defaultLanguage;

      // Update UI
      this.updateUI();
      this.updateLanguageSwitcher();
      this.updateDocumentLanguage();
      this.updateMetaTags();
      
      this.isInitialized = true;
      this.notifyObservers('initialized', this.currentLanguage);
    } catch (error) {
      console.error('Failed to initialize i18n:', error);
      // Fallback to English
      this.currentLanguage = 'en';
      this.updateUI();
    }
  }

  // Switch to a different language
  async switchLanguage(language) {
    if (language === this.currentLanguage) return;
    if (!this.supportedLanguages.includes(language)) {
      console.error(`Unsupported language: ${language}`);
      return;
    }

    try {
      // Show loading state
      this.setLoadingState(true);
      
      // Update current language
      this.currentLanguage = language;

      // Save preference
      this.storeLanguage(language);

      // Update UI
      this.updateUI();
      this.updateLanguageSwitcher();
      this.updateDocumentLanguage();
      this.updateMetaTags();

      // Notify observers
      this.notifyObservers('languageChanged', language);

    } catch (error) {
      console.error(`Failed to switch to language ${language}:`, error);
    } finally {
      this.setLoadingState(false);
    }
  }

  // Update all translatable elements in the UI
  updateUI() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getTranslation(key);
      
      if (translation && translation !== key) {
        // Handle HTML content vs text content
        if (element.hasAttribute('data-i18n-html') || translation.includes('<') || translation.includes('&')) {
          element.innerHTML = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update elements with HTML content
    const htmlElements = document.querySelectorAll('[data-i18n-html]');
    htmlElements.forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      const translation = this.getTranslation(key);
      
      if (translation && translation !== key) {
        element.innerHTML = translation;
      }
    });

    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = this.getTranslation(key);
      
      if (translation && translation !== key) {
        element.placeholder = translation;
      }
    });

    // Update aria-labels
    const ariaElements = document.querySelectorAll('[data-i18n-aria]');
    ariaElements.forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      const translation = this.getTranslation(key);
      
      if (translation && translation !== key) {
        element.setAttribute('aria-label', translation);
      }
    });
  }

  // Get translation by key
  getTranslation(key) {
    const translations = this.translations[this.currentLanguage] || this.translations[this.defaultLanguage];
    
    if (!translations) {
      console.warn(`No translations found for language: ${this.currentLanguage}`);
=======

    // Initialize on DOM load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  async init() {
    // Load saved language preference or detect from browser
    this.currentLanguage = this.getStoredLanguage() || this.detectBrowserLanguage();

    // Load translation files
    await this.loadTranslations();

    // Apply translations
    this.applyTranslations();

    // Setup language switcher
    this.setupLanguageSwitcher();

    // Update page attributes
    this.updatePageAttributes();
  }

  getStoredLanguage() {
    return localStorage.getItem('preferred-language');
  }

  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0]; // Get 'ja' from 'ja-JP'
    return this.supportedLanguages.includes(langCode) ? langCode : this.defaultLanguage;
  }

  async loadTranslations() {
    try {
      // Load all supported languages
      const promises = this.supportedLanguages.map(async (lang) => {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
        this.translations[lang] = await response.json();
      });

      await Promise.all(promises);
      console.log('All translations loaded successfully');
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback to English if translations fail to load
      this.currentLanguage = this.defaultLanguage;
    }
  }

  getTranslation(key, lang = this.currentLanguage) {
    const translation = this.translations[lang];
    if (!translation) {
      console.warn(`No translations found for language: ${lang}`);
>>>>>>> origin/main
      return key;
    }

    // Navigate nested object using dot notation (e.g., "nav.home")
    const keys = key.split('.');
<<<<<<< HEAD
    let value = translations;
=======
    let value = translation;
>>>>>>> origin/main

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    if (value === undefined) {
<<<<<<< HEAD
      console.warn(`Translation key not found: ${key} for language: ${this.currentLanguage}`);
      // Try fallback to default language
      if (this.currentLanguage !== this.defaultLanguage) {
        return this.getFallbackTranslation(key);
=======
      console.warn(`Translation key not found: ${key} for language: ${lang}`);
      // Try fallback to default language
      if (lang !== this.defaultLanguage) {
        return this.getTranslation(key, this.defaultLanguage);
>>>>>>> origin/main
      }
      return key; // Return the key itself if no translation found
    }

    return value;
  }

<<<<<<< HEAD
  // Get fallback translation
  getFallbackTranslation(key) {
    if (!this.translations[this.defaultLanguage]) return key;
    
    const keys = key.split('.');
    let value = this.translations[this.defaultLanguage];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    return value !== undefined ? value : key;
  }

  // Update language switcher buttons
  updateLanguageSwitcher() {
    const buttons = document.querySelectorAll('.lang-button');
    buttons.forEach(button => {
      const lang = button.getAttribute('data-lang');
      button.classList.toggle('active', lang === this.currentLanguage);
    });
  }

  // Update document language attribute
  updateDocumentLanguage() {
    document.documentElement.setAttribute('lang', this.currentLanguage);
    document.body.setAttribute('data-lang', this.currentLanguage);
  }

  // Update document title and meta description
  updateMetaTags() {
    const metaData = this.getTranslation('meta');
    if (!metaData) return;
=======
  applyTranslations() {
    // Update meta tags
    this.updateMetaTags();

    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.getTranslation(key);

      // Handle different types of content
      if (element.hasAttribute('data-i18n-placeholder')) {
        element.placeholder = translation;
      } else if (element.hasAttribute('data-i18n-title')) {
        element.title = translation;
      } else if (element.hasAttribute('data-i18n-alt')) {
        element.alt = translation;
      } else if (element.hasAttribute('data-i18n-html')) {
        // For content that contains HTML (like <br> tags)
        element.innerHTML = translation;
      } else {
        // Default: update text content
        element.textContent = translation;
      }
    });

    // Handle special cases
    this.handleSpecialElements();
  }

  updateMetaTags() {
    const metaData = this.getTranslation('meta');
>>>>>>> origin/main

    // Update page title
    if (metaData.title) {
      document.title = metaData.title;
    }

    // Update meta description
<<<<<<< HEAD
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && metaData.description) {
      metaDesc.setAttribute('content', metaData.description);
=======
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && metaData.description) {
      metaDescription.content = metaData.description;
>>>>>>> origin/main
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && metaData.title) {
<<<<<<< HEAD
      ogTitle.setAttribute('content', metaData.title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && metaData.description) {
      ogDesc.setAttribute('content', metaData.description);
=======
      ogTitle.content = metaData.title;
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && metaData.description) {
      ogDescription.content = metaData.description;
>>>>>>> origin/main
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle && metaData.title) {
<<<<<<< HEAD
      twitterTitle.setAttribute('content', metaData.title);
    }

    const twitterDesc = document.querySelector('meta[property="twitter:description"]');
    if (twitterDesc && metaData.description) {
      twitterDesc.setAttribute('content', metaData.description);
    }
  }

  // Detect browser language
  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // Support only en and ja
    return ['en', 'ja'].includes(langCode) ? langCode : 'en';
  }

  // Get language from URL parameter
  getLanguageFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    return this.supportedLanguages.includes(langParam) ? langParam : null;
  }

  // Store language preference
  storeLanguage(language) {
    try {
      localStorage.setItem('preferred-language', language);
    } catch (error) {
      console.warn('Failed to store language preference:', error);
    }
  }

  // Get stored language preference
  getStoredLanguage() {
    try {
      return localStorage.getItem('preferred-language');
    } catch (error) {
      console.warn('Failed to get stored language preference:', error);
      return null;
    }
  }

  // Set loading state
  setLoadingState(isLoading) {
    document.body.classList.toggle('language-switching', isLoading);
  }

  // Observer pattern for language change events
  addObserver(callback) {
    this.observers.push(callback);
  }

  removeObserver(callback) {
    this.observers = this.observers.filter(obs => obs !== callback);
  }

  notifyObservers(event, data) {
    this.observers.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Observer callback error:', error);
      }
    });
  }

  // Get current language
=======
      twitterTitle.content = metaData.title;
    }

    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription && metaData.description) {
      twitterDescription.content = metaData.description;
    }
  }

  handleSpecialElements() {
    // Handle form validation messages
    this.updateValidationMessages();

    // Handle dynamic content that might be loaded later
    this.observeNewContent();
  }

  updateValidationMessages() {
    const validation = this.getTranslation('validation');
    if (!validation) return;

    // Add validation translations to form elements
    document.querySelectorAll('input[required]').forEach(input => {
      input.addEventListener('invalid', () => {
        if (input.validity.valueMissing) {
          input.setCustomValidity(validation.required);
        } else if (input.validity.typeMismatch && input.type === 'email') {
          input.setCustomValidity(validation.email);
        } else {
          input.setCustomValidity(validation.invalid);
        }
      });

      input.addEventListener('input', () => {
        input.setCustomValidity('');
      });
    });
  }

  observeNewContent() {
    // Observe for dynamically added content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const elements = node.querySelectorAll('[data-i18n]');
            if (elements.length > 0) {
              elements.forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = this.getTranslation(key);
                element.textContent = translation;
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setupLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-button');

    langButtons.forEach(button => {
      const lang = button.getAttribute('data-lang');

      // Add active class to current language
      if (lang === this.currentLanguage) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }

      // Add click event listener
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.changeLanguage(lang);
      });
    });
  }

  async changeLanguage(newLanguage) {
    if (newLanguage === this.currentLanguage) return;

    if (!this.supportedLanguages.includes(newLanguage)) {
      console.error(`Unsupported language: ${newLanguage}`);
      return;
    }

    // Show loading state (optional)
    document.body.classList.add('language-switching');

    try {
      this.currentLanguage = newLanguage;

      // Save preference
      localStorage.setItem('preferred-language', newLanguage);

      // Apply new translations
      this.applyTranslations();

      // Update language switcher
      this.setupLanguageSwitcher();

      // Update page attributes
      this.updatePageAttributes();

      // Trigger custom event for other scripts to listen to
      const event = new CustomEvent('languageChanged', {
        detail: { language: newLanguage }
      });
      document.dispatchEvent(event);

    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      // Remove loading state
      document.body.classList.remove('language-switching');
    }
  }

  updatePageAttributes() {
    // Update html lang attribute
    document.documentElement.lang = this.currentLanguage;

    // Update body class for language-specific styling
    document.body.className = document.body.className.replace(/\blang-\w+\b/g, '');
    document.body.classList.add(`lang-${this.currentLanguage}`);

    // Update direction for RTL languages (if needed in future)
    if (this.isRTL(this.currentLanguage)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }

  isRTL(language) {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(language);
  }

  // Utility method for external use
>>>>>>> origin/main
  getCurrentLanguage() {
    return this.currentLanguage;
  }

<<<<<<< HEAD
  // Get translation helper
  t(key) {
    return this.getTranslation(key);
  }

  // Embedded English translations
  getEmbeddedEnglishTranslations() {
    return {
      "meta": {
        "title": "Messay Eye Tracking",
        "description": "Our apps are developed to improve the daily lives of bedridden patients with ALS, muscular dystrophy, and other serious illnesses, as well as their families and caregivers."
      },
      "nav": {
        "home": "Home",
        "faq": "FAQ",
        "game": "Game",
        "expo": "EXPO",
        "contact": "Contact"
      },
      "hero": {
        "brand": "Messay Tech",
        "title": "Mobile<br><span class=\"italics\">eye tracking</span>",
        "description": "Our apps are developed to improve the daily lives of bedridden patients with ALS, muscular dystrophy, and other serious illnesses, as well as their families and caregivers.",
        "button": "Explore"
      },
      "marquee": {
        "text": "COOK WITH GAZE ||",
        "game": "GAME",
        "expo": "EXPO 2025"
      },
      "apps": {
        "messay": {
          "brand": "Messay",
          "title": "Talk <span class=\"italics\">With your eyes.</span>",
          "description": "Messay is an eye and face controlled app that reads out selected/typed messages using synthetic voice.",
          "popup": {
            "title": "Speak",
            "subtitle": "By Sight"
          }
        },
        "mezic": {
          "brand": "Mezic",
          "title": "Hands-free <span class=\"italics\">Smartphone</span>",
          "description": "Mezic is an app, which enables you to control your entire smartphone with your eyes and face.",
          "popup": {
            "title": "Smart",
            "subtitle": "Swipe"
          }
        },
        "mdk": {
          "brand": "MDK",
          "title": "mESSAY <span class=\"italics\">Development Kit</span>",
          "description": "Messay Development Kit(referred to as MDK) is an SDK to easily integrate your own app and eye-/face-control operations used in Messay.",
          "popup": {
            "title": "Easy",
            "subtitle": "Integration"
          }
        }
      },
      "metrics": {
        "installs": {
          "prefix": "Over",
          "number": "100K",
          "suffix": "Installs"
        },
        "countries": {
          "prefix": "Downloaded in",
          "number": "170+",
          "suffix": "Countries"
        },
        "retention": {
          "prefix": "Customer Retention",
          "number": "92<sup>%</sup>",
          "suffix": "Subscription Ratio on App Store"
        }
      },
      "achievements": {
        "heading": "Achievements",
        "title": "FEATURED IN...",
        "description": "Featured at major tech exhibitions including CES 2024 and VivaTech 2023, recognized for innovation in accessibility technology.",
        "ces": {
          "title": "Featured in CES 2024",
          "description": "Showcased our eye-tracking technology among global tech leaders in Las Vegas"
        },
        "vivatech": {
          "title": "VivaTech 2024 Featured Startup",
          "description": "Selected to present our innovative accessibility solutions at Europe's largest startup event"
        },
        "yomiuri": {
          "title": "Featured in The Yomiuri Shimbun",
          "description": "Messay was featured in the Yomiuri Shimbun, Japan's largest newspaper, for its innovative eye-tracking communication app."
        }
      },
      "testimonials": {
        "review1": {
          "text": "A unique and excellent app with no equivalent",
          "name": "Шпэндикс",
          "country": "Russia"
        },
        "review2": {
          "text": "One of the best app I have ever used!",
          "name": "Logan Wrigrh",
          "country": "USA"
        },
        "review3": {
          "text": "This app is really useful so you do not get tired from scrolling TikTok!",
          "name": "Moldi ARKAPUTRA",
          "country": "INDONESIA"
        },
        "review4": {
          "text": "The idea and functionality are great. However, the eye tracking needs improvement, since sometimes just looking at the centre of the screen makes me loose sight of the phone.",
          "name": "Eduard Flavian Farcas",
          "country": "Italy"
        },
        "review5": {
          "text": "I came across an app for the first time that can be operated just by opening and closing my eyes.",
          "name": "anonymous",
          "country": "Japan"
        },
        "review6": {
          "text": "Messay is truly amazing for people who cannot speak. I hope it more well-known.",
          "name": "Anonymous",
          "country": "Belgium"
        }
      },
      "expo": {
        "heading": "EXPO Details",
        "subheading": "Use can find us in the osaka expo Health care pavilion",
        "event": "World Expo 2025",
        "title": "Osaka World Expo 2025",
        "dates": "Visit us at Osaka World Expo 2025 Health care Pavilion<br> from July 29/25 to August 4/25",
        "pavilion": {
          "title": "Pavilion information",
          "description": "Learn about our innovative healthcare solutions and interactive demonstrations at the Osaka World Expo 2025. Visit our booth to experience the future of healthcare technology.",
          "button": "View Map"
        },
        "location": {
          "title": "Find Us here",
          "description": "Located near the East Gate entrance, our interactive exhibits showcase the future of personalised Medicare and wellness technology.",
          "button": "View Map"
        },
        "button": "expo 2025"
      },
      "faq": {
        "heading": "FAQs",
        "title": "Have Questions?",
        "description": "We're committed to making your experience as smooth and straightforward as possible.",
        "questions": {
          "location": {
            "question": "Where can I find MESSAY at the Osaka World Expo 2025?",
            "answer": "MESSAY will be exhibiting at the Healthcare Pavilion located near the East Gate entrance. Look for our booth marked with the MESSAY logo as shown on our interactive map. Our staff will be available to demonstrate our eye-tracking technology throughout the Expo period."
          },
          "products": {
            "question": "What MESSAY products will be demonstrated at the Expo?",
            "answer": "At our exhibit, visitors will be able to experience a shopping game that uses a state-of-the-art version of the eye tracking technology used in MESSAY, rather than the MESSAY app itself."
          },
          "learn_more": {
            "question": "How can I learn more about MESSAY's technology before visiting the Expo?",
            "answer": "You can download our applications from the App Store or Google Play Store to try them before your visit. Our website offers comprehensive operation guide videos and tuning guides to understand how our eye-tracking technology works. For specific questions, you can contact us through the Contact form on our website."
          }
        }
      },
      "contact": {
        "title": "Request a <span class=\"italics\">Free Consultation</span>",
        "description": "Discover how Messay can empower communication for you or your loved ones!",
        "form": {
          "email_placeholder": "Enter your email",
          "submit": "Submit",
          "success": "Thank you! Your submission has been received!",
          "error": "Oops! Something went wrong while submitting the form.",
          "recaptcha_error": "Please complete the reCAPTCHA verification."
        }
      },
      "footer": {
        "tagline": "Talk With Your Eyes!",
        "pages": "Pages",
        "main": "Main",
        "links": {
          "home": "Home",
          "game": "Game",
          "privacy": "Privacy Policy",
          "eula": "EULA",
          "contact": "Contact Us",
          "expo": "EXPO 2025",
          "apps": "Our Apps"
        },
        "copyright": "NDK Ink. © 2025 All Rights Reserved."
      },
      "game": {
        "meta": {
          "title": "Messay Expo Game",
          "description": "Experience the future if shopping with eye-tracking technology at Osaka World Expo 2025"
        },
        "hero": {
          "subtitle": "Future ASPECTS",
          "title": "sHOP USING YOUR GAZE",
          "intro": {
            "title": "The Future of Shopping is Watching You",
            "description": "Eye movement remains an underutilized source of information and is one of the few functions that patients with limited mobility can retain. Traditional eye-tracking required expensive equipment, but by 2050, it will be available on any device with a built-in camera. Eye control may become as natural as using hands or voice, not only as a communication tool for those with mobility impairments but also in everyday life. This exhibit features a \"Eye Control Shopping\" offering a glimpse into a future where eye control is an everyday convenience."
          }
        },
        "howToOperate": {
          "title": "How to Operate ?",
          "steps": {
            "choose": {
              "title": "Choose",
              "description": " Choose the item by looking it."
            },
            "select": {
              "title": "Select",
              "description": "Blink for selecting the item."
            },
            "nextPage": {
              "title": "Next-page",
              "description": "Gaze at the edges of the screen to move to the next screen."
            }
          }
        },
        "rules": {
          "title": "Rules:",
          "list": [
            "🎯 Choose ingredients for 3 dishes.",
            "🎯 Each dish consists of 2 ingredients.",
            "🎯 One ingredient is main and another one is optional.",
            "🎯 Win medals based on the dishes you make."
          ]
        },
        "recipes": {
          "title": "Recipes",
          "sushi": {
            "title": "Sushi",
            "dishes": {
              "redClam": {
                "main": "Rice",
                "secondary": "Red Clam",
                "result": "Red Clam Sushi"
              },
              "egg": {
                "main": "Rice",
                "secondary": "Egg",
                "result": "Egg Sushi"
              },
              "tuna": {
                "main": "Rice",
                "secondary": "Tuna Fish",
                "result": "Akami / Chutoro Sushi"
              },
              "shrimp": {
                "main": "Rice",
                "secondary": "Shrimp",
                "result": "Steamed Shrimp / Sweet Shrimp Sushi"
              }
            }
          },
          "taco": {
            "title": "Taco",
            "dishes": {
              "spinach": {
                "main": "Corn",
                "secondary": "Spinach",
                "result": "Spinach Tacos"
              },
              "beans": {
                "main": "Corn",
                "secondary": "Beans",
                "result": "Chickpea Tacos"
              },
              "tuna": {
                "main": "Corn",
                "secondary": "Tuna Fish",
                "result": "Tuna Tacos"
              },
              "meat": {
                "main": "Corn",
                "secondary": "Meat",
                "result": "Chorizo Tacos"
              }
            }
          },
          "curry": {
            "title": "Curry",
            "dishes": {
              "spinach": {
                "main": "Hot pepper",
                "secondary": "Spinach",
                "result": "Spinach Curry"
              },
              "beans": {
                "main": "Hot Pepper",
                "secondary": "Beans",
                "result": "Beans Curry"
              },
              "meat": {
                "main": "Hot Pepper",
                "secondary": "Shrimp",
                "result": "Shrimp Curry"
              }
            }
          },
          "sandwiches": {
            "title": "Sandwiches",
            "dishes": {
              "tomato": {
                "main": "Bread",
                "secondary": "Tomato",
                "result": "Egg Sandwich"
              },
              "egg": {
                "main": "Bread",
                "secondary": "Egg",
                "result": "Egg Sandwich"
              },
              "tuna": {
                "main": "Bread",
                "secondary": "Tuna Fish",
                "result": "Tuna Mayo Sandwich"
              },
              "pork": {
                "main": "Bread",
                "secondary": "Pork",
                "result": "Tonkatsu Sandwich"
              }
            }
          },
          "pasta": {
            "title": "pasta",
            "dishes": {
              "tomato": {
                "main": "Pasta",
                "secondary": "Tomato",
                "result": "Napolitan Pasta"
              },
              "egg": {
                "main": "Pasta",
                "secondary": "Egg",
                "result": "Carbonara Pasta"
              },
              "clams": {
                "main": "Pasta",
                "secondary": "Clams",
                "result": "Vongole Bianco"
              },
              "spinach": {
                "main": "Pasta",
                "secondary": "Spinach",
                "result": "Spinach Pasta"
              }
            }
          }
        },
        "medals": {
          "title": "achievements",
          "list": {
            "focusedVariety": {
              "title": "Focused on Variety",
              "description": "All choices are different"
            },
            "nutritionallyBalanced": {
              "title": "Nutritionally Balanced",
              "description": "Includes at least one vitamin and one protein"
            },
            "superHealthy": {
              "title": "Super Healthy",
              "description": "All about vitamins"
            },
            "bodyBuilder": {
              "title": "Body Builder",
              "description": "All about Protein"
            },
            "pastaMaestro": {
              "title": "Pasta Maestro",
              "description": "All pasta dishes"
            },
            "sushiChef": {
              "title": "Sushi Chef",
              "description": "All Sushi"
            },
            "tacoEsteta": {
              "title": "Taco Esteta",
              "description": "All Tacos"
            },
            "sandwichEarl": {
              "title": "Sandwich Earl",
              "description": "All Sandwiches"
            },
            "curryMaharaja": {
              "title": "Curry Maharaja",
              "description": "All Curries"
            },
            "selectiveEater": {
              "title": "Selective Eater",
              "description": "All Exactly the same menu"
            },
            "fisherman": {
              "title": "Fisherman",
              "description": "Only selecting seafood: Tuna, Shrimp, Clams"
            },
            "farmer": {
              "title": "Farmer",
              "description": "Only selecting vegetables: Tomato, Beans, Spinach"
            },
            "livestockFarmer": {
              "title": "Livestock Farmer",
              "description": "Only selecting livestock: Meat, Egg"
            },
            "humptyDumpty": {
              "title": "Humpty Dumpty",
              "description": "Selecting only eggs from different dishes"
            },
            "maestoro": {
              "title": "Maes\"Toro\"",
              "description": "Selecting only tuna from different dishes"
            },
            "popeye": {
              "title": "Popeye",
              "description": "Selecting only spinach from different dishes"
            },
            "cowboy": {
              "title": "Cowboy",
              "description": "Selecting only meat from different dishes"
            },
            "quickdecisionmaker": {
              "title": "Quick Decision Maker",
              "description": "Selecting three dishes within 45 seconds"
            },
            "laidBackSteady": {
              "title": "Laid-back and Steady",
              "description": "Taking time until the final tim limit"
            },
            "uniquePalate": {
              "title": "Unique Palate",
              "description": "Getting three or more answers wrong on the first question"
            },
            "refinedpalate": {
              "title": "Refined Palate",
              "description": "Getting all answers correct on the first question"
            }
          }
        },
        "endlessPossibilities": {
          "title": "Endless Possibilities",
          "features": {
            "realtimeAnalysis": {
              "title": "Real-Time Attention Analysis",
              "description": "Eye tracking reveals which products catch your attention first, how long you gaze at items, and the sequence in which you view them. This data helps retailers measure purchase intention with unprecedented accuracy, replacing guesswork with concrete visual evidence of shopper behavior."
            },
            "multiPersonTracking": {
              "title": "Multi-Person Anonymous Tracking",
              "description": "Modern retail eye tracking can monitor multiple shoppers simultaneously without privacy concerns. Using 3D cameras placed up to 4.3 feet away, stores can track real customers in their natural shopping environment while remaining GDPR-compliant-no wearable devices required."
            },
            "vrShopping": {
              "title": "Virtual Reality Shopping",
              "description": "Brands like Kellogg's are pioneering VR merchandising with eye tracking, allowing consumers to navigate simulated stores and interact with products. This technology has already challenged assumptions about product placement, revealing that lower shelves can be 18% more effective for certain products than previously believed."
            },
            "websiteOptimization": {
              "title": "Website Optimization",
              "description": "For online retailers, eye tracking software identifies friction points and confusion in the customer journey that traditional click data misses. This technology reveals true attention patterns, helping e-commerce sites optimize layouts and prevent customers from abandoning their shopping carts with a single click."
            },
            "emotionDetection": {
              "title": "Emotion and Intention Detection",
              "description": "Advanced sensor fusion now allows eye tracking to synchronize with physiological signals, revealing not just what shoppers look at, but their mental workload, stress levels, and emotional states when viewing products-creating a comprehensive picture of the shopping experience."
            },
            "immersiveAR": {
              "title": "Immersive AR Shopping",
              "description": "The next generation of augmented reality shopping will incorporate eye tracking to eliminate graphic distortions and create truly immersive experiences. As you browse virtual products, the technology will adjust displays based on where you're actually looking, not just where your head is pointing."
            }
          }
        }
      },
      "common": {
        "explore": "Explore",
        "loading": "Loading...",
        "error": "Error",
        "close": "Close",
        "open": "Open",
        "submit": "Submit",
        "cancel": "Cancel"
      },
      "validation": {
        "required": "This field is required",
        "email": "Please enter a valid email address",
        "invalid": "Please check your input"
      }
    };
  }

  // Embedded Japanese translations
  getEmbeddedJapaneseTranslations() {
    return {
      "meta": {
        "title": "Messay 視線トラッキング",
        "description": "私たちのアプリは、ALS、筋ジストロフィー、その他の重篤な疾患を患う寝たきりの患者様とそのご家族、介護者の日常生活を改善するために開発されました。"
      },
      "nav": {
        "home": "ホーム",
        "faq": "よくある質問",
        "game": "ゲーム",
        "expo": "万博",
        "contact": "お問い合わせ"
      },
      "hero": {
        "brand": "Messay Tech",
        "title": "モバイル<br><span class=\"italics\">視線トラッキング</span>",
        "description": "私たちのアプリは、ALS、筋ジストロフィー、その他の重篤な疾患を患う寝たきりの患者様とそのご家族、介護者の日常生活を改善するために開発されました。",
        "button": "詳細を見る"
      },
      "marquee": {
        "text": "COOK WITH GAZE ||",
        "game": "GAME",
        "expo": "EXPO 2025"
      },
      "apps": {
        "messay": {
          "brand": "Messay",
          "title": "視線で<span class=\"italics\">話す</span>",
          "description": "Messayは視線と顔の動きだけで操作できるアプリです。視線と顔の動きで選択・入力されたメッセージを合成音声で読み上げます。",
          "popup": {
            "title": "視線で",
            "subtitle": "話す"
          }
        },
        "mezic": {
          "brand": "Mezic",
          "title": "ハンズフリーで<span class=\"italics\">スマホを操作</span>",
          "description": "Mezicは視線と顔の動きを使ってスマートフォン全体を操作できるようにするアクセシビリティツールのアプリです。",
          "popup": {
            "title": "手を使わず",
            "subtitle": "スワイプ"
          }
        },
        "mdk": {
          "brand": "MDK",
          "title": "MESSAY <span class=\"italics\">開発キット</span>",
          "description": "Messay Development Kit（MDK）は、Messayで使用される視線・顔トラッキングを利用した操作を、独自のアプリに簡単に統合するためのSDKです。",
          "popup": {
            "title": "簡単に",
            "subtitle": "統合"
          }
        }
      },
      "metrics": {
        "installs": {
          "prefix": "",
          "number": "10万",
          "suffix": "回以上のインストール"
        },
        "countries": {
          "prefix": "",
          "number": "170以上",
          "suffix": "の国でダウンロード"
        },
        "retention": {
          "prefix": "顧客維持率",
          "number": "92<sup>%</sup>",
          "suffix": "App Storeでの継続率"
        }
      },
      "achievements": {
        "heading": "実績",
        "title": "掲載実績...",
        "description": "CESやVivaTechなどの主要な技術展示会に参加し、革新的なアクセシビリティ技術として認められました。",
        "ces": {
          "title": "CES 2024で紹介",
          "description": "ラスベガスで、世界の先端技術が集まる中で弊社の視線トラッキング技術を紹介しました。"
        },
        "vivatech": {
          "title": "VivaTech 2024 注目のスタートアップ",
          "description": "ヨーロッパ最大のスタートアップイベントで、革新的なアクセシビリティソ技術として展示しました。"
        },
        "yomiuri": {
          "title": "読売新聞に掲載",
          "description": "革新的な視線追跡のコミュニケーションアプリとして、日本最大手の新聞である読売新聞にMessayを取り上げていただきました。"
        }
      },
      "testimonials": {
        "review1": {
          "text": "他に類を見ないユニークで優秀なアプリ",
          "name": "Шпэндикс",
          "country": "ロシア"
        },
        "review2": {
          "text": "今まで使った中で最高のアプリの一つです！",
          "name": "Logan Wrigrh",
          "country": "アメリカ"
        },
        "review3": {
          "text": "このアプリは本当に便利で、TikTokのスクロールで疲れることがありません！",
          "name": "Moldi ARKAPUTRA",
          "country": "インドネシア"
        },
        "review4": {
          "text": "アイデアと機能性は素晴らしいです。ただし、画面の中央を見ているだけでポインターを見失うことがあるため、視線追跡の改善が必要です。",
          "name": "Eduard Flavian Farcas",
          "country": "イタリア"
        },
        "review5": {
          "text": "目の開閉だけで操作できるアプリに初めて出会いました。",
          "name": "匿名",
          "country": "日本"
        },
        "review6": {
          "text": "Messayは話すことができない人にとって本当に素晴らしいです。もっと知られるようになってほしいです。",
          "name": "匿名",
          "country": "ベルギー"
        }
      },
      "expo": {
        "heading": "万博詳細",
        "subheading": "大阪万博ヘルスケアパビリオン（リボーンチャレンジブース）に出展いたします。",
        "event": "EXPO 2025",
        "title": "大阪関西万博 2025",
        "dates": "2025年7月29日から8月4日まで<br>大阪万博2025ヘルスケアパビリオンでお会いしましょう",
        "pavilion": {
          "title": "パビリオン情報",
          "description": "大阪万博2025で、私たちの革新的なモバイル視線トラッキング技術をご体験ください。私たちのブースでは、視線トラッキングを活用したお買い物ゲームを展示しています。",
          "button": "地図を見る"
        },
        "location": {
          "title": "場所はこちら",
          "description": "東ゲート入口近くの、大阪ヘルスケアパビリオンです。",
          "button": "地図を見る"
        },
        "button": "EXPO 2025"
      },
      "faq": {
        "heading": "よくある質問",
        "title": "ご質問はありますか？",
        "description": "お客様の体験を可能な限りスムーズで分かりやすいものにできるようサポートいたします。",
        "questions": {
          "location": {
            "question": "大阪万博2025でMESSAYはどこで見つけることができますか？",
            "answer": "MESSAYは東ゲート入口近くにあるヘルスケアパビリオンで展示を行います。インタラクティブマップに表示されているMESSAYロゴが目印のブースをお探しください。万博期間中、視線トラッキング技術を活用したゲームを体験いただけます。"
          },
          "products": {
            "question": "万博ではどのMESSAY製品がデモンストレーションされますか？",
            "answer": "弊社の展示では、MESSAYアプリそのものではなく、MESSAYで使われている視線トラッキング技術の最先端のバージョンを使った、買い物ゲームをご体験いただけます。"
          },
          "learn_more": {
            "question": "万博を訪れる前にMESSAYの技術について詳しく知るにはどうすればよいですか？",
            "answer": "App StoreやGoogle Play Storeからアプリをダウンロードして、訪問前にお試しいただけます。私たちのウェブサイトでは、視線トラッキング技術の仕組みを理解するための包括的な操作説明のビデオを提供しています。具体的なご質問については、ウェブサイトのお問い合わせフォームからお気軽にご連絡ください。"
          }
        }
      },
      "contact": {
        "title": "<span class=\"italics\">お問い合わせ</span>",
        "description": "Messayをはじめとする弊社のサービスについて、なんでもお問い合わせください！",
        "form": {
          "email_placeholder": "メールアドレスを入力してください",
          "submit": "送信",
          "success": "ありがとうございます！お問い合わせを受け付けました！",
          "error": "申し訳ありません！フォームの送信中にエラーが発生しました。",
          "recaptcha_error": "reCAPTCHA認証を完了してください。"
        }
      },
      "footer": {
        "tagline": "視線で会話しよう",
        "pages": "ページ",
        "main": "メイン",
        "links": {
          "home": "ホーム",
          "game": "ゲーム",
          "privacy": "プライバシーポリシー",
          "eula": "利用規約",
          "contact": "お問い合わせ",
          "expo": "万博 2025",
          "apps": "私たちのアプリ"
        },
        "copyright": "NDK株式会社 © 2025 All Rights Reserved."
      },
      "game": {
        "meta": {
          "title": "Messay 視線でお買い物ゲーム",
          "description": "大阪関西万博2025で、視線トラッキング技術を使った未来のショッピングを体験しましょう！"
        },
        "hero": {
          "subtitle": "未来の技術",
          "title": "視線でショッピング",
          "intro": {
            "title": "お買い物の未来を垣間見ましょう",
            "description": "目の動きはまだまだ活用されていない情報源であり、体が動かせない患者様でも目だけは動かし続けられると言われています。従来の視線トラッキングには高価な機材が必要でしたが、2050年にはカメラを内蔵するあらゆるデバイスで視線トラッキングが利用可能に。体が動かせない方のコミュニケーション手段としてはもちろん、手や音声での操作と同じ感覚で、視線での操作を日常生活の中で当たり前に使っているかもしれません。本展示では、視線での操作が日常化した未来を体験できる「視線でお買い物ゲーム」をご用意しています。"
          }
        },
        "howToOperate": {
          "title": "操作方法は？",
          "steps": {
            "choose": {
              "title": "選択",
              "description": "目を動かすと、カーソルが視線に追従します。"
            },
            "select": {
              "title": "決定",
              "description": "まばたきでアイテムを選択します。"
            },
            "nextPage": {
              "title": "ページめくり",
              "description": "目を右(左)に大きく動かすと、動かした方向のページに移動します。"
            }
          }
        },
        "rules": {
          "title": "ルール：",
          "list": [
            "🎯 3つの料理のための食材を選んでいただきます。",
            "🎯 各料理は2つの食材で構成されます。",
            "🎯 1つは必須の食材、もう1つはお好みの食材です。",
            "🎯 つくった料理に基づいて、メダルを獲得できます。"
          ]
        },
        "recipes": {
          "title": "レシピ",
          "sushi": {
            "title": "寿司",
            "dishes": {
              "redClam": {
                "main": "ご飯",
                "secondary": "貝",
                "result": "貝のお寿司"
              },
              "egg": {
                "main": "ご飯",
                "secondary": "卵",
                "result": "卵寿司"
              },
              "tuna": {
                "main": "ご飯",
                "secondary": "マグロ",
                "result": "赤身・中トロ寿司"
              },
              "shrimp": {
                "main": "ご飯",
                "secondary": "エビ",
                "result": "蒸しエビ・甘エビ寿司"
              }
            }
          },
          "taco": {
            "title": "タコス",
            "dishes": {
              "spinach": {
                "main": "コーン",
                "secondary": "ほうれん草",
                "result": "ほうれん草タコス"
              },
              "beans": {
                "main": "コーン",
                "secondary": "豆",
                "result": "ひよこ豆タコス"
              },
              "tuna": {
                "main": "コーン",
                "secondary": "マグロ",
                "result": "ツナタコス"
              },
              "meat": {
                "main": "コーン",
                "secondary": "肉",
                "result": "チョリソータコス"
              }
            }
          },
          "curry": {
            "title": "カレー",
            "dishes": {
              "spinach": {
                "main": "唐辛子",
                "secondary": "ほうれん草",
                "result": "ほうれん草カレー"
              },
              "beans": {
                "main": "唐辛子",
                "secondary": "豆",
                "result": "豆カレー"
              },
              "meat": {
                "main": "唐辛子",
                "secondary": "肉",
                "result": "バターチキンカレー"
              },
              "shrimp": {
                "main": "唐辛子",
                "secondary": "エビ",
                "result": "エビカレー"
              }
            }
          },
          "sandwiches": {
            "title": "サンドイッチ",
            "dishes": {
              "tomato": {
                "main": "パン",
                "secondary": "トマト",
                "result": "BLTサンド"
              },
              "egg": {
                "main": "パン",
                "secondary": "卵",
                "result": "卵サンド"
              },
              "tuna": {
                "main": "パン",
                "secondary": "マグロ",
                "result": "ツナマヨサンド"
              },
              "pork": {
                "main": "パン",
                "secondary": "豚肉",
                "result": "とんかつサンド"
              }
            }
          },
          "pasta": {
            "title": "パスタ",
            "dishes": {
              "tomato": {
                "main": "パスタ",
                "secondary": "トマト",
                "result": "ナポリタンパスタ"
              },
              "egg": {
                "main": "パスタ",
                "secondary": "卵",
                "result": "カルボナーラパスタ"
              },
              "clams": {
                "main": "パスタ",
                "secondary": "あさり",
                "result": "ボンゴレビアンコ"
              },
              "spinach": {
                "main": "パスタ",
                "secondary": "ほうれん草",
                "result": "ほうれん草パスタ"
              }
            }
          }
        },
        "medals": {
          "title": "実績",
          "list": {
            "focusedVariety": {
              "title": "バラエティ重視",
              "description": "すべての選択が異なる"
            },
            "nutritionallyBalanced": {
              "title": "栄養バランス",
              "description": "少なくとも1つのビタミンと1つのタンパク質を含む"
            },
            "superHealthy": {
              "title": "スーパーヘルシー",
              "description": "すべてビタミン源を選択"
            },
            "bodyBuilder": {
              "title": "ボディビルダー",
              "description": "すべてタンパク質を選択"
            },
            "pastaMaestro": {
              "title": "パスタマエストロ",
              "description": "すべてパスタ"
            },
            "sushiChef": {
              "title": "寿司職人",
              "description": "すべて寿司"
            },
            "tacoEsteta": {
              "title": "タコス愛好家",
              "description": "すべてタコス"
            },
            "sandwichEarl": {
              "title": "サンドイッチ伯爵",
              "description": "すべてサンドイッチ"
            },
            "curryMaharaja": {
              "title": "カレー王",
              "description": "すべてカレー"
            },
            "selectiveEater": {
              "title": "一途な人",
              "description": "すべて全く同じメニュー"
            },
            "fisherman": {
              "title": "漁師",
              "description": "魚介類のみ選択：マグロ、エビ、あさり"
            },
            "farmer": {
              "title": "農家",
              "description": "野菜のみ選択：トマト、豆、ほうれん草"
            },
            "livestockFarmer": {
              "title": "畜産家",
              "description": "畜産物のみ選択：肉、卵"
            },
            "humptyDumpty": {
              "title": "ハンプティダンプティ",
              "description": "異なる料理から卵のみ選択"
            },
            "maestoro": {
              "title": "マエス「トロ」",
              "description": "異なる料理からマグロのみ選択"
            },
            "popeye": {
              "title": "ポパイ",
              "description": "異なる料理からほうれん草のみ選択"
            },
            "cowboy": {
              "title": "カウボーイ",
              "description": "異なる料理から肉のみ選択"
            },
            "quickdecisionmaker": {
              "title": "すばやい決断",
              "description": "45秒以内に3つの料理を選択"
            },
            "laidBackSteady": {
              "title": "のんびり屋さん",
              "description": "制限時間ギリギリまで時間をかける"
            },
            "uniquePalate": {
              "title": "ユニークな味覚",
              "description": "必須食材のクイズで3つ以上間違える"
            },
            "refinedpalate": {
              "title": "洗練された味覚",
              "description": "必須食材のクイズですべて正解"
            }
          }
        },
        "endlessPossibilities": {
          "title": "無限の可能性",
          "features": {
            "realtimeAnalysis": {
              "title": "リアルタイム注意分析",
              "description": "視線トラッキングは、どの商品が最初に注意を引くか、アイテムをどのくらい見つめるか、どの順序で見るかを明らかにします。このデータは、推測に代わって具体的な視覚的証拠による購買意欲を前例のない精度で測定することを可能にします。"
            },
            "multiPersonTracking": {
              "title": "複数人匿名トラッキング",
              "description": "現代の小売視線トラッキングは、プライバシーの懸念なしに複数の買い物客を同時に監視できます。数メートル離れた場所に設置された2Dカメラを使用して、ウェアラブルデバイスを必要とせず、GDPR準拠を保ちながら自然なショッピング環境で実際の顧客を追跡できます。"
            },
            "vrShopping": {
              "title": "バーチャルショッピング",
              "description": "ケロッグなどのブランドは、視線トラッキングを使用したVRマーチャンダイジングを先駆けており、消費者がシミュレートされた店舗をナビゲートし、商品と対話できるようにしています。この技術は、商品配置に関する仮定にすでに挑戦しており、特定の商品については下の棚が従来考えられていたよりも18%効果的であることを明らかにしています。"
            },
            "websiteOptimization": {
              "title": "ウェブサイト最適化",
              "description": "オンライン小売業者にとって、視線トラッキングソフトウェアは、従来のクリックデータが見逃す顧客体験の摩擦点と混乱を特定します。この技術は真の注意パターンを明らかにし、eコマースサイトがレイアウトを最適化し、顧客がワンクリックでショッピングカートを放棄することを防ぐのに役立ちます。"
            },
            "emotionDetection": {
              "title": "感情と意図の検出",
              "description": "高度なセンサー融合により、視線トラッキングを生理学的信号と同期させることが可能になり、買い物客が何を見ているかだけでなく、商品を見ているときの精神的負荷、ストレスレベル、感情状態を明らかにし、ショッピング体験の包括的な画像を作成します。"
            },
            "immersiveAR": {
              "title": "没入型ARショッピング",
              "description": "次世代の拡張現実ショッピングは、視線トラッキングを組み込んでグラフィックの歪みを排除し、真に没入的な体験を創造します。バーチャル商品を閲覧する際、技術は頭の向きではなく、実際に見ている場所に基づいてディスプレイを調整します。"
            }
          }
        }
      },
      "common": {
        "explore": "詳細を見る",
        "loading": "読み込み中...",
        "error": "エラー",
        "close": "閉じる",
        "open": "開く",
        "submit": "送信",
        "cancel": "キャンセル"
      },
      "validation": {
        "required": "この項目は必須です",
        "email": "有効なメールアドレスを入力してください",
        "invalid": "入力内容をご確認ください"
      }
    };
  }
}

// Create singleton instance
const i18n = new I18nManager();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => i18n.initialize());
} else {
  i18n.initialize();
}

// Setup language switcher event listeners
document.addEventListener('DOMContentLoaded', () => {
  const langButtons = document.querySelectorAll('.lang-button');
  langButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const language = button.getAttribute('data-lang');
      if (language) {
        i18n.switchLanguage(language);
      }
    });
  });
});

// Export for global access
=======
  // Utility method to get translation from external scripts
  t(key) {
    return this.getTranslation(key);
  }
}

// Initialize the i18n system
const i18n = new I18n();

// Make it globally available
>>>>>>> origin/main
window.i18n = i18n;