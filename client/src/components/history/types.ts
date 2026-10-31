export type Metric = {
    metric: string;
    label: string;
    unit: string;
    count: number;
    mean: number | null;
    min: number | null;
    max: number | null;
};

export type Month = {
    month: string;
    readings: number;
    days_observed: number;
    spike_readings: number;
    matches_420: number;
    [key: string]: number | string | null;
};

export type Reading = {
    id: string | null;
    timestamp: number | null;
    recorded_at: string | null;
    aqi_2_5: number | null;
    aqi_10_0: number | null;
    pm_2_5: number | null;
    pm_10_0: number | null;
    temperature: number | null;
    humidity: number | null;
};

export type HistoryReport = {
    source: string;
    generated: string;
    timezone: string;
    spike_threshold: number;
    totals: {
        readings: number;
        days_observed: number;
        aqi_2_5_count: number;
        aqi_2_5_mean: number | null;
        aqi_2_5_max: number | null;
        aqi_2_5_median: number | null;
        aqi_2_5_p95: number | null;
        spike_readings: number;
    };
    quality: {
        source_rows: number;
        invalid_timestamps: number;
        undated_420: number;
        total_420: number;
    };
    metrics: Metric[];
    monthly: Month[];
    categories: { band: number; readings: number }[];
    spikes: Reading[];
};

export type ArchivePage = {
    page: number;
    pages: number;
    total: number;
    timezone: string;
    rows: Reading[];
};

export type SpikeGroup = {
    aqi: number;
    count: number;
    path: string;
};

export type SpikePage = {
    rows: Reading[];
};
