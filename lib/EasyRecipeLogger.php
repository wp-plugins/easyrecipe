<?php
/**
 * Logging module
 *
 * Relies on EasyLogger being installed and active - does nothing if it's not
 */
/**
 * If EasyLogger isn't installed, create stub classes
 */
if (!class_exists('EasyLogger')) {
    class EasyRecipeLogger {
        static function getLog($logfile) {
            return new EasyLoggerLog();
        }
    }

    class EasyLoggerLog {

        function comment($msg) {
        }

        function disable($level) {
        }

        function enable($level) {
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
    }
} else {
    /**
     * Class EasyRecipeLogger
     *
     * Use the real EasyLogger
     */
    class EasyRecipeLogger {
        /**
         * @param string $logfile
         * @return EasyLoggerLog
         */
        static function getLog($logfile) {
            return EasyLogger::getLog($logfile);
        }
    }

}

