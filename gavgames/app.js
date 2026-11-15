const gamesEl=document.getElementById("games"),searchEl=document.getElementById("searchInput"),emptyEl=document.getElementById("emptyState");
let category="All",view="home",currentGame=null;
let activeGameCleanup=()=>{};
let favorites=new Set(JSON.parse(localStorage.getItem("gavgames-favorites")||"[]"));
const $=id=>document.getElementById(id);
$("year").textContent=new Date().getFullYear();
function saveFavorites(){localStorage.setItem("gavgames-favorites",JSON.stringify([...favorites]));$("favoriteCount").textContent=favorites.size;}
function render(){
 const query=searchEl.value.trim().toLowerCase();
 const filtered=GAMES.filter(g=>(category==="All"||g.category===category)&&(view!=="favorites"||favorites.has(g.id))&&(`${g.title} ${g.description} ${g.category}`).toLowerCase().includes(query));
 gamesEl.innerHTML=filtered.map(g=>`<article class="game-card" data-id="${g.id}" tabindex="0" role="button" aria-label="Play ${g.title}">
  <div class="game-art ${g.art}"><span class="game-badge">${g.badge}</span><button class="fav-btn ${favorites.has(g.id)?"saved":""}" data-fav="${g.id}" aria-label="Favorite ${g.title}">${favorites.has(g.id)?"♥":"♡"}</button><span class="emoji">${g.emoji}</span></div>
  <div class="game-meta"><h3>${g.title}</h3><p>${g.description}</p><div class="game-bottom"><span class="game-category">${g.category}</span><span class="play-label">${g.type==="external"?"OPEN ↗":"PLAY →"}</span></div></div>
 </article>`).join("");
 emptyEl.classList.toggle("hidden",filtered.length!==0);
 $("sectionTitle").textContent=view==="favorites"?"Your favorites.":"Play something good.";
}
function setView(next){view=next;document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===next));$("hero").classList.toggle("hidden",next==="favorites");$("filters").classList.toggle("hidden",next==="favorites");category="All";document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.category==="All"));render();window.scrollTo(0,0);}
document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));
$("homeLink").addEventListener("click",e=>{e.preventDefault();setView("home");});
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{category=b.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));render();}));
searchEl.addEventListener("input",render);
gamesEl.addEventListener("click",e=>{const fav=e.target.closest("[data-fav]");if(fav){e.stopPropagation();toggleFavorite(fav.dataset.fav);return;}const card=e.target.closest("[data-id]");if(card)openGame(card.dataset.id);});
gamesEl.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-id]")){e.preventDefault();openGame(e.target.dataset.id);}});
function toggleFavorite(id){favorites.has(id)?favorites.delete(id):favorites.add(id);saveFavorites();render();if(currentGame?.id===id)updatePlayerFavorite();}
function updatePlayerFavorite(){$("playerFavorite").textContent=favorites.has(currentGame.id)?"♥":"♡";$("playerFavorite").style.color=favorites.has(currentGame.id)?"#ff75ad":"white";}
function openGame(id){currentGame=GAMES.find(g=>g.id===id);if(!currentGame)return;if(currentGame.type==="external"){window.open(currentGame.url,"_blank","noopener,noreferrer");return;}
 $("site-shell").classList.add("hidden");$("playerView").classList.remove("hidden");$("playerTitle").textContent=currentGame.title;$("playerHeading").textContent=currentGame.title;$("playerDescription").textContent=currentGame.description;
 $("playerAttribution").innerHTML=currentGame.sourceUrl
  ? `Source: <a href="${currentGame.sourceUrl}" target="_blank" rel="noopener noreferrer">${currentGame.sourceLabel||"Original project"}</a> · License: ${currentGame.license||"See source"}`
  : "Original GavGames mini-game";
 updatePlayerFavorite();mountGame(currentGame);window.scrollTo(0,0);}
function closeGame(){activeGameCleanup();activeGameCleanup=()=>{};$("playerView").classList.add("hidden");$("site-shell").classList.remove("hidden");$("playerFrame").innerHTML="";currentGame=null;}
$("backButton").addEventListener("click",closeGame);$("playerFavorite").addEventListener("click",()=>currentGame&&toggleFavorite(currentGame.id));
function mountGame(g){activeGameCleanup();activeGameCleanup=()=>{};const root=$("playerFrame");root.innerHTML="";
 if(g.type==="hosted"){
  root.innerHTML=`<div class="hosted-game"><iframe src="${g.url}" title="${g.title}" loading="eager" allow="fullscreen; autoplay; gamepad" allowfullscreen referrerpolicy="no-referrer"></iframe><div class="hosted-fallback">Game not loading? <a href="${g.url}" target="_blank" rel="noopener noreferrer">Open it directly ↗</a></div></div>`;
  return;
 }
 if(g.game==="tictactoe")return ticTacToe(root);if(g.game==="reaction")return reaction(root);if(g.game==="hoops")return hoops(root);if(g.game==="memory")return memory(root);if(g.game==="clicker")return clicker(root);if(g.game==="snake")return snake(root);}
