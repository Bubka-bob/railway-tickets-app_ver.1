import Validator from "validator";

export default function ValidationEmail(value) {
  return Validator.isEmail(value);
}