export interface RouteStep {
    latitude: number;
    longitude: number;
}

export const getRoute = async (
    startLat: number,
    startLon: number,
    endLat: number,
    endLon: number
): Promise<RouteStep[]> => {
    try {
        const response = await fetch(
            `http://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`
        );
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
            const coordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => ({
                latitude: coord[1],
                longitude: coord[0],
            }));
            return coordinates;
        }
        return [];
    } catch (error) {
        console.error('Routing error:', error);
        return [];
    }
};
