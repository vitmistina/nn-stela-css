var menuOffsetTopDesktop = 210;
var menuOffsetTopMobile = 140;
var cartOffsetTopDesktop = 309;
var cartOffsetTopMobile = 191;
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

myModule.filter("if2", function() {
  return function(input, trueValue, falseValue) {
    return input ? trueValue : falseValue;
  };
});

myModule.filter("year", function() {
  return function(input) {
    return parseInt(input, 10) + 2017;
  };
});

myModule.controller("scrollToTopController", [
  "$scope",
  "$rootScope",
  function($scope, $rootScope) {
    if (!supportsES6) return; // do not execute if ES6 not supported

    let premium;
    let messages;
    let form;

    function handleParentScroll() {
      // do not execute on mobile
      if (window.parent.innerWidth <= 425) return;

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

        // if (scrolled enough && window high enough && cart not open)
        // fix the premium and messages to top
        if (
          this.scrollY >= realTopOfForm &&
          window.parent.innerWidth >= 768 &&
          !$rootScope.shoppingCartIsOpen
        ) {
          // set styles on premiums and messages
          stickyElements.forEach(element => {
            element.style.position = "fixed";
            element.style.zIndex = "3";
            element.style.backgroundColor = "#f1edeb";
            element.style.maxWidth = formWidth - 24 + "px";
          });

          // set styles just on premiums
          premium.forEach(element => {
            element.style.paddingTop = "24px";
            element.style.top = `${this.scrollY -
              omniscriptTop -
              bpTreeTop -
              topNavigation}px`;
            element.style.paddingRight = 24 + "px";
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
            element.style.paddingRight = "";
          });

          // set styles just on messages
          messages.forEach(element => {
            const sldsFormElement = element.querySelector(".slds-form-element");
            sldsFormElement.style.marginBottom = "20px";
            sldsFormElement.style.boxShadow = "";
            element.style.position = "";
            element.style.paddingRight = "";
          });
        }
      }
    }

    function scrollToTopMenu() {
      const scrollToY =
        window.parent.innerWidth >= 768
          ? menuOffsetTopDesktop
          : menuOffsetTopMobile;

      window.parent.scroll(0, scrollToY);
      handleParentScroll();
    }

    function scrollToTopCart() {
      const scrollToY =
        window.parent.innerWidth >= 768
          ? cartOffsetTopDesktop
          : cartOffsetTopMobile;

      window.parent.scroll(0, scrollToY);
      handleParentScroll();
    }

    function watchOmniscriptStepChange(newValue, oldValue) {
      if (newValue != oldValue) {
        scrollToTopMenu();
      }
      $("li").click(function(e) {
        $(this)
          .nextAll()
          .removeClass("completed");
      });
    }

    function watchShoppingCartOpening(newValue, oldValue) {
      if (newValue === true) {
        scrollToTopCart();
      }
    }

    // watch for change of omniscript step and if changed, scroll to top
    $scope.$watch(() => $scope.bpTree.asIndex, watchOmniscriptStepChange);

    // watch for opening of cart
    $scope.$watch(
      () => $rootScope.shoppingCartIsOpen,
      watchShoppingCartOpening
    );

    // listen for window events related to sticky premium info
    window.parent.addEventListener("scroll", handleParentScroll);
    window.parent.addEventListener("resize", handleParentScroll);
  }
]);

