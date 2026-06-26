const $ = (id) => document.getElementById(id);
const nowBR = () => new Date().toLocaleString('pt-BR');
const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random()));
const escapeHtml = (value='') => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
const escapeAttr = (value='') => escapeHtml(value).replace(/`/g, '&#096;');

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
    {id:uid(),name:'Luiza Saraiva',fullName:'Luiza Pereira Saraiva',email:'luiza.saraiva@dynamictravel.com',role:'admin',department:'suporte'},
    {id:uid(),name:'Gestor de Conteúdo',fullName:'Gestor de Conteúdo Dynamic',email:'conteudo@dynamictravel.com',role:'gestor',department:'suporte'},
    {id:uid(),name:'Equipe Eventos',fullName:'Equipe Eventos Dynamic',email:'eventos@dynamictravel.com',role:'colaborador',department:'eventos'}
  ],
  articles:[
    {id:uid(),kind:'article',visibility:'publico',title:'Cadastro de usuários no Argo',summary:'Passo a passo para orientar o cadastro e validação de usuários no Argo.',system:'argo',module:'argo-cadastros',department:'suporte',status:'publicado',tags:['cadastro','usuário','argo','login'],content:'1. Acesse o painel administrativo do cliente.\n2. Localize a área de usuários.\n3. Confira nome, e-mail e perfil de acesso.\n4. Valide centro de custo, empresa, comunidade e permissões.\n5. Salve o cadastro e oriente o primeiro acesso.',image:'',video:'',file:'',internalNote:'Conferir sempre o link correto do cliente antes de validar erro de acesso.',version:'1.0',versions:[],comments:[],views:12,likes:0,dislikes:0,createdAt:nowBR(),updatedAt:nowBR()},
    {id:uid(),kind:'article',visibility:'publico',title:'Diferença entre solicitação, reserva e emissão',summary:'Explica as principais etapas de uma viagem no OBT.',system:'argo',module:'argo-aprovacoes',department:'suporte',status:'publicado',tags:['solicitação','reserva','emissão'],content:'Solicitação é o pedido inicial. Reserva é quando o item foi selecionado e bloqueado. Emissão é a confirmação final com bilhete/voucher emitido. Em caso de dúvidas, consulte status, histórico e logs da solicitação.',image:'',video:'',file:'',internalNote:'Bom artigo para clientes novos.',version:'1.0',versions:[],comments:[],views:8,likes:0,dislikes:0,createdAt:nowBR(),updatedAt:nowBR()},
    {id:uid(),kind:'process',visibility:'interno',title:'Fluxo interno de atendimento para eventos',summary:'Modelo de consulta para equipes que atendem eventos e grupos.',system:'wts',module:'wts-operacao',department:'eventos',status:'publicado',tags:['eventos','operação','wts'],content:'Antes de iniciar o atendimento, confirme período, localidade, solicitante, tipo de evento e quantidade de participantes. Registre todas as etapas para manter visibilidade entre Suporte, Operação, Comercial e Gestão.',image:'',video:'',file:'',internalNote:'Utilizar em onboarding de novos colaboradores de Eventos.',version:'1.0',versions:[],comments:[],views:5,likes:0,dislikes:0,createdAt:nowBR(),updatedAt:nowBR()}
  ],
  favorites:[], history:[], searchLogs:[],
  tracks:[
    {id:uid(),title:'Trilha Argo Básico',description:'Fundamentos do Argo para novos colaboradores.',category:'Sistemas',lessons:[
      {id:uid(),title:'Visão geral do Argo',duration:'08 min',type:'Vídeo'},
      {id:uid(),title:'Cadastros',duration:'15 min',type:'Artigo'},
      {id:uid(),title:'Aprovações',duration:'12 min',type:'Vídeo'},
      {id:uid(),title:'Reservas e emissões',duration:'18 min',type:'Aula'}
    ],completedLessons:[],certificates:[]},
    {id:uid(),title:'Onboarding Dynamic',description:'Conteúdos iniciais para chegada de novos colaboradores.',category:'Onboarding',lessons:[
      {id:uid(),title:'Quem somos',duration:'05 min',type:'Aula'},
      {id:uid(),title:'Sistemas internos',duration:'10 min',type:'Vídeo'},
      {id:uid(),title:'Canais de atendimento',duration:'07 min',type:'Artigo'},
      {id:uid(),title:'Boas práticas',duration:'12 min',type:'Aula'}
    ],completedLessons:[],certificates:[]},
    {id:uid(),title:'Expense e Relatórios',description:'Prestação de contas, despesas e consultas gerenciais.',category:'Sistemas',lessons:[
      {id:uid(),title:'Expense básico',duration:'09 min',type:'Vídeo'},
      {id:uid(),title:'Despesas',duration:'13 min',type:'Aula'},
      {id:uid(),title:'Relatórios',duration:'16 min',type:'Artigo'},
      {id:uid(),title:'Erros comuns',duration:'10 min',type:'Aula'}
    ],completedLessons:[],certificates:[]}
  ]
};

let db = JSON.parse(localStorage.getItem('dynamicdoc-product-db') || 'null') || initialData;
for (const k of Object.keys(initialData)) db[k] = db[k] || initialData[k];
let currentUser = JSON.parse(localStorage.getItem('dynamicdoc-product-user') || 'null');
let selectedArticleId = null;
let editorReturnPage = 'articles';
let articleReturnPage = 'articles';
let courseReturnPage = 'academy';
let currentCourseId = null;
let currentLessonId = null;
const saveDb = () => localStorage.setItem('dynamicdoc-product-db', JSON.stringify(db));
const saveUser = () => currentUser ? localStorage.setItem('dynamicdoc-product-user', JSON.stringify(currentUser)) : localStorage.removeItem('dynamicdoc-product-user');

const supabaseSettings = window.DynamicDocSupabase || {};
const supabaseReady = Boolean(window.supabase && supabaseSettings.url && supabaseSettings.anonKey && !supabaseSettings.url.includes('SEU-PROJETO'));
const supabaseDb = supabaseReady ? window.supabase.createClient(supabaseSettings.url, supabaseSettings.anonKey) : null;
const STORAGE_BUCKET = supabaseSettings.storageBucket || 'dynamicdoc-files';


const isStaff = () => ['colaborador','gestor','admin'].includes(currentUser?.role);
const canManageContent = () => ['gestor','admin'].includes(currentUser?.role);
const isAdmin = () => currentUser?.role === 'admin';
const roleLabel = (role) => ({usuario:'Usuário',colaborador:'Colaborador',gestor:'Gestor de Conteúdo',admin:'Administrador'}[role] || 'Visitante');
const normalize = (v) => (v || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const displayUserName = (user=currentUser) => user?.fullName || user?.nome_completo || user?.name || user?.nome || user?.email?.split('@')[0] || 'Participante Dynamic';

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
    const [artigosRes, articlesRes, sistemasRes, systemsRes, modulosRes, modulesRes, profilesRes, tracksRes, progressRes] = await Promise.all([
      fetchTable('artigos'),
      fetchTable('articles'),
      fetchTable('sistemas'),
      fetchTable('systems'),
      fetchTable('modulos'),
      fetchTable('modules'),
      fetchTable('profiles'),
      fetchTable('training_tracks'),
      fetchTable('training_progress')
    ]);

    const artigosData = artigosRes.data?.length ? artigosRes.data : articlesRes.data;
    if(artigosData?.length) db.articles = artigosData.map(normalizeArticle);

    const sistemasData = sistemasRes.data?.length ? sistemasRes.data : systemsRes.data;
    if(sistemasData?.length) db.systems = sistemasData.map(s=>({id:s.id, name:s.name||s.nome, description:s.description||s.descricao||''}));

    const modulosData = modulosRes.data?.length ? modulosRes.data : modulesRes.data;
    if(modulosData?.length) db.modules = modulosData.map(normalizeModule);

    if(profilesRes.data?.length) db.users = profilesRes.data.map(normalizeProfile);
    if(tracksRes.data?.length) db.tracks = tracksRes.data.map(normalizeTrainingTrack);
    if(progressRes.data?.length) db.academyProgress = progressRes.data.map(normalizeTrainingProgress);

    saveDb();
  }catch(e){
    console.warn('Supabase offline/local:', e.message);
  }
}

const ARTICLE_TABLE = 'artigos';
const MODULE_TABLE = 'modulos';
const SYSTEM_TABLE = 'systems';
const PROFILE_TABLE = 'profiles';
const TRACK_TABLE = 'training_tracks';
const PROGRESS_TABLE = 'training_progress';

async function upsert(table,payload){ if(!supabaseDb) return; const {error}=await supabaseDb.from(table).upsert(payload); if(error) console.warn(error.message); }
async function removeRemote(table,id){ if(!supabaseDb) return; const {error}=await supabaseDb.from(table).delete().eq('id',id); if(error) console.warn(error.message); }

function safeFileName(name='arquivo'){
  const clean = String(name).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]/g,'-').replace(/-+/g,'-');
  return clean || 'arquivo';
}

async function uploadToSupabaseStorage(file, folder='articles'){
  if(!file) return '';
  if(!supabaseDb){
    alert('Supabase não configurado. Configure o supabase-config.js e o bucket dynamicdoc-files.');
    return '';
  }
  const ext = (file.name || '').split('.').pop() || (file.type?.split('/')[1] || 'bin');
  const path = `${folder}/${new Date().toISOString().slice(0,10)}/${uid()}-${safeFileName(file.name || `arquivo.${ext}`)}`;
  const { error } = await supabaseDb.storage.from(STORAGE_BUCKET).upload(path, file, { upsert:false, cacheControl:'3600' });
  if(error){
    console.error('Erro no upload:', error.message);
    alert('Erro ao enviar arquivo para o Supabase Storage: ' + error.message + '\n\nConfira se o bucket "' + STORAGE_BUCKET + '" existe e está público.');
    return '';
  }
  const { data } = supabaseDb.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data?.publicUrl || '';
}

async function uploadFileInput(inputId, folder){
  const input = $(inputId);
  const file = input?.files?.[0];
  if(!file) return '';
  return await uploadToSupabaseStorage(file, folder);
}

async function convertEditorImagesToStorage(){
  const editor = $('articleContent');
  if(!editor) return;
  const images = [...editor.querySelectorAll('img')];
  for(const img of images){
    const src = img.getAttribute('src') || '';
    if(!src.startsWith('data:')) continue;
    const res = await fetch(src);
    const blob = await res.blob();
    const ext = (blob.type || 'image/png').split('/')[1] || 'png';
    const file = new File([blob], `imagem-artigo.${ext}`, {type: blob.type || 'image/png'});
    const publicUrl = await uploadToSupabaseStorage(file, 'articles/embedded-images');
    if(publicUrl) img.setAttribute('src', publicUrl);
  }
}

async function insertImageInEditorFromFile(file){
  if(!file) return;
  const publicUrl = await uploadToSupabaseStorage(file, 'articles/embedded-images');
  if(!publicUrl) return;
  $('articleContent').focus();
  document.execCommand('insertHTML', false, `<img src="${escapeAttr(publicUrl)}" alt="Imagem do artigo">`);
}

function focusArticleEditor(){ const ed=$('articleContent'); if(ed){ ed.focus(); } }
function insertEditorHtml(html){ focusArticleEditor(); document.execCommand('insertHTML', false, html); }
function runEditorCommand(cmd, value=null){ focusArticleEditor(); document.execCommand(cmd, false, value); }
function insertChecklistBlock(){ insertEditorHtml(`<ul class="dd-checklist"><li><label><input type="checkbox"> Item da checklist</label></li><li><label><input type="checkbox"> Próxima etapa</label></li></ul><p><br></p>`); }
function insertVideoBlock(){
  const url = prompt('Cole a URL do vídeo:'); if(!url) return;
  const safe = escapeAttr(url.trim());
  insertEditorHtml(`<figure class="dd-video-block"><video src="${safe}" controls></video><figcaption>Legenda do vídeo</figcaption></figure><p><br></p>`);
}
function insertTableBlock(){
  insertEditorHtml(`<table class="dd-table"><thead><tr><th>Etapa</th><th>Responsável</th><th>Status</th></tr></thead><tbody><tr><td>1</td><td>Equipe</td><td>Pendente</td></tr><tr><td>2</td><td>Cliente</td><td>Em andamento</td></tr></tbody></table><p><br></p>`);
}
function insertAlertBlock(){
  const type = prompt('Tipo do alerta: info, sucesso, atencao ou erro', 'info') || 'info';
  const text = prompt('Texto do alerta:', 'Atenção: revise esta etapa antes de seguir.') || 'Atenção: revise esta etapa antes de seguir.';
  insertEditorHtml(`<div class="dd-alert dd-alert-${escapeAttr(type)}"><strong>${escapeHtml(type.toUpperCase())}</strong><p>${escapeHtml(text)}</p></div><p><br></p>`);
}
function insertCodeBlock(){
  const code = prompt('Cole o código ou comando:', 'Exemplo de código') || 'Exemplo de código';
  insertEditorHtml(`<pre class="dd-code"><code>${escapeHtml(code)}</code></pre><p><br></p>`);
}
function insertLinkBlock(){
  const url = prompt('URL do link:'); if(!url) return;
  const label = prompt('Texto do link:', 'Abrir link') || 'Abrir link';
  insertEditorHtml(`<a href="${escapeAttr(url)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>&nbsp;`);
}
function insertAccordionBlock(){
  const title = prompt('Título do acordeão:', 'Ver detalhes') || 'Ver detalhes';
  insertEditorHtml(`<details class="dd-accordion" open><summary>${escapeHtml(title)}</summary><p>Digite aqui o conteúdo expansível.</p></details><p><br></p>`);
}
function insertColumnsBlock(){
  insertEditorHtml(`<div class="dd-columns"><div><h3>Coluna 1</h3><p>Texto da primeira coluna.</p></div><div><h3>Coluna 2</h3><p>Texto da segunda coluna.</p></div></div><p><br></p>`);
}
async function insertGalleryFromFiles(files){
  files = [...(files||[])].filter(f=>f.type?.startsWith('image/'));
  if(!files.length) return;
  const urls=[];
  for(const file of files){ const url = await uploadToSupabaseStorage(file, 'articles/galleries'); if(url) urls.push(url); }
  if(!urls.length) return;
  insertEditorHtml(`<div class="dd-gallery">${urls.map(url=>`<img src="${escapeAttr(url)}" alt="Imagem da galeria">`).join('')}</div><p><br></p>`);
}
function handleEditorSlashCommand(){
  const ed=$('articleContent'); if(!ed) return;
  const txt=(ed.textContent||'').trim().toLowerCase();
  if(!txt.endsWith('/')) return;
  const menu = document.createElement('div');
  menu.className='slash-menu';
  menu.innerHTML=`<button onclick="insertChecklistBlock(); this.closest('.slash-menu').remove()">☑ Checklist</button><button onclick="insertTableBlock(); this.closest('.slash-menu').remove()">▦ Tabela</button><button onclick="insertAlertBlock(); this.closest('.slash-menu').remove()">⚠ Alerta</button><button onclick="insertCodeBlock(); this.closest('.slash-menu').remove()">{ } Código</button><button onclick="insertAccordionBlock(); this.closest('.slash-menu').remove()">⌄ Acordeão</button><button onclick="insertColumnsBlock(); this.closest('.slash-menu').remove()">▥ Colunas</button>`;
  ed.parentElement.appendChild(menu);
  setTimeout(()=>{ if(menu.isConnected) menu.remove(); }, 7000);
}

