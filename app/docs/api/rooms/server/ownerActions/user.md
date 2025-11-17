# Overview

Accepted methods: `["DELETE"]`
Auth needed?: `true`

## `DELETE`

Kicks a user from a room

### Pre conditions

* Requesting user is moderator or room owner
* Kicking user is in the room

### Request

BODY:

```json
{
    "userId": number,
    "roomId": number
}
```

### Response

BODY:

#### Sucess

```json
{}
```

#### Failure

```json
{
    "error": string
}
```