export const getExpirationColor = (daysLeft: number): string => {
    if (daysLeft <= 1) return "red";      // Critical
    if (daysLeft <= 3) return "orange";   // High Priority
    if (daysLeft <= 5) return "yellow";   // Warning
    if (daysLeft <= 10) return "green";   // Safe but nearing expiry
    return "gray";                        // No urgency
};