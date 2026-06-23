const $ = (id) => document.getElementById(id);
const nowBR = () => new Date().toLocaleString('pt-BR');
const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random()));

const initialData = {
  systems:[
    {id:'argo',name:'Argo',description:'Cadastros, reservas, políticas, aprovações, emissões e relatórios.'},
    {id:'reserve',name:'Reserve',description:'Configurações, consultas, erros comuns e operação.'},
    {id:'wts',name:'WTS',description:'Procedimentos e apoio para atendimento WTS.'},
    {id:'reserva-facil',name:'Reserva Fácil',description:'Conteúdos operacionais e suporte.'},
    {id:'expense',name:'Expense',description:'Prestação de contas, despesas, relatórios e reembolsos.'}
  ],
  departments:[
    {id:'suporte',name:'Suporte'}, {id:'financeiro',name:'Financeiro'}, {id:'eventos',name:'Eventos'}, {id:'operacao',name:'Operação'}, {id:'rh',name:'RH'}
  ],
  modules:[
    {id:'argo-cadastros',system:'argo',name:'Cadastros'}, {id:'argo-aprovacoes',system:'argo',name:'Aprovações'}, {id:'argo-politicas',system:'argo',name:'Políticas'}, {id:'argo-relatorios',system:'argo',name:'Relatórios'},
    {id:'reserve-cadastros',system:'reserve',name:'Cadastros'}, {id:'reserve-emissoes',system:'reserve',name:'Emissões'}, {id:'expense-despesas',system:'expense',name:'Despesas'},
    {id:'wts-operacao',system:'wts',name:'Operação'}, {id:'reserva-facil-pesquisa',system:'reserva-facil',name:'Pesquisa'}
  ],
  users:[
    {id:uid(),name:'Luiza Saraiva',email:'luiza.saraiva@dynamictravel.com',role:'admin',department:'suporte'},
    {id:uid(),name:'Gestor de Conteúdo',email:'conteudo@dynamictravel.com',role:'gestor',department:'suporte'},
    {id:uid(),name:'Equipe Eventos',email:'eventos@dynamictravel.com',role:'colaborador',department:'eventos'}
  ],
  articles:[
    {id:uid(),kind:'article',visibility:'publico',title:'Cadastro de usuários no Argo',summary:'Passo a passo para orientar o cadastro e validação de usuários no Argo.',system:'argo',module:'argo-cadastros',department:'suporte',status:'publicado',tags:['cadastro','usuário','argo','login'],content:'1. Acesse o painel administrativo do cliente.\n2. Localize a área de usuários.\n3. Confira nome, e-mail e perfil de acesso.\n4. Valide centro de custo, empresa, comunidade e permissões.\n5. Salve o cadastro e oriente o primeiro acesso.',image:'',video:'',file:'',internalNote:'Conferir sempre o link correto do cliente antes de validar erro de acesso.',version:'1.0',versions:[],comments:[],views:12,likes:0,dislikes:0,createdAt:nowBR(),updatedAt:nowBR()},
    {id:uid(),kind:'article',visibility:'publico',title:'Diferença entre solicitação, reserva e emissão',summary:'Explica as principais etapas de uma viagem no OBT.',system:'argo',module:'argo-aprovacoes',department:'suporte',status:'publicado',tags:['solicitação','reserva','emissão'],content:'Solicitação é o pedido inicial. Reserva é quando o item foi selecionado e bloqueado. Emissão é a confirmação final com bilhete/voucher emitido. Em caso de dúvidas, consulte status, histórico e logs da solicitação.',image:'',video:'',file:'',internalNote:'Bom artigo para clientes novos.',version:'1.0',versions:[],comments:[],views:8,likes:0,dislikes:0,createdAt:nowBR(),updatedAt:nowBR()},
    {id:uid(),kind:'process',visibility:'interno',title:'Fluxo interno de atendimento para eventos',summary:'Modelo de consulta para equipes que atendem eventos e grupos.',system:'wts',module:'wts-operacao',department:'eventos',status:'publicado',tags:['eventos','operação','wts'],content:'Antes de iniciar o atendimento, confirme período, localidade, solicitante, tipo de evento e quantidade de participantes. Registre todas as etapas para manter visibilidade entre Suporte, Operação, Comercial e Gestão.',image:'',video:'',file:'',internalNote:'Utilizar em onboarding de novos colaboradores de Eventos.',version:'1.0',versions:[],comments:[],views:5,likes:0,dislikes:0,createdAt:nowBR(),updatedAt:nowBR()}
  ],
  favorites:[], history:[], searchLogs:[],
  tracks:[
    {id:uid(),title:'Trilha Argo Básico',description:'Fundamentos do Argo para novos colaboradores.',lessons:['Visão geral do Argo','Cadastros','Aprovações','Reservas e emissões'],progress:50},
    {id:uid(),title:'Onboarding Dynamic',description:'Conteúdos iniciais para chegada de novos colaboradores.',lessons:['Quem somos','Sistemas internos','Canais de atendimento','Boas práticas'],progress:25},
    {id:uid(),title:'Expense e Relatórios',description:'Prestação de contas, despesas e consultas gerenciais.',lessons:['Expense básico','Despesas','Relatórios','Erros comuns'],progress:0}
  ]
};

