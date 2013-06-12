<?php
/**
 * Logging module
 *
 * Relies on EasyLogger being installed and active - does nothing if it's not
 */


if (class_exists('EasyLoggerPlus')) {
    /** @noinspection PhpUndefinedClassInspection */
    class EasyRecipeLogger extends EasyLoggerPlus {
        function __construct($logFile) {
            return EasyLoggerPlus::getInstance($logFile);
        }
    }
} else if (class_exists('EasyLogger')) {
    /** @noinspection PhpUndefinedClassInspection */
    class EasyRecipeLogger extends EasyLogger {
        function __construct($logFile) {
            return EasyLogger::getInstance($logFile);
        }
    }
} else {
    class EasyRecipeLogger {
        static private $log;

        static function getInstance(/** @noinspection PhpUnusedParameterInspection */
            $logFile) {
            if (!isset(self::$log)) {
                self::$log = new EasyRecipeLogger();
            }
            return self::$log;
        }

        function debug($msg) {
        }

        function info($msg) {
        }

        function warn($msg) {
        }

        function error($msg) {
        }

        function fatal($msg) {
        }

        function disable($level) {
        }

        function enable($level) {
        }

    }
}

