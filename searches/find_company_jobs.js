const perform = async (z, bundle) => {
  const company = String(bundle.inputData.company || "").trim();
  const encodedCompany = encodeURIComponent(company);
  const params = {
    limit: bundle.inputData.limit || 25,
  };
  if (bundle.inputData.q) params.q = bundle.inputData.q;
  if (bundle.inputData.location) params.location = bundle.inputData.location;

  const response = await z.request({
    url: `https://api.jobvetta.com/v1/companies/${encodedCompany}/jobs`,
    method: "GET",
    params,
  });

  const data = response.data || {};
  const jobs = Array.isArray(data.jobs) ? data.jobs : [];
  if (!data.total && jobs.length === 0) {
    return [];
  }

  return [
    {
      company_query: company,
      total_open_jobs: Number(data.total || jobs.length),
      sample_count: jobs.length,
      top_job_id: jobs[0] ? String(jobs[0].job_id) : "",
      top_job_title: jobs[0] ? String(jobs[0].title || "") : "",
      top_job_location: jobs[0] ? String(jobs[0].location || "") : "",
      top_job_url: jobs[0] ? String(jobs[0].url || "") : "",
      jobs: jobs.map((j) => ({
        job_id: String(j.job_id),
        title: j.title || "",
        company: j.company || company,
        location: j.location || "",
        work_model: j.work_model || "",
        employment_type: j.employment_type || "",
        salary: j.salary || "",
        url: j.url || "",
      })),
    },
  ];
};

module.exports = {
  key: "find_company_jobs",
  noun: "Company Hiring Signal",
  display: {
    label: "Find Company Hiring Signals",
    description:
      "Finds active job openings and hiring velocity counts for a specific employer.",
  },
  operation: {
    inputFields: [
      {
        key: "company",
        label: "Company Name",
        type: "string",
        required: true,
        helpText:
          "Employer name to look up (for example, Datadog, Cisco Systems, or Stripe).",
      },
      {
        key: "q",
        label: "Role or Department Filter",
        type: "string",
        required: false,
        helpText:
          "Optional keyword filter within the company openings (for example, Security or Sales).",
      },
      {
        key: "location",
        label: "Location",
        type: "string",
        required: false,
        helpText: "Optional city, state, or country filter.",
      },
      {
        key: "limit",
        label: "Maximum Openings Returned",
        type: "integer",
        required: false,
        default: "25",
        helpText: "Number of open roles to include in the jobs list (1 to 25 on Free tier).",
      },
    ],
    perform,
    sample: {
      company_query: "Datadog",
      total_open_jobs: 412,
      sample_count: 1,
      top_job_id: "6abebf061838202552cae216_loc0",
      top_job_title: "Senior Data Engineer",
      top_job_location: "New York, New York, United States",
      top_job_url: "https://www.jobvetta.com/jobs/6abebf061838202552cae216_loc0",
      jobs: [
        {
          job_id: "6abebf061838202552cae216_loc0",
          title: "Senior Data Engineer",
          company: "Datadog",
          location: "New York, New York, United States",
          work_model: "Hybrid",
          employment_type: "Full-time",
          salary: "$165,000 - $210,000 / year",
          url: "https://www.jobvetta.com/jobs/6abebf061838202552cae216_loc0",
        },
      ],
    },
    outputFields: [
      { key: "company_query", label: "Company Query", type: "string" },
      { key: "total_open_jobs", label: "Total Open Jobs", type: "integer" },
      { key: "sample_count", label: "Returned Jobs Count", type: "integer" },
      { key: "top_job_id", label: "Top Job ID", type: "string" },
      { key: "top_job_title", label: "Top Job Title", type: "string" },
      { key: "top_job_location", label: "Top Job Location", type: "string" },
      { key: "top_job_url", label: "Top Job URL", type: "string" },
      { key: "jobs[]job_id", label: "Jobs Job ID", type: "string" },
      { key: "jobs[]title", label: "Jobs Title", type: "string" },
      { key: "jobs[]company", label: "Jobs Company", type: "string" },
      { key: "jobs[]location", label: "Jobs Location", type: "string" },
      { key: "jobs[]work_model", label: "Jobs Work Model", type: "string" },
      { key: "jobs[]employment_type", label: "Jobs Employment Type", type: "string" },
      { key: "jobs[]salary", label: "Jobs Salary", type: "string" },
      { key: "jobs[]url", label: "Jobs URL", type: "string" },
    ],
  },
};
