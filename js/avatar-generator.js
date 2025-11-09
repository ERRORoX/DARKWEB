// Avatar Generator for Hacker Profiles
// Генерирует уникальные аватары в стиле хакера для профилей

class HackerAvatarGenerator {
    constructor() {
        this.colors = {
            matrix: '#00ff41',
            cyan: '#00fff7',
            red: '#ff4444',
            blue: '#1fc3ff',
            purple: '#9d4edd',
            orange: '#ffaa44'
        };
    }

    // Генерация SVG аватара с матричным стилем
    generateMatrixAvatar(username, size = 200) {
        const hash = this.hashCode(username);
        const color = this.getColorFromHash(hash);
        const pattern = this.generateMatrixPattern(hash, size);
        
        return `
            <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad-${hash}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${this.darkenColor(color)};stop-opacity:0.8" />
                    </linearGradient>
                    <filter id="glow-${hash}">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <rect width="${size}" height="${size}" fill="#0a0a0a"/>
                ${pattern}
                <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 10}" 
                        fill="none" stroke="url(#grad-${hash})" 
                        stroke-width="2" filter="url(#glow-${hash})"/>
                <text x="${size/2}" y="${size/2 + 5}" 
                      font-family="monospace" font-size="${size/4}" 
                      fill="${color}" text-anchor="middle" 
                      font-weight="bold" filter="url(#glow-${hash})">
                      ${username.charAt(0).toUpperCase()}
                </text>
            </svg>
        `;
    }

    // Генерация ASCII арта для профиля
    generateAsciiAvatar(username) {
        const hash = this.hashCode(username);
        const style = hash % 4;
        
        const styles = {
            0: this.generateMatrixStyle(username),
            1: this.generateHackerStyle(username),
            2: this.generateTechStyle(username),
            3: this.generateDarkStyle(username)
        };
        
        return styles[style];
    }

    // Стиль матрицы
    generateMatrixStyle(username) {
        const initial = username.charAt(0).toUpperCase();
        return `
╔═══════════════════════╗
║                       ║
║      ██████╗          ║
║      ██╔══██╗         ║
║      ██████╔╝         ║
║      ██╔══██╗         ║
║      ██║  ██║         ║
║      ╚═╝  ╚═╝         ║
║                       ║
║         ${initial}          ║
║                       ║
╚═══════════════════════╝
        `.trim();
    }

    // Хакерский стиль
    generateHackerStyle(username) {
        const initial = username.charAt(0).toUpperCase();
        return `
┌───────────────────────┐
│  ╔═══╗ ╔═══╗ ╔═══╗   │
│  ║ ${initial} ║ ║ H ║ ║ X ║   │
│  ╚═══╝ ╚═══╝ ╚═══╝   │
│                       │
│   [ACCESS GRANTED]    │
│                       │
│   USER: ${username.padEnd(15).substring(0, 15)} │
│   STATUS: ONLINE      │
│                       │
└───────────────────────┘
        `.trim();
    }

    // Технический стиль
    generateTechStyle(username) {
        const initial = username.charAt(0).toUpperCase();
        return `
╭───────────────────────╮
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ▓                   ▓ │
│  ▓   ╔═════════╗    ▓ │
│  ▓   ║    ${initial}    ║    ▓ │
│  ▓   ╚═════════╝    ▓ │
│  ▓                   ▓ │
│  ▓  [SYSTEM USER]   ▓ │
│  ▓                   ▓ │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
╰───────────────────────╯
        `.trim();
    }

    // Темный стиль
    generateDarkStyle(username) {
        const initial = username.charAt(0).toUpperCase();
        return `
┏━━━━━━━━━━━━━━━━━━━━━┓
┃                     ┃
┃    ██╗  ██╗         ┃
┃    ██║  ██║         ┃
┃    ███████║         ┃
┃    ██╔══██║         ┃
┃    ██║  ██║         ┃
┃    ╚═╝  ╚═╝         ┃
┃                     ┃
┃        ${initial}          ┃
┃                     ┃
┗━━━━━━━━━━━━━━━━━━━━━┛
        `.trim();
    }

    // Генерация матричного паттерна
    generateMatrixPattern(hash, size) {
        const cells = 10;
        const cellSize = size / cells;
        let pattern = '';
        
        for (let i = 0; i < cells; i++) {
            for (let j = 0; j < cells; j++) {
                const value = (hash + i * cells + j) % 100;
                if (value > 70) {
                    const opacity = (value - 70) / 30;
                    pattern += `<rect x="${i * cellSize}" y="${j * cellSize}" 
                                   width="${cellSize}" height="${cellSize}" 
                                   fill="#00ff41" opacity="${opacity * 0.3}"/>`;
                }
            }
        }
        
        return pattern;
    }

