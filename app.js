const initialData = {
  systems: [
    { id: 'argo', name: 'Argo', description: 'Artigos sobre cadastro, reservas, políticas, aprovações e fluxos do Argo.' },
    { id: 'reserve', name: 'Reserve', description: 'Guias de uso, erros comuns, configurações e consultas do Reserve.' },
    { id: 'wts', name: 'WTS', description: 'Procedimentos, orientações e base de apoio para atendimento WTS.' },
    { id: 'reserva-facil', name: 'Reserva Fácil', description: 'Conteúdos para operação e suporte do Reserva Fácil.' }
  ],
  departments: [
    { id: 'suporte', name: 'Suporte', description: 'Conteúdos para atendimento, troubleshooting e resolução de chamados.' },
    { id: 'financeiro', name: 'Financeiro', description: 'Processos financeiros, faturamento, conferências e orientações.' },
    { id: 'eventos', name: 'Eventos', description: 'Fluxos e materiais de apoio para eventos e grupos.' },
    { id: 'operacao', name: 'Operação', description: 'Procedimentos operacionais, execução e acompanhamento.' }
  ],
  clients: [
    { id: crypto.randomUUID(), name: 'Mariana Costa', email: 'mariana.costa@empresa.com', company: 'Empresa Modelo', role: 'usuário comum' },
    { id: crypto.randomUUID(), name: 'Rafael Lima', email: 'rafael.lima@cliente.com', company: 'Cliente Exemplo', role: 'usuário comum' }
  ],
  agencyUsers: [
    { id: crypto.randomUUID(), name: 'Luiza Saraiva', email: 'luiza.saraiva@dynamictravel.com', department: 'Suporte', access: 'administrador' },
    { id: crypto.randomUUID(), name: 'Equipe Eventos', email: 'eventos@dynamictravel.com', department: 'Eventos', access: 'colaborador' }
  ],
  articles: [
    {
      id: crypto.randomUUID(),
      title: 'Cadastro de usuários no Argo',
      summary: 'Passo a passo para orientar o processo de cadastro e validação de usuários no Argo.',
      system: 'argo',
      department: 'suporte',
      status: 'publicado',
      tags: ['cadastro', 'usuário', 'argo', 'login'],
      image: '',
      video: '',
      content: '1. Acesse o painel administrativo do cliente.\n2. Localize a área de usuários.\n3. Confira nome, e-mail e perfil de acesso.\n4. Valide se o usuário está vinculado ao centro de custo correto.\n5. Salve o cadastro e oriente o usuário sobre o primeiro acesso.',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      updatedAt: new Date().toLocaleDateString('pt-BR'),
      comments: [],
      kind: 'article'
    },
    {
      id: crypto.randomUUID(),
      title: 'Como identificar erro de acesso',
      summary: 'Orientação rápida para analisar login incorreto, link errado ou perfil sem permissão.',
      system: 'reserve',
      department: 'suporte',
      status: 'publicado',
      tags: ['login', 'acesso', 'erro', 'reserve'],
      image: '',
      video: '',
      content: 'Confira se o link utilizado pertence ao cliente correto. Depois valide se o usuário está ativo, se o perfil possui permissão e se a senha foi redefinida recentemente. Caso o acesso continue falhando, registre evidências e acione o responsável pelo sistema.',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      updatedAt: new Date().toLocaleDateString('pt-BR'),
      comments: [],
      kind: 'article'
    },
    {
      id: crypto.randomUUID(),
      title: 'Fluxo de atendimento para eventos',
      summary: 'Modelo de consulta para equipes que atendem demandas de eventos e grupos.',
      system: 'wts',
      department: 'eventos',
      status: 'publicado',
      tags: ['eventos', 'operação', 'wts'],
      image: '',
      video: '',
      content: 'Antes de iniciar o atendimento, confirme período, localidade, solicitante, tipo de evento e quantidade de participantes. Registre todas as etapas para manter visibilidade entre Suporte, Operação e Gestão.',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      updatedAt: new Date().toLocaleDateString('pt-BR'),
      comments: []
    }
  ]
};

let db = JSON.parse(localStorage.getItem('dynamicdoc-db')) || initialData;
db.clients = db.clients || initialData.clients;
db.agencyUsers = db.agencyUsers || initialData.agencyUsers;
db.articles = (db.articles || []).map(a => ({ kind: a.kind || 'article', comments: a.comments || [], likes: 0, dislikes: 0, version: '1.0', homologation: 'homologado', history: [], ...a }));
db.favorites = db.favorites || [];
db.portalBanner = db.portalBanner || '';
let currentUser = JSON.parse(localStorage.getItem('dynamicdoc-user')) || null;

const supabaseSettings = window.DynamicDocSupabase || {};
const supabaseReady = Boolean(
  supabaseSettings.url &&
  supabaseSettings.anonKey &&
  !supabaseSettings.url.includes('SEU-PROJETO') &&
  !supabaseSettings.anonKey.includes('SUA-CHAVE') &&
  window.supabase
);
const supabaseDb = supabaseReady ? window.supabase.createClient(supabaseSettings.url, supabaseSettings.anonKey) : null;
let selectedArticleId = null;
let editorReturnPage = 'articles';
let selectedProcessSystem = '';

const $ = (id) => document.getElementById(id);
const saveDb = () => localStorage.setItem('dynamicdoc-db', JSON.stringify(db));

async function loadSupabaseData() {
  if (!supabaseDb) return;

  const [articlesRes, clientsRes, agencyRes] = await Promise.all([
    supabaseDb.from('artigos').select('*').order('updatedAt', { ascending: false }),
    supabaseDb.from('clientes').select('*').order('name', { ascending: true }),
    supabaseDb.from('usuarios_agencia').select('*').order('name', { ascending: true })
  ]);

  if (articlesRes.error) console.warn('Erro ao carregar artigos do Supabase:', articlesRes.error.message);
  if (clientsRes.error) console.warn('Erro ao carregar clientes do Supabase:', clientsRes.error.message);
  if (agencyRes.error) console.warn('Erro ao carregar usuários agência do Supabase:', agencyRes.error.message);

  if (articlesRes.data?.length) {
    db.articles = articlesRes.data.map(a => ({
      ...a,
      tags: Array.isArray(a.tags) ? a.tags : [],
      comments: Array.isArray(a.comments) ? a.comments : [],
      kind: a.kind || 'article'
    }));
  }
  if (clientsRes.data?.length) db.clients = clientsRes.data;
  if (agencyRes.data?.length) db.agencyUsers = agencyRes.data;
  saveDb();
}

