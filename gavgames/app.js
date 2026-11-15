const gamesEl=document.getElementById("games"),searchEl=document.getElementById("searchInput"),emptyEl=document.getElementById("emptyState");
let category="All",view="home",currentGame=null;
let favorites=new Set(JSON.parse(localStorage.getItem("gavgames-favorites")||"[]"));
const $=id=>document.getElementById(id);
$("year").textContent=new Date().getFullYear();
function saveFavorites(){localStorage.setItem("gavgames-favorites",JSON.stringify([...favorites]));$("favoriteCount").textContent=favorites.size;}
function thumbnailFor(game){return game.thumbnail||`https://s.wordpress.com/mshots/v1/${encodeURIComponent(game.url)}?w=700`;}
function render(){
 const query=searchEl.value.trim().toLowerCase();
 const filtered=GAMES.filter(g=>(category==="All"||g.category===category)&&(view!=="favorites"||favorites.has(g.id))&&(`${g.title} ${g.description} ${g.category}`).toLowerCase().includes(query));
 gamesEl.innerHTML=filtered.map(g=>`<article class="game-card" data-id="${g.id}" tabindex="0" role="button" aria-label="Play ${g.title}">
  <div class="game-art ${g.art}">
   <img class="game-thumbnail" src="${thumbnailFor(g)}" alt="${g.title} gameplay screenshot" loading="lazy" referrerpolicy="no-referrer" onerror="this.classList.add('image-failed')">
   <span class="game-badge">${g.badge}</span>
   <button class="fav-btn ${favorites.has(g.id)?"saved":""}" data-fav="${g.id}" aria-label="Favorite ${g.title}">${favorites.has(g.id)?"♥":"♡"}</button>
  </div>
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
function openGame(id){
 currentGame=GAMES.find(g=>g.id===id);if(!currentGame)return;
 if(currentGame.type==="external"){window.open(currentGame.url,"_blank","noopener,noreferrer");currentGame=null;return;}
 $("site-shell").classList.add("hidden");$("playerView").classList.remove("hidden");$("playerTitle").textContent=currentGame.title;$("playerHeading").textContent=currentGame.title;$("playerDescription").textContent=currentGame.description;
 $("playerAttribution").innerHTML=currentGame.sourceUrl?`Source: <a href="${currentGame.sourceUrl}" target="_blank" rel="noopener noreferrer">${currentGame.sourceLabel||"Original project"}</a> · License: ${currentGame.license||"See source"}`:"Open the original game page if the embedded player is unavailable.";
 updatePlayerFavorite();mountGame(currentGame);window.scrollTo(0,0);
}
function closeGame(){$("playerView").classList.add("hidden");$("site-shell").classList.remove("hidden");$("playerFrame").innerHTML="";currentGame=null;}
$("backButton").addEventListener("click",closeGame);
$("playerFavorite").addEventListener("click",()=>currentGame&&toggleFavorite(currentGame.id));
function mountGame(game){$("playerFrame").innerHTML=`<div class="hosted-game"><iframe src="${game.url}" title="${game.title}" loading="eager" allow="fullscreen; autoplay; gamepad" allowfullscreen referrerpolicy="no-referrer"></iframe><div class="hosted-fallback">Game not loading? <a href="${game.url}" target="_blank" rel="noopener noreferrer">Open it directly ↗</a></div></div>`;}
function playRandomGame(){const playable=GAMES.filter(g=>g.type!=="external");if(playable.length)openGame(playable[Math.floor(Math.random()*playable.length)].id);}
$("randomGameButton").addEventListener("click",playRandomGame);
$("heroRandomButton").addEventListener("click",playRandomGame);
$("featuredPlayButton").addEventListener("click",()=>openGame("hexgl"));
document.querySelectorAll("[data-shortcut-category]").forEach(button=>button.addEventListener("click",()=>{if(view!=="home")setView("home");category=button.dataset.shortcutCategory;document.querySelectorAll(".filter").forEach(filter=>filter.classList.toggle("active",filter.dataset.category===category));render();$("gameGrid").scrollIntoView({behavior:"smooth",block:"start"});}));
saveFavorites();render();
