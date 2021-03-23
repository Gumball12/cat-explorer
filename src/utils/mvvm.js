/**
 * mvvm wrapper
 */
export default class extends HTMLElement {
  constructor({
    html: __html,
    data: __data,
    methods: __methods,
    watch: __watch,
    created: __created,
    mounted: __mounted,
  }) {
    super();

    // connect dom
    this.$root = this.attachShadow({ mode: "closed" });
    this.$root.innerHTML = __html;

    // declare properties
    Object.defineProperties(this, {
      $data: {
        value: new Proxy(__data ?? {}, {
          set: (obj, prop, value) => {
            // invoke watcher
            if (this.$watcher[prop].length !== 0) {
              this.$watcher[prop].forEach((cb) => cb(obj[prop], value));
            }

            // update data
            obj[prop] = value;

            return true;
          },
        }),
      },
      $methods: {
        value: __methods ?? {}, // { methodName: function }
      },
      $watcher: {
        // { dataName: [ handlers ] }
        value: new Proxy(__watch ?? {}, {
          get: (obj, prop) => {
            if (obj[prop] === undefined) {
              obj[prop] = [];
            }

            return obj[prop];
          },
        }),
      },
      $ref: {
        value: {}, // { refName: element }
      },
      $created: {
        value: __created,
      },
      $mounted: {
        value: __mounted,
      },
    });

    // created
    if (this.$created !== undefined && this.$created !== null) {
      this.$created.call(this);
    }
  }

  $emit(eventName, detail) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        composed: true,
        detail,
      })
    );
  }

  connectedCallback() {
    if (this.isConnected) {
      // dom traversing when is connected
      for (const el of this.$root.querySelectorAll("*")) {
        for (const name of el.getAttributeNames()) {
          if (name.startsWith("@")) {
            const eventName = name.slice(1);
            const handlerName = el.getAttribute(name);
            bindEvent.call(this, el, eventName, handlerName);
          } else if (name.startsWith("m-prop-")) {
            const propName = kebobToCamel(name, { ignorePrefix: "m-prop" });
            const dataName = el.getAttribute(name);
            bindProperty.call(this, el, propName, dataName);
          } else if (name.startsWith("m-bidata-") && !name.endsWith("__bind")) {
            const dataName = el.getAttribute(name);
            twoWayBinding.call(this, el, name, dataName);
          } else if (name === "m-ref") {
            const refName = el.getAttribute(name);
            registerRef.call(this, el, refName);
          }
        }
      }

      for (const name of this.getAttributeNames()) {
        if (name.startsWith("m-bidata-") && !name.endsWith("__bind")) {
          const dataName = kebobToCamel(name, { ignorePrefix: "m-bidata" });
          twoWayBinding.call(this, this, name, dataName);
        } else if (name.startsWith("m-data-")) {
          const dataName = kebobToCamel(name, { ignorePrefix: "m-data" });
          const value = this.getAttribute(name);
          setData.call(this, this, dataName, value);
        }
      }

      if (this.$mounted !== undefined && this.$mounted !== null) {
        setTimeout(() => this.$mounted.call(this), 0);
      }
    }
  }
}

/* tools */

// validations

function isHTMLElement(el) {
  return el instanceof HTMLElement;
}

function isProperty(target, property) {
  return target !== undefined && target[property] !== undefined;
}

function isNotEmptyString(str) {
  return str !== undefined && str !== null && str !== "";
}

// utils

function kebobToCamel(str, options = { prefix: "", ignorePrefix: "" }) {
  const { prefix, ignorePrefix } = options;

  let ignoredStr = str;

  if (
    ignorePrefix !== undefined &&
    ignorePrefix !== null &&
    ignorePrefix !== ""
  ) {
    ignoredStr = ignoredStr.replace(new RegExp(`^${ignorePrefix}-`), "");
  }

  const camelStr = ignoredStr
    .split("-")
    .filter((s) => s !== "")
    .reduce((r, s) => (r = r + `${s[0].toUpperCase()}${s.slice(1)}`));

  if (prefix !== undefined && prefix !== null && prefix !== "") {
    return `${prefix}${camelStr.replace(/^([a-z])/, (m, p) =>
      p.toUpperCase()
    )}`;
  }

  return camelStr;
}

// binding

function bindEvent(target, name, handlerName) {
  if (!isHTMLElement(target)) {
    console.error("is not html element");
    return;
  }

  if (!isProperty(this.$methods, handlerName)) {
    console.error("is not property", handlerName);
    return;
  }

  // bind
  target.addEventListener(name, (evt) =>
    this.$methods[handlerName].call(this, evt)
  );
}

function twoWayBinding(target, attrName, dataName) {
  if (!isHTMLElement(target)) {
    console.error("is not html element");
    return;
  }

  if (!isProperty(this.$data, dataName)) {
    console.error("is not property", dataName);
    return;
  }

  // central -> each data model
  new MutationObserver((list, obs) => {
    const value = target.getAttribute(`${attrName}__bind`);

    // sync value
    if (this.$data[dataName] !== value) {
      this.$data[dataName] = value;
    }
  }).observe(target, {
    attributes: true,
    attributeFilter: [`${attrName}__bind`],
  });

  // each data model -> central
  target.setAttribute(`${attrName}__bind`, this.$data[dataName]);
  this.$watcher[dataName].push((oldValue, newValue) =>
    target.setAttribute(`${attrName}__bind`, newValue)
  );
}

function registerRef(target, refName) {
  if (!isHTMLElement(target)) {
    console.error("is not html element");
    return;
  }

  if (!isNotEmptyString(refName)) {
    console.error("is empty string");
    return;
  }

  if (isProperty(this.$ref, refName)) {
    console.error("already registered ref");
    return;
  }

  // register
  this.$ref[refName] = target;
}

function bindProperty(target, propName, dataName) {
  if (!isHTMLElement(target)) {
    console.error("is not html element");
    return;
  }

  if (!isProperty(target, propName)) {
    console.error("is not property", propName);
    return;
  }

  if (!isProperty(this.$data, dataName)) {
    console.error("is not property", dataName);
    return;
  }

  // bind
  target[propName] = this.$data[dataName];
  this.$watcher[dataName].push(
    (oldValue, newValue) => (target[propName] = newValue)
  );
}

function setData(target, dataName, value) {
  if (!isHTMLElement(target)) {
    console.error("is not html element");
    return;
  }

  if (!isProperty(this.$data, dataName)) {
    console.error("is not property", dataName);
    return;
  }

  // set
  this.$data[dataName] = value;
}
