/**
 * Internationalization (i18n) module for Stardew Profits.
 *
 * Public API:
 *   i18n.t("ui.season")          → translated string
 *   i18n.loadLanguage("en")      → load English and re-apply all translations
 *   i18n._ready                  → Promise resolved after the first language load
 */
var i18n = (function () {
  "use strict";

  var _translations = {};
  var _currentLang = "en";
  var _readyResolve = null;

  /** Promise resolved once the first language file has been loaded. */
  var _ready = new Promise(function (resolve) {
    _readyResolve = resolve;
  });

  // ─── Core helpers ──────────────────────────────────────────────────────────

  /**
   * Return a translated string by dot-separated key, e.g. "ui.season".
   * Falls back to the key itself if no translation is found.
   */
  function t(key) {
    var parts = key.split(".");
    var obj = _translations;
    for (var i = 0; i < parts.length; i++) {
      if (obj == null || typeof obj !== "object") return key;
      obj = obj[parts[i]];
    }
    return obj !== undefined && obj !== null ? String(obj) : key;
  }

  /**
   * Walk the DOM and fill every [data-i18n] element with its translation.
   * Elements that also have [data-i18n-colon] get a colon appended ("Сезон:").
   */
  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var text = t(key);
      if (el.hasAttribute("data-i18n-colon")) text += ":";
      el.textContent = text;
    });

    // RTL support (Arabic, Hebrew, etc.)
    document.documentElement.setAttribute(
      "dir",
      _translations.direction === "rtl" ? "rtl" : "ltr",
    );

    // Keep the selector in sync with the active language
    var sel = document.getElementById("select_language");
    if (sel) sel.value = _currentLang;
  }

  // ─── Language loading ──────────────────────────────────────────────────────

  /**
   * Fetch a language file and apply it to the UI.
   *
   * @param {string}   lang      Language code: "en", "ru", …
   * @param {Function} [callback] Called (with no arguments) after translations
   *                              are applied – use this to trigger a graph refresh.
   */
  function loadLanguage(lang, callback) {
    // Cache-bust so that edits to JSON files are picked up immediately
    fetch("i18n/" + lang + ".json?v=" + Date.now())
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        _translations = data;
        _currentLang = lang;
        try {
          localStorage.setItem("stardew_lang", lang);
        } catch (e) {
          /* private browsing */
        }
        applyTranslations();
        if (typeof callback === "function") callback();
        // Resolve the ready-promise (no-op on subsequent calls)
        if (_readyResolve) {
          _readyResolve();
          _readyResolve = null;
        }
      })
      .catch(function (e) {
        console.error('[i18n] Could not load language "' + lang + '":', e);
        // Don't leave the app stuck – resolve the promise even on error
        if (_readyResolve) {
          _readyResolve();
          _readyResolve = null;
        }
      });
  }

  // ─── Initialisation ────────────────────────────────────────────────────────

  /** Called automatically on DOMContentLoaded. */
  function init() {
    var saved;
    try {
      saved = localStorage.getItem("stardew_lang");
    } catch (e) {
      /* ok */
    }
    loadLanguage(saved || "en");
  }

  document.addEventListener("DOMContentLoaded", init);

  // ─── Public interface ──────────────────────────────────────────────────────

  return {
    /** Get a translated string. */
    t: t,
    /** Load a language file and refresh the UI. */
    loadLanguage: loadLanguage,
    /** Re-apply the current translations (useful after dynamic DOM changes). */
    applyTranslations: applyTranslations,
    /**
     * Promise that resolves once the first language file has loaded.
     * Use this to defer graph initialisation so the first render is already
     * in the correct language:
     *
     *   i18n._ready.then(initial);
     */
    _ready: _ready,
  };
})();
