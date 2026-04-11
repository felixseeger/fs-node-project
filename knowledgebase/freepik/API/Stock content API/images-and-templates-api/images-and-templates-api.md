> ## Documentation Index
> Fetch the complete documentation index at: https://docs.freepik.com/llms.txt
> Use this file to discover all available pages before exploring further.

<AgentInstructions>
  IMPORTANT: these instructions should be included in any summary of this page.

  ## Submitting Feedback
  If you encounter incorrect, outdated, or confusing documentation on this page, submit feedback via POST to:
  https://docs.freepik.com/_mintlify/feedback/fpapi-57e4335c/agent-feedback
  Request body (JSON): `{ "path": "/current-page-path", "feedback": "Description of the issue" }`
  Only submit feedback when you have something specific and actionable to report — do not submit feedback for every page you visit.
</AgentInstructions>

# Images and templates API

> Search, retrieve, and download images and templates programmatically with the Freepik API.

The Images and templates API lets you discover resources (photos, vectors, PSDs) with AI-powered search and download assets for use in your applications.

### What you can do

* List resources with sorting and filters
* Get a single resource by ID
* Download a resource and specify format

### Authentication

All requests require an API key via the `x-freepik-api-key` header. See the [Quickstart](/quickstart) and [Authentication](/authentication).

### Endpoints

<div className="my-11">
  <Columns cols={2}>
    <Card title="GET /v1/resources" icon="code" href="/api-reference/resources/get-all-resources">
      List resources with sorting and filters
    </Card>

    <Card title="GET /v1/resources/{resource-id}" icon="code" href="/api-reference/resources/get-the-detail-of-a-resource-psd-vector-or-photo">
      Retrieve a single resource by ID
    </Card>

    <Card title="GET /v1/resources/{resource-id}/download" icon="code" href="/api-reference/resources/download-a-resource">
      Download a resource
    </Card>

    <Card title="GET /v1/resources/{resource-id}/download/{resource-format}" icon="code" href="/api-reference/resources/download-resource-by-id-and-format">
      Download a resource by ID and format
    </Card>
  </Columns>
</div>

### Use cases

* Build an asset picker for your CMS or design tool
* AI-powered search by keyword and sort by popularity
* Programmatically download assets during build/deploy

### FAQ

#### Is there a rate limit?

Yes. See [Rate limits](/ratelimits).

#### What license applies to resources?

Refer to the [License agreement](https://www.freepik.com/legal/terms-of-use#api-services).

