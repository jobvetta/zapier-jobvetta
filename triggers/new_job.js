const jobOutputFields = [
  { key: "id", label: "ID", type: "string" },
  { key: "job_id", label: "Job ID", type: "string" },
  { key: "title", label: "Job Title", type: "string" },
  { key: "company", label: "Company", type: "string" },
  { key: "location", label: "Location", type: "string" },
  { key: "work_model", label: "Work Model", type: "string" },
  { key: "employment_type", label: "Employment Type", type: "string" },
  { key: "salary", label: "Disclosed Salary", type: "string" },
  { key: "url", label: "Jobvetta Job URL", type: "string" },
];

const jobSample = {
  id: "6abebf061838202552cae216_loc0",
  job_id: "6abebf061838202552cae216_loc0",
  title: "Senior Data Engineer",
  company: "Datadog",
  location: "New York, New York, United States",
  work_model: "Hybrid",
  employment_type: "Full-time",
  salary: "$165,000 - $210,000 / year",
  url: "https://www.jobvetta.com/jobs/6abebf061838202552cae216_loc0",
};

const perform = async (z, bundle) => {
  const endpoint = bundle.inputData.remote
    ? "https://api.jobvetta.com/v1/jobs/remote"
    : "https://api.jobvetta.com/v1/jobs";

  const params = {
    days: bundle.inputData.days || 7,
    limit: 25,
  };
  if (bundle.inputData.q) params.q = bundle.inputData.q;
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
  }));
};

module.exports = {
  key: "new_job",
  noun: "Job",
  display: {
    label: "New Job Matching Search",
    description:
      "Triggers when a new verified employer career-site job posting matches your search filters.",
  },
  operation: {
    type: "polling",
    inputFields: [
      {
        key: "q",
        label: "Role or Keyword",
        type: "string",
        required: false,
        helpText:
          "Filter by job title, skill, or company keyword (for example, Data Engineer or Rust).",
      },
      {
        key: "location",
        label: "Location",
        type: "string",
        required: false,
        helpText:
          "Filter by city, state, or country (for example, San Francisco, London, or United States).",
      },
      {
        key: "remote",
        label: "Remote Only",
        type: "boolean",
        required: false,
        helpText: "Set to true to trigger only on remote-eligible job openings.",
      },
      {
        key: "days",
        label: "Posted Within Days",
        type: "integer",
        required: false,
        default: "7",
        helpText: "Only include openings published within the last N days (1 to 90).",
      },
    ],
    perform,
    sample: jobSample,
    outputFields: jobOutputFields,
  },
};