async function upsertSupabase(table, payload) {
  if (!supabaseDb) return;
  const { error } = await supabaseDb.from(table).upsert(payload, { onConflict: 'id' });
  if (error) {
    console.error(`Erro ao salvar em ${table}:`, error.message);
    alert(`Salvo localmente, mas houve erro ao sincronizar com Supabase: ${error.message}`);
  }
}

async function deleteSupabase(table, id) {
  if (!supabaseDb) return;
  const { error } = await supabaseDb.from(table).delete().eq('id', id);
  if (error) {
    console.error(`Erro ao excluir em ${table}:`, error.message);
    alert(`Excluído localmente, mas houve erro ao sincronizar com Supabase: ${error.message}`);
  }
}


// ===== Autenticação real com Supabase Auth =====
function profileRoleToLabel(role = 'usuario') {
  const labels = {
    admin: 'Administrador',
    colaborador: 'Usuário corporativo',
    usuario: 'Usuário comum'
  };
  return labels[role] || role;
}

async function getLoggedUser() {
  if (!supabaseDb) return null;

  const { data: sessionData, error: sessionError } = await supabaseDb.auth.getSession();
  if (sessionError) {
    console.warn('Erro ao recuperar sessão:', sessionError.message);
    return null;
  }

  const authUser = sessionData?.session?.user;
  if (!authUser) return null;

  const { data: profile, error: profileError } = await supabaseDb
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (profileError || !profile) {
    console.warn('Perfil não encontrado:', profileError?.message);
    return {
      id: authUser.id,
      name: authUser.email,
      email: authUser.email,
      role: 'usuario',
      department: 'Sem departamento',
      company: ''
    };
  }

  return {
    id: profile.id,
    name: profile.nome || authUser.email,
    email: profile.email || authUser.email,
    role: profile.perfil || 'usuario',
    department: profile.departamento || 'Sem departamento',
    company: profile.empresa || ''
  };
}

async function loginWithSupabase(email, password) {
  if (!supabaseDb) {
    alert('Supabase não conectado. Confira o arquivo supabase-config.js.');
    return false;
  }

  const { error } = await supabaseDb.auth.signInWithPassword({ email, password });
  if (error) {
    alert('Erro no login: ' + error.message);
    return false;
  }

  currentUser = await getLoggedUser();

  if (!currentUser || currentUser.role === 'usuario') {
    await supabaseDb.auth.signOut();
    currentUser = null;
    localStorage.removeItem('dynamicdoc-user');
    alert('Acesso restrito a usuários corporativos e administradores.');
    refresh();
    return false;
  }

  saveUser();
  refresh();
  navigate('home');
  return true;
}

async function logoutSupabase() {
  if (supabaseDb) await supabaseDb.auth.signOut();
  currentUser = null;
  localStorage.removeItem('dynamicdoc-user');
  refresh();
  navigate('home');
}

async function createUserSupabase({ nome, email, password, perfil, departamento, empresa = '' }) {
  if (!supabaseReady || !window.supabase) {
    alert('Supabase não conectado. Usuário será salvo apenas localmente.');
    return null;
  }

  const tempClient = window.supabase.createClient(supabaseSettings.url, supabaseSettings.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  const { data, error } = await tempClient.auth.signUp({
    email,
    password,
    options: {
      data: { nome, perfil, departamento, empresa }
    }
  });

  if (error) {
    alert('Erro ao cadastrar usuário no Auth: ' + error.message);
    return null;
  }

  const userId = data?.user?.id;
  if (!userId) {
    alert('Cadastro iniciado. Verifique o e-mail para confirmar o acesso.');
    return null;
  }

  const profilePayload = {
    id: userId,
    nome,
    email,
    perfil,
    departamento,
    empresa
  };

  const { error: profileError } = await supabaseDb
    .from('profiles')
    .upsert(profilePayload, { onConflict: 'id' });

  if (profileError) {
    alert('Usuário criado no Auth, mas houve erro ao salvar o perfil: ' + profileError.message);
    return null;
  }

  return { id: userId, ...profilePayload };
}

async function resetPasswordSupabase(email) {
  if (!supabaseDb) {
    alert('Supabase não conectado.');
    return;
  }

  const { error } = await supabaseDb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  });

  if (error) {
    alert('Erro ao enviar redefinição: ' + error.message);
    return;
  }

  alert('Link de redefinição enviado para: ' + email);
}
const saveUser = () => localStorage.setItem('dynamicdoc-user', JSON.stringify(currentUser));
const systemName = (id) => db.systems.find(s => s.id === id)?.name || id;
const deptName = (id) => db.departments.find(d => d.id === id)?.name || id;
const isAdmin = () => currentUser?.role === 'admin';
const canSuggest = () => ['admin', 'colaborador'].includes(currentUser?.role);
const canSeeInternalProcesses = () => ['admin', 'colaborador'].includes(currentUser?.role);
const isCommonUser = () => !currentUser || currentUser.role === 'usuario';

