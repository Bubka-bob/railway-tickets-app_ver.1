export const initialOrderState = {
  personCount: {
    departure: {
      adult: null,
      child: null,
      baby: null,
    },
    arrival: {
      adult: null,
      child: null,
      baby: null,
    }
  },
  services: {
    departure: {
      first: null,
      second: null,
      third: null,
      fourth: null,
    },
    arrival: {
      first: null,
      second: null,
      third: null,
      fourth: null,
    }
  },
  user: {
    firstName: null,
    lastName: null,
    patronymic: null,
    phone: null,
    email: null,
    paymentMethod: null,
  },
  legs: {
    departure: {
      routeDirectionId: null,
      seats: [{
        coachId: null,
        seatNumber: null,
        isChild: null,
        includeChildrenSeat: null,
        passengerInfo: {
          isAdult: null,
          firstName: null,
          lastName: null,
          patronymic: null,
          gender: null,
          birthday: null,
          documentType: null,
          documentData: null
        }
      }]
    },
    arrival: {
      routeDirectionId: null,
      seats: [{
        coachId: null,
        seatNumber: null,
        isChild: null,
        includeChildrenSeat: null,
        passengerInfo: {
          isAdult: null,
          firstName: null,
          lastName: null,
          patronymic: null,
          gender: null,
          birthday: null,
          documentType: null,
          documentData: null
        }
      }]
    }
  }
};