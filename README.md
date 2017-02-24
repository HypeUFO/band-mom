# Band Mom
A virtual tour manager for musicians

## Overview
Band mom is an app designed for musicians to plan and keep track of gigs and stay organized.

## Use Case
Let's be honest, musicians are not known for being organized. From load in time to remembering that extra guitar cable, band mom is designed to keep track of it all. Beginning with a guided questionaire, band mom makes sure users have all of the information they need on hand for every gig they add.

## UX


This app was designed to project a feeling of security and relaxation to it's users. The stress involved in keeping track of all the little things that go into planning a gig can quickly take the fun out of performing. Everything from the color scheme to the images are meant to inspire feelings of confidence and ease, so users can focus on doing what they love.
The dashboard page contains 3 tabs for users to keep track of event details, store their stage plot, and a list of items to commonly forgotten items to bring/purchase before the show. 

## Prototype
You can find a working prototype here: https://band-mom.herokuapp.com/index.html
Log in with username: demo password: demo123 to try it out!

## Technical
BandMom is built with node.js on the back end and jQuery on the front-end. Bootstrap has been used for styling and datepickers. FooTable allows for the collapsing tables on mobile devices while X-Editable is used for inline editing of table cells.
An API to access the database has been constructed in ExpressJS with 3 key endpoints, returning user info, events, and stage plots

## Future Updates
This is v1 of BandMom. Future updates will add:

  * User defined alerts (day of show, time to leave, etc)
  * Venue address will link to google maps for fast directions
  * Ability to create a public profile including band name, bio, song upload or connect to soundcloud
  * The option to sign-up as a band, venue, or promoter, turning the app into a marketplace where users can connect and book events
  * In app messaging between bands, venues, and promoters
