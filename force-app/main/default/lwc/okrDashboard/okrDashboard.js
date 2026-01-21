import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import Name from '@salesforce/schema/User.Name';
import Id from '@salesforce/user/Id';
import OBJECTIVE_NAME_FIELD from '@salesforce/schema/Objective__c.Name';
import YEAR_FIELD from '@salesforce/schema/Objective__c.Year__c';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class OkrDashboard extends LightningElement {
  userName;
  selectedYear = '';
  selectedUser = '';
  showObjectiveForm = false;
  showKeyResultForm = false;
  showReviewForm = false;
  showSurveyForm = false;
  showCaseStudyForm = false;
  showGoogleReviewForm = false;
  value;

  @wire(getRecord, { recordId: Id, fields: [Name] })
  userDetails({ error, data}) {
    if (error) {
      this.error = error;
    } else if (data) {
      if (data.fields.Name.value != null) {
        this.userName = data.fields.Name.value;
      }
    }
  }

  creatingOptions = [
    {   
       
      label: "Objective",
      value: "objective",
      description: "Create new objective" 
    },
    {
      
      label: "Key result",
      value: "key result",
      description: "Create new key result",
    },
    {
      
      label: "Review",
      value: "review",
      description: "Create new review",
    },
    {
      
      label: "Survey",
      value: "survey",
      description: "Create new survey",
    },
    {
      
      label: "Case study",
      value: "case study",
      description: "Create new case study",
    },
    {
        
      label: "Google review",
      value: "google review",
      description: "Create new google review",
    }
  ];

  handleCreatingChange(event) {
    // Get the string of the "value" attribute on the selected option
    this.value = event.detail.value;

    if (this.value === "objective") {
      this.showObjectiveForm = true;
    }
    else if (this.value === "key result") {
      this.showKeyResultForm = true;
    }
    else if (this.value === "review") {
      this.showReviewForm = true;
    }
    else if (this.value === "survey") {
      this.showSurveyForm = true;
    }
    else if (this.value === "case study") {
      this.showCaseStudyForm = true;
    }
    else if (this.value === "google review") {
      this.showGoogleReviewForm = true;
    }
    
  }

  // Creating objective (form)
  @api objectiveFields = [OBJECTIVE_NAME_FIELD, YEAR_FIELD];
  @api objectiveRecordId;
  
  
  handleObjectiveSave() {
    this.showObjectiveForm = false;
    this.objectiveRecordId = null;
    this.value = '';

    const evt = new ShowToastEvent({
      title: 'Success',
      message: 'The record was created successfully!',
      variant: 'success',
    });
    this.dispatchEvent(evt);
  }

  handleObjectiveCancel() {
    this.showObjectiveForm = false;
    this.objectiveRecordId = null;
    this.value = '';
    
  }

  // Cancel button on key result form
  handleKeyResultCancel() {
    this.showKeyResultForm = false;
    this.value = undefined;
  }

  // Save button on key result form
  handleKeyResultSave() {
    this.showKeyResultForm = false;
    this.value = undefined;

    const evt = new ShowToastEvent({
      title: 'Success',
      message: 'The record was created successfully!',
      variant: 'success',
    });
    this.dispatchEvent(evt);

  }

  handleReviewCancel() {
    this.showReviewForm = false;
    this.value = undefined;
  }

  handleReviewSave() {
    this.showReviewForm = false;
    this.value = undefined;

    const evt = new ShowToastEvent({
      title: 'Success',
      message: 'The record was created successfully!',
      variant: 'success',
    });
    this.dispatchEvent(evt);
  }
  
  handleSurveyCancel() {
    this.showSurveyForm = false;
    this.value = undefined;
  }

  handleSurveySave() {
    this.showSurveyForm = false;
    this.value = undefined;

    const evt = new ShowToastEvent({
      title: 'Success',
      message: 'The record was created successfully!',
      variant: 'success',
    });
    this.dispatchEvent(evt);
  }

  handleCaseStudyCancel() {
    this.showCaseStudyForm = false;
    this.value = undefined;
  }

  handleCaseStudySave() {
    this.showCaseStudyForm = false;
    this.value = undefined;

    const evt = new ShowToastEvent({
      title: 'Success',
      message: 'The record was created successfully!',
      variant: 'success',
    });
    this.dispatchEvent(evt);
  }

  handleGoogleReviewCancel() {
    this.showGoogleReviewForm = false;
    this.value = undefined;
  }

  handleGoogleReviewSave() {
    this.showGoogleReviewForm = false;
    this.value = undefined;

    const evt = new ShowToastEvent({
      title: 'Success',
      message: 'The record was created successfully!',
      variant: 'success',
    });
    this.dispatchEvent(evt);
  }
  
}
