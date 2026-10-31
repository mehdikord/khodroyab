# Schema Review

This document outlines observations and assumptions regarding the database schema specification provided in Section 4 of the project requirements.

- **`users.name`**: Specified as `BIGINT`. This is unusual for a name field. It has been implemented as `BigInt` in the Prisma schema as required, but this may cause issues if users expect a string.
- **`users.national_code`**: This field is nullable but has a default value of `1`. This has been implemented as `String? @default("1")` in Prisma.
- **`user_cars.qautity`**: This is likely a misspelling of `quantity`. It has been implemented as `qautity` to strictly adhere to the requirements.
- **`user_car_sale_terms.perecentage`**: This is likely a misspelling of `percentage`. It has been implemented as `perecentage` to strictly adhere to the requirements.
- **String lengths**: No explicit lengths were provided for `VARCHAR` fields in the requirement. `VARCHAR(255)` has been used as a default for all `VARCHAR` fields for consistency and technical appropriateness.
- **`options.type`**: This has been implemented as a Prisma enum with values `text`, `number`, `select`, and `checkbox`, defaulting to `text`.
