/* Service is for policy holder data object definition */
import { Injectable } from '@angular/core';
@Injectable()
export class PolicyHolderPageDataDefinitionService {
    public policyHolderTypes = { 'mainOwner': true, 'coOwner1': false, 'coOwner2': false, 'driver': false };
    public partyIds = { 'driver': '', 'mainOwner': '', 'coOwner1': '', 'coOwner2': '', 'other': '' };
    public roleIds = { 'driver': '', 'mainOwner': '', 'coOwner1': '', 'coOwner2': '', 'other': '' };
    public contactIds = { 'mainOwner': { "emailSelf": "", "phoneSelf": "" }, 'coOwner1': { "emailSelf": "", "phoneSelf": "" }, 'coOwner2': { "emailSelf": "", "phoneSelf": "" }, 'driver': { "emailSelf": "", "phoneSelf": "" }, 'other': { "emailSelf": "", "phoneSelf": "" } };
    public selectedOwnerTypeContact = [{ "key": "Telefon", "value": "" },
    { "key": "Email", "value": "" }];
    public selectedOwnerTypeAddrRes = [{ "key": "Kod pocztowy", "value": "" },
    { "key": "Miasto", "value": "" },
    { "key": "Ulica", "value": "" },
    { "key": "Nr domu", "value": "" }, { "key": "Nr mieszkania", "value": "" }];
    public selectedOwnerTypeAddrMail = [{ "key": "Kod pocztowy", "value": "" },
    { "key": "Miasto", "value": "" },
    { "key": "Ulica", "value": "" },
    { "key": "Nr domu", "value": "" }, { "key": "Nr mieszkania", "value": "" }];
    public mainOwnerContact = [{ "key": "Telefon", "value": "" },
    { "key": "Email", "value": "" }];
    public mainOwnerAddrRes = [{ "key": "Kod pocztowy", "value": "" },
    { "key": "Miasto", "value": "" },
    { "key": "Ulica", "value": "" },
    { "key": "Nr domu", "value": "" }, { "key": "Nr mieszkania", "value": "" }];
    public coOwner1AddrRes = [{ "key": "Kod pocztowy", "value": "" },
    { "key": "Miasto", "value": "" },
    { "key": "Ulica", "value": "" },
    { "key": "Nr domu", "value": "" }, { "key": "Nr mieszkania", "value": "" }];
    public coOwner2AddrRes = [{ "key": "Kod pocztowy", "value": "" },
    { "key": "Miasto", "value": "" },
    { "key": "Ulica", "value": "" },
    { "key": "Nr domu", "value": "" }, { "key": "Nr mieszkania", "value": "" }];
    public nonPHAddrCheck = { 'mainOwner': 'yes', 'coOwner1': 'yes', 'coOwner2': 'yes' };
    public cessionData: object = { 'city': '', 'bankname': '', 'branch': '', 'zip': '', 'prefix': '', 'street': '', 'houseno': '', 'flatno': '' };
    public other =  [{ "key": "Nazwa", "value": "" },
    { "key": "Nazwisko", "value": "" }, {"key":"Nazwisko rodowe", "value":""},
    { "key": "PESEL", "value": "", }
    ];
    public addressIds = { 'driver': [], 'mainOwner': [], 'coOwner1': [], 'coOwner2': [], 'other': [] };
}