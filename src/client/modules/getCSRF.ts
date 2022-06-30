export default function getCSRF() {
	const value = `; ${document.cookie}`;
	const parts = value.split("; _csrf=");
	if (parts.length === 2) return parts.pop()?.split("; ").shift();
}
