(function() {
        "use strict";
        var bpModule = angular.module("vlocity-business-process");
        bpModule.factory("datePickerFormatter", function() {
          return {
            //removes the hh:mm a pattern if present on the format
            formatDate: function(format, element, attrs) {
              if (!format) format = "d.M.yyyy";
              var lFormat = format.replace(/ hh:mm a$/, "");

              if (format) {
                return {
                  dateFormat: lFormat,

                  format: (function(dFormat) {
                    if (attrs.vlcSldsDatePicker === "Date/Time (Local)") {
                      return dFormat.toUpperCase() + " hh:mm a";
                    } else if (/hh:mm a/.test(format)) {
                      return dFormat.toUpperCase() + " hh:mm a";
                    } else {
                      return dFormat.toUpperCase();
                    }
                  })(lFormat),

                  modelFormat: function(mFormat) {
                    var modelFormat = mFormat;
                    return modelFormat && modelFormat.toUpperCase();
                  },

                  convertToAbs: function(timeString) {
                    timeString = new Date(timeString).toGMTString();
                    return timeString.replace(/GMT/gi, "");
                  },

                  isDateTimePicker: (function() {
                    return (
                      attrs.vlcSldsDatePicker === "Date/Time (Local)" ||
                      /hh:mm a/.test(format)
                    );
                  })()
                };
              } else {
                return {
                  dateFormat: "yyyy/mm/dd",
                  format: "yyyy/mm/dd".toUpperCase()
                };
              }
            }
          };
        });
      })();