let db = JSON.parse(localStorage.getItem('dynamicdoc-product-db') || 'null') || initialData;
for (const k of Object.keys(initialData)) db[k] = db[k] || initialData[k];
let currentUser = JSON.parse(localStorage.getItem('dynamicdoc-product-user') || 'null');
let selectedArticleId = null;
let editorReturnPage = 'articles';
const saveDb = () => localStorage.setItem('dynamicdoc-product-db', JSON.stringify(db));
const saveUser = () => currentUser ? localStorage.setItem('dynamicdoc-product-user', JSON.stringify(currentUser)) : localStorage.removeItem('dynamicdoc-product-user');

const supabaseSettings = window.DynamicDocSupabase || {};
const supabaseReady = Boolean(window.supabase && supabaseSettings.url && supabaseSettings.anonKey && !supabaseSettings.url.includes('SEU-PROJETO'));
const supabaseDb = supabaseReady ? window.supabase.createClient(supabaseSettings.url, supabaseSettings.anonKey) : null;

const isStaff = () => ['colaborador','gestor','admin'].includes(currentUser?.role);
const canManageContent = () => ['gestor','admin'].includes(currentUser?.role);
const isAdmin = () => currentUser?.role === 'admin';
const roleLabel = (role) => ({usuario:'Usuário',colaborador:'Colaborador',gestor:'Gestor de Conteúdo',admin:'Administrador'}[role] || 'Visitante');
const normalize = (v) => (v || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

async function fetchTable(table, select='*'){
  if(!supabaseDb) return {data:null,error:null};
  try { return await supabaseDb.from(table).select(select); }
  catch(e){ return {data:null,error:{message:e.message}}; }
}

function normalizeArticle(a){
  const tags = Array.isArray(a.tags)
    ? a.tags
    : (typeof a.tags === 'string' ? a.tags.split(',').map(t=>t.trim()).filter(Boolean) : []);

  const kind = a.kind || a.tipo_conteudo || a.tipo || (a.visibility === 'interno' || a.visibilidade === 'interno' ? 'process' : 'article');
  const visibility = a.visibility || a.visibilidade || (kind === 'process' ? 'interno' : 'publico');

  return {
    ...a,
    id: a.id || uid(),
    kind,
    visibility,
    title: a.title || a.titulo || a.nome || 'Sem título',
    summary: a.summary || a.resumo || a.descricao || '',
    content: a.content || a.conteudo || a.corpo || '',
    status: a.status || 'publicado',
    system: a.system || a.sistema || a.system_id || '',
    module: a.module || a.modulo || a.module_id || '',
    department: a.department || a.departamento || 'suporte',
    tags,
    comments: Array.isArray(a.comments) ? a.comments : [],
    versions: Array.isArray(a.versions) ? a.versions : [],
    internalNote: a.internalNote || a.internal_note || a.observacao_interna || '',
    image: a.image || a.imagem || '',
    video: a.video || '',
    file: a.file || a.arquivo || '',
    version: a.version || a.versao || '1.0',
    views: Number(a.views || a.visualizacoes || 0),
    likes: Number(a.likes || 0),
    dislikes: Number(a.dislikes || 0),
    createdAt: a.createdAt || a.created_at || a.criado_em || nowBR(),
    updatedAt: a.updatedAt || a.updated_at || a.atualizado_em || nowBR()
  };
}

function normalizeModule(m){
  return { id: m.id, system: m.system || m.sistema, name: m.name || m.nome };
}

function normalizeProfile(x){
  return {id:x.id || uid(), name:x.name||x.nome||x.email, email:x.email, role:x.role||x.perfil||x.access||'colaborador', department:x.department||x.departamento||'suporte'};
}

async function syncFromSupabase(){
  if(!supabaseDb) return;
  try{
    // Compatível com a base antiga do DynamicDoc: artigos, modulos, profiles.
    // Se a tabela nova existir, também funciona; mas prioriza artigos para não perder os conteúdos já cadastrados.
    const [artigosRes, articlesRes, sistemasRes, systemsRes, modulosRes, modulesRes, profilesRes, tracksRes] = await Promise.all([
      fetchTable('artigos'),
      fetchTable('articles'),
      fetchTable('sistemas'),
      fetchTable('systems'),
      fetchTable('modulos'),
      fetchTable('modules'),
      fetchTable('profiles'),
      fetchTable('training_tracks')
    ]);

    const artigosData = artigosRes.data?.length ? artigosRes.data : articlesRes.data;
    if(artigosData?.length) db.articles = artigosData.map(normalizeArticle);

    const sistemasData = sistemasRes.data?.length ? sistemasRes.data : systemsRes.data;
    if(sistemasData?.length) db.systems = sistemasData.map(s=>({id:s.id, name:s.name||s.nome, description:s.description||s.descricao||''}));

    const modulosData = modulosRes.data?.length ? modulosRes.data : modulesRes.data;
    if(modulosData?.length) db.modules = modulosData.map(normalizeModule);

    if(profilesRes.data?.length) db.users = profilesRes.data.map(normalizeProfile);
    if(tracksRes.data?.length) db.tracks = tracksRes.data.map(x=>({...x,lessons:x.lessons||[]}));

    saveDb();
  }catch(e){
    console.warn('Supabase offline/local:', e.message);
  }
}

const ARTICLE_TABLE = 'artigos';
const MODULE_TABLE = 'modulos';
const SYSTEM_TABLE = 'systems';
const PROFILE_TABLE = 'profiles';

async function upsert(table,payload){ if(!supabaseDb) return; const {error}=await supabaseDb.from(table).upsert(payload); if(error) console.warn(error.message); }
async function removeRemote(table,id){ if(!supabaseDb) return; const {error}=await supabaseDb.from(table).delete().eq('id',id); if(error) console.warn(error.message); }

function applyAccess(){
  $('currentUserName').textContent = currentUser?.name || 'Visitante';
  $('currentUserRole').textContent = currentUser ? roleLabel(currentUser.role) : 'Portal público';
  $('loginBtn').classList.toggle('hidden', !!currentUser);
  $('logoutBtn').classList.toggle('hidden', !currentUser);
  document.querySelectorAll('.staff-only').forEach(el=>el.classList.toggle('hidden', !isStaff()));
  document.querySelectorAll('.content-manager-only').forEach(el=>el.classList.toggle('hidden', !canManageContent()));
  document.querySelectorAll('.admin-only').forEach(el=>el.classList.toggle('hidden', !isAdmin()));
}

function navigate(page){
  if(page==='admin' && !isAdmin()) page='home';
  if(page==='processes' && !isStaff()) page='home';
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active-page'));
  $(page)?.classList.add('active-page');
  document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active', b.dataset.page===page));
  const titles={home:'Base de conhecimento',articles:'Artigos',systems:'Sistemas',processes:'Processos internos',academy:'Academia Dynamic',favorites:'Favoritos',admin:'Administração',articleEditor:'Editor de conteúdo'};
  $('pageTitle').textContent = titles[page] || 'DynamicDoc';
  renderAll(); window.scrollTo(0,0);
}

function renderAll(){applyAccess(); populateSelects(); renderDashboard(); renderCards(); renderArticles(); renderProcesses(); renderFavorites(); renderAcademy(); renderAdmin();}
function populateSelects(){
  const sysOpts = ['<option value="">Todos os sistemas</option>', ...db.systems.map(s=>`<option value="${s.id}">${s.name}</option>`)].join('');
  ['filterSystem','processSystem'].forEach(id=>$(id) && ($(id).innerHTML=sysOpts));
  const sysOnly = db.systems.map(s=>`<option value="${s.id}">${s.name}</option>`).join('');
  ['articleSystem','moduleSystem'].forEach(id=>$(id) && ($(id).innerHTML=sysOnly));
  const modOpts = ['<option value="">Todos os módulos</option>', ...db.modules.map(m=>`<option value="${m.id}">${m.name}</option>`)].join('');
  ['filterModule','processModule'].forEach(id=>$(id) && ($(id).innerHTML=modOpts));
  const depOpts = db.departments.map(d=>`<option value="${d.id}">${d.name}</option>`).join('');
  ['articleDepartment','userDepartment'].forEach(id=>$(id) && ($(id).innerHTML=depOpts));
  updateModuleOptions();
}
function updateModuleOptions(){
  const sys = $('articleSystem')?.value || db.systems[0]?.id;
  const mods = db.modules.filter(m=>m.system===sys);
  if($('articleModule')) $('articleModule').innerHTML = mods.map(m=>`<option value="${m.id}">${m.name}</option>`).join('') || '<option value="">Sem módulo</option>';
}

function visibleContents(){return db.articles.filter(a => a.status !== 'arquivado' && (a.status==='publicado' || isStaff()) && (a.visibility!=='interno' || isStaff()));}
function articleMatches(a,q){q=normalize(q); return !q || [a.title,a.summary,a.content,a.system,a.module,a.department,(a.tags||[]).join(' ')].some(v=>normalize(v).includes(q));}
function filteredArticles(kind='article'){
  const q = $('articleSearch')?.value || $('globalSearch')?.value || '';
  const sys = $('filterSystem')?.value || '';
  const mod = $('filterModule')?.value || '';
  const st = $('filterStatus')?.value ?? 'publicado';
  return visibleContents().filter(a => (a.kind||'article')===kind && articleMatches(a,q) && (!sys||a.system===sys) && (!mod||a.module===mod) && (!st||a.status===st));
}

function renderDashboard(){
  const published = db.articles.filter(a=>a.status==='publicado').length;
  const drafts = db.articles.filter(a=>a.status==='rascunho'||a.status==='revisao').length;
  const views = db.articles.reduce((s,a)=>s+(a.views||0),0);
  const users = db.users.length;
  const cards = [{n:published,t:'Publicados'},{n:drafts,t:'Pendentes'},{n:views,t:'Acessos'},{n:users,t:'Usuários'}];
  $('dashboardStats').innerHTML = cards.map(c=>`<div class="stat-card"><strong>${c.n}</strong><span>${c.t}</span></div>`).join('');
  $('recentArticles').innerHTML = visibleContents().slice(0,4).map(articleCard).join('') || '<p class="muted">Nenhum conteúdo encontrado.</p>';
}
function renderCards(){
  const html = db.systems.map(s=>{
    const mods=db.modules.filter(m=>m.system===s.id); const count=db.articles.filter(a=>a.system===s.id).length;
    return `<div class="card"><h3>${s.name}</h3><p>${s.description||'Sistema cadastrado no DynamicDoc.'}</p><div class="badge-row"><span class="badge">${count} conteúdos</span>${mods.map(m=>`<span class="badge">${m.name}</span>`).join('')}</div></div>`;
  }).join('');
  $('systemCards').innerHTML=html; $('systemsPageCards').innerHTML=html;
}
function renderArticles(){ $('articlesList').innerHTML = filteredArticles('article').map(articleCard).join('') || '<p class="muted">Nenhum artigo encontrado.</p>'; }

function processSearchText(a){
  // Pesquisa dos processos internos limitada somente ao resumo do artigo.
  // Não considera título, módulo, sistema, departamento, OBT, tags ou conteúdo.
  return normalize(a.summary || '');
}

function searchTerms(value){
  return normalize(value)
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length >= 2);
}