function applyAccess(){
  $('currentUserName').textContent = currentUser ? displayUserName(currentUser) : 'Visitante';
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
  const titles={home:'Base de conhecimento',articles:'Artigos',systems:'Sistemas',processes:'Processos internos',academy:'Academia Dynamic',favorites:'Favoritos',admin:'Administração',articleEditor:'Editor de conteúdo',articleView:'Artigo aberto',courseView:'Curso aberto',lessonView:'Aula aberta'};
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

function dashboardNumber(value){
  const n = Number(value || 0);
  return n > 999 ? n.toLocaleString('pt-BR') : String(n);
}
function dashboardDate(value){
  if(!value) return 'Sem data';
  return String(value).replace(',', ' • ');
}
function dashboardKpiCard(icon, number, label, hint){
  return `<div class="dashboard-kpi-card-v2"><span>${icon}</span><strong>${dashboardNumber(number)}</strong><small>${escapeHtml(label)}</small><p>${escapeHtml(hint || '')}</p></div>`;
}
function articleUpdateRow(a){
  const sys = db.systems.find(s=>s.id===a.system)?.name || a.system || 'Geral';
  return `<button class="dashboard-update-row-v2" onclick="openArticle('${a.id}')"><span>${escapeHtml(sys)}</span><b>${escapeHtml(a.title)}</b><small>${escapeHtml(dashboardDate(a.updatedAt || a.createdAt))}</small></button>`;
}
function renderDashboard(){
  normalizeAcademyTracks();
  const contents = visibleContents();
  const publishedArticles = db.articles.filter(a=>a.status==='publicado' && (a.kind||'article')==='article').length;
  const publishedProcesses = db.articles.filter(a=>a.status==='publicado' && (a.kind||'article')==='process').length;
  const totalViews = db.articles.reduce((s,a)=>s+Number(a.views||0),0);
  const courses = (db.tracks||[]).length;
  const lessons = (db.tracks||[]).reduce((s,t)=>s+((t.lessons||[]).length),0);
  const certificates = (db.tracks||[]).flatMap(t=>(t.certificates||[]));
  const userCertificates = certificates.filter(c=>c.user===currentAcademyUserKey());
  const totalUsers = db.users.length;
  const avgProgress = courses ? Math.round((db.tracks||[]).reduce((s,t)=>s+getTrackProgress(t),0)/courses) : 0;

  const adminView = $('adminDashboardView');
  const userView = $('userDashboardView');
  const adminMode = isAdmin();
  if(adminView) adminView.classList.toggle('hidden', !adminMode);
  if(userView) userView.classList.toggle('hidden', adminMode);

  if($('dashboardHeroTitle')) $('dashboardHeroTitle').textContent = adminMode ? 'Dashboard administrativo do DynamicDoc.' : `Olá, ${displayUserName(currentUser)}. Continue aprendendo.`;
  if($('dashboardHeroSubtitle')) $('dashboardHeroSubtitle').textContent = adminMode
    ? 'Acompanhe publicações, cursos, alunos, certificados, acessos e conteúdos mais vistos.'
    : 'Veja seus cursos em andamento, progresso, certificados e últimas atualizações da base.';
  if($('dashboardHeroIcon')) $('dashboardHeroIcon').textContent = adminMode ? '📊' : '🎓';
  if($('dashboardHeroMetric')) $('dashboardHeroMetric').textContent = adminMode ? dashboardNumber(totalViews) : `${avgProgress}%`;
  if($('dashboardHeroLabel')) $('dashboardHeroLabel').textContent = adminMode ? 'acessos totais' : 'progresso médio';

  const adminCards = [
    dashboardKpiCard('📚', publishedArticles, 'Artigos publicados', 'Base pública e corporativa'),
    dashboardKpiCard('🎓', courses, 'Cursos', `${lessons} aulas cadastradas`),
    dashboardKpiCard('👥', totalUsers, 'Alunos/usuários', 'Perfis cadastrados'),
    dashboardKpiCard('🏆', certificates.length, 'Certificados', 'Emitidos na Academia'),
    dashboardKpiCard('👁️', totalViews, 'Acessos', 'Visualizações em artigos'),
    dashboardKpiCard('🧭', publishedProcesses, 'Processos internos', 'Conteúdos para equipe')
  ];
  const userCards = [
    dashboardKpiCard('🎓', courses, 'Cursos disponíveis', 'Academia Dynamic'),
    dashboardKpiCard('📈', `${avgProgress}%`, 'Progresso médio', 'Cursos em andamento'),
    dashboardKpiCard('🏆', userCertificates.length, 'Certificados', 'Conquistas disponíveis'),
    dashboardKpiCard('🆕', contents.length, 'Atualizações', 'Conteúdos publicados')
  ];
  if($('dashboardStats')) $('dashboardStats').innerHTML = (adminMode ? adminCards : userCards).join('');

  const topArticles = [...db.articles].filter(a=>a.status==='publicado').sort((a,b)=>Number(b.views||0)-Number(a.views||0)).slice(0,5);
  if($('topViewedArticles')) $('topViewedArticles').innerHTML = topArticles.map((a,i)=>`<button onclick="openArticle('${a.id}')"><span>${i+1}</span><div><b>${escapeHtml(a.title)}</b><small>${Number(a.views||0)} acessos • ${escapeHtml(db.systems.find(s=>s.id===a.system)?.name || 'Geral')}</small></div></button>`).join('') || '<p class="muted">Nenhum acesso registrado ainda.</p>';

  if($('adminAcademySummary')) $('adminAcademySummary').innerHTML = [
    `<div><b>${courses} cursos ativos</b><small>${lessons} aulas cadastradas</small></div>`,
    `<div><b>${certificates.length} certificados emitidos</b><small>${avgProgress}% de conclusão média</small></div>`,
    `<div><b>${totalUsers} usuários</b><small>Perfis disponíveis no portal</small></div>`
  ].join('');

  const recent = [...contents].sort((a,b)=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||''))).slice(0,6);
  const recentHtml = recent.map(articleUpdateRow).join('') || '<p class="muted">Nenhuma atualização publicada ainda.</p>';
  if($('recentUpdatesAdmin')) $('recentUpdatesAdmin').innerHTML = recentHtml;
  if($('recentUpdatesUser')) $('recentUpdatesUser').innerHTML = recentHtml;

  const courseRows = (db.tracks||[]).map(t=>{
    const progress = getTrackProgress(t);
    const next = (t.lessons||[]).find(l=>!(t.completedLessons||[]).includes(l.id)) || (t.lessons||[])[0];
    return `<div class="dashboard-course-row-v2"><div><b>${escapeHtml(t.title)}</b><small>${(t.lessons||[]).length} aulas • ${progress}% concluído</small><div class="progress"><div style="width:${progress}%"></div></div></div><button class="small-btn" onclick="${next ? `openLessonPage('${t.id}','${next.id}')` : `openCourse('${t.id}')`}">${progress>0?'Continuar':'Começar'}</button></div>`;
  }).join('');
  if($('userCoursesProgress')) $('userCoursesProgress').innerHTML = courseRows || '<p class="muted">Nenhum curso cadastrado ainda.</p>';

  if($('userCertificatesDashboard')) $('userCertificatesDashboard').innerHTML = userCertificates.length
    ? userCertificates.map(c=>{ const t=(db.tracks||[]).find(x=>(x.certificates||[]).some(cert=>cert.id===c.id)); return `<button onclick="downloadCertificate('${escapeAttr(t?.title||'Curso Dynamic')}','${escapeAttr(c.issuedAt)}')"><b>${escapeHtml(t?.title||'Curso Dynamic')}</b><small>${escapeHtml(c.issuedAt||'Emitido')}</small></button>`; }).join('')
    : '<p class="muted">Conclua um curso para liberar seu primeiro certificado.</p>';

  if($('recentArticles')) $('recentArticles').innerHTML = recent.slice(0,4).map(articleCard).join('') || '<p class="muted">Nenhum conteúdo encontrado.</p>';
}
function renderCards(){
  const html = db.systems.map(s=>{
    const mods=db.modules.filter(m=>m.system===s.id); const count=db.articles.filter(a=>a.system===s.id).length;
    return `<div class="card"><h3>${s.name}</h3><p>${s.description||'Sistema cadastrado no DynamicDoc.'}</p><div class="badge-row"><span class="badge">${count} conteúdos</span>${mods.map(m=>`<span class="badge">${m.name}</span>`).join('')}</div></div>`;
  }).join('');
  const compact = db.systems.slice(0,5).map(s=>{
    const count=db.articles.filter(a=>a.system===s.id && a.status==='publicado').length;
    return `<button onclick="navigate('systems')"><b>${escapeHtml(s.name)}</b><small>${count} conteúdos</small></button>`;
  }).join('');
  if($('systemCards')) $('systemCards').innerHTML=compact || '<p class="muted">Nenhum sistema cadastrado.</p>';
  if($('legacySystemCards')) $('legacySystemCards').innerHTML=html;
  if($('systemsPageCards')) $('systemsPageCards').innerHTML=html;
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

function articleContentHtml(a){
  const raw = a.content || '';
  if (/<[a-z][\s\S]*>/i.test(raw)) return raw;
  return raw.split('\n').filter(Boolean).map(p=>`<p>${escapeHtml(p)}</p>`).join('');
}

function articleReadingMinutes(a){
  const text = String(a.content || '').replace(/<[^>]*>/g,' ').trim();
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 180));
}

