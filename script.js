/**
 * Shazab Tariq — Portfolio
 * Theme switch, mobile navigation, scroll spy, scroll reveal,
 * experience accordions and the contact form.
 */
(function () {
  'use strict';

  /* ------------------------------- Theme -------------------------------- */
  var THEME_KEY = 'st-theme';
  var root = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    var isDark = theme !== 'light';

    root.setAttribute('data-theme', isDark ? 'dark' : 'light');

    if (themeToggle) {
      themeToggle.setAttribute('aria-checked', String(isDark));
      themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }
    if (themeMeta) {
      themeMeta.setAttribute('content', isDark ? '#0b0f16' : '#ffffff');
    }
  }

  function storedTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (err) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (err) {
      /* storage unavailable (private mode) — the theme still applies for this visit */
    }
  }

  // Dark stays the default; a saved choice wins over it.
  applyTheme(storedTheme() === 'light' ? 'light' : 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      storeTheme(next);
    });
  }

  /* --------------------------- Mobile navigation ------------------------- */
  var header = document.getElementById('siteHeader');
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('primaryNav');
  var overlay = document.getElementById('navOverlay');
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('.nav-link')) : [];

  function setMenu(open) {
    if (!nav || !menuBtn) return;

    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    menuBtn.querySelector('i').className = open ? 'bx bx-x' : 'bx bx-menu';
    document.body.style.overflow = open ? 'hidden' : '';

    if (overlay) overlay.hidden = !open;
  }

  function isMenuOpen() {
    return !!nav && nav.classList.contains('is-open');
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(!isMenuOpen());
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function () {
      setMenu(false);
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      setMenu(false);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isMenuOpen()) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  // Reset the menu when growing back to the desktop layout.
  window.addEventListener('resize', function () {
    if (window.innerWidth > 860 && isMenuOpen()) setMenu(false);
  });

  /* ------------------------ Header state & scroll spy --------------------- */
  // Only sections that have a matching nav link take part in the spy, so the
  // nearest preceding linked section stays highlighted inside sub-sections.
  var spyTargets = navLinks
    .map(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  function setActiveLink(activeLink) {
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link === activeLink);
    });
  }

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);

    if (!spyTargets.length) return;

    var probe = window.scrollY + (window.innerHeight * 0.28);
    var current = spyTargets[0];

    spyTargets.forEach(function (target) {
      if (target.section.offsetTop <= probe) current = target;
    });

    // Pin the last entry once the page is scrolled to the bottom.
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
      current = spyTargets[spyTargets.length - 1];
    }

    setActiveLink(current.link);
  }

  var scrollScheduled = false;
  window.addEventListener('scroll', function () {
    if (scrollScheduled) return;
    scrollScheduled = true;
    window.requestAnimationFrame(function () {
      onScroll();
      scrollScheduled = false;
    });
  }, { passive: true });

  onScroll();

  /* ---------------------------- Scroll reveal ---------------------------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealItems.forEach(function (item, index) {
      // Small stagger so grids animate in sequence rather than all at once.
      item.style.transitionDelay = (index % 6) * 60 + 'ms';
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }

  /* -------------------------- Experience accordions ---------------------- */
  var toggles = Array.prototype.slice.call(document.querySelectorAll('.tl-toggle'));

  function setPanel(toggle, expanded) {
    var panel = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!panel) return;

    var label = toggle.querySelector('.tl-toggle-label');

    toggle.setAttribute('aria-expanded', String(expanded));
    panel.hidden = !expanded;
    if (label) label.textContent = expanded ? 'Hide responsibilities' : 'Show responsibilities';
  }

  toggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      setPanel(toggle, toggle.getAttribute('aria-expanded') !== 'true');
    });
  });

  // On phones an expanded panel buries the rest of the page under a wall of
  // bullets, so start every card collapsed and let the reader open what they want.
  if (window.matchMedia('(max-width: 768px)').matches) {
    toggles.forEach(function (toggle) {
      if (toggle.getAttribute('aria-expanded') === 'true') setPanel(toggle, false);
    });
  }

  /* ----------------------------- Contact form ---------------------------- */
  /**
   * There is no backend behind this site, so the form does not claim to send
   * anything: it builds a pre-filled message and hands it to the visitor's own
   * email client. To wire up a real email service (Formspree, EmailJS, etc.),
   * set FORM_ENDPOINT to the POST URL and the submit handler will use it.
   */
  var FORM_ENDPOINT = '';
  var EMAIL = 'shazabtariq41@gmail.com';

  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');

  function setNote(message, state) {
    if (!note) return;
    note.innerHTML = message;
    note.classList.remove('is-error', 'is-success');
    if (state) note.classList.add(state);
  }

  function markInvalid(field, invalid) {
    if (invalid) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var name = form.elements.name;
      var email = form.elements.email;
      var subject = form.elements.subject;
      var message = form.elements.message;
      var fields = [name, email, subject, message];
      var firstInvalid = null;

      fields.forEach(function (field) {
        var invalid = !field.value.trim() || (field.type === 'email' && !field.checkValidity());
        markInvalid(field, invalid);
        if (invalid && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        setNote('Please complete every field with a valid email address before sending.', 'is-error');
        firstInvalid.focus();
        return;
      }

      if (FORM_ENDPOINT) {
        setNote('Sending…');

        fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.value.trim(),
            email: email.value.trim(),
            subject: subject.value.trim(),
            message: message.value.trim()
          })
        })
          .then(function (response) {
            if (!response.ok) throw new Error('Request failed');
            form.reset();
            setNote('Thanks — your message has been sent. I will get back to you shortly.', 'is-success');
          })
          .catch(function () {
            setNote('Sending failed. Please email me directly at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.', 'is-error');
          });

        return;
      }

      var body =
        'Name: ' + name.value.trim() + '\n' +
        'Email: ' + email.value.trim() + '\n\n' +
        message.value.trim();

      window.location.href =
        'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent(subject.value.trim()) +
        '&body=' + encodeURIComponent(body);

      setNote(
        'Your email client should now open with this message ready to send. If nothing happened, ' +
        'email me directly at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.',
        'is-success'
      );
    });

    form.addEventListener('input', function (event) {
      if (event.target.hasAttribute('aria-invalid')) markInvalid(event.target, false);
    });
  }
})();
