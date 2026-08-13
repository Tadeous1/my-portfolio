// Citi Bikes case study: all chart values are loaded from data/citi_bikes_summary.json, derived from the official public CSV source.
(() => {
    'use strict';

    const palette = {
        navy: '#0F172A',
        teal: '#14B8A6',
        tealDark: '#0F766E',
        sky: '#38BDF8',
        amber: '#F59E0B',
        slate: '#64748B',
        grid: 'rgba(100, 116, 139, 0.18)',
    };

    const chartDefaults = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label || context.label}: ${context.parsed.y ?? context.parsed}`,
                },
            },
        },
    };

    function chartTextColor() {
        return document.body.classList.contains('dark-mode') ? '#99F6E4' : palette.tealDark;
    }

    function renderCharts(data) {
        if (!window.Chart) return;

        const textColor = chartTextColor();
        const axis = {
            x: { ticks: { color: textColor }, grid: { color: palette.grid } },
            y: { ticks: { color: textColor }, grid: { color: palette.grid }, beginAtZero: true },
        };

        new Chart(document.getElementById('weekdayChart'), {
            type: 'bar',
            data: {
                labels: data.weekday_counts.map((item) => item.label.slice(0, 3)),
                datasets: [{
                    label: 'Rides',
                    data: data.weekday_counts.map((item) => item.value),
                    backgroundColor: palette.teal,
                    borderRadius: 8,
                    borderSkipped: false,
                }],
            },
            options: { ...chartDefaults, scales: axis },
        });

        new Chart(document.getElementById('memberMixChart'), {
            type: 'doughnut',
            data: {
                labels: data.member_mix.map((item) => item.label),
                datasets: [{
                    data: data.member_mix.map((item) => item.value),
                    backgroundColor: [palette.navy, palette.teal],
                    borderColor: '#FFFFFF',
                    borderWidth: 3,
                }],
            },
            options: { ...chartDefaults, cutout: '66%', plugins: { legend: { display: true, position: 'bottom', labels: { color: textColor, usePointStyle: true } } } },
        });

        new Chart(document.getElementById('stationChart'), {
            type: 'bar',
            data: {
                labels: data.top_start_stations.map((item) => item.label),
                datasets: [{
                    label: 'Starts',
                    data: data.top_start_stations.map((item) => item.value),
                    backgroundColor: [palette.navy, palette.tealDark, palette.teal, palette.sky, palette.amber, palette.slate],
                    borderRadius: 6,
                    borderSkipped: false,
                }],
            },
            options: {
                ...chartDefaults,
                indexAxis: 'y',
                scales: { x: axis.y, y: { ticks: { color: textColor }, grid: { display: false } } },
            },
        });

        new Chart(document.getElementById('durationChart'), {
            type: 'bar',
            data: {
                labels: data.duration_buckets.map((item) => item.label),
                datasets: [{
                    label: 'Rides',
                    data: data.duration_buckets.map((item) => item.value),
                    backgroundColor: [palette.tealDark, palette.teal, palette.sky, palette.amber],
                    borderRadius: 8,
                    borderSkipped: false,
                }],
            },
            options: { ...chartDefaults, scales: axis },
        });
    }

    async function initialiseCaseStudy() {
        const dataUrl = 'data/citi_bikes_summary.json';
        try {
            const response = await fetch(dataUrl);
            if (!response.ok) throw new Error(`Data request failed with ${response.status}`);
            const data = await response.json();
            document.querySelectorAll('[data-metric="rides"]').forEach((node) => { node.textContent = data.total_rides.toLocaleString(); });
            document.querySelectorAll('[data-metric="days"]').forEach((node) => { node.textContent = data.observed_days; });
            document.querySelectorAll('[data-metric="median"]').forEach((node) => { node.textContent = `${data.median_duration_minutes} min`; });
            document.querySelectorAll('[data-metric="subscriber-share"]').forEach((node) => { node.textContent = `${((data.member_mix[0].value / data.total_rides) * 100).toFixed(1)}%`; });
            document.querySelector('[data-window]').textContent = `${data.observed_start} → ${data.observed_end}`;
            renderCharts(data);
        } catch (error) {
            document.querySelector('[data-dashboard-error]').hidden = false;
            document.querySelector('[data-dashboard-error]').textContent = 'The dashboard data could not be loaded. Open the source file to review the verified extract.';
            console.error(error);
        }
    }

    document.addEventListener('DOMContentLoaded', initialiseCaseStudy, { once: true });
})();
