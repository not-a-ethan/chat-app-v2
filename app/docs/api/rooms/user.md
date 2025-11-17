# Overview

Accepted methods: `["GET", "PUT"]`
Auth needed?: `true`

## `GET`

Gets list of rooms user is a member of, moderator of and owner of.

### Request

No query params

### Response
BODY:

#### Success

```json
{
    "rooms": DatabaseRooms[],
    "owner": number[],
    "mod": string[]
}
```

#### Failure

```json
{
    "error": string
}
```

## `PUT`

Removes self user for specific room.

### Pre conditions

* Must not be the owner
* Must no be a moderator

### Request

BODY:

```json
{
    "roomId": number
}
```

### Response

BODY:

#### Success

```json
{}
```

#### Failure

```json
{
    "error": string
}
```