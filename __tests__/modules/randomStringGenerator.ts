export default function randomStringGenerator(length = 16, charset?: string) {
	const _charset = "abcdefghijklmnopqrstuvwxyz0123456789" || charset;

	let res = "";
	for (let i = 0; i < length; i++) {
		const randIndex = Math.floor(Math.random() * _charset.length);
		res += _charset[randIndex];
	}

	return res;
}
