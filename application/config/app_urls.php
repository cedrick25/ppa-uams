<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
|--------------------------------------------------------------------------
| UAMS dynamic URL / proxy configuration
|--------------------------------------------------------------------------
| Override any value with Apache/Nginx env vars, e.g.:
|   SetEnv UAMS_API_PATH /ppa-api-uams
|   SetEnv CMIS_API_PATH /ppa-api
|   SetEnv PIS_BASE_URL https://pis.probation.gov.ph
|   SetEnv APP_BASE_URL https://rpxy.probation.gov.ph/ppa-uams
*/

$config['app_public_hosts'] = array(
	'rpxy.probation.gov.ph',
	'uams.probation.gov.ph',
	'localhost',
	'127.0.0.1',
	'ks',
);

$config['app_allow_probation_gov_ph'] = TRUE;

$config['api_uams']          = getenv('UAMS_API_PATH') ?: '/ppa-api-uams';
$config['api_cmis']          = getenv('CMIS_API_PATH') ?: '/ppa-api';
$config['api_wms']           = getenv('WMS_API_PATH') ?: '/wms';
$config['bug_api']           = getenv('BUG_API_BASE') ?: '/ppa-bug-api';
$config['cmis_sync_api']     = getenv('CMIS_SYNC_API_BASE') ?: '/ppa-cmis-api_origin';
$config['transcription_api'] = getenv('TRANSCRIPTION_API_BASE') ?: '/transcription_api';
$config['pis_base']          = getenv('PIS_BASE_URL') ?: 'https://pis.probation.gov.ph';
