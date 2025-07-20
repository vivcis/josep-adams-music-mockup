function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        

        updateNavigation(screenId);
    }
}

function updateNavigation(screenId) {
    const currentScreen = document.getElementById(screenId);
    if (!currentScreen) return;
    
    const navItems = currentScreen.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    let activeIndex = 0;
    switch(screenId) {
        case 'signup-screen':
        case 'create-account-screen':
        case 'login-screen':
            activeIndex = 0; 
            break;
        case 'shop-screen':
            activeIndex = 1; 
            break;
        case 'forum-screen':
            activeIndex = 2;
            break;
        case 'music-screen':
            activeIndex = 3; 
            break;
        case 'profile-screen':
        case 'settings-screen':
        case 'logout-screen':
            activeIndex = 4; 
            break;
    }
    
    if (navItems[activeIndex]) {
        navItems[activeIndex].classList.add('active');
    }
}

let isPlaying = false;
let currentTime = 154; 
const totalTime = 252; 
let progressInterval;

function togglePlayPause() {
    const playBtn = document.querySelector('.play-btn i');
    
    if (isPlaying) {
        playBtn.className = 'fas fa-play';
        isPlaying = false;
        clearInterval(progressInterval);
    } else {
        playBtn.className = 'fas fa-pause';
        isPlaying = true;
        updateProgress();
    }
}

function updateProgress() {
    if (isPlaying) {
        progressInterval = setInterval(() => {
            if (currentTime < totalTime) {
                currentTime += 1;
                const progressPercent = (currentTime / totalTime) * 100;
                const progressBar = document.querySelector('.progress');
                if (progressBar) {
                    progressBar.style.width = progressPercent + '%';
                }
                const minutes = Math.floor(currentTime / 60);
                const seconds = currentTime % 60;
                const timeString = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
                const timeDisplay = document.querySelector('.time-info span:first-child');
                if (timeDisplay) {
                    timeDisplay.textContent = timeString;
                }
            } else {
                const playBtn = document.querySelector('.play-btn i');
                if (playBtn) {
                    playBtn.className = 'fas fa-play';
                }
                isPlaying = false;
                currentTime = 0;
                const progressBar = document.querySelector('.progress');
                if (progressBar) {
                    progressBar.style.width = '0%';
                }
                const timeDisplay = document.querySelector('.time-info span:first-child');
                if (timeDisplay) {
                    timeDisplay.textContent = '0:00';
                }
                clearInterval(progressInterval);
            }
        }, 1000);
    }
}

function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ff3b30';
            isValid = false;
        } else {
            input.style.borderColor = 'var(--border-color)';
        }
    });
    
    return isValid;
}
function addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function simulateNetworkRequest(callback, delay = 1000) {
    // Show loading state
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        if (btn.textContent.includes('Login') || btn.textContent.includes('Sign Up')) {
            btn.textContent = 'Loading...';
            btn.disabled = true;
        }
    });
    
    setTimeout(() => {
        buttons.forEach(btn => {
            btn.disabled = false;
            if (btn.textContent === 'Loading...') {
                btn.textContent = btn.textContent.includes('Login') ? 'Login' : 'Sign Up';
            }
        });
        callback();
    }, delay);
}

let startX = 0;
let startY = 0;

function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
    if (!startX || !startY) return;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    const diffX = startX - endX;
    const diffY = startY - endY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        const currentScreen = document.querySelector('.screen.active');
        const screenId = currentScreen.id;
        
        if (diffX > 0) {
            navigateToNextScreen(screenId);
        } else {
            navigateToPreviousScreen(screenId);
        }
    }
    
    startX = 0;
    startY = 0;
}

function navigateToNextScreen(currentScreenId) {
    const screenOrder = [
        'signup-screen', 'create-account-screen', 'login-screen', 
        'profile-screen', 'settings-screen', 'logout-screen',
        'shop-screen', 'forum-screen', 'music-screen'
    ];
    
    const currentIndex = screenOrder.indexOf(currentScreenId);
    const nextIndex = (currentIndex + 1) % screenOrder.length;
    showScreen(screenOrder[nextIndex]);
}

