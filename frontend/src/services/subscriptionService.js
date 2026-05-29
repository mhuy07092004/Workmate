const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Fetch user's subscription tier
 * @param {number} userId - User ID
 * @returns {Promise<{tier: string, limit: number}>} Subscription tier and recommendation limit
 */
export async function getUserSubscriptionTier(userId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/subscriptions/user/${userId}`
        )

        if (!response.ok) {
            // Default to free tier if no subscription found
            return { tier: 'free', limit: 10 }
        }

        const data = await response.json()
        const subscription = data?.subscription

        if (!subscription) {
            return { tier: 'free', limit: 10 }
        }

        // Premium users get unlimited (high number), free users get 10
        const tier = subscription.tier
        const limit = tier === 'premium' ? 100 : 10

        return { tier, limit }
    } catch (error) {
        console.error('Failed to fetch subscription:', error)
        // Default to free tier on error
        return { tier: 'free', limit: 10 }
    }
}

/**
 * Get recommendation limit based on subscription
 * @param {string} tier - Subscription tier ('free' or 'premium')
 * @returns {number} Maximum recommendations to fetch
 */
export function getRecommendationLimit(tier) {
    return tier === 'premium' ? 100 : 10
}