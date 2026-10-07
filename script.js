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

  // ---------- mensagem por e-mail (direto pelo site, via Web3Forms) ----------
  var botaoEmail = document.querySelector('.botao--email');
  var formEmail = document.getElementById('form-email');
  if (botaoEmail && formEmail && window.fetch) {
    botaoEmail.setAttribute('aria-expanded', 'false');
    botaoEmail.setAttribute('aria-controls', 'form-email');
    botaoEmail.addEventListener('click', function (ev) {
      ev.preventDefault();
      var abrir = formEmail.hidden;
      formEmail.hidden = !abrir;
      botaoEmail.setAttribute('aria-expanded', String(abrir));
      if (abrir) document.getElementById('e-nome').focus();
    });

    var status = document.getElementById('e-status');
    var enviar = document.getElementById('e-enviar');
    // celular: abre o app de e-mail (Gmail, Mail…) já com a mensagem; computador: abre o Gmail no navegador
    var ehCelular = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    var linkEmail = function (assunto, corpo) {
      if (ehCelular) {
        return 'mailto:murilok.andrade@gmail.com?subject=' + encodeURIComponent(assunto) + '&body=' + encodeURIComponent(corpo);
      }
      return 'https://mail.google.com/mail/?view=cm&fs=1&to=murilok.andrade@gmail.com' +
        '&su=' + encodeURIComponent(assunto) + '&body=' + encodeURIComponent(corpo);
    };

    formEmail.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (formEmail.querySelector('[name="botcheck"]').checked) return; // robô de spam
      var nome = document.getElementById('e-nome').value.trim();
      var contato = document.getElementById('e-contato').value.trim();
      var mensagem = document.getElementById('e-msg').value.trim();
      var chave = document.getElementById('e-chave').value.trim();
      var texto = 'Olá, Localyze!\n\nNome: ' + nome + '\nContato: ' + contato + '\n\n' + mensagem;

      // se o envio direto não der certo, a mesma mensagem segue pelo WhatsApp ou pelo e-mail
      var plano_b = function () {
        status.className = 'form-email__status form-email__status--opcoes';
        status.innerHTML = 'Escolha como enviar a sua mensagem (ela já vai escrita):' +
          '<span class="form-email__opcoes">' +
          '<a class="botao botao--azul" target="_blank" rel="noopener" href="' + linkZap(texto) + '">Enviar pelo WhatsApp</a>' +
          '<a class="botao botao--linha"' + (ehCelular ? '' : ' target="_blank" rel="noopener"') +
          ' href="' + linkEmail('Mensagem pelo site da Localyze', texto) + '">Enviar pelo e-mail</a>' +
          '</span>';
      };

      if (!chave) { plano_b(); return; }

      status.className = 'form-email__status';
      status.textContent = 'Enviando…';
      enviar.disabled = true;
      var dados = {
        access_key: chave,
        subject: 'Nova mensagem pelo site da Localyze',
        from_name: 'Site da Localyze',
        nome: nome,
        contato: contato,
        mensagem: mensagem
      };
      if (/@/.test(contato)) dados.email = contato; // permite responder direto
      var controle = window.AbortController ? new AbortController() : null;
      var limite = setTimeout(function () { if (controle) controle.abort(); }, 12000);
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(dados),
        signal: controle ? controle.signal : undefined
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res || String(res.success) !== 'true') throw new Error((res && res.message) || 'falhou');
          formEmail.reset();
          status.className = 'form-email__status';
          status.textContent = 'Mensagem enviada! Vamos responder em breve.';
        })
        .catch(plano_b)
        .then(function () { clearTimeout(limite); enviar.disabled = false; });
    });
  }

  // ---------- ano no rodapé ----------
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
