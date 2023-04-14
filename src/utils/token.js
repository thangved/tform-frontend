const tokenName = "@tform/token";

class Token {
	static get token() {
		return typeof window !== "undefined" && localStorage.getItem(tokenName);
	}

	static set token(_token) {
		typeof window !== "undefined" &&
			localStorage.setItem(tokenName, _token);
	}
}

export default Token;
