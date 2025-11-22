// 金融投资分析平台 - 主要JavaScript文件

// 全局变量
let particleSystem;
let charts = {};
let marketData = {};
let updateInterval;

// 模拟金融数据
const financialData = {
    dxy: {
        current: 103.45,
        change: 0.23,
        changePercent: 0.22,
        history: generateHistoricalData(103.45, 100),
        volume: 1250000
    },
    qqq: {
        current: 485.20,
        change: 2.15,
        changePercent: 0.45,
        history: generateHistoricalData(485.20, 100),
        volume: 28500000
    },
    spy: {
        current: 578.90,
        change: -1.25,
        changePercent: -0.22,
        history: generateHistoricalData(578.90, 100),
        volume: 45600000
    },
    eem: {
        current: 42.85,
        change: 0.35,
        changePercent: 0.82,
        history: generateHistoricalData(42.85, 100),
        volume: 8900000
    }
};

// 生成历史数据
function generateHistoricalData(basePrice, count) {
    const data = [];
    let price = basePrice;
    const now = new Date();
    
    for (let i = count - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 60000); // 每分钟数据
        price += (Math.random() - 0.5) * basePrice * 0.01; // 1%范围内的随机波动
        data.push({
            time: date,
            price: Math.round(price * 100) / 100,
            volume: Math.floor(Math.random() * 1000000) + 500000
        });
    }
    
    return data;
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initParticleSystem();
    initCharts();
    startDataUpdates();
    initEventListeners();
    initScrollAnimations();
});

// 初始化粒子系统
function initParticleSystem() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    new p5(function(p) {
        let particles = [];
        const numParticles = 50;
        
        p.setup = function() {
            const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
            canvas.parent('particles-canvas');
            
            // 创建粒子
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-0.5, 0.5),
                    vy: p.random(-0.5, 0.5),
                    size: p.random(2, 6),
                    opacity: p.random(0.3, 0.8)
                });
            }
        };
        
        p.draw = function() {
            p.clear();
            
            // 更新和绘制粒子
            particles.forEach(particle => {
                // 更新位置
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // 边界检查
                if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
                
                // 绘制粒子
                p.fill(255, 184, 0, particle.opacity * 255);
                p.noStroke();
                p.circle(particle.x, particle.y, particle.size);
                
                // 绘制连接线
                particles.forEach(other => {
                    const distance = p.dist(particle.x, particle.y, other.x, other.y);
                    if (distance < 100) {
                        p.stroke(255, 184, 0, (1 - distance / 100) * 50);
                        p.strokeWeight(1);
                        p.line(particle.x, particle.y, other.x, other.y);
                    }
                });
            });
        };
        
        p.windowResized = function() {
            p.resizeCanvas(window.innerWidth, window.innerHeight);
        };
    });
}

// 初始化图表
function initCharts() {
    // 迷你图表
    initMiniChart('dxy-mini-chart', financialData.dxy.history, '#FFB800');
    initMiniChart('qqq-mini-chart', financialData.qqq.history, '#3B82F6');
    initMiniChart('spy-mini-chart', financialData.spy.history, '#10B981');
    initMiniChart('eem-mini-chart', financialData.eem.history, '#8B5CF6');
    
    // 主要图表
    initMainChart('dxy-chart', '美元指数 (DXY)', financialData.dxy.history, '#FFB800');
    initMainChart('qqq-chart', '纳指100 (QQQ)', financialData.qqq.history, '#3B82F6');
    initMainChart('spy-chart', '标普500 (SPY)', financialData.spy.history, '#10B981');
    initComparisonChart('emerging-chart');
}

// 初始化迷你图表
function initMiniChart(containerId, data, color) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const chart = echarts.init(container);
    
    const option = {
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        },
        xAxis: {
            type: 'category',
            show: false,
            data: data.map((_, index) => index)
        },
        yAxis: {
            type: 'value',
            show: false
        },
        series: [{
            type: 'line',
            data: data.map(item => item.price),
            smooth: true,
            symbol: 'none',
            lineStyle: {
                color: color,
                width: 2
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: color + '40' },
                        { offset: 1, color: color + '10' }
                    ]
                }
            }
        }]
    };
    
    chart.setOption(option);
    charts[containerId] = chart;
}

