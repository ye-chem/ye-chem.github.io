/* TIME */

function updateTime(){
const now = new Date();
document.querySelectorAll("#time").forEach(t=>{
t.textContent = now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})
})
}
setInterval(updateTime,1000)
updateTime()


/* BATTERY */

if('getBattery' in navigator){
navigator.getBattery().then(battery=>{
function updateBattery(){
document.querySelectorAll("#battery").forEach(b=>{
b.textContent = Math.round(battery.level*100)+"%"
})
}
updateBattery()
battery.addEventListener("levelchange",updateBattery)
})
}


/* MOVING STAR BACKGROUND */

const bg = document.getElementById("background")

if(bg){

for(let i=0;i<120;i++){

const star=document.createElement("div")

star.className="star"

star.style.left=Math.random()*100+"vw"
star.style.top=Math.random()*100+"vh"

star.dataset.speed=(Math.random()*0.3)+0.1

bg.appendChild(star)

}

function moveStars(){

document.querySelectorAll(".star").forEach(star=>{

let y=parseFloat(star.style.top)

y+=parseFloat(star.dataset.speed)

if(y>100){
y=0
star.style.left=Math.random()*100+"vw"
}

star.style.top=y+"vh"

})

requestAnimationFrame(moveStars)
}

moveStars()

}


/* GAME DATABASE */
/* ADD GAMES HERE */

const games=[

{
name:"Slope",
icon:"icons/slope.png",
file:"games/slope.html",
popular:true,
newest:false
}

]


/* FAVORITES */

let favorites=JSON.parse(localStorage.getItem("favorites"))||[]

function toggleFavorite(name){

if(favorites.includes(name)){
favorites=favorites.filter(f=>f!==name)
}else{
favorites.push(name)
}

localStorage.setItem("favorites",JSON.stringify(favorites))

renderGames(games)

}


/* RENDER GAMES */

function renderGames(list){

const grid=document.getElementById("gamesGrid")

if(!grid) return

grid.innerHTML=""

list.forEach(game=>{

const card=document.createElement("div")
card.className="game-card"

card.onclick=()=>{
window.location="game.html?game="+encodeURIComponent(game.file)
}


const icon=document.createElement("img")
icon.src=game.icon
icon.className="game-icon"


const name=document.createElement("div")
name.className="game-name"
name.textContent=game.name


const star=document.createElement("img")
star.className="favorite"
star.src=favorites.includes(game.name)?"icons/star-filled.svg":"icons/star-outline.svg"

star.onclick=(e)=>{
e.stopPropagation()
toggleFavorite(game.name)
}


card.appendChild(star)
card.appendChild(icon)
card.appendChild(name)

grid.appendChild(card)

})

}


/* SEARCH */

const gameSearch=document.getElementById("gameSearch")

if(gameSearch){

renderGames(games)

gameSearch.addEventListener("input",()=>{

const term=gameSearch.value.toLowerCase()

const filtered=games.filter(g=>g.name.toLowerCase().includes(term))

renderGames(filtered)

})

}


/* HOME SEARCH */

const homeSearch=document.getElementById("homeSearch")

if(homeSearch){

homeSearch.addEventListener("keydown",e=>{

if(e.key==="Enter"){

const query=encodeURIComponent(homeSearch.value)

window.location="games.html?search="+query

}

})

}


/* LOAD GAME PLAYER */

const frame=document.getElementById("gameFrame")

if(frame){

const params=new URLSearchParams(window.location.search)

const game=params.get("game")

frame.src=game

}


/* FULLSCREEN BUTTON */

const fsBtn=document.getElementById("fullscreenBtn")

if(fsBtn){

fsBtn.onclick=()=>{

const src=document.getElementById("gameFrame").src

const win=window.open("about:blank")

win.document.write(`
<style>
body{margin:0;background:black}
iframe{border:none;width:100vw;height:100vh}
</style>
<iframe src="${src}"></iframe>
`)

}

}
