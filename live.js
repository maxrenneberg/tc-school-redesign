(function(){
  if(document.getElementById('tcr-root')){document.getElementById('tcr-root').remove();}
  var RED='#9E2A2A';
  if(!document.querySelector('link[href*="tabler-icons"]')){var lk=document.createElement('link');lk.rel='stylesheet';lk.href='https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/3.34.1/tabler-icons.min.css';document.head.appendChild(lk);}

  function findToken(){
    var i=document.querySelector('input[name="rAp"]'); if(i&&i.value)return i.value;
    var a=document.querySelector('a[href*="rAp="]'); if(a){var m=(a.getAttribute('href')||'').match(/rAp=(\d+)/); if(m)return m[1];}
    var m2=location.search.match(/rAp=(\d+)/); if(m2)return m2[1];
    return '';
  }
  var rAp=findToken();
  var base='/v2/';
  var DEMO='https://maxrenneberg.github.io/tc-school-redesign/';

  var css=''
  +'#tcr-root{--bg:#fff;--bg2:#f4f3ee;--bg3:#eceae3;--info:#e6f1fb;--ok:#e1f5ee;--warn:#faeeda;--tp:#1d1c1a;--ts:#5f5e5a;--tt:#8a8980;--tinfo:#185fa5;--tok:#0f6e56;--twarn:#854f0b;--td:#a32d2d;--bd:rgba(0,0,0,.12);--bd2:rgba(0,0,0,.25);}'
  +'#tcr-root *{box-sizing:border-box;font-family:-apple-system,system-ui,"Segoe UI",Roboto,sans-serif;}'
  +'#tcr-ov{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483600;display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:26px 14px;}'
  +'#tcr-panel{background:var(--bg);color:var(--tp);width:100%;max-width:980px;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.3);overflow:hidden;display:flex;flex-direction:column;max-height:92vh;}'
  +'#tcr-top{display:flex;align-items:center;gap:10px;padding:13px 18px;border-bottom:1px solid var(--bd);flex-shrink:0;}'
  +'#tcr-top .dot{width:6px;height:6px;border-radius:50%;display:inline-block;}'
  +'#tcr-wrap{display:flex;min-height:0;flex:1;}'
  +'#tcr-side{flex:0 0 176px;border-right:1px solid var(--bd);padding:14px 10px;overflow:auto;}'
  +'#tcr-side a{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:8px;font-size:14px;color:var(--ts);border-left:3px solid transparent;text-decoration:none;cursor:pointer;}'
  +'#tcr-side a.on{color:'+RED+';border-left-color:'+RED+';font-weight:500;}'
  +'#tcr-main{flex:1;min-width:0;overflow:auto;padding:18px 20px;display:flex;flex-direction:column;gap:14px;}'
  +'#tcr-root section{background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:18px 20px;scroll-margin-top:6px;}'
  +'#tcr-root button{font:inherit;font-size:14px;color:var(--tp);background:var(--bg);border:1px solid var(--bd2);border-radius:8px;padding:8px 13px;cursor:pointer;}'
  +'#tcr-root button:hover{background:var(--bg2);}'
  +'#tcr-root button.p{background:'+RED+';border-color:'+RED+';color:#fff;}'
  +'#tcr-root button.d{color:var(--td);border-color:rgba(158,42,42,.5);}'
  +'#tcr-root input,#tcr-root select,#tcr-root textarea{font:inherit;font-size:14px;color:var(--tp);background:var(--bg);border:1px solid var(--bd2);border-radius:8px;height:38px;padding:0 10px;}'
  +'#tcr-root textarea{height:auto;padding:10px;}'
  +'#tcr-root input[type=checkbox]{height:auto;accent-color:'+RED+';width:18px;height:18px;}'
  +'.tcr-row{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--bd);}'
  +'.pill{font-size:11px;padding:2px 9px;border-radius:10px;}'
  +'.pill.live{background:var(--ok);color:var(--tok);}'
  +'.pill.prev{background:var(--warn);color:var(--twarn);}'
  +'.qm{display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;border-radius:50%;border:1px solid var(--bd2);color:var(--tt);font-size:11px;margin-left:5px;cursor:help;position:relative;vertical-align:middle;}'
  +'.qm:hover,.qm:focus{color:#fff;background:'+RED+';border-color:'+RED+';outline:none;}'
  +'.qm .tip{position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);width:220px;max-width:50vw;background:var(--tp);color:var(--bg);font-size:12px;line-height:1.5;text-align:left;padding:8px 10px;border-radius:8px;opacity:0;visibility:hidden;z-index:30;}'
  +'.qm:hover .tip,.qm:focus .tip{opacity:1;visibility:visible;}'
  +'#tcr-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:var(--tp);color:var(--bg);padding:11px 17px;border-radius:8px;font-size:13px;z-index:2147483647;opacity:0;transition:.2s;}'
  +'#tcr-toast.on{opacity:1;}';

  var root=document.createElement('div'); root.id='tcr-root';
  var sec=[['classes','ti-school','Classes',true],['students','ti-users-group','Students',false],['lists','ti-books','Word lists',false],['seats','ti-license','Subscriptions',false],['teachers','ti-users','Teachers',false],['notify','ti-bell','Email updates',false],['account','ti-user-cog','Account',false]];
  var navH='', secH='';
  sec.forEach(function(s){navH+='<a data-id="'+s[0]+'"><i class="ti '+s[1]+'" style="font-size:17px"></i>'+s[2]+'</a>';secH+='<section id="ts-'+s[0]+'"><div class="body"></div></section>';});
  root.innerHTML='<style>'+css+'</style><div id="tcr-ov"><div id="tcr-panel">'
    +'<div id="tcr-top"><span style="font-weight:500;font-size:16px">trainchinese</span><span><span class="dot" style="background:#EF9F27"></span> <span class="dot" style="background:'+RED+'"></span></span>'
    +'<span style="font-size:15px;font-weight:500;margin-left:2px">School settings</span>'
    +'<span class="pill live" style="margin-left:6px">Connected to your account</span>'
    +'<button id="tcr-x" style="margin-left:auto;padding:5px 10px">Close</button></div>'
    +'<div id="tcr-wrap"><nav id="tcr-side">'+navH+'</nav><main id="tcr-main">'+secH+'</main></div>'
    +'</div></div><div id="tcr-toast"></div>';
  document.body.appendChild(root);
  document.getElementById('tcr-x').onclick=function(){root.remove();};
  document.getElementById('tcr-ov').onclick=function(e){if(e.target.id==='tcr-ov')root.remove();};

  var toastT; function toast(m){var t=document.getElementById('tcr-toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('on');},2600);}
  var prev=function(m){toast((m||'This action')+' — preview, not saved yet');};
  function body(id){return document.querySelector('#ts-'+id+' .body');}
  function qm(t){return '<span class="qm" tabindex="0" role="button" aria-label="Help">?<span class="tip">'+t+'</span></span>';}
  function hd(t,sub,live){return '<div style="margin-bottom:14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap"><div style="font-size:17px;font-weight:500">'+t+'</div><span class="pill '+(live?'live':'prev')+'">'+(live?'Live · saves':'Preview')+'</span>'+(sub?'<div style="font-size:14px;color:var(--ts);flex-basis:100%;margin-top:2px">'+sub+'</div>':'')+'</div>';}
  function previewNote(txt){return '<div style="display:flex;gap:9px;background:var(--warn);border-radius:8px;padding:11px 13px;margin-bottom:14px"><i class="ti ti-eye" style="color:var(--twarn);font-size:17px"></i><span style="font-size:13px;color:var(--twarn);line-height:1.5">'+txt+' <a href="'+DEMO+'" target="_blank" style="color:var(--twarn);text-decoration:underline">See the full design</a>.</span></div>';}

  // nav
  function setActive(id){[].forEach.call(document.querySelectorAll('#tcr-side a'),function(a){a.classList.toggle('on',a.dataset.id===id);});}
  [].forEach.call(document.querySelectorAll('#tcr-side a'),function(a){a.onclick=function(){setActive(a.dataset.id);document.getElementById('ts-'+a.dataset.id).scrollIntoView({behavior:'smooth',block:'start'});};});
  setActive('classes');

  function api(file,params){var q=new URLSearchParams(Object.assign({rAp:rAp,isAjax:'1'},params||{}));return fetch(base+file+'?'+q.toString(),{credentials:'include'});}

  var classes=[];
  function parseClasses(doc){
    var map=new Map();
    doc.querySelectorAll('a[href*="friendsGroupChange"]').forEach(function(a){
      var m=(a.getAttribute('href')||'').match(/friendGroupId=(\d+)/); if(!m)return; var gid=m[1]; if(map.has(gid))return;
      var host=a.closest('div,li,tr')||a.parentElement; var txt=(host?host.textContent:'').replace(/\s+/g,' ');
      var cm=txt.match(/Class:\s*([^()]+?)\s*\((\d+)\)/); var am=txt.match(/assigned to:\s*([^]+?)(?:Writer|Message|Edit|$)/);
      map.set(gid,{gid:gid,name:cm?cm[1].trim():('Class '+gid),count:cm?parseInt(cm[2],10):0,assigned:am?am[1].trim():null});
    });
    return Array.from(map.values());
  }
  function loadClasses(cb){
    fetch(base+'friendsOrganize.php',{credentials:'include'}).then(function(r){return r.text();}).then(function(html){
      classes=parseClasses(new DOMParser().parseFromString(html,'text/html')); if(cb)cb();
    }).catch(function(e){var b=body('classes');if(b)b.innerHTML='<div style="color:'+RED+'">Could not load classes: '+e.message+'</div>';});
  }
  function classNames(){return classes.map(function(c){return c.name;});}

  // ===== CLASSES (LIVE) =====
  function renderClasses(){
    var b=body('classes'); if(!b)return;
    var total=classes.reduce(function(a,c){return a+c.count;},0);
    var h=hd('Classes','Create, view and delete your classes. Changes here save to your trainchinese account right away.',true);
    h+='<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px"><span style="font-size:13px;color:var(--ts)">'+classes.length+' classes · '+total+' students</span><button class="p" id="c-add" style="margin-left:auto">+ Add a class</button><button id="c-reload">Refresh</button></div>';
    h+='<div id="c-addform" style="display:none;background:var(--bg2);border-radius:8px;padding:14px;margin-bottom:14px"><div style="font-size:13px;color:var(--ts);margin-bottom:6px">Name for the new class '+qm('Pick any name, e.g. P3-A or Beginners. You can delete it again any time.')+'</div><div style="display:flex;gap:8px;flex-wrap:wrap"><input id="c-name" placeholder="e.g. P3-A" style="flex:1;min-width:180px"/><button class="p" id="c-create">Create class</button></div></div>';
    if(!classes.length)h+='<div style="color:var(--ts);padding:8px 0">No classes yet.</div>';
    classes.forEach(function(c){
      h+='<div class="tcr-row"><div style="flex:1;min-width:0"><div style="font-size:15px;font-weight:500">'+c.name+'</div><div style="font-size:12px;color:var(--ts)">'+c.count+' student'+(c.count===1?'':'s')+(c.assigned?(' · teacher: '+c.assigned):'')+'</div></div>'
        +'<a href="'+base+'friendsGroupChange.php?xreg=3&returnFile=friendsOrganize&friendGroupId='+c.gid+'&rAp='+rAp+'" target="_blank" style="font-size:13px;color:var(--tinfo);text-decoration:none">Open</a>'
        +'<button class="d c-del" data-gid="'+c.gid+'" data-name="'+c.name.replace(/"/g,'')+'">Delete</button></div>';
    });
    b.innerHTML=h;
    b.querySelector('#c-reload').onclick=function(){loadClasses(renderAll);};
    b.querySelector('#c-add').onclick=function(){var f=b.querySelector('#c-addform');f.style.display=f.style.display==='none'?'block':'none';var n=b.querySelector('#c-name');if(n)n.focus();};
    b.querySelector('#c-create').onclick=function(){var nm=(b.querySelector('#c-name').value||'').trim();if(!nm){toast('Type a class name first');return;}var btn=b.querySelector('#c-create');btn.disabled=true;btn.textContent='Saving…';api('friendsOrganize.php',{xreg:'101',newClass:nm}).then(function(){toast('Class “'+nm+'” saved');loadClasses(renderAll);}).catch(function(e){toast('Failed: '+e.message);btn.disabled=false;btn.textContent='Create class';});};
    [].forEach.call(b.querySelectorAll('.c-del'),function(btn){btn.onclick=function(){var gid=btn.dataset.gid,name=btn.dataset.name;if(!confirm('Delete class “'+name+'”? This cannot be undone.'))return;btn.disabled=true;btn.textContent='…';api('friendsGroupChange.php',{xreg:'5',friendGroupId:gid,returnFile:'friendsOrganize'}).then(function(){toast('Deleted “'+name+'”');loadClasses(renderAll);}).catch(function(e){toast('Failed: '+e.message);btn.disabled=false;btn.textContent='Delete';});};});
  }

  // ===== STUDENTS (preview, real class list) =====
  function renderStudents(){
    var b=body('students'); if(!b)return;
    var opts=classNames().map(function(c){return '<option>'+c+'</option>';}).join('');
    b.innerHTML=hd('Students','Add students to classes, move them, and manage subscriptions.',false)
      +previewNote('Your class list below is live. Viewing and saving student rosters is the next wiring step, so the actions here are a preview.')
      +'<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px"><span style="font-size:14px">Show class '+qm('Your real classes are loaded here. The roster view is being wired next.')+'</span><select id="s-cls">'+opts+'</select><button class="p" id="s-add" style="margin-left:auto">+ Add students</button></div>'
      +'<div style="font-size:14px;color:var(--ts);padding:14px;background:var(--bg2);border-radius:8px">Open this class in trainchinese to see its students, or wait for the next update when the roster appears here. <span class="pill prev">Coming next</span></div>';
    b.querySelector('#s-add').onclick=function(){prev('Add students');};
  }

  // ===== WORD LISTS (preview, real class list) =====
  function renderLists(){
    var b=body('lists'); if(!b)return;
    var opts=classNames().map(function(c){return '<option>'+c+'</option>';}).join('');
    var sample=['2B Unit 19','2B Unit 18','2A Unit 10','1B11','1A19','1A01'];
    b.innerHTML=hd('Word lists','Choose which word lists each class studies, and how Chinese is shown.',false)
      +previewNote('The class picker is live. Reading and saving a class’s lists and display settings is being wired next.')
      +'<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px"><span style="font-size:14px">Set up class '+qm('Each class has its own lists and settings.')+'</span><select>'+opts+'</select></div>'
      +'<div style="font-size:14px;font-weight:500;margin-bottom:8px">Lists '+qm('Tick to add a list to this class.')+'</div>'
      +sample.map(function(n){return '<label class="tcr-row" style="cursor:pointer"><input type="checkbox"/><span style="flex:1;font-size:14px">'+n+'</span><span class="pill prev">preview</span></label>';}).join('')
      +'<div style="margin-top:10px"><button id="l-more">View full lists design</button></div>';
    b.querySelector('#l-more').onclick=function(){window.open(DEMO,'_blank');};
    [].forEach.call(b.querySelectorAll('input[type=checkbox]'),function(c){c.onchange=function(){prev('Sharing a list');c.checked=!c.checked;};});
  }

  // ===== SUBSCRIPTIONS (preview) =====
  function renderSeats(){
    var b=body('seats'); if(!b)return;
    b.innerHTML=hd('Student subscriptions','See how many subscriptions you have and free up unused ones.',false)
      +previewNote('Live subscription figures come from your account page; reading them in is a next step.')
      +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px">'
      +[['You have','300'],['In use','275'],['Still free','25']].map(function(t){return '<div style="background:var(--bg2);border-radius:8px;padding:12px 14px"><div style="font-size:12px;color:var(--ts)">'+t[0]+'</div><div style="font-size:22px;font-weight:500">'+t[1]+'</div></div>';}).join('')
      +'</div><div style="margin-top:12px"><button onclick="window.open(\''+DEMO+'\')">View full design</button></div>';
  }
  // ===== TEACHERS / NOTIFY / ACCOUNT (preview cards) =====
  function previewCard(id,title,sub,bullets){
    var b=body(id); if(!b)return;
    b.innerHTML=hd(title,sub,false)+previewNote('This section is designed and ready; wiring it to save on your account is an upcoming step.')
      +'<ul style="margin:0;padding-left:18px;color:var(--ts);font-size:14px;line-height:1.8">'+bullets.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>'
      +'<div style="margin-top:12px"><button onclick="window.open(\''+DEMO+'\')">Open full design ↗</button></div>';
  }

  function renderAll(){
    var R=[['classes',renderClasses],['students',renderStudents],['lists',renderLists],['seats',renderSeats],
      ['teachers',function(){previewCard('teachers','Teachers','Manage the teachers in your school and their roles.',['Invite a teacher by email','Set Admin or Teacher role','Per-teacher permissions','Remove a teacher']);}],
      ['notify',function(){previewCard('notify','Email updates','Choose what we email you about.',['Weekly progress report','Low-subscription warning','Tips and product news']);}],
      ['account',function(){previewCard('account','Account','Your personal login and language.',['Display name','Login email','Password','Country and app language']);}]];
    R.forEach(function(p){try{p[1]();}catch(e){var b=body(p[0]);if(b)b.innerHTML='<div style="color:'+RED+'">Section error: '+e.message+'</div>';}});
  }

  if(!rAp){body('classes').innerHTML='<div style="color:'+RED+'">Couldn’t find your session. Open this while logged in on a trainchinese.com/v2 page (e.g. Classes), then click the bookmarklet again.</div>';return;}
  body('classes').innerHTML='Loading your classes…';
  loadClasses(renderAll);
})();
