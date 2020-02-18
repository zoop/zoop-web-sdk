# zoop-web-sdk
AadhaarAPI | ZOOP web SDK for E-sign and Bank Statement Analysis Gateway

## AadhaarAPI Bank Statement Analysis(BSA) Gateway 
1. [INTRODUCTION](#bsaIntro)
2. [PROCESS FLOW](#bsaProcessFlow)
3. [INITIATING A GATEWAY TRANSACTION](#bsaInit)
   - [INIT URL](#bsaInitUrl)
   - [REQUEST HEADERS](#bsaRequestHeader)
   - [REQUEST BODY PARAMS](#bsaRequestBody)
   - [RESPONSE PARAMS](#bsaRespParam)
4. [ADDING WEB SDK TO YOUR PROJECT](#bsaAddSDK)
5. [WEBHOOK](#bsaWebhook)
   - [SUCCESS REQUEST BODY](#bsaSuccessWebhookReqBody)
   - [FAILURE REQUEST BODY](#bsaErrorWebhookReqBody)
   - [ERROR CODES AND MESSAGES](#bsaErrorCodeWebhook)
6. [STAGE](#bsaStage)
   - [SUCCESS RESPONSE BODY](#bsaStageSuccess)
   - [USER STAGES](#bsaUserStage)
   - [FAILURE RESPONSE BODY](#bsaStageFailure)

<a name="bsaIntro"></a>
### 1. INTRODUCTION 

**Bank statement analyzer** predicts the worthiness of an individual and his/her credibility for a loan, after analyzing a considerable number of bank transactions, with the assistance of complex algorithm, text extraction, data categorization and smart analysis techniques.

<a name="bsaProcessFlow"></a>
### 2. PROCESS FLOW
1. At your backend server, Initiate the BSA transaction using a simple Rest API [POST] call. Details of these are available in the documents later. You will require API key and Agency Id for accessing this API which can be generated from the Dashboard.
2. This gateway transaction id then needs to be communicated back to the frontend to our Web SDK.
3. After adding the Web SDK in your project, client has to pass the above generated transaction id to an SDK function, called `zoop.initBsaGateway(<<transaction_id>>)` which is to help us acknowladge about the transaction.
4. After the initialization of the transaction, to open the gateway, you have to call `zoop.openBsaGateway()` function.
5. Once the transaction is successful or failed, the provided webhook will be called with the data about the transaction. 
6. Client will also have a REST API available to pull the status of a gateway transaction from backend. 

<a name="bsaInit"></a>
### 3. INITIATING A GATEWAY TRANSACTION

To initiate a gateway transaction a REST API call has to be made to backend. This call will generate a Gateway Transaction Id which needs to be passed to the frontend web-sdk to launch the gateway. 

<a name="bsaInitUrl"></a>
#### 3.1 INIT URL: 
    URL: POST: {{base_url}}/bsa/v1/init
    
 **{{base_url}}**:
# Table of Contents

## AadhaarAPI E-Sign Gateway.
1. [INTRODUCTION](#esignIntroduction)
2. [PROCESS FLOW](#esignProcessFlow)
3. [END USER FLOW](#esignEndUserFlow)
3. [INITIATING A GATEWAY TRANSACTION FOR E-SIGN](#esignInit)
   - [INIT URL](#esignInitUrl)
   - [REQUEST HEADERS](#esignRequestHeaders)
   - [REQUEST BODY PARAMS](#esignRequestbody)
   - [RESPONSE PARAMS](#esignResponseParams)
4. [ADDING SDK (.AAR FILE) TO YOUR PROJECT](#esignAddSDK)
5. [CONFIGURING AND LAUNCHING THE E-SIGN SDK](#esignConfigureSDK)
   - [IMPORT FILES](#esignImportFiles)
   - [ADD STRINGS(IN STRINGS.XML FILE)](#esignAddString)
   - [CALL E-SIGN SDK FROM THE ACTIVITY](#esignCallSDK)
   - [HANDLE SDK RESPONSE](#esignHandleSDK)
6. [RESPONSE FORMAT SENT ON MOBILE](#esignRespMobile)
   - [SUCCESS JSON RESPONSE FORMAT FOR E-SIGN SUCCESS](#esignSuccessRespMob)
   - [ERROR JSON RESPONSE FORMAT FOR E_SIGN ERROR](#esignErrorRespMob)
   - [ERROR JSON RESPONSE FORMAT FOR GATEWAY ERROR](#esignErrorRespGateway)
7. [RESPONSE FORMAT SENT ON RESPONSE_URL(ADDED IN INIT API CALL)](#esignRespInit)
   - [SUCCESS JSON RESPONSE FORMAT FOR E-SIGN SUCCESS](#esignRespInitSuccess)
   - [ERROR JSON RESPONSE FORMAT FOR E_SIGN ERROR](#esignRespInitError)
8. [BIOMETRIC DEVICES SETUP](#esignBiometric)
9. [PULLING TRANSACTION STATUS AT BACKEND](#esignStatus)
   - [RESPONSE PARAMS](#esignStatusResp)
   
   ## AadhaarAPI E-Sign Gateway 

<a name="esignIntroduction"></a>
### 1. INTRODUCTION
As a registered ASP under ESP AadhaarAPI provide WEB and Mobile gateway for E-signing of
documents. Using these gateways any organisation on-boarded with us can get their documents
signed digitally by their customer using Aadhaar number based EKYC (performed on ESP portal).
The mode of transaction can be following:
1. Aadhaar Number + OTP (works only on web and android)
2. Aadhaar Number + Fingerprint (works only on windows machine and android)
3. Aadhaar Number + IRIS (works only on Samsung IRIS tablet) 

This solves the problem of wet signing of documents, which is a costly and time-consuming
process. Aadhaar based E-sign is a valid and legal signature as per government regulations and is
accepted widely across India by various organisations.

<a name="esignProcessFlow"></a>
### 2. PROCESS FLOW
1. Generate the document based on the user info at your backend.
2. At your backend server, Initiate the e-sign transaction using a simple Rest API [POST] call by converting your
document into base64 string or via our Multi-Part Upload API. Details of these are available in the documents
later. You will require API key and Agency Id for accessing this API which can be generated from the Dashboard.
3. This gateway transaction id then needs to be communicated back to the frontend where SDK functions are to be
called.
4. After including the SDK files (JS & CSS) at frontend and a small HTML snippet, client has to pass above
generated transaction id to an SDK function to create a new gateway object and then open the gateway using
another function call.
5. This will open the gateway as shown in above image and the rest of the process till response will be handled by
the gateway itself.
6. Once the transaction is successful or failed, appropriate handler function will be called with response JSON, that
can be used by the client to process the flow further.
7. Result PDF url will be sent to the responseUrl requested via INIT call.
8. Client will also have a REST API available to pull the status of a gateway transaction from backend and reason of
failure. 

<a name="esignEndUserFlow"></a>
### 3 End User Flow:
1. Customer Login [ E-mail + OTP | Gmail Login | Phone + OTP (beta) ]
2. Document displayed to customer. (Draggable signature option can be turned on via gateway config or
signPageNumber and coordinates can be fixed during initiation call)
3. Customer chooses Mode of Authentication for performing E-Sign
4. Customer is redirected to ESP’s Auth portal where EKYC is performed after entering either Aadhaar number
or Virtual Id.
5. After successful EKYC customer is displayed Sign details received and customer’s consent is taken to
attach signature to the document and share a copy with requesting organization.
6. On success, customer is provided with an option to download the signed file. Also, a download URL is sent
to customer’s Email and responseURL which is valid for 48 hours.
7. On failure during request to ESP, customer is displayed an error code and error message. Same error details
are sent to the responseURL.
8. End Customer can validate the signature on PDF by opening the PDF in acrobat reader and Developer can
programmatically fetch certificate from PDF to ensure validity of certificate if required.

<a name="esignInit"></a>
### 3. INITIATING A GATEWAY TRANSACTION FOR E-SIGN[IP WHITELISTED IN PRODUCTION] 
To initiate a gateway transaction a REST API call has to be made to backend. This call will
generate a **Gateway Transaction Id** which needs to be passed to the frontend web-sdk to launch
the gateway.

<a name="esignInitUrl"></a>
#### 3.1 INIT URL: 
    URL: POST {{base_url}}/gateway/esign/init/
 **{{base_url}}**
 
 **For Pre-Production Environment:** https://preprod.aadhaarapi.com
 
 **For Production Environment:** https://prod.aadhaarapi.com
 
 **Example Url:** https://preprod.aadhaarapi.com/bsa/v1/init

<a name="bsaRequestHeader"></a>
#### 3.2 REQUEST HEADERS: [All Mandatory]

 **qt_api_key** -- API key generated via Dashboard (PREPROD and PROD)
 
 **qt_agency_id** -- Agency ID available from My account section in Dashboard
 
  Content-Type: application/json

<a name="bsaRequestBody"></a>
#### 3.3 REQUEST BODY PARAMS: 
```json
{
    "mode": "REDIRECT",
    "redirect_url": "https://yourdomain.com",
    "webhook_url": "https://yourdomain.com/webhook",
    "purpose": "load agreement",
    "bank": "yesbank",
    "months": 3
}
```
|Parameters| Required| Description/Value|
|----|----|----|
|mode| true| REDIRECT or POPUP|
|redirect_url| true |A valid URL|
|webhook_url| true| A valid URL|
|purpose| true| Your purpose|
|bank| false| ICICI or YESBANK or HDFC or SBI or AXIS or KOTAK or SC|
|months| false| 1 - 12|

Currently, supported banks are ICICI, YES BANK, HDFC, STATE BANK OF INDIA, AXIS, KOTAK, STANDARD CHARTERED.

<a name="bsaRespParam"></a>
#### 3.4 RESPONSE PARAMS:
##### 3.4.1 Successful Response:

```json
{
    "id": "<<transaction_id>>",
    "mode": "REDIRECT",
    "env": "PRODUCTION",
    "webhook_security_key": "<<UUID>>",
    "request_version": "1.0",
    "request_timestamp": "2020-02-17T13:14:26.423Z",
    "expires_at": "2020-02-17T13:24:26.423Z"
}
```

The above generated gateway transactionId is needed to make open gateway via BSA SDK.

**Note:** A transaction is valid only for 10 mins after generation.
    
##### 3.4.2 Failure Response:
```json
{
    "statusCode": 400,
    "errors": [],
    "message": "<<message about the error>>"
}
```
<a name="bsaAddSDK"></a>
### 4.ADDING WEB SDK TO YOUR PROJECT

You can download or add the link to the CDN of our Web SDK. There are two function calls to open the gateway. They should called in the order mentioned in the docs. Firstly, to initiate the gateway you have to call `zoop.initBsaGateway(<<transaction_id>>)` with the transaction ID generated in the init call. The next step would be to open the gateway. That can be done by simply calling `zoop.openBsaGateway()` function. You don't need to provided the transaction ID here as you have already mentioned in `initBsaGateway`. For your ease we have also added one simple example below.
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Site</title>
  </head>
  <body>
    <script src="https://static.aadhaarapi.com/sdk/v1.0.1/aadhaarapi-web-sdk.min.js"></script>
    <script type="application/javascript">
      // Name of the this function can be anything you want.
      function openGateway() {
        // Pass Transaction ID here.
        zoop.initBsaGateway("<<transaction_id>>");
        // Call this function to open the gateway
        zoop.openBsaGateway();
      }
    </script>
  </body>
</html>
```

<a name="bsaWebhook"></a>
### 5. Handling Webhook Response

The webhook response will be sent to `webhook_url` provided at the init call. You might receive multiple responses for a single transaction. The response(s) will be send when the user start any kind of interaction with the gateway. When receiving the webhook response please match the webhook_security_key in the header of the request to be the same as the one provided in the init call. If they are not the same **you must abandon the webhook response**.

<a name="bsaSuccessWebhookReqBody"></a>
#### 5.1 SUCCESSFUL REQUEST BODY
```json
{
  "id": "<<transaction_id>>",
  "mode": "REDIRECT",
  "env": "PRODUCTION",
  "bank": "YESBANK",
  "response_code": 1,
  "response_message": "Transaction Successful",
  "last_user_stage_code": "<<Stage Code>>",
  "last_user_stage": "<<Stage>>",
  "request_version": "1.0",
  "request_medium": "<<web | android | ios>>",
  "sdk_name": "1",
  "data": {
    "metadata": {
      "acc_number": "<<account_number>>",
      "start_date": "13/02/2019",
      "end_date": "12/02/2020"
    },
    "transactions": [
      {
        "date": "2019-03-17",
        "value_date": "2019-03-17",
        "chq": "",
        "particulars": "UPI/123123123/From:upi@ybl/To:upi@ybl/Payment from PhonePe",
        "balance": 100,
        "amount": 100,
        "label": "CREDIT",
        "validation": true
      },
      {
        "date": "2019-03-17",
        "value_date": "2019-03-17",
        "chq": "907632321560",
        "particulars": "PCA:123123123:123123123:GOOGLE *SERVICES       g.co/helppay# CA",
        "balance": 99,
        "amount": 1,
        "label": "DEBIT",
        "validation": true
      }
    ]
  }
}
```
<a name="bsaErrorWebhookReqBody"></a>
#### 5.2 FAILURE REQUEST BODY

```json
{
  "id": "<<transaction_id>>",
  "mode": "REDIRECT",
  "env": "PRODUCTION",
  "bank": "SBI",
  "response_code": 0,
  "response_message": "Transaction Failure",
  "last_user_stage_code": "<<Stage Code>>",
  "last_user_stage": "<<Stage>>",
  "request_version": "1.0",
  "request_medium": "<<web | android | ios>>",
  "sdk_name": "1",
  "error": {
    "code": "<<error_code>>",
    "message": "<<error_message>>"
  }
}
```
<a name="bsaErrorCodeWebhook"></a>
#### 5.3 ERROR CODES AND MESSAGES

| Code  | Message |
|---|---|
| 651 | Technical Error |
| 652 | Session Closed |
| 653 | Bank Server Unresponsive Error |
| 654 | Consent Denied Error |
| 655 | Document Parsing Error |
| 656 | Validity Expiry Error |
| 657 | Authentication Error |
| 658 | No Entry Found Error |
| 659 | Stage Timeout Error |
| 660 | Session Closed On Retry |
| 670 | No Session Found Error |
| 671 | Error Not Recorded |

<a name="bsaStage"></a>
### 6. STAGE

After creating an initialization request successfully you can check at which stage your transaction is currently.

    GET: {{base_url}}/bsa/v1/stage/<<transaction_id>>

<a name="bsaStageSuccess"></a>
#### 6.1 SUCCESSFUL RESPONSE BODY

```json
{
    "id": "<<transaction_id>>",
    "mode": "REDIRECT",
    "env": "PRODUCTION",
    "request_version": "1.0",
    "bank": "SBI",
    "last_user_stage": "login_opened",
    "last_user_stage_code": "LO"
}
```

<a name="bsaUserStage"></a>
#### 6.2 USER STAGES

| Code  |  Stage |
|---|---|
| LO | login_opened | 
| F | failed | 
| LS | login_success | 
| AS | account_selected | 
| SD | statement_downloaded | 
| SP | statement_parsed | 
| TS | transaction_successful | 
| TI | transaction_initiated | 
| VC | validated_captcha | 
| VO | validated_otp | 
| VS | validated_security_answer |

<a name="bsaStageFailure"></a>
#### 6.3 FAILURE RESPONSE BODY
```json
{
    "statusCode": 404,
    "errors": [],
    "message": "transaction id not found in our records"
}
```

In case you are facing any issues with integration please open a ticket on our [support portal](https://aadhaarapi.freshdesk.com/support/home)
 **Example Url:** https://preprod.aadhaarapi.com/gateway/esign/init/
 
<a name="esignRequestHeaders"></a>
#### 3.2 REQUEST HEADERS: [All Mandatory]
  qt_api_key: <<your api key value – available via Dashboard>>
  
  qt_agency_id: <<your agency id value – available via Dashboard>>
  
  Content-Type: application/json
  
<a name="esignRequestbody"></a>
#### 3.3 REQUEST BODY PARAMS: [All Mandatory]
```json
{
    "document": {
      "data": "<<document data in based64 format>>",
      "type": "<<pdf is only supported for now>>",
      "info": "<<information about the document – minimum length 15>>"
    },
    "signerName": "<<name of the signer, must be same as on Aadhaar Card>>",
    "signerCity": "<<city of the signer, preferably as mentioned in Aadhaar>>",
    "purpose": "Purpose of transaction, Mandatory",
    "responseURL":"<<POST[REST] URL to which response is to be sent after the transaction is complete>>",
    "version": "2.0 <<current E-sign version>>"
}
```
  
| Parameters | Description/Values | Checks |
| --- | --- | --- |
| document { | Is an object that provides details of the document. It has below mentioned values in the object |      |
| data | Show file differences that **haven't been** staged | Valid base64 formatted pdf |
| type | Format of the document. For now, only value pdf is supported |      |
| info | Information about the document to be sent to  ESP | Minimum length 15 |
| } |   |   |
| signerName | Name of the signer | Same as in Aadhaar Card |
| signerCity | Place of signing (Current City/As mentioned in Aadhaar) |   |
| purpose | Purpose of document signature | Mandate as per norms. Will be used to generate consent text and logged in DB. |
|responseURL | POST API URL where the Agency receives the response after the e-signing is completed. | A valid POST API URL,  else response back to your server will fail.| 
| version | Current E-sign version (2.0) | Must be 2.0 |

<a name="esignResponseParams"></a>
#### 3.4 RESPONSE PARAMS:
```json
{
  "id": "<<transactionId>>",
  "docs": [
    "<<document ID>>"
  ],
  "request version": "2.0",
  "createdAt": "<<timestamp>>"
} 
```
The above generated gateway transactionId has to be made available to frontend to open the gateway.

 **Note:**  A transaction is valid only for 30 mins after generation. 

<a name="esignAddSDK"></a>
### 4. ADDING SDK (.AAR FILE) TO YOUR PROJECT
To add SDK file as library in your Project, Perform the following Steps:

1. Right click on your project and choose “Open Module Settings”.
2. Click the “+” button in the top left to add a new module.
3. Choose “Import .JAR or .AAR Package” and click the “Next” button.
4. Find the AAR file using the ellipsis button (“…”) beside the “File name” field.
5. Keep the app’s module selected and click on the Dependencies pane to add the new
module as a dependency.
6. Use the “+” button of the dependencies screen and choose “Module dependency”.
7. Choose the module and click “OK”. 

<a name="esignConfigureSDK"></a>
### 5. CONFIGURING AND LAUNCHING THE E-SIGN SDK 
<a name="esignImportFiles"></a>
#### 5.1  IMPORT FILES 

Import following files in your Activity:
    
    import one.zoop.sdkesign.esignlib.qtActivity.QTApiActivity;
    import static one.zoop.sdkesign.esignlib.qtUtils.QtConstantUtils.ESIGN_ERROR;
    import static one.zoop.sdkesign.esignlib.qtUtils.QtConstantUtils.ESIGN_SUCCESS;
    import static one.zoop.sdkesign.esignlib.qtUtils.QtConstantUtils.QT_EMAIL;
    import static one.zoop.sdkesign.esignlib.qtUtils.QtConstantUtils.QT_ENV;
    import static one.zoop.sdkesign.esignlib.qtUtils.QtConstantUtils.QT_REQUEST_TYPE;
    import static one.zoop.sdkesign.esignlib.qtUtils.QtConstantUtils.QT_RESULT;
    import static one.zoop.sdkesign.esignlib.qtUtils.QtConstantUtils.QT_TRANSACTION_ID;
    import static one.zoop.sdkesign.esignlib.qtUtils.QtConstantUtils.REQUEST_API;
    import static one.zoop.sdkesign.esignlib.qtUtils.QtRequestType.ESIGN;

<a name="esignAddString"></a>
#### 5.2 ADD STRINGS(IN STRINGS.XML FILE) 

Add following strings in Strings.xml according to the application’s requirement. 

    // must be ‘y' for allowing OTP based e-sign authentication to user; else ‘n’
    <string name=“qt_otp_access">y</string>
    // must be ‘y' for allowing Fingerprint based e-sign authentication to user; else ‘n’
    <string name=“qt_fp_access">n</string>
    // must be ‘y' for allowing Iris based e-sign authentication to user; else ‘n’
    <string name=“ qt_iris_access">n</string>
    // must be ‘y' for allowing Phone based login to user; else ‘n’ 
    <string name=“qt_phone_auth_access">n</string>
    // must be ‘y' for allowing signature’s position to be decided by the user; else ‘n’
    <string name=“qt_draggable">y</string>                               

<a name="esignCallSDK"></a>
#### 5.3 CALL E-SIGN SDK FROM THE ACTIVITY  
**Use the Intent Function to call the E-Sign SDK from your Activity as shown below:**

    String GatewayId, Email, environment;
    Intent gatewayIntent = new Intent(YourActivity.this, QTApiActivity.class);
    gatewayIntent.putExtra(QT_TRANSACTION_ID, GatewayId);
    gatewayIntent.putExtra(QT_EMAIL, Email); //Not Mandatory, can be added to pre-fill the Login Box
    gatewayIntent.putExtra(QT_REQUEST_TYPE, ESIGN.getRequest());
    gatewayIntent.putExtra(QT_ENV, environment);
    startActivityForResult(gatewayIntent, REQUEST_API);
Params:
GatewayId: “Transaction Id generated from your backend must be passed here”

Email: “Add your end user’s email here to pre-fill the login box”

environment: for pre-prod use "QT_PP" and for prod use "QT_P"

Set the QT_REQUEST_TYPE as ESIGN.getRequest() for e-sign based transaction.

Example:

GatewayId = "a051231e-ddc7-449d-8635-bb823485a20d";

Email = “youremail@gmail.com";

environment = "QT_PP";

<a name="esignHandleSDK"></a>
#### 5.4 HANDLE SDK RESPONSE 

After performing a Successful Transaction: Android download manager will start downloading the Signed PDF file. 

Also the responses incase of successful transaction as well as response in case of error will be sent to your activity & can be handled via onActivityResult( ) method as shown below.

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
      if (requestCode == REQUEST_API && null != data) {
        String requestType = data.getStringExtra(QT_REQUEST_TYPE);
        String serviceType = data.getStringExtra(QT_SERVICE_TYPE);
      if(requestType.equalsIgnoreCase(ESIGN.getRequest())){
        //To handle the Success JSON response from SDK
      if (resultCode == ESIGN_SUCCESS) {
        String responseString = data.getStringExtra(QT_RESULT); //handle
        successful response from AadhaarAPI’s e-sign SDK here
        Log.i("SDK test response ", serviceType + " response: " +responseString); // can be removed
        }
        // To handle the Error JSON response from SDK 
      if (resultCode == ESIGN_ERROR) {
       String errorString = data.getStringExtra(QT_RESULT); //handle
        error response from AadhaarAPI’s e-sign SDK here
        Log.i("SDK test error ", serviceType + " error: "+ errorString); // can be removed
        }
      }
    }
 
<a name="esignRespMobile"></a> 
### 6. RESPONSE FORMAT SENT ON MOBILE 
<a name="esignSuccessRespMob"></a>
#### 6.1 SUCCESS JSON RESPONSE FORMAT FOR E-SIGN SUCCESS
    { "id": “<<transaction_Id>>",
    "response_timestamp": "2018-08-01T09:50:06.831Z",
    "transaction_status": 16,
    "signer_consent": "Y",
    "request_medium": “ANDROID",
    "last_document": “true",
    "current_document": 1,
    "documents": [
    { "id": “<<unique-document-id >>”,
     "index": 1,
     "type": “pdf",
     "doc_info": "Sample pdf - sample doc",
     "dynamic_url": “<<links-to-download-document>>”,
     "sign_status": "Y",
     "auth_mode": "O",
     "response_status": "Y",
     "error_code": null,
     "error_message": null,
     "request_timestamp": “2018-08-01T09:50:06.831Z” }, ….
    ], "dynamic_url": “<<links-to-download-document>>”,
     "msg": “<<Esign Message from ESP/Internal>>” }
     
| Response Parameter  | Description/Possible Values |
| ------------- | ------------- |
| id | E-sign Transaction Id  |
| response_timestamp | ESP response timestamp |
| transaction_status | Status Code to track last transaction state. List of codes available in Annexure1. |
| signer_consent | Y/N - Will be N if user denies consent |
| request_medium | WEB/ANDROID - Platform from which esign transaction was performed |
| last_document | true/false- true if document is last else false |
| documents[ | Is an object that provides details of the single/multiple documents in array. It has below mentioned values in the object|
| { id | Document id |
| index | Index of this document |
| doc_info | Info of this document |
| type | Format of the document. For now, only value pdf is supported |
| dynamic_url | Url to download the signed pdf |
| sign_status | Y/N - if document is signed by the user or not |
| auth_mode | O/F/I – OTP, Fingerprint, Iris |
| response_status | Y/N - if ESP response was success or not. |
| error_code | Error code from ESP/Internal (available only in case of error) |
| error_message | Error message from ESP/Internal (available only in case of error) |
| request_timestamp } | Time at which the request was sent to ESP |
| ] dynamic_url | Url to download the signed pdf of the current document |
| message | Message from ESP/Internal |

<a name="esignErrorRespMob"></a>
#### 6.2 ERROR JSON RESPONSE FORMAT FOR E_SIGN ERROR 
    { "id": “<<transaction id>>",
    "signer_name": “Abc Name",
    "signer_city": “xyz city",
    "current_document": 1,
    "user_notified": "N",
    "purpose": "Development and testing purpose",
    "transaction_status": 17,
    "signer_consent": "Y",
    "request_medium": "ANDROID",
    "signed_document_count": 0,
    "error_code": "ESP-123",
    "error_message": “<<Error Message>>","response_status": "N",
    "response_timestamp": “2018-08-01T12:09:48.500Z”,
    "msg": "Error Code :ESP-123 (<<Error Message>>)” } 
    
|Response Parameter| Description/Possible Values|
| ------------- | ------------- |
|id |E-sign Transaction Id|
|signer_name| Name of signer as provided in INIT call.|
|signer_city| City of signer as provided in INIT call.|
|current_document| Current document number|
|signer_consent| Y/N - Will be N if user denies consent|
|request_medium |WEB/ANDROID - Platform from which esign transaction was performed|
|Purpose| Purpose for signing the document |
|user_notified| Y/N - User notified of the E-sign success and sent a copy of document to download.|
|transaction_status| Status Code to track last transaction state. List of codes available in Annexure1.|
|signed_document_count| count of the number of documents signed|
|response_status| Y/N - if ESP response was success or not.|
|error_code| Error code from ESP/Internal (available only in case of error)|
|error_message| Error message from ESP/Internal (available only in case of error)|
|response_timestamp| ESP response timestamp.|
|msg|Error code and error message|

<a name="esignErrorRespGateway"></a>
#### 6.3 ERROR JSON RESPONSE FORMAT FOR GATEWAY ERROR 
    {"statusCode": 422,
     "message": "Maximum OTP Tries Reached, Transaction Failed” } 
|Response Parameter| Description/Possible Values|
| ---------- | ----------- |
|statusCode| Error code from gateway/sdk|
|message| Error message from gateway/sdk|

<a name="esignRespInit"></a>
### 7. RESPONSE FORMAT SENT ON `responseURL` (ADDED IN INIT API CALL)
<a name="esignRespInitSuccess"></a>
#### 7.1 SUCCESS JSON RESPONSE FORMAT FOR E-SIGN SUCCESS
```json
{
   "id": "ed15fc9f-5880-4b98-9671-4d094e5a8fe8",
   "response_timestamp": "2018-09-01T19:25:49.730Z",
   "transaction_status": 16,
   "public_ip": "223.196.31.62",
   "signer_consent": "Y",
   "request_medium": "W",
   "last_document": true,
   "current_document": 1,
   "documents": [
     {
       "id": "9db76386-b6fe-4cc1-916b-52784a8fe777",
       "index": 1,
       "doc_info": "Sample pdf - sample doc",
       "type": "pdf",
       "dynamic_url": "<<Signed URL FOR PDF DOWNLOAD - valid for 48 hours>>",
       "sign_status": "Y",
       "auth_mode": "O",
       "response_status": "Y",
       "error_code": null,
       "error_message": null,
       "request_timestamp": "2018-09-01T19:25:49.730Z",
       "signer_name_esp": "Mohak Talwar",
       "signer_location_esp": "248198"
     }
   ]
}
```

|Response| Parameter Description/Possible Values|
|------|-----|
|id| E-sign Transaction Id|
|response_timestamp| ESP response timestamp.|
|transaction_status| Status Code to track last transaction state. List of codes available in Annexure1.|
|signer_consent| Y/N - Will be N if user denies consent|
|request_medium| W for WEB/ M for Mobile - Platform from which esign transaction was performed|
|last_document| true/false- true if document is last else false|
|documents [| Is an object that provides details of the single/multiple documents in array. It has below mentioned values in the object|
|{ id| Document id|
|index| Index of this document|
|doc_info| Info of this document
|type| Format of the document. For now, only value pdf is supported|
|dynamic_url |Url to download the signed pdf|
|sign_status| Y/N - if document is signed by the user or not|
|auth_mode| O/F/I – OTP, Fingerprint, Iris|
|response_status| Y/N - if ESP response was success or not.|
|error_message| Error message from ESP/Internal (available only in case of error)|
|request_timestamp }| Time at which the request was sent to ESP|
|]|  |

<a name="esignRespInitError"></a>
#### 7.2 ERROR JSON RESPONSE FORMAT FOR E_SIGN ERROR
```json
{
   "id": "5c34f783-7930-43b7-a5c8-34b5222398de",
   "transaction_status": 17,
   "public_ip": "223.196.31.62",
   "signer_consent": "Y",
   "request_medium": "W",
   "current_document": 1,
   "documents": [
     {
       "id": "1af9ffca-7c34-4bb0-b0ee-ad284b1fe4a4",
       "index": 1,
       "doc_info": "Sample pdf - sample doc",
       "type": "pdf",
       "sign_status": "N",
       "auth_mode": "O",
       "response_status": "N",
       "error_code": "998",
       "error_message": "Unknown error",
       "request_timestamp": "2018-09-01T20:55:29.045Z"
     }
   ],
   "response_timestamp": "2018-09-01T20:55:29.045Z"
}
```
|Response| Parameter Description/Possible Values|
|-----|-----|
|id| E-sign Transaction Id|
|response_timestamp| ESP response timestamp.|
|current_document| Current document number|
|signer_consent| Y/N - Will be N if user denies consent|
|request_medium| WEB/ANDROID - Platform from which esign transaction was performed|
|transaction_status| Status Code to track last transaction state. List of codes available in Annexure1.|
|documents [| Is an object that provides details of the single/multiple documents in array. It has below mentioned values in the object|
|{ id| Document id|
|index|Index of this document|
|doc_info|Info of this document|
|type| Format of the document. For now, only value pdf is supported|
|dynamic_url| Url to download the signed pdf|
|sign_status| Y/N - if document is signed by the user or not|
|auth_mode| O/F/I – OTP, Fingerprint, Iris|
|response_status| Y/N - if ESP response was success or not.|
|error_code| Error code from ESP/Internal (available only in case of error)|
|error_message| Error message from ESP/Internal (available only in case of error)|
|request_timestamp }| Time at which the request was sent to ESP|
|]|    |


<a name="esignStatus"></a>
### 9. PULLING TRANSACTION STATUS AT BACKEND 
In case the POST API call to the response URL fails, there is an option to pull the transaction status from backend
using the same **Esign Transaction Id**.

#### 9.1 URL
```
GET {{base_url}}/gateway/esign/:esign_transaction_id/fetch/
```
    
<a name="esignStatusResp"></a>    
#### 9.2 RESPONSE PARAMS:
```json
{
  "id": "<<transaction id>>",
  "request_version": "2.0",
  "signer_consent": "Y",
  "response_url": "<<POST[REST] URL to which response is to be sent after the transaction is
  complete>>",
  "current_document": 1,
  "signed_document_count": 1,
  "public_ip": "223.196.31.21",
  "env": 1,
  "signer_name": "Demo Name",
  "signer_city": "Demo City",
  "purpose": "Development and testing purpose",
  "transaction_status": 5,
  "request_medium": "M",
  "transaction_attempts": 1,
  "otp_attempts": 1,
  "otp_failures": 0,
  "user_notified": "Y", 
  "response_to_agency": "Y",
  "createdAt": "2018-08-03T08:43:39.751Z",
  "documents": [
    {
     "id": "<<document id>>",
     "index": 1,
     "doc_info": "Sample pdf - sample doc",
     "type": "pdf",
     "dynamic_url": "<<Link to download this pdf>>",
     "sign_status": "Y",
     "auth_mode": "O",
     "response_status": "Y",
     "error_code": "<<error code if any>>",
     "error_message": "<<error message if any>>",
     "request_timestamp": "2018-08-03T08:47:50.661Z"
    }
   ]
}
```
|Response Parameter| Description/Possible Values|
|----|----|
|id| E-sign Transaction Id|
|request_version| Esign version – currently 2.0|
|signer_consent| Y/N - Will be N if user denies consent|
|signed_document_count| count of the number of documents signed|
|response_url| URL to which the response was sent on completion|
|current_document| Current document number}
|request_medium| W for Web/ M for Mobile - Platform from which esign transaction was performed|
|public_ip| End user IP using which the transaction was performed.|
|env| 1/2 – 1(preproduction) & 2 (production)|
|signer_name| Name of signer as provided in INIT call.|
|purpose| Purpose for signing the document|
|signer_city| City of signer as provided in INIT call.|
|transaction_status| Status Code to track last transaction state. List of codes available in Annexure1.|
|transaction_attempts| Transaction attempt count. Currently allowed only once.|
|otp_attempts| Number of times login OTP was requested|
|otp_failures| Number of times login failed due to wrong OTP|
|user_notified| Y/N - User notified of the E-sign success and sent a copy of document to download.|
|response_to_agency| Y/N - Response sent to responseURL was success or failure.|
|createdAt| Transaction initiated at - YYYY-MM-DDTHH:MM:SS.122Z|
|documents[| Is an object that provides details of the single/multiple documents in array. It has below mentioned values in the object|
|{ id|Document id|
|index|Index of document|
|doc_info|Info of the document|
|type| Format of the document. For now, only value pdf is supported|
|dynamic_url| Url to download the signed pdf|
|sign_status| Y/N - if document is signed by the user or not|
|auth_mode| O/F/I – OTP, Fingerprint, Iris|
|response_status| Y/N - if ESP response was success or not.|
|error_code| Error code from ESP/Internal (available only in case of error)|
|error_message| Error message from ESP/Internal (available only in case of error)|
|request_timestamp } ,.. ]| Time at which the request was sent to ESP|

### Annexure 1 – Transaction Status
| Message | Code |
|----|----|
| INITIATED  | 1 |
| INITIATION_FAILED | 2 |
| OTP_SENT | 3 |
| OTP_FAILED | 4 |
| SUCCESSFUL | 5 |
| FAILED | 6 |
| OTP_MISMATCH | 7 |
| FP_MISMATCH | 8 |
| EXPIRED | 9 |
| CONSENT_DENIED | 10 |
| TERMINATED_BY_USER | 11 |
| OTP_REQUEST_LIMIT_CROSSED | 12 |
| OTP_FAILURE_LIMIT_CROSSED | 20 |
| OTP_EXPIRED | 13 |
| LOGIN_SUCCESS | 14 |
| ESP_REQ_INITIATED | 15 |
| ESP_REQ_SUCCESS | 16 |
| ESP_REQ_FAILED | 17 |
| USER_NOTIFIED | 18 |
| TRANSACTION_LIMIT_CROSSED | 19 |
