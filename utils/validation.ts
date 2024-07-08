
var EmailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var UserNameRegEx = /^[a-zA-Z_]{0,60}$/;
var NumericNumberRegEx = /^[0-9]{0,20}$/;
var NumericResultRegEx = /^(\d{0,2}(\.\d{1,2})?|100(\.00?)?)$/;
var NameRegEx = /^[a-zA-Z \s()-]{0,60}$/;
var NumberRegEx = /^[0]?[789]\d{9}$/;
var IndNumberRegEx = /^((\+91)?|91)?[789][0-9]{9}/;
var PincodeRegEx = /^\d{6}$/;
var LatLngRegEx = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/;
var GstRegEx = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
var CountryRegEx = "India";
var UUIDRegEx = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/;
var strongPasswordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,16}$/

const email = (email: string) => {
    if (email.includes("+")) {
        return false
    }
    return EmailRegEx.test(String(email).toLowerCase());
}
const numberDataTypeValidation = (str: string) => {
    return typeof (str) === "number";
}
const nameValidation = (str: string) => {
    if (str) {
        return NameRegEx.test(String(str).trim());
    }
    return false
}
const UserNameValidation = (str: string) => {
    return UserNameRegEx.test(String(str).trim());
}
const MobileNumberValidation = (str: string) => {
    return NumberRegEx.test(str);
}
const NumberValidation = (str: string) => {
    return NumericNumberRegEx.test(str);
}
const ResultValidation = (str: string) => {
    return NumericResultRegEx.test(str);
}
const MobileNumberWithInValidation = (str: string) => {
    return IndNumberRegEx.test(str);
}
const FoodLicenseValidation = (str: string) => {
    // return FoodLicenseRegEx.test(str);
    return str
}
const DrugLicenseValidation = (str: string) => {
    // return DrugLicenseRegEx.test(str);
    return str
}
const GstValidation = (str: string) => {
    return GstRegEx.test(str);
}
const AddressValidation = (str: string) => {
    // return (String(str).length > 10) ? AddressRegEx.test(str) : false
    return (String(str).trim().length > 10) ? str : false
}
const PincodeValidation = (str: string) => {
    return PincodeRegEx.test(str);
}
const LatLngValidation = (str: string) => {
    return LatLngRegEx.test(str);
}
const CountryValidation = (str: string) => {
    return str === CountryRegEx;
}
const UuidValidation = (str: string) => {
    return UUIDRegEx.test(str);
}

const StringValidation = (str: string) => {
    return (typeof (str) === 'undefined') ? false : (String(str).trim().length >= 3) ? nameValidation(str) : false
}
const ObjectValidation = (str: string) => {
    return (typeof (str) === 'object')
}
const LengthValidation = (str: string, length: number) => {
    return (String(str).trim().length > length)
}

const strongPassword = (str: string) => {
    return strongPasswordRegEx.test(str);
}
const stringReplace = (str: string) => {
    let newStr = str?.toLocaleLowerCase()
    return newStr.replace(/ /g, "-")
}

const roundOffCeil = (count: number, limit: number) => {
    const RoundLimit = (count / limit)
    const totalPage = Math.ceil(RoundLimit)
    return totalPage
}
const showPrice = (price: number) => {
    var parts = price?.toFixed(2)?.toString()
    parts = parts?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return parts
}

const validation = {
    roundOffCeil,
    stringReplace,
    email,
    numberDataTypeValidation,
    nameValidation,
    UserNameValidation,
    MobileNumberValidation,
    NumberValidation,
    ResultValidation,
    MobileNumberWithInValidation,
    FoodLicenseValidation,
    DrugLicenseValidation,
    GstValidation,
    AddressValidation,
    PincodeValidation,
    LatLngValidation,
    CountryValidation,
    UuidValidation,
    StringValidation,
    ObjectValidation,
    LengthValidation,
    strongPassword,
    showPrice,
    strongPasswordRegEx
}
export default validation