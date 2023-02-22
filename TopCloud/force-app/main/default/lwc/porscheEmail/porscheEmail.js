import { LightningElement, track } from 'lwc';

export default class porscheEmail extends LightningElement {
    @track modelName;

    handleModelNameChange(event) {
        this.modelName = event.target.value;
    }

    handleClick() {
        window.open(`mailto:info@porsche.com?subject=Quote Request for ${this.modelName}`);    }
}