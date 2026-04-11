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

# Videos API

> Search, retrieve, and download videos programmatically with the Freepik Videos API.

The Freepik Videos API lets you discover video resources with AI-powered search and download the assets for use in your applications.

### What you can do

* List videos with sorting and filters
* Get a single video by ID
* Download a video asset

### Authentication

All requests require an API key via the `x-freepik-api-key` header. See the [Quickstart](/quickstart) and [Authentication](/authentication).

### Endpoints

<div className="my-11">
  <Columns cols={2}>
    <Card title="GET /v1/videos" icon="code" href="/api-reference/videos/get-all-videos-by-order">
      List videos with sorting and filters
    </Card>

    <Card title="GET /v1/videos/{id}" icon="code" href="/api-reference/videos/get-one-video-by-id">
      Retrieve a single video by ID
    </Card>

    <Card title="GET /v1/videos/{id}/download" icon="code" href="/api-reference/videos/download-an-video">
      Download a video asset
    </Card>
  </Columns>
</div>

### Use cases

* Build a video picker for your CMS
* AI-powered search by keyword and sort by popularity
* Programmatically download videos during build/deploy

### FAQ

#### Is there a rate limit?

Yes. See [Rate limits](/ratelimits).

#### What license applies to videos?

Refer to the [License agreement](https://www.freepik.com/legal/terms-of-use#api-services).

