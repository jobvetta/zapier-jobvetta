const perform = async (z, bundle) => {
  const jobId = encodeURIComponent(String(bundle.inputData.job_id || "").trim());
  const response = await z.request({
    url: `https://api.jobvetta.com/v1/jobs/${jobId}`,
    method: "GET",
    skipThrowForStatus: true,
  });

  if (response.status === 404) {
    return [];
  }
  if (response.status >= 400) {
    throw new z.errors.Error(
      `Jobvetta API returned HTTP ${response.status}`,
      "ApiError",
      response.status
    );
  }

  const job = response.data || {};
  return [
    {
      job_id: String(job.job_id || bundle.inputData.job_id),
      title: job.title || "",
      normalized_title: job.normalized_title || "",
      company: job.company || "",
      location: job.location || "",
      work_model: job.work_model || "",
      employment_type: job.employment_type || "",
      experience_level: job.experience_level || "",
      description: job.description || "",
      skills_required: Array.isArray(job.skills_required)
        ? job.skills_required.join(", ")
        : "",
      salary_min: job.salary_min ?? null,
      salary_max: job.salary_max ?? null,
      salary_currency: job.salary_currency || "",
      salary_rate_unit: job.salary_rate_unit || "",
      url: job.url || `https://www.jobvetta.com/jobs/${job.job_id}`,
      apply_url: job.apply_url || "",
    },
  ];
};

module.exports = {
  key: "find_job_by_id",
  noun: "Job Detail",
  display: {
    label: "Find Job by ID",
    description:
      "Finds full job description, qualifications, extracted skills, and compensation details by Job ID.",
  },
  operation: {
    inputFields: [
      {
        key: "job_id",
        label: "Job ID",
        type: "string",
        required: true,
        dynamic: "new_job.id.title",
        helpText:
          "Pass a `job_id` returned by New Job or Find Jobs (or `latest` to inspect a live sample job).",
      },
    ],
    perform,
    sample: {
      job_id: "6abebf061838202552cae216_loc0",
      title: "Senior Data Engineer",
      normalized_title: "Data Engineer",
      company: "Datadog",
      location: "New York, New York, United States",
      work_model: "Hybrid",
      employment_type: "Full-time",
      experience_level: "Senior",
      description: "Design and scale real-time telemetry data pipelines.",
      skills_required: "Python, Apache Spark, Kafka, SQL, AWS",
      salary_min: 165000,
      salary_max: 210000,
      salary_currency: "USD",
      salary_rate_unit: "YEAR",
      url: "https://www.jobvetta.com/jobs/6abebf061838202552cae216_loc0",
      apply_url: "https://careers.datadoghq.com/",
    },
    outputFields: [
      { key: "job_id", label: "Job ID", type: "string" },
      { key: "title", label: "Job Title", type: "string" },
      { key: "normalized_title", label: "Normalized Title", type: "string" },
      { key: "company", label: "Company", type: "string" },
      { key: "location", label: "Location", type: "string" },
      { key: "work_model", label: "Work Model", type: "string" },
      { key: "employment_type", label: "Employment Type", type: "string" },
      { key: "experience_level", label: "Experience Level", type: "string" },
      { key: "description", label: "Full Description", type: "string" },
      { key: "skills_required", label: "Required Skills", type: "string" },
      { key: "salary_min", label: "Minimum Salary", type: "number" },
      { key: "salary_max", label: "Maximum Salary", type: "number" },
      { key: "salary_currency", label: "Salary Currency", type: "string" },
      { key: "salary_rate_unit", label: "Salary Rate Unit", type: "string" },
      { key: "url", label: "Jobvetta Job URL", type: "string" },
      { key: "apply_url", label: "Direct Employer Apply URL", type: "string" },
    ],
  },
};