function articleToc(html){
  const headings = [...html.matchAll(/<h([2-3])[^>]*>(.*?)<\/h\1>/gi)];
  if(!headings.length) return '';
  return `<aside class="article-toc"><strong>Neste artigo</strong>${headings.map((m,i)=>`<a href="#topico-${i+1}">${m[2].replace(/<[^>]*>/g,'')}</a>`).join('')}</aside>`;
}

function addHeadingAnchors(html){
  let i = 0;
  return html.replace(/<h([2-3])([^>]*)>(.*?)<\/h\1>/gi, (all,level,attrs,text)=>{
    i += 1;
    return `<h${level}${attrs} id="topico-${i}">${text}</h${level}>`;
  });
}

function currentPageId(){
  return document.querySelector('.page.active-page')?.id || 'articles';
}

function openArticle(id){
  const a=db.articles.find(x=>x.id===id); if(!a) return;
  const fromPage = currentPageId();
  if(fromPage !== 'articleView') articleReturnPage = ['home','articles','systems','processes','favorites'].includes(fromPage) ? fromPage : ((a.kind==='process')?'processes':'articles');
  a.views=(a.views||0)+1; db.history=[id,...db.history.filter(x=>x!==id)].slice(0,12); saveDb(); upsert(ARTICLE_TABLE, a);
  const sys=db.systems.find(s=>s.id===a.system)?.name||a.system||'Sem sistema';
  const mod=db.modules.find(m=>m.id===a.module)?.name||'Sem módulo';
  const bodyHtml = addHeadingAnchors(articleContentHtml(a));
  const toc = articleToc(bodyHtml);
  $('articleFullView').innerHTML = `
    <article class="article-full-page">
      <div class="article-view-actions">
        <button class="ghost-btn" onclick="backFromArticle()">← Voltar</button>
        ${canManageContent()?`<button class="small-btn" onclick="editArticle('${a.id}')">Editar artigo</button>`:''}
      </div>
      <div class="article-breadcrumb">Início / ${escapeHtml(sys)} / ${escapeHtml(mod)} / ${escapeHtml(a.title)}</div>
      <header class="article-full-header">
        <div class="badge-row"><span class="badge status-${a.status}">${a.status}</span><span class="badge">v${a.version||'1.0'}</span><span class="badge">${escapeHtml(sys)}</span><span class="badge">${escapeHtml(mod)}</span>${a.visibility==='interno'?'<span class="badge">Interno</span>':''}</div>
        <h1>${escapeHtml(a.title)}</h1>
        <p class="article-summary">${escapeHtml(a.summary||'')}</p>
        <div class="article-meta-row"><span>⏱ ${articleReadingMinutes(a)} min de leitura</span><span>👁 ${a.views||0} visualizações</span><span>Atualizado em ${escapeHtml(a.updatedAt||a.createdAt||'')}</span></div>
      </header>
      <div class="article-reader-layout ${toc?'with-toc':''}">
        <div class="article-main-column">
          ${a.image?`<img class="content-media article-cover" src="${escapeAttr(a.image)}" alt="Imagem do artigo">`:''}
          ${a.video?`<video class="content-media article-video" src="${escapeAttr(a.video)}" controls></video>`:''}
          <div class="content-text article-content">${bodyHtml || '<p class="muted">Este artigo ainda não possui conteúdo.</p>'}</div>
          ${a.file?`<p><a class="primary-btn" href="${escapeAttr(a.file)}" target="_blank">Abrir arquivo/anexo</a></p>`:''}
          ${isStaff()&&a.internalNote?`<div class="comment-box"><strong>Observação interna</strong><p>${escapeHtml(a.internalNote)}</p></div>`:''}
          <div class="comment-box"><strong>Comentários internos</strong><div>${(a.comments||[]).map(c=>`<p><b>${escapeHtml(c.author)}</b> • ${escapeHtml(c.date)}<br>${escapeHtml(c.text)}</p>`).join('')||'<p class="muted">Nenhum comentário.</p>'}</div>${isStaff()?`<textarea id="newComment" rows="2" placeholder="Adicionar comentário interno"></textarea><button class="primary-btn" onclick="addComment('${a.id}')">Comentar</button>`:''}</div>
          <div class="article-actions article-feedback"><button class="small-btn" onclick="rateArticle('${a.id}','likes')">👍 Útil ${a.likes||0}</button><button class="small-btn" onclick="rateArticle('${a.id}','dislikes')">👎 Não ajudou ${a.dislikes||0}</button></div>
        </div>
        ${toc}
      </div>
    </article>`;
  navigate('articleView');
}

function backFromArticle(){ navigate(articleReturnPage || 'articles'); }
function addComment(id){const a=db.articles.find(x=>x.id===id); const text=$('newComment').value.trim(); if(!text) return; a.comments=a.comments||[]; a.comments.push({author:displayUserName(currentUser)||'Colaborador',date:nowBR(),text}); saveDb(); upsert(ARTICLE_TABLE, a); openArticle(id);}
function rateArticle(id,field){const a=db.articles.find(x=>x.id===id); a[field]=(a[field]||0)+1; saveDb(); upsert(ARTICLE_TABLE, a); openArticle(id);}
function toggleFavorite(id){db.favorites=db.favorites.includes(id)?db.favorites.filter(x=>x!==id):[id,...db.favorites]; saveDb(); renderAll();}

function newContent(kind='article'){ if(!canManageContent()) return alert('Apenas gestores de conteúdo e administradores podem criar.'); selectedArticleId=null; editorReturnPage=kind==='process'?'processes':'articles'; clearEditor(kind); navigate('articleEditor'); }
function clearEditor(kind){ $('articleId').value=''; $('formKind').value=kind; $('articleEditorTitle').textContent=kind==='process'?'Novo processo interno':'Novo artigo'; ['articleTitle','articleSummary','articleTags','articleImage','articleVideo','articleFile','articleInternalNote'].forEach(id=>$(id).value=''); $('articleContent').innerHTML=''; $('articleStatus').value='rascunho'; $('articleVisibility').value=kind==='process'?'interno':'publico'; populateSelects(); }
function editArticle(id){ const a=db.articles.find(x=>x.id===id); if(!a) return; selectedArticleId=id; editorReturnPage=(a.kind==='process')?'processes':'articles'; navigate('articleEditor'); $('articleId').value=a.id; $('formKind').value=a.kind||'article'; $('articleEditorTitle').textContent='Editar conteúdo'; $('articleTitle').value=a.title||''; $('articleStatus').value=a.status||'rascunho'; $('articleSystem').value=a.system||db.systems[0]?.id; updateModuleOptions(); $('articleModule').value=a.module||''; $('articleDepartment').value=a.department||db.departments[0]?.id; $('articleVisibility').value=a.visibility||'publico'; $('articleSummary').value=a.summary||''; $('articleContent').innerHTML=a.content||''; $('articleTags').value=(a.tags||[]).join(', '); $('articleImage').value=a.image||''; $('articleVideo').value=a.video||''; $('articleFile').value=a.file||''; $('articleInternalNote').value=a.internalNote||''; }
async function saveArticle(){
  if(!canManageContent()) return alert('Sem permissão.');
  const id=$('articleId').value||uid(); const old=db.articles.find(a=>a.id===id); const base=old||{id,views:0,likes:0,dislikes:0,comments:[],versions:[],createdAt:nowBR()};
  if(old){ base.versions=base.versions||[]; base.versions.push({version:base.version||'1.0',date:nowBR(),title:base.title,content:base.content,author:displayUserName(currentUser)||'Sistema'}); }
  const nextVersion = old ? (parseFloat(old.version||'1.0')+0.1).toFixed(1) : '1.0';
  const uploadedCover = await uploadFileInput('articleImageFile', 'articles/covers');
  const uploadedFile = await uploadFileInput('articleAttachmentFile', 'articles/attachments');
  await convertEditorImagesToStorage();
  const article={...base,kind:$('formKind').value, title:$('articleTitle').value.trim(), status:$('articleStatus').value, system:$('articleSystem').value, module:$('articleModule').value, department:$('articleDepartment').value, visibility:$('articleVisibility').value, summary:$('articleSummary').value.trim(), content:$('articleContent').innerHTML.trim(), tags:$('articleTags').value.split(',').map(t=>t.trim()).filter(Boolean), image: uploadedCover || $('articleImage').value.trim(), video:$('articleVideo').value.trim(), file: uploadedFile || $('articleFile').value.trim(), internalNote:$('articleInternalNote').value.trim(), version:nextVersion, updatedAt:nowBR()};
  if(!article.title) return alert('Informe o título.');
  db.articles = old ? db.articles.map(a=>a.id===id?article:a) : [article,...db.articles]; saveDb(); await upsert(ARTICLE_TABLE, article); ['articleImageFile','articleAttachmentFile'].forEach(id=>{ if($(id)) $(id).value=''; }); navigate(editorReturnPage);
}
function duplicateArticle(){ const id=$('articleId').value; if(!id) return saveArticle(); const a=db.articles.find(x=>x.id===id); if(!a) return; const copy={...a,id:uid(),title:a.title+' - nova versão',version:'1.0',createdAt:nowBR(),updatedAt:nowBR(),views:0,comments:[],versions:[]}; db.articles.unshift(copy); saveDb(); upsert(ARTICLE_TABLE, copy); navigate(editorReturnPage); }
function deleteArticle(id){ if(!confirm('Excluir este conteúdo?')) return; db.articles=db.articles.filter(a=>a.id!==id); saveDb(); removeRemote(ARTICLE_TABLE, id); renderAll(); }

function renderFavorites(){
  const favs=db.favorites.map(id=>db.articles.find(a=>a.id===id)).filter(Boolean); const hist=db.history.map(id=>db.articles.find(a=>a.id===id)).filter(Boolean);
  $('favoritesList').innerHTML=favs.map(a=>`<p><button class="small-btn" onclick="openArticle('${a.id}')">Abrir</button> ${a.title}</p>`).join('')||'<p class="muted">Nenhum favorito.</p>';
  $('historyList').innerHTML=hist.map(a=>`<p><button class="small-btn" onclick="openArticle('${a.id}')">Abrir</button> ${a.title}</p>`).join('')||'<p class="muted">Nenhum histórico.</p>';
}


