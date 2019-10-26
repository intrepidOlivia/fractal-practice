function test_translate() {
	const testVector = [[0, 1], [2, 3], [4, 5], [5, 6]];
	const testModifier = [4, -5];

	const translated = translate(testVector, testModifier);
	console.assert(translated[0][0] === 4);
	console.assert(translated[0][1] === -4);
}