function updateAccessView() {
  $('currentUserName').textContent = currentUser?.name || 'Visitante';
  $('currentUserRole').textContent = currentUser ? `${profileRoleToLabel(currentUser.role)} • ${currentUser.department}` : 'Faça login';
  $('loginBtn').textContent = currentUser ? 'Sair' : 'Entrar';
  $('loginBtn').classList.remove('hidden');
  document.querySelectorAll('.admin-only').forEach(el => el.classList.toggle('hidden', !isAdmin()));
  document.querySelectorAll('.staff-only').forEach(el => el.classList.toggle('hidden', !canSeeInternalProcesses()));
  document.querySelectorAll('.dept-menu').forEach(el => el.classList.toggle('hidden', isCommonUser()));
  if (!isAdmin() && document.querySelector('#admin.active-page')) navigate('home');
  if (!canSeeInternalProcesses() && document.querySelector('#processes.active-page')) navigate('home');
  if (isCommonUser() && document.querySelector('#departments.active-page')) navigate('home');
}

function fillSelects() {
  const systemOptions = '<option value="">Todos os sistemas</option>' + db.systems.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  const deptOptions = '<option value="">Todos os departamentos</option>' + db.departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
  $('filterSystem').innerHTML = systemOptions;
  $('filterDepartment').innerHTML = deptOptions;
  if ($('formSystem')) $('formSystem').innerHTML = db.systems.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
  if ($('formDepartment')) $('formDepartment').innerHTML = db.departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
}

function renderCards() {
  const systemCards = db.systems.map(s => `
    <article class="card" onclick="filterBySystem('${s.id}')">
      <div class="card-icon">${s.name.charAt(0)}</div>
      <h4>${s.name}</h4>
      <p>${s.description}</p>
      <div class="meta"><span class="tag">${countArticles('system', s.id)} artigos</span></div>
    </article>
  `).join('');
  $('systemCards').innerHTML = systemCards;
  $('systemsPageGrid').innerHTML = systemCards;

  $('departmentsGrid').innerHTML = db.departments.map(d => `
    <article class="card" onclick="filterByDepartment('${d.id}')">
      <div class="card-icon">${d.name.charAt(0)}</div>
      <h4>${d.name}</h4>
      <p>${d.description}</p>
      <div class="meta"><span class="tag">${countArticles('department', d.id)} artigos</span></div>
    </article>
  `).join('');
}

function countArticles(type, id) {
  return db.articles.filter(a => (a.kind || 'article') === 'article' && a[type] === id && (isAdmin() || a.status === 'publicado')).length;
}

