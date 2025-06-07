const images = [
    "/static/img/bg1.png",
    "/static/img/bg2.png",
];

let current = 0;
let showingFirst = true;

const bg1 = document.getElementById("bg1");
const bg2 = document.getElementById("bg2");

// 첫 번째 배경 바로 보이게 설정
bg1.style.backgroundImage = `url('${images[current]}')`;
bg1.style.opacity = 1; // 첫 번째 배경을 바로 표시
bg2.style.opacity = 0;

// 5초마다 배경을 전환
setInterval(() => {
const next = (current + 1) % images.length;
const currentDiv = showingFirst ? bg1 : bg2;
const nextDiv = showingFirst ? bg2 : bg1;

nextDiv.style.backgroundImage = `url('${images[next]}')`;
nextDiv.style.opacity = 1;
currentDiv.style.opacity = 0;

showingFirst = !showingFirst;
current = next;
}, 5000);