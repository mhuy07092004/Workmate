const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const updateApplicationStatus = async (applicationId, status) => {
    const token = localStorage.getItem('workmate_token')

    if (!token) {
        throw new Error('Not authenticated')
    }

    const response = await fetch(
        `${API_BASE_URL}/applications/${applicationId}/status`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        }
    )

    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Failed to update application status')
    }

    return response.json()
}

export const getStatusColor = (status) => {
    const statusColors = {
        applied: 'bg-blue-100 text-blue-800 border-blue-300',
        reviewing: 'bg-amber-100 text-amber-800 border-amber-300',
        shortlist: 'bg-purple-100 text-purple-800 border-purple-300',
        rejected: 'bg-red-100 text-red-800 border-red-300',
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
}

export const getStatusLabel = (status) => {
    const labels = {
        applied: 'Applied',
        reviewing: 'Reviewing',
        shortlist: 'Shortlisted',
        rejected: 'Rejected',
    }
    return labels[status] || status
}