function renderArticles(targetId = 'articlesList', limit = null) {
  const query = (targetId === 'recentArticles' ? $('globalSearch').value : $('articleSearch')?.value || '').toLowerCase();
  const system = $('filterSystem')?.value || '';
  const department = $('filterDepartment')?.value || '';
  const status = isAdmin() ? ($('filterStatus')?.value ?? 'publicado') : 'publicado';

  let articles = db.articles.filter(a => {
    if ((a.kind || 'article') !== 'article') return false;
    const text = `${a.title} ${a.summary} ${a.tags.join(' ')} ${systemName(a.system)} ${deptName(a.department)}`.toLowerCase();
    return (!query || text.includes(query)) &&
      (!system || a.system === system) &&
      (!department || a.department === department) &&
      (!status || a.status === status) &&
      (isAdmin() || a.status === 'publicado');
  });

  if (limit) articles = articles.slice(0, limit);

  const html = articles.length ? articles.map(a => `
    <article class="article-item">
      <div>
        <h4>${a.title}</h4>
        <p>${a.summary}</p>
        <div class="meta">
          <span class="tag">${systemName(a.system)}</span>
          <span class="tag">${deptName(a.department)}</span>
          <span class="tag status ${a.status}">${a.status}</span>
          ${a.tags.slice(0, 3).map(t => `<span class="tag">#${t}</span>`).join('')}
        </div>
      </div>
      <div class="article-actions">
        <button class="ghost-btn" onclick="openArticle('${a.id}')">Abrir</button>
        ${canSeeInternalProcesses() && targetId === 'articlesList' ? `<button class="ghost-btn" onclick="editArticle('${a.id}')">Editar</button>${isAdmin() ? `<button class="danger-btn" onclick="deleteArticle('${a.id}')">Excluir</button>` : ''}` : ''}
      </div>
    </article>
  `).join('') : '<div class="panel"><p class="muted">Nenhum artigo encontrado.</p></div>';

  $(targetId).innerHTML = html;
}

function renderAdminArticles() {
  $('adminArticles').innerHTML = db.articles.filter(a => (a.kind || 'article') === 'article').map(a => `
    <article class="article-item">
      <div>
        <h4>${a.title}</h4>
        <p>${systemName(a.system)} • ${deptName(a.department)} • ${a.status}</p>
      </div>
      <div class="top-actions">
        <button class="ghost-btn" onclick="selectArticleForComment('${a.id}')">Selecionar</button>
        <button class="ghost-btn" onclick="openArticle('${a.id}')">Visualizar</button>
      </div>
    </article>
  `).join('');
}

function selectArticleForComment(id) {
  selectedArticleId = id;
  renderComments();
}


function isHtmlContent(content = '') {
  return /<[^>]+>/.test(content);
}

function formatContentForDisplay(content = '') {
  if (!content) return '<p>Conteúdo em construção.</p>';
  if (isHtmlContent(content)) return content;
  return content
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => `<p>${line}</p>`)
    .join('');
}

function setEditorContent(content = '') {
  const editor = $('formContent');
  if (!editor) return;
  editor.innerHTML = isHtmlContent(content) ? content : formatContentForDisplay(content);
}

function getEditorContent() {
  const editor = $('formContent');
  if (!editor) return '';
  return editor.innerHTML.trim();
}

function focusEditor() {
  const editor = $('formContent');
  if (editor) editor.focus();
}

function applyEditorCommand(command, value = null) {
  focusEditor();
  document.execCommand(command, false, value);
}

function insertEditorLink() {
  const url = prompt('Cole o link que deseja inserir:');
  if (!url) return;
  applyEditorCommand('createLink', url);
}

function insertEditorImage() {
  const url = prompt('Cole a URL da imagem:');
  if (!url) return;
  applyEditorCommand('insertImage', url);
}

function insertEditorVideo() {
  const url = prompt('Cole o link do vídeo:');
  if (!url) return;
  focusEditor();
  document.execCommand('insertHTML', false, `<div class="doc-video"><strong>Vídeo de apoio:</strong><br><a href="${url}" target="_blank">Abrir vídeo</a></div>`);
}

function openArticle(id) {
  const a = db.articles.find(item => item.id === id);
  if (!a) return;
  selectedArticleId = id;
  $('articleDetails').innerHTML = `
    <span class="pill" style="background:#e8f1ff;color:#053798">${systemName(a.system)} • ${deptName(a.department)}</span>
    <h1>${a.title}</h1>
    <p class="muted">Atualizado em ${a.updatedAt} • Status: ${a.status}</p>
    ${a.image ? `<img class="article-cover" src="${a.image}" alt="Imagem do artigo">` : ''}
    <p><strong>${a.summary}</strong></p>
    <div class="article-body">${formatContentForDisplay(a.content)}</div>
    ${a.video ? `<div class="video-box"><strong>Vídeo de apoio:</strong><br><a href="${a.video}" target="_blank">Abrir vídeo</a></div>` : ''}
    <div class="meta">${a.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div>
    ${canSuggest() && !isAdmin() ? `<hr><button class="ghost-btn" onclick="alert('Sugestão registrada para revisão administrativa. Esta função está simulada neste protótipo.')">Sugerir alteração</button>` : ''}
    <div class="article-bottom-actions">
      <button class="primary-btn" onclick="closeArticleModal()">Fechar artigo</button>
    </div>
  `;
  $('articleModal').classList.remove('hidden');
}

function closeArticleModal() {
  $('articleModal').classList.add('hidden');
}

function editArticle(id) {
  const a = db.articles.find(item => item.id === id);
  selectedArticleId = id;
  editorReturnPage = (a.kind || 'article') === 'process' ? 'processes' : 'articles';
  $('articleId').value = a.id;
  if ($('formKind')) $('formKind').value = a.kind || 'article';
  $('formTitle').value = a.title;
  $('formSummary').value = a.summary;
  $('formSystem').value = a.system;
  $('formDepartment').value = a.department;
  $('formStatus').value = a.status;
  $('formTags').value = a.tags.join(', ');
  $('formImage').value = a.image || '';
  $('formVideo').value = a.video || '';
  setEditorContent(a.content);
  renderComments();
  $('articleEditorTitle').textContent = (a.kind || 'article') === 'process' ? 'Editar processo interno' : 'Editar artigo';
  navigate('articleEditor');
}

async function deleteArticle(id) {
  if (!confirm('Deseja excluir este artigo?')) return;
  db.articles = db.articles.filter(a => a.id !== id);
  saveDb();
  await deleteSupabase('artigos', id);
  refresh();
  navigate(editorReturnPage || 'articles');
}


function renderComments() {
  const a = db.articles.find(item => item.id === selectedArticleId);
  $('commentsBox').innerHTML = a?.comments?.length
    ? a.comments.map(c => `<div class="comment"><strong>${c.author}</strong> • ${c.date}<br>${c.text}</div>`).join('')
    : '<p class="muted">Nenhum comentário administrativo selecionado.</p>';
}

async function saveArticle() {
  const id = $('articleId').value || crypto.randomUUID();
  const payload = {
    id,
    title: $('formTitle').value.trim() || 'Artigo sem título',
    summary: $('formSummary').value.trim() || 'Resumo não informado.',
    system: $('formSystem').value,
    department: $('formDepartment').value,
    status: $('formStatus').value,
    tags: $('formTags').value.split(',').map(t => t.trim()).filter(Boolean),
    image: $('formImage').value.trim(),
    video: $('formVideo').value.trim(),
    content: getEditorContent() || '<p>Conteúdo em construção.</p>',
    createdAt: new Date().toLocaleDateString('pt-BR'),
    updatedAt: new Date().toLocaleDateString('pt-BR'),
    comments: db.articles.find(a => a.id === id)?.comments || [],
    kind: $('formKind')?.value || 'article'
  };
  const index = db.articles.findIndex(a => a.id === id);
  if (index >= 0) db.articles[index] = { ...db.articles[index], ...payload, createdAt: db.articles[index].createdAt };
  else db.articles.unshift(payload);
  selectedArticleId = id;
  saveDb();
  await upsertSupabase('artigos', payload);
  clearForm();
  refresh();
  navigate(editorReturnPage || 'articles');
}

function clearForm() {
  ['articleId','formTitle','formSummary','formTags','formImage','formVideo'].forEach(id => $(id).value = '');
  setEditorContent('');
  if ($('formStatus')) $('formStatus').value = 'publicado';
  if ($('formSystem')) $('formSystem').selectedIndex = 0;
  if ($('formDepartment')) $('formDepartment').selectedIndex = 0;
  if ($('articleEditorTitle')) $('articleEditorTitle').textContent = 'Novo artigo';
  if ($('formKind')) $('formKind').value = 'article';
  selectedArticleId = null;
  renderComments();
}

async function addComment() {
  if (!selectedArticleId) return alert('Selecione um artigo para comentar.');
  const text = $('adminComment').value.trim();
  if (!text) return;
  const a = db.articles.find(item => item.id === selectedArticleId);
  a.comments.unshift({ text, author: currentUser?.name || 'Administrador', date: new Date().toLocaleString('pt-BR') });
  $('adminComment').value = '';
  saveDb();
  await upsertSupabase('artigos', a);
  renderComments();
}


function renderArticleChart() {
  const chart = $('articlesChart');
  if (!chart) return;
  const counts = db.systems.map(system => ({
    name: system.name,
    count: db.articles.filter(article => (article.kind || 'article') === 'article' && article.system === system.id).length
  }));
  const max = Math.max(1, ...counts.map(item => item.count));
  chart.innerHTML = counts.map(item => `
    <div class="chart-row">
      <div class="chart-label">${item.name}</div>
      <div class="chart-track">
        <div class="chart-bar" style="width:${Math.max(8, (item.count / max) * 100)}%"></div>
      </div>
      <strong>${item.count}</strong>
    </div>
  `).join('');
}

function renderClients() {
  $('clientsTable').innerHTML = db.clients.map(c => `
    <tr>
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.company}</td>
      <td><span class="role-badge">${c.role}</span></td>
      <td><button class="small-btn" onclick="resetPassword('cliente', '${c.email}')">Reset de senha</button></td>
    </tr>
  `).join('') || '<tr><td colspan="5">Nenhum cliente cadastrado.</td></tr>';
}

function renderAgencyUsers() {
  $('agencyTable').innerHTML = db.agencyUsers.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.department}</td>
      <td><span class="role-badge">${u.access}</span></td>
      <td><button class="small-btn" onclick="resetPassword('agência', '${u.email}')">Reset de senha</button></td>
    </tr>
  `).join('') || '<tr><td colspan="5">Nenhum usuário agência cadastrado.</td></tr>';
}

