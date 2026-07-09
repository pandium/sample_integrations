<?php
require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

require_once('./lib.php');

function run() {
    $context = Context::from_env();
    $secrets = Secret::from_env();
    $config = Config::from_env();

    // Pandium integrations can be run in 'init' or 'normal' mode.
    // When the integration is run on Pandium, Pandium will provide run_mode through context.
    // During local development run mode is defined in the .env as PAN_CTX_RUN_MODE
    error_log("This run is in mode: " . $context['run_mode']);
    error_log("------------------------CONFIG------------------------");
    error_log(print_r($config, true));

    error_log("------------------------SECRET------------------------");
    error_log(print_r($secrets, true));

    error_log("------------------------CONTEXT------------------------");
    error_log(print_r($context, true));

    error_log("------------------------ENV----------------------------");
    error_log(print_r($_ENV, true));
}

run();
?>
