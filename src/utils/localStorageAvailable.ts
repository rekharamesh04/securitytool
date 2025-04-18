export default function localStorageAvailable(): boolean {
    const testKey = 'emr-app';
    try {
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        // Use `unknown` type for the error and assert its type
        if (e instanceof DOMException) {
            console.error(e.message);
        }
        return false;
    }
}