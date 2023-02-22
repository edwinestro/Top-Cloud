import { LightningElement, api } from 'lwc';
import track from 'c/track';
    
export default class tTP extends LightningElement {
    @api boolTrack;
    @api boolTag;
    @api boolPing;
}