function normalizeTrainingTrack(x){
  return {
    id: x.id || uid(),
    title: x.title || x.titulo || x.name || 'Trilha sem título',
    description: x.description || x.descricao || '',
    category: x.category || x.categoria || 'Trilha',
    lessons: Array.isArray(x.lessons) ? x.lessons : (Array.isArray(x.aulas) ? x.aulas : []),
    completedLessons: [],
    certificates: [],
    createdAt: x.createdAt || x.created_at || nowBR(),
    updatedAt: x.updatedAt || x.updated_at || nowBR()
  };
}
function normalizeTrainingProgress(x){
  return {
    id: x.id || `${x.user_key || x.user || 'visitante'}-${x.track_id || x.trackId || ''}`,
    userKey: x.userKey || x.user_key || x.user || 'visitante',
    trackId: x.trackId || x.track_id || '',
    completedLessons: Array.isArray(x.completedLessons) ? x.completedLessons : (Array.isArray(x.completed_lessons) ? x.completed_lessons : []),
    certificates: Array.isArray(x.certificates) ? x.certificates : [],
    updatedAt: x.updatedAt || x.updated_at || nowBR()
  };
}
function academyProgressKey(trackId, userKey=currentAcademyUserKey()){
  return `${userKey}::${trackId}`;
}
function getAcademyProgress(trackId, userKey=currentAcademyUserKey()){
  db.academyProgress = db.academyProgress || [];
  let row = db.academyProgress.find(p => p.trackId === trackId && p.userKey === userKey);
  if(!row){
    row = {id: academyProgressKey(trackId, userKey), userKey, trackId, completedLessons:[], certificates:[], updatedAt: nowBR()};
    db.academyProgress.push(row);
  }
  return row;
}
function applyAcademyProgressForCurrentUser(){
  const userKey = currentAcademyUserKey();
  (db.tracks || []).forEach(track => {
    const progress = getAcademyProgress(track.id, userKey);
    track.completedLessons = progress.completedLessons || [];
    track.certificates = progress.certificates || [];
  });
}
async function saveAcademyTrackRemote(track){
  if(!supabaseDb || !track) return;
  const payload = {
    id: track.id,
    title: track.title,
    description: track.description || '',
    category: track.category || 'Trilha',
    lessons: track.lessons || [],
    updated_at: new Date().toISOString()
  };
  const {error} = await supabaseDb.from(TRACK_TABLE).upsert(payload);
  if(error) console.warn('Erro ao salvar trilha:', error.message);
}
async function saveAcademyProgressRemote(track){
  if(!track) return;
  const userKey = currentAcademyUserKey();
  const progress = getAcademyProgress(track.id, userKey);
  progress.completedLessons = track.completedLessons || [];
  progress.certificates = track.certificates || [];
  progress.updatedAt = nowBR();
  saveDb();
  if(!supabaseDb) return;
  const payload = {
    id: academyProgressKey(track.id, userKey),
    user_key: userKey,
    track_id: track.id,
    completed_lessons: progress.completedLessons,
    certificates: progress.certificates,
    updated_at: new Date().toISOString()
  };
  const {error} = await supabaseDb.from(PROGRESS_TABLE).upsert(payload);
  if(error) console.warn('Erro ao salvar progresso da Academia:', error.message);
}

function currentAcademyUserKey(){
  return (currentUser?.email || currentUser?.name || 'visitante').toLowerCase();
}
function normalizeAcademyTracks(){
  db.academyProgress = db.academyProgress || [];
  db.tracks = (db.tracks || []).map(track => {
    const lessons = (track.lessons || []).map((lesson, index) => {
      if(typeof lesson === 'string'){
        return {id:`${track.id}-lesson-${index+1}`, title:lesson, duration:'10 min', type:'Aula'};
      }
      return {
        id: lesson.id || `${track.id}-lesson-${index+1}`,
        title: lesson.title || lesson.nome || `Aula ${index+1}`,
        description: lesson.description || lesson.descricao || '',
        duration: lesson.duration || lesson.duracao || '10 min',
        type: lesson.type || lesson.tipo || 'Aula',
        video_url: lesson.video_url || lesson.video || ''
      };
    });
    const completedLessons = Array.isArray(track.completedLessons) ? track.completedLessons : [];
    const certificates = Array.isArray(track.certificates) ? track.certificates : [];
    return {...track, lessons, completedLessons, certificates};
  });
  applyAcademyProgressForCurrentUser();
}
function getTrackProgress(track){
  const total = (track.lessons || []).length;
  if(!total) return 0;
  const completed = (track.completedLessons || []).length;
  return Math.round((completed / total) * 100);
}
function userHasCertificate(track){
  const userKey = currentAcademyUserKey();
  return (track.certificates || []).some(c => c.user === userKey);
}
function ensureCertificate(track){
  const progress = getTrackProgress(track);
  if(progress < 100 || userHasCertificate(track)) return;
  track.certificates = track.certificates || [];
  track.certificates.push({
    id: uid(),
    user: currentAcademyUserKey(),
    name: displayUserName(currentUser),
    email: currentUser?.email || '',
    issuedAt: nowBR()
  });
}
function renderAcademy(){
  normalizeAcademyTracks();
  const tracks = db.tracks || [];
  tracks.forEach(ensureCertificate);
  const totalTracks = tracks.length;
  const totalLessons = tracks.reduce((sum,t)=>sum + ((t.lessons||[]).length),0);
  const totalCompletedLessons = tracks.reduce((sum,t)=>sum + ((t.completedLessons||[]).length),0);
  const avgProgress = totalLessons ? Math.round((totalCompletedLessons / totalLessons) * 100) : 0;
  const completedTracks = tracks.filter(t => getTrackProgress(t) >= 100);
  const certificates = tracks.flatMap(t => (t.certificates || []).filter(c=>c.user===currentAcademyUserKey()).map(c=>({track:t.title, ...c})));

  if($('academyOverallProgress')) $('academyOverallProgress').textContent = `${avgProgress}%`;
  if($('academyOverallBar')) $('academyOverallBar').style.width = `${avgProgress}%`;
  if($('academyTrackCount')) $('academyTrackCount').textContent = totalTracks;
  if($('academyStats')){
    $('academyStats').innerHTML = [
      {icon:'', n: totalTracks, t:'Trilhas'},
      {icon:'', n: totalLessons, t:'Aulas'},
      {icon:'', n: totalCompletedLessons, t:'Aulas concluídas'},
      {icon:'', n: certificates.length, t:'Certificados'}
    ].map(s=>`<div class="academy-stat-card"><strong>${s.n}</strong><small>${s.t}</small></div>`).join('');
  }

  if($('academyCertificatesText')){
    $('academyCertificatesText').textContent = certificates.length ? `${certificates.length} certificado(s) emitido(s).` : 'Conclua uma trilha para emitir seu primeiro certificado.';
  }
  if($('academyCertificates')){
    $('academyCertificates').innerHTML = certificates.length
      ? certificates.map(c=>`<div class="certificate-line"><b>✓ ${escapeHtml(c.track)}</b><small>Emitido em ${escapeHtml(c.issuedAt)}</small><button class="small-btn" onclick="downloadCertificate('${escapeAttr(c.track)}','${escapeAttr(c.issuedAt)}')">Baixar</button></div>`).join('')
      : '<div class="certificate-line muted">Em andamento</div>';
  }

  const firstInProgress = tracks.find(t => getTrackProgress(t) < 100) || tracks[0];
  if($('academyFeaturedLesson')){
    const nextLesson = firstInProgress?.lessons?.find(l => !(firstInProgress.completedLessons||[]).includes(l.id)) || firstInProgress?.lessons?.[0];
    $('academyFeaturedLesson').textContent = firstInProgress && nextLesson ? `${firstInProgress.title} • ${nextLesson.title}` : 'Selecione uma trilha para continuar.';
  }

  if(!$('academyGrid')) return;
  $('academyGrid').innerHTML = tracks.map(t=>{
    const lessons = t.lessons || [];
    const completed = t.completedLessons || [];
    const progress = getTrackProgress(t);
    const status = progress >= 100 ? 'Concluído' : progress > 0 ? 'Em andamento' : 'Não iniciado';
    const buttonText = progress >= 100 ? 'Revisar trilha' : progress > 0 ? 'Continuar trilha' : 'Começar trilha';
    const certificateAvailable = progress >= 100;

    return `
      <article class="academy-track-card ${certificateAvailable ? 'track-completed' : ''}">
        <div class="track-cover">
          <span class="track-status">${status}</span>
        </div>
        <div class="track-body">
          <div class="track-title-row">
            <h3>${escapeHtml(t.title)}</h3>
            <span>${escapeHtml(t.category || 'Trilha')}</span>
          </div>
          <p>${escapeHtml(t.description || 'Trilha de aprendizagem Dynamic.')}</p>
          <div class="track-meta">
            <span>${lessons.length} aulas</span>
            <span>${completed.length}/${lessons.length} concluídas</span>
          </div>
          <div class="progress academy-track-progress"><div style="width:${progress}%"></div></div>
          <div class="academy-progress-label">${progress}% concluído</div>

          <div class="lesson-list">
            ${lessons.map((l,i)=>{
              const done = completed.includes(l.id);
              return `
                <label class="academy-lesson ${done ? 'done' : ''}">
                  <input type="checkbox" ${done ? 'checked' : ''} onchange="toggleLesson('${t.id}','${l.id}',this.checked)">
                  <span>${done ? '✓' : i+1}</span>
                  <b>${escapeHtml(l.title)}</b>
                  <small>${escapeHtml(l.type || 'Aula')} • ${escapeHtml(l.duration || '10 min')}</small>
                </label>
              `;
            }).join('')}
          </div>

          <div class="track-actions-row">
            <button class="primary-btn full track-action" onclick="openCourse('${t.id}')">${buttonText}</button>
            <button class="ghost-btn admin-only" onclick="addLesson('${t.id}')">+ Aula</button>
          </div>
          ${certificateAvailable ? `<button class="certificate-download-btn" onclick="downloadCertificate('${escapeAttr(t.title)}','${escapeAttr((t.certificates||[]).find(c=>c.user===currentAcademyUserKey())?.issuedAt || nowBR())}')">Baixar certificado</button>` : ''}
        </div>
      </article>
    `;
  }).join('') || '<div class="empty-state">Nenhuma trilha cadastrada ainda.</div>';

  saveDb();
}

function trackIcon(title=''){
  const t = normalize(title);
  if(t.includes('argo')) return '✈️';
  if(t.includes('reserve')) return '🏨';
  if(t.includes('expense') || t.includes('relatorio')) return '📊';
  if(t.includes('onboarding')) return '🚀';
  if(t.includes('wts')) return '🌐';
  if(t.includes('reserva')) return '🧳';
  return '🎓';
}


