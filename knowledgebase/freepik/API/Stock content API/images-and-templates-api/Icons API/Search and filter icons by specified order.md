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

# Icons API

> Search, retrieve, and download icons programmatically with the Freepik Icons API.

The Freepik Icons API lets you find and retrieve icons from our catalog with AI-powered search and download the assets for use in your applications.

### What you can do

* List icons with sorting and filters
* Get a single icon by ID
* Download an icon asset

### Authentication

All requests require an API key via the `x-freepik-api-key` header. See the [Quickstart](/quickstart) and [Authentication](/authentication).

### Endpoints

<div className="my-11">
  <Columns cols={2}>
    <Card title="GET /v1/icons" icon="code" href="/api-reference/icons/get-all-icons-by-order">
      List icons with sorting and filters
    </Card>

    <Card title="GET /v1/icons/{id}" icon="code" href="/api-reference/icons/get-one-icon-by-id">
      Retrieve a single icon by ID
    </Card>

    <Card title="GET /v1/icons/{id}/download" icon="code" href="/api-reference/icons/download-an-icon">
      Download an icon asset
    </Card>
  </Columns>
</div>

### Use cases

* Build an icon picker into your design tool or CMS
* AI-powered search by keyword and sort by popularity
* Programmatically download icons during build/deploy

### FAQ

#### Is there a rate limit?

Yes. See [Rate limits](/ratelimits).

#### What license applies to icons?

Refer to the [License agreement](https://www.freepik.com/legal/terms-of-use#api-services).

