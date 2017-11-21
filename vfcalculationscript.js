const menuOffsetTopDesktop = 210;
const menuOffsetTopMobile = 140;
var modules = ["vlocity-business-process"];
var myModule = angular.module("NewCalculations", modules);

myModule.controller("msgController", [
  "$scope",
  function($scope) {
    $scope.errors;

    $scope.$watch(
      () => $scope.bpTree.asIndex,
      (newValue, oldValue) => {
        if (newValue != oldValue) {
          const scrollToY =
            window.parent.innerWidth >= 768
              ? menuOffsetTopDesktop
              : menuOffsetTopMobile;
          window.parent.scroll(0, 0);
        }
      }
    );

    $scope.$watch("errors", function(scope) {
      if (!!scope && scope.length >= 1) {
      } else {
        $("#BasicInformation_nextBtn").show();
        $("#Riders_nextBtn").show();
        $("#SecondInsuredRiders_nextBtn").show();
        $("#ChildDefinitionStep_nextBtn").show();
        $("#CartPremiumProduct_nextBtn").show();
      }
    });
  }
]);

myModule.controller("ridersCtrl", [
  "$scope",
  function($scope) {
    $scope.showFirstInsuredRecalculateBtn = false;
    $scope.showSecondInsuredRecalculateBtn = false;

    angular.element(document).ready(function() {});

    $scope.recalculated = function() {
      $("#Riders_nextBtn").show();
      $scope.showFirstInsuredRecalculateBtn = false;
    };

    $scope.riderChanged = function(scope) {
      $("#Riders_nextBtn").hide();
      $scope.showFirstInsuredRecalculateBtn = true;
      if (!scope.Term) scope.Term = 0;
      if (!scope.SumAssured) scope.SumAssured = 0;
      if (!scope.MedicalLoading) scope.MedicalLoading = 0;
    };

    $scope.recalculatedSecond = function() {
      $("#SecondInsuredRiders_nextBtn").show();
      $scope.showSecondInsuredRecalculateBtn = false;
    };

    $scope.riderChangedSecond = function(scope) {
      $("#SecondInsuredRiders_nextBtn").hide();
      $scope.showSecondInsuredRecalculateBtn = true;
      if (!scope.Term) scope.Term = 0;
      if (!scope.SumAssured) scope.SumAssured = 0;
      if (!scope.MedicalLoading) scope.MedicalLoading = 0;
    };

    $scope.hideNextBtns = function() {
      $("#Riders_nextBtn").hide();
    };

    $scope.hideNextBtnsSecond = function() {
      $("#SecondInsuredRiders_nextBtn").hide();
    };

    $scope.replacePercentages = function(s) {
      var jsonString = JSON.stringify(s);
      jsonString = jsonString.replace(/%/g, "&#37;");
      return JSON.parse(jsonString);
    };

    $scope.ShowHide = function(Groupname) {
      if ($scope.IsVisible === Groupname) {
        $scope.IsVisible = "";
      } else {
        $scope.IsVisible = Groupname;
      }
    };
  }
]);

myModule.directive("toNumber", function() {
  return {
    require: "ngModel",
    link: function(scope, elem, attrs, ctrl) {
      ctrl.$parsers.push(function(value) {
        return parseFloat(value || "");
      });
    }
  };
});

