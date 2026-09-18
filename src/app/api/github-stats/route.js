export async function GET() {
  try {
    const query = `
      query($userName:String!, $from: DateTime!, $to: DateTime!) {
        user(login: $userName) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          userName: process.env.GITHUB_USERNAME,
          from: '2026-01-01T00:00:00Z',
          to: '2026-12-31T23:59:59Z',
        },
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      throw new Error('GitHub API request failed');
    }

    const json = await response.json();

    const contributions =
      json?.data?.user?.contributionsCollection
        ?.contributionCalendar?.totalContributions || 0;

    return Response.json({ contributions });
  } catch (error) {
    return Response.json(
      {
        contributions: 0,
        error: 'Failed to fetch contributions',
      },
      { status: 500 }
    );
  }
}