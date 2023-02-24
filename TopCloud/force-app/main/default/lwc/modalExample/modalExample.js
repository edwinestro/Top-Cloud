
import { LightningElement, track } from 'lwc';

export default class ModalExample extends LightningElement {
  @track isModalOpen = false;

  showModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
