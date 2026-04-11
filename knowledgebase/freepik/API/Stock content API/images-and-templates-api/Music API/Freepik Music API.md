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

# Freepik Music API

> Search, filter, and download royalty-free music from the Freepik Music catalog via the Freepik API.

The Freepik Music API gives you programmatic access to the Freepik Music catalog. Search music by keyword, filter by genre and mood, and download audio files for use in your applications.

### What you can do

* Search music with full-text queries across titles and tags
* Filter by genre, mood, premium status, and creation date
* Sort results by relevance, popularity, creation date, duration, or tempo
* Get detailed music metadata including artist biography, download stats, and playlist count
* Download music audio files via CDN-hosted URLs

### Authentication

All requests require an API key via the `x-freepik-api-key` header. See the [Quickstart](/quickstart) and [Authentication](/authentication).

### Endpoints

<div className="my-11">
  <Columns cols={2}>
    <Card title="GET /v1/music" icon="code" href="/api-reference/music/search-music">
      Search and filter music
    </Card>

    <Card title="GET /v1/music/{music-id}" icon="code" href="/api-reference/music/get-music-by-id">
      Get detailed music information by ID
    </Card>

    <Card title="GET /v1/music/{music-id}/download" icon="code" href="/api-reference/music/download-music">
      Download a music audio file
    </Card>
  </Columns>
</div>

### Parameters overview

The search endpoint supports the following filters:

| Parameter         | Type      | Description                                                                                                                                                                                                                                 |
| ----------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`               | `string`  | Full-text search across titles and tags                                                                                                                                                                                                     |
| `genre`           | `string`  | Filter by genre name, comma-separated (e.g., `"Electronic,Ambient"`)                                                                                                                                                                        |
| `mood`            | `string`  | Filter by mood tag, comma-separated (e.g., `"Happy,Energetic"`)                                                                                                                                                                             |
| `include-premium` | `boolean` | Include premium content (default: `false`)                                                                                                                                                                                                  |
| `time_range`      | `string`  | Filter by creation date: `"7d"`, `"30d"`, or `"90d"`                                                                                                                                                                                        |
| `order_by`        | `string`  | Sort order: `"relevance"`, `"popularity"`, `"-popularity"`, `"created_at"`, `"-created_at"`, `"title"`, `"-title"`, `"seconds"`, `"-seconds"`, `"bpm"`, `"-bpm"`. Defaults to `"relevance"` when `q` is provided, `"-popularity"` otherwise |
| `limit`           | `integer` | Results per page: 1-1000 (default: `10`)                                                                                                                                                                                                    |
| `offset`          | `integer` | Pagination offset (default: `0`)                                                                                                                                                                                                            |

### Use cases

* Build a music browser or audio picker into your app or CMS
* Search music by genre and mood for video or podcast background music
* Programmatically download royalty-free music during content production pipelines
* Create curated playlists filtered by popularity, tempo, or release date

### FAQ

#### Is there a rate limit?

Yes. See [Rate limits](/ratelimits).

#### What license applies to the music?

Refer to the [License agreement](https://www.freepik.com/legal/terms-of-use#api-services).

#### What audio format is the music available in?

Music is delivered as audio files via CDN-hosted download URLs.

#### Can I filter for only free music?

Yes. Set `include-premium` to `false` (the default) to return only free music.