function lessonContentHtml(lesson={}){
  const raw = lesson.content || lesson.description || 'Conteúdo da aula. Use esta área para orientar o colaborador, inserir links, vídeos e materiais de apoio.';
  if (/<[a-z][\s\S]*>/i.test(raw)) return raw;
  return String(raw).split('\n').filter(Boolean).map(p=>`<p>${escapeHtml(p)}</p>`).join('');
}
function lessonVideoHtml(lesson={}){
  const url = lesson.video_url || lesson.video || '';
  if(!url) return `<div class="lesson-placeholder">▶ Conteúdo da aula</div>`;
  const safe = escapeAttr(url);
  if(/youtube\.com|youtu\.be|vimeo\.com/i.test(url)) return `<iframe class="lesson-video" src="${safe}" allowfullscreen></iframe>`;
  return `<video class="lesson-video" src="${safe}" controls></video>`;
}
function lessonMaterialsHtml(lesson={}){
  const materials = [];
  if(lesson.file || lesson.file_url) materials.push({label:'Arquivo de apoio', url:lesson.file || lesson.file_url});
  if(lesson.pdf || lesson.pdf_url) materials.push({label:'PDF da aula', url:lesson.pdf || lesson.pdf_url});
  if(lesson.link || lesson.link_url) materials.push({label:'Link complementar', url:lesson.link || lesson.link_url});
  if(Array.isArray(lesson.materials)) lesson.materials.forEach((m,i)=>materials.push({label:m.label || m.title || `Material ${i+1}`, url:m.url || m.href || ''}));
  return materials.filter(m=>m.url).length ? `<div class="lesson-materials"><h3>Materiais de apoio</h3>${materials.filter(m=>m.url).map(m=>`<a href="${escapeAttr(m.url)}" target="_blank">📎 ${escapeHtml(m.label)}</a>`).join('')}</div>` : '';
}
function trackDuration(track){
  const total = (track.lessons||[]).reduce((sum,l)=>sum + (parseInt(String(l.duration||'10').match(/\d+/)?.[0] || '10',10)),0);
  if(total >= 60) return `${Math.floor(total/60)}h${String(total%60).padStart(2,'0')}`;
  return `${total} min`;
}
function academyLessonButtons(track, activeLessonId=''){
  const lessons = track.lessons || [];
  const completed = track.completedLessons || [];
  return lessons.map((l,i)=>`
    <button class="course-lesson-item ${l.id===activeLessonId?'active':''} ${completed.includes(l.id)?'done':''}" onclick="openLessonPage('${track.id}','${l.id}')">
      <span>${completed.includes(l.id) ? '✓' : i+1}</span>
      <div><b>${escapeHtml(l.title)}</b><small>${escapeHtml(l.type || 'Aula')} • ${escapeHtml(l.duration || '10 min')}</small></div>
    </button>
  `).join('') || '<p class="muted">Nenhuma aula cadastrada ainda.</p>';
}
function openCourse(trackId){
  normalizeAcademyTracks();
  const fromPage = currentPageId();
  if(fromPage !== 'courseView' && fromPage !== 'lessonView') courseReturnPage = fromPage || 'academy';
  currentCourseId = trackId;
  const track = db.tracks.find(t=>t.id===trackId);
  if(!track) return;
  ensureCertificate(track);
  const progress = getTrackProgress(track);
  const lessons = track.lessons || [];
  const completed = track.completedLessons || [];
  const cert = (track.certificates||[]).find(c=>c.user===currentAcademyUserKey());
  const next = lessons.find(l=>!completed.includes(l.id)) || lessons[0];
  $('academyCourseFullView').innerHTML = `
    <section class="course-full-page">
      <div class="article-view-actions">
        <button class="ghost-btn" onclick="backToAcademy()">← Voltar para Academia</button>
        ${canManageContent()?`<button class="small-btn" onclick="addLesson('${track.id}')">+ Nova aula</button>`:''}
      </div>
      <div class="article-breadcrumb">Início / Academia / ${escapeHtml(track.title)}</div>
      <div class="course-hero-full">
        <div>
          <span class="pill">${escapeHtml(track.category || 'Curso')}</span>
          <h1>${escapeHtml(track.title)}</h1>
          <p>${escapeHtml(track.description || 'Trilha de aprendizagem Dynamic.')}</p>
          <div class="course-meta-grid">
            <span><b>${lessons.length}</b> aulas</span>
            <span><b>${trackDuration(track)}</b> duração</span>
            <span><b>${completed.length}/${lessons.length}</b> concluídas</span>
            <span><b>Certificado</b> ao concluir</span>
          </div>
          <div class="academy-progress-row course-progress-row"><strong>${progress}%</strong><div class="academy-progress-bar"><div style="width:${progress}%"></div></div></div>
        </div>
        <aside class="course-certificate-box">
          <span class="certificate-icon">🏆</span>
          <h3>${progress >= 100 ? 'Curso concluído' : 'Certificado bloqueado'}</h3>
          <p>${progress >= 100 ? 'Seu certificado já está disponível.' : 'Conclua todas as aulas para liberar o certificado.'}</p>
          ${progress >= 100 ? `<button class="primary-btn full" onclick="downloadCertificate('${escapeAttr(track.title)}','${escapeAttr(cert?.issuedAt || nowBR())}')">Baixar certificado</button>` : `<button class="ghost-btn full" onclick="openLessonPage('${track.id}','${next?.id||''}')">Continuar curso</button>`}
        </aside>
      </div>
      <div class="course-layout-full">
        <main class="course-main-panel">
          <div class="academy-section-top"><div><h3>Conteúdo do curso</h3><p>Acompanhe a sequência das aulas e seu progresso.</p></div></div>
          <div class="course-lessons-list">${academyLessonButtons(track)}</div>
        </main>
        <aside class="course-side-panel">
          <h3>Próxima aula</h3>
          ${next ? `<p>${escapeHtml(next.title)}</p><button class="primary-btn full" onclick="openLessonPage('${track.id}','${next.id}')">${progress > 0 ? 'Continuar' : 'Começar'}</button>` : '<p class="muted">Cadastre aulas para iniciar.</p>'}
          <hr>
          <h3>Resumo</h3>
          <p>${progress}% concluído</p>
          <p>${lessons.length} aulas • ${trackDuration(track)}</p>
        </aside>
      </div>
    </section>`;
  navigate('courseView');
}
function backToAcademy(){ navigate(courseReturnPage || 'academy'); }
function backToCourse(){ if(currentCourseId) openCourse(currentCourseId); else navigate('academy'); }
function openLessonPage(trackId, lessonId){
  normalizeAcademyTracks();
  currentCourseId = trackId;
  currentLessonId = lessonId;
  const track = db.tracks.find(t=>t.id===trackId);
  if(!track) return;
  const lessons = track.lessons || [];
  const lesson = lessons.find(l=>l.id===lessonId) || lessons[0];
  if(!lesson){ openCourse(trackId); return; }
  const completed = track.completedLessons || [];
  const progress = getTrackProgress(track);
  const idx = lessons.findIndex(l=>l.id===lesson.id);
  const prev = lessons[idx-1];
  const next = lessons[idx+1];
  $('academyLessonFullView').innerHTML = `
    <section class="lesson-full-page">
      <div class="article-view-actions">
        <button class="ghost-btn" onclick="backToCourse()">← Voltar para trilha</button>
        ${canManageContent()?`<button class="small-btn" onclick="addLesson('${track.id}')">+ Nova aula</button>`:''}
      </div>
      <div class="article-breadcrumb">Início / Academia / ${escapeHtml(track.title)} / ${escapeHtml(lesson.title)}</div>
      <div class="lesson-shell">
        <aside class="lesson-course-sidebar">
          <h3>${escapeHtml(track.title)}</h3>
          <div class="academy-progress-bar compact"><div style="width:${progress}%"></div></div>
          <small>${progress}% concluído</small>
          <div class="course-lessons-list compact-list">${academyLessonButtons(track, lesson.id)}</div>
        </aside>
        <main class="lesson-content-panel">
          <span class="badge">${escapeHtml(lesson.type || 'Aula')}</span>
          <h1>${escapeHtml(lesson.title)}</h1>
          <p class="article-summary">${escapeHtml(lesson.summary || lesson.subtitle || 'Aula da Academia Dynamic.')}</p>
          ${lessonVideoHtml(lesson)}
          <div class="content-text article-content">${lessonContentHtml(lesson)}</div>
          ${lesson.image || lesson.image_url ? `<img class="content-media article-cover" src="${escapeAttr(lesson.image || lesson.image_url)}" alt="Imagem da aula">` : ''}
          ${lessonMaterialsHtml(lesson)}
          <div class="lesson-actions-bar">
            ${prev ? `<button class="ghost-btn" onclick="openLessonPage('${track.id}','${prev.id}')">← Aula anterior</button>` : '<span></span>'}
            <button class="primary-btn" onclick="completeLessonAndContinue('${track.id}','${lesson.id}')">${completed.includes(lesson.id) ? 'Concluída ✓' : 'Concluir aula'}</button>
            ${next ? `<button class="ghost-btn" onclick="openLessonPage('${track.id}','${next.id}')">Próxima aula →</button>` : `<button class="ghost-btn" onclick="openCourse('${track.id}')">Finalizar trilha</button>`}
          </div>
        </main>
      </div>
    </section>`;
  navigate('lessonView');
}
function completeLessonAndContinue(trackId, lessonId){
  const track = db.tracks.find(t=>t.id===trackId);
  if(!track) return;
  track.completedLessons = track.completedLessons || [];
  if(!track.completedLessons.includes(lessonId)) track.completedLessons.push(lessonId);
  ensureCertificate(track);
  saveDb();
  saveAcademyProgressRemote(track);
  const lessons = track.lessons || [];
  const idx = lessons.findIndex(l=>l.id===lessonId);
  const next = lessons[idx+1];
  if(next) openLessonPage(trackId, next.id); else openCourse(trackId);
}

