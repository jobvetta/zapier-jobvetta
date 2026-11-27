const testAuth = async (z, bundle) => {
  const response = await z.request({
    url: "https://api.jobvetta.com/v1/usage",
    method: "GET",
  });
  return response.data;
};

const includeBearerToken = (request, z, bundle) => {
  if (bundle.authData && bundle.authData.api_key) {
    const raw = String(bundle.authData.api_key).trim();
    request.headers.Authorization = raw.toLowerCase().startsWith("bearer ")
      ? raw
      : `Bearer ${raw}`;
  }
  request.headers.Accept = "application/json";
  return request;
};

module.exports = {
  config: {
    type: "custom",
    fields: [
      {
        key: "api_key",
        label: "API Key",
        type: "password",
        required: true,
        helpText:
          "Generate a free API key (25 requests/day) on the [Jobvetta API page](https://www.jobvetta.com/api) and paste your `jvk_...` key here.",
      },
    ],
    test: testAuth,
    connectionLabel: "Jobvetta ({{bundle.inputData.plan}} plan)",
  },
  befores: [includeBearerToken],
  afters: [],
};
