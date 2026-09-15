-- Example Athena queries for CloudTrail threat hunting.
-- Replace cloudtrail_logs with your Athena table name.

-- 1. Root account console activity
SELECT eventtime,
       eventname,
       sourceipaddress,
       useragent,
       awsregion
FROM cloudtrail_logs
WHERE useridentity.type = 'Root'
ORDER BY eventtime DESC;

-- 2. Security logging tampering attempts
SELECT eventtime,
       eventsource,
       eventname,
       sourceipaddress,
       useridentity.arn
FROM cloudtrail_logs
WHERE eventname IN (
  'StopLogging',
  'DeleteTrail',
  'UpdateTrail',
  'DeleteDetector',
  'DisableSecurityHub',
  'DeleteConfigurationRecorder'
)
ORDER BY eventtime DESC;

-- 3. IAM privilege or trust changes
SELECT eventtime,
       eventname,
       useridentity.arn,
       sourceipaddress,
       requestparameters
FROM cloudtrail_logs
WHERE eventsource = 'iam.amazonaws.com'
  AND eventname IN (
    'AttachRolePolicy',
    'AttachUserPolicy',
    'PutRolePolicy',
    'PutUserPolicy',
    'CreateAccessKey',
    'UpdateAssumeRolePolicy'
  )
ORDER BY eventtime DESC;

-- 4. Console logins without MFA
SELECT eventtime,
       sourceipaddress,
       useridentity.arn,
       additionaleventdata
FROM cloudtrail_logs
WHERE eventname = 'ConsoleLogin'
  AND CAST(additionaleventdata AS VARCHAR) LIKE '%MFAUsed%No%'
ORDER BY eventtime DESC;
