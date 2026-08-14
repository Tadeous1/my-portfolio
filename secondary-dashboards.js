// Secondary dashboards: values are loaded from verified summary JSON files; no synthetic metrics are generated in the browser.
(() => {
    'use strict';

    const palette = { navy: '#0F172A', teal: '#14B8A6', tealDark: '#0F766E', sky: '#38BDF8', amber: '#F59E0B', slate: '#64748B', grid: 'rgba(100, 116, 139, 0.18)' };

    const money = (value) => `£${(value / 1000000).toFixed(2)}m`;
    const metric = (name, value) => document.querySelectorAll(`[data-metric="${name}"]`).forEach((node) => { node.textContent = value; });
    const chartTextColor = () => document.body.classList.contains('dark-mode') ? '#99F6E4' : palette.tealDark;
    const baseOptions = () => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${context.dataset.label || context.label}: ${context.parsed.y ?? context.parsed}` } } },
    });
    const axes = () => ({
        x: { ticks: { color: chartTextColor() }, grid: { color: palette.grid } },
        y: { ticks: { color: chartTextColor() }, grid: { color: palette.grid }, beginAtZero: true },
    });

    function renderOlympics(data) {
        metric('records', data.records.toLocaleString());
        metric('sports', data.sports);
        metric('countries', data.countries);
        metric('medals', Object.values(data.medal_totals).reduce((sum, value) => sum + value, 0).toLocaleString());
        new Chart(document.getElementById('olympicMedalsChart'), { type: 'bar', data: { labels: data.top_medal_countries.map((item) => item.label), datasets: [{ label: 'Total medals', data: data.top_medal_countries.map((item) => item.value), backgroundColor: palette.teal, borderRadius: 7, borderSkipped: false }] }, options: { ...baseOptions(), scales: axes() } });
        new Chart(document.getElementById('olympicSexChart'), { type: 'doughnut', data: { labels: data.sex_mix.map((item) => item.label), datasets: [{ data: data.sex_mix.map((item) => item.value), backgroundColor: [palette.navy, palette.teal], borderColor: '#FFFFFF', borderWidth: 3 }] }, options: { ...baseOptions(), cutout: '66%', plugins: { legend: { display: true, position: 'bottom', labels: { color: chartTextColor(), usePointStyle: true } } } } });
        new Chart(document.getElementById('olympicSportsChart'), { type: 'bar', data: { labels: data.top_sports.map((item) => item.label), datasets: [{ label: 'Athlete entries', data: data.top_sports.map((item) => item.value), backgroundColor: [palette.navy, palette.tealDark, palette.teal, palette.sky, palette.amber, palette.slate], borderRadius: 7, borderSkipped: false }] }, options: { ...baseOptions(), indexAxis: 'y', scales: { x: axes().y, y: { ticks: { color: chartTextColor() }, grid: { display: false } } } } });
    }

    function renderEnergy(data) {
        metric('latest-year', data.latest_year);
        metric('solar-latest', `${data.latest_values_twh.Solar.toLocaleString()} TWh`);
        metric('wind-latest', `${data.latest_values_twh.Wind.toLocaleString()} TWh`);
        metric('hydro-latest', `${data.latest_values_twh.Hydropower.toLocaleString()} TWh`);
        const labels = data.checkpoints.map((item) => item.year);
        new Chart(document.getElementById('energyTrendChart'), { type: 'line', data: { labels, datasets: [{ label: 'Solar', data: data.checkpoints.map((item) => item.solar), borderColor: palette.amber, backgroundColor: palette.amber, tension: 0.28 }, { label: 'Wind', data: data.checkpoints.map((item) => item.wind), borderColor: palette.sky, backgroundColor: palette.sky, tension: 0.28 }, { label: 'Hydropower', data: data.checkpoints.map((item) => item.hydropower), borderColor: palette.tealDark, backgroundColor: palette.tealDark, tension: 0.28 }] }, options: { ...baseOptions(), plugins: { legend: { display: true, position: 'bottom', labels: { color: chartTextColor(), usePointStyle: true } } }, scales: axes() } });
        new Chart(document.getElementById('energyLatestChart'), { type: 'bar', data: { labels: ['Solar', 'Wind', 'Hydropower'], datasets: [{ label: 'TWh', data: [data.latest_values_twh.Solar, data.latest_values_twh.Wind, data.latest_values_twh.Hydropower], backgroundColor: [palette.amber, palette.sky, palette.tealDark], borderRadius: 7, borderSkipped: false }] }, options: { ...baseOptions(), scales: axes() } });
    }

    function renderSales(data) {
        metric('revenue', money(data.revenue_gbp));
        metric('customers', data.customers.toLocaleString());
        metric('invoices', data.invoices.toLocaleString());
        metric('cancelled', data.cancelled_line_items.toLocaleString());
        new Chart(document.getElementById('salesMonthChart'), { type: 'bar', data: { labels: data.top_months.map((item) => item.label), datasets: [{ label: 'Revenue', data: data.top_months.map((item) => item.value), backgroundColor: palette.teal, borderRadius: 7, borderSkipped: false }] }, options: { ...baseOptions(), scales: axes() } });
        new Chart(document.getElementById('salesCountryChart'), { type: 'bar', data: { labels: data.top_countries.map((item) => item.label), datasets: [{ label: 'Revenue', data: data.top_countries.map((item) => item.value), backgroundColor: palette.navy, borderRadius: 7, borderSkipped: false }] }, options: { ...baseOptions(), indexAxis: 'y', scales: { x: axes().y, y: { ticks: { color: chartTextColor() }, grid: { display: false } } } } });
        new Chart(document.getElementById('salesProductChart'), { type: 'bar', data: { labels: data.top_products.map((item) => item.label), datasets: [{ label: 'Revenue', data: data.top_products.map((item) => item.value), backgroundColor: palette.amber, borderRadius: 7, borderSkipped: false }] }, options: { ...baseOptions(), indexAxis: 'y', scales: { x: axes().y, y: { ticks: { color: chartTextColor(), font: { size: 10 } }, grid: { display: false } } } } });
    }

    function renderSnack(data) {
        metric('records', data.records.toLocaleString());
        metric('average-spend', `₦${data.average_spend_ngn.toFixed(2)}`);
        metric('satisfaction', data.average_satisfaction.toFixed(2));
        metric('unknowns', data.unknown_cells.toLocaleString());
        new Chart(document.getElementById('snackPreferenceChart'), { type: 'bar', data: { labels: data.preferred_snacks.map((item) => item.label), datasets: [{ label: 'Responses', data: data.preferred_snacks.map((item) => item.value), backgroundColor: palette.teal, borderRadius: 7, borderSkipped: false }] }, options: { ...baseOptions(), indexAxis: 'y', scales: { x: axes().y, y: { ticks: { color: chartTextColor(), font: { size: 10 } }, grid: { display: false } } } } });
        new Chart(document.getElementById('snackFrequencyChart'), { type: 'doughnut', data: { labels: data.purchase_frequency.map((item) => item.label), datasets: [{ data: data.purchase_frequency.map((item) => item.value), backgroundColor: [palette.navy, palette.teal, palette.sky, palette.amber], borderColor: '#FFFFFF', borderWidth: 3 }] }, options: { ...baseOptions(), cutout: '62%', plugins: { legend: { display: true, position: 'bottom', labels: { color: chartTextColor(), usePointStyle: true } } } } });
        new Chart(document.getElementById('snackBudgetChart'), { type: 'bar', data: { labels: data.budget_categories.map((item) => item.label), datasets: [{ label: 'Respondents', data: data.budget_categories.map((item) => item.value), backgroundColor: [palette.tealDark, palette.teal, palette.sky, palette.amber], borderRadius: 7, borderSkipped: false }] }, options: { ...baseOptions(), scales: axes() } });
        new Chart(document.getElementById('snackSatisfactionChart'), { type: 'bar', data: { labels: data.satisfaction_distribution.map((item) => item.label), datasets: [{ label: 'Responses', data: data.satisfaction_distribution.map((item) => item.value), backgroundColor: palette.navy, borderRadius: 7, borderSkipped: false }] }, options: { ...baseOptions(), scales: axes() } });
    }

    async function init() {
        const type = document.body.dataset.dashboard;
        const files = { olympics: 'data/olympics_summary.json', energy: 'data/energy_summary.json', sales: 'data/sales_summary.json', snack: 'data/snack_summary.json' };
        if (!type || !files[type]) return;
        try {
            const response = await fetch(files[type]);
            if (!response.ok) throw new Error(`Dashboard data request failed with ${response.status}`);
            const data = await response.json();
            if (type === 'olympics') renderOlympics(data);
            if (type === 'energy') renderEnergy(data);
            if (type === 'sales') renderSales(data);
            if (type === 'snack') renderSnack(data);
        } catch (error) {
            const errorNode = document.querySelector('[data-dashboard-error]');
            if (errorNode) { errorNode.hidden = false; errorNode.textContent = 'The dashboard data could not be loaded. Review the linked source notes for the verified dataset.'; }
            console.error(error);
        }
    }

    document.addEventListener('DOMContentLoaded', init, { once: true });
})();
