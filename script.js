/* BEATX Typing Inserter (medium speed) 
   - injects title + subtitle at top of .container (or body if not found)
   - updates footer text with typing animation
   - medium speed ~80ms/char, slight pauses between lines
*/

(function() {
  const TITLE = "BEATX — Music Player";
  const SUB = "Made by Aniket";
  const FOOTER_TEXT = "© 2025 • Made by Aniket Chaudhary";

  const TYPING_SPEED = 80; // ms per char (medium)
  const PAUSE_BETWEEN_LINES = 500; // ms pause after typing a line

  // create wrapper and elements
  function createTypingWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'beatx-typing-wrapper';
    const titleEl = document.createElement('div');
    titleEl.className = 'beatx-title beatx-cursor';
    titleEl.setAttribute('aria-hidden','false');
    const subEl = document.createElement('div');
    subEl.className = 'beatx-sub';
    subEl.style.opacity = '0';
    wrapper.appendChild(titleEl);
    wrapper.appendChild(subEl);
    return { wrapper, titleEl, subEl };
  }

  // find insertion point: prefer top of .container, else body top
  const container = document.querySelector('.container') || document.body;
  const { wrapper, titleEl, subEl } = createTypingWrapper();
  // insert as first child of container
  container.insertBefore(wrapper, container.firstChild);

  // typing helper
  function typeText(el, text, speed) {
    return new Promise(resolve => {
      el.textContent = '';
      let i = 0;
      const iv = setInterval(() => {
        el.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
          clearInterval(iv);
          resolve();
        }
      }, speed);
    });
  }

  // type title then subtitle
  (async function runTyping() {
    // ensure visibility
    titleEl.classList.add('beatx-cursor');
    await typeText(titleEl, TITLE, TYPING_SPEED);
    // small pause then remove cursor from title and fade in subtitle
    await new Promise(r => setTimeout(r, PAUSE_BETWEEN_LINES));
    titleEl.classList.remove('beatx-cursor');
    subEl.classList.add('beatx-cursor');
    await typeText(subEl, SUB, Math.max(60, TYPING_SPEED)); // slightly faster maybe
    subEl.classList.remove('beatx-cursor');
    subEl.classList.add('beatx-fadein');
    // footer typing after short pause
    await new Promise(r => setTimeout(r, PAUSE_BETWEEN_LINES));
    typeFooter(FOOTER_TEXT, TYPING_SPEED);
  })();

  // footer update: locate existing footer element; if none, append one
  function typeFooter(text, speed) {
    let footer = document.querySelector('footer');
    if (!footer) {
      footer = document.createElement('footer');
      footer.style.marginTop = '12px';
      footer.style.textAlign = 'center';
      document.body.appendChild(footer);
    }
    // create span to type into
    footer.innerHTML = ''; // clean existing
    const span = document.createElement('span');
    span.className = 'beatx-footer-typing beatx-cursor';
    footer.appendChild(span);

    let i = 0;
    const iv = setInterval(() => {
      span.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(iv);
        // stop cursor and fade final
        span.classList.remove('beatx-cursor');
        span.classList.add('beatx-fadein');
      }
    }, speed);
  }

  // Accessibility: allow reduced motion preference -> skip animations
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // cancel typing: instantly set texts
    titleEl.textContent = TITLE;
    subEl.textContent = SUB;
    subEl.classList.remove('beatx-cursor');
    subEl.classList.add('beatx-fadein');
    typeFooter(FOOTER_TEXT, 1); // instant
  }
})();
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.log("SW Error:", err));
}
