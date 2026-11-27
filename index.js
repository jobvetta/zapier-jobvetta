const {
  config: authentication,
  befores = [],
  afters = [],
} = require("./authentication");

const newJobTrigger = require("./triggers/new_job");
const findJobsSearch = require("./searches/find_jobs");
const findCompanyJobsSearch = require("./searches/find_company_jobs");
const estimateSalarySearch = require("./searches/estimate_salary");
const findJobByIdSearch = require("./searches/find_job_by_id");

module.exports = {
  version: require("./package.json").version,
  platformVersion: require("zapier-platform-core").version,

  flags: {
    cleanInputData: false,
  },

  authentication,
  beforeRequest: [...befores],
  afterResponse: [...afters],

  triggers: {
    [newJobTrigger.key]: newJobTrigger,
  },

  searches: {
    [findJobsSearch.key]: findJobsSearch,
    [findCompanyJobsSearch.key]: findCompanyJobsSearch,
    [estimateSalarySearch.key]: estimateSalarySearch,
    [findJobByIdSearch.key]: findJobByIdSearch,
  },

  creates: {},
  resources: {},
};