function processContents(){
  const term = (($('processSearch') && $('processSearch').value) || '').trim();
  const terms = searchTerms(term);
  const system = ($('processSystem') && $('processSystem').value) || '';
  const module = ($('processModule') && $('processModule').value) || '';
  const status = ($('processStatus') && $('processStatus').value) || 'publicado';

  return visibleContents()
    .filter(a => (a.kind || 'article') === 'process' || a.visibility === 'interno')
    .filter(a => !system || a.system === system)
    .filter(a => !module || a.module === module)
    .filter(a => !status || a.status === status)
    .filter(a => {
      if (!terms.length) return true;
      const text = processSearchText(a);
      // Todas as palavras digitadas precisam aparecer no artigo.
      // Assim, ao pesquisar um tema, só ficam os processos realmente relacionados.
      return terms.every(t => text.includes(t));
    });
}

function renderProcesses(){
  const list = processContents();
  const term = (($('processSearch') && $('processSearch').value) || '').trim();
  const empty = term
    ? `<p class="muted">Nenhum processo interno encontrado para "${term}".</p>`
    : '<p class="muted">Nenhum processo interno encontrado.</p>';
  $('processList').innerHTML = list.map(articleCard).join('') || empty;
}

function articleCard(a){
  const sys=db.systems.find(s=>s.id===a.system)?.name||a.system; const mod=db.modules.find(m=>m.id===a.module)?.name||'Sem módulo';
  return `<article class="article-card"><div><div class="badge-row"><span class="badge status-${a.status}">${a.status}</span><span class="badge">v${a.version||'1.0'}</span><span class="badge">${sys}</span><span class="badge">${mod}</span>${a.visibility==='interno'?'<span class="badge">Interno</span>':''}</div><h3>${a.title}</h3><p>${a.summary||''}</p><div class="badge-row">${(a.tags||[]).map(t=>`<span class="badge">#${t}</span>`).join('')}</div></div><div class="article-actions"><button class="small-btn" onclick="openArticle('${a.id}')">Abrir</button><button class="small-btn" onclick="toggleFavorite('${a.id}')">${db.favorites.includes(a.id)?'★':'☆'}</button>${canManageContent()?`<button class="small-btn" onclick="editArticle('${a.id}')">Editar</button>`:''}${isAdmin()?`<button class="small-btn small-danger" onclick="deleteArticle('${a.id}')">Excluir</button>`:''}</div></article>`;
}

