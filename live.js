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
  var ls={gid:null,ifr:null,rows:[],q:''};
  function teardownLs(){if(ls.ifr){try{ls.ifr.remove();}catch(e){}ls.ifr=null;}}
  var st={gid:null,ifr:null,rows:[],q:''};
  function teardownSt(){if(st.ifr){try{st.ifr.remove();}catch(e){}st.ifr=null;}}

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
  var sec=[['classes','ti-school','Classes',true],['school','ti-building','School',true],['students','ti-users-group','Students',false],['lists','ti-books','Word lists',false],['seats','ti-license','Subscriptions',false],['teachers','ti-users','Teachers',false],['notify','ti-bell','Email updates',false],['account','ti-user-cog','Account',false]];
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
  document.getElementById('tcr-x').onclick=function(){teardownLs();teardownSt();root.remove();};
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

  // ===== STUDENTS (LIVE: read roster via iframe, add/remove via friendsGroupChange.php xreg 10=add / 11=remove) =====
  function renderStudents(){
    var b=body('students'); if(!b)return;
    if(!classes.length){b.innerHTML=hd('Students','',true)+'<div style="color:var(--ts)">No classes yet. Create one in Classes first.</div>';return;}
    if(!st.gid)st.gid=classes[0].gid;
    var opts=classes.map(function(c){return '<option value="'+c.gid+'"'+(c.gid===st.gid?' selected':'')+'>'+c.name+'</option>';}).join('');
    b.innerHTML=hd('Students','Tick a student to put them in a class, untick to take them out — saves to your account.',true)
      +'<div style="display:flex;gap:9px;background:var(--info);border-radius:8px;padding:11px 13px;margin-bottom:12px"><i class="ti ti-flask" style="color:var(--tinfo);font-size:17px"></i><span style="font-size:13px;color:var(--tinfo);line-height:1.5"><strong style="font-weight:500">Newly wired (beta).</strong> Toggling a student adds or removes them from this class. You can also invite new students by link or email — they join your school, then you tick them into a class.</span></div>'
      +'<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px"><span style="font-size:14px">Class '+qm('Students ticked here are in this class. Untick to remove them — they stay in your school.')+'</span><select id="st-cls">'+opts+'</select><span id="st-count" style="font-size:13px;color:var(--ts)"></span><button id="st-rl" style="font-size:12px;padding:6px 10px">Refresh</button><button class="p" id="st-add" style="margin-left:auto">+ Add students</button></div>'
      +'<div id="st-addpanel" style="display:none;background:var(--bg2);border-radius:8px;padding:14px;margin-bottom:12px"></div>'
      +'<input id="st-q" placeholder="Search students" style="width:100%;margin-bottom:8px"/>'
      +'<div id="st-area" style="color:var(--ts)">Reading this class’s students…</div>';
    b.querySelector('#st-cls').onchange=function(e){st.gid=e.target.value;st.rows=[];loadClassStudents();};
    b.querySelector('#st-rl').onclick=function(){st.rows=[];loadClassStudents();};
    b.querySelector('#st-q').oninput=function(e){st.q=e.target.value.toLowerCase().trim();paintStudentRows();};
    b.querySelector('#st-add').onclick=function(){st.add=!st.add;renderAddPanel();};
    renderAddPanel();
    loadClassStudents();
  }
  function renderAddPanel(){
    var p=document.querySelector('#ts-students #st-addpanel'); if(!p)return;
    if(!st.add){p.style.display='none';p.innerHTML='';return;}
    p.style.display='block';
    p.innerHTML='<div style="font-size:14px;font-weight:500;margin-bottom:4px">Invite students to your school '+qm('New students join your school here. Once they appear in the list below, tick them into a class.')+'</div>'
      +'<div style="font-size:12px;color:var(--tt);margin-bottom:12px">They join your school first, then you tick them into a class above.</div>'
      +'<div style="font-size:13px;margin-bottom:5px">1. Share this link with your class</div>'
      +'<div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap"><input id="st-link" readonly placeholder="loading link…" style="flex:1;min-width:200px"/><button id="st-copy">Copy link</button></div>'
      +'<div style="font-size:13px;margin-bottom:5px">2. Or invite one by email or nickname</div>'
      +'<div style="display:flex;gap:8px;flex-wrap:wrap"><input id="st-iname" placeholder="email address or nickname" style="flex:1;min-width:200px"/><button class="p" id="st-isend">Send invite</button></div>';
    p.querySelector('#st-copy').onclick=function(){var i=p.querySelector('#st-link');if(!i.value){toast('Link still loading');return;}i.select();try{navigator.clipboard.writeText(i.value);}catch(e){}toast('Invite link copied');};
    p.querySelector('#st-isend').onclick=function(){
      var v=(p.querySelector('#st-iname').value||'').trim(); if(!v){toast('Enter an email or nickname');return;}
      var btn=p.querySelector('#st-isend'); btn.disabled=true; btn.textContent='Sending…';
      var bd=new URLSearchParams({rAp:rAp,xreg:'1',addName:v});
      fetch(base+'friendsProcess.php',{method:'POST',credentials:'include',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:bd}).then(function(res){
        if(!res.ok)throw new Error('status '+res.status);
        toast('Invite sent to '+v); p.querySelector('#st-iname').value=''; btn.disabled=false; btn.textContent='Send invite';
      }).catch(function(e){toast('Failed: '+e.message); btn.disabled=false; btn.textContent='Send invite';});
    };
    loadInviteLink();
  }
  function loadInviteLink(){
    var fill=function(){var i=document.querySelector('#ts-students #st-link');if(i&&st.invite)i.value=st.invite;};
    if(st.invite){fill();return;}
    fetch(base+'friendsInvitation.php?returnFile=friendsOrganize',{credentials:'include'}).then(function(r){return r.text();}).then(function(html){
      var d=new DOMParser().parseFromString(html,'text/html'); var l=d.querySelector('input[name="inviteLink"],#inviteLink');
      st.invite=l?(l.getAttribute('value')||l.value||''):'';
      var i=document.querySelector('#ts-students #st-link');
      if(i){if(st.invite)i.value=st.invite; else i.placeholder='Open the Invite page in trainchinese for the link';}
    }).catch(function(){var i=document.querySelector('#ts-students #st-link');if(i)i.placeholder='Could not load link';});
  }
  function loadClassStudents(){
    teardownSt();
    var area=document.querySelector('#ts-students #st-area'); if(area)area.textContent='Reading this class’s students…';
    var ifr=document.createElement('iframe'); st.ifr=ifr;
    ifr.style.cssText='position:fixed;left:-9999px;top:0;width:1100px;height:1600px;border:0;';
    ifr.src=base+'friendsGroupChange.php?xreg=3&returnFile=friendsOrganize&friendGroupId='+st.gid+'&rAp='+rAp;
    document.body.appendChild(ifr);
    var done=false;
    function tryRead(att){
      if(done||st.ifr!==ifr)return;
      var doc; try{doc=ifr.contentDocument;}catch(e){doc=null;}
      var cbs=doc?[].slice.call(doc.querySelectorAll('[onclick*="addRemoveToClass"]')):[];
      if(cbs.length){done=true;st.rows=cbs.map(function(cb){
        var nums=((cb.getAttribute('onclick')||'').match(/-?\d+/g)||[]).map(Number);
        var input=cb.tagName==='INPUT'?cb:(cb.querySelector&&cb.querySelector('input[type=checkbox]'));
        var inClass=input?!!input.checked:/checked/i.test(cb.outerHTML||'');
        var h=cb.closest('li,tr,div')||cb.parentElement; var raw=(h?h.textContent:'').replace(/\s+/g,' ').trim();
        var nm=raw.match(/([A-Za-z][A-Za-z .'’-]+?)\s*\(([^)]+)\)/);
        return {studentId:nums[0],groupId:nums[1],inClass:inClass,name:nm?nm[1].trim():(raw.slice(0,28)||('Student '+nums[0])),user:nm?nm[2].trim():''};
      }).filter(function(r){return r.studentId;});paintStudentRows();return;}
      if(att<22){setTimeout(function(){tryRead(att+1);},400);}else if(area){area.innerHTML='<div style="color:'+RED+'">Couldn’t read students (page was slow). Press Refresh, or Open the class in trainchinese.</div>';}
    }
    ifr.onload=function(){setTimeout(function(){tryRead(0);},800);};
    setTimeout(function(){tryRead(0);},6500);
  }
  function paintStudentRows(){
    var area=document.querySelector('#ts-students #st-area'); if(!area)return;
    var cnt=document.querySelector('#ts-students #st-count'); if(cnt)cnt.textContent=st.rows.filter(function(r){return r.inClass;}).length+' in this class';
    var rows=st.rows.filter(function(r){return !st.q||(r.name+' '+r.user).toLowerCase().indexOf(st.q)>=0;});
    area.innerHTML=rows.length?rows.map(function(r){var idx=st.rows.indexOf(r);return '<label class="tcr-row" style="cursor:pointer"><input type="checkbox" data-i="'+idx+'"'+(r.inClass?' checked':'')+'/><span style="flex:1;font-size:14px">'+r.name+' <span style="color:var(--ts);font-size:12px">'+(r.user||('id '+r.studentId))+'</span></span><span style="font-size:12px;min-width:84px;text-align:right;color:'+(r.inClass?'var(--tok)':'var(--tt)')+'">'+(r.inClass?'In class':'Not in class')+'</span></label>';}).join(''):'<div style="color:var(--ts);padding:8px 0">No students match.</div>';
    [].forEach.call(area.querySelectorAll('input[type=checkbox]'),function(cb){cb.onchange=function(){saveStudent(parseInt(cb.getAttribute('data-i'),10),cb);};});
  }
  function saveStudent(idx,cb){
    var r=st.rows[idx]; if(!r)return; cb.disabled=true;
    var willBeIn=cb.checked; var xreg=willBeIn?'10':'11';
    var q=new URLSearchParams({rAp:rAp,xreg:xreg,studentId:String(r.studentId),friendGroupId:String(st.gid),isAjax:'1'});
    fetch(base+'friendsGroupChange.php?'+q.toString(),{credentials:'include'}).then(function(res){
      if(!res.ok)throw new Error('status '+res.status);
      r.inClass=willBeIn; toast(r.name+(willBeIn?' added to ':' removed from ')+className(st.gid));
      var cnt=document.querySelector('#ts-students #st-count'); if(cnt)cnt.textContent=st.rows.filter(function(x){return x.inClass;}).length+' in this class';
      var lbl=cb.parentElement.querySelector('span:last-child'); if(lbl){lbl.textContent=r.inClass?'In class':'Not in class';lbl.style.color=r.inClass?'var(--tok)':'var(--tt)';}
    }).catch(function(e){toast('Failed: '+e.message);cb.checked=!cb.checked;cb.disabled=false;});
  }

  // ===== WORD LISTS (LIVE: read via iframe, save via shareWithFriends.php) =====
  function className(gid){var c=classes.filter(function(x){return x.gid===gid;})[0];return c?c.name:'class';}
  function renderLists(){
    var b=body('lists'); if(!b)return;
    if(!classes.length){b.innerHTML=hd('Word lists','',true)+'<div style="color:var(--ts)">No classes yet.</div>';return;}
    if(!ls.gid)ls.gid=classes[0].gid;
    var opts=classes.map(function(c){return '<option value="'+c.gid+'"'+(c.gid===ls.gid?' selected':'')+'>'+c.name+'</option>';}).join('');
    b.innerHTML=hd('Word lists','Tick a list to add it to a class — newly wired to save on your account.',true)
      +'<div style="display:flex;gap:9px;background:var(--info);border-radius:8px;padding:11px 13px;margin-bottom:12px"><i class="ti ti-flask" style="color:var(--tinfo);font-size:17px"></i><span style="font-size:13px;color:var(--tinfo);line-height:1.5"><strong style="font-weight:500">Newly wired (beta).</strong> Toggling a list, and the two class settings below, save on your account. The Chinese-character / pinyin dropdowns are still <span class="pill prev">preview</span>.</span></div>'
      +'<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px"><span style="font-size:14px">Set up class '+qm('Each class has its own word lists. Pick a class, then tick the lists it studies.')+'</span><select id="l-cls">'+opts+'</select><span id="l-count" style="font-size:13px;color:var(--ts)"></span><button id="l-rl" style="font-size:12px;padding:6px 10px">Refresh</button></div>'
      +'<div id="l-settings"></div>'
      +'<input id="l-q" placeholder="Search lists" style="width:100%;margin-bottom:8px"/>'
      +'<div id="l-area" style="color:var(--ts)">Reading this class’s lists…</div>';
    b.querySelector('#l-cls').onchange=function(e){ls.gid=e.target.value;ls.rows=[];loadClassLists();};
    b.querySelector('#l-rl').onclick=function(){ls.rows=[];loadClassLists();};
    b.querySelector('#l-q').oninput=function(e){ls.q=e.target.value.toLowerCase().trim();paintRows();};
    loadClassLists();
  }
  function loadClassLists(){
    teardownLs();
    var area=document.querySelector('#ts-lists #l-area'); if(area)area.textContent='Reading this class’s lists…';
    var ifr=document.createElement('iframe'); ls.ifr=ifr;
    ifr.style.cssText='position:fixed;left:-9999px;top:0;width:1100px;height:1400px;border:0;';
    ifr.src=base+'friendsGroupChange.php?xreg=3&returnFile=friendsOrganize&friendGroupId='+ls.gid+'&rAp='+rAp;
    document.body.appendChild(ifr);
    var done=false;
    function tryRead(att){
      if(done||ls.ifr!==ifr)return;
      var doc; try{doc=ifr.contentDocument;}catch(e){doc=null;}
      var btns=doc?[].slice.call(doc.querySelectorAll('a,button')).filter(function(e){return /Stop sharing|Start sharing/i.test(e.textContent);}):[];
      if(btns.length){done=true;ls.rows=btns.map(function(btn){var h=btn.closest('li,tr,div')||btn.parentElement;var name=(h?h.textContent:'').replace(/\s+/g,' ').split(/Stop sharing|Start sharing|Show list|Assign list/)[0].replace(/[^\w .-]/g,'').trim();var nums=((btn.getAttribute('onclick')||'').match(/-?\d+/g)||[]).map(Number);return {name:name,shared:/Stop sharing/i.test(btn.textContent),listId:nums[0],xreg:nums[1],friendId:nums[2],groupId:nums[3]};}).filter(function(r){return r.name&&r.listId;});try{var _n=doc.querySelector('input[name="cbShareNotes"]');ls.notes=_n?{found:true,on:!!_n.checked}:{found:false};var _p=doc.querySelector('input[name="cbShareShareLists"]');ls.posting=_p?{found:true,on:!!_p.checked}:{found:false};}catch(e){}paintSettings();paintRows();return;}
      if(att<22){setTimeout(function(){tryRead(att+1);},400);}else if(area){area.innerHTML='<div style="color:'+RED+'">Couldn’t read this class’s lists (page was slow). Press Refresh.</div>';}
    }
    ifr.onload=function(){setTimeout(function(){tryRead(0);},800);};
    setTimeout(function(){tryRead(0);},6500);
  }
  function paintRows(){
    var area=document.querySelector('#ts-lists #l-area'); if(!area)return;
    var cnt=document.querySelector('#ts-lists #l-count'); if(cnt)cnt.textContent=ls.rows.filter(function(r){return r.shared;}).length+' of '+ls.rows.length+' added';
    var rows=ls.rows.filter(function(r){return !ls.q||r.name.toLowerCase().indexOf(ls.q)>=0;});
    area.innerHTML=rows.length?rows.map(function(r){var idx=ls.rows.indexOf(r);return '<label class="tcr-row" style="cursor:pointer"><input type="checkbox" data-i="'+idx+'"'+(r.shared?' checked':'')+'/><span style="flex:1;font-size:14px">'+r.name+'</span><span style="font-size:12px;min-width:84px;text-align:right;color:'+(r.shared?'var(--tok)':'var(--tt)')+'">'+(r.shared?'In this class':'Not added')+'</span></label>';}).join(''):'<div style="color:var(--ts);padding:8px 0">No lists match.</div>';
    [].forEach.call(area.querySelectorAll('input[type=checkbox]'),function(cb){cb.onchange=function(){saveShare(parseInt(cb.getAttribute('data-i'),10),cb);};});
  }
  function saveShare(idx,cb){
    var r=ls.rows[idx]; if(!r)return; cb.disabled=true;
    var q=new URLSearchParams({rAp:rAp,xreg:String(r.xreg),listNo:String(r.listId),friendId:String(r.friendId),groupClassId:String(r.groupId),reloadPage:'1'});
    fetch(base+'shareWithFriends.php?'+q.toString(),{credentials:'include'}).then(function(res){
      if(!res.ok)throw new Error('status '+res.status);
      r.shared=!r.shared; toast((r.shared?'Added to ':'Removed from ')+className(ls.gid));
      var cnt=document.querySelector('#ts-lists #l-count'); if(cnt)cnt.textContent=ls.rows.filter(function(x){return x.shared;}).length+' of '+ls.rows.length+' added';
      var lbl=cb.parentElement.querySelector('span:last-child'); if(lbl){lbl.textContent=r.shared?'In this class':'Not added';lbl.style.color=r.shared?'var(--tok)':'var(--tt)';}
      setTimeout(function(){if(ls.ifr)loadClassLists();},500);
    }).catch(function(e){toast('Failed: '+e.message);cb.checked=!cb.checked;cb.disabled=false;});
  }
  function paintSettings(){
    var el=document.querySelector('#ts-lists #l-settings'); if(!el)return;
    function row(label,state,key,hint){if(!state||!state.found)return '';return '<div style="display:flex;align-items:center;justify-content:space-between;gap:14px;padding:10px 0;border-bottom:1px solid var(--bd)"><span style="font-size:14px">'+label+' '+qm(hint)+'</span><input type="checkbox" data-k="'+key+'"'+(state.on?' checked':'')+'/></div>';}
    var h=row('Share my notes with this class',ls.notes,'notes','Students see notes you add to a word.')+row('Let students post their own lists',ls.posting,'posting','If off, only you decide what this class studies.');
    el.innerHTML=h?('<div style="font-size:14px;font-weight:500;margin:4px 0 2px">Class settings <span class="pill live">live</span></div>'+h):'';
    [].forEach.call(el.querySelectorAll('input[type=checkbox]'),function(cb){cb.onchange=function(){saveSetting(cb.getAttribute('data-k'),cb);};});
  }
  function saveSetting(key,cb){
    var on=cb.checked; cb.disabled=true;
    var xreg=key==='notes'?(on?'20':'21'):(on?'25':'26');
    var q=new URLSearchParams({rAp:rAp,xreg:xreg,friendGroupId:String(ls.gid),isAjax:'1'});
    fetch(base+'friendsGroupChange.php?'+q.toString(),{credentials:'include'}).then(function(res){
      if(!res.ok)throw new Error('status '+res.status);
      if(key==='notes'&&ls.notes)ls.notes.on=on; if(key==='posting'&&ls.posting)ls.posting.on=on;
      toast('Class setting saved'); cb.disabled=false;
      setTimeout(function(){if(ls.ifr)loadClassLists();},700);
    }).catch(function(e){toast('Failed: '+e.message);cb.checked=!cb.checked;cb.disabled=false;});
  }

  // ===== SUBSCRIPTIONS (preview) =====
  var acctCache=null;
  function loadAccountConfig(cb){
    if(acctCache){cb(acctCache);return;}
    fetch(base+'viewAccountConfig.php',{credentials:'include'}).then(function(r){return r.text();}).then(function(html){
      var d=new DOMParser().parseFromString(html,'text/html'); var T=(d.body?d.body.textContent:'').replace(/\s+/g,' ');
      function between(a,b){var m=T.match(new RegExp(a+'\\s*:?\\s*([\\s\\S]*?)\\s*(?:'+b+')','i'));return m?m[1].trim().slice(0,60):'';}
      var profile={name:between('name of school\\)','Type of school'),type:between('Type of school','Number of Students'),students:(T.match(/Number of Students\s*:?\s*(\d+)/i)||[])[1]||'',chars:(T.match(/I teach using\s+(simplified|traditional)/i)||[])[1]||'',textbooks:between('Textbook\\(s\\) used in class','Useful information|Edit this data|You are|Nickname')};
      var seats=[]; [].slice.call(d.querySelectorAll('table tr')).forEach(function(tr){
        var tds=[].slice.call(tr.querySelectorAll('td')).map(function(td){return td.textContent.replace(/\s+/g,' ').trim();});
        if(tds.length>=4){var nums=tds.filter(function(x){return /^\d+$/.test(x);});if(nums.length>=3)seats.push({code:tds[0]||'',purchased:+nums[nums.length-3],used:+nums[nums.length-2],available:+nums[nums.length-1],period:(tds.filter(function(x){return /until|Expired/i.test(x);})[0]||'')});}
      });
      acctCache={profile:profile,seats:seats}; cb(acctCache);
    }).catch(function(){cb({profile:{},seats:[]});});
  }
  var schForm=null;
  function renderSchool(){
    var b=body('school'); if(!b)return;
    b.innerHTML=hd('Your school','Edit your school details and weekly report day — saves live.',true)+'<div id="sch-body" style="color:var(--ts)">Reading your school details…</div>';
    loadAccountConfig(function(a){showSchoolRead(a.profile||{});});
  }
  function showSchoolRead(p){
    var el=document.querySelector('#ts-school #sch-body'); if(!el)return;
    var rows=[['School name',p.name],['School type',p.type],['Number of students',p.students],['Character style',p.chars?(p.chars.charAt(0).toUpperCase()+p.chars.slice(1)+' Chinese'):''],['Textbooks',p.textbooks]];
    var any=rows.some(function(r){return r[1];});
    el.innerHTML='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px">'+rows.map(function(r){return '<div><div style="font-size:13px;color:var(--ts)">'+r[0]+'</div><div style="font-size:15px;margin-top:2px">'+(r[1]||'<span style="color:var(--tt)">not set</span>')+'</div></div>';}).join('')+'</div>'+(any?'':'<div style="font-size:13px;color:var(--tt);margin-top:10px">No school profile filled in yet.</div>')+'<button class="p" id="sch-edit" style="margin-top:16px"><i class="ti ti-edit" style="font-size:15px;vertical-align:-3px;margin-right:5px"></i>Edit details</button>';
    el.querySelector('#sch-edit').onclick=editSchool;
  }
  function editSchool(){
    var el=document.querySelector('#ts-school #sch-body'); if(el)el.innerHTML='Opening editor…';
    fetch(base+'viewMultiSuscription.php?confirmToBecomeTeacher=1',{credentials:'include'}).then(function(r){return r.text();}).then(function(html){
      var d=new DOMParser().parseFromString(html,'text/html');
      schForm=[].slice.call(d.querySelectorAll('form')).filter(function(x){return x.querySelector('[name=family_name]');})[0];
      if(!schForm){if(el)el.innerHTML='<div style="color:'+RED+'">Could not open the editor.</div>';return;}
      var g=function(n){var e=schForm.querySelector('[name="'+n+'"]');return e?(e.value||''):'';};
      var tc=(schForm.querySelector('input[name=teachingChar]:checked')||{}).value||'simpl';
      var nw=(schForm.querySelector('input[name=notificationWeekdays]:checked')||{}).value||'0';
      var days=[['0','No weekly report'],['1','Monday'],['2','Tuesday'],['4','Wednesday'],['8','Thursday'],['16','Friday'],['32','Saturday'],['64','Sunday']];
      function esc(s){return String(s).replace(/"/g,'&quot;');}
      el.innerHTML='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px">'
        +'<div><label style="font-size:13px;color:var(--ts)">School name</label><input id="e-name" value="'+esc(g('family_name'))+'" style="width:100%;margin-top:4px"/></div>'
        +'<div><label style="font-size:13px;color:var(--ts)">School type</label><input id="e-type" value="'+esc(g('typeOfSchool'))+'" style="width:100%;margin-top:4px"/></div>'
        +'<div><label style="font-size:13px;color:var(--ts)">Number of students</label><input id="e-num" type="number" value="'+esc(g('numberOfStudents'))+'" style="width:100%;margin-top:4px"/></div>'
        +'<div><label style="font-size:13px;color:var(--ts)">Characters '+qm('Which Chinese characters your school teaches.')+'</label><select id="e-char" style="width:100%;margin-top:4px"><option value="simpl"'+(tc==='simpl'?' selected':'')+'>Simplified</option><option value="trad"'+(tc==='trad'?' selected':'')+'>Traditional</option><option value="both"'+(tc==='both'?' selected':'')+'>Both</option></select></div>'
        +'<div><label style="font-size:13px;color:var(--ts)">Textbooks</label><input id="e-book" value="'+esc(g('textbookUsed'))+'" style="width:100%;margin-top:4px"/></div>'
        +'<div><label style="font-size:13px;color:var(--ts)">Weekly progress email '+qm('Get a weekly report of your students’ training on this day.')+'</label><select id="e-notif" style="width:100%;margin-top:4px">'+days.map(function(dd){return '<option value="'+dd[0]+'"'+(nw===dd[0]?' selected':'')+'>'+dd[1]+'</option>';}).join('')+'</select></div>'
        +'</div><div style="margin-top:16px;display:flex;gap:8px"><button class="p" id="e-save">Save changes</button><button id="e-cancel">Cancel</button></div>';
      el.querySelector('#e-cancel').onclick=function(){acctCache=null;renderSchool();};
      el.querySelector('#e-save').onclick=saveSchool;
    }).catch(function(e){if(el)el.innerHTML='<div style="color:'+RED+'">Editor failed to load: '+e.message+'</div>';});
  }
  function saveSchool(){
    if(!schForm)return; var el=document.querySelector('#ts-school #sch-body');
    var btn=el.querySelector('#e-save'); if(btn){btn.disabled=true;btn.textContent='Saving…';}
    var set=function(n,v){var e=schForm.querySelector('[name="'+n+'"]');if(e)e.value=v;};
    set('family_name',el.querySelector('#e-name').value); set('typeOfSchool',el.querySelector('#e-type').value);
    set('numberOfStudents',el.querySelector('#e-num').value); set('textbookUsed',el.querySelector('#e-book').value);
    var tc=el.querySelector('#e-char').value; [].forEach.call(schForm.querySelectorAll('input[name=teachingChar]'),function(r){r.checked=(r.value===tc);});
    var nw=el.querySelector('#e-notif').value; [].forEach.call(schForm.querySelectorAll('input[name=notificationWeekdays]'),function(r){r.checked=(r.value===nw);});
    var fd=new URLSearchParams();
    [].forEach.call(schForm.querySelectorAll('input,select,textarea'),function(e){if(!e.name)return;if((e.type==='checkbox'||e.type==='radio')&&!e.checked)return;fd.append(e.name,e.value==null?'':e.value);});
    fd.set('rAp',rAp);
    fetch(base+'viewMultiSuscription.php',{method:'POST',credentials:'include',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:fd}).then(function(res){
      if(!res.ok)throw new Error('status '+res.status);
      toast('School details saved'); acctCache=null; renderSchool();
    }).catch(function(e){toast('Failed: '+e.message);if(btn){btn.disabled=false;btn.textContent='Save changes';}});
  }
  function renderSeats(){
    var b=body('seats'); if(!b)return;
    b.innerHTML=hd('Student subscriptions','How many subscriptions you have — read live from your account.',true)+'<div id="seat-body" style="color:var(--ts)">Reading your subscriptions…</div>';
    loadAccountConfig(function(a){
      var el=document.querySelector('#ts-seats #seat-body'); if(!el)return; var s=a.seats||[];
      if(!s.length){el.innerHTML='<div style="font-size:14px;color:var(--ts)">No purchased subscriptions on this account. On a provisioned school account, your seat totals and codes appear here.</div>';return;}
      var active=s.filter(function(x){return !/Expired/i.test(x.period);});
      var tot=active.reduce(function(n,x){return n+(x.purchased||0);},0),used=active.reduce(function(n,x){return n+(x.used||0);},0),free=active.reduce(function(n,x){return n+(x.available||0);},0);
      el.innerHTML='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px">'+[['You have',tot],['In use',used],['Still free',free]].map(function(t){return '<div style="background:var(--bg2);border-radius:8px;padding:12px 14px"><div style="font-size:12px;color:var(--ts)">'+t[0]+'</div><div style="font-size:22px;font-weight:500">'+t[1]+'</div></div>';}).join('')+'</div><div style="margin-top:14px;font-size:14px;font-weight:500">Your subscription batches</div>'+s.map(function(x){var exp=/Expired/i.test(x.period);return '<div class="tcr-row"><div style="flex:1"><div style="font-size:14px">'+x.used+' of '+x.purchased+' used</div><div style="font-size:12px;color:var(--ts)">'+(x.period||'')+'</div></div><span class="pill '+(exp?'prev':'live')+'">'+(exp?'Expired':'Active')+'</span></div>';}).join('');
    });
  }
  // ===== TEACHERS / NOTIFY / ACCOUNT (preview cards) =====
  function previewCard(id,title,sub,bullets){
    var b=body(id); if(!b)return;
    b.innerHTML=hd(title,sub,false)+previewNote('This section is designed and ready; wiring it to save on your account is an upcoming step.')
      +'<ul style="margin:0;padding-left:18px;color:var(--ts);font-size:14px;line-height:1.8">'+bullets.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>'
      +'<div style="margin-top:12px"><button onclick="window.open(\''+DEMO+'\')">Open full design ↗</button></div>';
  }

  // ===== TEACHERS (LIVE add via teacherAddBySchool.php; remove/permissions preview) =====
  function renderTeachers(){
    var b=body('teachers'); if(!b)return;
    b.innerHTML=hd('Teachers','Invite teachers to help run your school.',true)
      +'<div style="display:flex;gap:9px;background:var(--info);border-radius:8px;padding:11px 13px;margin-bottom:12px"><i class="ti ti-flask" style="color:var(--tinfo);font-size:17px"></i><span style="font-size:13px;color:var(--tinfo);line-height:1.5"><strong style="font-weight:500">Inviting a teacher saves live.</strong> Removing teachers and the school permission toggles appear on multi-teacher accounts and are still <span class="pill prev">preview</span>.</span></div>'
      +'<div style="background:var(--bg2);border-radius:8px;padding:14px;margin-bottom:14px"><div style="font-size:14px;font-weight:500;margin-bottom:4px">Invite a teacher</div>'
      +'<div style="font-size:12px;color:var(--tt);margin-bottom:10px">We email them a login link. If they are new to trainchinese, we create their account.</div>'
      +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px"><div><label style="font-size:13px;color:var(--ts)">Their email '+qm('We email a login link to this address.')+'</label><input id="tc-email" type="email" placeholder="teacher@school.edu" style="width:100%;margin-top:4px"/></div><div><label style="font-size:13px;color:var(--ts)">Username '+qm('A short name they log in with, e.g. ms_lim.')+'</label><input id="tc-user" placeholder="ms_lim" style="width:100%;margin-top:4px"/></div></div>'
      +'<button class="p" id="tc-send" style="margin-top:12px">Send invite</button></div>'
      +'<div id="tc-list" style="color:var(--ts)">Reading your teachers…</div>';
    b.querySelector('#tc-send').onclick=function(){
      var em=(b.querySelector('#tc-email').value||'').trim(), un=(b.querySelector('#tc-user').value||'').trim();
      if(!em||!un){toast('Enter an email and a username');return;}
      var btn=b.querySelector('#tc-send'); btn.disabled=true; btn.textContent='Sending…';
      var bd=new URLSearchParams({rAp:rAp,xreg:'10',e0:em,Name0:un,difTimeMin:String(-new Date().getTimezoneOffset())});
      fetch(base+'teacherAddBySchool.php',{method:'POST',credentials:'include',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:bd}).then(function(res){
        if(!res.ok)throw new Error('status '+res.status);
        toast('Invite sent to '+un); b.querySelector('#tc-email').value='';b.querySelector('#tc-user').value='';btn.disabled=false;btn.textContent='Send invite';
        setTimeout(loadTeachers,600);
      }).catch(function(e){toast('Failed: '+e.message);btn.disabled=false;btn.textContent='Send invite';});
    };
    loadTeachers();
  }
  function loadTeachers(){
    fetch(base+'teacherAddBySchool.php',{credentials:'include'}).then(function(r){return r.text();}).then(function(html){
      var d=new DOMParser().parseFromString(html,'text/html'); var rows=[];
      [].slice.call(d.querySelectorAll('tr,li,div')).forEach(function(e){
        if(e.children.length>8)return; var txt=(e.textContent||'').replace(/\s+/g,' ').trim();
        if(!/Remove|Send email/i.test(txt))return; var m=txt.match(/([^@\s][^@]*?)\s+([\w.+-]+@[\w.-]+\.\w+)/);
        if(m && rows.length<80 && !rows.find(function(x){return x.email===m[2];}))rows.push({name:m[1].trim().slice(0,40),email:m[2]});
      });
      var el=document.querySelector('#ts-teachers #tc-list'); if(!el)return;
      if(!rows.length){el.innerHTML='<div style="color:var(--ts);font-size:14px">No other teachers yet — invite one above.</div>';return;}
      el.innerHTML='<div style="font-size:13px;color:var(--ts);margin-bottom:6px">'+rows.length+' teacher'+(rows.length===1?'':'s')+' in your school</div>'+rows.map(function(t){var ini=(t.name.replace(/[^A-Za-z ]/g,'').split(' ').filter(Boolean).slice(0,2).map(function(w){return w[0].toUpperCase();}).join(''))||'T';return '<div class="tcr-row"><div style="width:32px;height:32px;border-radius:50%;background:var(--info);color:var(--tinfo);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500">'+ini+'</div><div style="flex:1;min-width:0"><div style="font-size:14px">'+t.name+'</div><div style="font-size:12px;color:var(--ts)">'+t.email+'</div></div><button class="d" disabled title="Available on multi-teacher school accounts" style="opacity:.5">Remove</button></div>';}).join('');
    }).catch(function(e){var el=document.querySelector('#ts-teachers #tc-list');if(el)el.innerHTML='<div style="color:'+RED+'">Could not read teachers: '+e.message+'</div>';});
  }

  function renderAll(){
    var R=[['classes',renderClasses],['school',renderSchool],['students',renderStudents],['lists',renderLists],['seats',renderSeats],
      ['teachers',renderTeachers],
      ['notify',function(){previewCard('notify','Email updates','Choose what we email you about.',['Weekly progress report','Low-subscription warning','Tips and product news']);}],
      ['account',function(){previewCard('account','Account','Your personal login and language.',['Display name','Login email','Password','Country and app language']);}]];
    R.forEach(function(p){try{p[1]();}catch(e){var b=body(p[0]);if(b)b.innerHTML='<div style="color:'+RED+'">Section error: '+e.message+'</div>';}});
  }

  if(!rAp){body('classes').innerHTML='<div style="color:'+RED+'">Couldn’t find your session. Open this while logged in on a trainchinese.com/v2 page (e.g. Classes), then click the bookmarklet again.</div>';return;}
  body('classes').innerHTML='Loading your classes…';
  loadClasses(renderAll);
})();
