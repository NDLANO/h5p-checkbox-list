import Util from '@services/util.js';
import Checkbox from './checkbox.js';
import './checkbox-list.scss';

export default class CheckboxList {
  /**
   * @class
   * @param {object} params Parameters passed by the editor.
   */
  constructor(params = {}) {
    // Sanitize parameters
    this.params = Util.extend({
      checkboxes: [],
      previousState: [],
      checkboxGroupLabel: 'Your options'
    }, params);

    this.checkboxes = [];

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
   * Build dom.
   * Following https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/examples/checkbox/
   * @returns {HTMLElement} DOM.
   */
  buildDOM() {
    const checkboxListGroup = document.createElement('div');
    checkboxListGroup.classList.add('h5p-checkbox-list-checkbox-list-group');
    checkboxListGroup.setAttribute('role', 'group');
    checkboxListGroup.setAttribute(
      'aria-label', this.params.checkboxGroupLabel
    );

    const checkboxListList = document.createElement('ul');
    checkboxListList.classList.add('h5p-checkbox-list-checkbox-list');
    checkboxListGroup.append(checkboxListList);

    this.params.checkboxes.forEach((checkboxParam, index) => {
      const listItem = document.createElement('li');
      listItem.classList.add('h5p-checkbox-list-checkbox-list-item');
      checkboxListList.append(listItem);

      this.checkboxes.push(
        new Checkbox({
          checkbox: checkboxParam,
          previousState: this.params.previousState[index]
        })
      );
      listItem.append(this.checkboxes[index].getDOM());
    });

    return checkboxListGroup;
  }

  /**
   * Get textual representation of checkbox.
   * @returns {string} Textual representation of checkboxes
   */
  getTextualRepresentation() {
    return this.checkboxes.map((checkbox) => {
      return checkbox.getTextualRepresentation();
    }).join('\n');
  }

  /**
   * Get xAPI response.
   * @returns {string} XAPI response.
   */
  getXAPIResponse() {
    return this.checkboxes
      .reduce((result, checkbox, index) => {
        if (checkbox.isChecked()) {
          result.push(`${index}`);
        }
        return result;
      }, [])
      .join('[,]');
  }

  /**
   * Get choices for xAPI.
   * @param {string} languageTag Language tag.
   * @returns {object} Choices for xAPI.
   */
  getXAPIChoices(languageTag) {
    return this.checkboxes.map((checkbox, index) => {
      const description = {};
      description[languageTag] = checkbox.getLabel();
      // Fallback for h5p-php-reporting, expects en-US
      description['en-US'] = description[languageTag];

      return {
        'id': `${index}`,
        'description': description
      };
    });
  }

  /**
   * Determine whether user has given an answer.
   * @returns {boolean} True, if user has given an answer.
   */
  getAnswerGiven() {
    return this.checkboxes.some((checkbox) => checkbox.getAnswerGiven());
  }

  /**
   * Reset.
   */
  reset() {
    this.checkboxes.forEach((checkbox) => {
      checkbox.reset();
    });
  }

  /**
   * Get current state to answer H5P core call.
   * @returns {object} Current state.
   */
  getCurrentState() {
    return {
      checkboxes: this.checkboxes.map((checkbox) => checkbox.getCurrentState())
    };
  }
}