function navigateToPreviousScreen(currentScreenId) {
    const screenOrder = [
        'signup-screen', 'create-account-screen', 'login-screen', 
        'profile-screen', 'settings-screen', 'logout-screen',
        'shop-screen', 'forum-screen', 'music-screen'
    ];
    
    const currentIndex = screenOrder.indexOf(currentScreenId);
    const prevIndex = currentIndex === 0 ? screenOrder.length - 1 : currentIndex - 1;
    showScreen(screenOrder[prevIndex]);
}

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.nav-item')) {
            const navItem = e.target.closest('.nav-item');
            const icon = navItem.querySelector('i');
            
            if (icon.classList.contains('fa-home')) {
                showScreen('signup-screen');
            } else if (icon.classList.contains('fa-shopping-bag')) {
                showScreen('shop-screen');
            } else if (icon.classList.contains('fa-comments')) {
                showScreen('forum-screen');
            } else if (icon.classList.contains('fa-music')) {
                showScreen('music-screen');
            } else if (icon.classList.contains('fa-user')) {
                showScreen('profile-screen');
            }
        }
        
        if (e.target.closest('.settings-item')) {
            const settingsItem = e.target.closest('.settings-item');
            settingsItem.style.background = 'rgba(255, 45, 146, 0.1)';
            setTimeout(() => {
                settingsItem.style.background = '';
            }, 200);
        }
        
        if (e.target.closest('.product-card')) {
            const card = e.target.closest('.product-card');
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        }
        
        if (e.target.closest('.action-btn')) {
            const btn = e.target.closest('.action-btn');
            const icon = btn.querySelector('i');
            
            if (icon.classList.contains('fa-heart')) {
                icon.style.color = icon.style.color === 'var(--accent-pink)' ? '' : 'var(--accent-pink)';
               
                const countSpan = btn.textContent.trim().split(' ')[1];
                const newCount = icon.style.color === 'var(--accent-pink)' ? 
                    parseInt(countSpan) + 1 : parseInt(countSpan) - 1;
                btn.innerHTML = `<i class="fas fa-heart"></i> ${newCount}`;
            }
        }
        
        if (e.target.matches('button, .nav-item, .settings-item, .product-card, .action-btn')) {
            addRippleEffect(e.target, e);
        }
    });
    
    //form submission handling
    document.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = e.target;
        
        if (validateForm(form)) {
            simulateNetworkRequest(() => {
                //handle form submission
                if (form.closest('#signup-screen')) {
                    showScreen('create-account-screen');
                } else if (form.closest('#create-account-screen')) {
                    showScreen('login-screen');
                } else if (form.closest('#login-screen')) {
                    showScreen('profile-screen');
                }
            });
        }
    });
    
    document.addEventListener('change', function(e) {
        if (e.target.matches('.toggle-switch input')) {
            // Haptic feedback simulation
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }
    });
    
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowLeft':
                const currentScreen = document.querySelector('.screen.active');
                navigateToPreviousScreen(currentScreen.id);
                break;
            case 'ArrowRight':
                const currentScreen2 = document.querySelector('.screen.active');
                navigateToNextScreen(currentScreen2.id);
                break;
            case ' ':
                if (document.querySelector('.screen.active').id === 'music-screen') {
                    e.preventDefault();
                    togglePlayPause();
                }
                break;
        }
    });
    
    showScreen('signup-screen');
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

function updateVolume(value) {
    const volumeLevel = document.querySelector('.volume-level');
    if (volumeLevel) {
        volumeLevel.style.width = value + '%';
    }
}

document.addEventListener('click', function(e) {
    if (e.target.closest('.progress-bar')) {
        const progressBar = e.target.closest('.progress-bar');
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = (clickX / rect.width) * 100;
        
        currentTime = Math.floor((percentage / 100) * totalTime);
        const progress = progressBar.querySelector('.progress');
        if (progress) {
            progress.style.width = percentage + '%';
        }
        
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        const timeString = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
        const timeDisplay = document.querySelector('.time-info span:first-child');
        if (timeDisplay) {
            timeDisplay.textContent = timeString;
        }
    }
});

function saveFormData(formId, data) {
    localStorage.setItem(formId, JSON.stringify(data));
}

function loadFormData(formId) {
    const data = localStorage.getItem(formId);
    return data ? JSON.parse(data) : null;
}

document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const formId = form.closest('.screen').id;
        const savedData = loadFormData(formId);
        
        if (savedData) {
            Object.keys(savedData).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = savedData[key];
                }
            });
        }
    });
});