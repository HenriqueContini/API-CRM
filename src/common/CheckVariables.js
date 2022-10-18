export default class CheckVariables {
    static isNullOrUndefined(variable) {
        if(variable === null || variable === undefined) {
            return true;
        }

        return false;
    }
}