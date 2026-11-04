const modal=document.getElementById('gameModal'), content=document.getElementById('gameContent'), title=document.getElementById('gameTitle');
document.querySelectorAll('[data-game]').forEach(b=>b.addEventListener('click',()=>openGame(b.dataset.game)));
document.getElementById('closeGame').onclick=closeGame;
modal.addEventListener('click',e=>{if(e.target===modal)closeGame()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeGame()});
function closeGame(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');content.innerHTML='';}
function openGame(name){modal.classList.add('open');modal.setAttribute('aria-hidden','false');content.innerHTML='';const names={dodge:'Neon Dodge',memory:'Memory Match',clicker:'Star Clicker',snake:'Snake'};title.textContent=names[name];({dodge, memory, clicker, snake}[name])();}
function panel(html){content.innerHTML=html;}
function dodge(){
 panel('<div><h2>Neon Dodge</h2><p>Use ← → or A / D to dodge the falling blocks.</p><p id="score">Score: 0</p><canvas id="board" width="440" height="280"></canvas><p id="hint">Press an arrow key to start.</p><button id="again">RESTART</button></div>');
 const c=document.getElementById('board'),x=c.getContext('2d'),scoreEl=document.getElementById('score');let px=210,blocks=[],score=0,alive=true,keys={},started=false,raf;
 function reset(){px=210;blocks=[];score=0;alive=true;started=false;scoreEl.textContent='Score: 0';document.getElementById('hint').textContent='Press an arrow key to start.';cancelAnimationFrame(raf);draw();}
 function draw(){x.fillStyle='#080d17';x.fillRect(0,0,440,280);x.fillStyle='#c8ff52';x.fillRect(px,245,28,20);if(started&&alive){if(Math.random()<.035)blocks.push({x:Math.random()*420,y:-20,s:15+Math.random()*15,v:2+Math.random()*2});blocks.forEach(b=>{b.y+=b.v;x.fillStyle='#ff5577';x.fillRect(b.x,b.y,b.s,b.s);if(b.y>235&&b.x<px+28&&b.x+b.s>px)alive=false;});blocks=blocks.filter(b=>b.y<300);score++;scoreEl.textContent='Score: '+Math.floor(score/5);if(!alive)document.getElementById('hint').textContent='Game over! Score: '+Math.floor(score/5)+'. Press restart.';else raf=requestAnimationFrame(draw);} }
 function loop(){if(!alive)return;if(keys.ArrowLeft||keys.a)px=Math.max(0,px-5);if(keys.ArrowRight||keys.d)px=Math.min(412,px+5);draw();}
 document.onkeydown=e=>{keys[e.key]=true;if(['ArrowLeft','ArrowRight','a','d'].includes(e.key)){started=true;document.getElementById('hint').textContent='';if(!raf)draw();} };document.onkeyup=e=>keys[e.key]=false;
 document.getElementById('again').onclick=()=>{reset();};draw();
 const tick=()=>{if(!modal.classList.contains('open')||title.textContent!=='Neon Dodge')return;loop();setTimeout(tick,25)};tick();
}
function memory(){
 const emojis=['👻','🎃','🕷️','🦇','💀','🕸️','🧟','🕯️'];let cards=[...emojis,...emojis].sort(()=>Math.random()-.5),first=null,lock=false,matches=0,moves=0;
 panel('<div><h2>Memory Match</h2><p>Find all 8 matching pairs.</p><p id="memstat">Moves: 0 · Pairs: 0/8</p><div class="memory-board" id="memboard"></div><button id="memreset">SHUFFLE & RESTART</button></div>');
 const board=document.getElementById('memboard');cards.forEach((emoji,i)=>{const b=document.createElement('button');b.className='memory-card';b.textContent='?';b.dataset.emoji=emoji;b.onclick=()=>{if(lock||b.classList.contains('revealed'))return;b.textContent=emoji;b.classList.add('revealed');if(!first){first=b;return;}moves++;if(first.dataset.emoji===emoji){matches++;first=null;document.getElementById('memstat').textContent=`Moves: ${moves} · Pairs: ${matches}/8`;if(matches===8)document.getElementById('memstat').textContent+= ' — You won!';}else{lock=true;const old=first;first=null;setTimeout(()=>{old.textContent='?';b.textContent='?';old.classList.remove('revealed');b.classList.remove('revealed');lock=false;},650);}document.getElementById('memstat').textContent=`Moves: ${moves} · Pairs: ${matches}/8`;};board.appendChild(b);});
 document.getElementById('memreset').onclick=memory;
}
function clicker(){
 panel('<div><h2>Star Clicker</h2><p>Click the star as many times as you can in 15 seconds!</p><h2 id="clickscore">0</h2><p id="clock">15 seconds</p><button id="star" style="font-size:42px;padding:18px 35px">⭐</button><p id="clickmsg">Press the star to begin.</p><button id="clickreset">PLAY AGAIN</button></div>');
 let n=0,left=15,started=false,done=false,timer;const star=document.getElementById('star');
 star.onclick=()=>{if(done)return;if(!started){started=true;timer=setInterval(()=>{left--;document.getElementById('clock').textContent=left+' seconds';if(left<=0){done=true;clearInterval(timer);document.getElementById('clickmsg').textContent='Time! You clicked '+n+' times.';star.disabled=true;}},1000);}n++;document.getElementById('clickscore').textContent=n;};
 document.getElementById('clickreset').onclick=clicker;
}
function snake(){
 panel('<div><h2>Snake</h2><p>Use the arrow keys. Eat the green dots and don’t hit the wall or yourself.</p><p id="snakescore">Score: 0</p><canvas id="snakeboard" width="360" height="360"></canvas><p id="snakehint">Press an arrow key to start.</p><button id="snakerestart">RESTART</button></div>');
 const c=document.getElementById('snakeboard'),x=c.getContext('2d'),size=18;let snake,food,dir,score,alive,started,timer;
 function reset(){clearInterval(timer);snake=[{x:9,y:10},{x:8,y:10},{x:7,y:10}];food={x:14,y:8};dir={x:1,y:0};score=0;alive=true;started=false;document.getElementById('snakescore').textContent='Score: 0';document.getElementById('snakehint').textContent='Press an arrow key to start.';paint();}
 function paint(){x.fillStyle='#080d17';x.fillRect(0,0,360,360);x.fillStyle='#c8ff52';x.fillRect(food.x*size,food.y*size,size-2,size-2);snake.forEach((p,i)=>{x.fillStyle=i?'#6e9d35':'#c8ff52';x.fillRect(p.x*size,p.y*size,size-2,size-2);});}
 function step(){if(!alive)return;let h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(h.x<0||h.y<0||h.x>=20||h.y>=20||snake.some(p=>p.x===h.x&&p.y===h.y)){alive=false;document.getElementById('snakehint').textContent='Game over! Press restart.';clearInterval(timer);return;}snake.unshift(h);if(h.x===food.x&&h.y===food.y){score++;document.getElementById('snakescore').textContent='Score: '+score;food={x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*20)};}else snake.pop();paint();}
 document.onkeydown=e=>{const d={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}}[e.key];if(d&&!(d.x===-dir.x&&d.y===-dir.y)){dir=d;if(!started&&alive){started=true;document.getElementById('snakehint').textContent='';timer=setInterval(step,115);}}};document.getElementById('snakerestart').onclick=reset;reset();
}
