document.addEventListener('DOMContentLoaded', () => {
  // Mobile detection and warning
  const mobileWarning = document.getElementById('mobile-warning');
  const continueButton = document.getElementById('continue-button');
  
  function isMobileDevice() {
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 768;
      
      const isEmulatedMobile = navigator.userAgentData && 
                             navigator.userAgentData.mobile;
      
      return isMobileUA || hasTouch && isSmallScreen || isEmulatedMobile;
  }
  
  if (isMobileDevice()) {
      mobileWarning.classList.remove('hidden');
      
      continueButton.addEventListener('click', () => {
          mobileWarning.classList.add('hidden');
          showTitleScreen();
      });
      
      return;
  }
  
  showTitleScreen();
});

function showTitleScreen() {
  const titleScreen = document.getElementById('title-screen');
  const startButton = document.getElementById('start-button');
  const gameContainer = document.getElementById('game-container');

  startButton.addEventListener('click', () => {
      titleScreen.style.display = 'none';
      gameContainer.classList.remove('hidden');
      initGame();
  });

  document.addEventListener('keydown', (e) => {
      if (titleScreen.style.display !== 'none') {
          titleScreen.style.display = 'none';
          gameContainer.classList.remove('hidden');
          initGame();
      }
  });
};
function initGame() {
  const player = document.getElementById('player');
  const platforms = document.querySelectorAll('.platform');
  const doors = document.querySelectorAll('.door');
  const prompt = document.getElementById('prompt');
  
  const gameState = {
      player: {
          x: 100,
          y: window.innerHeight - 150,
          width: 100,
          height: 100,
          velocityX: 0,
          velocityY: 0,
          speed: 5,
          jumpForce: 12,
          isJumping: false,
          direction: 1 
      },
      doors: [
        {
            element: document.getElementById('ground-door'),
            link: "https://www.youtube.com/@arensies",
            x: 1480, 
            y: window.innerHeight - 60, 
            width: 40,
            height: 60
        },
        {
            element: document.getElementById('platform1-door'),
            link: "https://tracker.gg/valorant/profile/riot/kkura%23ONE/overview?platform=pc&playlist=competitive&season=16118998-4705-5813-86dd-0292a2439d90",
            x: 520,
            y: window.innerHeight - 290,
            width: 40,
            height: 60
        },
        {
            element: document.getElementById('platform2-door'),
            link: "https://act.hoyolab.com/app/community-game-records-sea/rpg/index.html?bbs_presentation_style=fullscreen&gid=6&user_id=55470429&utm_source=share&utm_medium=link&bbs_theme=dark&bbs_theme_device=1&utm_campaign=web#/hsr",
            target: '_blank',
            x: 920,
            y: window.innerHeight - 430,
            width: 40,
            height: 60
        },
        {
            element: document.getElementById('platform3-door'),
            link: "https://akasha.cv/profile/809344620",
            x: 260,
            y: window.innerHeight - 580,
            width: 40,
            height: 60
        },
        {
            element: document.getElementById('platform4-door'),
            link: "https://github.com/RNCS0", 
            x: 1280,
            y: window.innerHeight - 580,
            width: 40,
            height: 60
        },
        {
            element: document.getElementById('platform5-door'),
            link: "https://steamcommunity.com/profiles/76561199177092231",  
            x: 1720,
            y: window.innerHeight - 370,
            width: 40,
            height: 60
        },
        {
            element: document.getElementById('platform6-door'),
            link: "https://rncs0.github.io/Portfolio/",  
            x: 920,
            y: window.innerHeight - 780,
            width: 40,
            height: 60
        },
    ],
      // Animation system
      sprites: {
          idle: {
              right: [
                  'img/gengar_idle.png',
                  'img/gengar_idle2.png',
                  'img/gengar_idle3.png',
                  'img/gengar_idle4.png'
              ],
              left: [
                  'img/gengar_idleleft.png',
                  'img/gengar_idleleft2.png',
                  'img/gengar_idleleft3.png',
                  'img/gengar_idleleft4.png'
              ]
          },
          walk: {
              right: [
                  'img/gengar_run.png',
                  'img/gengar_run2.png',
                  'img/gengar_run3.png',
                  'img/gengar_run4.png',
              ],
              left: [
                  'img/gengar_runleft.png',
                  'img/gengar_runleft2.png',
                  'img/gengar_runleft3.png',
                  'img/gengar_runleft4.png',
              ]
          },
          jump: {
              right: 'img/gengar_jump.png',
              left: 'img/gengar_jumpleft.png'
          },
          currentAnimation: 'idle',
          currentDirection: 'right',
          currentFrame: 0
      },
      animation: {
          timer: 0,
          walkInterval: 8,
          idleInterval: 15,
          isWalking: false
      },
      physics: {
          gravity: 0.5,
          friction: 0.9
      },
      keys: {
          left: false,
          right: false,
          up: false,
          interact: false
      },
      gameWidth: window.innerWidth,
      gameHeight: window.innerHeight,
      nearDoor: null
  };

  // Get platform positions
  function getPlatformData() {
      return Array.from(platforms).map(platform => {
          const rect = platform.getBoundingClientRect();
          return {
              element: platform,
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height
          };
      });
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    gameState.gameWidth = window.innerWidth;
    gameState.gameHeight = window.innerHeight;
    
    // Update all door positions
    gameState.doors[0].y = window.innerHeight - 60;   // ground-door
    gameState.doors[1].y = window.innerHeight - 290;  // platform1-door
    gameState.doors[2].y = window.innerHeight - 430;  // platform2-door
    gameState.doors[3].y = window.innerHeight - 580;  // platform3-door
    gameState.doors[4].y = window.innerHeight - 580;  // platform4-door
    gameState.doors[5].y = window.innerHeight - 370;  // platform5-door
    gameState.doors[6].y = window.innerHeight - 780;  // platform5-doo
});

  // Event listeners for keyboard
  window.addEventListener('keydown', (e) => {
      switch(e.key) {
          case 'ArrowLeft':
          case 'A':
          case 'a':
              gameState.keys.left = true;
              gameState.player.direction = -1;
              break;
          case 'ArrowRight':
          case 'D':
          case 'd':
              gameState.keys.right = true;
              gameState.player.direction = 1;
              break;
          case 'ArrowUp':
          case ' ':
          case 'W':
          case 'w':
          case 'Space':
              if (!gameState.player.isJumping) {
                  gameState.player.velocityY = -gameState.player.jumpForce;
                  gameState.player.isJumping = true;
                  gameState.sprites.currentAnimation = 'jump';
              }
              break;
          case 'e':
          case 'E':
              gameState.keys.interact = true;
              checkDoorInteraction();
              break;
      }
  });

  window.addEventListener('keyup', (e) => {
      switch(e.key) {
          case 'ArrowLeft':
          case 'A':
          case 'a':
              gameState.keys.left = false;
              break;
          case 'ArrowRight':
          case 'D':
          case 'd':
              gameState.keys.right = false;
              break;
          case 'e':
          case 'E':
              gameState.keys.interact = false;
              break;
      }
  });

  // Door proximity
  function checkDoorProximity() {
      const p = gameState.player;
      let closestDoor = null;
      let minDistance = Infinity;
      
      gameState.doors.forEach(door => {
          door.element.classList.remove('door-highlight');
      });
      
      gameState.doors.forEach(door => {
          const horizontalDist = Math.abs((p.x + p.width/2) - (door.x + door.width/2));
          const verticalDist = Math.abs((p.y + p.height/2) - (door.y + door.height/2));
          
          if (horizontalDist < 40 && 
              verticalDist < 60 &&
              p.y + p.height > door.y) {
              
              const distance = Math.sqrt(horizontalDist*horizontalDist + verticalDist*verticalDist);
              if (distance < minDistance) {
                  minDistance = distance;
                  closestDoor = door;
              }
          }
      });
      
      gameState.nearDoor = closestDoor;
      
      if (gameState.nearDoor) {
          prompt.classList.remove('hidden');
          prompt.style.left = `${p.x + p.width/2}px`;
          prompt.style.top = `${p.y - 20}px`;
          
          if (minDistance < 30) {
              prompt.classList.add('active');
              gameState.nearDoor.element.classList.add('door-highlight');
          } else {
              prompt.classList.remove('active');
          }
      } else {
          prompt.classList.add('hidden');
      }
  }

  function checkDoorInteraction() {
    if (gameState.nearDoor && gameState.keys.interact) {
        const link = document.createElement('a');
        link.href = gameState.nearDoor.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        gameState.keys.interact = false;
    }
}

  // Animation
  function updateAnimation() {
      const p = gameState.player;
      
      if (p.isJumping) {
          gameState.sprites.currentAnimation = 'jump';
      } else if (Math.abs(p.velocityX) > 0.5) {
          gameState.sprites.currentAnimation = 'walk';
          gameState.animation.isWalking = true;
      } else {
          gameState.sprites.currentAnimation = 'idle';
          gameState.animation.isWalking = false;
      }
      
      gameState.sprites.currentDirection = p.direction === 1 ? 'right' : 'left';
      
      if (gameState.sprites.currentAnimation === 'jump') {
          gameState.sprites.currentFrame = 0;
      } else {
          gameState.animation.timer++;
          const interval = gameState.sprites.currentAnimation === 'walk' ? 
                         gameState.animation.walkInterval : 
                         gameState.animation.idleInterval;
          
          if (gameState.animation.timer >= interval) {
              gameState.sprites.currentFrame = 
                  (gameState.sprites.currentFrame + 1) % 
                  gameState.sprites[gameState.sprites.currentAnimation][gameState.sprites.currentDirection].length;
              gameState.animation.timer = 0;
          }
      }
  }

  // Update player position and physics
  function updatePlayer() {
      const p = gameState.player;
      
      if (gameState.keys.left) {
          p.velocityX = -p.speed;
      } else if (gameState.keys.right) {
          p.velocityX = p.speed;
      } else {
          p.velocityX *= gameState.physics.friction;
          if (Math.abs(p.velocityX) < 0.1) p.velocityX = 0;
      }
      
      p.velocityY += gameState.physics.gravity;
      
      p.x += p.velocityX;
      p.y += p.velocityY;
      
      let onGround = false;
      const platformData = getPlatformData();
      
      platformData.forEach(platform => {
          const playerBottom = p.y + p.height;
          const platformTop = platform.y;
          
          if (
              p.x < platform.x + platform.width &&
              p.x + p.width > platform.x &&
              playerBottom >= platformTop &&
              p.y < platformTop &&
              p.velocityY > 0
          ) {
              p.y = platformTop - p.height;
              p.velocityY = 0;
              p.isJumping = false;
              onGround = true;
          }
      });
      
      const ground = document.getElementById('ground');
      const groundRect = ground.getBoundingClientRect();
      const groundTop = groundRect.top;
      
      if (p.y + p.height >= groundTop) {
          p.y = groundTop - p.height;
          p.velocityY = 0;
          p.isJumping = false;
          onGround = true;
      }
      
      if (p.x < 0) p.x = 0;
      if (p.x + p.width > gameState.gameWidth) p.x = gameState.gameWidth - p.width;
      if (p.y < 0) {
          p.y = 0;
          p.velocityY = 0;
      }
      
      if (!onGround) {
          p.isJumping = true;
      }
  }

  function renderPlayer() {
      player.style.left = `${gameState.player.x}px`;
      player.style.top = `${gameState.player.y}px`;
      
      let sprite;
      if (gameState.sprites.currentAnimation === 'jump') {
          sprite = gameState.sprites.jump[gameState.sprites.currentDirection];
      } else {
          const animation = gameState.sprites[gameState.sprites.currentAnimation];
          sprite = animation[gameState.sprites.currentDirection][gameState.sprites.currentFrame];
      }
      
      player.src = sprite;
      
      if (gameState.animation.isWalking && !gameState.player.isJumping) {
          const bounce = Math.sin(gameState.animation.timer / gameState.animation.walkInterval * Math.PI) * 3;
          player.style.transform = `translateY(${-Math.abs(bounce)}px)`;
      } else {
          player.style.transform = 'translateY(0)';
      }
  }

  function gameLoop() {
      updatePlayer();
      updateAnimation();
      checkDoorProximity();
      renderPlayer();
      requestAnimationFrame(gameLoop);
  }

  gameLoop();
};