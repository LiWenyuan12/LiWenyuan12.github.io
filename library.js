// 全局变量
let allGames = [];
let loadedGames = [];
let currentTab = 'hot';
let page = 1;
const perPage = 20;
const total = 1500; // 从 JSON 获取

// 初始化
async function init() {
    try {
        const response = await fetch('games.json');
        const data = await response.json();
        allGames = data.games;
        document.getElementById('total-count').textContent = data.total;
        loadGames();
    } catch (error) {
        console.error('加载游戏数据失败:', error);
    }
}

// 加载当前页游戏，根据 tab 排序
function loadGames() {
    let gamesToLoad = allGames.slice(0, page * perPage);
    
    // 根据 tab 排序
    switch (currentTab) {
        case 'hot':
            gamesToLoad.sort((a, b) => b.hotness - a.hotness);
            break;
        case 'rating':
            gamesToLoad.sort((a, b) => b.rating - a.rating);
            break;
        case 'new':
            gamesToLoad.sort((a, b) => b.id - a.id); // 假设 ID 越大越新
            break;
        case 'discount':
            gamesToLoad = gamesToLoad.filter(g => g.price.includes('折扣'));
            break;
        case 'all':
            // 无排序
            break;
    }
    
    loadedGames = gamesToLoad.slice(0, page * perPage);
    renderGames(loadedGames);
    document.getElementById('loaded-count').textContent = loadedGames.length;
}

// 渲染游戏卡片
function renderGames(games) {
    const container = document.getElementById('game-list');
    container.innerHTML = ''; // 清空
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${game.cover}" alt="${game.name}">
            <h3>${game.name}</h3>
            <p class="rating">评分: ${game.rating}</p>
            <p>类型: ${game.type}</p>
            <p>价格: ${game.price}</p>
            <p>${game.description}</p>
        `;
        container.appendChild(card);
    });
}

// 标签切换
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelector('.tab.active').classList.remove('active');
        tab.classList.add('active');
        currentTab = tab.dataset.tab;
        page = 1;
        loadGames();
    });
});

// 无限滚动
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        if (loadedGames.length < total) {
            page++;
            loadGames();
        }
    }
});

init(); // 启动
