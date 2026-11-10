async function protegerPagina() {
  const elementoMensagem = document.getElementById('mensagem-protecao');

  try {
    const resultado = await supabaseClient.auth.getSession();

    if (resultado.error) {
      if (elementoMensagem) {
        elementoMensagem.textContent =
          'Erro ao verificar a sessão: ' +
          (resultado.error.message || 'erro desconhecido');
      }

      return null;
    }

    if (!resultado.data || !resultado.data.session) {
      window.location.replace('index.html');
      return null;
    }

    const usuario = resultado.data.session.user;

    preencherDadosDoUsuario(usuario);

    return usuario;
  } catch (erro) {
    if (elementoMensagem) {
      elementoMensagem.textContent =
        'Erro de conexão com o sistema.';
    }

    console.error('Erro ao proteger página:', erro);

    return null;
  }
}

function preencherDadosDoUsuario(usuario) {
  const nome =
    usuario.user_metadata?.full_name ||
    usuario.email?.split('@')[0] ||
    'Usuário';

  const iniciais = nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(function(parte) {
      return parte.charAt(0).toUpperCase();
    })
    .join('');

  const campoNome = document.getElementById('nome-usuario');
  const campoEmail = document.getElementById('email-usuario');
  const campoAvatar = document.getElementById('avatar-usuario');

  if (campoNome) {
    campoNome.textContent = nome;
  }

  if (campoEmail) {
    campoEmail.textContent = usuario.email || '';
  }

  if (campoAvatar) {
    campoAvatar.textContent = iniciais || 'US';
  }
}

async function sairDaPlataforma() {
  await supabaseClient.auth.signOut();
  window.location.replace('index.html');
}

function configurarBotaoSair() {
  const botaoSair = document.getElementById('botao-sair');

  if (botaoSair) {
    botaoSair.addEventListener('click', sairDaPlataforma);
  }
}