myModule.controller("msgController", [
  "$scope",
  function($scope) {
    $scope.zakric = function(control) {
      alert(control.JSONPath);
    };
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

myModule.controller("ShoppingCartController", [
  "$scope",
  "$rootScope",
  function($scope, $rootScope) {
    const shoppingCart = this;
    shoppingCart.texts = {
      premium: "Celkové poistné",
      openCart: "Otvoriť košík",
      closeCart: "Zatvoriť",
      tab1: "Informácie",
      tab2: "Prvý poistený",
      tab3: "Druhý poistený",
      tab4: "Deti"
    };

    $rootScope.shoppingCartIsOpen = false;
    shoppingCart.isOpen = false;
    shoppingCart.toggleOpen = () => {
      shoppingCart.isOpen = !shoppingCart.isOpen;
      $rootScope.shoppingCartIsOpen = !$rootScope.shoppingCartIsOpen;
    };

    shoppingCart.activeTab = 1;
    shoppingCart.openTab = tabIndex => (shoppingCart.activeTab = tabIndex);

    $scope.showCalculateBtn = false;

	$scope.recalculated = function(){
			debugger;
		 $scope.showCalculateBtn = false;
	}
  }
]);

myModule.controller("ridersCtrl", [
  "$scope",
  function($scope) {
    $scope.showFirstInsuredRecalculateBtn = false;
    $scope.showSecondInsuredRecalculateBtn = false;
    $scope.IsVisible = "Úmrtie";
    $scope.currencyVal = 0;

    $scope.init = function() {
      $("#Riders_nextBtn").hide();
    };
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

    $scope.containsCode = function(obj, value) {
      if (obj.Code === value) return true;

      return false;
    };

    $scope.showModal = function(component, mainCover) {
      var modal = document.getElementById("calendar_" + component.Code);
      modal.style.display = "block";

      var pCount = Object.keys(component.SumAssuredCalendar.calendarMap).length;
      if (Number(mainCover.Term) + 1 != pCount) {
        for (var i = 1; i <= pCount; i++) {
          delete component.SumAssuredCalendar.calendarMap[String(i)];
        }

        for (var i = 1; i <= Number(mainCover.Term); i++) {
          component.SumAssuredCalendar.calendarMap[String(i)] = "";
        }
        component.SumAssuredCalendar.calendarMap[0] = component.SumAssured;
      }
    };

    $scope.setDecreasingType = function(
      component,
      selectedDecreasingType,
      bpTree
    ) {
      component.DecreasingType.value = selectedDecreasingType.Code;
      debugger;
    };

    $scope.hideModal = function(componentCode) {
      var modal = document.getElementById("calendar_" + componentCode);
      modal.style.display = "none";
    };

    $scope.saveCalendar = function(component, componentCode) {
      var modal = document.getElementById("calendar_" + componentCode);
      modal.style.display = "none";

      component.SumAssuredCalendar.value = [];

      for (
        var i = 0;
        i < Object.keys(component.SumAssuredCalendar.calendarMap).length;
        i++
      ) {
        component.SumAssuredCalendar.value.push(
          component.SumAssuredCalendar.calendarMap[0]
        );
      }
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
    $scope.selectedCmpCount = {}; //CEPP2-229  array to hold the counts of selected items across all children
    //AS, 11.12.2017 added for CEPP2-229
    //function to initialize the counter of the riders
    //to be called from a ng-init call together with hideNextBtnChild()
    $scope.initSelectionSummary = function(collection) {
      $.each(collection, function(index, cmp) {
        var key = cmp.ComponentCode.value;
        $scope.selectedCmpCount[key] = 0;
      });
    };

    //added for CEPP2-229; to replace the hideNexBtnChild() call in ng-init
    $scope.initUI = function(collection) {
      $scope.initSelectionSummary(collection);
      $scope.hideNexBtnChild();
    };

    //CEPP2-229: function to recalc the overall selected riders. To be called after a child is removed and eventually from the callback function after a recalc callout.
    $scope.updateSelectionSummary = function(collection) {
      //input must be the complete collection of data
      //for each child need to loop trhoug collection of components
      //and mark each selected component
      //reset the counters
      $scope.initSelectionSummary(collection.ChildrenComponentsDefinition);

      $.each(collection.Children, function(index, child) {
        $.each(child.Component, function(iComp, comp) {
          if (comp.Selected) {
            $scope.selectedCmpCount[comp.ComponentCode.value]++;
          }
        });
      });

      $.each(collection.ChildrenComponentsDefinition, function(index, comp) {
        comp.Selected = $scope.selectedCmpCount[comp.ComponentCode.value] > 0;
      });
    };

    $scope.addChildToCollection = function(collection) {
      var copyOfChild = angular.copy(collection.Children[0]);
      copyOfChild.BirthDate.value = today();
      copyOfChild.Name = "";

      $.each(copyOfChild.Component, function(index, comp) {
        comp.Selected = false;
      });

      collection.Children.push(copyOfChild);
    };

    //updated for CEPP2-229;
    $scope.removeChildFromCollection = function(child, collection) {
      var index = collection.Children.indexOf(child);
      collection.Children.splice(index, 1);
      $scope.updateSelectionSummary(collection);
    };

    //updated for CEPP2-229; update the overall counter instead of copy the selected checkbox value only
    $scope.setComponentSelected = function(
      collection,
      componentCode,
      selected,
      scope
    ) {
      $.each(collection, function(index, cmp) {
        if (cmp.ComponentCode.value === componentCode) {
          //cmp.Selected = selected;
          if (selected) {
            if (
              angular.isNumber($scope.selectedCmpCount[cmp.ComponentCode.value])
            ) {
              $scope.selectedCmpCount[cmp.ComponentCode.value]++;
            } else {
              $scope.selectedCmpCount[cmp.ComponentCode.value] = 1;
            }
            cmp.Selected = true;
          } else {
            $scope.selectedCmpCount[cmp.ComponentCode.value]--;
            if ($scope.selectedCmpCount[cmp.ComponentCode.value] < 1)
              cmp.Selected = false;
          }
        }
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

    //updated for CEPP2-229: added parameter and call to update the selection summary
    $scope.recalculated = function(collection) {
      $("#ChildDefinitionStep_nextBtn").show();
      $scope.showChildrenRecalculateBtn = false;
      $scope.updateSelectionSummary(collection);
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