async function addClient() {
  const name = $('clientName').value.trim();
  const email = $('clientEmail').value.trim();
  const company = $('clientCompany').value.trim();
  if (!name || !email || !company) return alert('Preencha nome, e-mail e empresa do cliente.');
  const payload = { id: crypto.randomUUID(), name, email, company, role: 'usuário comum' };
  db.clients.unshift(payload);
  ['clientName','clientEmail','clientCompany'].forEach(id => $(id).value = '');
  saveDb();
  await upsertSupabase('clientes', payload);
  renderClients();
}

async function addAgencyUser() {
  const name = $('agencyName').value.trim();
  const email = $('agencyEmail').value.trim();
  const department = $('agencyDepartment').value;
  const access = $('agencyAccess').value;
  const password = $('agencyPassword')?.value.trim() || '';

  if (!name || !email || !department || !access) {
    return alert('Preencha nome, e-mail, departamento e nível de acesso do usuário agência.');
  }

  if (supabaseDb && !password) {
    return alert('Informe uma senha temporária para criar o login real no Supabase.');
  }

  if (supabaseDb) {
    const createdUser = await createUserSupabase({
      nome: name,
      email,
      password,
      perfil: access,
      departamento: department,
      empresa: 'Dynamic Travel'
    });

    if (!createdUser) return;
  }

  const payload = { id: crypto.randomUUID(), name, email, department, access };
  db.agencyUsers.unshift(payload);
  ['agencyName','agencyEmail','agencyPassword'].forEach(id => { if ($(id)) $(id).value = ''; });
  saveDb();
  await upsertSupabase('usuarios_agencia', payload);
  renderAgencyUsers();
  renderArticleChart();
  renderProcesses();
  alert('Usuário cadastrado. Ele já pode acessar com e-mail e senha após confirmação, se o Supabase exigir confirmação de e-mail.');
}

function renderProcesses(systemFilter = selectedProcessSystem) {
  const container = $('processList');
  const cards = $('processCards');
  if (!container || !cards) return;
  selectedProcessSystem = systemFilter || '';
  cards.innerHTML = db.systems.map(s => {
    const count = db.articles.filter(a => (a.kind || 'article') === 'process' && a.system === s.id && (isAdmin() || a.status === 'publicado')).length;
    return `<button class="process-filter-card ${selectedProcessSystem === s.id ? 'active' : ''}" onclick="selectProcessSystem('${s.id}')"><strong>${s.name}</strong><span>${count} processos</span></button>`;
  }).join('');
  let processes = db.articles.filter(a => (a.kind || 'article') === 'process' && (isAdmin() || a.status === 'publicado'));
  if (selectedProcessSystem) processes = processes.filter(a => a.system === selectedProcessSystem);
  container.innerHTML = processes.length ? processes.map(a => `
    <article class="process-row" onclick="openArticle('${a.id}')">
      <div>
        <strong>${a.title}</strong>
        <p>${a.summary}</p>
        <div class="meta"><span class="tag">${systemName(a.system)}</span><span class="tag">${deptName(a.department)}</span><span class="tag status ${a.status}">${a.status}</span></div>
      </div>
      <button class="ghost-btn" onclick="event.stopPropagation(); openArticle('${a.id}')">Abrir</button>
    </article>
  `).join('') : '<div class="panel"><p class="muted">Nenhum processo interno cadastrado para este filtro.</p></div>';
}

function selectProcessSystem(id) {
  selectedProcessSystem = selectedProcessSystem === id ? '' : id;
  renderProcesses();
}

function newArticle(kind = 'article') {
  clearForm();
  editorReturnPage = kind === 'process' ? 'processes' : 'articles';
  if ($('formKind')) $('formKind').value = kind;
  if ($('formStatus')) $('formStatus').value = 'publicado';
  $('articleEditorTitle').textContent = kind === 'process' ? 'Novo processo interno' : 'Novo artigo';
  if ($('articleEditorDescription')) $('articleEditorDescription').textContent = kind === 'process' ? 'Cadastre processos internos que aparecerão somente na tela Processos internos.' : 'Cadastre ou edite conteúdos da base de conhecimento DynamicDoc.';
  navigate('articleEditor');
}


function resetPassword(type, email) {
  alert(`Reset de senha solicitado para ${type}: ${email}\n\nNeste protótipo, o envio é apenas simulado.`);
}

