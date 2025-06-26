class I18n {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {};
    this.defaultLanguage = 'en';
    this.supportedLanguages = ['en', 'ja'];

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
      return key;
    }

    // Navigate nested object using dot notation (e.g., "nav.home")
    const keys = key.split('.');
    let value = translation;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    if (value === undefined) {
      console.warn(`Translation key not found: ${key} for language: ${lang}`);
      // Try fallback to default language
      if (lang !== this.defaultLanguage) {
        return this.getTranslation(key, this.defaultLanguage);
      }
      return key; // Return the key itself if no translation found
    }

    return value;
  }

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

    // Update page title
    if (metaData.title) {
      document.title = metaData.title;
    }

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && metaData.description) {
      metaDescription.content = metaData.description;
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && metaData.title) {
      ogTitle.content = metaData.title;
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && metaData.description) {
      ogDescription.content = metaData.description;
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle && metaData.title) {
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
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Utility method to get translation from external scripts
  t(key) {
    return this.getTranslation(key);
  }
}

// Initialize the i18n system
const i18n = new I18n();

// Make it globally available
window.i18n = i18n;