function openArticle(id){
  const a=db.articles.find(x=>x.id===id); if(!a) return;
  a.views=(a.views||0)+1; db.history=[id,...db.history.filter(x=>x!==id)].slice(0,12); saveDb(); upsert(ARTICLE_TABLE, a);
  $('articleModalBody').innerHTML = `<div class="modal-body"><div class="badge-row"><span class="badge status-${a.status}">${a.status}</span><span class="badge">v${a.version||'1.0'}</span>${a.visibility==='interno'?'<span class="badge">Interno</span>':''}</div><h1>${a.title}</h1><p class="muted">${a.summary||''}</p>${a.image?`<img class="content-media" src="${a.image}" alt="Imagem do artigo">`:''}${a.video?`<video class="content-media" src="${a.video}" controls></video>`:''}<div class="content-text">${(a.content||'').split('\n').map(p=>`<p>${p}</p>`).join('')}</div>${a.file?`<p><a class="primary-btn" href="${a.file}" target="_blank">Abrir arquivo</a></p>`:''}${isStaff()&&a.internalNote?`<div class="comment-box"><strong>Observação interna</strong><p>${a.internalNote}</p></div>`:''}<div class="comment-box"><strong>Comentários internos</strong><div>${(a.comments||[]).map(c=>`<p><b>${c.author}</b> • ${c.date}<br>${c.text}</p>`).join('')||'<p class="muted">Nenhum comentário.</p>'}</div>${isStaff()?`<textarea id="newComment" rows="2" placeholder="Adicionar comentário interno"></textarea><button class="primary-btn" onclick="addComment('${a.id}')">Comentar</button>`:''}</div><div class="article-actions"><button class="small-btn" onclick="rateArticle('${a.id}','likes')">👍 ${a.likes||0}</button><button class="small-btn" onclick="rateArticle('${a.id}','dislikes')">👎 ${a.dislikes||0}</button></div></div>`;
  $('articleModal').classList.remove('hidden');
}
function addComment(id){const a=db.articles.find(x=>x.id===id); const text=$('newComment').value.trim(); if(!text) return; a.comments=a.comments||[]; a.comments.push({author:currentUser?.name||'Colaborador',date:nowBR(),text}); saveDb(); upsert(ARTICLE_TABLE, a); openArticle(id);}
function rateArticle(id,field){const a=db.articles.find(x=>x.id===id); a[field]=(a[field]||0)+1; saveDb(); upsert(ARTICLE_TABLE, a); openArticle(id);}
function toggleFavorite(id){db.favorites=db.favorites.includes(id)?db.favorites.filter(x=>x!==id):[id,...db.favorites]; saveDb(); renderAll();}

