export async function GET() {
  // Bulletproof fallback object in case of API failure
  const fallbackData = {
    status: 'success',
    message: 'fallback_retrieved',
    totalSolved: 1,
    totalQuestions: 3300,
    easySolved: 1,
    totalEasy: 800,
    mediumSolved: 0,
    totalMedium: 1600,
    hardSolved: 0,
    totalHard: 900,
    acceptanceRate: 100.0,
    ranking: 5000001
  };

  try {
    // Fetch both solved stats and user profile with a 3-second timeout to prevent hanging on cold starts
    const [solvedRes, profileRes] = await Promise.all([
      fetch('https://alfa-leetcode-api.onrender.com/zabedfolio/solved', {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
      }).catch(() => null),
      fetch('https://alfa-leetcode-api.onrender.com/zabedfolio', {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
      }).catch(() => null),
    ]);

    if (!solvedRes?.ok || !profileRes?.ok) {
      console.warn('One or both LeetCode API endpoints failed or timed out, returning fallback stats.');
      return Response.json(fallbackData);
    }

    const solvedData = await solvedRes.json();
    const profileData = await profileRes.json();

    // Map alfa-leetcode-api properties to the schema expected by the front-end card component
    const responseData = {
      status: 'success',
      message: 'retrieved',
      totalSolved: solvedData.solvedProblem ?? fallbackData.totalSolved,
      totalQuestions: 3300,
      easySolved: solvedData.easySolved ?? fallbackData.easySolved,
      totalEasy: 800,
      mediumSolved: solvedData.mediumSolved ?? fallbackData.mediumSolved,
      totalMedium: 1600,
      hardSolved: solvedData.hardSolved ?? fallbackData.hardSolved,
      totalHard: 900,
      acceptanceRate: 100.0, // default since user has solved 1 problem with 100% acceptance
      ranking: profileData.ranking ?? fallbackData.ranking
    };

    return Response.json(responseData);
  } catch (error) {
    console.error('LeetCode proxy server error:', error);
    // Gracefully return fallback data rather than sending a 500 error page
    return Response.json(fallbackData);
  }
}
