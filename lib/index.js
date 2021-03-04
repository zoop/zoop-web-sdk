const gatewayModes = Object.freeze({
    POPUP: "POPUP",
    TAB: "TAB"
});

(function () {
    var options = {
        staging: "https://preprod.aadhaarapi.com",
        production: "https://prod.aadhaarapi.com",
        bsaURL: "https://bsa.aadhaarapi.com",
        itdURL: "https://itd.zoop.one",
        itdProdURL: "https://itd.zoop.one",
        itdStagingURL: "https://itd-staging.zoop.one",
        url: "https://prod.aadhaarapi.com",
        zoopModel: window.document.getElementById("zoop-gateway-model"),
        zoopWindow: null
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
            "background-color": "rgba(0, 0, 0, 0.4)" /* Fallback color */
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
            height: "675px"
        },
        iframe: {
            "border-radius": "inherit",
            margin: "0px",
            padding: "0px",
            border: "none"
        }
    };

    // create a common namespace with options
    var zoop = {
        options: options,
        styles: styles,
        esignGatewayOptions: {
            gateway_url: "",
            transaction_id: "",
            company_display_name: "",
            color_bg: "0FACF3",
            color_ft: "FFFFFF",
            logo_url: "",
            otp_mode: "y",
            fp_mode: "y",
            ir_mode: "y",
            phone_auth: "null",
            draggable_sign: "y",
            google_sign: "null",
            customer_email: "",
            customer_phone: "",
            mode: "POPUP",
        },
        creditScoreOptions: {
            company_display_name: "",
            property: "",
            color_bg: "0FACF3",
            color_ft: "FFFFFF",
            logo_url: "",
            otp_mode: "",
            fp_mode: "",
            ir_mode: "",
            phone_auth: "",
            draggable_sign: "",
            google_sign: "",
            full_name: "",
            address_line: "",
            state: "",
            postal: "",
            dob: "",
            pan_number: "",
            customer_phone: "",
            customer_email: ""
        },
        digiLockerOptions: {
            company_display_name: "",
            color_bg: "0FACF3",
            color_ft: "FFFFFF",
            logo_url: ""
        },
        offlineAadhaarOptions: {
            company_display_name: "",
            color_bg: "0FACF3",
            color_ft: "FFFFFF",
            logo_url: "",
            /*XML mode flags*/
            otp_mode: "",
            fp_mode: "",
            ir_mode: "",
            phone_auth: "",
            draggable_sign: "",
            google_sign: "",
            full_name: "",
            address_line: "",
            customer_phone: "",
            customer_email: ""
        },
        incomeTaxReturnsOptions: {
            txt_color: "202020",
            bg_color: "f5f5f5",
            btn_color: "0075f3",
            btn_txt_color: "ffffff",
            platform: "web",
            sdk_version: "2",
            logo_url: ""
        }
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

    zoop.onError = function onError() { };
    zoop.onSuccess = function onSuccess() { };

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
        // Validation of gateway if it's required through error.....if it's optional then assign default value
        if (zoop.isNullUndefinedOrEmpty(gatewayOption.company_display_name)) {
            throw new Error(
                "Customer display name is mandatory to initiate gateway."
            );
        }
        zoop.esignGatewayOptions.company_display_name =
            gatewayOption.company_display_name;
        zoop.esignGatewayOptions.color_bg = zoop.check(gatewayOption, "color_bg")
            ? gatewayOption.color_bg
            : zoop.esignGatewayOptions.color_bg;
        zoop.esignGatewayOptions.color_ft = zoop.check(gatewayOption, "color_ft")
            ? gatewayOption.color_ft
            : zoop.esignGatewayOptions.color_ft;
        zoop.esignGatewayOptions.logo_url = zoop.check(gatewayOption, "logo_url")
            ? gatewayOption.logo_url
            : zoop.esignGatewayOptions.logo_url;
        zoop.esignGatewayOptions.otp_mode = zoop.check(gatewayOption, "otp_mode")
            ? gatewayOption.otp_mode
            : zoop.esignGatewayOptions.otp_mode;
        zoop.esignGatewayOptions.fp_mode = zoop.check(gatewayOption, "fp_mode")
            ? gatewayOption.fp_mode
            : zoop.esignGatewayOptions.fp_mode;
        zoop.esignGatewayOptions.ir_mode = zoop.check(gatewayOption, "ir_mode")
            ? gatewayOption.ir_mode
            : zoop.esignGatewayOptions.ir_mode;
        zoop.esignGatewayOptions.phone_auth = zoop.check(
            gatewayOption,
            "phone_auth"
        )
            ? gatewayOption.phone_auth
            : zoop.esignGatewayOptions.phone_auth;
        zoop.esignGatewayOptions.draggable_sign = zoop.check(
            gatewayOption,
            "draggable_sign"
        )
            ? gatewayOption.draggable_sign
            : zoop.esignGatewayOptions.draggable_sign;
        zoop.esignGatewayOptions.google_sign = zoop.check(
            gatewayOption,
            "google_sign"
        )
            ? gatewayOption.google_sign
            : zoop.esignGatewayOptions.google_sign;
        zoop.esignGatewayOptions.customer_email = zoop.check(
            gatewayOption,
            "customer_email"
        )
            ? gatewayOption.customer_email
            : zoop.esignGatewayOptions.customer_email;
        zoop.esignGatewayOptions.customer_phone = zoop.check(
            gatewayOption,
            "customer_phone"
        )
            ? gatewayOption.customer_phone
            : zoop.esignGatewayOptions.customer_phone;

        if (gatewayOption?.mode?.toUpperCase() === gatewayModes.TAB) {
            zoop.esignGatewayOptions.mode = gatewayModes.TAB;
        } else {
            zoop.esignGatewayOptions.mode = gatewayModes.POPUP;
        }

        zoop.options.zoopModel = window.document.getElementById(
            "zoop-gateway-model"
        );
        return true;
    };

    zoop.eSignGateway = function (transaction_id, version = "v3") {
        if (zoop.isNullUndefinedOrEmpty(transaction_id)) {
            throw new Error(
                "Gateway Transaction Id is mandatory to initiate gateway."
            );
        }
        zoop.esignGatewayOptions.transaction_id = transaction_id;
        if (
            zoop.isNullUndefinedOrEmpty(zoop.esignGatewayOptions.company_display_name)
        ) {
            throw new Error("Company Display Name is mandatory in gateway options.");
        }

        switch (version) {
            case "v2":
                zoop.esignGatewayOptions.gateway_url =
                    zoop.options.url + "/gateway/auth/esign";
                break;
            default:
                zoop.esignGatewayOptions.gateway_url =
                    zoop.options.url + "/esign/gateway/v3";
        }

        let uri =
            "" +
            zoop.esignGatewayOptions.gateway_url +
            "/" +
            zoop.esignGatewayOptions.transaction_id +
            "?company_display_name=" +
            zoop.esignGatewayOptions.company_display_name +
            "&color_bg=" +
            zoop.esignGatewayOptions.color_bg +
            "&color_ft=" +
            zoop.esignGatewayOptions.color_ft +
            "&otp_mode=" +
            zoop.esignGatewayOptions.otp_mode +
            "&fp_mode=" +
            zoop.esignGatewayOptions.fp_mode +
            "&ir_mode=" +
            zoop.esignGatewayOptions.ir_mode +
            "&phone_auth=" +
            zoop.esignGatewayOptions.phone_auth +
            "&draggable_sign=" +
            zoop.esignGatewayOptions.draggable_sign +
            "&google_sign=" +
            zoop.esignGatewayOptions.google_sign +
            "&can_select_device=" +
            zoop.esignGatewayOptions.device_selection_allowed +
            "&phone=" +
            zoop.esignGatewayOptions.customer_phone +
            "&logo_url=" +
            zoop.esignGatewayOptions.logo_url;

        if (zoop.esignGatewayOptions.mode === gatewayModes.TAB) {
            if (zoop.options.zoopWindow == null || zoop.options.zoopWindow.closed) {
                zoop.options.zoopWindow = window.open(encodeURI(uri), "_blank")
            } else {
                zoop.options.zoopWindow.focus()
            }
        } else if (zoop.esignGatewayOptions.mode === gatewayModes.POPUP) {
            window.document.getElementById("zoop-model-content").innerHTML =
                '<iframe id="zoop-gateway-iframe" height="100%" width="100%" src="' +
                encodeURI(uri) +
                '"></iframe>';
            zoop.options.zoopModel.style.display = "block";
        }
    };

    zoop.creditScoreGatewayInit = function (gatewayOption) {
        // Validation of gateway if it's required through error.....if it's optional then assign default value
        if (zoop.isNullUndefinedOrEmpty(gatewayOption.company_display_name)) {
            throw new Error(
                "Customer display anme is mandatory to initiate gateway."
            );
        }
        zoop.creditScoreOptions.company_display_name =
            gatewayOption.company_display_name;
        zoop.creditScoreOptions.color_bg = zoop.check(gatewayOption, "color_bg")
            ? gatewayOption.color_bg
            : zoop.creditScoreOptions.color_bg;
        zoop.creditScoreOptions.color_ft = zoop.check(gatewayOption, "color_ft")
            ? gatewayOption.color_ft
            : zoop.creditScoreOptions.color_ft;
        zoop.creditScoreOptions.logo_url = zoop.check(gatewayOption, "logo_url")
            ? gatewayOption.logo_url
            : zoop.creditScoreOptions.logo_url;
        zoop.creditScoreOptions.otp_mode = zoop.check(gatewayOption, "otp_mode")
            ? gatewayOption.otp_mode
            : zoop.creditScoreOptions.otp_mode;
        zoop.creditScoreOptions.fp_mode = zoop.check(gatewayOption, "fp_mode")
            ? gatewayOption.fp_mode
            : zoop.creditScoreOptions.fp_mode;
        zoop.creditScoreOptions.ir_mode = zoop.check(gatewayOption, "ir_mode")
            ? gatewayOption.ir_mode
            : zoop.creditScoreOptions.ir_mode;
        zoop.creditScoreOptions.phone_auth = zoop.check(gatewayOption, "phone_auth")
            ? gatewayOption.phone_auth
            : zoop.creditScoreOptions.phone_auth;
        zoop.creditScoreOptions.draggable_sign = zoop.check(
            gatewayOption,
            "draggable_sign"
        )
            ? gatewayOption.draggable_sign
            : zoop.creditScoreOptions.draggable_sign;
        zoop.creditScoreOptions.google_sign = zoop.check(
            gatewayOption,
            "google_sign"
        )
            ? gatewayOption.google_sign
            : zoop.creditScoreOptions.google_sign;
        zoop.creditScoreOptions.property = zoop.check(gatewayOption, "property")
            ? gatewayOption.property
            : zoop.creditScoreOptions.property;
        zoop.creditScoreOptions.full_name = zoop.check(gatewayOption, "full_name")
            ? gatewayOption.full_name
            : zoop.creditScoreOptions.full_name;
        zoop.creditScoreOptions.state = zoop.check(gatewayOption, "state")
            ? gatewayOption.state
            : zoop.creditScoreOptions.state;
        zoop.creditScoreOptions.postal = zoop.check(gatewayOption, "postal")
            ? gatewayOption.postal
            : zoop.creditScoreOptions.postal;
        zoop.creditScoreOptions.dob = zoop.check(gatewayOption, "dob")
            ? gatewayOption.dob
            : zoop.creditScoreOptions.dob;
        zoop.creditScoreOptions.pan_number = zoop.check(gatewayOption, "pan_number")
            ? gatewayOption.pan_number
            : zoop.creditScoreOptions.pan_number;
        zoop.creditScoreOptions.customer_phone = zoop.check(
            gatewayOption,
            "customer_phone"
        )
            ? gatewayOption.customer_phone
            : zoop.creditScoreOptions.customer_phone;
        zoop.creditScoreOptions.customer_email = zoop.check(
            gatewayOption,
            "customer_email"
        )
            ? gatewayOption.customer_email
            : zoop.creditScoreOptions.customer_email;

        zoop.options.zoopModel = window.document.getElementById(
            "zoop-gateway-model"
        );
        return true;
    };

    zoop.creditScoreGateway = function (transaction_id) {
        if (zoop.isNullUndefinedOrEmpty(transaction_id)) {
            throw new Error(
                "Gateway Transaction Id is mandatory to initiate gateway."
            );
        }
        zoop.creditScoreOptions.transaction_id = transaction_id;
        if (
            zoop.isNullUndefinedOrEmpty(zoop.creditScoreOptions.company_display_name)
        ) {
            throw new Error("Company Display Name is mandatory in gateway options.");
        }

        zoop.creditScoreOptions.gateway_url =
            zoop.options.url + "/gateway/creditscore";

        let uri =
            zoop.creditScoreOptions.gateway_url +
            "/" +
            zoop.creditScoreOptions.transaction_id +
            "?company_display_name=" +
            zoop.creditScoreOptions.company_display_name +
            "&color_bg=" +
            zoop.creditScoreOptions.color_bg +
            "&color_ft=" +
            zoop.creditScoreOptions.color_ft +
            "&otp_mode=" +
            zoop.creditScoreOptions.otp_mode +
            "&fp_mode=" +
            zoop.creditScoreOptions.fp_mode +
            "&ir_mode=" +
            zoop.creditScoreOptions.ir_mode +
            "&phone_auth=" +
            zoop.creditScoreOptions.phone_auth +
            "&draggable_sign=" +
            zoop.creditScoreOptions.draggable_sign +
            "&google_sign=" +
            zoop.creditScoreOptions.google_sign +
            "&can_select_device=" +
            zoop.creditScoreOptions.device_selection_allowed +
            "&email=" +
            zoop.creditScoreOptions.customer_email +
            "&phone=" +
            zoop.creditScoreOptions.customer_phone +
            "&logo_url=" +
            zoop.creditScoreOptions.logo_url;
        window.document.getElementById("zoop-model-content").innerHTML =
            '<iframe id="zoop-gateway-iframe" height="100%" width="100%" src="' +
            encodeURI(uri) +
            '"></iframe>';
        zoop.options.zoopModel.style.display = "block";
    };

    zoop.digiLocakerGatewayInit = function (gatewayOption) {
        // Validation of gateway if it's required through error.....if it's optional then assign default value
        zoop.digiLockerOptions.company_display_name =
            gatewayOption.company_display_name;
        zoop.digiLockerOptions.color_bg = zoop.check(gatewayOption, "color_bg")
            ? gatewayOption.color_bg
            : zoop.digiLockerOptions.color_bg;
        zoop.digiLockerOptions.color_ft = zoop.check(gatewayOption, "color_ft")
            ? gatewayOption.color_ft
            : zoop.digiLockerOptions.color_ft;
        zoop.digiLockerOptions.logo_url = zoop.check(gatewayOption, "logo_url")
            ? gatewayOption.logo_url
            : zoop.digiLockerOptions.logo_url;

        zoop.options.zoopModel = window.document.getElementById(
            "zoop-gateway-model"
        );
        return true;
    };

    zoop.digiLocakerGateway = function (transaction_id) {
        if (zoop.isNullUndefinedOrEmpty(transaction_id)) {
            throw new Error(
                "Gateway Transaction Id is mandatory to initiate gateway."
            );
        }
        zoop.digiLockerOptions.transaction_id = transaction_id;
        if (
            zoop.isNullUndefinedOrEmpty(zoop.digiLockerOptions.company_display_name)
        ) {
            throw new Error("Company Display Name is mandatory in gateway options.");
        }

        zoop.digiLockerOptions.gateway_url =
            zoop.options.url + "/gateway/digilocker";

        let uri =
            zoop.digiLockerOptions.gateway_url +
            "/" +
            zoop.digiLockerOptions.transaction_id +
            "?company_display_name=" +
            zoop.digiLockerOptions.company_display_name +
            "&color_bg=" +
            zoop.digiLockerOptions.color_bg +
            "&color_ft=" +
            zoop.digiLockerOptions.color_ft +
            "&otp_mode=" +
            zoop.digiLockerOptions.otp_mode +
            "&fp_mode=" +
            zoop.digiLockerOptions.fp_mode +
            "&ir_mode=" +
            zoop.digiLockerOptions.ir_mode +
            "&phone_auth=" +
            zoop.digiLockerOptions.phone_auth +
            "&draggable_sign=" +
            zoop.digiLockerOptions.draggable_sign +
            "&google_sign=" +
            zoop.digiLockerOptions.google_sign +
            "&can_select_device=" +
            zoop.digiLockerOptions.device_selection_allowed +
            "&email=" +
            zoop.digiLockerOptions.customer_email +
            "&phone=" +
            zoop.digiLockerOptions.customer_phone +
            "&logo_url=" +
            zoop.digiLockerOptions.logo_url;
        window.document.getElementById("zoop-model-content").innerHTML =
            '<iframe id="zoop-gateway-iframe" height="100%" width="100%" src="' +
            encodeURI(uri) +
            '"></iframe>';
        zoop.options.zoopModel.style.display = "block";
    };

    zoop.offLineAadhaarGatewayInit = function (gatewayOption) {
        // Validation of gateway if it's required through error.....if it's optional then assign default value
        zoop.offlineAadhaarOptions.company_display_name =
            gatewayOption.company_display_name;
        zoop.offlineAadhaarOptions.color_bg = zoop.check(gatewayOption, "color_bg")
            ? gatewayOption.color_bg
            : zoop.offlineAadhaarOptions.color_bg;
        zoop.offlineAadhaarOptions.color_ft = zoop.check(gatewayOption, "color_ft")
            ? gatewayOption.color_ft
            : zoop.offlineAadhaarOptions.color_ft;
        zoop.offlineAadhaarOptions.logo_url = zoop.check(gatewayOption, "logo_url")
            ? gatewayOption.logo_url
            : zoop.offlineAadhaarOptions.logo_url;
        zoop.offlineAadhaarOptions.customer_phone = zoop.check(
            gatewayOption,
            "customer_phone"
        )
            ? gatewayOption.customer_phone
            : zoop.offlineAadhaarOptions.customer_phone;
        zoop.offlineAadhaarOptions.customer_email = zoop.check(
            gatewayOption,
            "customer_email"
        )
            ? gatewayOption.customer_email
            : zoop.offlineAadhaarOptions.customer_email;

        zoop.options.zoopModel = window.document.getElementById(
            "zoop-gateway-model"
        );
        return true;
    };

    zoop.offLineAadhaarGateway = function (transaction_id) {
        if (zoop.isNullUndefinedOrEmpty(transaction_id)) {
            throw new Error(
                "Gateway Transaction Id is mandatory to initiate gateway."
            );
        }
        zoop.offlineAadhaarOptions.transaction_id = transaction_id;
        if (
            zoop.isNullUndefinedOrEmpty(
                zoop.offlineAadhaarOptions.company_display_name
            )
        ) {
            throw new Error("Company Display Name is mandatory in gateway options.");
        }

        zoop.offlineAadhaarOptions.gateway_url =
            zoop.options.url + "/gateway/offline-aadhaar";

        let uri =
            zoop.offlineAadhaarOptions.gateway_url +
            "/" +
            zoop.offlineAadhaarOptions.transaction_id +
            "?company_display_name=" +
            zoop.offlineAadhaarOptions.company_display_name +
            "&color_bg=" +
            zoop.offlineAadhaarOptions.color_bg +
            "&color_ft=" +
            zoop.offlineAadhaarOptions.color_ft +
            "&otp_mode=" +
            zoop.offlineAadhaarOptions.otp_mode +
            "&fp_mode=" +
            zoop.offlineAadhaarOptions.fp_mode +
            "&ir_mode=" +
            zoop.offlineAadhaarOptions.ir_mode +
            "&phone_auth=" +
            zoop.offlineAadhaarOptions.phone_auth +
            "&draggable_sign=" +
            zoop.offlineAadhaarOptions.draggable_sign +
            "&google_sign=" +
            zoop.offlineAadhaarOptions.google_sign +
            "&can_select_device=" +
            zoop.offlineAadhaarOptions.device_selection_allowed +
            "&email=" +
            zoop.offlineAadhaarOptions.customer_email +
            "&phone=" +
            zoop.offlineAadhaarOptions.customer_phone +
            "&logo_url=" +
            zoop.offlineAadhaarOptions.logo_url;
        window.document.getElementById("zoop-model-content").innerHTML =
            '<iframe id="zoop-gateway-iframe" height="100%" width="100%" src="' +
            encodeURI(uri) +
            '"></iframe>';
        zoop.options.zoopModel.style.display = "block";
    };

    zoop.initBsaGateway = function initBsaGateway(session_id) {
        zoop.bankStatementAnalysis = {
            url: `${zoop.options.bsaURL}/?session_id=${session_id}&platform=web&sdk_v=2`
        };
    };

    zoop.openBsaGateway = function openBsaGateway() {
        window.location = zoop.bankStatementAnalysis.url;
    };

    zoop.initItdGateway = function initItdGateway(gatewayOption = {}) {
        zoop.incomeTaxReturnsOptions.txt_color = zoop.check(
            gatewayOption,
            "txt_color"
        )
            ? gatewayOption.txt_color
            : zoop.incomeTaxReturnsOptions.txt_color;
        zoop.incomeTaxReturnsOptions.bg_color = zoop.check(
            gatewayOption,
            "bg_color"
        )
            ? gatewayOption.bg_color
            : zoop.incomeTaxReturnsOptions.bg_color;
        zoop.incomeTaxReturnsOptions.btn_color = zoop.check(
            gatewayOption,
            "btn_color"
        )
            ? gatewayOption.btn_color
            : zoop.incomeTaxReturnsOptions.btn_color;
        zoop.incomeTaxReturnsOptions.btn_txt_color = zoop.check(
            gatewayOption,
            "btn_txt_color"
        )
            ? gatewayOption.btn_txt_color
            : zoop.incomeTaxReturnsOptions.btn_txt_color;
        zoop.incomeTaxReturnsOptions.logo_url = zoop.check(
            gatewayOption,
            "logo_url"
        )
            ? gatewayOption.logo_url
            : zoop.incomeTaxReturnsOptions.logo_url;
    };

    zoop.openItdGateway = function openItdGateway(transaction_id) {
        if (zoop.isNullUndefinedOrEmpty(transaction_id)) {
            throw new Error(
                "Gateway Transaction Id is mandatory to initiate gateway."
            );
        }

        let uri = `${zoop.options.itdURL}/?session_id=${transaction_id}&txt_color=${zoop.incomeTaxReturnsOptions.txt_color}&bg_color=${zoop.incomeTaxReturnsOptions.bg_color}&btn_color=${zoop.incomeTaxReturnsOptions.btn_color}&btn_txt_color=${zoop.incomeTaxReturnsOptions.btn_txt_color}&logo_url=${zoop.incomeTaxReturnsOptions.logo_url}&platform=${zoop.incomeTaxReturnsOptions.platform}&sdk_version=${zoop.incomeTaxReturnsOptions.sdk_version}`;

        window.document.getElementById("zoop-model-content").innerHTML =
            '<iframe id="zoop-gateway-iframe" height="100%" width="100%" src="' +
            encodeURI(uri) +
            '"></iframe>';
        zoop.options.zoopModel.style.display = "block";
    };

    const supportedEvents = {
        close: () => { },
        "consent-denied": () => { },
        "otp-error": () => { },
        "gateway-error": () => { },
        "esign-result": () => { },
        "offline-aadhaar-success": () => { },
        "offline-aadhaar-error": () => { },
        "digilocker-submit-success": () => { },
        "digilocker-submit-error": () => { },
        "credit-score-result": () => { },
        "itd-error": () => { },
        "itd-consent-denied": () => { },
        "itd-gateway-terminated": () => { },
        "itd-success": () => { }
    };
    zoop.on = function on(eventName = "", callback = () => { }) {
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
            zoop.options.bsaURL,
            zoop.options.itdURL
        ];
        let message;
        if (!URLs.includes(event.origin)) {
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
                case "offline-aadhaar-success":
                case "offline-aadhaar-error":
                case "digilocker-submit-success":
                case "digilocker-submit-error":
                case "credit-score-result":
                case "itd-error":
                case "itd-consent-denied":
                case "itd-gateway-terminated":
                case "itd-success":
                    message.payload =
                        typeof message.payload === "string"
                            ? JSON.parse(message.payload)
                            : message.payload;
                    zoop.options.zoopModel.style.display = "none";
                    window.document.getElementById("zoop-model-content").innerHTML = "";
                    // For tab based communication i.e., eSign we are using window.open
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
