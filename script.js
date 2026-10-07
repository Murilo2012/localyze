(function () {
  'use strict';

  var ZAP = '5551989006644';
  var semMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function linkZap(texto) {
    return 'https://wa.me/' + ZAP + (texto ? '?text=' + encodeURIComponent(texto) : '');
  }

  // ---------- links de WhatsApp com mensagem pronta ----------
  document.querySelectorAll('[data-zap]').forEach(function (a) {
    a.href = linkZap(a.getAttribute('data-zap'));
  });

  // ---------- timecode da foto (00:00:00:00, 25 quadros/s) ----------
  var tc = document.getElementById('timecode');
  if (tc && !semMovimento) {
    var inicio = performance.now();
    var dois = function (n) { return (n < 10 ? '0' : '') + n; };
    setInterval(function () {
      var q = Math.floor((performance.now() - inicio) / 40);
      var s = Math.floor(q / 25);
      tc.textContent = dois(Math.floor(s / 3600)) + ':' + dois(Math.floor(s / 60) % 60) + ':' + dois(s % 60) + ':' + dois(q % 25);
    }, 40);
  }

  // ---------- borda do topo ao rolar ----------
  var topo = document.getElementById('topo');
  var aoRolar = function () { topo.classList.toggle('rolou', window.scrollY > 8); };
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  // ---------- entrada suave ----------
  var itens = document.querySelectorAll('.revela');
  if ('IntersectionObserver' in window && !semMovimento) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('entrou'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    itens.forEach(function (el) { obs.observe(el); });
  } else {
    itens.forEach(function (el) { el.classList.add('entrou'); });
  }

  // ---------- botão fixo: aparece depois da abertura, some no contato ----------
  var barra = document.getElementById('barra');
  var heroAcoes = document.getElementById('hero-acoes');
  var contato = document.getElementById('contato');
  if (barra && heroAcoes && contato && 'IntersectionObserver' in window) {
    var heroVisivel = true, contatoVisivel = false;
    var atualizar = function () { barra.classList.toggle('mostrar', !heroVisivel && !contatoVisivel); };
    new IntersectionObserver(function (e) {
      heroVisivel = e[0].isIntersecting || e[0].boundingClientRect.top > 0;
      atualizar();
    }).observe(heroAcoes);
    new IntersectionObserver(function (e) { contatoVisivel = e[0].isIntersecting; atualizar(); }, { threshold: 0.05 }).observe(contato);
  }

  // ---------- formulário: monta a mensagem e abre o WhatsApp ----------
  function juntar(lista) {
    if (lista.length < 2) return lista.join('');
    return lista.slice(0, -1).join(', ') + ' e ' + lista[lista.length - 1];
  }

  var form = document.getElementById('pedido');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var val = function (id) { return document.getElementById(id).value.trim(); };
      var nome = val('p-nome');
      var negocio = val('p-negocio');
      var extra = val('p-msg');
      var tipo = form.querySelector('input[name="tipo"]:checked');
      var precisa = Array.prototype.map.call(form.querySelectorAll('input[name="precisa"]:checked'), function (i) { return i.value; });

      var linhas = ['Olá, Localyze! Vi a apresentação de vocês e quero um orçamento.'];
      if (nome) linhas.push('Meu nome é ' + nome + '.');
      if (tipo && tipo.value) linhas.push('Tenho ' + tipo.value + (negocio ? ': ' + negocio : '') + '.');
      else if (negocio) linhas.push('Meu negócio: ' + negocio + '.');
      if (precisa.length) linhas.push('Tenho interesse em: ' + juntar(precisa) + '.');
      if (extra) linhas.push(extra);

      var url = linkZap(linhas.join('\n'));
      // (com 'noopener' o window.open sempre retorna null, então tiramos o opener à mão)
      var aberta = window.open(url, '_blank');
      if (aberta) aberta.opener = null;
      else window.location.href = url;
    });
  }

  // ---------- ano no rodapé ----------
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
