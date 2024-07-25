import AbstractView from '../framework/view/abstract-view';
import {humanizeDateEvent, getFilterOffers} from '../utils';

const createTripInfoTemplate = (points = [], offersArray) => {

  const dateStartTrip = points[0].dateFrom !== null ? humanizeDateEvent(points[0].dateFrom) : '';
  const dateFinishTrip = [...points].pop().dateTo !== null ? humanizeDateEvent([...points].pop().dateTo) : '';
  const dateFinishTripTransformed = dateStartTrip.split(' ')[0] === dateFinishTrip.split(' ')[0] ? dateFinishTrip.split(' ')[1] : dateFinishTrip;

  const listCities = [...points].map((point) => point.destination.name);
  const citiesInfo = listCities.length > 3 ? `${listCities[0]} — ... — ${listCities.pop()}` : `${listCities[0]} — ${listCities[1]} — ${listCities[2]}`;

  const calculateCostTrip = () => {
    const offersList = [...points].map((point) => ({'basePrice': point.basePrice, 'offers': getFilterOffers(point.type, offersArray)}));

    let costTrip = null;
    offersList.forEach((point) => {
      const offersCost = point.offers.reduce((acc, currentValue) => acc + currentValue.price, 0);
      costTrip += point.basePrice + offersCost;
    });
    return costTrip;
  };

  return (
    `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
            <h1 class="trip-info__title">${citiesInfo}</h1>
            <p class="trip-info__dates">${dateStartTrip}&nbsp;&mdash;&nbsp;${dateFinishTripTransformed}</p>
        </div>
        <p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculateCostTrip()}</span>
        </p>
    </section>`
  );
};

export default class TripInfoView extends AbstractView {
  #points = null;
  #offersArray = null;

  constructor(points, offers) {
    super();
    this.#points = points;
    this.#offersArray = offers;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#offersArray);
  }
}
