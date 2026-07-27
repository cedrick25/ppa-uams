<?php
defined('BASEPATH') OR exit('No direct script access allowed');

if (!function_exists('app_request_host')) {
	function app_request_host()
	{
		$host = '';
		if (!empty($_SERVER['HTTP_X_FORWARDED_HOST'])) {
			$host = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_HOST'])[0]);
		} elseif (!empty($_SERVER['HTTP_HOST'])) {
			$host = $_SERVER['HTTP_HOST'];
		} elseif (!empty($_SERVER['SERVER_NAME'])) {
			$host = $_SERVER['SERVER_NAME'];
		}
		$host = strtolower(preg_replace('/:\d+$/', '', $host));
		return $host;
	}
}

if (!function_exists('app_is_https_request')) {
	function app_is_https_request()
	{
		if (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off') {
			return TRUE;
		}
		if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && strtolower((string) $_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https') {
			return TRUE;
		}
		if (!empty($_SERVER['HTTP_FRONT_END_HTTPS']) && strtolower((string) $_SERVER['HTTP_FRONT_END_HTTPS']) !== 'off') {
			return TRUE;
		}
		if (!empty($_SERVER['SERVER_PORT']) && (string) $_SERVER['SERVER_PORT'] === '443') {
			return TRUE;
		}
		return FALSE;
	}
}

if (!function_exists('app_detect_base_path')) {
	function app_detect_base_path()
	{
		if (defined('APP_BASE_PATH')) {
			return APP_BASE_PATH;
		}
		$script = isset($_SERVER['SCRIPT_NAME']) ? str_replace('\\', '/', $_SERVER['SCRIPT_NAME']) : '';
		$dir = str_replace('\\', '/', dirname($script));
		if ($dir === '/' || $dir === '\\' || $dir === '.') {
			return '';
		}
		return rtrim($dir, '/');
	}
}

if (!function_exists('app_url_config')) {
	function app_url_config($key = NULL, $default = NULL)
	{
		$CI =& get_instance();
		$defaults = array(
			'api_uams' => '/ppa-api-uams',
			'api_cmis' => '/ppa-api',
			'api_wms' => '/wms',
			'bug_api' => 'https://brs.probation.gov.ph/ppa-bug-api',
			'cmis_sync_api' => 'https://eppcmis.probation.gov.ph/ppa-cmis-api_origin',
			'transcription_api' => '/transcription_api',
			'pis_base' => 'https://pis.probation.gov.ph',
			'app_public_hosts' => array('rpxy.probation.gov.ph', 'uams.probation.gov.ph', 'localhost', '127.0.0.1', 'ks'),
			'app_allow_probation_gov_ph' => TRUE,
		);

		if ($key === NULL) {
			$all = array();
			foreach ($defaults as $k => $v) {
				$item = $CI->config->item($k);
				$all[$k] = ($item === NULL || $item === FALSE) ? $v : $item;
			}
			return $all;
		}

		$item = $CI->config->item($key);
		if ($item === NULL || $item === FALSE) {
			return array_key_exists($key, $defaults) ? $defaults[$key] : $default;
		}
		return $item;
	}
}

if (!function_exists('BASE_URL')) {
	function BASE_URL($uri = '')
	{
		return base_url($uri);
	}
}

if (!function_exists('app_api_path')) {
	function app_api_path($which = 'uams')
	{
		$map = array(
			'uams' => 'api_uams',
			'cmis' => 'api_cmis',
			'wms' => 'api_wms',
			'bug' => 'bug_api',
			'cmis_sync' => 'cmis_sync_api',
			'transcription' => 'transcription_api',
			'pis' => 'pis_base',
		);
		$key = isset($map[$which]) ? $map[$which] : 'api_uams';
		return rtrim((string) app_url_config($key), '/');
	}
}

if (!function_exists('app_config_js')) {
	function app_config_js()
	{
		$config = array(
			'origin' => rtrim(base_url(), '/'),
			'basePath' => app_detect_base_path(),
			'isHttps' => app_is_https_request(),
			'apiUams' => app_api_path('uams'),
			'apiCmis' => app_api_path('cmis'),
			'apiWms' => app_api_path('wms'),
			'bugApi' => app_api_path('bug'),
			'cmisSyncApi' => app_api_path('cmis_sync'),
			'transcriptionApi' => app_api_path('transcription'),
			'pisBase' => app_api_path('pis'),
		);
		return '<script>window.APP_CONFIG=' . json_encode($config) . ';</script>';
	}
}
