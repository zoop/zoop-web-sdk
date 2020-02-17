# zoop-web-sdk
AadhaarAPI | ZOOP web SDK for E-sign and Bank Statement Analysis Gateway

## AadhaarAPI Bank Statement Analysis(BSA) Gateway 

<a name="bsaIntro"></a>
### 1. INTRODUCTION 

**Bank statement analyzer** predicts the worthiness of an individual and his/her credibility for a loan, after analyzing a considerable number of bank transactions, with the assistance of complex algorithm, text extraction, data categorization and smart analysis techniques.

<a name="bsaProcessFlow"></a>
### 2. PROCESS FLOW
1. At your backend server, Initiate the BSA transaction using a simple Rest API [POST] call. Details of these are available in the documents later. You will require API key and Agency Id for accessing this API which can be generated from the Dashboard.
2. This gateway transaction id then needs to be communicated back to the frontend via our Web SDK.
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
### 5. WEBHOOK

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