function toggleLesson(trackId, lessonId, checked){
  normalizeAcademyTracks();
  const track = db.tracks.find(t=>t.id===trackId);
  if(!track) return;
  track.completedLessons = track.completedLessons || [];
  if(checked && !track.completedLessons.includes(lessonId)) track.completedLessons.push(lessonId);
  if(!checked) track.completedLessons = track.completedLessons.filter(id=>id!==lessonId);
  ensureCertificate(track);
  saveDb();
  saveAcademyProgressRemote(track);
  renderAcademy();
}
function openTrack(trackId){ openCourse(trackId); }
function showAcademyLesson(trackId, lessonId){ openLessonPage(trackId, lessonId); }
function closeAcademyLesson(){ $('academyLessonModal')?.classList.add('hidden'); }
function updateTrack(id){openCourse(id);}
function addLesson(trackId){
  const track = db.tracks.find(t=>t.id===trackId);
  if(!track) return;
  const title = prompt('Nome da aula:');
  if(!title) return;
  const duration = prompt('Duração da aula:', '10 min') || '10 min';
  const type = prompt('Tipo de aula:', 'Aula') || 'Aula';
  const video_url = prompt('URL do vídeo da aula (opcional):', '') || '';
  const content = prompt('Descrição/conteúdo inicial da aula:', 'Conteúdo da aula.') || 'Conteúdo da aula.';
  track.lessons = track.lessons || [];
  track.lessons.push({id:uid(), title, duration, type, video_url, content});
  saveDb();
  saveAcademyTrackRemote(track);
  renderAcademy();
}
function addTrack(){
  const title=prompt('Nome da trilha:');
  if(!title) return;
  const description=prompt('Descrição da trilha:', 'Nova trilha de aprendizagem.') || 'Nova trilha de aprendizagem.';
  const track = {id:uid(),title,description,category:'Nova trilha',lessons:[
    {id:uid(),title:'Introdução',duration:'08 min',type:'Aula'},
    {id:uid(),title:'Conteúdo principal',duration:'15 min',type:'Vídeo'},
    {id:uid(),title:'Revisão final',duration:'10 min',type:'Avaliação'}
  ],completedLessons:[],certificates:[]};
  db.tracks.unshift(track);
  saveDb();
  saveAcademyTrackRemote(track);
  renderAcademy();
}
function certificateCode(trackTitle, issuedAt){
  const base = normalize(`${trackTitle}-${issuedAt}-${currentAcademyUserKey()}`).replace(/[^a-z0-9]/g,'').slice(0,10).toUpperCase();
  return `CERT-DD-${new Date().getFullYear()}-${base || '000001'}`;
}
function downloadCertificate(trackTitle, issuedAt){
  const name = displayUserName(currentUser);
  const date = issuedAt || nowBR();
  const moduleName = trackTitle || 'Trilha Dynamic';
  const code = certificateCode(moduleName, date);
  const logoUrl = 'https://res.cloudinary.com/dlpa0zn7h/image/upload/v1782222876/pin-d-pos_nmdij0.png';
  const dynamicLogo = 'https://res.cloudinary.com/dlpa0zn7h/image/upload/v1782222463/pin-d_negativo_1_1_tezunv.png';

  const html = `
    <!doctype html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8">
      <title>Certificado DynamicDoc Academy</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Great+Vibes&display=swap" rel="stylesheet">
      <style>
        :root{
          --blue-dark:#08245c;
          --blue-menu:#0b347f;
          --blue-main:#053798;
          --blue-bright:#0b6cff;
          --gold:#d8a83a;
          --paper:#ffffff;
          --ink:#0c1f4f;
        }
        *{box-sizing:border-box}
        body{
          margin:0;
          min-height:100vh;
          background:#eef3ff;
          font-family:Inter,Arial,sans-serif;
          color:var(--ink);
          display:flex;
          align-items:center;
          justify-content:center;
          padding:28px;
        }
        .certificate{
          width:1180px;
          min-height:835px;
          background:
            radial-gradient(circle at 82% 25%, rgba(11,108,255,.08), transparent 30%),
            radial-gradient(circle at 8% 95%, rgba(5,55,152,.08), transparent 28%),
            var(--paper);
          border:2px solid var(--blue-bright);
          border-radius:28px;
          position:relative;
          overflow:hidden;
          box-shadow:0 30px 90px rgba(8,36,92,.18);
          padding:38px 64px 78px;
        }
        .certificate:before{
          content:"";
          position:absolute;
          top:-150px;
          left:-190px;
          width:460px;
          height:460px;
          background:linear-gradient(135deg,var(--blue-dark),var(--blue-main));
          transform:rotate(45deg);
          border-radius:60px;
          box-shadow:0 20px 45px rgba(5,55,152,.35);
        }
        .certificate:after{
          content:"";
          position:absolute;
          right:-140px;
          bottom:-160px;
          width:400px;
          height:400px;
          background:linear-gradient(135deg,var(--blue-bright),var(--blue-dark));
          transform:rotate(45deg);
          border-radius:56px;
        }
        .corner-logo{
          position:absolute;
          top:48px;
          left:50px;
          width:118px;
          height:118px;
          object-fit:contain;
          z-index:2;
          filter:drop-shadow(0 16px 24px rgba(0,0,0,.28));
        }
        .watermark{
          position:absolute;
          right:72px;
          top:120px;
          width:360px;
          opacity:.055;
          z-index:1;
        }
        .content{
          position:relative;
          z-index:3;
          text-align:center;
        }
        .brand-title{
          font-size:40px;
          font-weight:900;
          letter-spacing:-.05em;
          color:var(--blue-dark);
          margin-top:5px;
        }
        .brand-title span{color:var(--blue-bright);font-weight:500}
        .academy-label{
          margin-top:8px;
          letter-spacing:.34em;
          font-size:13px;
          font-weight:800;
          color:var(--blue-main);
          text-transform:uppercase;
        }
        .main-title{
          margin:28px 0 0;
          font-size:56px;
          line-height:1;
          letter-spacing:.10em;
          font-weight:900;
          color:var(--blue-dark);
          text-transform:uppercase;
        }
        .subtitle{
          margin:13px auto 24px;
          color:var(--blue-bright);
          font-size:22px;
          letter-spacing:.32em;
          font-weight:800;
          text-transform:uppercase;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:18px;
        }
        .subtitle:before,.subtitle:after{content:"";width:100px;height:2px;background:var(--blue-bright)}
        .intro{font-size:17px;margin:0 0 6px;color:#344161}
        .student-name{
          font-family:'Great Vibes',cursive;
          font-size:clamp(48px, 5vw, 66px);
          line-height:1.04;
          max-width:820px;
          margin-left:auto;
          margin-right:auto;
          overflow-wrap:break-word;
          color:var(--blue-dark);
          margin:8px 0 14px;
        }
        .course-text{font-size:17px;color:#344161;margin:0}
        .course-name{
          font-size:32px;
          color:var(--blue-bright);
          font-weight:900;
          letter-spacing:.05em;
          text-transform:uppercase;
          margin:12px 0 14px;
        }
        .description{
          max-width:690px;
          margin:0 auto 22px;
          font-size:16px;
          line-height:1.55;
          color:#344161;
        }
        .seal{
          position:absolute;
          right:105px;
          top:98px;
          left:auto;
          width:118px;
          height:118px;
          border-radius:50%;
          background:linear-gradient(145deg,#f8df80,#bd861c);
          display:grid;
          place-items:center;
          box-shadow:0 14px 34px rgba(5,55,152,.22);
          z-index:4;
        }
        .seal:before{
          content:"";
          position:absolute;
          inset:15px;
          border-radius:50%;
          background:linear-gradient(135deg,var(--blue-dark),var(--blue-bright));
          border:3px solid rgba(255,255,255,.45);
        }
        .seal img{position:relative;z-index:2;width:58px;height:58px;object-fit:contain}
        .seal-ribbons{
          position:absolute;
          right:132px;
          top:200px;
          left:auto;
          z-index:2;
          display:flex;
          gap:8px;
        }
        .seal-ribbons span{display:block;width:35px;height:95px;background:var(--blue-dark);clip-path:polygon(0 0,100% 0,100% 100%,50% 78%,0 100%)}
        .seal-ribbons span:last-child{background:var(--blue-main)}
        .info-row{
          width:760px;
          margin:18px auto 30px;
          background:#fff;
          border:1px solid rgba(8,36,92,.10);
          border-radius:14px;
          box-shadow:0 13px 35px rgba(8,36,92,.12);
          display:grid;
          grid-template-columns:repeat(4,1fr);
          overflow:hidden;
        }
        .info-item{padding:18px 16px;border-right:1px solid #e5eaf5}
        .info-item:last-child{border-right:0}
        .info-item b{display:block;font-size:12px;color:var(--blue-main);text-transform:uppercase;margin-bottom:7px}
        .info-item span{font-size:16px;color:var(--blue-dark)}
        .bottom{
          display:grid;
          grid-template-columns:1.15fr .85fr 1.15fr;
          gap:22px;
          align-items:end;
          margin-top:10px;
          margin-bottom:26px;
          text-align:left;
        }
        .signature{text-align:left;padding-left:42px}
        .signature .sign{
          font-family:'Great Vibes',cursive;
          font-size:38px;
          color:var(--blue-dark);
          border-bottom:2px solid var(--blue-bright);
          padding-bottom:2px;
          display:inline-block;
          min-width:230px;
        }
        .signature b{display:block;margin-top:10px;color:var(--blue-main)}
        .signature small{color:#344161}
        .congrats{text-align:center;color:var(--blue-main);font-weight:900}
        .congrats small{display:block;color:#344161;font-weight:500;line-height:1.4;margin-top:6px}
        .verify{text-align:left;display:flex;gap:14px;align-items:center}
        .qr{
          width:86px;height:86px;border-radius:10px;border:3px solid var(--blue-bright);
          background:
            linear-gradient(90deg,#111 10px,transparent 10px) 0 0/20px 20px,
            linear-gradient(#111 10px,transparent 10px) 0 0/20px 20px,
            #fff;
          opacity:.85;
        }
        .verify b{color:var(--blue-main);display:block;text-transform:uppercase;font-size:15px}
        .verify small{font-size:11px;color:#344161}
        .code{
          position:absolute;
          bottom:0;
          left:50%;
          transform:translateX(-50%);
          background:var(--blue-dark);
          color:#fff;
          border-radius:18px 18px 0 0;
          padding:10px 54px 11px;
          text-align:center;
          z-index:4;
          border:2px solid var(--gold);
          border-bottom:0;
        }
        .code small{display:block;letter-spacing:.12em;text-transform:uppercase;font-weight:800;font-size:11px;color:#dce7ff}
        .code b{font-size:18px;letter-spacing:.08em}
        .actions{position:fixed;right:24px;bottom:24px;display:flex;gap:10px;z-index:20}
        .actions button{border:0;border-radius:12px;padding:12px 18px;font-weight:800;cursor:pointer;background:var(--blue-main);color:white;box-shadow:0 12px 30px rgba(8,36,92,.22)}
        .actions button.secondary{background:white;color:var(--blue-main)}
        @media print{
          body{background:white;padding:0}.certificate{box-shadow:none;border-radius:0;width:100vw;min-height:100vh;border:0}.actions{display:none}
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <img class="corner-logo" src="${logoUrl}" alt="Dynamic">
        <img class="watermark" src="${logoUrl}" alt="">
        <div class="seal-ribbons"><span></span><span></span></div>
        <div class="seal"><img src="${dynamicLogo}" alt="D"></div>
        <div class="content">
          <div class="brand-title">dynamic<span>travel</span></div>
          <div class="academy-label">DynamicDoc Academy</div>
          <h1 class="main-title">Certificado</h1>
          <div class="subtitle">de conclusão</div>
          <p class="intro">Certificamos que</p>
          <div class="student-name">${escapeHtml(name)}</div>
          <p class="course-text">concluiu com êxito a trilha de aprendizagem</p>
          <div class="course-name">${escapeHtml(moduleName)}</div>
          <p class="description">Demonstrando conhecimento dos processos, funcionalidades e boas práticas relacionadas ao módulo concluído na Academia Dynamic.</p>

          <div class="info-row">
            <div class="info-item"><b>Nível</b><span>Básico</span></div>
            <div class="info-item"><b>Carga horária</b><span>Conforme trilha</span></div>
            <div class="info-item"><b>Data de conclusão</b><span>${escapeHtml(date)}</span></div>
            <div class="info-item"><b>Conclusão</b><span>100%</span></div>
          </div>

          <div class="bottom">
            <div class="signature">
              <div class="sign">Nathalia Araujo</div>
              <b>Nathalia Araujo</b>
              <small>Gestão Dynamic Travel</small>
            </div>
            <div class="congrats">
              ★ ★ ★<br>PARABÉNS!
              <small>Seu empenho transforma conhecimento em excelência.</small>
            </div>
            <div class="verify">
              <div class="qr"></div>
              <div><b>Verifique a autenticidade</b><small>Escaneie o QR Code ou valide pelo DynamicDoc.<br>${escapeHtml(code)}</small></div>
            </div>
          </div>
        </div>
        <div class="code"><small>Código de certificado</small><b>${escapeHtml(code)}</b></div>
      </div>
      <div class="actions"><button onclick="window.print()">Baixar / imprimir PDF</button><button class="secondary" onclick="window.close()">Fechar</button></div>
    </body></html>`;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
}


function renderAdmin(){
  const top=db.articles.slice().sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,5);
  $('adminStats').innerHTML=[{n:db.articles.length,t:'Conteúdos'},{n:db.users.length,t:'Usuários'},{n:db.searchLogs.length,t:'Buscas'},{n:db.modules.length,t:'Módulos'}].map(c=>`<div class="stat-card"><strong>${c.n}</strong><span>${c.t}</span></div>`).join('');
  $('usersList').innerHTML=db.users.map(u=>`<div class="user-row"><span><b>${escapeHtml(u.fullName || u.name)}</b><br><small>${escapeHtml(u.email)} • ${roleLabel(u.role)}</small></span><button class="small-btn small-danger" onclick="removeUser('${u.id}')">Remover</button></div>`).join('');
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
function addUser(){const fullName=$('userFullName')?.value.trim()||''; const u={id:uid(),name:$('userName').value.trim(),fullName,email:$('userEmail').value.trim(),role:$('userRole').value,department:$('userDepartment').value}; if(!u.name||!u.fullName||!u.email) return alert('Preencha nome, nome completo e e-mail.'); db.users.unshift(u); saveDb(); upsert(PROFILE_TABLE, u); ['userName','userFullName','userEmail'].forEach(id=>{if($(id)) $(id).value=''}); renderAdmin();}
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
  if(supabaseDb && email && pass){ const {error}=await supabaseDb.auth.signInWithPassword({email,password:pass}); if(error) return alert('Erro no login: '+error.message); const profile=db.users.find(u=>normalize(u.email)===normalize(email)); currentUser=profile ? {...profile} : {name:email,fullName:email,email,role:'admin',department:'suporte'}; }
  else { const profile=db.users.find(u=>normalize(u.email)===normalize(email)); currentUser=profile ? {...profile} : {id:uid(),name:email?.split('@')[0]||'Colaborador Dynamic',fullName:email?.split('@')[0]||'Colaborador Dynamic',email:email||'demo@dynamictravel.com',role:'colaborador',department:'suporte'}; }
  saveUser(); $('loginPanel').classList.add('hidden'); renderAll();
}
function testLogin(role){currentUser={id:uid(),name:role==='admin'?'Administrador Dynamic':role==='gestor'?'Gestor de Conteúdo':'Colaborador Dynamic',fullName:role==='admin'?'Administrador Dynamic':role==='gestor'?'Gestor de Conteúdo Dynamic':'Colaborador Dynamic',email:`${role}@dynamictravel.com`,role,department:'suporte'}; saveUser(); $('loginPanel').classList.add('hidden'); renderAll();}
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
  $('articleSystem').addEventListener('change',updateModuleOptions);
  document.querySelectorAll('[data-editor-cmd]').forEach(btn=>btn.addEventListener('click',()=>runEditorCommand(btn.dataset.editorCmd, btn.dataset.editorValue || null)));
  $('insertArticleImageBtn')?.addEventListener('click',()=> $('articleInlineImageFile')?.click());
  $('insertChecklistBtn')?.addEventListener('click',insertChecklistBlock);
  $('insertVideoBlockBtn')?.addEventListener('click',insertVideoBlock);
  $('insertTableBlockBtn')?.addEventListener('click',insertTableBlock);
  $('insertAlertBlockBtn')?.addEventListener('click',insertAlertBlock);
  $('insertCodeBlockBtn')?.addEventListener('click',insertCodeBlock);
  $('insertLinkBtn')?.addEventListener('click',insertLinkBlock);
  $('insertAccordionBtn')?.addEventListener('click',insertAccordionBlock);
  $('insertColumnsBtn')?.addEventListener('click',insertColumnsBlock);
  $('insertGalleryBtn')?.addEventListener('click',()=> $('articleGalleryFiles')?.click());
  $('articleGalleryFiles')?.addEventListener('change', async e=>{ await insertGalleryFromFiles(e.target.files); e.target.value=''; });
  $('articleInlineImageFile')?.addEventListener('change', async e=>{ await insertImageInEditorFromFile(e.target.files?.[0]); e.target.value=''; });
  $('articleContent')?.addEventListener('keydown', e=>{ if(e.key==='/') setTimeout(handleEditorSlashCommand, 0); });
  $('articleContent')?.addEventListener('paste', e=>{ const file=[...(e.clipboardData?.files||[])].find(f=>f.type.startsWith('image/')); if(file){ e.preventDefault(); insertImageInEditorFromFile(file); } });
  $('articleContent')?.addEventListener('dragover', e=>e.preventDefault());
  $('articleContent')?.addEventListener('drop', e=>{ const files=[...(e.dataTransfer?.files||[])].filter(f=>f.type.startsWith('image/')); if(files.length){ e.preventDefault(); files.length>1 ? insertGalleryFromFiles(files) : insertImageInEditorFromFile(files[0]); } });
  if($('closeArticleModal')) $('closeArticleModal').onclick=()=>$('articleModal').classList.add('hidden'); if($('articleModal')) $('articleModal').addEventListener('click',e=>{if(e.target.id==='articleModal') $('articleModal').classList.add('hidden')});
  $('addSystemBtn').onclick=addSystem; $('addModuleBtn').onclick=addModule; $('addUserBtn').onclick=addUser; $('addTrackBtn').onclick=addTrack;
}

