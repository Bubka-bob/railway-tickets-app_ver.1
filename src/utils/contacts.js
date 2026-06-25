import phoneImg from "../assets/footer-contact-icon-phone.png"
import emailImg from "../assets/footer-contact-icon-email.png"
import skypeImg from "../assets/footer-contact-icon-skype.png"
import locationImg from "../assets/footer-contact-icon-location.png"

export const contacts = [
  {
    href: "tel:88000000000",
    src: phoneImg,
    alt: "Телефон",
    desc: "8 (800) 000 00 00",
  },
  {
    href: "mailto:inbox@mail.ru",
    src: emailImg,
    alt: "Электронная почта",
    desc: "inbox@mail.ru",
  },
  {
    href: "Skype:tu.train.tickets?call",
    src: skypeImg,
    alt: "Скайп",
    desc: "tu.train.tickets",
  },
  {
    href: "https://yandex.ru/maps/-/CDFwyMjA",
    src: locationImg,
    alt: "Адрес на карте",
    desc: "г. Москва ул. Московская 27-35 555 555",
  },
];