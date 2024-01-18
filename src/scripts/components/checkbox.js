import Util from '@services/util.js';
import './checkbox.scss';

export default class Checkbox {
  /**
   * @class
   * @param {object} params Parameters passed by the editor.
   */
  constructor(params = {}) {
    // Sanitize parameters
    this.params = Util.extend({
      label: '',
      checkedByDefault: false
    }, params);

    this.dom = this.buildDOM();
  }

  /**
   * Get DOM.
   * @returns {HTMLElement} DOM.
   */
  getDOM() {
    return this.dom;
  }

  /**
   * Get checkbox DOM.
   * @returns {HTMLElement} Checkbox DOM.
   */
  getCheckboxDOM() {
    return this.checkbox;
  }

  /**
   * Build main DOM.
   * @returns {HTMLElement} Main DOM.
   */
  buildDOM() {
    const dom = document.createElement('div');
    dom.classList.add('h5p-checkbox-list-checkbox-wrapper');

    const checkboxID = H5P.createUUID();
    this.checkbox = document.createElement('input');
    this.checkbox.classList.add('h5p-checkbox-list-checkbox');
    this.checkbox.setAttribute('type', 'checkbox');
    this.checkbox.setAttribute('id', checkboxID);

    this.checkbox.addEventListener('change', () => {
      this.setAnswerGiven(true);
    });

    this.setAnswerGiven(
      typeof this.params.previousState?.checked === 'boolean'
    );

    this.checkbox.checked = this.params.previousState?.checked ??
      this.params.checkbox.checkedByDefault;

    dom.append(this.checkbox);

    const label = document.createElement('label');
    label.classList.add('h5p-checkbox-list-label');
    label.setAttribute('for', checkboxID);
    label.innerText = this.params.checkbox.label;
    dom.append(label);

    return dom;
  }

  /**
   * Determine whether checkbox is checked.
   * @returns {boolean} True, if checkbox is checked, else false.
   */
  isChecked() {
    return this.checkbox.checked ?? false;
  }

  /**
   * Get label.
   * @returns {string} Label.
   */
  getLabel() {
    return this.params.checkbox.label ?? '';
  }

  /**
   * Get textual representation of checkbox.
   * @returns {string} Textual representation of checkbox.
   */
  getTextualRepresentation() {
    const checkboxText = this.isChecked() ? '\u2611' : '\u2610';
    return `${checkboxText} ${this.params.checkbox.label}`;
  }

  /**
   * Set whether user has given an answer.
   * @param {boolean} state True for user has given an answer, else false.
   */
  setAnswerGiven(state) {
    this.wasAnswered = state;
  }

  /**
   * Determine whether user has given an answer.
   * @returns {boolean} True, if user has given an answer.
   */
  getAnswerGiven() {
    return this.wasAnswered;
  }

  /**
   * Reset.
   */
  reset() {
    this.checkbox.checked = this.params.checkbox.checkedByDefault;
    this.wasAnswered = false;
  }

  /**
   * Get current state to answer H5P core call.
   * @returns {object} Current state.
   */
  getCurrentState() {
    return {
      checked: this.isChecked()
    };
  }
}
