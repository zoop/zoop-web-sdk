const gatewayModes = Object.freeze({
	POPUP: "POPUP",
	TAB: "TAB",
	REDIRECT: "REDIRECT",
});

const SDK_VERSION = "4.3.0";

(function () {
	var options = {
		eSignV4URL: "https://esign.zoop.one",
		digilockerV1URL: "https://gateway.zoop.one/digilocker/v1",
		livenessV1URL: "https://gateway.zoop.one/liveness/init",
		studentSDKV1URL:
			"https://gateway.zoop.one/student-verification-sdk/request_id",
		ocrSDKV1URL: "https://gateway.zoop.one/ocr/init",
		zoopModel: window.document.getElementById("zoop-gateway-model"),
		zoopWindow: null,
	};

	var styles = {
		zoopGateWayModel: {
			display: "none" /* Hidden by default */,
			position: "fixed" /* Stay in place */,
			"z-index": 1 /* Sit on top */,
			left: 0,
			top: 0,
			width: "100%" /* Full width */,
			height: "100%" /* Full height */,
			overflow: "auto" /* Enable scroll if needed */,
			"background-color": "rgba(0, 0, 0, 0.4)" /* Fallback color */,
		},
		zoopModelContent: {
			"border-radius": "10px",
			"background-color": "#fefefe",
			"margin-top": "50px" /* 15% from the top and centered */,
			"margin-bottom": "auto",
			"margin-left": "auto",
			"margin-right": "auto",
			padding: " -1px",
			width: "700px" /* Could be more or less, depending on screen size */,
			height: "675px",
		},
		iframe: {
			"border-radius": "inherit",
			margin: "0px",
			padding: "0px",
			border: "none",
		},
	};

	// create a common namespace with options
	var zoop = {
		options: options,
		styles: styles,
		esignGatewayOptions: {
			gateway_url: "",
			transaction_id: "",
			show_download_btn: "Y",
			mode: "POPUP",
			zoomLevel: 2.0, // default zoom level
			version: "v5",
		},
		digilockerGatewayOption: {
			request_id: "",
			gatewayURL: options.digilockerV1URL,
			mode: gatewayModes.TAB,
		},
		livenessGatewayOption: {
			request_id: "",
			gatewayURL: options.livenessV1URL,
			mode: gatewayModes.REDIRECT,
		},
		studentSDKGatewayOption: {
			request_id: "",
			gatewayURL: options.studentSDKV1URL,
			mode: gatewayModes.REDIRECT,
		},
		ocrSDKGatewayOption: {
			request_id: "",
			gatewayURL: options.ocrSDKV1URL,
			mode: gatewayModes.REDIRECT,
		},
	};

	zoop.check = function (json, paramCheck) {
		if (json.hasOwnProperty(paramCheck)) {
			if (zoop.isNullUndefinedOrEmpty(json[paramCheck])) {
				return true;
			} else {
				return paramCheck === "undefined" ||
					paramCheck === null ||
					paramCheck.length === 0
					? false
					: true;
			}
		} else {
			return false;
		}
	};

	zoop.onError = function onError() {};
	zoop.onSuccess = function onSuccess() {};

	zoop.isNullUndefinedOrEmpty = function (paramCheck) {
		return (
			typeof paramCheck === "undefined" ||
			paramCheck === null ||
			paramCheck.length === 0
		);
	};

	zoop.setEnvironment = function (env) {
		switch (env) {
			case "production":
				zoop.options.url = zoop.options.production;
				zoop.options.itdURL = zoop.options.itdProdURL;
				break;
			case "staging":
				zoop.options.url = zoop.options.staging;
				zoop.options.itdURL = zoop.options.itdStagingURL;
				break;
			default:
				break;
		}
	};

	zoop.setStyles = function (id, styles, type) {
		// set css of providing id
		let elementStyle;
		if (type == "class") {
			const element = document.getElementByClass(id);
			elementStyle = element && element.style;
		} else if (type == "id") {
			const element = document.getElementById(id);
			elementStyle = element && element.style;
		} else {
			elementStyle = document.getElementsByTagName(id);
		}
		if (elementStyle && Object.keys(styles).length) {
			for (var styleName in styles) {
				elementStyle[styleName] = styles[styleName];
			}
		}
	};

	zoop.eSignGatewayInit = function (gatewayOption) {
		zoop.esignGatewayOptions.show_download_btn = zoop.check(
			gatewayOption,
			"show_download_btn"
		)
			? gatewayOption.show_download_btn
			: zoop.esignGatewayOptions.show_download_btn;
		zoop.esignGatewayOptions.mode = zoop.check(gatewayOption, "mode")
			? gatewayOption.mode
			: zoop.esignGatewayOptions.mode;
		// zoom levels are form 1..7
		const MAX_ZOOM_LEVEL = 7;
		zoop.esignGatewayOptions.zoomLevel = zoop.check(gatewayOption, "zoomLevel")
			? // only numbers between 0.8 to 2.0 should be sent in query params
			  Number.parseFloat(
					0.8 +
						(Math.max(
							Math.min(
								Number.parseInt(gatewayOption.zoomLevel),
								MAX_ZOOM_LEVEL
							),
							1
						) -
							1) *
							0.2
			  ).toFixed(1)
			: zoop.esignGatewayOptions.zoomLevel;
		if (gatewayOption.version) {
			zoop.esignGatewayOptions.version = gatewayOption.version;
		}
		if (
			gatewayOption.mode &&
			gatewayOption.mode.toUpperCase() === gatewayModes.TAB
		) {
			zoop.esignGatewayOptions.mode = gatewayModes.TAB;
		} else if (
			gatewayOption.mode &&
			gatewayOption.mode.toUpperCase() === gatewayModes.REDIRECT
		) {
			zoop.esignGatewayOptions.mode = gatewayModes.REDIRECT;
		} else {
			zoop.esignGatewayOptions.mode = gatewayModes.POPUP;
		}

		zoop.options.zoopModel =
			window.document.getElementById("zoop-gateway-model");
		return true;
	};

	zoop.eSignGateway = function (transaction_id) {
		if (zoop.isNullUndefinedOrEmpty(transaction_id)) {
			throw new Error(
				"Gateway Transaction Id is mandatory to initiate gateway."
			);
		}
		zoop.esignGatewayOptions.transaction_id = transaction_id;
		zoop.esignGatewayOptions.gateway_url =
			zoop.options.eSignV4URL + `/${zoop.esignGatewayOptions.version}/viewer`;

		// By default the POPUP mode is chosen but for the v4 we don't support it
		// therefore it will be set to the TAB mode anyway.
		if (zoop.esignGatewayOptions.mode === gatewayModes.POPUP) {
			zoop.esignGatewayOptions.mode = gatewayModes.TAB;
		}

		let uri =
			"" +
			zoop.esignGatewayOptions.gateway_url +
			"/" +
			zoop.esignGatewayOptions.transaction_id +
			"?show_download_btn=" +
			zoop.esignGatewayOptions.show_download_btn +
			"&mode=" +
			zoop.esignGatewayOptions.mode +
			"&zoom_level=" +
			zoop.esignGatewayOptions.zoomLevel +
			"&v=" +
			SDK_VERSION;

		if (zoop.esignGatewayOptions.mode === gatewayModes.TAB) {
			if (zoop.options.zoopWindow == null || zoop.options.zoopWindow.closed) {
				zoop.options.zoopWindow = window.open(encodeURI(uri), "_blank");
			} else {
				zoop.options.zoopWindow.focus();
			}
		} else if (zoop.esignGatewayOptions.mode === gatewayModes.REDIRECT) {
			window.location = encodeURI(uri);
		} else if (zoop.esignGatewayOptions.mode === gatewayModes.POPUP) {
			window.document.getElementById("zoop-model-content").innerHTML =
				'<iframe id="zoop-gateway-iframe" height="100%" width="100%" src="' +
				encodeURI(uri) +
				'"></iframe>';
			zoop.options.zoopModel.style.display = "block";
		}
	};

	zoop.initDigilockerGateway = function initDigilockerGateway(
		gatewayOption = {}
	) {
		if (
			gatewayOption.mode &&
			gatewayOption.mode.toUpperCase() === gatewayModes.REDIRECT
		) {
			zoop.digilockerGatewayOption.mode = gatewayModes.REDIRECT;
		}
	};

	zoop.openDigilockerGateway = function openDigilockerGateway(request_id) {
		zoop.digilockerGatewayOption.request_id = request_id;

		const url = `${zoop.digilockerGatewayOption.gatewayURL}/start/${zoop.digilockerGatewayOption.request_id}?mode=${zoop.digilockerGatewayOption.mode}`;
		if (zoop.digilockerGatewayOption.mode === gatewayModes.REDIRECT) {
			window.location = encodeURI(url);
		}
		if (zoop.digilockerGatewayOption.mode === gatewayModes.TAB) {
			if (zoop.options.zoopWindow == null || zoop.options.zoopWindow.closed) {
				zoop.options.zoopWindow = window.open(encodeURI(url), "_blank");
			} else {
				zoop.options.zoopWindow.focus();
			}
		}
	};

	zoop.initLivenessGateway = function initLivenessGateway(gatewayOption = {}) {
		zoop.livenessGatewayOption.mode = gatewayOption.mode;
	};

	zoop.openLivenessGateway = function openLivenessGateway(request_id) {
		zoop.livenessGatewayOption.request_id = request_id;

		const url = `${zoop.livenessGatewayOption.gatewayURL}/${zoop.livenessGatewayOption.request_id}?mode=${zoop.livenessGatewayOption.mode}`;
		if (zoop.livenessGatewayOption.mode === gatewayModes.REDIRECT) {
			window.location = encodeURI(url);
			return;
		}
		throw new Error("only REDIRECT mode is supported");
	};

	zoop.initStudentSDKGateway = function initStudentSDKGateway(
		gatewayOption = {}
	) {
		zoop.studentSDKGatewayOption.mode = gatewayOption.mode;
	};

	zoop.openStudentSDKGateway = function openStudentSDKGateway(request_id) {
		zoop.studentSDKGatewayOption.request_id = request_id;

		const url = `${zoop.studentSDKGatewayOption.gatewayURL}/${zoop.studentSDKGatewayOption.request_id}/`;
		if (zoop.studentSDKGatewayOption.mode === gatewayModes.REDIRECT) {
			window.location = encodeURI(url);
			return;
		}
		throw new Error("only REDIRECT mode is supported");
	};

	zoop.initOcrSDKGateway = function initOcrSDKGateway(gatewayOption = {}) {
		zoop.ocrSDKGatewayOption.mode = gatewayOption.mode;
	};

	zoop.openOcrSDKGateway = function openOcrSDKGateway(request_id) {
		zoop.studentSDKGatewayOption.request_id = request_id;

		const url = `${zoop.ocrSDKGatewayOption.gatewayURL}/${zoop.ocrSDKGatewayOption.request_id}/`;
		if (zoop.ocrSDKGatewayOption.mode === gatewayModes.REDIRECT) {
			window.location = encodeURI(url);
			return;
		}
		throw new Error("only REDIRECT mode is supported");
	};

	const supportedEvents = {
		close: () => {},
		"consent-denied": () => {},
		"otp-error": () => {},
		"gateway-error": () => {},
		"esign-result": () => {},
		"esign-success": () => {},
		"esign-error": () => {},
		"itd-error": () => {},
		"digilocker-error": () => {},
		"digilocker-success": () => {},
		"liveness-success": () => {},
		"liveness-failure": () => {},
		"liveness-timeout": () => {},
		"liveness-error": () => {},
		"liveness-internal-server-error": () => {},
		"liveness-invalid-reqid": () => {},
		"liveness-session-expired": () => {},
	};

	zoop.on = function on(eventName = "", callback = () => {}) {
		if (typeof eventName !== "string") {
			throw new Error("Event name must be a string.");
		}
		if (typeof callback !== "function") {
			throw new Error("Callback must be a function.");
		}
		if (Object.keys(supportedEvents).includes(eventName)) {
			supportedEvents[eventName] = callback;
		} else {
			console.warn(`No event found named ${eventName}`);
		}
	};

	zoop.emit = function emit(event, data) {
		supportedEvents[event](data);
	};

	zoop.dispatchEvent = function (event) {
		let URLs = [
			zoop.options.url,
			zoop.options.production,
			zoop.options.staging,
			zoop.options.eSignV4URL,
			zoop.options.digilockerV1URL,
			zoop.options.livenessV1URL,
		];
		let message;
		if (!URLs.some((url) => url.startsWith(event.origin))) {
			return console.log("Message is not from Zoop Gateway");
		}
		if (event.data) {
			message = event.data;
		} else {
			return;
		}
		if (message.hasOwnProperty("action")) {
			switch (message.action) {
				case "close":
				case "consent-denied":
				case "otp-error":
				case "gateway-error":
				case "esign-result":
				case "esign-success":
				case "esign-error":
				case "digilocker-error":
				case "digilocker-success":
				case "liveness-failure":
				case "liveness-timeout":
				case "liveness-error":
				case "liveness-internal-server-error":
				case "liveness-invalid-reqid":
				case "liveness-session-expired":
					message.payload =
						typeof message.payload === "string"
							? JSON.parse(message.payload)
							: message.payload;
					zoop.options.zoopModel.style.display = "none";
					window.document.getElementById("zoop-model-content").innerHTML = "";
					// For tab based communication i.e., eSign, digilocker we are using window.open
					// which returns an window object to communication with postMessage()
					// calls.
					if (zoop.options.zoopWindow && !zoop.options.zoopWindow.closed) {
						zoop.options.zoopWindow.close();
					}
					zoop.emit(message.action, message);
					return;
				default: {
					console.warn("Unsupported event: ", message.action);
				}
			}
		}
	};

	// Set Default CSS
	zoop.setStyles("zoop-gateway-model", styles.zoopGateWayModel, "id");
	zoop.setStyles("zoop-model-content", styles.zoopModelContent, "id");
	// zoop.setStyles("zoop-gateway-iframe", styles.iframe, "id");

	window.addEventListener("message", zoop.dispatchEvent, false);
	window.zoop = zoop;
})();