myModule.controller("childrenCtrl", [
  "$scope",
  function($scope) {
    $scope.showChildrenRecalculateBtn = true;
    $scope.addChildToCollection = function(collection) {
      var copyOfChild = angular.copy(collection.Children[0]);
      copyOfChild.BirthDate.value = today();
      copyOfChild.Name = "";

      $.each(copyOfChild.Component, function(index, comp) {
        comp.Selected = false;
      });

      collection.Children.push(copyOfChild);
    };

    $scope.removeChildFromCollection = function(child, collection) {
      var index = collection.Children.indexOf(child);
      collection.Children.splice(index, 1);
    };

    $scope.setComponentSelected = function(
      collection,
      componentCode,
      selected,
      scope
    ) {
      $.each(collection, function(index, cmp) {
        if (cmp.ComponentCode.value === componentCode) cmp.Selected = selected;
      });

      if (!!scope && !scope.MUWLoadingPercent.value)
        scope.MUWLoadingPercent.value = 0;
      if (!!scope && !scope.SumAssured.value) scope.SumAssured.value = 0;

      $scope.showChildrenRecalculateBtn = true;
      $("#ChildDefinitionStep_nextBtn").hide();
    };

    $scope.showRecalculateBtn = function() {
      $scope.showChildrenRecalculateBtn = true;
      $("#ChildDefinitionStep_nextBtn").hide();
    };

    $scope.hideNexBtnChild = function() {
      $("#ChildDefinitionStep_nextBtn").hide();
    };

    $scope.recalculated = function() {
      $("#ChildDefinitionStep_nextBtn").show();
      $scope.showChildrenRecalculateBtn = false;
    };

    function today() {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();

      if (dd < 10) {
        dd = "0" + dd;
      }

      if (mm < 10) {
        mm = "0" + mm;
      }

      today = yyyy + "-" + mm + "-" + dd;

      return today;
    }
  }
]);

myModule.controller("investmentFundCtrl", [
  "$scope",
  function($scope) {
    $scope.totalSharing = 100;
    $scope.allowRecalculateFunds = true;

    $scope.calculateTotalSharing = function(collection) {
      var sum = 0;
      $.each(collection, function(index, fund) {
        sum = sum + Number(fund.DistributionRatio);
      });
      $scope.totalSharing = 100 - sum;
      if ($scope.totalSharing === 0) $scope.allowRecalculateFunds = true;
      else if ($scope.totalSharing <= 0) {
        $scope.totalSharing = 0;
        //$scope.allowRecalculateFunds = false;
      }
    };
  }
]);
myModule.$inject = ["$scope"];

myModule.directive("format", [
  "$filter",
  function($filter) {
    return {
      require: "?ngModel",
      link: function(scope, elem, attrs, ctrl) {
        if (!ctrl) return;

        ctrl.$formatters.unshift(function(a) {
          return $filter(attrs.format)(ctrl.$modelValue);
        });

        ctrl.$parsers.unshift(function(viewValue) {
          elem.priceFormat({
            prefix: "",
            centsSeparator: ",",
            thousandsSeparator: " "
          });

          return elem[0].value;
        });
      }
    };
  }
]);

