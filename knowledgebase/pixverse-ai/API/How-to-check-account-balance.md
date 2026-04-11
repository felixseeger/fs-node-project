# How to check account balance?

## Overview

You can check your remaining account credits using your API-KEY.

**Endpoint:** `GET https://app-api.pixverse.ai/openapi/v2/account/balance`
**API Reference** : https://docs.platform.pixverse.ai/get-user-credit-balance-13778989e0

## Prerequisites

Before you begin, make sure you have:
- A valid PixVerse API key
- **A different Ai-trace-id** for each unique request

## Step-by-Step Guide


### Step 1: Call get user credit balance endpoint
```
curl --location --request GET 'https://app-api.pixverse.ai/openapi/v2/account/balance' \
--header 'API-KEY:' \
--header 'ai-trace-id: 1'
```


### Step 2: Check remaining Credits based on your purchased product
- credit_monthly :Your monthly membership remaining credits will reset every month.
- credit_package :Remaining credits purchased in packages
```
{
    "ErrCode": 0,
    "ErrMsg": "success",
    "Resp": {
        "account_id": 0,
        "credit_monthly": 1069020,
        "credit_package": 3630
    }
}
```




### Step 3: (Optional) Set up your own alert system using this interface