/* =========================================================
   SHEAR DESIRE – SITE SETTINGS
   Edit the values below. You do not need to touch any other
   file to change the WhatsApp number, services, booking times
   or rating.
   ========================================================= */
window.SITE = {

  /* WhatsApp number that receives booking requests.
     Digits only, with country code, no "+" and no spaces.
     Sri Lanka example: 94710754105  (= +94 71 075 4105)
     IMPORTANT: make sure this number really has WhatsApp. */
  whatsappNumber: "94710754105",

  /* Link to the salon on Google Maps (the short link you shared) */
  mapsLink: "https://maps.app.goo.gl/c31JB7fPnPrq1aqQ7",

  /* Salon pin (latitude, longitude) used for the map and directions */
  lat: 7.2849774,
  lng: 80.6167292,

  /* Shown in the Reviews section. Update when the Google rating changes. */
  rating: 4.5,
  reviewCount: 177,

  /* Facebook page reviews (optional – set to null to hide) */
  facebook: { recommend: 96, reviews: 30, url: "https://www.facebook.com/sheardesirekandy/" },

  /* Services. They appear on the page AND in the booking form.
     Edit, add or remove lines to match what the salon offers. */
  services: [
    { name: "Cuts and styling",  text: "Fresh cuts and finishes shaped around your face, your hair and how you live." },
    { name: "Hair colour",       text: "From subtle tones to bold colour, planned with you before anything is applied." },
    { name: "Beauty care",       text: "Hand, foot and skin care in the quieter corner of the studio." }
  ],

  /* Booking times shown in the form (24-hour format "HH:MM").
     Check these against the salon's real opening hours. */
  booking: {
    openTime: "09:30",
    closeTime: "17:00",     // last appointment slot starts at or before this time
    slotMinutes: 30,        // gap between time choices
    closedWeekdays: [],     // days the salon is closed: 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat. Example: [1] for Monday
    daysAhead: 90,          // how far ahead people can book
    minNoticeMinutes: 60    // for same-day bookings, hide slots that start sooner than this
  }
};
