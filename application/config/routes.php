<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['wsv1/(:any)'] = "wsv1/$1";
$route['ws'] = "ws/version";
$route['dashboard'] = "portal/dashboard";
$route['caseload'] = "portal/caseload";
$route['print_caseload'] = "portal/print_caseload";
$route['probationer'] = "portal/probationer";
$route['report'] = "portal/report";
$route['audit'] = "portal/audit";
$route['report_print'] = "portal/report_print";



$route['user_list'] = "portal/user_list";
$route['user_system_list'] = "portal/user_system_list";
$route['user_position'] = "portal/user_position";
$route['user_level'] = "portal/user_level";
$route['user_add'] = "portal/user_add";
$route['caseload_report'] = "portal/caseload_report";
$route['report_caseload'] = "portal/report_caseload";
$route['information_systems'] = "portal/information_systems";
$route['field_offices'] = "portal/field_offices";
$route['view_caseload'] = "portal/view_caseload";


$route['login'] = "Portal/index";
$route['backup_restore'] = "Portal/backup_restore";
$route['backup_date'] = "Portal/backup_date";
$route['restore_all'] = "Portal/restore_all";
$route['restore_deleted'] = "Portal/restore_deleted";
$route['restore_date'] = "Portal/restore_date";
$route['forms'] = "Portal/forms";
$route['migrate_offline'] = "Portal/migrate_offline";


$route['default_controller'] = 'Portal';
$route['404_override'] = 'Version';
$route['translate_uri_dashes'] = FALSE;