window.insertChecklistBlock=insertChecklistBlock; window.insertTableBlock=insertTableBlock; window.insertAlertBlock=insertAlertBlock; window.insertCodeBlock=insertCodeBlock; window.insertAccordionBlock=insertAccordionBlock; window.insertColumnsBlock=insertColumnsBlock;
window.closeAcademyLesson=closeAcademyLesson; window.showAcademyLesson=showAcademyLesson;
window.openArticle=openArticle; window.backFromArticle=backFromArticle; window.toggleFavorite=toggleFavorite; window.editArticle=editArticle; window.deleteArticle=deleteArticle; window.addComment=addComment; window.rateArticle=rateArticle; window.updateTrack=updateTrack; window.toggleLesson=toggleLesson; window.openTrack=openTrack; window.addLesson=addLesson; window.downloadCertificate=downloadCertificate; window.removeUser=removeUser;

/* =========================================================
   DynamicDoc Academia 4.0 - LMS corporativo
   - Admin: edição/gestão completa
   - Usuário/agência: somente visualização, progresso e certificado
   - Mantém menu lateral em curso e aula
   ========================================================= */
const academyCanManage = () => isAdmin();
const academyRoleText = () => academyCanManage() ? 'Administrador: edição e visualização' : 'Usuário agência: visualização e progresso';

function academyCourseStats(){
  normalizeAcademyTracks();
  const tracks = db.tracks || [];
  const lessons = tracks.flatMap(t => t.lessons || []);
  const certificates = tracks.flatMap(t => t.certificates || []);
  const avg = tracks.length ? Math.round(tracks.reduce((s,t)=>s + getTrackProgress(t),0)/tracks.length) : 0;
  return {courses:tracks.length, lessons:lessons.length, certificates:certificates.length, avg};
}

function academyAdminToolbar(){
  if(!academyCanManage()) return '';
  const stats = academyCourseStats();
  return `
    <section class="academy-admin-panel">
      <div class="academy-admin-head">
        <div>
          <span class="pill">Painel administrativo</span>
          <h3>Gestão da Academia</h3>
          <p>Crie cursos, organize aulas, acompanhe certificados e controle o catálogo exibido para usuários da agência.</p>
        </div>
        <button class="primary-btn" onclick="addTrackV4()">+ Novo curso</button>
      </div>
      <div class="academy-admin-kpis">
        <div class="academy-admin-kpi"><small>Cursos</small><strong>${stats.courses}</strong><span>Total cadastrado</span></div>
        <div class="academy-admin-kpi"><small>Aulas</small><strong>${stats.lessons}</strong><span>Conteúdos ativos</span></div>
        <div class="academy-admin-kpi"><small>Certificados</small><strong>${stats.certificates}</strong><span>Emitidos</span></div>
        <div class="academy-admin-kpi"><small>Média geral</small><strong>${stats.avg}%</strong><span>Conclusão média</span></div>
      </div>
    </section>`;
}

function renderAcademy(){
  normalizeAcademyTracks();
  const tracks = db.tracks || [];
  const stats = academyCourseStats();
  const certificates = tracks.flatMap(t => (t.certificates||[]).map(c => ({...c, trackTitle:t.title})));
  const firstInProgress = tracks.find(t => getTrackProgress(t) > 0 && getTrackProgress(t) < 100) || tracks.find(t => getTrackProgress(t) < 100) || tracks[0];

  if($('academyOverallProgress')) $('academyOverallProgress').textContent = `${stats.avg}%`;
  if($('academyOverallBar')) $('academyOverallBar').style.width = `${stats.avg}%`;
  if($('academyTrackCount')) $('academyTrackCount').textContent = stats.courses;
  if($('academyStats')) $('academyStats').innerHTML = [
    {n:stats.courses,t:'Cursos'},
    {n:stats.lessons,t:'Aulas'},
    {n:stats.certificates,t:'Certificados'},
    {n:academyRoleText(),t:'Perfil ativo'}
  ].map(s=>`<div class="academy-stat-card"><strong>${escapeHtml(String(s.n))}</strong><small>${escapeHtml(s.t)}</small></div>`).join('');

  if($('academyCertificatesText')) $('academyCertificatesText').textContent = certificates.length ? `${certificates.length} certificado(s) emitido(s).` : 'Conclua um curso para emitir seu primeiro certificado.';
  if($('academyCertificates')) $('academyCertificates').innerHTML = certificates.length ? certificates.map(c=>`<button class="certificate-line" onclick="downloadCertificate('${escapeAttr(c.trackTitle)}','${escapeAttr(c.issuedAt)}')">${escapeHtml(c.trackTitle)}<small>${escapeHtml(c.issuedAt)}</small></button>`).join('') : '<p class="muted">Sem certificados ainda.</p>';
  if($('academyFeaturedLesson')){
    const nextLesson = firstInProgress?.lessons?.find(l => !(firstInProgress.completedLessons||[]).includes(l.id)) || firstInProgress?.lessons?.[0];
    $('academyFeaturedLesson').textContent = firstInProgress && nextLesson ? `${firstInProgress.title} • ${nextLesson.title}` : 'Selecione um curso para continuar.';
  }

  const sectionTop = document.querySelector('#academy .academy-section-top');
  if(sectionTop){
    sectionTop.innerHTML = `
      <div>
        <h3>Catálogo de cursos</h3>
        <p>${academyCanManage() ? 'Você está vendo a visão administrativa da Academia.' : 'Cursos disponíveis para aprendizagem e certificação.'}</p>
      </div>
      ${academyCanManage() ? '<button class="primary-btn" onclick="addTrackV4()">+ Novo curso</button>' : ''}`;
  }

  const oldAdminPanel = document.querySelector('.academy-admin-panel');
  if(oldAdminPanel) oldAdminPanel.remove();
  const layout = document.querySelector('#academy .academy-layout');
  if(layout) layout.insertAdjacentHTML('beforebegin', academyAdminToolbar());

  if(!$('academyGrid')) return;
  $('academyGrid').innerHTML = tracks.map(t=>{
    const lessons = t.lessons || [];
    const completed = t.completedLessons || [];
    const progress = getTrackProgress(t);
    const status = progress >= 100 ? 'Concluído' : progress > 0 ? 'Em andamento' : 'Não iniciado';
    const buttonText = progress >= 100 ? 'Revisar curso' : progress > 0 ? 'Continuar curso' : 'Começar curso';
    const next = lessons.find(l=>!completed.includes(l.id)) || lessons[0];
    return `
      <article class="academy-track-card ${progress>=100?'track-completed':''}">
        <div class="track-cover" ${t.banner_url ? `style="background-image:url('${escapeAttr(t.banner_url)}')"` : ''}>
          <span class="track-status">${escapeHtml(status)}</span>
          ${academyCanManage()?`<span class="track-admin-badge">ADM</span>`:''}
        </div>
        <div class="track-body">
          <div class="track-title-row"><h3>${escapeHtml(t.title)}</h3><span>${escapeHtml(t.category || 'Curso')}</span></div>
          <p>${escapeHtml(t.description || 'Curso da Academia Dynamic.')}</p>
          <div class="track-meta"><span>${lessons.length} aulas</span><span>${trackDuration(t)}</span><span>${escapeHtml(t.difficulty || 'Básico')}</span></div>
          <div class="progress academy-track-progress"><div style="width:${progress}%"></div></div>
          <div class="academy-progress-label">${progress}% concluído</div>
          <div class="track-actions-row">
            <button class="primary-btn full" onclick="openCourse('${t.id}')">${buttonText}</button>
            ${next?`<button class="ghost-btn" onclick="openLessonPage('${t.id}','${next.id}')">Aula</button>`:''}
          </div>
          ${academyCanManage()?`
            <div class="academy-admin-actions">
              <button class="small-btn" onclick="editCourseV4('${t.id}')">✏ Editar</button>
              <button class="small-btn" onclick="addLessonV4('${t.id}')">+ Aula</button>
              <button class="small-btn" onclick="duplicateCourseV4('${t.id}')">Duplicar</button>
              <button class="small-btn small-danger" onclick="deleteCourseV4('${t.id}')">Excluir</button>
            </div>`:''}
          ${progress>=100 ? `<button class="certificate-download-btn" onclick="downloadCertificate('${escapeAttr(t.title)}','${escapeAttr((t.certificates||[]).find(c=>c.user===currentAcademyUserKey())?.issuedAt || nowBR())}')">Baixar certificado</button>` : ''}
        </div>
      </article>`;
  }).join('') || '<div class="empty-state">Nenhum curso cadastrado ainda.</div>';
  saveDb();
}

function openCourse(trackId){
  normalizeAcademyTracks();
  const fromPage = currentPageId();
  if(fromPage !== 'courseView' && fromPage !== 'lessonView') courseReturnPage = fromPage || 'academy';
  currentCourseId = trackId;
  const track = db.tracks.find(t=>t.id===trackId);
  if(!track) return;
  ensureCertificate(track);
  const progress = getTrackProgress(track);
  const lessons = track.lessons || [];
  const completed = track.completedLessons || [];
  const cert = (track.certificates||[]).find(c=>c.user===currentAcademyUserKey());
  const next = lessons.find(l=>!completed.includes(l.id)) || lessons[0];
  $('academyCourseFullView').innerHTML = `
    <section class="course-full-page">
      <div class="article-view-actions">
        <button class="ghost-btn" onclick="backToAcademy()">← Voltar para Academia</button>
        ${academyCanManage()?`<button class="small-btn" onclick="editCourseV4('${track.id}')">✏ Editar curso</button><button class="small-btn" onclick="addLessonV4('${track.id}')">+ Nova aula</button>`:''}
      </div>
      <div class="article-breadcrumb">Início / Academia / ${escapeHtml(track.title)}</div>
      <div class="course-hero-full">
        <div>
          <span class="pill">${escapeHtml(track.category || 'Curso')}</span>
          <h1>${escapeHtml(track.title)}</h1>
          <p>${escapeHtml(track.description || 'Curso da Academia Dynamic.')}</p>
          <div class="course-meta-grid">
            <span><b>${lessons.length}</b> aulas</span>
            <span><b>${trackDuration(track)}</b> duração</span>
            <span><b>${escapeHtml(track.instructor || 'Dynamic Travel')}</b> instrutor</span>
            <span><b>${escapeHtml(track.difficulty || 'Básico')}</b> nível</span>
            <span><b>${completed.length}/${lessons.length}</b> concluídas</span>
            <span><b>Certificado</b> ao concluir</span>
          </div>
          <div class="academy-progress-row course-progress-row"><strong>${progress}%</strong><div class="academy-progress-bar"><div style="width:${progress}%"></div></div></div>
        </div>
        <aside class="course-certificate-box">
          <span class="certificate-icon">🏆</span>
          <h3>${progress >= 100 ? 'Curso concluído' : 'Certificado bloqueado'}</h3>
          <p>${progress >= 100 ? 'Seu certificado já está disponível.' : 'Conclua todas as aulas para liberar o certificado.'}</p>
          ${progress >= 100 ? `<button class="primary-btn full" onclick="downloadCertificate('${escapeAttr(track.title)}','${escapeAttr(cert?.issuedAt || nowBR())}')">Baixar certificado</button>` : `<button class="ghost-btn full" onclick="openLessonPage('${track.id}','${next?.id||''}')">Continuar curso</button>`}
        </aside>
      </div>
      <div class="course-layout-full">
        <main class="course-main-panel">
          <div class="academy-section-top"><div><h3>Conteúdo do curso</h3><p>Sequência de aulas, materiais e progresso.</p></div></div>
          <div class="course-lessons-list">${academyLessonButtons(track)}</div>
        </main>
        <aside class="course-side-panel">
          <h3>Administração</h3>
          ${academyCanManage()?`<button class="primary-btn full" onclick="addLessonV4('${track.id}')">+ Nova aula</button><button class="ghost-btn full" onclick="editCourseV4('${track.id}')">Editar dados</button><p class="muted">Visão completa para ADM.</p>`:'<p class="muted">Você está na visão de usuário agência.</p>'}
          <hr>
          <h3>Próxima aula</h3>
          ${next ? `<p>${escapeHtml(next.title)}</p><button class="primary-btn full" onclick="openLessonPage('${track.id}','${next.id}')">${progress > 0 ? 'Continuar' : 'Começar'}</button>` : '<p class="muted">Cadastre aulas para iniciar.</p>'}
          <hr><h3>Resumo</h3><p>${progress}% concluído</p><p>${lessons.length} aulas • ${trackDuration(track)}</p>
        </aside>
      </div>
    </section>`;
  navigate('courseView');
}

