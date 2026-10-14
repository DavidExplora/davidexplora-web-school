/* Proposed departures, voluntary support enquiries and booking payment requests. */
(function(root){
  'use strict';
  const isNode=typeof module==='object'&&module.exports;
  const data=isNode?require('./guest-data.js'):root.DavidGuestData;
  const phone='255778321400', email='davidlyamuya819@gmail.com';
  const clean=(value,max=1000)=>String(value||'').replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max);
  function validDate(value){
    return /^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T12:00:00Z'))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
  }
  function todayInTanzania(now=new Date()){
    const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Dar_es_Salaam',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
    return ['year','month','day'].map(key=>parts.find(part=>part.type===key).value).join('-');
  }
  function departureState(group,today){
    if(!group||!validDate(today)||!validDate(group.arrival)||!validDate(group.departure))return 'unavailable';
    if(today>group.departure)return 'past';
    if(today>group.arrival)return 'underway';
    return 'proposed';
  }
  function messageLinks(text,subject){
    return {text,whatsapp:'https://wa.me/'+phone+'?text='+encodeURIComponent(text),email:'mailto:'+email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(text)};
  }
  const assistance={boarding:['Vehicle boarding assistance','Ayuda para subir al vehículo'],steps:['Step-free room and bathroom checks','Comprobar habitación y baño sin escalones'],equipment:['Space for mobility equipment','Espacio para equipos de movilidad'],pace:['Shorter walks and rest breaks','Paseos más cortos y pausas'],communication:['Communication arrangements','Apoyo para la comunicación'],companion:['Travelling companion arrangements','Organización con acompañante']};
  const destinations={local:['City or local visit','Visita urbana o local'],safari:['Safari','Safari'],zanzibar:['Zanzibar','Zanzíbar'],mountain:['Kilimanjaro — suitability to assess','Kilimanjaro — valorar la viabilidad'],discuss:['Discuss suitable options','Consultar opciones adecuadas']};
  function createSupportRequest(input={},today=todayInTanzania()){
    const es=input.locale==='es', i=es?1:0, errors=[];
    const error=(field,en,spanish)=>errors.push({field,message:es?spanish:en});
    const name=clean(input.name,100),address=clean(input.email,254),date=String(input.date||''),party=Number(input.party);
    if(!name)error('name','Enter your name.','Escribe tu nombre.');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address))error('email','Enter a valid email address.','Escribe un correo electrónico válido.');
    if(!Number.isInteger(party)||party<1||party>50)error('party','Choose 1–50 travellers.','Indica entre 1 y 50 viajeros.');
    if(date&&(!validDate(date)||!validDate(today)||date<today))error('date','Choose a valid future arrival date, or leave it blank.','Indica una fecha de llegada válida que no haya pasado, o déjala en blanco.');
    if(!Object.hasOwn(destinations,input.destination))error('destination','Choose an experience.','Elige una experiencia.');
    if(!['English','Spanish','Kiswahili'].includes(input.language))error('language','Choose a requested language.','Elige el idioma solicitado.');
    if(input.consent!==true)error('consent','Agree to share these details to discuss your trip.','Acepta compartir estos datos para consultar el viaje.');
    if(errors.length)return {ok:false,errors};
    const selected=[...new Set(Array.isArray(input.assistance)?input.assistance:[])].filter(key=>Object.hasOwn(assistance,key));
    const lines=es?[
      'Hola David, me gustaría consultar un viaje y los apoyos que necesito.',
      'Nombre: '+name,'Correo: '+address,'Llegada: '+(date||'Por decidir'),'Viajeros: '+party,
      'Experiencia: '+destinations[input.destination][i],'Idioma solicitado: '+({English:'Inglés',Spanish:'Español',Kiswahili:'Kiswahili'}[input.language]),
      'Apoyos a comprobar: '+(selected.map(key=>assistance[key][i]).join('; ')||'Por conversar'),
      'Preferencias y preguntas: '+(clean(input.notes)||'Por conversar'),
      'Entiendo que la viabilidad, el guía de idioma, los apoyos y cualquier coste se confirman antes de reservar. Esta consulta no es una reserva.'
    ]:[
      'Hello David, I would like to discuss a trip and the support I need.',
      'Name: '+name,'Email: '+address,'Arrival: '+(date||'To discuss'),'Travellers: '+party,
      'Experience: '+destinations[input.destination][i],'Requested language: '+input.language,
      'Support to check: '+(selected.map(key=>assistance[key][i]).join('; ')||'To discuss'),
      'Preferences and questions: '+(clean(input.notes)||'To discuss'),
      'I understand that suitability, guide language, support and any costs are confirmed before booking. This enquiry is not a reservation.'
    ];
    return {ok:true,...messageLinks(lines.join('\n'),es?'Consulta de viaje y apoyos · David Explora':'Travel and support enquiry · David Explora')};
  }
  function createPaymentRequest(input={}){
    const name=clean(input.name,100),reference=String(input.reference||'').trim(),errors=[];
    if(!name)errors.push({field:'name',message:'Enter your name.'});
    if(!/^[-\p{L}\p{N} _./]{2,80}$/u.test(reference))errors.push({field:'reference',message:'Enter the quote reference David sent you (2–80 letters, numbers or reference punctuation).'});
    if(input.consent!==true)errors.push({field:'consent',message:'Agree to share this request with David.'});
    if(errors.length)return {ok:false,errors};
    return {ok:true,...messageLinks(['Hello David, please send the verified payment instructions for my written quote.','Name: '+name,'Quote reference: '+reference,'Please confirm the recipient, amount, currency, payment method and booking terms before I pay.','This message is a request for instructions, not a payment or a booking confirmation.'].join('\n'),'Payment instructions · '+reference)};
  }
  function welcomeAllowed(storage){try{return storage.getItem('david-welcome-dismissed')!=='1'&&storage.getItem('david-welcome-seen')!=='1';}catch{return false;}}
  function markWelcomeSeen(storage){try{storage.setItem('david-welcome-seen','1');}catch{/* The manual contact control remains available. */}}
  function dismissWelcome(storage){try{storage.setItem('david-welcome-dismissed','1');}catch{/* Manual opening still works without storage. */}}
  const api={validDate,todayInTanzania,departureState,createSupportRequest,createPaymentRequest,welcomeAllowed,markWelcomeSeen,dismissWelcome};
  if(isNode){module.exports=api;return;}
  if(!data||!root.document)return;
  const doc=root.document, today=todayInTanzania();
  doc.querySelectorAll('[data-departure-id]').forEach(row=>{
    const group=data.departures.find(item=>item.id===row.dataset.departureId),state=departureState(group,today);
    if(state==='proposed')return;
    const status=row.querySelector('[data-departure-status]');
    if(status)status.textContent=state==='underway'?'These departure dates are underway · ask about future dates':'Past proposed dates · ask about future departures';
    row.querySelectorAll('[data-join-departure]').forEach(link=>{link.textContent='Ask about future dates ↗';link.href='index.html#contact';});
    row.querySelectorAll('[data-save-dates]').forEach(link=>link.hidden=true);
  });
  const preset=new URLSearchParams(root.location.search).get('departure');
  const selected=data.departures.find(item=>item.id===preset);
  if(selected&&departureState(selected,today)==='proposed'){
    const packageField=doc.getElementById('trip-package'),date=doc.getElementById('travel-date'),style=doc.getElementById('trip-style');
    if(packageField&&packageField.value===selected.id){
      if(date)date.value=selected.arrival;
      if(style)style.value='Small group, if available';
      const flexibility=doc.getElementById('trip-date-flexibility');if(flexibility)flexibility.value='Exact dates';
    }
  }
  doc.querySelectorAll('[data-guest-form]').forEach(form=>{
    const mode=form.dataset.guestForm,locale=form.dataset.locale||'en',ready=form.querySelector('[data-guest-ready]'),status=form.querySelector('[data-guest-status]');
    const submit=form.querySelector('[type="submit"]');if(submit)submit.disabled=false;
    const field=name=>form.querySelector('[name="'+name+'"]');
    if(field('date'))field('date').min=today;
    const clear=()=>{ready.hidden=true;status.textContent='';form.querySelector('[data-guest-preview]').textContent='';form.querySelector('[data-guest-whatsapp]').removeAttribute('href');form.querySelector('[data-guest-email]').removeAttribute('href');};
    form.addEventListener('input',clear);form.addEventListener('change',clear);
    form.addEventListener('submit',event=>{
      event.preventDefault();clear();
      const value=name=>field(name)?field(name).value:'';
      const common={name:value('name'),consent:field('consent').checked};
      const result=mode==='support'?createSupportRequest({...common,locale,email:value('email'),date:value('date'),party:value('party'),language:value('language'),destination:value('destination'),notes:value('notes'),assistance:Array.from(form.querySelectorAll('[name="assistance"]:checked')).map(control=>control.value)},today):createPaymentRequest({...common,reference:value('reference')});
      if(!result.ok){status.textContent=result.errors.map(item=>item.message).join(' ');const first=field(result.errors[0].field);if(first)first.focus();return;}
      form.querySelector('[data-guest-preview]').textContent=result.text;
      form.querySelector('[data-guest-whatsapp]').href=result.whatsapp;
      form.querySelector('[data-guest-email]').href=result.email;
      ready.hidden=false;status.textContent=locale==='es'?'Mensaje preparado. Revísalo y envíalo desde WhatsApp o tu aplicación de correo.':'Message prepared. Review it and send it from WhatsApp or your email app.';
      ready.focus();
    });
  });
  const welcome=doc.getElementById('david-welcome'),launcher=doc.getElementById('welcome-launch'),close=doc.getElementById('welcome-close');
  if(welcome&&launcher&&close){
    launcher.hidden=false;
    const show=()=>{welcome.hidden=false;launcher.setAttribute('aria-expanded','true');try{markWelcomeSeen(root.sessionStorage);}catch{/* Storage may be blocked. */}};
    const hide=()=>{const inside=welcome.contains(doc.activeElement);welcome.hidden=true;launcher.setAttribute('aria-expanded','false');try{dismissWelcome(root.sessionStorage);}catch{/* Storage may be blocked. */}if(inside)launcher.focus();};
    launcher.addEventListener('click',()=>welcome.hidden?show():hide());close.addEventListener('click',hide);
    welcome.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();hide();}});
    doc.addEventListener?.('keydown',event=>{if(event.key==='Escape'&&!welcome.hidden){event.preventDefault();hide();}});
    doc.addEventListener?.('focusin',event=>{if(!welcome.hidden&&event.target.closest?.('form'))hide();});
    // Keep the existing WhatsApp link as the no-JS fallback; one contact control is shown with JS.
    doc.body?.classList.add('welcome-enabled');
    const enquiryPage=doc.querySelector('[data-guest-form]');
    let allowed=false;try{allowed=welcomeAllowed(root.sessionStorage);}catch{/* Some browser policies block the property itself. */}
    if(allowed&&!enquiryPage){root.setTimeout(()=>{
      let stillAllowed=false;try{stillAllowed=welcomeAllowed(root.sessionStorage);}catch{/* Storage may be blocked. */}
      if(!stillAllowed)return;
      const active=doc.activeElement,contact=doc.getElementById('contact'),rect=contact?.getBoundingClientRect();
      if(doc.hidden||root.location.hash==='#contact'||active&&/INPUT|SELECT|TEXTAREA|BUTTON|A/.test(active.tagName)||rect&&rect.top<root.innerHeight&&rect.bottom>0)return;
      show();
    },7000);}
  }
})(typeof globalThis!=='undefined'?globalThis:this);