function newContent(kind='article'){ if(!canManageContent()) return alert('Apenas gestores de conteúdo e administradores podem criar.'); selectedArticleId=null; editorReturnPage=kind==='process'?'processes':'articles'; clearEditor(kind); navigate('articleEditor'); }
function clearEditor(kind){ $('articleId').value=''; $('formKind').value=kind; $('articleEditorTitle').textContent=kind==='process'?'Novo processo interno':'Novo artigo'; ['articleTitle','articleSummary','articleTags','articleImage','articleVideo','articleFile','articleInternalNote'].forEach(id=>$(id).value=''); $('articleContent').innerHTML=''; $('articleStatus').value='rascunho'; $('articleVisibility').value=kind==='process'?'interno':'publico'; populateSelects(); }
function editArticle(id){ const a=db.articles.find(x=>x.id===id); if(!a) return; selectedArticleId=id; editorReturnPage=(a.kind==='process')?'processes':'articles'; navigate('articleEditor'); $('articleId').value=a.id; $('formKind').value=a.kind||'article'; $('articleEditorTitle').textContent='Editar conteúdo'; $('articleTitle').value=a.title||''; $('articleStatus').value=a.status||'rascunho'; $('articleSystem').value=a.system||db.systems[0]?.id; updateModuleOptions(); $('articleModule').value=a.module||''; $('articleDepartment').value=a.department||db.departments[0]?.id; $('articleVisibility').value=a.visibility||'publico'; $('articleSummary').value=a.summary||''; $('articleContent').innerHTML=a.content||''; $('articleTags').value=(a.tags||[]).join(', '); $('articleImage').value=a.image||''; $('articleVideo').value=a.video||''; $('articleFile').value=a.file||''; $('articleInternalNote').value=a.internalNote||''; }
function saveArticle(){
  if(!canManageContent()) return alert('Sem permissão.');
  const id=$('articleId').value||uid(); const old=db.articles.find(a=>a.id===id); const base=old||{id,views:0,likes:0,dislikes:0,comments:[],versions:[],createdAt:nowBR()};
  if(old){ base.versions=base.versions||[]; base.versions.push({version:base.version||'1.0',date:nowBR(),title:base.title,content:base.content,author:currentUser?.name||'Sistema'}); }
  const nextVersion = old ? (parseFloat(old.version||'1.0')+0.1).toFixed(1) : '1.0';
  const article={...base,kind:$('formKind').value, title:$('articleTitle').value.trim(), status:$('articleStatus').value, system:$('articleSystem').value, module:$('articleModule').value, department:$('articleDepartment').value, visibility:$('articleVisibility').value, summary:$('articleSummary').value.trim(), content:$('articleContent').innerHTML.trim(), tags:$('articleTags').value.split(',').map(t=>t.trim()).filter(Boolean), image:$('articleImage').value.trim(), video:$('articleVideo').value.trim(), file:$('articleFile').value.trim(), internalNote:$('articleInternalNote').value.trim(), version:nextVersion, updatedAt:nowBR()};
  if(!article.title) return alert('Informe o título.');
  db.articles = old ? db.articles.map(a=>a.id===id?article:a) : [article,...db.articles]; saveDb(); upsert(ARTICLE_TABLE, article); navigate(editorReturnPage);
}
function duplicateArticle(){ const id=$('articleId').value; if(!id) return saveArticle(); const a=db.articles.find(x=>x.id===id); if(!a) return; const copy={...a,id:uid(),title:a.title+' - nova versão',version:'1.0',createdAt:nowBR(),updatedAt:nowBR(),views:0,comments:[],versions:[]}; db.articles.unshift(copy); saveDb(); upsert(ARTICLE_TABLE, copy); navigate(editorReturnPage); }
function deleteArticle(id){ if(!confirm('Excluir este conteúdo?')) return; db.articles=db.articles.filter(a=>a.id!==id); saveDb(); removeRemote(ARTICLE_TABLE, id); renderAll(); }

