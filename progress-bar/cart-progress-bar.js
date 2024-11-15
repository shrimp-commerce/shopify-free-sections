var CartProgressBar = class extends HTMLElement {
  connectedCallback() {}

  constructor() {
    super();
    //todo: change here for getting the cart drawer
    this.target = document.querySelector("cart-drawer");
    this.addButton = document.querySelector(".free-product__add-button");
    this.freeProductId = document.querySelector(
      ".free-product__container"
    )?.dataset.product;

    this.total = Number(
      document.querySelector(".progress-bar__wrapper").dataset.total
    );

    //todo: change here for getting the line items
    this.lineItems = document.querySelectorAll(".line-item");

    this.goals = Array.from(
      document.querySelectorAll(".progress-bar__goal")
    ).map((goal) => {
      return {
        goal: Number(goal.dataset.goal),
        id: goal.dataset.product,
      };
    });

    this.itemsInCart = Array.from(this.lineItems).map((lineItem) => {
      return {
        id: lineItem.dataset.product,
        quantity: Number(lineItem.dataset.quantity),
        price: Number(lineItem.dataset.price),
        line: lineItem.dataset.line,
      };
    });

    this.nonFreeProducts = Array.from(this.itemsInCart).filter((lineItem) => {
      return Number(lineItem.price) > 0;
    });

    this.freeProducts = Array.from(this.itemsInCart).filter((lineItem) => {
      return Number(lineItem.price) === 0;
    });

    this.removeFromCartProducts = [
      ...this.nonFreeProducts.filter((line) => {
        return this.goals.some((pos) => {
          return pos.id === line.id;
        });
      }),
      ,
      ...this.freeProducts.filter((line) => line.quantity > 1),
    ].filter((el) => el);

    this.addToCartProducts = this.goals.filter((goal) => {
      return (
        goal.goal < this.total &&
        !this.itemsInCart.some((lineItem) => goal.id === lineItem.id)
      );
    });

    let response;
    const promises = [];

    const illegalGifts = this.goals.filter((goal) => {
      return goal.goal > this.total && goal.id != "FREESHIPPING";
    });

    if (Array.isArray(illegalGifts) && illegalGifts.length > 0) {
      const removeIllegalGifts = illegalGifts.filter((gift) => {
        return this.itemsInCart.some((lineItem) => lineItem.id === gift.id);
      });
      removeIllegalGifts.map((gifts) => {
        const promise = this._changeCartById(gifts, 0).then((res) =>
          res.json()
        );
        promises.push(promise);
      });
    }

    /* remove if not necessary
      illegalGifts.map((productsToRemove) => {
        const promise = this._changeCart(productsToRemove, 0).then((res) =>
          res.json()
        );
        promises.push(promise);
      });
      */

    // remove unnecessary products from cart
    /*
      this.removeFromCartProducts.map((productToRemove) => {
        const promise = this._changeCart(
          productToRemove,
          productToRemove.quantity > 1 ? 1 : 0
        ).then((res) => res.json());
        promises.push(promise);
      });
      */
    // remove if not necessary
    // add only relevant products, all at once
    /*
      if (this.addToCartProducts.length > 0 && !isFetching) {
        const promise = this._addToCart(this.addToCartProducts).then((res) => {
          isFetching = false;
          return res.json();
        });
        promises.push(promise);
      }
      */
    if (this.addButton) {
      this.addButton.addEventListener("click", () => {
        this.addButton.disabled = true;
        const promise = this._addToCart([{ id: this.freeProductId }])
          .then((res) => {
            isFetching = false;
            this.addButton.disabled = false;
            return res.json();
          })
          .then((res) => {
            reloadCart(res);
          });
      });
    }
    // Wait for all operations to complete
    Promise.all(promises)
      .then((results) => {
        if (results.length > 0) {
          response = results[results.length - 1];
          reloadCart(response);
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }
  async _changeCart(product, quantity) {
    let formData = {
      line: product.line,
      quantity,
      sections: "mini-cart",
    };
    return await fetch(window.Shopify.routes.root + "cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  }

  async _changeCartById(product, quantity) {
    let formData = {
      id: product.id,
      quantity,
      sections: "mini-cart",
    };
    return await fetch(window.Shopify.routes.root + "cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  }

  async _addToCart(newLineItems) {
    let formData = {
      items: [
        ...newLineItems.map((p) => {
          return { id: p.id, quantity: 1 };
        }),
      ],
      sections: "mini-cart",
    };
    isFetching = true;
    return await fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  }
};

window.customElements.define("cart-progress-bar", CartProgressBar);
