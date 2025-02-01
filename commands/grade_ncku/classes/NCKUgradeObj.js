class NCKUgradeObj {
    constructor() {
        this.title = '';
        this.subjects = [];
    }

    /**
     * Adds a subject to the subjects array.
     * 
     * If the provided object does not contain all of these properties, an error will be thrown.
     * 
     * @param {Object} subject - The subject object to add.
     * @param {string} subject.name - The name of the subject.
     * @param {string} subject.type - The type of the subject (e.g., 'Core', 'Elective').
     * @param {string} subject.score - The score achieved in the subject.
     * @param {string} subject.credit - The credit value of the subject.
     * @param {string} subject.code - The subject code.
     * 
     * @throws {Error} Throws an error if the provided object is not valid or missing required properties.
     * 
     * @returns {NCKUgradeObj} The current instance (`this`).
     * 
     * @example
     * const subject = { name: 'Math', type: 'Core', score: 90, credit: 3, code: 'MTH101' };
     * obj.addSubject(subject);
     */
    addSubject(subject) {
        if (typeof subject === 'object' && subject !== null) {
            const { name, type, score, credit, code } = subject;
            if (name && type && score && credit && code) {
                this.subjects.push({
                    name,
                    type,
                    score,
                    credit,
                    code
                });
            } else {
                throw new Error('Invalid subject object: Missing required properties');
            }
        } else {
            throw new Error('Argument must be an object');
        }
        return this;
    }
    /**
     * Sets a title.
     * 
     * @param {String} title
     * 
     * @returns {NCKUgradeObj} The current instance (`this`).
     */
    setTitle(title) {
        this.title = title;
        return this;
    }
}

export default NCKUgradeObj;