import Util from '@services/util.js';
import Dictionary from '@services/dictionary.js';
import CheckboxList from '@components/checkbox-list.js';
import QuestionTypeContract from '@mixins/question-type-contract.js';
import XAPI from '@mixins/xapi.js';
import '@styles/h5p-checkbox-list.scss';

export default class CheckboxListApp extends H5P.EventDispatcher {
  /**
   * @class
   * @param {object} params Parameters passed by the editor.
   * @param {number} contentId Content's id.
   * @param {object} [extras] Saved state, metadata, etc.
   */
  constructor(params, contentId, extras = {}) {
    super();

    Util.addMixins(
      CheckboxListApp, [QuestionTypeContract, XAPI]
    );

    // Sanitize parameters
    this.params = Util.extend({
      checkboxes: [],
      a11y: {
        checkboxGroupLabel: 'Your options'
      }
    }, params);

    this.params.checkboxes = this.params.checkboxes.map((checkbox) => {
      checkbox.label = Util.decodeHTML(checkbox.label ?? '');
      return checkbox;
    });

    this.contentId = contentId;
    this.extras = extras;

    // Fill dictionary
    this.dictionary = new Dictionary();
    this.dictionary.fill({ l10n: this.params.l10n, a11y: this.params.a11y });

    const defaultLanguage = extras?.metadata?.defaultLanguage || 'en';
    this.languageTag = Util.formatLanguageCode(defaultLanguage);

    this.previousState = extras?.previousState || {};

    this.dom = this.buildDOM();
  }

  /**
   * Attach library to wrapper.
   * @param {H5P.jQuery} $wrapper Content's container.
   */
  attach($wrapper) {
    $wrapper.get(0).classList.add('h5p-checkbox-list');
    $wrapper.get(0).appendChild(this.dom);
  }

  /**
   * Build main DOM.
   * @returns {HTMLElement} Main DOM.
   */
  buildDOM() {
    const dom = document.createElement('div');
    dom.classList.add('h5p-checkbox-list-main');

    let checkboxGroupLabel = this.dictionary.get('a11y.checkboxGroupLabel');

    if (this.params.taskDescription) {
      const descriptionDOM = document.createElement('div');
      descriptionDOM.classList.add('h5p-checkbox-list-description');
      descriptionDOM.innerHTML = this.params.taskDescription;
      dom.append(descriptionDOM);

      checkboxGroupLabel = Util.purifyHTML(this.params.taskDescription);
    }

    this.checkboxList = new CheckboxList({
      checkboxes: this.params.checkboxes,
      previousState: this.previousState.checkboxes ?? [],
      checkboxGroupLabel: checkboxGroupLabel
    });
    dom.append(this.checkboxList.getDOM());

    return dom;
  }

  /**
   * Retrieve textual representation as required by DocumentExportPage.
   * @returns {object} Textual representation as required by DocumentExportPage.
   */
  getInput() {
    return {
      description: Util.purifyHTML(this.params.taskDescription),
      value: this.checkboxList.getTextualRepresentation()
    };
  }
}