function navigate(page) {
  if (page === 'admin' && !isAdmin()) page = 'home';
  if (page === 'articleEditor' && !canSeeInternalProcesses()) page = 'articles';
  if (page === 'processes' && !canSeeInternalProcesses()) page = 'home';
  if (page === 'departments' && isCommonUser()) page = 'home';
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
  $(page).classList.add('active-page');
  document.querySelectorAll('.nav-link').forEach(btn => btn.classList.toggle('active', btn.dataset.page === page));
  const titles = { access: 'Acesso restrito', home: 'Base de conhecimento', articles: 'Artigos', favorites: 'Favoritos', systems: 'Sistemas', departments: 'Departamentos', processes: 'Processos internos', admin: 'Administração', articleEditor: $('formKind')?.value === 'process' ? ($('articleId')?.value ? 'Editar processo interno' : 'Criar processo interno') : ($('articleId')?.value ? 'Editar artigo' : 'Criar artigo') };
  $('pageTitle').textContent = titles[page];
  document.body.classList.toggle('access-mode', page === 'access');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterBySystem(id) {
  navigate('articles');
  $('filterSystem').value = id;
  renderArticles();
}
function filterByDepartment(id) {
  navigate('articles');
  $('filterDepartment').value = id;
  renderArticles();
}

function refresh() {
  updateAccessView();
  fillSelects();
  renderCards();
  renderArticles('recentArticles', 3);
  renderArticles('articlesList');
  renderAdminArticles();
  renderClients();
  renderAgencyUsers();
  renderArticleChart();
  renderProcesses();
}

function renderProcesses(systemFilter = selectedProcessSystem) {
  const container = $('processList');
  const cards = $('processCards');
  if (!container || !cards) return;
  selectedProcessSystem = systemFilter || '';
  cards.innerHTML = db.systems.map(s => {
    const count = db.articles.filter(a => (a.kind || 'article') === 'process' && a.system === s.id && (isAdmin() || a.status === 'publicado')).length;
    return `<button class="process-filter-card ${selectedProcessSystem === s.id ? 'active' : ''}" onclick="selectProcessSystem('${s.id}')"><strong>${s.name}</strong><span>${count} processos</span></button>`;
  }).join('');
  let processes = db.articles.filter(a => (a.kind || 'article') === 'process' && (isAdmin() || a.status === 'publicado'));
  if (selectedProcessSystem) processes = processes.filter(a => a.system === selectedProcessSystem);
  container.innerHTML = processes.length ? processes.map(a => `
    <article class="process-row" onclick="openArticle('${a.id}')">
      <div>
        <strong>${a.title}</strong>
        <p>${a.summary}</p>
        <div class="meta"><span class="tag">${systemName(a.system)}</span><span class="tag">${deptName(a.department)}</span><span class="tag status ${a.status}">${a.status}</span></div>
      </div>
      <button class="ghost-btn" onclick="event.stopPropagation(); openArticle('${a.id}')">Abrir</button>
    </article>
  `).join('') : '<div class="panel"><p class="muted">Nenhum processo interno cadastrado para este filtro.</p></div>';
}

function selectProcessSystem(id) {
  selectedProcessSystem = selectedProcessSystem === id ? '' : id;
  renderProcesses();
}

function newArticle(kind = 'article') {
  clearForm();
  editorReturnPage = kind === 'process' ? 'processes' : 'articles';
  if ($('formKind')) $('formKind').value = kind;
  if ($('formStatus')) $('formStatus').value = 'publicado';
  $('articleEditorTitle').textContent = kind === 'process' ? 'Novo processo interno' : 'Novo artigo';
  if ($('articleEditorDescription')) $('articleEditorDescription').textContent = kind === 'process' ? 'Cadastre processos internos que aparecerão somente na tela Processos internos.' : 'Cadastre ou edite conteúdos da base de conhecimento DynamicDoc.';
  navigate('articleEditor');
}



// ===== Melhorias MVP: dashboard, favoritos, busca ampla, avaliações, relacionados e processos simplificados =====
function articleText(a) {
  return `${a.title || ''} ${a.summary || ''} ${a.content || ''} ${(a.tags || []).join(' ')} ${systemName(a.system)} ${deptName(a.department)} ${(a.history || []).map(h => h.text).join(' ')}`.toLowerCase();
}

function visibleArticles(kind = 'article') {
  return db.articles.filter(a => (a.kind || 'article') === kind && (isAdmin() || a.status === 'publicado'));
}

function renderDashboard() {
  const el = $('dashboardStats');
  if (!el) return;
  const articles = visibleArticles('article').length;
  const processes = visibleArticles('process').length;
  const systems = db.systems.length;
  const last = db.articles[0]?.updatedAt || new Date().toLocaleDateString('pt-BR');
  el.innerHTML = `
    <article class="stat-card"><strong>${articles}</strong><span>Artigos publicados</span></article>
    <article class="stat-card"><strong>${processes}</strong><span>Processos internos</span></article>
    <article class="stat-card"><strong>${systems}</strong><span>Sistemas cadastrados</span></article>
    <article class="stat-card"><strong>${last}</strong><span>Última atualização</span></article>
  `;
}

function renderPortalBanner() {
  const banner = $('portalBanner');
  if (!banner) return;
  banner.classList.toggle('hidden', !db.portalBanner);
  banner.innerHTML = db.portalBanner ? `<strong>⚠️ Aviso:</strong> ${db.portalBanner}` : '';
  if ($('portalBannerInput')) $('portalBannerInput').value = db.portalBanner || '';
}

function toggleFavorite(id) {
  db.favorites = db.favorites || [];
  db.favorites = db.favorites.includes(id) ? db.favorites.filter(f => f !== id) : [...db.favorites, id];
  saveDb();
  renderArticles('articlesList');
  renderArticles('recentArticles', 3);
  renderFavorites();
}

function renderFavorites() {
  const el = $('favoritesList');
  if (!el) return;
  const favs = visibleArticles('article').filter(a => (db.favorites || []).includes(a.id));
  el.innerHTML = favs.length ? favs.map(articleRow).join('') : '<div class="panel"><p class="muted">Nenhum favorito marcado ainda. Clique na estrela de um artigo para salvar aqui.</p></div>';
}

function rateArticle(id, type) {
  const a = db.articles.find(item => item.id === id);
  if (!a) return;
  if (type === 'like') a.likes = (a.likes || 0) + 1;
  if (type === 'dislike') a.dislikes = (a.dislikes || 0) + 1;
  saveDb();
  upsertSupabase('artigos', a);
  openArticle(id);
}

function articlesRelatedTo(article) {
  const tags = article.tags || [];
  return visibleArticles(article.kind || 'article')
    .filter(a => a.id !== article.id)
    .map(a => ({
      ...a,
      score: (a.system === article.system ? 2 : 0) + (a.department === article.department ? 1 : 0) + (a.tags || []).filter(t => tags.includes(t)).length
    }))
    .filter(a => a.score > 0)
    .sort((a,b) => b.score - a.score)
    .slice(0, 3);
}

function articleRow(a) {
  const fav = (db.favorites || []).includes(a.id);
  return `
    <article class="article-item">
      <div>
        <h4>${a.title}</h4>
        <p>${a.summary}</p>
        <div class="meta">
          <span class="tag">${systemName(a.system)}</span>
          <span class="tag">${deptName(a.department)}</span>
          <span class="tag status ${a.status}">${a.status}</span>
          ${(a.tags || []).slice(0, 4).map(t => `<button class="tag clickable-tag" onclick="searchTag('${t}')">#${t}</button>`).join('')}
        </div>
      </div>
      <div class="article-actions">
        <button class="ghost-btn" onclick="toggleFavorite('${a.id}')">${fav ? '★' : '☆'} Favorito</button>
        <button class="ghost-btn" onclick="openArticle('${a.id}')">Abrir</button>
        ${canSeeInternalProcesses() && (a.kind || 'article') === 'article' ? `<button class="ghost-btn" onclick="editArticle('${a.id}')">Editar</button>${isAdmin() ? `<button class="danger-btn" onclick="deleteArticle('${a.id}')">Excluir</button>` : ''}` : ''}
      </div>
    </article>
  `;
}

function searchTag(tag) {
  navigate('articles');
  $('articleSearch').value = tag;
  renderArticles('articlesList');
}

function renderArticles(targetId = 'articlesList', limit = null) {
  const query = (targetId === 'recentArticles' ? ($('globalSearch')?.value || '') : ($('articleSearch')?.value || '')).toLowerCase();
  const system = $('filterSystem')?.value || '';
  const department = $('filterDepartment')?.value || '';
  const status = isAdmin() ? ($('filterStatus')?.value ?? 'publicado') : 'publicado';
  let articles = db.articles.filter(a => {
    if ((a.kind || 'article') !== 'article') return false;
    return (!query || articleText(a).includes(query)) &&
      (!system || a.system === system) &&
      (!department || a.department === department) &&
      (!status || a.status === status) &&
      (isAdmin() || a.status === 'publicado');
  });
  articles = articles.sort((a,b) => (db.favorites || []).includes(b.id) - (db.favorites || []).includes(a.id));
  if (limit) articles = articles.slice(0, limit);
  $(targetId).innerHTML = articles.length ? articles.map(articleRow).join('') : '<div class="panel"><p class="muted">Nenhum artigo encontrado.</p></div>';
}

function openArticle(id) {
  const a = db.articles.find(item => item.id === id);
  if (!a) return;
  selectedArticleId = id;
  const related = articlesRelatedTo(a);
  const history = a.history?.length ? a.history.slice(0, 4).map(h => `<li>${h.date} — ${h.text}</li>`).join('') : `<li>${a.updatedAt || a.createdAt} — Versão inicial publicada.</li>`;
  $('articleDetails').innerHTML = `
    <span class="pill" style="background:#e8f1ff;color:#053798">${systemName(a.system)} • ${deptName(a.department)}</span>
    <h1>${a.title}</h1>
    <p class="muted">Atualizado em ${a.updatedAt} • Versão ${a.version || '1.0'} • Status: ${a.status}</p>
    ${isAdmin() ? `<p><span class="tag status ${a.homologation || 'homologado'}">${a.homologation || 'homologado'}</span></p>` : ''}
    ${a.image ? `<img class="article-cover" src="${a.image}" alt="Imagem do artigo">` : ''}
    <p><strong>${a.summary}</strong></p>
    <div class="article-body">${formatContentForDisplay(a.content)}</div>
    ${a.video ? `<div class="video-box"><strong>Vídeo de apoio:</strong><br><a href="${a.video}" target="_blank">Abrir vídeo</a></div>` : ''}
    <div class="meta">${(a.tags || []).map(t => `<button class="tag clickable-tag" onclick="closeArticleModal(); searchTag('${t}')">#${t}</button>`).join('')}</div>
    <div class="feedback-box"><strong>Este artigo ajudou?</strong><button class="ghost-btn" onclick="rateArticle('${a.id}','like')">👍 Sim (${a.likes || 0})</button><button class="ghost-btn" onclick="rateArticle('${a.id}','dislike')">👎 Não (${a.dislikes || 0})</button></div>
    <div class="history-box"><strong>Histórico de atualização</strong><ul>${history}</ul></div>
    ${related.length ? `<div class="related-box"><strong>Artigos relacionados</strong>${related.map(r => `<button class="related-link" onclick="openArticle('${r.id}')">${r.title}</button>`).join('')}</div>` : ''}
    ${canSuggest() && !isAdmin() ? `<hr><button class="ghost-btn" onclick="alert('Sugestão registrada para revisão administrativa. Esta função está simulada neste protótipo.')">Sugerir alteração</button>` : ''}
    <div class="article-bottom-actions"><button class="primary-btn" onclick="closeArticleModal()">Fechar artigo</button></div>
  `;
  $('articleModal').classList.remove('hidden');
}

function renderProcesses() {
  const board = $('processBoard');
  const list = $('processList');
  if (!board || !list) return;
  board.innerHTML = db.systems.map(s => {
    const processes = visibleArticles('process').filter(a => a.system === s.id);
    return `
      <article class="process-column">
        <h4>${s.name}</h4>
        ${processes.length ? processes.map(p => `<button class="process-link" onclick="openArticle('${p.id}')"><strong>${p.title}</strong><span>${p.summary}</span></button>`).join('') : '<p class="muted small-muted">Nenhum processo cadastrado.</p>'}
      </article>
    `;
  }).join('');
  list.innerHTML = '';
}

function saveBanner() {
  db.portalBanner = $('portalBannerInput').value.trim();
  saveDb();
  renderPortalBanner();
}

function clearBanner() {
  db.portalBanner = '';
  saveDb();
  renderPortalBanner();
}

function refresh() {
  updateAccessView();
  fillSelects();
  renderCards();
  renderDashboard();
  renderPortalBanner();
  renderArticles('recentArticles', 3);
  renderArticles('articlesList');
  renderFavorites();
  renderAdminArticles();
  renderClients();
  renderAgencyUsers();
  renderArticleChart();
  renderProcesses();
}

const originalSaveArticle = saveArticle;
saveArticle = async function() {
  const id = $('articleId').value || crypto.randomUUID();
  const old = db.articles.find(a => a.id === id);
  await originalSaveArticle();
  const saved = db.articles.find(a => a.id === id);
  if (saved) {
    saved.version = old?.version ? String((parseFloat(old.version) + 0.1).toFixed(1)) : '1.0';
    saved.history = old?.history || [];
    saved.history.unshift({ date: new Date().toLocaleDateString('pt-BR'), text: old ? 'Artigo atualizado.' : 'Artigo criado.' });
    saveDb();
    await upsertSupabase('artigos', saved);
  }
  refresh();
};


document.querySelectorAll('.nav-link').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.page)));

$('loginBtn').addEventListener('click', async () => {
  if (currentUser) {
    await logoutSupabase();
    return;
  }
  $('loginPanel').classList.remove('hidden');
});

$('closeLogin').addEventListener('click', () => $('loginPanel').classList.add('hidden'));

if ($('forgotPasswordBtn')) {
  $('forgotPasswordBtn').addEventListener('click', async () => {
    const email = $('loginEmail').value.trim();
    if (!email) return alert('Informe seu e-mail para redefinir a senha.');
    await resetPasswordSupabase(email);
  });
}

if ($('confirmLogin')) {
  $('confirmLogin').addEventListener('click', async () => {
    const email = $('loginEmail').value.trim();
    const password = $('loginPassword').value.trim();

    if (!email || !password) return alert('Preencha e-mail e senha.');

    const ok = await loginWithSupabase(email, password);
    if (ok) $('loginPanel').classList.add('hidden');
  });
}

document.querySelectorAll('.access-tab').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.access-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.access-box').forEach(box => box.classList.remove('active-access-box'));
  btn.classList.add('active');
  $(btn.dataset.accessTab).classList.add('active-access-box');
}));

if ($('accessLoginBtn')) {
  $('accessLoginBtn').addEventListener('click', async () => {
    const email = $('accessEmail').value.trim();
    const password = $('accessPassword').value.trim();
    if (!email || !password) return alert('Preencha e-mail e senha para acessar.');
    await loginWithSupabase(email, password);
  });
}

if ($('recoverBtn')) {
  $('recoverBtn').addEventListener('click', async () => {
    const email = $('recoverEmail').value.trim();
    if (!email) return alert('Informe o e-mail cadastrado.');
    await resetPasswordSupabase(email);
    $('recoverMessage').classList.remove('hidden');
  });
}

if ($('requestAccessBtn')) {
  $('requestAccessBtn').addEventListener('click', async () => {
    const name = $('requestName').value.trim();
    const email = $('requestEmail').value.trim();
    const company = $('requestCompany').value.trim();
    const department = $('requestDepartment').value;
    if (!name || !email || !company) return alert('Preencha nome, e-mail corporativo e empresa.');
    const payload = { id: crypto.randomUUID(), name, email, company, role: 'usuário comum', department };
    db.clients.unshift(payload);
    saveDb();
    await upsertSupabase('clientes', payload);
    renderClients();
    $('requestMessage').classList.remove('hidden');
    ['requestName','requestEmail','requestCompany','requestReason'].forEach(id => { if ($(id)) $(id).value = ''; });
  });
}

async function resetPassword(type, email) {
  await resetPasswordSupabase(email);
}

$('closeArticle').addEventListener('click', closeArticleModal);
$('articleModal').addEventListener('click', (event) => {
  if (event.target.id === 'articleModal') closeArticleModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !$('articleModal').classList.contains('hidden')) closeArticleModal();
});
$('searchBtn').addEventListener('click', () => { navigate('articles'); $('articleSearch').value = $('globalSearch').value; renderArticles(); });
$('globalSearch').addEventListener('keydown', e => { if (e.key === 'Enter') $('searchBtn').click(); });
['articleSearch','filterSystem','filterDepartment','filterStatus'].forEach(id => $(id).addEventListener('input', () => renderArticles()));
$('addComment').addEventListener('click', addComment);
$('addClient').addEventListener('click', addClient);
$('addAgencyUser').addEventListener('click', addAgencyUser);
if ($('saveBannerBtn')) $('saveBannerBtn').addEventListener('click', saveBanner);
if ($('clearBannerBtn')) $('clearBannerBtn').addEventListener('click', clearBanner);
$('newArticleBtn').addEventListener('click', () => newArticle('article'));
$('newProcessBtn').addEventListener('click', () => newArticle('process'));
$('backToArticlesBtn').addEventListener('click', () => navigate(editorReturnPage || 'articles'));
$('saveArticle').addEventListener('click', saveArticle);
$('clearArticleForm').addEventListener('click', clearForm);

document.querySelectorAll('.doc-toolbar button').forEach(button => {
  button.addEventListener('click', () => {
    const command = button.dataset.command;
    const value = button.dataset.value || null;
    const action = button.dataset.action;
    if (command) return applyEditorCommand(command, value);
    if (action === 'link') return insertEditorLink();
    if (action === 'image') return insertEditorImage();
    if (action === 'video') return insertEditorVideo();
  });
});

async function startDynamicDoc() {
  await loadSupabaseData();

  if (supabaseDb) {
    currentUser = await getLoggedUser();
    if (currentUser) saveUser();
    else localStorage.removeItem('dynamicdoc-user');
  }

  refresh();
  navigate(document.querySelector('.page.active-page')?.id || 'home');
}

startDynamicDoc();

