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
1. [Introduction](#esignIntroduction)
2. [Process Flow](#esignProcessFlow)
3. [End User Flow](#esignEndUserFlow)
4. [Initiating a Gateway Transaction For E-Sign](#esignInit)
   - [Init URL](#esignInitUrl)
   - [Request Headers](#esignRequestHeaders)
   - [Request Body Params](#esignRequestbody)
   - [Response Params](#esignResponseParams)
5. [Set Zoop Environment](#setZoopEnv)
6. [Adding Web SDK To Your Project](#esignAddSDK)
   - [Setup the gateway UI to match your application](#esign-gateway-setup)
7. [Handle Events](#esignEventTitle)
   - [`payload`](#message-payload)
     - [`esign-result`](#message-esign-result)
     - [`otp-error`](#message-otp-error)
     - [`gateway-error`](#message-gateway-error)
8. [Response Format Sent On `responseURL` (Added In Init API Call)](#esignRespInit)
   - [Success JSON Response Format For E-Sign Success](#esignRespInitSuccess)
   - [Error JSON Response Format For E-Sign Error](#esignRespInitError)
9. [Pulling Transaction Status At Backend](#esignStatus)
   - [URL](#esignStatusURL)
   - [Response Params](#esignStatusResp)
10. [Annexure](#annexure)
   
   ## AadhaarAPI E-Sign Gateway 

<a name="esignIntroduction"></a>
### 1. Introduction
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
### 2. Process Flow
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
### 3. End User Flow:
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
### 4. Initiating a Gateway Transaction For E-Sign[IP Whitelisted In Production] 
To initiate a gateway transaction a REST API call has to be made to backend. This call will
generate a **Gateway Transaction Id** which needs to be passed to the frontend web-sdk to launch
the gateway.

<a name="esignInitUrl"></a>
#### 4.1 Init URL: 
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
#### 4.2 Request Headers: [All Mandatory]
  qt_api_key: <<your api key value – available via Dashboard>>
  
  qt_agency_id: <<your agency id value – available via Dashboard>>
  
  Content-Type: application/json
  
<a name="esignRequestbody"></a>
#### 4.3 Request Body Params: [All Mandatory]
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
#### 4.4 Response Params:
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

<a name="setZoopEnv"></a>
### 5. Set Zoop Environment

First, you might have to specify the environment in which you want the SDK to run. By default, **staging** environment is picked if you forgot to specify any value. Valid environments are **production** and **staging**. To set the environment you call `setEnvironment` method from the provided SDK. This helps us to understand what type of transactions you are planning of doing.

```html
<script>
   zoop.setEnvironment('production'); // Use 'staging' for staging environment
</script>
```

<a name="esignAddSDK"></a>
### 6. Adding Web SDK To Your Project
You can download or add the link to the CDN of our Web SDK. There are two function calls to open the gateway. They should called in the order mentioned in the docs. Firstly, to initiate the gateway you have to call `zoop.eSignGatewayInit(gatewayOptions)` with the [gateway option](#esign-gateway-setup). The next step would be to open the gateway. That can be done by simply calling `zoop.eSignGateway(<<transaction_id>>)` with the transaction ID generated in the init call. For your ease we have also added one simple example below.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Site</title>
  </head>
  <body>
    <!-- And add the code below into the body of your HTML -->
    <div id="zoop-gateway-model">
      <div id="zoop-model-content"></div>
    </div>
    <script src="https://static.aadhaarapi.com/sdk/v1.0.1/aadhaarapi-web-sdk.min.js"></script>
    <script type="application/javascript">
      // Name of the this function can be anything you want.
      function openGateway() {
         // To setup gateway UI to mach your application
         zoop.eSignGatewayInit(gatewayOptions);
         // Pass the transaction ID created at Init call
         zoop.eSignGateway(<<transaction_id>>);
      }
    </script>
  </body>
</html>
```

<a name="esign-gateway-setup"></a>
#### 6.1 Setup the gateway UI to match your application.
```js
const gatewayOptions = {
    company_display_name: '<<Add your company name here>>', //(required)
    front_text_color: 'FFFFFF', //(optional)Add the hex for colour of text of company name
    background_color: '2C3E50', //(optional)Add the hex for background colour to be set for gateway.
    logo_url: 'https://your-square-product-logo-image-url-here.png', //(required)
    otp_allowed: 'y', // (optional) default value is 'y'
    fingerprint_allowed: 'n', //(optional) default value 'y'
    iris_allowed: 'n', //(optional) default value 'y',
    phone_auth: 'n', //(optional) default value 'n',
    draggable_sign: 'y', //(optional) default value ‘n’,
    google_sign: 'n' //(optional) default value ‘y’
};
```


<a name="esignEventTitle"></a>
### 7. Handle Events 

Events are the way to acknowledge consumer of the SDK that something has happened. Listening of the events is same for each event.

```html
<script>
   zoop.on('close', (message) => {
      // handle the event
   });
   zoop.on('esign-result', (message) => {
      // handle the event
   });
   // and so on...
</script>

```

The `message` parameter is an object which has `action`, `payload`, and `isError` properties.

| Event Name (action)       | Occurs When                                                | payload | isError |
| ------------------------- | :--------------------------------------------------------- | :-----: | ------- |
| `close`                   | User manually clicks on the close icon                     |   No    | false   |
| `consent-denied`          | When user denies to it's consent for e-sign                |   No    | false   |
| `otp-error`               | When the user enters wrong otp more than 3 times in e-sign |   Yes   | true    |
| `gateway-error`           | If gateway encounters an unexpected error                  |   Yes   | true    |
| `esign-result`            | When signed in attached to the PDF                         |   Yes   | Maybe   |

<a name="message-payload"></a>
### 7.1 `payload`
The `message` that you will receive, in case of any type of event, may or may not have the `payload` property. In case of esign the payload would be one of the following.

<a name="message-esign-result"></a>
#### 7.1.1 `esign-result`
When you receive an event named `esign-result` that may or may not be an error type. You can check whether the event is an error or not with `isError` property. If the value is `true` then it's a error response. In case of success you will receive [success JSON response](#esignRespInitSuccess) and for error you will receive [error JSON response](#esignRespInitError)

<a name="message-otp-error"></a>
#### 7.1.2 `otp-error`
The `otp-error` event occurs when the user has entred wrong OTP more than 3 times. The format of the payload is given below.
```json
{
    "message": "Maximum OTP Tries Reached, Transaction Failed",
    "statusCode": 422
}
```

<a name="message-gateway-error"></a>
#### 7.1.3 `gateway-error`
When gateway encounters an unexpected error this event is fired. The format of payload is given below.
```json
{
    "message": "Transaction is already completed or errored out.",
    "statusCode": "412"
}
```

<a name="esignRespInit"></a>
### 8. Response Format Sent On `responseURL` (Added In Init API Call)
<a name="esignRespInitSuccess"></a>
#### 8.1 Success JSON Response Format For E-Sign Success
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
#### 8.2 Error JSON Response Format For E-Sign Error
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
### 9. Pulling Transaction Status At Backend 
In case the POST API call to the response URL fails, there is an option to pull the transaction status from backend
using the same **Esign Transaction Id**.

<a name="esignStatusURL"></a>
#### 9.1 URL
```
GET {{base_url}}/gateway/esign/:esign_transaction_id/fetch/
```
    
<a name="esignStatusResp"></a>    
#### 9.2 Response Params:
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

<a name="annexure"></a>
### 10. Annexure – Transaction Status
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
