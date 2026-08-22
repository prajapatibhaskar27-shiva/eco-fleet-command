/**
 * Dynamically loads the Google Maps JavaScript API.
 * Uses the VITE_GOOGLE_MAPS_API_KEY environment variable.
 * Returns the google.maps namespace once loaded.
 */

let googleMapsPromise: Promise<void> | null = null;

function getApiKey(): string {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key) {
    console.warn(
      "[Eco Fleet Command] Missing VITE_GOOGLE_MAPS_API_KEY environment variable. " +
      "Add it to your .env.local file. The map will fall back to a placeholder."
    );
    return "";
  }
  return key;
}

export function loadGoogleMaps(): Promise<void> {
  if (typeof google !== "undefined" && google.maps) return Promise.resolve();
  if (googleMapsPromise) return googleMapsPromise;

  const apiKey = getApiKey();
  if (!apiKey) {
    return Promise.reject(new Error("No Google Maps API key"));
  }

  googleMapsPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,places&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      googleMapsPromise = null;
      reject(new Error("Failed to load Google Maps API"));
    };
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

export function hasGoogleMapsKey(): boolean {
  return !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
}
