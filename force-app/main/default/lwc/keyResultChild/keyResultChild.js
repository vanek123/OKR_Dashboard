import { LightningElement, api } from 'lwc';

export default class KeyResultChild extends LightningElement {
    @api keyResult;

    get name() {
        return this.keyResult.Name;
    }
}