// 初始化主要图表
function initMainChart(containerId, title, data, color) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const chart = echarts.init(container);
    
    const option = {
        title: {
            text: title,
            textStyle: {
                color: '#ffffff',
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: color,
            textStyle: {
                color: '#ffffff'
            },
            formatter: function(params) {
                const data = params[0];
                return `时间: ${data.axisValue}<br/>价格: $${data.value.toFixed(2)}`;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.map((_, index) => {
                const time = new Date(data[index].time);
                return time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
            }),
            axisLine: {
                lineStyle: {
                    color: '#8B9DC3'
                }
            },
            axisLabel: {
                color: '#8B9DC3'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#8B9DC3'
                }
            },
            axisLabel: {
                color: '#8B9DC3',
                formatter: '${value}'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(139, 157, 195, 0.2)'
                }
            }
        },
        series: [{
            type: 'line',
            data: data.map(item => item.price),
            smooth: true,
            symbol: 'none',
            lineStyle: {
                color: color,
                width: 3
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: color + '40' },
                        { offset: 1, color: color + '10' }
                    ]
                }
            }
        }]
    };
    
    chart.setOption(option);
    charts[containerId] = chart;
}

// 初始化对比图表
function initComparisonChart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const chart = echarts.init(container);
    
    const option = {
        title: {
            text: '新兴市场ETF对比',
            textStyle: {
                color: '#ffffff',
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            textStyle: {
                color: '#ffffff'
            }
        },
        legend: {
            data: ['EEM', 'VWO', 'IEMG'],
            textStyle: {
                color: '#ffffff'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月'],
            axisLine: {
                lineStyle: {
                    color: '#8B9DC3'
                }
            },
            axisLabel: {
                color: '#8B9DC3'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#8B9DC3'
                }
            },
            axisLabel: {
                color: '#8B9DC3',
                formatter: '${value}'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(139, 157, 195, 0.2)'
                }
            }
        },
        series: [
            {
                name: 'EEM',
                type: 'line',
                data: [40.2, 41.1, 42.0, 41.8, 42.5, 42.85],
                smooth: true,
                lineStyle: { color: '#8B5CF6' },
                symbol: 'circle',
                symbolSize: 6
            },
            {
                name: 'VWO',
                type: 'line',
                data: [45.1, 45.8, 46.2, 46.0, 46.8, 47.2],
                smooth: true,
                lineStyle: { color: '#06B6D4' },
                symbol: 'circle',
                symbolSize: 6
            },
            {
                name: 'IEMG',
                type: 'line',
                data: [52.3, 53.1, 53.8, 53.5, 54.2, 54.8],
                smooth: true,
                lineStyle: { color: '#10B981' },
                symbol: 'circle',
                symbolSize: 6
            }
        ]
    };
    
    chart.setOption(option);
    charts[containerId] = chart;
}

// 开始数据更新
function startDataUpdates() {
    updateData(); // 立即更新一次
    
    updateInterval = setInterval(() => {
        updateData();
    }, 5000); // 每5秒更新一次
}

// 更新数据
function updateData() {
    // 模拟实时数据变化
    Object.keys(financialData).forEach(key => {
        const data = financialData[key];
        const change = (Math.random() - 0.5) * data.current * 0.002; // 0.2%范围内的变化
        
        data.current = Math.round((data.current + change) * 100) / 100;
        data.change = Math.round(change * 100) / 100;
        data.changePercent = Math.round((change / data.current) * 10000) / 100;
        
        // 更新历史数据
        data.history.shift();
        data.history.push({
            time: new Date(),
            price: data.current,
            volume: Math.floor(Math.random() * 1000000) + 500000
        });
    });
    
    // 更新UI
    updatePriceDisplay();
    updateCharts();
    
    // 触发动画效果
    animatePriceChanges();
}

// 更新价格显示
function updatePriceDisplay() {
    // 更新主要价格显示
    document.getElementById('dxy-price').textContent = financialData.dxy.current.toFixed(2);
    document.getElementById('qqq-price').textContent = '$' + financialData.qqq.current.toFixed(2);
    document.getElementById('spy-price').textContent = '$' + financialData.spy.current.toFixed(2);
    document.getElementById('eem-price').textContent = '$' + financialData.eem.current.toFixed(2);
    
    // 更新涨跌幅
    updateChangeDisplay('dxy-change', financialData.dxy.change, financialData.dxy.changePercent);
    updateChangeDisplay('qqq-change', financialData.qqq.change, financialData.qqq.changePercent);
    updateChangeDisplay('spy-change', financialData.spy.change, financialData.spy.changePercent);
    updateChangeDisplay('eem-change', financialData.eem.change, financialData.eem.changePercent);
}

