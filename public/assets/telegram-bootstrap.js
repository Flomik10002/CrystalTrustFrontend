(function () {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    window.__telegramInitData = tg.initData;
    tg.ready();
  }
})();
