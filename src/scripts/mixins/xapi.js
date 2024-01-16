import Util from '@services/util.js';

/** @constant {string} DEFAULT_DESCRIPTION Default description */
export const DEFAULT_DESCRIPTION = 'Checkbox list';

/**
 * Mixin containing methods for xapi stuff.
 */
export default class XAPI {
  /**
   * Trigger xAPI event.
   * @param {string} verb Short id of the verb we want to trigger.
   */
  triggerXAPIEvent(verb) {
    const xAPIEvent = this.createXAPIEvent(verb);
    this.trigger(xAPIEvent);
  }

  /**
   * Create an xAPI event.
   * @param {string} verb Short id of the verb we want to trigger.
   * @returns {H5P.XAPIEvent} Event template.
   */
  createXAPIEvent(verb) {
    const xAPIEvent = this.createXAPIEventTemplate(verb);

    Util.extend(
      xAPIEvent.getVerifiedStatementValue(['object', 'definition']),
      this.getXAPIDefinition());

    if (verb === 'completed') {
      xAPIEvent.setScoredResult(
        this.getScore(), // Question Type Contract mixin
        this.getMaxScore(), // Question Type Contract mixin
        this,
        true,
        true
      );
    }

    xAPIEvent.data.statement.result.response =
      this.checkboxList.getXAPIResponse();

    return xAPIEvent;
  }

  /**
   * Get the xAPI definition for the xAPI object.
   * @returns {object} XAPI definition.
   */
  getXAPIDefinition() {
    const definition = {};

    definition.name = {};
    definition.name[this.languageTag] = this.getTitle();
    // Fallback for h5p-php-reporting, expects en-US
    definition.name['en-US'] = definition.name[this.languageTag];

    definition.description = {};
    definition.description[this.languageTag] = this.getDescription();
    // Fallback for h5p-php-reporting, expects en-US
    definition.description['en-US'] = definition.description[this.languageTag];

    definition.type = 'http://adlnet.gov/expapi/activities/cmi.interaction';
    definition.interactionType = 'choice';

    definition.choices = this.checkboxList.getXAPIChoices(this.languageTag);
    /*
     * Workaround for H5P report library that does not handle choice
     * interactions without right or wrong answers. Whatever the user answered
     * will be marked as correct
     */
    definition.correctResponsesPattern = [this.checkboxList.getXAPIResponse()];

    return definition;
  }

  /**
   * Get task title.
   * @returns {string} Title.
   */
  getTitle() {
    // H5P Core function: createTitle
    return H5P.createTitle(
      this.extras?.metadata?.title || DEFAULT_DESCRIPTION
    );
  }

  /**
   * Get description.
   * @returns {string} Description.
   */
  getDescription() {
    return this.params.header || DEFAULT_DESCRIPTION;
  }
}
