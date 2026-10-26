/* Shared gate for the password-protected Private hub.

   NOT real security — the password and every gated page ship in full inside
   the static build, so anyone who opens dev tools can read both. This only
   keeps the project out of the home page grid and off a casual visitor's
   screen; it does nothing against someone who actually wants in.

   Change PASSWORD below to set your own. The same value gates the tile on
   the home page and all three pages under projects/private/. */
window.PrivateLock = (function () {
  var KEY = 'private-unlocked';
  var PASSWORD = 'CLopez1';

  function isUnlocked() {
    return sessionStorage.getItem(KEY) === '1';
  }

  function unlock() {
    sessionStorage.setItem(KEY, '1');
  }

  function matches(value) {
    return value === PASSWORD;
  }

  /* The home page tile: a password box drawn on the image itself. Correct
     entry sends the visitor on to the hub instead of revealing anything in
     place — there's nothing to reveal on a tile this small. */
  function guardTile(opts) {
    opts.form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (matches(opts.input.value)) {
        unlock();
        window.location.href = opts.redirect;
      } else {
        if (opts.error) opts.error.hidden = false;
        opts.input.value = '';
        opts.input.focus();
      }
    });
  }

  /* The hub and its two sub-pages: a full-page gate. Reveals the real content
     in place once unlocked — already, if the session carried over from the
     home tile, or right here if the visitor landed on the URL directly. */
  function guardPage(opts) {
    function reveal() {
      opts.lock.hidden = true;
      opts.content.hidden = false;
    }
    if (isUnlocked()) {
      reveal();
      return;
    }
    opts.form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (matches(opts.input.value)) {
        unlock();
        reveal();
      } else {
        if (opts.error) opts.error.hidden = false;
        opts.input.value = '';
        opts.input.focus();
      }
    });
  }

  return {
    isUnlocked: isUnlocked,
    unlock: unlock,
    guardTile: guardTile,
    guardPage: guardPage
  };
})();