function renderFavorites(){
  const favs=db.favorites.map(id=>db.articles.find(a=>a.id===id)).filter(Boolean); const hist=db.history.map(id=>db.articles.find(a=>a.id===id)).filter(Boolean);
  $('favoritesList').innerHTML=favs.map(a=>`<p><button class="small-btn" onclick="openArticle('${a.id}')">Abrir</button> ${a.title}</p>`).join('')||'<p class="muted">Nenhum favorito.</p>';
  $('historyList').innerHTML=hist.map(a=>`<p><button class="small-btn" onclick="openArticle('${a.id}')">Abrir</button> ${a.title}</p>`).join('')||'<p class="muted">Nenhum histórico.</p>';
}
function renderAcademy(){
  $('academyGrid').innerHTML=db.tracks.map(t=>`<div class="track-card"><h3>${t.title}</h3><p class="muted">${t.description}</p><div class="progress"><div style="width:${t.progress||0}%"></div></div><strong>${t.progress||0}% concluído</strong>${(t.lessons||[]).map((l,i)=>`<div class="lesson"><input type="checkbox" ${i < Math.round((t.progress||0)/100*t.lessons.length)?'checked':''} onchange="updateTrack('${t.id}')"> ${l}</div>`).join('')}</div>`).join('');
}
function updateTrack(id){const t=db.tracks.find(x=>x.id===id); t.progress=Math.min(100,(t.progress||0)+25); saveDb(); renderAcademy();}
function addTrack(){const title=prompt('Nome da trilha:'); if(!title) return; db.tracks.unshift({id:uid(),title,description:'Nova trilha de aprendizagem.',lessons:['Aula 1','Aula 2','Avaliação'],progress:0}); saveDb(); renderAcademy();}

