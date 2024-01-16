/**
 * Mixin containing methods for H5P Question Type contract.
 */
export default class QuestionTypeContract {
  /**
   * Determine whether the task was answered already.
   * @returns {boolean} True if answer was given by user, else false.
   * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-1}
   */
  getAnswerGiven() {
    return this.checkboxList.getAnswerGiven();
  }

  /**
   * Get current score.
   * @returns {number} Current score.
   * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-2}
   */
  getScore() {
    /*
     * Workaround: Moodle's gradebook does not use the xAPI completion flag to
     * track completion, but requires the user to have 1 point at least.
     */
    return 1;
  }

  /**
   * Get maximum possible score.
   * @returns {number} Maximum possible score.
   * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-3}
   */
  getMaxScore() {
    /*
     * Workaround: Moodle's gradebook does not use the xAPI completion flag to
     * track completion, but requires the user to have 1 point at least.
     */
    return 1;
  }

  /**
   * Show solutions.
   * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-4}
   */
  showSolutions() {
    // stub
  }

  /**
   * Reset task.
   * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-5}
   */
  resetTask() {
    this.checkboxList.reset();
  }

  /**
   * Get xAPI data.
   * @returns {object} XAPI statement.
   * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-6}
   */
  getXAPIData() {
    const xAPIEvent = this.createXAPIEvent('completed');

    return {
      statement: xAPIEvent.data.statement
    };
  }

  /**
   * Get current state.
   * @returns {object|undefined} Current state to be retrieved later.
   * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-7}
   */
  getCurrentState() {
    if (!this.checkboxList.getAnswerGiven()) {
      return;
    }

    return this.checkboxList.getCurrentState();
  }
}
