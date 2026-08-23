export type DigitapApi = { name: string; method: string; url: string; headers: string[]; body: string };
export const DIGITAP_APIS: DigitapApi[] = [
  {
    "name": "Digital KYC > CKYC > Download",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ckyc/v1/download",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"754\",\n    \"auth_factor\": \"6286122007\",\n    \"auth_factor_type\": \"PIN_YOB\",\n    \"ckyc_no\": \"51144238504350\"\n}"
  },
  {
    "name": "Digital KYC > CKYC > Search",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ckyc/v1/search",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"139\",\n    \"identifier\": \"CYSPD3478E\",\n    \"identifier_type\": \"PAN\"\n}"
  },
  {
    "name": "Digital KYC > OKYC > SDK > GenerateUrl",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ent/v1/kyc/generate-url",
    "headers": [
      "Authorization"
    ],
    "body": "{\n\t\"serviceId\": 3,\n    \"uid\": \"123456\",\n    \"firstName\": \"Walter\",\n    \"lastName\": \"White\",\n    \"mobile\": \"9988776655\",\n    \"emailId\": \"White@pablos.in\",\n\t\"isSendOtp\": true\n}"
  },
  {
    "name": "Digital KYC > OKYC > Backend > GetCaptcha",
    "method": "GET",
    "url": "{{BASE_URL_SVC}}/ent/v3/kyc/get-captcha",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "Digital KYC > OKYC > Backend > InitiateKyc",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/ent/v3/kyc/intiate-kyc",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"uniqueId\": \"manoj123\",\n    \"captcha\": \"T2gN4\",\n    \"captchaTxnId\": \"lCuq4iuEumnl\",\n    \"uid\": \"595747076198\",\n    \"cookieValue\": \"SESSION=MTJlMWY3ODktODM4NC00ZmNiLTkwNTQtYWViMWU2Y2M5ZmM5\"\n}"
  },
  {
    "name": "Digital KYC > OKYC > Backend > InitiateKycAuto",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/ent/v3/kyc/intiate-kyc-auto",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"uniqueId\": \"manojxyz123\",\n    \"uid\": \"595747076198\"\n}"
  },
  {
    "name": "Digital KYC > OKYC > Backend > SubmitOtp",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/ent/v3/kyc/submit-otp",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"transactionId\": \"686471951537587524\",\n    \"fwdp\": \"tDJtJBbZEyjxQxY2Ngx9EkOfPJXezqYQ2onhPS_gAHjmEwNwxqWtVQqVltU2cu1anixF2T_XI5ol2K5q79mfe-X2xzuwvFL6nFcPQVR6nPyq931oxP9cUM6O2932Q3W8VMIP8OyISdr1XZAVZyjGCAtqWuWiJL10gOHuo2INBmIV5fDfzNm5dSBemagRlIGr1VUSWxypViAjHR7DQufdWljaxndRMBjTHXfG4XiQAJBjzeCf5xxHE-JVZV8gPTp9LicJQoCICDan2ycLtp2NV95B4Wj885Ut8N3NF94x\",\n    \"codeVerifier\": \"XGtbx7HwJLAssAi55VmNmulKR43PWIQnJbqYDudkAnjkedIgFbLTWWnv5mrZRlnlLAywAf0NNhu3CExHIkn6EqKUaOE9d6bDIACZQiNMSJmudMjzfXla2GoYSMvazQ43\",\n    \"otp\": \"404776\",\n    \"shareCode\": \"1234\",\n    \"isSendPdf\": true\n}"
  },
  {
    "name": "Digital KYC > OKYC > Backend > ResendOTP",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/ent/v3/kyc/resend-otp",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"uniqueId\": \"manoj1234\",\n    \"uid\": \"595747076198\",\n    \"transactionId\": \"135693852531114657\",\n    \"fwdp\": \"E3mEnSEmWjiHNPLG4nvWh8e-lUUxJ53NdRRoky5-YCYMus50EGKPqf3Smxa97ca1vdc2tWPqeLMTck9aVcAjafCul8lD-m_GbOsWhCbpyyyFPbiqXEr_wlwBNgIsrJNL9WKLRMNFdVME-fzPw6Ctg8skB6eMuJuCZ9ShXmNvYEVM0ENiYrIq9-YZnolB9ESvHfvxyia5JM95L1hLWVv-s2Z3Ljrz_1sDwv20LGHHooNLh-eK5P2InP2PPvdiUojaYCHXq0B44B3FOw8y0UxbYZCFUh_ee2MNFVIUeDZWmGSXeHfV85ZYeYcWDT041UdgEd4e7YLd8SXaVizP1uVyw34wJa9CqN0AGOd51z3dftCmc5xuSHXjOB-L_BC9eMqhi_H9FXLXQ8B9uScFbAswPLmelS8XsmYmSYnQdPGTe_1EvMPPYf76F0C2aEkZK3Oje22jb8f7SYkjKRYcotfEsMdtxEKWeDZh1Rlhkm"
  },
  {
    "name": "Digital KYC > OKYC > GetStatus",
    "method": "GET",
    "url": "{{BASE_URL_API}}/ent/v1/kyc/get-status",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"transactionId\": \"686471951537587524\"\n}"
  },
  {
    "name": "Digital KYC > OKYC > GetPaperlessXml",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ent/v1/kyc/api/get-paperless",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\n    \"transactionId\": \"686471951537587524\"\n}"
  },
  {
    "name": "Digital KYC > VKYC > GetVkycDetailsFromTransactionId",
    "method": "POST",
    "url": "{{BASE_URL_API}}/demo/v1/vkyc/additional-info/transaction/id-info",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\n    \"transactionIds\": [\n        \"6062604b-30b1-49d5-bd42-5f25ca571727\"\n    ]\n}"
  },
  {
    "name": "Digital KYC > VKYC > GetTransactionIdFromUniqueId",
    "method": "POST",
    "url": "{{BASE_URL_API}}/demo/v1/vkyc/additional-info/transaction/session-info-uniqueid",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\n    \"uniqueId\": \"CHS1\"\n}"
  },
  {
    "name": "Digital KYC > VKYC > GetTransactionIdFromUniqueIdList",
    "method": "POST",
    "url": "{{BASE_URL_API}}/demo/v1/vkyc/additional-info/transaction/session-info-uniqueids",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\n    \"uniqueIds\": [\n        \"CHS2\",\n        \"CHS1\"\n    ]\n}"
  },
  {
    "name": "Digital KYC > VKYC > GetTransactionIdsOverSpecificTime",
    "method": "POST",
    "url": "{{BASE_URL_API}}/demo/v1/vkyc/additional-info/transaction/ids",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\n    \"from\": \"2022-03-20 00:00:00\",\n    \"to\": \"2022-03-30 00:00:00\"\n}"
  },
  {
    "name": "Digital KYC > VKYC > GenerateUserLead",
    "method": "POST",
    "url": "{{BASE_URL_API}}/demo/v1/vkyc/okyc/user/activate",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\n    \"fname\":\"Walter\",\n    \"applicationNumber\":\"whitexyz123\",\n    \"mobile\":\"9988776655\",\n    \"email\": \"White@pablos.in\",\n    \"skipOkyc\":\"TRUE\",\n    \"sendSms\":true,\n    \"sendEmail\": true\n}"
  },
  {
    "name": "Digital KYC > VKYC > GetPaperlessXml",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ent/v1/kyc/api/get-paperless",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\n    \"transactionId\": \"686471951537587524\"\n}"
  },
  {
    "name": "Digital KYC > Digilocker > GenerateUrl",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ent/v1/kyc/generate-url",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"serviceId\":\"4\",\n    \"uid\":\"UA068\",\n    \"firstName\":\"John\",\n    \"lastName\":\"Doe\",\n    \"mobile\":\"6938495029\",\n    \"emailId\":\"john@gmail.com\"\n}\n"
  },
  {
    "name": "Digital KYC > Digilocker > GetDigilockerDetails",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ent/v1/kyc/get-digilocker-details",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\n    \"transactionId\": \"330808003929792272\"\n}"
  },
  {
    "name": "Digital KYC > MobileNoValidation (Aadhaar XML) > ValidateMobile",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ent/v1/kyc/api/validate-mobile",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\n    \"transactionId\": \"551588082179715115\",\n    \"mobileNo\": \"8122949665\"\n}"
  },
  {
    "name": "Digital KYC > Unified Digital KYC > Generate URL",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/kyc-unified/v1/generate-url/",
    "headers": [
      "Authorization",
      "Content-Type"
    ],
    "body": "{\n    \"redirectionUrl\": \"https://www.digitap.ai/\",\n    \"uniqueId\": \"abcd\",\n    \"expiryHours\": 72\n}"
  },
  {
    "name": "Digital KYC > Unified Digital KYC > Get Details",
    "method": "GET",
    "url": "{{BASE_URL_SVC}}/kyc-unified/v1/<unified_transactionID>/details/",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "OCR > KYC > Individual > PAN OCR",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ocr/v1/pan",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "OCR > KYC > Individual > AADHAAR OCR & MASKING",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ocr/v1/aadhaar",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "OCR > KYC > Individual > VOTER CARD OCR",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ocr/v1/voter",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "OCR > KYC > Individual > PASSPORT OCR",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ocr/v1/passport",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "OCR > KYC > Individual > DL OCR",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ocr/v1/dl",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "OCR > KYC > Bussiness > GST OCR",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ocr/v1/gst",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "OCR > KYC > Bussiness > COI OCR",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ocr/v1/coi",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "OCR > BANK > IFSC & ACCOUNT NUMBER EXTRACTION",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ocr/v1/bspb",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "OCR > BANK > CHEQUE OCR",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ocr/v1/cheque",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "FM/FL > Backend APIs > Face Match(FM)",
    "method": "POST",
    "url": "{{BASE_URL_API}}/fmfl/v2/face-match",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "FM/FL > Backend APIs > Face Liveness Backend(FL)",
    "method": "POST",
    "url": "{{BASE_URL_API}}/fmfl/v3/face-liveness",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "FM/FL > Backend APIs > Face Detection(FD)",
    "method": "POST",
    "url": "{{BASE_URL_API}}/fmfl/v1/face_detection",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Related > PAN Details > PAN Details V4 > Request",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v4/pan_details/request",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"Demo_24_03_2025\",\n    \"pan\": \"EXXXP0007X\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Related > PAN Details > PAN Details V4 > Status",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v4/pan_details/status",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\n    \"request_id\": \"1f00a0xx-dxx0-6f92-921c-0c9e09f1b0b5\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Related > PAN Details > PAN Details Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/pan_details",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"pan\": \"BXXPB0101P\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Related > PAN Details > PAN Details Validation BC",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/pan_details_bc",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"pan\": \"DXXPXX702X\",\n    \"name\": \"Arun Kumar\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Related > PAN Details Plus > PAN Details Plus",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/pan_details_plus",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"pan\": \"AAAPA0000X\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Related > ITR Download > Generate URL",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/itr/generate_url",
    "headers": [
      "Authorization"
    ],
    "body": "{\r\n    \"client_ref_num\": \"digitap-itr-test\",\r\n    \"pan\": \"ABCDE9106L\",\r\n    \"callback_url\": \"https://webhook.site/e8b4fce4-5c81-4e40-a8d0-7c8e51abde1f\",\r\n    \"return_url\": \"https://www.digitap.ai?txn_id=%s&status=%s\",\r\n    \"is_editable\": 1\r\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Related > ITR Download > Status",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/itr/status",
    "headers": [
      "Authorization"
    ],
    "body": "{\r\n    \"request_id\": \"{{request-id-string}}\"\r\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Related > ITR Download > Download Report",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/itr/download",
    "headers": [
      "Authorization"
    ],
    "body": "{\r\n    \"txn_id\": \"{{txn-id-string}}\"\r\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Related > PAN Basic Validation V1",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/pan_basic",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"pan\": \"BLZPB7123P\",\n    \"name\": \"Sunil\",\n    \"client_ref_num\": \"test\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Related > PAN Basic Validation V2",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v2/pan_basic",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"pan\": \"AAAPW9785A\",\n    \"name\": \"VINITABHANUSHAL\",\n    \"dob\": \"09/02/1928\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Related > PAN to Masked Aadhaar Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/pan_to_masked_aadhaar",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"pan\": \"BLZPB7123P\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Related > PAN to F'Name",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/pan_to_fname",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"pan\": \"BLZPB7123P\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Related > PAN to Name",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/pan_to_name",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"pan\": \"BLZPB7123P\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Related > PAN Account Link",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/pan-account-linkage",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"account_number\": \"30909090909\",\n    \"ifsc_code\": \"SBXX0000909\",\n    \"name\": \"Pranav\",\n    \"pan\": \"CKXXX9090X\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Related > ITR Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/itr_basic",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"1234\",\n    \"pan\":\"NVXXX1018B\"\n}\n"
  },
  {
    "name": "Validation > KYC (for Individual) > Aadhaar Related > Aadhaar Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/aadhaar",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"121\",\n    \"aadhaar\": \"649144731123\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > Aadhaar Related > Aadhaar Basic Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/basic_aadhaar",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"aadhaar\" : \"988128196772\",\n    \"client_ref_num\" : \"test991\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > Aadhaar Related > Aadhaar to Masked PAN Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/aadhaar_to_masked_pan",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"aadhaar\": \"649144731123\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN Aadhaar Link Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/pan_aadhaar_link",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"pan\": \"BLZPB7123P\",\n    \"aadhaar\": \"649144731123\",\n    \"client_ref_num\": \"test\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > Voter Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/voter",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"epic_number\": \"KKV6390123\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > Passport Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/passport",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"file_number\": \"CB1078650050123\",\n    \"dob\": \"11/07/1986\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > Driving Licence Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/dl",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\n    \"dl_number\": \"KA2621130097346\",\n    \"client_ref_num\": \"469\",\n    \"dob\": \"02/12/1993\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > PAN 206AB Compliance Status Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/form206ab_compliance_status",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"pan\": \"BLZPB7123P\"\n}"
  },
  {
    "name": "Validation > KYC (for Individual) > DL Validation Plus",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/dl_plus",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"dob\": \"25/02/1999\", \n    \"dl_number\": \"XX1230240001010\", \n    \"client_ref_num\": \"test\"\n}"
  },
  {
    "name": "Validation > Asset Validation > Vehicle Number (RC) Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/rc",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\n    \"reg_no\": \"KA35FG2289\",\n    \"client_ref_num\": \"613\"\n}"
  },
  {
    "name": "Validation > Asset Validation > Reverse RC Details API",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/reverse_rc_details",
    "headers": [
      "Content-Type"
    ],
    "body": "{\n    \"chassis_no\": \"MALA251ALJM625978\", \n    \"client_ref_num\": \"25d733a3-c435-4d27-be07-eab525b013fd\"\n}"
  },
  {
    "name": "Validation > Asset Validation > Vehicle RC E-Challan Details API",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/echallan",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"reg_no\": \"RJXXGAXXX1\",\n    \"client_ref_num\": \"a8386f2c\"\n}"
  },
  {
    "name": "Validation > Asset Validation > Vehicle RC Validation Plus",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/rc_plus",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"reg_no\": \"MH0XXXXX42\",\n    \"client_ref_num\": \"abc\"\n}"
  },
  {
    "name": "Validation > Asset Validation > Reverse RC Lookup",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/reverse_rc_lookup",
    "headers": [
      "Content-Type",
      "authorization"
    ],
    "body": "{\n    \"chassis_no\": \"MAXX011AXXX1011010\",\n    \"engine_no\": \"TXX1X10010\",\n    \"client_ref_num\": {{randomint}}\n}"
  },
  {
    "name": "Validation > Asset Validation > Reverse RC Details",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/reverse_rc_details",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\n    \"chassis_no\": \"XXXX011XXXX6101010\",\n    \"client_ref_num\": {{randomint}}\n }"
  },
  {
    "name": "Employment Verification - EV > EV using EPFO > Establishment Search > est search request",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/epfo/est_search",
    "headers": [
      "Authorization"
    ],
    "body": "{\r\n    \"client_ref_num\": \"-test\",\r\n    \"est_name\": \"MODERN SOLUTIONS\",\r\n    \"est_details_count\": \"10\",\r\n    \"match_percentage\": \"0.6\"\r\n}"
  },
  {
    "name": "Employment Verification - EV > EV using EPFO > EPFO Employer Search > Request",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v1/employee_name_search/request",
    "headers": [
      "Authorization"
    ],
    "body": "{      \r\n    \"client_ref_num\": \"test\", \r\n    \"employee_name\":\"FLYNN WHITE\",\r\n\t\"employer_name\":\"PABLOS\"\r\n}"
  },
  {
    "name": "Employment Verification - EV > EV using EPFO > EPFO Employer Search > Status",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v1/employee_name_search/status",
    "headers": [
      "Authorization"
    ],
    "body": "{\r\n    \"request_id\": \"dgfbbd3\"\r\n}"
  },
  {
    "name": "Employment Verification - EV > EV using TDS Quarterly > TDS details",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v1/tds_quarterly",
    "headers": [
      "Authorization"
    ],
    "body": "{\n     \"client_ref_num\":\"test\",\n     \"pan\": \"BLZPB7819P\",\n     \"tan\": \"BLRD14882A\",\n     \"financial_year\": \"2021-22\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Basic  v1 > With all Inputs",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/uan_basic",
    "headers": [
      "Authorization"
    ],
    "body": "{      \n    \"client_ref_num\": \"12341234\", \n    \"mobile\": \"9840000602\",\n    \"employee_name\": \"Walter White\",\n    \"employer_name\": \"Saboo auto\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Basic  v1 > Only Mobile as Input",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/uan_basic",
    "headers": [
      "Authorization"
    ],
    "body": "{      \r\n    \"client_ref_num\": \"12341234\", \r\n    \"mobile\": \"9840000602\"\r\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Basic  v1 > Mobile and Employee Name as Input",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/uan_basic",
    "headers": [
      "Authorization"
    ],
    "body": "{      \n    \"client_ref_num\": \"12341234\", \n    \"mobile\": \"9840000602\",\n    \"employee_name\": \"Walter White\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Basic  v2 > SEARCH BY LOOKUP",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v2/uan_basic/sync",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"4321\",\n    \"employee_name\": \"Walter WHITE\",\n    \"dob\": \"1998-01-24\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Basic  v2 > SEARCH BY UAN",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v2/uan_basic/sync",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"abc\",\n    \"uan\": \"101212525096\",\n    \"employee_name\": \"SAUL GOODMAN\",\n    \"employer_name\": \"\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Basic  v3 > SEARCH BY LOOKUP",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v3/uan_basic/sync",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"4321\",\n    \"pan\": \"FDKPM2874Q\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Basic  v3 > SEARCH BY UAN",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v3/uan_basic/sync",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"abc\",\n    \"uan\": \"100722104383\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Basic  v4 > SEARCH BY LOOKUP",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v4/uan_basic/sync",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"4321\",\n    \"pan\": \"POGPD5203C\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Basic  v4 > SEARCH BY UAN",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v4/uan_basic/sync",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"abc\",\n    \"uan\": \"101885823072\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Basic  v5 > SEARCH BY LOOKUP",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v5/uan_basic/sync",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"4321\",\n    \"pan\": \"FOAPC5204C\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Basic  v5 > SEARCH BY UAN",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v5/uan_basic/sync",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"abc\",\n    \"uan_list\": [\"100153421234\", \"101346421234\"]\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Advanced v1 > UAN Advanced",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/uan_advanced",
    "headers": [
      "Authorization"
    ],
    "body": "{      \n    \"client_ref_num\": \"12341234\", \n    \"mobile\": \"9649143253\",\n    \"employee_name\": \"WALTER WHITE\",\n    \"employer_name\": \"PABLOS\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Advanced v2 > SEARCH BY LOOKUP",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v2/uan_advanced/sync",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"1234\",\n    \"employee_name\": \"\",\n    \"dob\": \"\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Advanced v2 > SEARCH BY UAN",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v2/uan_advanced/sync",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"abc\",\n    \"uan\": \"\",\n    \"employee_name\": \"\",\n    \"employer_name\": \"\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Advanced v3 > SEARCH BY LOOKUP",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v3/uan_advanced/sync",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"4321\",\n    \"pan\": \"OLSPB5647P\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Advanced v3 > SEARCH BY UAN",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v3/uan_advanced/sync",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"abc\",\n    \"uan\": \"101885824183\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Advanced v4 > SEARCH BY LOOKUP",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v4/uan_advanced/sync",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"4321\",\n    \"pan\": \"GTFPU5XXXX\"\n}"
  },
  {
    "name": "Employment Verification - EV > EV using Mobile/UAN - Advanced v4 > SEARCH BY UAN",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v4/uan_advanced/sync",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"abc\",\n    \"uan\": \"10343475XXXX\"\n}"
  },
  {
    "name": "Employment Verification - EV > UAN Lookup > UAN Lookup",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/uan_lookup",
    "headers": [
      "Authorization"
    ],
    "body": "{      \n    \"client_ref_num\": \"3617cfed-ba79-4844-9c1e-20647b378a4b\", \n    \"mobile\": \"8130300943\"\n}"
  },
  {
    "name": "Employment Verification - EV > UAN PASSBOOK > get_otp",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/uan_passbook/get_otp",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"uan\": \"100348029719\",\n    \"client_ref_num\": \"1234\"\n}"
  },
  {
    "name": "Employment Verification - EV > UAN PASSBOOK > get_passbook",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/uan_passbook/get_passbook",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"otp\": \"630829\",\n    \"txn_id\": \"daf427a\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > GSTIN Related > GSTIN Authentication API Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/gst",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"gstin\": \"27AAACR5055K1Z7\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > GSTIN Related > GSTIN Authentication Advanced Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/gstadvanced",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"gstin\": \"27AAACR5055K1Z7\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > GSTIN Related > GSTIN by PAN Search Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/gstpansearch",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\", \n    \"pan\": \"AAACR5055K\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > GSTIN Related > GSTIN to Contact Details",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/gst/gst_to_contacts",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"gstin\": \"33AAAPM3164F1ZF\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > GSTIN Related > Contact To GST API",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/contact_to_gst",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"mobile\": \"9999999999\",\n    \"client_ref_num\": \"123\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > GSTIN Related > Company Name to GST",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/gst/company_name_to_gst",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\":\"now\",\n    \"company_name\":\"air\", \n    \"output_count\": 10\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > Udyam Related > Udyam Authentication Basic Validaiton > Udyam Authentication Basic",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/udyam_authentication/basic",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"udyam_reg_no\": \"UDYAM-AP-06-0000093\",\n    \"client_ref_num\": \"2e828ef2-f580-443e-a371-79231752ecae\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > Udyam Related > Udyam Authentication Advanced (OTP based) Validation > Generate OTP",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/udyam_authentication/advanced/generate_otp",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"udyam_reg_no\": \"UDYAM-AP-06-0000093\",\n    \"mobile_number\": \"9876543210\",\n    \"client_ref_num\": \"313bb45f-d207-4f6c-884b-97fc2c6e693b\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > Udyam Related > Udyam Authentication Advanced (OTP based) Validation > Submit OTP",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/udyam_authentication/advanced/submit_otp",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"otp\": \"054278\",\n    \"request_id\": \"ba946942-2034-4485-aede-1692f5460b33\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > Udyam Related > Mobile to Udyam Lookup (OTP based) Validation > Generate OTP",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/mobile_to_udyam/lookup/generate_otp",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"mobile_number\": \"9876543210\",\n    \"client_ref_num\": \"27bcd8b6-4de6-4a4c-8da5-fc6ef44a6969\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > Udyam Related > Mobile to Udyam Lookup (OTP based) Validation > Submit OTP",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/mobile_to_udyam/lookup/submit_otp",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"otp\": \"502750\",\n    \"request_id\": \"e8865d5c-4f1a-498c-b8cf-bd4022417a61\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > Udyam Related > PAN to Udyam Verification Basic > Success",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/pan_to_udyam_basic",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\r\n    \"pan\": \"AXXXXXXXXM\",\r\n    \"client_ref_num\": \"pan_udyam_test\"  \r\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > Udyam Related > Mobile to Udyam > Success",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/mobile_to_udyam",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\r\n    \"mobile\": \"6999999996\",\r\n    \"client_ref_num\": \"mobile_udyam_test\"  \r\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > DIN Related > PAN TO DIN",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/pan_to_din",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"pan\": \"AXXXG4371A\",\n    \"client_ref_num\": \"abc\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > DIN Related > DIN TO PAN",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/din_to_pan",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"din\": \"0000XXXX\",\n    \"client_ref_num\": \"abc\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > DIN Related > DIN basic",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/din_basic",
    "headers": [
      "Authorization"
    ],
    "body": "{\r\n    \"client_ref_num\": \"test\",\r\n    \"din\": \"00000001\"\r\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > DIN Related > DIN Advanced",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyc/v1/din_advanced",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > CIN Related > CIN (COI) Basic Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v1/coi",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"cin\": \"U72XXXXXXXXXXXXXXX541\",\n    \"company_id\": \"\",\n    \"client_ref_num\": \"test\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > CIN Related > CIN (COI) Advanced Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v1/coi_advanced",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"cin\": \"U72XXXXXXXXXXXXXXXX53\",\n    \"company_id\": \"\",\n    \"client_ref_num\": \"test\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > CIN Related > CIN Enhanced",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v1/cin_enhanced",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test\",\n    \"cin\": \"U72XXXXXXXXXXXXXXX553\",\n    \"company_id\": \"AXE-9XX0\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > CIN Related > Company to CIN",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v1/company_to_cin",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"abc\",\n    \"company_name\": \"dummy\",\n    \"output_count\": \"10\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > TAN Related > TAN to Company",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/tan_to_company",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"tan\": \"BLRD1XXXXA\",\n    \"client_ref_num\": \"123\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > Company To Pan > company name to pan",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/company_to_pan",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"company_name\": \"digitap.ai\",\n    \"output_count\": \"10\",\n    \"client_ref_num\": \"123\",\n    \"search_by_trade_name\": false\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > FSSAI Validation > FSSAI Validation",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/fssai_validation",
    "headers": [
      "Authorization"
    ],
    "body": "{\n  \"client_ref_num\": \"abcd1234\",\n  \"license_number\": \"10014042001477\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > IEC Validation > IEC Validation Basic > Success Case",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/iec_validation_basic",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\n    \"iec_code\": \"5000000003\",\n    \"company_name\": \"Henna Pvt Ltd\",\n    \"client_ref_num\": \"test\"\n}"
  },
  {
    "name": "Company Verification > KYB (KYC for Business) > IEC Validation > IEC Validation Advanced > Success Case",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/kyb/v1/iec_validation_advanced",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\n    \"iec_code\": \"5010101013\",\n    \"company_name\": \"abc\",\n    \"client_ref_num\": \"test\"\n}"
  },
  {
    "name": "Company Verification > Company name finder > Search",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/cv/v1/company_search",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"employer_name\": \"PABLOS\",\n    \"client_ref_num\": \"test\"\n}"
  },
  {
    "name": "Device Analytics > Backend > GetSyncInfoFromUserId",
    "method": "POST",
    "url": "{{BASE_URL_API}}/sync/get-sync-id",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\n    \"userId\": \"1234\"\n}"
  },
  {
    "name": "Device Analytics > Backend > GetSyncInfoListFromUserId",
    "method": "POST",
    "url": "{{BASE_URL_API}}/sync/get-sync-idlist",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\n    \"userId\": \"1234\"\n}"
  },
  {
    "name": "Device Analytics > Backend > GetUserScore",
    "method": "POST",
    "url": "{{BASE_URL_API}}/sync/get-user-score",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\n    \"syncId\":\"1616774550314_1234\"\n}"
  },
  {
    "name": "Device Analytics > Backend > EnableUserSync",
    "method": "POST",
    "url": "{{BASE_URL_API}}/sync/enable-user-sync",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\n    \"userIds\": [\n        \"1234\"\n    ]\n}"
  },
  {
    "name": "Digital Profiling > Digitap Common Account Detection API > Email Account Detection > Create_request",
    "method": "POST",
    "url": "{{BASE_URL_API}}/dp/email_check/v1/request",
    "headers": [
      "Authorization"
    ],
    "body": "{\n   \"client_ref_num\":\"test\",\n   \"email\":\"sunil.123@gmail.com\",\n   \"requested_services\":\"flipkart,amazon,paytm,facebook,instagram,twitter,linkedin\"\n}"
  },
  {
    "name": "Digital Profiling > Digitap Common Account Detection API > Email Account Detection > Status_check",
    "method": "POST",
    "url": "{{BASE_URL_API}}/dp/email_check/v1/status",
    "headers": [
      "Authorization"
    ],
    "body": "{\n   \"request_id\":\"dgmd1335a9\"\n}"
  },
  {
    "name": "Digital Profiling > Digitap Common Account Detection API > Mobile Account Detection > Create_request",
    "method": "POST",
    "url": "{{BASE_URL_API}}/dp/mobile_check/v1/request",
    "headers": [
      "Authorization"
    ],
    "body": "{\n   \"client_ref_num\":\"test\",\n   \"mobile\":\"9469612905\",\n   \"requested_services\":\"flipkart,amazon,paytm,facebook,instagram,twitter,linkedin,whatsapp\"\n}"
  },
  {
    "name": "Digital Profiling > Digitap Common Account Detection API > Mobile Account Detection > Status_check",
    "method": "POST",
    "url": "{{BASE_URL_API}}/dp/mobile_check/v1/status",
    "headers": [
      "Authorization"
    ],
    "body": "{\n   \"request_id\":\"dgmd142a06\"\n}"
  },
  {
    "name": "Digital Profiling > WhatsApp Number Check API > WhatsApp Number Check API",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/dp/v1/whatsapp_number_check",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"digitap-wnc-test\",\n    \"mobile\": \"9469612905\"\n}"
  },
  {
    "name": "Digital Profiling > WhatsApp Advanced API > WhatsApp Advanced API",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/dp/v1/whatsapp_advanced",
    "headers": [
      "Authorization"
    ],
    "body": "{\r\n    \"client_ref_num\" : \"test\",\r\n    \"mobile\": \"1234567890\"\r\n}"
  },
  {
    "name": "Ecom Data > Generate URL > Generate URL with specifing website_id",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/ecom-data/generateurl",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"payload\": {\n        \"client_ref_num\": \"test\",\n        \"txn_completed_cburl\": \"https://typedwebhook.tools/webhook/97e1ecb0-5f35-424f-a224-af7932441a0b\",\n        \"return_url\": \"https://www.digitap.ai?txn_id=%s&status=%s\",\n        \"website\": \"1\"\n    }\n}"
  },
  {
    "name": "Ecom Data > Generate URL > Generate URL with specifing username editable",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/ecom-data/generateurl",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"payload\": {\n        \"client_ref_num\": \"test\",\n        \"txn_completed_cburl\": \"https://typedwebhook.tools/webhook/97e1ecb0-5f35-424f-a224-af7932441a0b\",\n        \"return_url\": \"https://www.digitap.ai?txn_id=%s&status=%s\",\n        \"username\": \"+919876543210\",\n        \"is_editable\": \"true\"\n    }\n}"
  },
  {
    "name": "Ecom Data > Generate URL > Generate URL with specifing username non editable",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/ecom-data/generateurl",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"payload\": {\n        \"client_ref_num\": \"test\",\n        \"txn_completed_cburl\": \"https://typedwebhook.tools/webhook/97e1ecb0-5f35-424f-a224-af7932441a0b\",\n        \"return_url\": \"https://www.digitap.ai?txn_id=%s&status=%s\",\n        \"username\": \"+919876543210\",\n        \"is_editable\": \"false\"\n    }\n}"
  },
  {
    "name": "Ecom Data > Generate URL > Generate URL with specifing order duration",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/ecom-data/generateurl",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"payload\": {\n        \"client_ref_num\": \"test\",\n        \"txn_completed_cburl\": \"https://typedwebhook.tools/webhook/97e1ecb0-5f35-424f-a224-af7932441a0b\",\n        \"return_url\": \"https://www.digitap.ai?txn_id=%s&status=%s\",\n        \"order_duration\": \"3+\"\n    }\n}"
  },
  {
    "name": "Ecom Data > Status",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/ecom-data/statuscheck",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"payload\": {\n        \"request_id\": \"1007\"\n    }\n}"
  },
  {
    "name": "Ecom Data > Retrieve Report",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/ecom-data/retrievereport",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"payload\": {\n        \"txn_id\": \"daf189d\",\n        \"report_subtype\": \"type1\",\n        \"report_type\": \"json\"\n    }\n}"
  },
  {
    "name": "Ecom Data > Website List",
    "method": "GET",
    "url": "{{BASE_URL_SVC}}/ecom-data/websites",
    "headers": [
      "Authorization"
    ],
    "body": ""
  },
  {
    "name": "Mobile Related APIs > Mobile Number Validation through OTP(async) > initiate_request",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/mobile_number_validation/",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\n    \"purpose\": \"initiate_request\",\n    \"client_ref_num\": \"testdigi12\",\n    \"mobile_num\": \"1234569870\",\n    \"txn_complete_cburl\": \"https://webhook.site/9de1cdbc-f676-4b3a-819d-3a72d039d68c\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile Number Validation through OTP(async) > submit_otp",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/mobile_number_validation/",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\n    \"purpose\": \"submit_otp\",\n    \"otp_value\":\"992472\",\n    \"txn_id\": \"daf49xx\",\n    \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY1NjI3MjE2IiwidHhuX2F1dG9faWQiOjE5NzgsImV4cCI6MTY0ODcxNDk0N30.pMwCGgmV2xipJ9Xk7xgJxEOIzV-JcwlER7i-z9ytxxx\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile Number Validation through OTP(async) > get_status",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/mobile_number_validation/",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\n    \"purpose\": \"get_status\",\n    \"txn_id\": \"daf49xx\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile Number Validation through OTP(sync) > initiate_request",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/telecom/initiate-request",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"uat7\",\n    \"mobile_number\": \"971081XXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile Number Validation through OTP(sync) > validate_request",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/telecom/validate-request",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"uat\",\n    \"otp_value\":\"3330\",\n    \"txn_id\": \"daf5df7\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile Number Lookup (without OTP) > Mobile Number Lookup Basic",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/mobile/v1/mobile-lookup",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123\",\n    \"mobile_number\": \"7501277797\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile Number Lookup (without OTP) > Mobile Number Lookup with Customer Details",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/mobile/v1/mobile-lookup",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123\",\n    \"mobile_number\": \"7501277797\",\n    \"options\": [\n        \"customer_details\"\n    ]\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile Number Lookup (without OTP) > Mobile Number Lookup with Porting History & Last Ported Date",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/mobile/v1/mobile-lookup",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123\",\n    \"mobile_number\": \"7501277797\",\n    \"options\": [\n        \"porting_history\",\n        \"last_ported_date\"\n    ]\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to Name Lookup > Mobile to Name Lookup without Name Match",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-name-lookup",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"7501277797\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to Name Lookup > Mobile to Name Lookup with Name Match",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-name-lookup",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"75012XXXXX\",\n    \"name\": \"SuXXXXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile Number Vintage > mobile_vintage",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-vintage-lookup",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"d3\",\n    \"mobile\": \"887734XXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to UPI Lookup - Basic > Mobile to UPI Lookup without Name Match",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-upi-lookup",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"750127XXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to UPI Lookup - Basic > Mobile to Name Lookup with Name Match",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-upi-lookup",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"75012XXXXX\",\n    \"name\": \"SuXXXXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to UPI Lookup - Advanced > Mobile to UPI Lookup without Name Match",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-upi-lookup-advanced",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"750127XXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to UPI Lookup - Advanced > Mobile to Name Lookup with Name Match",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-upi-lookup-advanced",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"75012XXXXX\",\n    \"name\": \"SuXXXXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to UPI Lookup - Enhanced > Mobile to UPI Lookup without Name Match - Individual",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-upi-lookup-enhanced",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"955370XXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to UPI Lookup - Enhanced > Mobile to UPI Lookup without Name Match - Merchant",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-upi-lookup-enhanced",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"814099XXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to UPI Lookup - Enhanced > Mobile to Name Lookup with Name Match",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-upi-lookup-enhanced",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"955370XXXX\",\n    \"name\": \"SuXXXXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to Multiple UPI Lookup - Basic > Mobile to UPI Lookup without Name Match",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-multiple-upi-lookup-basic",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"750127XXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to Multiple UPI Lookup - Basic > Mobile to Name Lookup with Name Match",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-multiple-upi-lookup-basic",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"75012XXXXX\",\n    \"name\": \"SuXXXXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to Multiple UPI Lookup - Advanced > Mobile to UPI Lookup without Name Match",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-multiple-upi-lookup-advanced",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"750127XXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to Multiple UPI Lookup - Advanced > Mobile to Name Lookup with Name Match",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-multiple-upi-lookup-advanced",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"75012XXXXX\",\n    \"name\": \"SuXXXXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to Address > Mobile to Address",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-address-lookup",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test_123\",\n    \"mobile\": \"9041179735\",\n    \"name\": \"hemx\",\n    \"email\": \"hemaxx@gmail.com\",\n    \"device_type\": \"web\",\n    \"device_ip\": \"192.168.0.1\",\n    \"consent_acceptance\": \"yes\",\n    \"consent_timestamp\": \"2024-06-05T15:55:00+05:30\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to Multiple UPI Lookup - Enhanced > Mobile to UPI Lookup without Name Match - Individual",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-upi-lookup-enhanced",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"750127XXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to Multiple UPI Lookup - Enhanced > Mobile to UPI Lookup without Name Match - Merchant",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-multiple-upi-lookup-enhanced",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"937587XXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to Multiple UPI Lookup - Enhanced > Mobile to Name Lookup with Name Match",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-multiple-upi-lookup-enhanced",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"test123143123\",\n    \"mobile\": \"750127XXXX\",\n    \"name\": \"SuXXXXXX\"\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile to Prefill API > Mobile to Prefill",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/mobile_prefill/request",
    "headers": [
      "Content-Type",
      "Authorization"
    ],
    "body": "{\r\n    \"client_ref_num\": \"test_1\",\r\n    \"mobile_no\": \"887734XXXX\",\r\n    \"name_lookup\": 1\r\n}"
  },
  {
    "name": "Mobile Related APIs > Mobile Revocation Lookup > Mobile Revocation Lookup(MNRL)",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/misc/v1/mobile-revocation-lookup",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"new_25APR2023_0058\",\n    \"mobile\": \"99XXX9XXX5\"\n}"
  },
  {
    "name": "Bank Verification > UPI Basic > UPI Basic without Name Match",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/bank/v1/upi-basic",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"ref1234\",\n    \"vpa\": \"797772105@paytm\"\n}"
  },
  {
    "name": "Bank Verification > UPI Basic > UPI Basic with Name Match",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/bank/v1/upi-basic",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"ref1234\",\n    \"vpa\": \"75012XXXXX@paytm\",\n    \"name\": \"Suxxxxx\"\n}"
  },
  {
    "name": "Bank Verification > UPI Enhanced > UPI Enhanced without Name Match - Individual",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/bank/v1/upi-enhanced",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"ref1234\",\n    \"vpa\": \"7501277XXX@paytm\"\n}"
  },
  {
    "name": "Bank Verification > UPI Enhanced > UPI Enhanced without Name Match - Merchant",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/bank/v1/upi-basic",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"ref1234\",\n    \"vpa\": \"814099XXXX@okbizaxis\"\n}"
  },
  {
    "name": "Bank Verification > UPI Enhanced > UPI Enhanced with Name Match",
    "method": "POST",
    "url": "{{BASE_URL_SVC}}/validation/bank/v1/upi-enhanced",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"client_ref_num\": \"ref1234\",\n    \"vpa\": \"7501277XXX@paytm\",\n    \"name\": \"Suxxxxx\"\n}"
  },
  {
    "name": "Bank Verification > Reverse Penny Drop > Collect API (Validate)",
    "method": "POST",
    "url": "{{BASE_URL_API}}/penny-drop/v2/reverse/validate",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\r\n    \"customerVpa\": \"abc@ybl\",\r\n    \"clientRefNum\": \"ABC123\"\r\n}"
  },
  {
    "name": "Bank Verification > Reverse Penny Drop > Intent API (Generate)",
    "method": "POST",
    "url": "{{BASE_URL_API}}/penny-drop/v2/reverse/generate",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\r\n    \"clientRefNum\": \"ABC123\"\r\n}"
  },
  {
    "name": "Bank Verification > Reverse Penny Drop > Status Check",
    "method": "GET",
    "url": "{{BASE_URL_API}}/penny-drop/v2/reverse/status?transactionId=b54582c10dce4c33a83c73c17dc4775f",
    "headers": [
      "ent_authorization"
    ],
    "body": ""
  },
  {
    "name": "Video Utilities > VideoPd > GetSessionIdFromUniqueIdOrSessionId",
    "method": "POST",
    "url": "{{BASE_URL_API}}/video-pd/v1/session-id-info",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\n    \"uniqueId\": \"A10\",\n    \"sessionId\": \"025de9da-8b58-4e58-ac12-f88093ce7bac\"\n}"
  },
  {
    "name": "Video Utilities > VideoPd > CreateVideoPdLink",
    "method": "POST",
    "url": "{{BASE_URL_API}}/video-pd/v1/agent/create/link",
    "headers": [
      "ent_authorization"
    ],
    "body": "{\n    \"agentEmailId\": \"doe@gmail.com\",\n    \"customerInfo\": {\n        \"fname\": \"John\",\n        \"lname\": \"doe\",\n        \"mobile\": \"9358673489\",\n        \"uniqueId\": \"john7438\",\n        \"sendSms\": true\n    }\n}"
  },
  {
    "name": "Utilities > Name Compare API",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ent/v1/name_match",
    "headers": [
      "Authorization",
      "Content-Type"
    ],
    "body": "{\n    \"input_name\": \"Flynn white\",\n    \"name_to_match\": \"Mr. Walter white\",\n    \"clientRefId\": \"test\"\n}"
  },
  {
    "name": "Utilities > Address from Location",
    "method": "POST",
    "url": "{{BASE_URL_API}}/ent/v1/address-verification",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"uniqueId\": \"DIGITAP001\",\n    \"latitude\": \"12.9624431\",\n    \"longitude\": \"77.6488468\"\n}"
  },
  {
    "name": "Alternate Risk Model > Create_request",
    "method": "POST",
    "url": "{{BASE_URL_API}}/arm/v1/request",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"pan\": \"ABCDP1234B\",\n    \"name\": \"White Walker\",\n    \"email\": \"walkerwhite@gmail.com\",\n    \"mobile_no\": \"96XXXXXXX\",\n    \"client_ref_id\": \"randomInt\"\n}"
  },
  {
    "name": "Alternate Risk Model > Status_check",
    "method": "POST",
    "url": "{{BASE_URL_API}}/arm/v1/status",
    "headers": [
      "Authorization"
    ],
    "body": "{\n    \"transaction_id\": \"886ca1de-ce08-44d8-a895-6bbe2b3a3c1d\",\n    \"raw_feature\": true\n}"
  }
];
