export function loadGoogleMapsScript(key) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.visualization) {
      resolve();
      return;
    }

    const existingScript = document.querySelector('script[data-google-maps-loader="true"]');

    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=visualization`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsLoader = "true";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