function renderAdmin(){
  const top=db.articles.slice().sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,5);
  $('adminStats').innerHTML=[{n:db.articles.length,t:'Conteúdos'},{n:db.users.length,t:'Usuários'},{n:db.searchLogs.length,t:'Buscas'},{n:db.modules.length,t:'Módulos'}].map(c=>`<div class="stat-card"><strong>${c.n}</strong><span>${c.t}</span></div>`).join('');
  $('usersList').innerHTML=db.users.map(u=>`<div class="user-row"><span><b>${u.name}</b><br><small>${u.email} • ${roleLabel(u.role)}</small></span><button class="small-btn small-danger" onclick="removeUser('${u.id}')">Remover</button></div>`).join('');
  $('searchMetrics').innerHTML=(db.searchLogs.slice(0,10).map(s=>`<div class="metric-row"><span>${s.query}</span><small>${s.date}</small></div>`).join('')||'<p class="muted">Nenhuma busca registrada.</p>') + `<h4>Mais acessados</h4>${top.map(a=>`<div class="metric-row"><span>${a.title}</span><b>${a.views||0}</b></div>`).join('')}`;
  const versionQuery = normalize($('versionSearch')?.value || '');
  const versionResults = db.articles.filter(a => {
    if (!versionQuery) return true;
    const versionText = normalize([
      a.title,
      ...(a.versions || []).map(v => v.author)
    ].filter(Boolean).join(' '));
    return versionText.includes(versionQuery);
  });
  $('versionsList').innerHTML = versionResults.map(a=>`<div class="version-item"><span><b>${a.title}</b><br><small>Versão atual: ${a.version||'1.0'} • anteriores: ${(a.versions||[]).length}</small></span><button class="small-btn" onclick="editArticle('${a.id}')">Editar</button></div>`).join('') || '<p class="muted">Nenhuma versão encontrada.</p>';
}
function addUser(){const u={id:uid(),name:$('userName').value.trim(),email:$('userEmail').value.trim(),role:$('userRole').value,department:$('userDepartment').value}; if(!u.name||!u.email) return alert('Preencha nome e e-mail.'); db.users.unshift(u); saveDb(); upsert(PROFILE_TABLE, u); ['userName','userEmail'].forEach(id=>$(id).value=''); renderAdmin();}
function removeUser(id){db.users=db.users.filter(u=>u.id!==id); saveDb(); removeRemote(PROFILE_TABLE, id); renderAdmin();}
function addSystem(){const name=$('newSystemName').value.trim(); if(!name) return; const s={id:normalize(name).replaceAll(' ','-'),name,description:'Sistema cadastrado pela administração.'}; db.systems.push(s); saveDb(); upsert(SYSTEM_TABLE, s); $('newSystemName').value=''; renderAll();}
function addModule(){const name=$('newModuleName').value.trim(); if(!name) return; const m={id:normalize($('moduleSystem').value+'-'+name).replaceAll(' ','-'),system:$('moduleSystem').value,name}; db.modules.push(m); saveDb(); upsert(MODULE_TABLE, m); $('newModuleName').value=''; renderAll();}

