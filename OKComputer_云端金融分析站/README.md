# FinancePro – Global Investment Analytics Platform

## Project Overview
FinancePro is a production-grade, real-time financial dashboard built on the Cloudflare free tier. It tracks the **U.S. Dollar Index (DXY)**, **NASDAQ-100**, **S&P 500** and major **EM ETFs**, while generating AI-driven trade ideas and risk-managed model portfolios.

## Core Features

### 🎯 Real-Time Market Monitor
- **DXY** – live quote, change, volume  
- **Flagship ETFs** – QQQ (NASDAQ-100), SPY (S&P 500), EEM/VWO (emerging markets)  
- **Tech-indicators** – RSI, MACD, Bollinger, MA cross-overs, refreshed every tick  
- **Multi-time-frame** – 1 D / 1 W / 1 M / 3 M / 1 Y snapshots

### 📊 AI Investment Assistant
- **Risk-profile quiz** – 6 questions → custom risk score  
- **Smart asset-allocation** – mean-variance optimisation plus tail-risk parity  
- **Market brief** – auto-generated multi-asset commentary  
- **Strategy builder** – long/short equity, sector-rotation, risk-parity models

### 💼 Virtual Portfolio
- **Universe** – 5 000+ U.S., HK, CN A-share and FX instruments  
- **Real-time P/L** – delta, beta-adjusted, Sharpe, max-draw-down  
- **Risk engine** – VaR (95 %, 99 %), stress test, correlation heat-map  
- **Back-test** – 1 M to 5 Y walk-forward with turnover and slippage

### 🌐 Multi-Asset Coverage
- **U.S.** – Dow, NASDAQ, S&P 500, Russell 2k  
- **HK / China** – HSI, HSCEI, CSI 300, ChiNext  
- **FX** – G10 + EM pairs, DXY basket  
- **Funds** – ETF league-tables, premium/discount tracker

## Tech Highlights

### 🎨 Modern UI
- Dark trading-desk theme  
- Glass-morphism cards  
- 100 % responsive (mobile → 4 K)  
- 60 fps animations via Anime.js

### 📈 Visualisation
- ECharts 5 – candle-stick, depth, heat-map, custom themes  
- Web-Socket push – smooth redraw, no flicker  
- Brush & zoom – intra-day drill-down  
- Multi-axis – price vs volume vs derived signals

### ⚡ Speed
- Cloudflare CDN (200+ POPs)  
- Lazy-loaded images + dynamic `import()`  
- Aggressive cache + stale-while-revalidate  
- First paint &lt; 1.2 s on 4 G

### 🔧 Stack
- **Front-end**: vanilla ES 2022, Tailwind CSS 3  
- **Charts**: ECharts 5  
- **Animation**: Anime.js, p5.js, PIXI.js for particle hero  
- **Build**: Vite (dev) + Cloudflare Pages (prod)

## Page Map
| File | Purpose |
|------|---------|
| `index.html` | Hero particles + at-a-glance tiles |
| `analysis.html` | AI strategist & multi-asset tech dashboard |
| `portfolio.html` | Virtual portfolio builder & back-tester |
| `about.html` | Docs, FAQ, legal |

## Quick Deploy (Cloudflare Pages)
1. Fork repo  
2. Connect to Pages → "Upload assets" → drag ZIP  
3. Hit "Deploy" → instant HTTPS URL  
4. *(Optional)* add Web-Socket env-var for real-time feed

## Browser Support
Chrome 90+, Firefox 88+, Safari 14+, Edge 90+  
Mobile: iOS Safari 14+, Chrome Android 90+

