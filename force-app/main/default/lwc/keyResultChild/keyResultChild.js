import { LightningElement, api, wire } from 'lwc';

export default class KeyResultChild extends LightningElement {
    @api keyResult;

    get name() {
        return this.keyResult.Name;
    }
}