function mini(root,html){root.innerHTML=`<div class="mini-game">${html}</div>`;}
function ticTacToe(root){let board=Array(9).fill(""),over=false;const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];function draw(msg="Your turn — you're X."){mini(root,`<h2>Tic-Tac-Toe</h2><p>${msg}</p><div class="mini-board">${board.map((v,i)=>`<button class="mini-cell" data-cell="${i}">${v}</button>`).join("")}</div><button id="reset">Restart</button>`);root.querySelectorAll("[data-cell]").forEach(b=>b.onclick=()=>move(+b.dataset.cell));root.querySelector("#reset").onclick=()=>{board=Array(9).fill("");over=false;draw();};}function winner(){for(const line of wins){const [a,b,c]=line;if(board[a]&&board[a]===board[b]&&board[b]===board[c])return board[a];}return board.every(Boolean)?"draw":null;}function move(i){if(over||board[i])return;board[i]="X";let w=winner();if(w){over=true;return draw(w==="draw"?"It's a tie!":"You win! 🎉");}const empty=board.map((v,i)=>v?null:i).filter(v=>v!==null);if(empty.length){let pick=empty.find(i=>wins.some(line=>line.includes(i)&&line.filter(x=>board[x]==="O").length===1&&line.filter(x=>board[x]==="X").length===0));board[pick??empty[Math.floor(Math.random()*empty.length)]]="O";}w=winner();if(w)over=true;draw(w?(w==="draw"?"It's a tie!":"Computer wins!"):"Your turn — you're X.");}draw();}
function reaction(root){let state="ready",start=0,timer;activeGameCleanup=()=>clearTimeout(timer);function draw(title,sub,btn){mini(root,`<h2>⚡ Reaction Rush</h2><p>${title}</p><p class="score">${sub}</p><button id="react">${btn}</button>`);root.querySelector("#react").onclick=()=>{if(state==="ready"){state="wait";draw("Wait for the green signal...","Get ready","Wait...");timer=setTimeout(()=>{state="go";start=performance.now();draw("CLICK NOW! 🟢","GO!","CLICK!");},1000+Math.random()*3500);}else if(state==="wait"){clearTimeout(timer);state="ready";draw("Too early! Try again.","False start","Try again");}else{const ms=Math.round(performance.now()-start);state="ready";draw("Nice reflexes!",""+ms+" ms","Try again");}};}draw("Click when the panel says GO.","Ready?","Start");}
function hoops(root){let score=0,shots=0;function draw(msg="Tap to shoot!"){mini(root,`<h2>🏀 Hoop Shot</h2><p>${msg}</p><div class="score">${score} / ${shots} shots</div><div style="font-size:88px;margin:12px">🏀</div><button id="shoot">Shoot!</button><button id="reset">Reset</button>`);root.querySelector("#shoot").onclick=()=>{shots++;const hit=Math.random()<.58;if(hit)score++;draw(hit?"SWISH! 🎯":"Missed it — next one!");};root.querySelector("#reset").onclick=()=>{score=0;shots=0;draw();};}draw();}
function memory(root){let icons=["🍉","🍉","🚀","🚀","🐸","🐸","⭐","⭐"],first=null,lock=false,matches=0,moves=0;icons.sort(()=>Math.random()-.5);let shown=[];function draw(){mini(root,`<h2>🧠 Memory Match</h2><p>Find all four pairs. Moves: ${moves}</p><div class="mini-board" style="grid-template-columns:repeat(4,65px)">${icons.map((v,i)=>`<button class="mini-cell" style="width:65px;height:65px;font-size:25px" data-card="${i}">${shown.includes(i)||matched.includes(i)?v:"?"}</button>`).join("")}</div><button id="restart">Shuffle & restart</button>`);root.querySelectorAll("[data-card]").forEach(b=>b.onclick=()=>flip(+b.dataset.card));root.querySelector("#restart").onclick=()=>memory(root);}let matched=[];function flip(i){if(lock||shown.includes(i)||matched.includes(i))return;shown.push(i);if(shown.length===2){moves++;if(icons[shown[0]]===icons[shown[1]]){matched.push(...shown);shown=[];if(matched.length===8)return drawWin();}else{lock=true;setTimeout(()=>{shown=[];lock=false;draw();},700);}}draw();}function drawWin(){mini(root,`<h2>🎉 You did it!</h2><p>All pairs found in ${moves} moves.</p><button id="again">Play again</button>`);root.querySelector("#again").onclick=()=>memory(root);}draw();}
function clicker(root){let score=0,started=false,remaining=10,interval;activeGameCleanup=()=>clearInterval(interval);function draw(msg="Click the cookie as many times as you can in 10 seconds."){mini(root,`<h2>🍪 Cookie Clicker Mini</h2><p>${msg}</p><div class="score">${score} points · ${remaining}s</div><button id="cookie" style="font-size:65px;background:#ffffff12;padding:15px 35px">🍪</button><br><button id="start">Start / Reset</button>`);root.querySelector("#cookie").onclick=()=>{if(started&&remaining>0){score++;root.querySelector(".score").textContent=`${score} points · ${remaining}s`;}};root.querySelector("#start").onclick=()=>{clearInterval(interval);score=0;remaining=10;started=true;draw("Go! Go! Go!");interval=setInterval(()=>{remaining--;const s=root.querySelector(".score");if(s)s.textContent=`${score} points · ${remaining}s`;if(remaining<=0){clearInterval(interval);started=false;draw(`Time! Final score: ${score}`);}},1000);};}draw();}
function snake(root){mini(root,`<h2>🐍 Snake</h2><p>Use arrow keys to eat the red food. Don't hit the wall or yourself.</p><canvas id="snakeCanvas" width="320" height="320" style="max-width:100%;background:#161629;border-radius:12px"></canvas><p class="score" id="snakeScore">Score: 0</p><button id="snakeStart">Start / Restart</button>`);const c=root.querySelector("canvas"),ctx=c.getContext("2d"),scoreEl=root.querySelector("#snakeScore");let body,food,dir,loop,score,alive;function reset(){clearInterval(loop);body=[{x:8,y:8},{x:7,y:8},{x:6,y:8}];food={x:13,y:8};dir={x:1,y:0};score=0;alive=true;draw();loop=setInterval(step,115);}function draw(){ctx.fillStyle="#161629";ctx.fillRect(0,0,320,320);ctx.fillStyle="#ff6c79";ctx.fillRect(food.x*16+2,food.y*16+2,12,12);body.forEach((p,i)=>{ctx.fillStyle=i?"#6dcf9b":"#a9f3be";ctx.fillRect(p.x*16+1,p.y*16+1,14,14);});scoreEl.textContent="Score: "+score;}function step(){const head={x:body[0].x+dir.x,y:body[0].y+dir.y};if(head.x<0||head.y<0||head.x>=20||head.y>=20||body.some(p=>p.x===head.x&&p.y===head.y)){clearInterval(loop);alive=false;scoreEl.textContent="Game over — score: "+score;return;}body.unshift(head);if(head.x===food.x&&head.y===food.y){score++;food={x:Math.floor(Math.random()*20),y:Math.floor(Math.random()*20)};}else body.pop();draw();}function key(e){const d={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}}[e.key];if(d&&!(d.x===-dir.x&&d.y===-dir.y)){dir=d;e.preventDefault();}}window.addEventListener("keydown",key);activeGameCleanup=()=>{clearInterval(loop);window.removeEventListener("keydown",key);};root.querySelector("#snakeStart").onclick=reset;reset();}
saveFavorites();render();

// Homepage discovery controls
function playRandomGame(){
 const playable=GAMES.filter(g=>g.type!=="external");
 if(!playable.length)return;
 const pick=playable[Math.floor(Math.random()*playable.length)];
 openGame(pick.id);
}
$("randomGameButton").addEventListener("click",playRandomGame);
$("heroRandomButton").addEventListener("click",playRandomGame);
$("featuredPlayButton").addEventListener("click",()=>openGame("hoops"));
document.querySelectorAll("[data-shortcut-category]").forEach(button=>{
 button.addEventListener("click",()=>{
  if(view!=="home")setView("home");
  category=button.dataset.shortcutCategory;
  document.querySelectorAll(".filter").forEach(filter=>filter.classList.toggle("active",filter.dataset.category===category));
  render();
  $("gameGrid").scrollIntoView({behavior:"smooth",block:"start"});
 });
});