(function($) {
  $.fn.priceFormat = function(options) {
    var defaults = {
      prefix: "US$ ",
      suffix: "",
      centsSeparator: ".",
      thousandsSeparator: ",",
      limit: false,
      centsLimit: 2,
      clearPrefix: false,
      clearSufix: false,
      allowNegative: false,
      insertPlusSign: false
    };
    var options = $.extend(defaults, options);
    return this.each(function() {
      var obj = $(this);
      var is_number = /[0-9]/;
      var prefix = options.prefix;
      var suffix = options.suffix;
      var centsSeparator = options.centsSeparator;
      var thousandsSeparator = options.thousandsSeparator;
      var limit = options.limit;
      var centsLimit = options.centsLimit;
      var clearPrefix = options.clearPrefix;
      var clearSuffix = options.clearSuffix;
      var allowNegative = options.allowNegative;
      var insertPlusSign = options.insertPlusSign;
      if (insertPlusSign) allowNegative = true;
      function to_numbers(str) {
        var formatted = "";
        for (var i = 0; i < str.length; i++) {
          char_ = str.charAt(i);
          if (formatted.length == 0 && char_ == 0) char_ = false;
          if (char_ && char_.match(is_number)) {
            if (limit) {
              if (formatted.length < limit) formatted = formatted + char_;
            } else {
              formatted = formatted + char_;
            }
          }
        }
        return formatted;
      }
      function fill_with_zeroes(str) {
        while (str.length < centsLimit + 1) str = "0" + str;
        return str;
      }
      function price_format(str) {
        var formatted = fill_with_zeroes(to_numbers(str));
        var thousandsFormatted = "";
        var thousandsCount = 0;
        if (centsLimit == 0) {
          centsSeparator = "";
          centsVal = "";
        }
        var centsVal = formatted.substr(
          formatted.length - centsLimit,
          centsLimit
        );
        var integerVal = formatted.substr(0, formatted.length - centsLimit);
        formatted =
          centsLimit == 0 ? integerVal : integerVal + centsSeparator + centsVal;
        if (thousandsSeparator || $.trim(thousandsSeparator) != "") {
          for (var j = integerVal.length; j > 0; j--) {
            char_ = integerVal.substr(j - 1, 1);
            thousandsCount++;
            if (thousandsCount % 3 == 0) char_ = thousandsSeparator + char_;
            thousandsFormatted = char_ + thousandsFormatted;
          }
          if (thousandsFormatted.substr(0, 1) == thousandsSeparator)
            thousandsFormatted = thousandsFormatted.substring(
              1,
              thousandsFormatted.length
            );
          formatted =
            centsLimit == 0
              ? thousandsFormatted
              : thousandsFormatted + centsSeparator + centsVal;
        }
        if (allowNegative && (integerVal != 0 || centsVal != 0)) {
          if (str.indexOf("-") != -1 && str.indexOf("+") < str.indexOf("-")) {
            formatted = "-" + formatted;
          } else {
            if (!insertPlusSign) formatted = "" + formatted;
            else formatted = "+" + formatted;
          }
        }
        if (prefix) formatted = prefix + formatted;
        if (suffix) formatted = formatted + suffix;
        return formatted;
      }
      function key_check(e) {
        var code = e.keyCode ? e.keyCode : e.which;
        var typed = String.fromCharCode(code);
        var functional = false;
        var str = obj.val();
        var newValue = price_format(str + typed);
        if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105))
          functional = true;
        if (code == 8) functional = true;
        if (code == 9) functional = true;
        if (code == 13) functional = true;
        if (code == 46) functional = true;
        if (code == 37) functional = true;
        if (code == 39) functional = true;
        if (allowNegative && (code == 189 || code == 109)) functional = true;
        if (insertPlusSign && (code == 187 || code == 107)) functional = true;
        if (!functional) {
          e.preventDefault();
          e.stopPropagation();
          if (str != newValue) obj.val(newValue);
        }
      }
      function price_it() {
        var str = obj.val();
        var price = price_format(str);
        if (str != price) obj.val(price);
      }
      function add_prefix() {
        var val = obj.val();
        obj.val(prefix + val);
      }
      function add_suffix() {
        var val = obj.val();
        obj.val(val + suffix);
      }
      function clear_prefix() {
        if ($.trim(prefix) != "" && clearPrefix) {
          var array = obj.val().split(prefix);
          obj.val(array[1]);
        }
      }
      function clear_suffix() {
        if ($.trim(suffix) != "" && clearSuffix) {
          var array = obj.val().split(suffix);
          obj.val(array[0]);
        }
      }
      $(this).bind("keydown.price_format", key_check);
      $(this).bind("keyup.price_format", price_it);
      $(this).bind("focusout.price_format", price_it);
      if (clearPrefix) {
        $(this).bind("focusout.price_format", function() {
          clear_prefix();
        });
        $(this).bind("focusin.price_format", function() {
          add_prefix();
        });
      }
      if (clearSuffix) {
        $(this).bind("focusout.price_format", function() {
          clear_suffix();
        });
        $(this).bind("focusin.price_format", function() {
          add_suffix();
        });
      }
      if ($(this).val().length > 0) {
        price_it();
        clear_prefix();
        clear_suffix();
      }
    });
  };
  $.fn.unpriceFormat = function() {
    return $(this).unbind(".price_format");
  };
  $.fn.unmask = function() {
    var field = $(this).val();
    var result = "";
    for (var f in field) {
      if (!isNaN(field[f]) || field[f] == "-") result += field[f];
    }
    return result;
  };
})(jQuery);

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