# Overview

Accepted methods: `["GET", "POST", "PUT"]`
Auth needed?: `true`

## `GET`

Get active members, inactive members and mods in a room.

### Pre conditions

* Requesting user in the room

### Request

Query params:

`roomId`: number

### Response:

BODY:

#### Success

```json
    {
        "active": DatabaseUsers[],
        "other": DatabaseUsers[],
        "mods": DatabaseUsers[]
    }
```

#### Failure:

```json
{
    "error": string
}
```

## `POST`

Creates a room

### Pre conditions

None

### Request

BODY:

```json
{
    "name": string
}
```

### Response

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

## `PUT`

Adds a user to the specified room.

### Pre conditions

* Requsting user must be in the room

### Request

BODY:

```json
{
    "room": number,
    "username": string
}
```

`room` is the room ID.

### Response

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