# Overview

Accepted methods: `["PUT", "DELETE"]`
Auth needed?: `true`

## `PUT`

Adds a moderator to a room.

### Pre conditions

* User requesting is the owner of the room
* User being promoted is in the room

### Request

BODY:

```json
{
    "roomId": number,
    "modId": number
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

## `DELETE`

Demotes a moderator.

### Pre conditions

* User requesting is the room owner
* User is currently a moderator of the room

### Request

BODY:

```json
{
    "roomId": number,
    "modId": number
}
```

### Response:

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