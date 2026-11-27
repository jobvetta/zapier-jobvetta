const perform = async (z, bundle) => {
  const endpoint = bundle.inputData.remote
    ? "https://api.jobvetta.com/v1/jobs/remote"
    : "https://api.jobvetta.com/v1/jobs";

  const params = {
    q: bundle.inputData.q,
    days: bundle.inputData.days || 30,
    limit: bundle.inputData.limit || 10,
  };
  if (bundle.inputData.location) params.location = bundle.inputData.location;

  const response = await z.request({
    url: endpoint,
    method: "GET",
    params,
  });

  const jobs = Array.isArray(response.data && response.data.jobs)
    ? response.data.jobs
    : [];

  return jobs.map((job) => ({
    id: String(job.job_id),
    job_id: String(job.job_id),
    title: job.title || "",
    company: job.company || "",
    location: job.location || "",
    work_model: job.work_model || "",
    employment_type: job.employment_type || "",
    salary: job.salary || "",
    url: job.url || "",
    total_matches: Number(response.data.total || jobs.length),
  }));
};

module.exports = {
  key: "find_jobs",
  noun: "Job",
  display: {
    label: "Find Jobs",
    description:
      "Finds live verified employer job postings matching a role keyword, location, or remote filter.",
  },
  operation: {
    inputFields: [
      {
        key: "q",
        label: "Role or Keyword",
        type: "string",
        required: true,
        helpText:
          "Role title, skill, or keyword to search (for example, Senior Product Manager or Python).",
      },
      {
        key: "location",
        label: "Location",
        type: "string",
        required: false,
        helpText: "Optional city, state, or country filter.",
      },
      {
        key: "remote",
        label: "Remote Only",
        type: "boolean",
        required: false,
        helpText: "Set to true to return only remote-eligible job openings.",
      },
      {
        key: "days",
        label: "Posted Within Days",
        type: "integer",
        required: false,
        default: "30",
        helpText: "Restrict results to jobs published within the last N days (1 to 365).",
      },
      {
        key: "limit",
        label: "Maximum Results",
        type: "integer",
        required: false,
        default: "10",
        helpText: "Number of matching jobs to return (1 to 25 on Free tier, up to 100 on paid plans).",
      },
    ],
    perform,
    sample: {
      id: "6abebf061838202552cae216_loc0",
      job_id: "6abebf061838202552cae216_loc0",
      title: "Senior Data Engineer",
      company: "Datadog",
      location: "New York, New York, United States",
      work_model: "Hybrid",
      employment_type: "Full-time",
      salary: "$165,000 - $210,000 / year",
      url: "https://www.jobvetta.com/jobs/6abebf061838202552cae216_loc0",
      total_matches: 412,
    },
    outputFields: [
      { key: "id", label: "ID", type: "string" },
      { key: "job_id", label: "Job ID", type: "string" },
      { key: "title", label: "Job Title", type: "string" },
      { key: "company", label: "Company", type: "string" },
      { key: "location", label: "Location", type: "string" },
      { key: "work_model", label: "Work Model", type: "string" },
      { key: "employment_type", label: "Employment Type", type: "string" },
      { key: "salary", label: "Disclosed Salary", type: "string" },
      { key: "url", label: "Jobvetta Job URL", type: "string" },
      { key: "total_matches", label: "Total Matching Jobs", type: "integer" },
    ],
  },
};
