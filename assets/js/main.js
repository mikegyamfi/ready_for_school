/* ==========================================================================
   The Ready for School Experience — interactions
   No libraries, no build step.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     DESTINATIONS live in index.html, not here, so the page still works with
     JavaScript disabled:
       .js-reserve (5 links) -> https://form.jotform.com/203414478493561
       .js-pay     (2 links) -> https://paystack.com/pay/d53mhkvkh4
     To change either, find-and-replace the URL across index.html.
     ------------------------------------------------------------------------ */

  /* ------------------------------------------------------- Sticky header */

  var header = document.getElementById('site-header');

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --------------------------------------------------------- Mobile menu */

  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('primary-nav');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Close on link tap, Esc, or when the layout leaves mobile.
  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  var desktopMQ = window.matchMedia('(min-width: 861px)');
  var onBreakpoint = function (event) { if (event.matches) setMenu(false); };
  if (desktopMQ.addEventListener) {
    desktopMQ.addEventListener('change', onBreakpoint);
  } else if (desktopMQ.addListener) {
    desktopMQ.addListener(onBreakpoint); // Safari < 14
  }

  /* ---------------------------------------------- Anchor scroll offset */

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;

    var id = link.getAttribute('href');
    if (id === '#' || id.length < 2) {
      // Still-unset placeholder (the social icons) — don't jump to the top.
      event.preventDefault();
      return;
    }

    var target = document.querySelector(id);
    if (!target) return;

    event.preventDefault();
    var offset = header.offsetHeight + 12;
    var top = target.getBoundingClientRect().top + window.scrollY - offset;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ----------------------------------------------------- Scroll reveal */

  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && reveals.length) {
    // Only hide things once we know we can reveal them again.
    document.documentElement.classList.add('js-reveal');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(reveals, function (el) { observer.observe(el); });
  }

  /* ------------------------- Hide the sticky bar once you reach the form

     The mobile bar only says "Reserve Your Child's Place", which scrolls to
     #register. Once #register is on screen that button is a no-op, so get it
     out of the way and give the form back the space.
     ------------------------------------------------------------------- */

  var mobileCta = document.querySelector('.mobile-cta');
  var registerSection = document.getElementById('register');

  if (mobileCta && registerSection && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      mobileCta.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0 }).observe(registerSection);
  }

  /* ------------------------------------------- Embedded JotForm resize

     The form posts its height to us so the iframe can grow to fit instead of
     scrolling inside a fixed box. Two message shapes are in the wild:
       "setHeight:920:203414478493561"   (plain string)
       {"type":"setHeight","height":920} (JSON)
     If neither ever arrives the CSS height stands, so the form still works.
     ------------------------------------------------------------------- */

  var embed = document.getElementById('jotform-embed');

  if (embed) {
    window.addEventListener('message', function (event) {
      var host;
      try { host = new URL(event.origin).hostname; } catch (e) { return; }
      // Only ever trust JotForm's own origins.
      if (host !== 'jotform.com' && host.slice(-12) !== '.jotform.com') return;

      var height = null;
      var data = event.data;

      if (typeof data === 'string' && data.indexOf('setHeight') === 0) {
        height = parseInt(data.split(':')[1], 10);
      } else if (data && typeof data === 'object' && data.type === 'setHeight') {
        height = parseInt(data.height, 10);
      }

      // Ignore nonsense values; a collapsed iframe is worse than a tall one.
      if (height && height > 320 && height < 20000) {
        embed.style.height = height + 'px';
      }
    });
  }

  /* ------------------------------- Copy the mobile money numbers

     navigator.clipboard needs a secure context, which file:// is not, so
     there's an execCommand fallback for opening the page straight off disk.
     ------------------------------------------------------------------- */

  var copyStatus = document.getElementById('copy-status');

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-999px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function flash(button, message) {
    button.classList.add('is-copied');
    if (copyStatus) copyStatus.textContent = message;
    window.setTimeout(function () {
      button.classList.remove('is-copied');
      if (copyStatus) copyStatus.textContent = '';
    }, 1800);
  }

  Array.prototype.forEach.call(document.querySelectorAll('.js-copy'), function (button) {
    button.addEventListener('click', function () {
      var value = button.getAttribute('data-copy');

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(function () {
          flash(button, value + ' copied');
        }, function () {
          flash(button, legacyCopy(value) ? value + ' copied' : 'Press Ctrl+C to copy ' + value);
        });
      } else {
        flash(button, legacyCopy(value) ? value + ' copied' : 'Press Ctrl+C to copy ' + value);
      }
    });
  });

  /* --------------------------------- Image fallback for missing assets */

  Array.prototype.forEach.call(document.images, function (img) {
    img.addEventListener('error', function () {
      img.classList.add('img-missing');
      img.removeAttribute('src');
    }, { once: true });
  });

})();
