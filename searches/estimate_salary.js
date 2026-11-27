const perform = async (z, bundle) => {
  const params = {
    q: bundle.inputData.q,
    days: bundle.inputData.days || 30,
  };
  if (bundle.inputData.location) params.location = bundle.inputData.location;

  const response = await z.request({
    url: "https://api.jobvetta.com/v1/jobs/salary-estimate",
    method: "GET",
    params,
  });

  const d = response.data || {};
  if (!d.total_matching_jobs) {
    return [];
  }

  return [
    {
      query: d.query || bundle.inputData.q,
      location: d.location || bundle.inputData.location || "Global",
      total_matching_jobs: Number(d.total_matching_jobs || 0),
      sampled_jobs: Number(d.sampled_jobs || 0),
      disclosed_salary_count: Number(d.disclosed_salary_count || 0),
      currency: d.currency || "USD",
      period: d.period || "YEAR",
      salary_min: d.salary_min ?? null,
      salary_p25: d.salary_p25 ?? null,
      salary_median: d.salary_median ?? null,
      salary_p75: d.salary_p75 ?? null,
      salary_max: d.salary_max ?? null,
    },
  ];
};

module.exports = {
  key: "estimate_salary",
  noun: "Salary Benchmark",
  display: {
    label: "Find Market Salary Benchmark",
    description:
      "Finds live P25, median (P50), and P75 base salary benchmarks from disclosed employer job postings.",
  },
  operation: {
    inputFields: [
      {
        key: "q",
        label: "Role Title",
        type: "string",
        required: true,
        helpText:
          "Role title or skill to benchmark (for example, Staff Software Engineer or Product Designer).",
      },
      {
        key: "location",
        label: "Location",
        type: "string",
        required: false,
        helpText: "Optional city, state, or country filter (for example, United States).",
      },
      {
        key: "days",
        label: "Posted Within Days",
        type: "integer",
        required: false,
        default: "30",
        helpText: "Recency window in days (1 to 365, default 30).",
      },
    ],
    perform,
    sample: {
      query: "Senior Data Engineer",
      location: "United States",
      total_matching_jobs: 1840,
      sampled_jobs: 500,
      disclosed_salary_count: 312,
      currency: "USD",
      period: "YEAR",
      salary_min: 125000,
      salary_p25: 155000,
      salary_median: 180000,
      salary_p75: 210000,
      salary_max: 275000,
    },
    outputFields: [
      { key: "query", label: "Role Query", type: "string" },
      { key: "location", label: "Location", type: "string" },
      { key: "total_matching_jobs", label: "Total Matching Jobs", type: "integer" },
      { key: "sampled_jobs", label: "Sampled Jobs", type: "integer" },
      { key: "disclosed_salary_count", label: "Disclosed Salary Count", type: "integer" },
      { key: "currency", label: "Currency", type: "string" },
      { key: "period", label: "Pay Period", type: "string" },
      { key: "salary_min", label: "Minimum Salary", type: "integer" },
      { key: "salary_p25", label: "25th Percentile Salary (P25)", type: "integer" },
      { key: "salary_median", label: "Median Salary (P50)", type: "integer" },
      { key: "salary_p75", label: "75th Percentile Salary (P75)", type: "integer" },
      { key: "salary_max", label: "Maximum Salary", type: "integer" },
    ],
  },
};
