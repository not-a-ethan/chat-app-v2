# Overview

Accepted methods: `["PUT", "POST", "DELETE"]`
Auth needed?: `true`

## `PUT`

Renames a room

### Pre conditions

- Requesting user is the owner of the room

### Request

BODY

```json
{
    "id": number,
    "newName": string
}
```

`id` is the room id

### Response

BODY:

#### Sucess

```json
{}
```

##### Failure

```json
{
    "error": string
}
```

## `POST`

Changes the owner of the room

### Pre conditions

* Requesting user is the current owner of the room
* New owner is already a member of the room

### Request

BODY:

```json
{
    "roomId": number,
    "userId": number
}
```

`userId` is the new owners id.

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

## `DELETE`

Deletes the specified room

### Pre conditions

* Requesting user is the owner

### Request

BODY:

```json
{
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