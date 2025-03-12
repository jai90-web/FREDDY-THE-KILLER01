const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let username = '';
let player = { x: canvas.width / 2, y: canvas.height / 2, radius: 25, speed: 20 };
let pillars = [];
let pillarSpeed = 15;
let score = 0;
let highScores = JSON.parse(localStorage.getItem('highScores')) || {};
let gameInterval;
let startTime;

function startGame() {
    username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter a username');
        return;
    }
    document.getElementById('usernameInput').style.display = 'none';
    canvas.style.display = 'block';
    startTime = Date.now();
    gameInterval = setInterval(gameLoop, 100);
}

function createPillar() {
    const x = Math.random() * (canvas.width - 20);
    const y = -100;
    return { x, y, width: 20, height: 100 };
}

for (let i = 0; i < 5; i++) {
    pillars.push(createPillar());
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'red';
    for (let pillar of pillars) {
        pillar.y += pillarSpeed;
        if (pillar.y > canvas.height) {
            pillars.splice(pillars.indexOf(pillar), 1);
            pillars.push(createPillar());
            score++;
        }
        ctx.fillRect(pillar.x, pillar.y, pillar.width, pillar.height);
        if (checkCollision(player, pillar)) {
            gameOver();
        }
    }

    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.fillText(`Score: ${score}`, 10, 40);

    if (Date.now() - startTime > 10000) {
        pillarSpeed++;
        startTime = Date.now();
    }

    document.addEventListener('keydown', movePlayer);
}

function movePlayer(event) {
    if (event.key === 'ArrowLeft' && player.x - player.radius > 0) {
        player.x -= player.speed;
    }
    if (event.key === 'ArrowRight' && player.x + player.radius < canvas.width) {
        player.x += player.speed;
    }
    if (event.key === 'ArrowUp' && player.y - player.radius > 0) {
        player.y -= player.speed;
    }
    if (event.key === 'ArrowDown' && player.y + player.radius < canvas.height) {
        player.y += player.speed;
    }
}

function checkCollision(player, pillar) {
    return player.x < pillar.x + pillar.width &&
           player.x + player.radius > pillar.x &&
           player.y < pillar.y + pillar.height &&
           player.y + player.radius > pillar.y;
}

function gameOver() {
    clearInterval(gameInterval);
    ctx.fillStyle = 'red';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
    setTimeout(() => {
        updateHighScores();
        displayLeaderboard();
    }, 2000);
}

function updateHighScores() {
    if (!highScores[username] || score > highScores[username]) {
        highScores[username] = score;
    }
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function displayLeaderboard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.fillText('Leaderboard', canvas.width / 2 - 100, 50);
    const sortedScores = Object.entries(highScores).sort((a, b) => b[1] - a[1]);
    sortedScores.slice(0, 5).forEach(([user, highScore], index) => {
        ctx.fillText(`${index + 1}. ${user}: ${highScore}`, canvas.width / 2 - 100, 100 + index * 40);
    });
}
