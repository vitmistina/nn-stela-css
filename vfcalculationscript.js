var menuOffsetTopDesktop = 210;
var menuOffsetTopMobile = 140;
var modules = ["vlocity-business-process"];
var myModule = angular.module("NewCalculations", modules);
var supportsES6 = (function() {
  try {
    new Function("(a = 0) => a");
    return true;
  } catch (err) {
    return false;
  }
})();

myModule.controller("scrollToTopController", [
  "$scope",
  function($scope) {
    if (!supportsES6) return; // do not execute if ES6 not supported

    let premium;
    let messages;
    let form;

    function handleParentScroll() {
      // make sure the elements exist, if not yet loaded, load them
      if (
        !premium ||
        !messages ||
        !form ||
        premium.length === 0 ||
        messages.length === 0 ||
        form.length === 0
      ) {
        premium = Array.from(
          document.querySelectorAll("#PremiumInfo,#PremiumInfo2")
        ).map(element => element.parentElement.parentElement);
        messages = Array.from(
          document.querySelectorAll("#Messages,#RidersMessages")
        ).map(element => element.parentElement.parentElement);
        forms = document.querySelectorAll("form[stepform]");
      }

      // if omniscript is loaded, go ahead
      if (premium && messages) {
        // setting constants with current state of DOM, various widths, heights, etc
        const omniscriptTop = window.parent.document.querySelector(
          ".omni-script"
        ).offsetTop;
        const bpTreeTop = document.querySelector(
          ".vlc-slds-bpTree-step-chart__container"
        ).offsetTop;
        const stepChart = document.querySelector("[vlc-slds-step-chart]");
        const formTop = Array.from(forms).reduce(
          (acc, cur) => acc + cur.offsetTop,
          0
        );
        const formWidth = Array.from(forms).reduce(
          (acc, cur) => acc + cur.offsetWidth,
          0
        );

        const topNavigation =
          window.parent.innerWidth >= 1024 ? 0 : stepChart.offsetHeight;
        const realTopOfForm =
          omniscriptTop + bpTreeTop + formTop + topNavigation;

        const stickyElements = [].concat(messages, premium);

        // if scrolled enough, fix the premium and messages to top
        if (this.scrollY >= realTopOfForm) {
          // set styles on premiums and messages
          stickyElements.forEach(element => {
            element.style.position = "fixed";
            element.style.zIndex = "3";
            element.style.backgroundColor = "#f1edeb";
            element.style.maxWidth = formWidth - 25 + "px";
          });

          // set styles just on premiums
          premium.forEach(element => {
            element.style.paddingTop = "10px";
            element.style.top = `${this.scrollY -
              omniscriptTop -
              bpTreeTop -
              topNavigation}px`;
          });
          const premiumHeight = premium.reduce(
            (acc, cur) => acc + cur.offsetHeight,
            0
          );

          // set styles just on messages and their children
          messages.forEach(element => {
            const sldsFormElement = element.querySelector(".slds-form-element");

            sldsFormElement.style.maxWidth = formWidth + "px";
            sldsFormElement.style.boxShadow =
              "0px 3px 1px -1px rgba(0, 0, 0, 0.25)";
            sldsFormElement.style.marginBottom = "0px";

            element.style.top = `${this.scrollY +
              premiumHeight -
              omniscriptTop -
              bpTreeTop -
              topNavigation}px`;
          });
          const messagesHeight = messages.reduce(
            (acc, cur) => acc + cur.offsetHeight,
            0
          );

          // set styles on forms
          forms.forEach(
            form =>
              (form.style.paddingTop = `${premiumHeight +
                messagesHeight +
                20}px`)
          );
        } else {
          forms.forEach(form => (form.style.paddingTop = ""));

          // set styles just on premiums
          premium.forEach(element => {
            element.style.position = "";
            element.style.paddingTop = "";
          });

          // set styles just on messages
          messages.forEach(element => {
            const sldsFormElement = element.querySelector(".slds-form-element");
            sldsFormElement.style.marginBottom = "20px";
            sldsFormElement.style.boxShadow = "";
            element.style.position = "";
          });
        }
      }
    }

    function scrollToTop(newValue, oldValue) {
      if (newValue != oldValue) {
        const scrollToY =
          window.parent.innerWidth >= 768
            ? menuOffsetTopDesktop
            : menuOffsetTopMobile;

        window.parent.scroll(0, scrollToY);
      }
      $("li").click(function(e) {
        $(this)
          .nextAll()
          .removeClass("completed");
      });
    }

    // watch for change of omniscript step and if changed, scroll to top
    $scope.$watch(() => $scope.bpTree.asIndex, scrollToTop);
    // listen for window events related to sticky premium info
    window.parent.addEventListener("scroll", handleParentScroll);
    window.parent.addEventListener("resize", handleParentScroll);
  }
]);

myModule.controller("msgController", [
  "$scope",
  function($scope) {
    $scope.errors;

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
          priceFormat(
            {
              prefix: "",
              centsSeparator: ",",
              thousandsSeparator: " "
            },
            elem
          );

          return elem[0].value;
        });
      }
    };
  }
]);

myModule.directive("currency", [
  "$filter",
  function($filter) {
    return {
      require: "ngModel",
      link: function(elem, $scope, attrs, ngModel) {
        ngModel.$formatters.push(function(val) {
          return $filter("currency")(val);
        });
        ngModel.$parsers.push(function(val) {
          return val.replace(/[\$,]/, ".").replace(/ /g, "");
        });
      }
    };
  }
]);