    // Генерация CSS аватара с градиентом
    generateCSSAvatar(username) {
        const hash = this.hashCode(username);
        const color = this.getColorFromHash(hash);
        const darkColor = this.darkenColor(color);
        const initial = username.charAt(0).toUpperCase();
        
        return {
            background: `radial-gradient(circle at 30% 30%, ${color}, ${darkColor})`,
            color: color,
            boxShadow: `0 0 20px ${color}40, inset 0 0 20px ${darkColor}20`,
            border: `2px solid ${color}`,
            initial: initial
        };
    }

    // Генерация хеша из строки
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    // Получение цвета из хеша
    getColorFromHash(hash) {
        const colors = Object.values(this.colors);
        return colors[hash % colors.length];
    }

    // Затемнение цвета
    darkenColor(color) {
        // Простое затемнение для hex цветов
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, (num >> 16) - 30);
        const g = Math.max(0, ((num >> 8) & 0x00FF) - 30);
        const b = Math.max(0, (num & 0x0000FF) - 30);
        return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // Генерация профиля с эффектом сканирования
    generateScanAvatar(username, size = 200) {
        const hash = this.hashCode(username);
        const color = this.getColorFromHash(hash);
        const initial = username.charAt(0).toUpperCase();
        
        return `
            <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="scanGrad-${hash}" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:${color};stop-opacity:0" />
                        <stop offset="50%" style="stop-color:${color};stop-opacity:0.5" />
                        <stop offset="100%" style="stop-color:${color};stop-opacity:0" />
                    </linearGradient>
                    <filter id="glow-scan-${hash}">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <rect width="${size}" height="${size}" fill="#0a0a0a"/>
                <rect x="${size * 0.2}" y="${size * 0.2}" 
                      width="${size * 0.6}" height="${size * 0.6}" 
                      fill="none" stroke="${color}" stroke-width="2" 
                      stroke-dasharray="5,5" opacity="0.5"/>
                <circle cx="${size/2}" cy="${size/2}" r="${size/3}" 
                        fill="none" stroke="${color}" stroke-width="3" 
                        filter="url(#glow-scan-${hash})"/>
                <text x="${size/2}" y="${size/2 + size/12}" 
                      font-family="monospace" font-size="${size/3}" 
                      fill="${color}" text-anchor="middle" 
                      font-weight="bold" filter="url(#glow-scan-${hash})">
                      ${initial}
                </text>
                <rect x="0" y="0" width="${size}" height="${size}" 
                      fill="url(#scanGrad-${hash})" 
                      class="scan-line" opacity="0.3"/>
            </svg>
        `;
    }

    // Генерация глитч-аватара
    generateGlitchAvatar(username, size = 200) {
        const hash = this.hashCode(username);
        const color = this.getColorFromHash(hash);
        const initial = username.charAt(0).toUpperCase();
        
        return `
            <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="glitch-${hash}">
                        <feOffset in="SourceGraphic" dx="2" dy="0" result="offset1"/>
                        <feOffset in="SourceGraphic" dx="-2" dy="0" result="offset2"/>
                        <feComponentTransfer in="offset1">
                            <feFuncA type="discrete" tableValues="0 1"/>
                        </feComponentTransfer>
                        <feComponentTransfer in="offset2">
                            <feFuncR type="discrete" tableValues="0 1 0"/>
                            <feFuncB type="discrete" tableValues="1 0 1"/>
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode in="offset2"/>
                            <feMergeNode in="offset1"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <rect width="${size}" height="${size}" fill="#0a0a0a"/>
                <rect x="${size * 0.1}" y="${size * 0.1}" 
                      width="${size * 0.8}" height="${size * 0.8}" 
                      fill="none" stroke="${color}" stroke-width="2"/>
                <text x="${size/2}" y="${size/2 + size/12}" 
                      font-family="monospace" font-size="${size/3}" 
                      fill="${color}" text-anchor="middle" 
                      font-weight="bold" filter="url(#glitch-${hash})">
                      ${initial}
                </text>
            </svg>
        `;
    }
}

// Экспорт для использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HackerAvatarGenerator;
}

// Глобальный доступ
window.HackerAvatarGenerator = HackerAvatarGenerator;


