<?php

/**
 * Class EasyRecipeEasyError
 */
class EasyRecipeErrorHandler {


    function __construct() {
        set_error_handler(array($this, 'errorHandler'));
    }

    function errorHandler($errNo, $errString, $errFile, $errLine) {
        $errLevel = error_reporting(0);
        $logErrors = ini_get('log_errors');
        $displayErrors = ini_get("display_errors");
    }

}
