
# TS Leaky Bucket

Port of [leaky-bucket](https://github.com/linaGirl/leaky-bucket) to Typescript.  Original package was using experimental modules which required a runtime flag and also didn't have nice Typescript types. 



## Overview
Implementation of a [leaky bucket algorithm](https://en.wikipedia.org/wiki/Leaky_bucket) to support throttling / rate limiting.  Check out [ts-request-rate-limiter](https://github.com/floodfx/ts-request-rate-limiter) if you are looking for a library to limit client requests (e.g. rate limiting requests to an API).

## Install
`npm i ts-leaky-bucket`

## Usage

### Create a `LeakyBucket`

Constructor Options
 * `capacity` - unit of capacity of a bucket
 * `intervalMillis` - time to fully drain the bucket
 * `timeoutMillis` - time to queue additional items over capacity
```typescript
import { LeakyBucket, LeakyBucketOptions } from "ts-leaky-bucket";

const options: LeakyBucketOptions = {
  capacity: 120,
  intervalMillis: 60_000,
  timeoutMillis: 300_000,
}

// constructor takes `LeakyBucketOptions`
const bucket = new LeakyBucket(options);

// OR just use constructor directly

// constructor with options
const bucket = new LeakyBucket({
  capacity: 120,
  intervalMillis: 60_000,
  timeoutMillis: 300_000,
});
```

## Throttling

Way to add things to a bucket and then wait for the bucket to leak them.  

`maybeThrottle(cost: number = 1, append: boolean = true, isPause: boolean = false): Promise<void>`
 * `cost` - how much unit capacity to take for this `maybeThrottle`
 * `append` - add to back of queue or beginning
 * `isPause` - used to denote an item being a pause request
```typescript
import { LeakyBucket, LeakyBucketOptions } from "ts-leaky-bucket";
 
const bucket = new LeakyBucket({
  capacity: 120,
  intervalMillis: 60_000,
  timeoutMillis: 300_000,
});

async myBizLogicToThrottle(): void {
  // wait for bucket to say we are ready
  await maybeThrottle(20); // 20 units of capacity

  // now do work
  myBizLogic();
}
```
## Pausing
Two ways to pause the bucket from leaking:

* `pause(millis = 1000)` - pause the bucket from leaking for given `millis`
* `pauseByCost(cost: number)` - pauses the bucket from leaking for a given for `cost`
```typescript
// create bucket
...

// do throttled work
...

// pause leaking for a second
await bucket.pause();

// pause for 100 units of cost
await bucket.pauseForCost(100);

// do more thottled work
```

## Await Empty
If you want to wait for all items to leak out of a bucket you can use `awaitEmpty`.
```typescript
// create bucket
...

// do throttled work
...

// wait for bucket to empty
await bucket.awaitEmpty();
```

## Other Methods

* `pay(cost: number)` - post-hoc leak after a throttle to pay down additional unit cost
* `stopTimerAndClearQueue` - clear the timer and queue

# Development Commands

* `npm i` - install deps
* `npm run test` - run tests
* `npm run publish` - publish

## Changes
I've changed the code a bit from the original:
 * Naming changes
   * `isEmpty` => `awaitEmpty` to capture that a call to this waits until the queue empties
   * `throttle` => `maybeThrottle` to capture that it may return immediately if there is capacity or wait if not
   * `interval` => `intervalMillis` clarify unit of time
   * `timeout` => `additionalTimeoutMillis` clarify unit of time and also make clear this is in addition to `intervalMillis`
   * `requestRate` => `requestRateInSecs` clarify unit of time
 * API Changes
   * Uses milliseconds as the time unit instead of a mix between seconds and milliseconds
   * Does not allow post creation options changing; Original allows updating `capacity`, `interval`, `timeout` at runtime which I didn't want to encourage
   * `additionalTimeoutMillis` is added to `intervalMillis` instead of treated as a independent variable
   * `pause(millis: number)` uses milliseconds instead of seconds to be consistent
   * uses `get`ters instead of `getXXX` for reading options back out