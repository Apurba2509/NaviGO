export interface LocationResult {
    latitude: number;
    longitude: number;
    displayName: string;
}

export const searchLocation = async (query: string): Promise<LocationResult | null> => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                query
            )}&format=json&limit=1`,
            {
                headers: {
                    'User-Agent': 'NaviGO/1.0',
                },
            }
        );
        const data = await response.json();

        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                displayName: data[0].display_name,
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
};
