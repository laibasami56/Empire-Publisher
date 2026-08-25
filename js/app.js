/* ==========================================================================
   Empire Publisher Press — main.js
   ONE JS file for the whole site.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------------------
     1. Mobile nav toggle (hamburger)
     ------------------------------------------------------------------ */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('is-open');
      mainNav.classList.toggle('is-open');
    });
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('is-open');
        mainNav.classList.remove('is-open');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        navToggle.classList.remove('is-open');
        mainNav.classList.remove('is-open');
      }
    });
  }

  /* ------------------------------------------------------------------
     2. Sticky header — shadow once the page scrolls
     ------------------------------------------------------------------ */
  var siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    var updateHeader = function () {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  /* ------------------------------------------------------------------
     3. Hero slider — auto-rotate + dots + prev/next arrows + swipe
     ------------------------------------------------------------------ */
  var heroSlides = document.querySelectorAll('.hero-slide');
  var heroDotsWrap = document.getElementById('heroDots');
  var heroDots = heroDotsWrap ? heroDotsWrap.querySelectorAll('button') : [];
  var heroPrev = document.getElementById('heroPrev');
  var heroNext = document.getElementById('heroNext');
  var heroSection = document.querySelector('.hero');

  if (heroSlides.length) {
    var current = 0;
    var timer;
    var AUTO_MS = 6000;

    function show(index) {
      current = (index + heroSlides.length) % heroSlides.length;
      heroSlides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
      heroDots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { show(current + 1); }, AUTO_MS);
    }
    heroDots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); restart(); }); });
    if (heroPrev) heroPrev.addEventListener('click', function () { show(current - 1); restart(); });
    if (heroNext) heroNext.addEventListener('click', function () { show(current + 1); restart(); });

    if (heroSection) {
      heroSection.addEventListener('mouseenter', function () { clearInterval(timer); });
      heroSection.addEventListener('mouseleave', restart);

      var touchStartX = 0;
      heroSection.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });
      heroSection.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
          show(current + (dx < 0 ? 1 : -1));
          restart();
        }
      }, { passive: true });
    }

    show(0);
    restart();
  }

  /* ------------------------------------------------------------------
     4. Published-papers horizontal scroller (with edge-aware arrows)
     ------------------------------------------------------------------ */
  var papersTrack = document.getElementById('papersTrack');
  var papersPrev = document.getElementById('papersPrev');
  var papersNext = document.getElementById('papersNext');

  if (papersTrack) {
    function scrollPapers(dir) {
      papersTrack.scrollBy({ left: papersTrack.clientWidth * 0.7 * dir, behavior: 'smooth' });
    }
    function updatePapersArrows() {
      var max = papersTrack.scrollWidth - papersTrack.clientWidth - 4;
      if (papersPrev) papersPrev.classList.toggle('is-disabled', papersTrack.scrollLeft <= 4);
      if (papersNext) papersNext.classList.toggle('is-disabled', papersTrack.scrollLeft >= max);
    }
    if (papersPrev) papersPrev.addEventListener('click', function () { scrollPapers(-1); });
    if (papersNext) papersNext.addEventListener('click', function () { scrollPapers(1); });
    papersTrack.addEventListener('scroll', updatePapersArrows, { passive: true });
    window.addEventListener('resize', updatePapersArrows);
    updatePapersArrows();
  }

  /* ------------------------------------------------------------------
     5. Testimonial rotator — with a soft fade between quotes
     ------------------------------------------------------------------ */
  var testimonials = [
    {
       text: 'Empire Publisher Press provided exceptional support throughout my publication journey. Their professionalism and dedication are truly commendable.', name: 'Dr. Maria Fernandez', role: 'Researcher', img: 'img/testimonial-1.jpg' },
    { text: 'The editorial team caught issues in my manuscript I had completely missed. Their attention to detail made all the difference.', name: 'Dr. Ahmed Khalil', role: 'Senior Lecturer', img: 'images/team 7.png' },
    { text: 'From submission to acceptance, communication was clear and timely. I felt supported at every stage of the process.', name: 'Dr. Priya Nair', role: 'Postdoctoral Fellow', img: 'images/team 6.png' }
  ];
  var tIndex = 0;
  var tCard = document.querySelector('.testimonial-card');
  var tText = document.getElementById('testimonialText');
  var tName = document.getElementById('testimonialName');
  var tRole = document.getElementById('testimonialRole');
  var tAvatar = document.getElementById('testimonialAvatar');
  var tPrev = document.getElementById('testimonialPrev');
  var tNext = document.getElementById('testimonialNext');

  function showTestimonial(i) {
    tIndex = (i + testimonials.length) % testimonials.length;
    var t = testimonials[tIndex];
    if (tCard) tCard.classList.add('is-fading');
    setTimeout(function () {
      if (tText) tText.textContent = t.text;
      if (tName) tName.textContent = t.name;
      if (tRole) tRole.textContent = t.role;
      if (tAvatar) {
        tAvatar.style.opacity = '';
        tAvatar.src = t.img;
      }
      if (tCard) tCard.classList.remove('is-fading');
    }, tCard ? 180 : 0);
  }
  if (tPrev && tNext) {
    tPrev.addEventListener('click', function () { showTestimonial(tIndex - 1); });
    tNext.addEventListener('click', function () { showTestimonial(tIndex + 1); });
  }

  /* ------------------------------------------------------------------
     5b. Services page — 6-card testimonial row (3-up, snap-scroll)
     ------------------------------------------------------------------ */
  var testiRowTrack = document.getElementById('testiRowTrack');
  var testiRowPrev = document.getElementById('testiRowPrev');
  var testiRowNext = document.getElementById('testiRowNext');
  var testiRowDotsWrap = document.getElementById('testiRowDots');
  var testiRowDots = testiRowDotsWrap ? testiRowDotsWrap.querySelectorAll('span') : [];

  if (testiRowTrack) {
    function testiRowStep() {
      var tile = testiRowTrack.querySelector('.testimonial-tile');
      var gap = parseFloat(getComputedStyle(testiRowTrack).columnGap || getComputedStyle(testiRowTrack).gap || 24);
      return tile ? tile.getBoundingClientRect().width + gap : testiRowTrack.clientWidth;
    }
    function scrollTestiRow(dir) {
      testiRowTrack.scrollBy({ left: testiRowStep() * dir, behavior: 'smooth' });
    }
    function updateTestiRowDots() {
      var step = testiRowStep();
      var max = testiRowTrack.scrollWidth - testiRowTrack.clientWidth - 4;
      var activeIndex = Math.round(testiRowTrack.scrollLeft / step);
      testiRowDots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === activeIndex);
      });
      if (testiRowPrev) testiRowPrev.classList.toggle('is-disabled', testiRowTrack.scrollLeft <= 4);
      if (testiRowNext) testiRowNext.classList.toggle('is-disabled', testiRowTrack.scrollLeft >= max);
    }
    if (testiRowPrev) testiRowPrev.addEventListener('click', function () { scrollTestiRow(-1); });
    if (testiRowNext) testiRowNext.addEventListener('click', function () { scrollTestiRow(1); });
    testiRowDots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        testiRowTrack.scrollTo({ left: i * testiRowStep(), behavior: 'smooth' });
      });
    });
    testiRowTrack.addEventListener('scroll', updateTestiRowDots, { passive: true });
    window.addEventListener('resize', updateTestiRowDots);
    updateTestiRowDots();
  }

  /* ------------------------------------------------------------------
     5c. Resources page — 9-card resource row (snap-scroll, one at a time)
     ------------------------------------------------------------------ */
  var resourceTrack = document.getElementById('resourceTrack');
  var resourcePrev = document.getElementById('resourcePrev');
  var resourceNext = document.getElementById('resourceNext');

  if (resourceTrack) {
    function resourceStep() {
      var card = resourceTrack.querySelector('.resource-card');
      var gap = parseFloat(getComputedStyle(resourceTrack).columnGap || getComputedStyle(resourceTrack).gap || 24);
      return card ? card.getBoundingClientRect().width + gap : resourceTrack.clientWidth;
    }
    function scrollResource(dir) {
      resourceTrack.scrollBy({ left: resourceStep() * dir, behavior: 'smooth' });
    }
    function updateResourceArrows() {
      var max = resourceTrack.scrollWidth - resourceTrack.clientWidth - 4;
      if (resourcePrev) resourcePrev.classList.toggle('is-disabled', resourceTrack.scrollLeft <= 4);
      if (resourceNext) resourceNext.classList.toggle('is-disabled', resourceTrack.scrollLeft >= max);
    }
    if (resourcePrev) resourcePrev.addEventListener('click', function () { scrollResource(-1); });
    if (resourceNext) resourceNext.addEventListener('click', function () { scrollResource(1); });
    resourceTrack.addEventListener('scroll', updateResourceArrows, { passive: true });
    window.addEventListener('resize', updateResourceArrows);
    updateResourceArrows();
  }

  /* ------------------------------------------------------------------
     5d. Accepted Paper page — 9-card publications row (snap-scroll)
     ------------------------------------------------------------------ */
  var pubTrack = document.getElementById('pubTrack');
  var pubPrev = document.getElementById('pubPrev');
  var pubNext = document.getElementById('pubNext');
  var pubDotsWrap = document.getElementById('pubDots');
  var pubDots = pubDotsWrap ? pubDotsWrap.querySelectorAll('span') : [];

  if (pubTrack) {
    function pubStep() {
      var card = pubTrack.querySelector('.pub-card');
      var gap = parseFloat(getComputedStyle(pubTrack).columnGap || getComputedStyle(pubTrack).gap || 22);
      return card ? card.getBoundingClientRect().width + gap : pubTrack.clientWidth;
    }
    function scrollPub(dir) {
      pubTrack.scrollBy({ left: pubStep() * dir, behavior: 'smooth' });
    }
    function updatePubUI() {
      var step = pubStep();
      var max = pubTrack.scrollWidth - pubTrack.clientWidth - 4;
      var activeIndex = Math.min(pubDots.length - 1, Math.round(pubTrack.scrollLeft / step));
      pubDots.forEach(function (d, i) { d.classList.toggle('is-active', i === activeIndex); });
      if (pubPrev) pubPrev.classList.toggle('is-disabled', pubTrack.scrollLeft <= 4);
      if (pubNext) pubNext.classList.toggle('is-disabled', pubTrack.scrollLeft >= max);
    }
    if (pubPrev) pubPrev.addEventListener('click', function () { scrollPub(-1); });
    if (pubNext) pubNext.addEventListener('click', function () { scrollPub(1); });
    pubDots.forEach(function (d, i) {
      d.addEventListener('click', function () {
        pubTrack.scrollTo({ left: i * pubStep(), behavior: 'smooth' });
      });
    });
    pubTrack.addEventListener('scroll', updatePubUI, { passive: true });
    window.addEventListener('resize', updatePubUI);
    updatePubUI();
  }

  /* ------------------------------------------------------------------
     5e. Accepted Paper page — FAQ accordion
     ------------------------------------------------------------------ */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var wasOpen = item.classList.contains('is-open');
      faqItems.forEach(function (i) { i.classList.remove('is-open'); });
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* ------------------------------------------------------------------
     5f. Contact page — form submits straight to WhatsApp (or email)
     ------------------------------------------------------------------ */
  var contactForm = document.getElementById('contactForm');
  var cfViaEmail = document.getElementById('cfViaEmail');
  var WHATSAPP_NUMBER = '447893985077'; // digits only, country code + number
  var CONTACT_EMAIL = 'info@empirepublisherpress.com';

  function buildContactMessage() {
    var name = (document.getElementById('cfName') || {}).value || '';
    var email = (document.getElementById('cfEmail') || {}).value || '';
    var phone = (document.getElementById('cfPhone') || {}).value || '';
    var service = (document.getElementById('cfService') || {}).value || '';
    var message = (document.getElementById('cfMessage') || {}).value || '';
    return {
      name: name, email: email, phone: phone, service: service, message: message,
      text:
        'New enquiry from empirepublisherpress.com\n\n' +
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n' +
        'Service: ' + service + '\n' +
        'Message: ' + message
    };
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
      var data = buildContactMessage();
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(data.text);
      window.open(url, '_blank', 'noopener');
    });
  }

  if (cfViaEmail) {
    cfViaEmail.addEventListener('click', function () {
      if (contactForm && !contactForm.checkValidity()) { contactForm.reportValidity(); return; }
      var data = buildContactMessage();
      var subject = 'Enquiry from ' + (data.name || 'website contact form');
      var url = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(data.text);
      window.location.href = url;
    });
  }

  /* ------------------------------------------------------------------
     5g. Submission page — research submission form to WhatsApp/Email
     ------------------------------------------------------------------ */
  var submissionForm = document.getElementById('submissionForm');
  var sfViaEmail = document.getElementById('sfViaEmail');

  function buildSubmissionMessage() {
    var get = function (id) { var el = document.getElementById(id); return el ? el.value : ''; };
    var fileEl = document.getElementById('sfFile');
    var fileName = (fileEl && fileEl.files && fileEl.files[0]) ? fileEl.files[0].name : '';
    var fields = [
      ['Name', get('sfName')],
      ['Email', get('sfEmail')],
      ['Mobile', get('sfMobile')],
      ['Major', get('sfMajor')],
      ['Paper Type', get('sfPaperType')],
      ['Industry', get('sfIndustry')],
      ['Profession', get('sfProfession')],
      ['Qualification', get('sfQualification')],
      ['Subject', get('sfSubject')],
      ['Faculty', get('sfFaculty')],
      ['Research Topic', get('sfTopic')],
      ['Required Indexing', get('sfIndexing')],
      ['File', fileName ? fileName + ' (please attach this file to your reply email)' : 'No file attached'],
      ['Message', get('sfMessage')]
    ];
    var text = 'New research submission from empirepublisherpress.com\n\n';
    fields.forEach(function (f) { if (f[1]) text += f[0] + ': ' + f[1] + '\n'; });
    return { name: get('sfName'), text: text };
  }

  if (submissionForm) {
    submissionForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!submissionForm.checkValidity()) { submissionForm.reportValidity(); return; }
      var data = buildSubmissionMessage();
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(data.text);
      window.open(url, '_blank', 'noopener');
    });
  }

  if (sfViaEmail) {
    sfViaEmail.addEventListener('click', function () {
      if (submissionForm && !submissionForm.checkValidity()) { submissionForm.reportValidity(); return; }
      var data = buildSubmissionMessage();
      var subject = 'Research submission from ' + (data.name || 'website');
      var url = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(data.text);
      window.location.href = url;
    });
  }

  /* ------------------------------------------------------------------
     6. Scroll-reveal — sections & cards fade/slide up as they enter view
     ------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll(
    '.reveal, .card, .discipline-card, .service-card, .resource-card, .pub-card, .testimonial-tile, .stat, .stats-band__item, .process-step, .why-band__item, .feature-strip__item, .mini-step, .requirements-band__item, .faq-item, .contact-detail, .team-member, .about-image, .about-copy, .quote-box'
  );

  if ('IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach(function (el) { el.classList.add('reveal-item'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ------------------------------------------------------------------
     7. Animated stat counters
     ------------------------------------------------------------------ */
  var counters = document.querySelectorAll('.stat strong[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var animateCounter = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1300;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    };

    var counterIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterIo.observe(el); });
  }

  /* ------------------------------------------------------------------
     8. Back-to-top button
     ------------------------------------------------------------------ */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 480);
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     9. Smooth scroll for in-page anchor links (e.g. "#services")
     ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

});
