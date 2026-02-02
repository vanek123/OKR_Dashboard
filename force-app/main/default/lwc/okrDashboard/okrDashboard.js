import { LightningElement, wire, track, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import Name from '@salesforce/schema/User.Name';
import Id from '@salesforce/user/Id';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import GET_OBJECTIVES from '@salesforce/apex/okrDashboardController.getObjectives';
import GET_USERS from '@salesforce/apex/okrDashboardController.getUsers';
import { refreshApex } from '@salesforce/apex';

export default class OkrDashboard extends LightningElement {
  userName;
  showObjectiveForm = false;
  objectives = [];
  showKeyResultForm = false;
  showReviewForm = false;
  showSurveyForm = false;
  showCaseStudyForm = false;
  showGoogleReviewForm = false;
  showObjectiveItself = false;
  value;
  yearValue;
  yearOptions = [];
  userValue;
  selectedUserId;
  krId;
  startDate;
  endDate;

  @track userData;
  @track userOptions = [];
  currentYear = new Date().getFullYear();

  connectedCallback() {
    
    for (let i = this.currentYear - 3; i <= this.currentYear + 3; i++) {
      this.yearOptions.push({ label: i.toString(), value: i.toString() }); 
    }
    
    this.yearValue = this.currentYear.toString();
    this.selectedUserId = Id;
    this.userValue = Id;
     
  }
  
  get chosenYear() {
    return this.yearValue ? parseInt(this.yearValue, 10) : null;
  }

  // Get all users from apex controller 
  // and pass them into the combobox 
  @wire (GET_USERS)
  wiredUsers({ error, data }) {
    if (data) {
      this.userData = data;
      this.userOptions = data.map((user) => ({
        label: user.Name,
        value: user.Id,
      }));
    } else if (error) {
      this.error = error;
      console.error('Error fetching users: ', error);
    }
    
  }

  // Choose user from combobox
  handleUserChange(event) {
    this.userValue = event.detail.value; 
    this.selectedUserId = event.detail.value;
  }


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
  
  @wire(GET_OBJECTIVES, { 
    year: '$chosenYear', 
    userId: '$selectedUserId' 
  })
  wiredObjectives(value) {
    this.wiredObjectivesResult = value;
    
    const { data, error} = value;
    if (error) {
      this.error = error;
      console.error(error);
    } else if (data) {
      this.objectives = data;
      //this.objectiveIds = data.map((objective) => objective.Id);
    }
  }

  refreshObjectives() {
    refreshApex(this.wiredObjectivesResult);
  }

  handleYearChange(event) {
    this.yearValue = event.detail.value;

    refreshApex(this.wiredObjectivesResult);
  }

  get displayedUserName() {
    const selected = this.userOptions.find(u => u.value === this.selectedUserId);
    return selected ? selected.label : this.userName;
  }

  get hasObjectives() {
    if (this.objectives.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  get isYearSelected() {
    if (this.yearValue) {
      return true;
    }
    return false;
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

  handleObjectiveSave() {
    this.showObjectiveForm = false;
    this.objectiveRecordId = null;
    this.value = '';
    //this.getObjectives();

    this.refreshObjectives();

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

    refreshApex(this.wiredObjectivesResult);

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