# Ryans Puppy mill we got cats too!

## Getting Started 
to get this repo up and running on your host all you will have to do is 
1. add dependencies in .env-sample or these
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_REGION=
S3_BUCKET=
PUBLIC_STRIPE_API_KEY=
PRIVATE_STRIPE_API_KEY=
MAILGUN_API_KEY=
EMAIL_DOMAIN=
DSN=

2. go to directory where project is on host.

3. have docker and docker-compose installed on your host 

4. in your terminal in the correct directory simpy type ```docker-compose up```

5. There ya go! 

## Tasks
[x] Dockerrize
[x] Digital ocean hosting


### Simple Search & Pagination
[x] Add a search bar in the navbar to search pets. Paginate the results.

### Validations
[x] Add validations to protect against unsanitary data getting into your db.

### Upload Images
[x] Upload pictures of pets from new and edit forms

### Payment Gateways
[x] Buy pets using Stripe.

### Send Emails
[x] Send an email when a pet is purchased.

### Full Text Search
[x] Fuzzy and full-text search on multiple criteria

### Responding to JSON
[x] Make your project into a full API