// 更新涨跌幅显示
function updateChangeDisplay(elementId, change, percent) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const sign = change >= 0 ? '+' : '';
    element.textContent = `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
    element.className = change >= 0 ? 'text-sm font-mono price-up' : 'text-sm font-mono price-down';
}

// 更新图表
function updateCharts() {
    // 更新迷你图表
    Object.keys(charts).forEach(chartId => {
        const chart = charts[chartId];
        if (chart && chartId.includes('mini')) {
            let dataKey = '';
            if (chartId.includes('dxy')) dataKey = 'dxy';
            else if (chartId.includes('qqq')) dataKey = 'qqq';
            else if (chartId.includes('spy')) dataKey = 'spy';
            else if (chartId.includes('eem')) dataKey = 'eem';
            
            if (dataKey && financialData[dataKey]) {
                const data = financialData[dataKey].history;
                chart.setOption({
                    series: [{
                        data: data.map(item => item.price)
                    }]
                });
            }
        }
    });
}

// 价格变动动画
function animatePriceChanges() {
    const priceElements = document.querySelectorAll('[id$="-price"]');
    
    priceElements.forEach(element => {
        // 添加脉冲动画
        element.classList.add('data-pulse');
        
        // 2秒后移除动画类
        setTimeout(() => {
            element.classList.remove('data-pulse');
        }, 2000);
    });
}

// 初始化事件监听器
function initEventListeners() {
    // 筛选器事件
    const marketFilter = document.getElementById('market-filter');
    const timeframeFilter = document.getElementById('timeframe-filter');
    const updateFrequency = document.getElementById('update-frequency');
    
    if (marketFilter) {
        marketFilter.addEventListener('change', handleMarketFilterChange);
    }
    
    if (timeframeFilter) {
        timeframeFilter.addEventListener('change', handleTimeframeFilterChange);
    }
    
    if (updateFrequency) {
        updateFrequency.addEventListener('change', handleUpdateFrequencyChange);
    }
    
    // 窗口大小调整
    window.addEventListener('resize', handleWindowResize);
    
    // 导航菜单切换（移动端）
    const mobileMenuButton = document.querySelector('.md\\:hidden button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }
}

// 处理市场筛选器变化
function handleMarketFilterChange(event) {
    const selectedMarket = event.target.value;
    console.log('Market filter changed to:', selectedMarket);
    
    // 这里可以根据选择的市场更新图表数据
    // 暂时使用模拟数据，实际应用中应该从API获取对应市场的数据
    updateChartsForMarket(selectedMarket);
}

// 处理时间框架筛选器变化
function handleTimeframeFilterChange(event) {
    const selectedTimeframe = event.target.value;
    console.log('Timeframe filter changed to:', selectedTimeframe);
    
    // 根据选择的时间框架更新数据
    updateDataForTimeframe(selectedTimeframe);
}

// 处理更新频率变化
function handleUpdateFrequencyChange(event) {
    const selectedFrequency = event.target.value;
    console.log('Update frequency changed to:', selectedFrequency);
    
    // 清除当前的更新间隔
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    
    // 设置新的更新间隔
    let intervalMs = 5000; // 默认5秒
    
    switch (selectedFrequency) {
        case 'realtime':
            intervalMs = 1000; // 1秒
            break;
        case '5s':
            intervalMs = 5000; // 5秒
            break;
        case '30s':
            intervalMs = 30000; // 30秒
            break;
        case '1m':
            intervalMs = 60000; // 1分钟
            break;
    }
    
    updateInterval = setInterval(() => {
        updateData();
    }, intervalMs);
}

// 处理窗口大小调整
function handleWindowResize() {
    // 重新调整所有图表大小
    Object.keys(charts).forEach(chartId => {
        const chart = charts[chartId];
        if (chart) {
            chart.resize();
        }
    });
}

// 切换移动端菜单
function toggleMobileMenu() {
    // 这里可以实现移动端菜单的切换逻辑
    console.log('Mobile menu toggled');
}

// 根据市场更新图表
function updateChartsForMarket(market) {
    // 模拟不同市场的数据更新
    // 在实际应用中，这里应该从API获取对应市场的实时数据
    console.log('Updating charts for market:', market);
}

// 根据时间框架更新数据
function updateDataForTimeframe(timeframe) {
    // 模拟不同时间框架的数据更新
    console.log('Updating data for timeframe:', timeframe);
}

// 初始化滚动动画
function initScrollAnimations() {
    // 使用Intersection Observer实现滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.glass-card, .data-grid > div');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 工具函数：格式化数字
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// 工具函数：格式化货币
function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(num);
}

// 工具函数：格式化百分比
function formatPercent(num) {
    return (num * 100).toFixed(2) + '%';
}

// 导出主要函数供其他模块使用
window.FinancePro = {
    updateData,
    startDataUpdates,
    stopDataUpdates: () => {
        if (updateInterval) {
            clearInterval(updateInterval);
        }
    },
    getMarketData: () => financialData,
    charts
};