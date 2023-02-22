<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Portal extends CI_Controller {

	/*
	 * Index Page
	 */
	public function index()
	{
		$this->load->view('login');
	}

	public function dashboard()
	{
		$this->load->view('dashboard');
	}

	public function caseload()
	{
		$this->load->view('caseload');
	}

	public function print_caseload()
	{
		$this->load->view('print_caseload');
	}

	public function probationer()
	{
		$this->load->view('probationer');
	}
	
	public function report()
	{
		$this->load->view('report');
	}

	public function report_print()
	{
		$this->load->view('report_print');
	}

	public function user_list()
	{
		$this->load->view('user_list');
	}

	public function user_system_list()
	{
		$this->load->view('user_system_list');
	}

	public function field_offices()
	{
		$this->load->view('field_offices');
	}

	public function user_level()
	{
		$this->load->view('user_level');
	}
	public function information_systems()
	{
		$this->load->view('information_systems');
	}
	public function user_position()
	{
		$this->load->view('user_position');
	}

	public function user_add()
	{
		$this->load->view('user_list_add');
	}

	public function audit()
	{
		$this->load->view('audit');
	}

	public function backup_restore()
	{
		$this->load->view('backup_restore');
	}

	public function backup_date()
	{
		$this->load->view('backup_date');
	}

	public function restore_all()
	{
		$this->load->view('restore_all');
	}

	public function restore_deleted()
	{
		$this->load->view('restore_deleted');
	}

	public function restore_date()
	{
		$this->load->view('restore_date');
	}

	public function caseload_report()
	{
		$this->load->view('caseload_report');
	}
	public function report_caseload()
	{
		$this->load->view('report_caseload');
	}
	public function view_caseload()
	{
		$this->load->view('view_caseload');
	}
	public function forms()
	{
		$this->load->view('forms');
	}


	


}
