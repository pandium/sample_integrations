<?php

function isTruthy($value)
{
    return in_array($value, array('true', '1', 't', 'y', 'yes'));
}

class Config
{
    public static $data = array();
    public static function from_env() {
        foreach ($_ENV as $key => $value) {
            if (str_starts_with($key, 'PAN_CFG_')) {
                self::$data[strtolower(substr($key, strlen('PAN_CFG_')))] = $value;
            }
        }
        return self::$data;
    }
}

class Secret
{
    public static $data = array();
    public static function from_env() {
        foreach ($_ENV as $key => $value) {
            if (str_starts_with($key, 'PAN_SEC_')) {
                self::$data[strtolower(substr($key, strlen('PAN_SEC_')))] = $value;
            }
        }
        return self::$data;
    }
}

class Context
{
    public static $data = array();
    public static function from_env() {
        foreach ($_ENV as $key => $value) {
            if (str_starts_with($key, 'PAN_CTX_')) {
                self::$data[strtolower(substr($key, strlen('PAN_CTX_')))] = $value;
            }
        }
        return self::$data;
    }
}
