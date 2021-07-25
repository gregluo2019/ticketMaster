# TicketMaster by GregLuo(0406518207)

Implemented with Angular 12 and and .Net Core 5.

## Deployed at AWS and please access it directly

Open the URL [https://toplearning.com.au/events](https://toplearning.com.au/events)  to use it. Have fun!

The code is pretty reusable and SOLID. I didn't use NGRX to store states (since I want the code should be simple and clean), instead I use app.service to store them and access my REST APIs.

To avoid the cross-origin issue, I access the ticketMaster APIs in EventController of back-end instead of front-end. It is much securer since I don't want to expose it to users in browser.

It has basic unit test cases.

## Run the simulator

Run `yarn`, then `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

## Running unit tests

Run `ng test` to execute the unit tests.

![Screenshot](screenshot.png)
