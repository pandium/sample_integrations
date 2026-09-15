<?php

declare(strict_types=1);

namespace Pandium\Integration;

use RuntimeException;

/** Thrown by the SIGALRM handler `Cron` arms ahead of Pandium's ~10 minute run limit. */
final class DeadlineReached extends RuntimeException
{
}
