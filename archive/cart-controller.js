(function() {
  vlocity.cardframework.registerModule.controller(
    "ShoppingCartController",
    ShoppingCartController
  );

  function ShoppingCartController() {
    const shoppingCart = this;
    shoppingCart.texts = {
      premium: "Celkové poistné",
      openCart: "Otvoriť",
      closeCart: "Zatvoriť",
      tab1: "Informácie",
      tab2: "Prvý poistený",
      tab3: "Druhý poistený",
      tab4: "Deti"
    };

    shoppingCart.isOpen = false;
    shoppingCart.toggleOpen = () =>
      (shoppingCart.isOpen = !shoppingCart.isOpen);

    shoppingCart.activeTab = 1;
    shoppingCart.openTab = tabIndex => (shoppingCart.activeTab = tabIndex);

    //this is temp and will come from vlocity:
    shoppingCart.temp = {
      premium: 14.53,
      frequency: ["Mesačná", "Štvrťročná", "Ročná"]
    };
  }
})();
