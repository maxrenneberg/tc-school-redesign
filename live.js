(function(){
  if(document.getElementById('tcr-root')){document.getElementById('tcr-root').remove();}
  var RED='#9E2A2A';
  // session token from the current page
  function findToken(){
    var i=document.querySelector('input[name="rAp"]'); if(i&&i.value)return i.value;
    var a=document.querySelector('a[href*="rAp="]'); if(a){var m=(a.getAttribute('href')||'').match(/rAp=(\d+)/); if(m)return m[1];}
    var m2=location.search.match(/rAp=(\d+)/); if(m2)return m2[1];
    return '';
  }
  var rAp=findToken();
  var base=location.pathname.indexOf('/v2/')===0?'/v2/':'/v2/';

  var css='#tcr-root *{box-sizing:border-box;font-family:-apple-system,system-ui,"Segoe UI",Roboto,sans-serif;}'
    +'#tcr-ov{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483600;display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:32px 16px;}'
    +'#tcr-panel{background:#fff;color:#1d1c1a;width:100%;max-width:720px;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.3);overflow:hidden;}'
    +'#tcr-hd{display:flex;align-items:center;gap:10px;padding:16px 20px;border-bottom:1px solid rgba(0,0,0,.1);}'
    +'#tcr-hd .dot{width:6px;height:6px;border-radius:50%;display:inline-block;}'
    +'#tcr-body{padding:18px 20px;max-height:70vh;overflow:auto;}'
    +'#tcr-root button{font:inherit;font-size:14px;color:#1d1c1a;background:#fff;border:1px solid rgba(0,0,0,.25);border-radius:8px;padding:8px 13px;cursor:pointer;}'
    +'#tcr-root button:hover{background:#f4f3ee;}'
    +'#tcr-root button.p{background:'+RED+';border-color:'+RED+';color:#fff;}'
    +'#tcr-root button.d{color:'+RED+';border-color:rgba(158,42,42,.5);}'
    +'#tcr-root input{font:inherit;font-size:14px;height:38px;padding:0 10px;border:1px solid rgba(0,0,0,.25);border-radius:8px;}'
    +'.tcr-row{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid rgba(0,0,0,.08);}'
    +'.tcr-badge{font-size:12px;background:#e6f1fb;color:#185fa5;padding:2px 9px;border-radius:8px;}'
    +'#tcr-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:#1d1c1a;color:#fff;padding:11px 17px;border-radius:8px;font-size:13px;z-index:2147483647;opacity:0;transition:.2s;}'
    +'#tcr-toast.on{opacity:1;}';

  var root=document.createElement('div'); root.id='tcr-root';
  root.innerHTML='<style>'+css+'</style>'
    +'<div id="tcr-ov"><div id="tcr-panel">'
    +'<div id="tcr-hd"><span style="font-weight:500;font-size:16px;">trainchinese</span>'
    +'<span><span class="dot" style="background:#EF9F27"></span> <span class="dot" style="background:'+RED+'"></span></span>'
    +'<span style="font-size:15px;font-weight:500;margin-left:4px;">School classes</span>'
    +'<span class="tcr-badge" style="background:#e1f5ee;color:#0f6e56;margin-left:6px;">Live &middot; saves to your account</span>'
    +'<button id="tcr-x" style="margin-left:auto;padding:5px 10px;">Close</button></div>'
    +'<div id="tcr-body"><div id="tcr-content">Loading your classes&hellip;</div></div>'
    +'</div></div><div id="tcr-toast"></div>';
  document.body.appendChild(root);
  document.getElementById('tcr-x').onclick=function(){root.remove();};
  document.getElementById('tcr-ov').onclick=function(e){if(e.target.id==='tcr-ov')root.remove();};

  var toastT; function toast(m){var t=document.getElementById('tcr-toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('on');},2600);}

  function api(file,params){var q=new URLSearchParams(Object.assign({rAp:rAp,isAjax:'1'},params||{}));return fetch(base+file+(params?('?'+q.toString()):''),{credentials:'include'});}

  function parseClasses(doc){
    var map=new Map();
    doc.querySelectorAll('a[href*="friendsGroupChange"]').forEach(function(a){
      var m=(a.getAttribute('href')||'').match(/friendGroupId=(\d+)/); if(!m)return;
      var gid=m[1]; if(map.has(gid))return;
      var host=a.closest('div,li,tr')||a.parentElement; var txt=(host?host.textContent:'').replace(/\s+/g,' ');
      var cm=txt.match(/Class:\s*([^()]+?)\s*\((\d+)\)/);
      var am=txt.match(/assigned to:\s*([^]+?)(?:Writer|Message|Edit|$)/);
      map.set(gid,{gid:gid,name:cm?cm[1].trim():('Class '+gid),count:cm?parseInt(cm[2],10):0,assigned:am?am[1].trim():null});
    });
    return Array.from(map.values());
  }

  var classes=[];
  function load(){
    fetch(base+'friendsOrganize.php',{credentials:'include'}).then(function(r){return r.text();}).then(function(html){
      var doc=new DOMParser().parseFromString(html,'text/html');
      classes=parseClasses(doc); render();
    }).catch(function(e){document.getElementById('tcr-content').textContent='Could not load classes: '+e.message;});
  }

  function render(){
    var total=classes.reduce(function(a,c){return a+c.count;},0);
    var h='';
    h+='<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px;">';
    h+='<span style="font-size:13px;color:#5f5e5a;">'+classes.length+' classes &middot; '+total+' students</span>';
    h+='<button class="p" id="tcr-add" style="margin-left:auto;">+ Add a class</button>';
    h+='<button id="tcr-reload">Refresh</button></div>';
    h+='<div id="tcr-addform" style="display:none;background:#f4f3ee;border-radius:8px;padding:14px;margin-bottom:14px;">'
      +'<div style="font-size:13px;color:#5f5e5a;margin-bottom:6px;">Name for the new class</div>'
      +'<div style="display:flex;gap:8px;flex-wrap:wrap;"><input id="tcr-newname" placeholder="e.g. P3-A" style="flex:1;min-width:180px;"/><button class="p" id="tcr-create">Create class</button></div></div>';
    if(!classes.length){h+='<div style="color:#5f5e5a;padding:10px 0;">No classes yet. Use &ldquo;Add a class&rdquo;.</div>';}
    classes.forEach(function(c){
      h+='<div class="tcr-row" data-gid="'+c.gid+'">'
        +'<div style="flex:1;min-width:0;"><div style="font-size:15px;font-weight:500;">'+c.name+'</div>'
        +'<div style="font-size:12px;color:#5f5e5a;">'+c.count+' student'+(c.count===1?'':'s')+(c.assigned?(' &middot; teacher: '+c.assigned):'')+'</div></div>'
        +'<a href="'+base+'friendsGroupChange.php?xreg=3&returnFile=friendsOrganize&friendGroupId='+c.gid+'&rAp='+rAp+'" style="font-size:13px;color:#185fa5;text-decoration:none;">Open</a>'
        +'<button class="d tcr-del" data-gid="'+c.gid+'" data-name="'+c.name.replace(/"/g,'')+'">Delete</button></div>';
    });
    document.getElementById('tcr-content').innerHTML=h;
    document.getElementById('tcr-reload').onclick=load;
    document.getElementById('tcr-add').onclick=function(){var f=document.getElementById('tcr-addform');f.style.display=f.style.display==='none'?'block':'none';var n=document.getElementById('tcr-newname');if(n)n.focus();};
    var cr=document.getElementById('tcr-create'); if(cr)cr.onclick=function(){
      var name=(document.getElementById('tcr-newname').value||'').trim();
      if(!name){toast('Type a class name first');return;}
      cr.disabled=true;cr.textContent='Saving…';
      api('friendsOrganize.php',{xreg:'101',newClass:name}).then(function(){toast('Class “'+name+'” saved');load();}).catch(function(e){toast('Failed: '+e.message);cr.disabled=false;cr.textContent='Create class';});
    };
    Array.prototype.forEach.call(document.querySelectorAll('.tcr-del'),function(btn){
      btn.onclick=function(){
        var gid=btn.getAttribute('data-gid'), name=btn.getAttribute('data-name');
        if(!confirm('Delete class “'+name+'”? This cannot be undone.'))return;
        btn.disabled=true;btn.textContent='…';
        api('friendsGroupChange.php',{xreg:'5',friendGroupId:gid,returnFile:'friendsOrganize'}).then(function(){toast('Deleted “'+name+'”');load();}).catch(function(e){toast('Failed: '+e.message);btn.disabled=false;btn.textContent='Delete';});
      };
    });
  }

  if(!rAp){document.getElementById('tcr-content').innerHTML='<div style="color:'+RED+'">Could not find your session token on this page. Open this while logged in on a trainchinese.com/v2 page (e.g. Classes), then click the bookmarklet again.</div>';return;}
  load();
})();