function academyLessonButtons(track, activeLessonId=''){
  const lessons = track.lessons || [];
  const completed = track.completedLessons || [];
  return lessons.map((l,i)=>`
    <div class="course-lesson-wrap">
      <button class="course-lesson-item ${l.id===activeLessonId?'active':''} ${completed.includes(l.id)?'done':''}" onclick="openLessonPage('${track.id}','${l.id}')">
        <span>${completed.includes(l.id) ? '✓' : i+1}</span>
        <div><b>${escapeHtml(l.title)}</b><small>${escapeHtml(l.type || 'Aula')} • ${escapeHtml(l.duration || '10 min')}</small></div>
      </button>
      ${academyCanManage()?`<div class="lesson-admin-actions"><button onclick="editLessonV4('${track.id}','${l.id}')">Editar</button><button onclick="deleteLessonV4('${track.id}','${l.id}')">Excluir</button></div>`:''}
    </div>`).join('') || '<p class="muted">Nenhuma aula cadastrada ainda.</p>';
}

function openLessonPage(trackId, lessonId){
  normalizeAcademyTracks(); currentCourseId = trackId; currentLessonId = lessonId;
  const track = db.tracks.find(t=>t.id===trackId); if(!track) return;
  const lessons = track.lessons || []; const lesson = lessons.find(l=>l.id===lessonId) || lessons[0];
  if(!lesson){ openCourse(trackId); return; }
  const completed = track.completedLessons || []; const progress = getTrackProgress(track);
  const idx = lessons.findIndex(l=>l.id===lesson.id); const prev = lessons[idx-1]; const next = lessons[idx+1];
  $('academyLessonFullView').innerHTML = `
    <section class="lesson-full-page">
      <div class="article-view-actions">
        <button class="ghost-btn" onclick="backToCourse()">← Voltar para curso</button>
        ${academyCanManage()?`<button class="small-btn" onclick="editLessonV4('${track.id}','${lesson.id}')">✏ Editar aula</button><button class="small-btn" onclick="addLessonV4('${track.id}')">+ Nova aula</button>`:''}
      </div>
      <div class="article-breadcrumb">Início / Academia / ${escapeHtml(track.title)} / ${escapeHtml(lesson.title)}</div>
      <div class="lesson-shell">
        <aside class="lesson-course-sidebar">
          <h3>${escapeHtml(track.title)}</h3>
          <div class="academy-progress-bar compact"><div style="width:${progress}%"></div></div><small>${progress}% concluído</small>
          <div class="course-lessons-list compact-list">${academyLessonButtons(track, lesson.id)}</div>
        </aside>
        <main class="lesson-content-panel">
          <span class="badge">${escapeHtml(lesson.type || 'Aula')}</span>
          <h1>${escapeHtml(lesson.title)}</h1>
          <p class="article-summary">${escapeHtml(lesson.summary || lesson.subtitle || 'Aula da Academia Dynamic.')}</p>
          ${lessonVideoHtml(lesson)}
          <div class="content-text article-content">${lessonContentHtml(lesson)}</div>
          ${lesson.image || lesson.image_url ? `<img class="content-media article-cover" src="${escapeAttr(lesson.image || lesson.image_url)}" alt="Imagem da aula">` : ''}
          ${lessonMaterialsHtml(lesson)}
          ${lesson.quiz ? `<div class="lesson-materials"><h3>Quiz</h3><p>${escapeHtml(lesson.quiz)}</p></div>` : ''}
          <div class="lesson-actions-bar">
            ${prev ? `<button class="ghost-btn" onclick="openLessonPage('${track.id}','${prev.id}')">← Aula anterior</button>` : '<span></span>'}
            <button class="primary-btn" onclick="completeLessonAndContinue('${track.id}','${lesson.id}')">${completed.includes(lesson.id) ? 'Concluída ✓' : 'Concluir aula'}</button>
            ${next ? `<button class="ghost-btn" onclick="openLessonPage('${track.id}','${next.id}')">Próxima aula →</button>` : `<button class="ghost-btn" onclick="openCourse('${track.id}')">Finalizar curso</button>`}
          </div>
        </main>
      </div>
    </section>`;
  navigate('lessonView');
}

function addTrackV4(){
  if(!academyCanManage()) return alert('Apenas administradores podem criar cursos.');
  const title = prompt('Nome do curso:'); if(!title) return;
  const description = prompt('Descrição:', 'Novo curso da Academia Dynamic.') || 'Novo curso da Academia Dynamic.';
  const category = prompt('Categoria:', 'Sistemas') || 'Sistemas';
  const instructor = prompt('Instrutor:', 'Dynamic Travel') || 'Dynamic Travel';
  const difficulty = prompt('Dificuldade:', 'Básico') || 'Básico';
  const track = {id:uid(), title, description, category, instructor, difficulty, lessons:[], completedLessons:[], certificates:[], createdAt:nowBR(), updatedAt:nowBR()};
  db.tracks.unshift(track); saveDb(); saveAcademyTrackRemote(track); renderAcademy(); openCourse(track.id);
}
function editCourseV4(trackId){
  if(!academyCanManage()) return alert('Apenas administradores podem editar cursos.');
  const t = db.tracks.find(x=>x.id===trackId); if(!t) return;
  t.title = prompt('Nome do curso:', t.title) || t.title;
  t.description = prompt('Descrição:', t.description || '') || t.description;
  t.category = prompt('Categoria:', t.category || 'Sistemas') || t.category;
  t.instructor = prompt('Instrutor:', t.instructor || 'Dynamic Travel') || t.instructor;
  t.difficulty = prompt('Dificuldade:', t.difficulty || 'Básico') || t.difficulty;
  t.banner_url = prompt('URL do banner/capa (opcional):', t.banner_url || '') || t.banner_url || '';
  t.updatedAt = nowBR(); saveDb(); saveAcademyTrackRemote(t); currentPageId()==='courseView'?openCourse(trackId):renderAcademy();
}
function deleteCourseV4(trackId){
  if(!academyCanManage()) return alert('Apenas administradores podem excluir cursos.');
  if(!confirm('Excluir este curso e suas aulas?')) return;
  db.tracks = (db.tracks||[]).filter(t=>t.id!==trackId); saveDb(); renderAcademy(); navigate('academy');
}
function duplicateCourseV4(trackId){
  if(!academyCanManage()) return;
  const t = db.tracks.find(x=>x.id===trackId); if(!t) return;
  const copy = JSON.parse(JSON.stringify(t)); copy.id = uid(); copy.title = `${copy.title} (cópia)`; copy.lessons = (copy.lessons||[]).map(l=>({...l,id:uid()})); copy.completedLessons=[]; copy.certificates=[]; copy.createdAt=nowBR(); copy.updatedAt=nowBR();
  db.tracks.unshift(copy); saveDb(); renderAcademy();
}
function addLessonV4(trackId){
  if(!academyCanManage()) return alert('Apenas administradores podem criar aulas.');
  const track = db.tracks.find(t=>t.id===trackId); if(!track) return;
  const title = prompt('Nome da aula:'); if(!title) return;
  const duration = prompt('Duração:', '10 min') || '10 min';
  const type = prompt('Tipo:', 'Aula') || 'Aula';
  const video_url = prompt('URL do vídeo (opcional):', '') || '';
  const content = prompt('Conteúdo inicial:', 'Conteúdo da aula.') || 'Conteúdo da aula.';
  track.lessons = track.lessons || []; track.lessons.push({id:uid(), title, duration, type, video_url, content, materials:[]}); track.updatedAt=nowBR();
  saveDb(); saveAcademyTrackRemote(track); openCourse(trackId);
}
function editLessonV4(trackId, lessonId){
  if(!academyCanManage()) return alert('Apenas administradores podem editar aulas.');
  const track = db.tracks.find(t=>t.id===trackId); const lesson = track?.lessons?.find(l=>l.id===lessonId); if(!lesson) return;
  lesson.title = prompt('Nome da aula:', lesson.title) || lesson.title;
  lesson.duration = prompt('Duração:', lesson.duration || '10 min') || lesson.duration;
  lesson.type = prompt('Tipo:', lesson.type || 'Aula') || lesson.type;
  lesson.video_url = prompt('URL do vídeo:', lesson.video_url || lesson.video || '') || lesson.video_url || '';
  lesson.image_url = prompt('URL da imagem:', lesson.image_url || lesson.image || '') || lesson.image_url || '';
  lesson.pdf_url = prompt('URL do PDF/material:', lesson.pdf_url || lesson.pdf || lesson.file_url || '') || lesson.pdf_url || '';
  lesson.link_url = prompt('Link complementar:', lesson.link_url || lesson.link || '') || lesson.link_url || '';
  lesson.content = prompt('Conteúdo/descrição:', lesson.content || lesson.description || '') || lesson.content || '';
  lesson.quiz = prompt('Quiz/pergunta opcional:', lesson.quiz || '') || lesson.quiz || '';
  track.updatedAt=nowBR(); saveDb(); saveAcademyTrackRemote(track); currentPageId()==='lessonView'?openLessonPage(trackId,lessonId):openCourse(trackId);
}
function deleteLessonV4(trackId, lessonId){
  if(!academyCanManage()) return alert('Apenas administradores podem excluir aulas.');
  if(!confirm('Excluir esta aula?')) return;
  const track = db.tracks.find(t=>t.id===trackId); if(!track) return;
  track.lessons = (track.lessons||[]).filter(l=>l.id!==lessonId);
  track.completedLessons = (track.completedLessons||[]).filter(id=>id!==lessonId);
  track.updatedAt=nowBR(); saveDb(); saveAcademyTrackRemote(track); currentPageId()==='lessonView'?openCourse(trackId):openCourse(trackId);
}

// Mantém compatibilidade com botões antigos
function addTrack(){ return addTrackV4(); }
function addLesson(trackId){ return addLessonV4(trackId); }
window.addTrackV4=addTrackV4; window.editCourseV4=editCourseV4; window.deleteCourseV4=deleteCourseV4; window.duplicateCourseV4=duplicateCourseV4;
window.addLessonV4=addLessonV4; window.editLessonV4=editLessonV4; window.deleteLessonV4=deleteLessonV4;

(async function init(){ await syncFromSupabase(); bindEvents(); renderAll(); })();
