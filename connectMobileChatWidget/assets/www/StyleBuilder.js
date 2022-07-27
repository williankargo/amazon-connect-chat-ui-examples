class StyleBuilder {
  constructor() {
    this.styleElement = document.createElement('style');
    this.styleMap = {};
  }

  addStylesToClass(className, pseudoElement = null, styles) {
    let styleClass =
      pseudoElement === null ? className : className + '::' + pseudoElement;
    if (!(styleClass in this.styleMap)) {
      this.initClass(styleClass);
    }
    styles.forEach(style => {
      for (const [styleName, styleValue] of Object.entries(style)) {
        this.initStyle(styleClass, styleName, styleValue);
      }
    });
  }

  addStylesToTag(tagName, pseudoElement = null, styles) {
    let styleTag =
      pseudoElement === null ? tagName : tagName + '::' + pseudoElement;
    if (!(styleTag in this.styleMap)) {
      this.initTag(styleTag);
    }
    styles.forEach(style => {
      for (const [styleName, styleValue] of Object.entries(style)) {
        this.initStyle(styleTag, styleName, styleValue);
      }
    });
  }

  initClass(styleClass) {
    this.styleMap[styleClass] = {
      type: 'class',
      styles: {},
    };
  }

  initTag(styleTag) {
    this.styleMap[styleTag] = {
      type: 'tag',
      styles: {},
    };
  }

  initStyle(styleClass, styleName, styleValue) {
    this.styleMap[styleClass].styles[styleName] = styleValue;
  }

  build() {
    let innerHTML = '';
    for (const className of Object.keys(this.styleMap)) {
      if (this.styleMap[className].type === 'class') {
        innerHTML += '.';
      }
      innerHTML += className + ' {';
      let classStyles = this.styleMap[className].styles;
      for (const [styleName, styleValue] of Object.entries(classStyles)) {
        let currentStyleValue = styleValue === null ? 'none' : styleValue;
        if (isPositiveInteger(currentStyleValue)) {
          currentStyleValue = currentStyleValue.toString() + 'px';
        }
        innerHTML += styleName + ': ' + currentStyleValue + '; ';
      }
      innerHTML.slice(0, -1);
      innerHTML += '} ';
    }
    innerHTML.slice(0, -1);
    this.styleElement.innerHTML = innerHTML;
  }

  apply(javaScriptDOMElement) {
    javaScriptDOMElement.appendChild(this.styleElement);
  }
}

function isPositiveInteger(data) {
  return data === parseInt(data, 10) && data > 0;
}

export default StyleBuilder;