function smartSearch(){
  const q=$('globalSearch').value.trim(); if(!q) return;
  db.searchLogs.unshift({query:q,date:nowBR()}); db.searchLogs=db.searchLogs.slice(0,50); saveDb();
  navigate('articles'); $('articleSearch').value=q; renderArticles();
  const hits=visibleContents().filter(a=>articleMatches(a,q)).slice(0,3);
  if(hits.length){ const answer=`<div class="ai-answer"><b>Busca inteligente DynamicDoc</b><br>Encontrei ${hits.length} conteúdo(s) relacionado(s). Melhor ponto de partida: <b>${hits[0].title}</b>. Também verifique: ${hits.map(h=>h.title).join(', ')}.</div>`; $('articlesList').insertAdjacentHTML('afterbegin',answer); }
}
async function login(){
  const email=$('loginEmail').value.trim(), pass=$('loginPassword').value;
  if(supabaseDb && email && pass){ const {error}=await supabaseDb.auth.signInWithPassword({email,password:pass}); if(error) return alert('Erro no login: '+error.message); currentUser={name:email,email,role:'admin',department:'suporte'}; }
  else currentUser={id:uid(),name:email?.split('@')[0]||'Colaborador Dynamic',email:email||'demo@dynamictravel.com',role:'colaborador',department:'suporte'};
  saveUser(); $('loginPanel').classList.add('hidden'); renderAll();
}
function testLogin(role){currentUser={id:uid(),name:role==='admin'?'Administrador Dynamic':role==='gestor'?'Gestor de Conteúdo':'Colaborador Dynamic',email:`${role}@dynamictravel.com`,role,department:'suporte'}; saveUser(); $('loginPanel').classList.add('hidden'); renderAll();}
function logout(){currentUser=null; saveUser(); renderAll(); navigate('home');}

function bindEvents(){
  document.querySelectorAll('.nav-link').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.page)));
  $('loginBtn').onclick=()=>$('loginPanel').classList.remove('hidden'); $('closeLogin').onclick=()=>$('loginPanel').classList.add('hidden'); $('logoutBtn').onclick=logout; $('confirmLogin').onclick=login;
  document.querySelectorAll('[data-test-role]').forEach(b=>b.onclick=()=>testLogin(b.dataset.testRole));
  $('searchBtn').onclick=smartSearch; $('globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter') smartSearch()});
  ['articleSearch','filterSystem','filterModule','filterStatus'].forEach(id=>$(id)?.addEventListener('input',renderArticles));
  ['processSearch','processSystem','processModule','processStatus'].forEach(id=>{
    $(id)?.addEventListener('input',renderProcesses);
    $(id)?.addEventListener('change',renderProcesses);
  });
  $('versionSearch')?.addEventListener('input', renderAdmin);
  $('newArticleBtn').onclick=()=>newContent('article'); $('newProcessBtn').onclick=()=>newContent('process'); $('backToArticlesBtn').onclick=()=>navigate(editorReturnPage); $('saveArticleBtn').onclick=saveArticle; $('duplicateArticleBtn').onclick=duplicateArticle;
  $('articleSystem').addEventListener('change',updateModuleOptions); $('closeArticleModal').onclick=()=>$('articleModal').classList.add('hidden'); $('articleModal').addEventListener('click',e=>{if(e.target.id==='articleModal') $('articleModal').classList.add('hidden')});
  $('addSystemBtn').onclick=addSystem; $('addModuleBtn').onclick=addModule; $('addUserBtn').onclick=addUser; $('addTrackBtn').onclick=addTrack;
}

window.openArticle=openArticle; window.toggleFavorite=toggleFavorite; window.editArticle=editArticle; window.deleteArticle=deleteArticle; window.addComment=addComment; window.rateArticle=rateArticle; window.updateTrack=updateTrack; window.removeUser=removeUser;
(async function init(){ await syncFromSupabase(); bindEvents(); renderAll(); })();
