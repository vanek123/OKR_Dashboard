import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import GET_TARGETS from '@salesforce/apex/okrDashboardController.getTargets';
import { refreshApex } from '@salesforce/apex';
import createTarget from '@salesforce/apex/okrDashboardController.createTarget';

export default class TargetChild extends LightningElement {
    @api keyResultId;
    @track showTargetForm = false;
    @track targets = [];

    @wire(GET_TARGETS, { 
        keyResultId: '$keyResultId'
    })
    wiredObjectives(value) {
        this.wiredTargets = value;
        
        const { data, error} = value;
        if (error) {
        this.error = error;
        console.error(error);
        } else if (data) {
        this.targets = data;
        }
    }

    get hasTargets() {
        if (this.targets.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    handleTargetPopup() {
        this.showTargetForm = true;
    }

    handleTargetCancel() {
        this.showTargetForm = false;
    }

    handleTargetSave(event) {
        const {type, contractType, targetNumber} = event.detail;
        
        createTarget({
            keyResultId: this.keyResultId,
            type,
            contractType,
            targetNumber
        })
        .then(() => {
            this.showTargetForm = false;
            refreshApex(this.wiredTargets);
        })
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Target created successfully',
                    variant: 'success'
                })
            )
        })
        .catch(error => {
            console.error(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: error.body?.message || 'Error creating target',
                    variant: 'error'
                })
            );
        });
        
    }
}