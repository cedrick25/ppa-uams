<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>UAMS - Parole and Probation Administration</title>
	<link rel="icon" href="<?php echo BASE_URL(); ?>assets/img/favicon-main-ppa.png">

	<!-- BOOTSTRAP-->
	<link rel="stylesheet" href="<?php echo MIN_URL; ?>assets/css/bootstrap/bootstrap.min.css"/>
	<link rel="stylesheet" href="<?php echo MIN_URL; ?>assets/css/jquery.dataTables.min.css"/>
	<link rel="stylesheet" href="<?php echo MIN_URL; ?>assets/fonts/font-awesome.min.css"/>
	
	<!-- jQuery UI -->
	<link rel="stylesheet" href="<?php echo MIN_URL; ?>assets/css/jquery-ui.min.css"/>


	<link rel="stylesheet" href="<?php  ?>assets/css/custom.css?version=<?php echo filemtime("assets/css/custom.css"); ?>"/>
	<link rel="stylesheet" href="<?php echo MIN_URL; ?>assets/css/select2.min.css"/>
	<link rel="stylesheet" href="<?php echo MIN_URL; ?>assets/css/lobipanel.min.css"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<!-- <link href="https://fonts.googleapis.com/css?family=Quicksand" rel="stylesheet"> -->
	<style>
	html {
	  position: relative;
	  min-height: 100%;
	}
	/*body {
	  margin-bottom: 60px; /* Margin bottom by footer height */
	/*}*/
	.footer {
	  position: absolute;
	  bottom: 0;
	  width: 100%;
	  height: 60px; /* Set the fixed height of the footer here */
	  line-height: 60px; /* Vertically center the text there */
	  background-color: #f5f5f5;
	}
	</style>
</head>
