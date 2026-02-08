import { LightningElement, api } from 'lwc';

export default class KeyResultChild extends LightningElement {
    @api keyResult;

    get name() {
        return this.keyResult.Name;
    }

    @api
    refreshTargets() {
        const targetComp = this.template.querySelector('c-target-child');
        if (targetComp) {
            targetComp.refreshData();
        }
    }
}