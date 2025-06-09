const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the events collection
const EventsSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
        required: true,
    },
    eventDate: {
        type: String,
        required: true,
    },
    eventTime: {
        type: String,
        required: true,
    },
    eventLocation: {
        type: String,
        required: true,
    },
  },
  { timestamps: true, collection: 'events-posts' } // Specify collection name
);

const Event = mongoose.model("events", EventsSchema);
module.exports = Event;