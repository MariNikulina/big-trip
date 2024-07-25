import {generatePoint} from '../mock/point';
import {generateOffers} from '../mock/point';
import Observable from '../framework/observable';
import {UpdateType} from '../const';

export default class PointModel extends Observable{
  #pointsApiService = null;
  //#points = Array.from({length: 3}, generatePoint);
  #points = [];

  #offersMoc = [];
  #offers = [];
  #destinations = [];

  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;

    this.#pointsApiService.points.then((points) => {
      console.log(points)
    })
    this.#offersMoc = Array.from({length: 5}, generateOffers);
  }

  get points() {
    return this.#points;
  }

  get offer() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }

    try {
      const offersFromApi = await this.#pointsApiService.offers;
      const transformedOffers = offersFromApi.map(({offers, type}) => (
        [type, offers]
      ));
      this.#offers = new Map(transformedOffers);
      console.log(this.#offers)
    } catch (err) {
      this.#offers = [];
    }

    try {
      const destinationsFromApi = await this.#pointsApiService.destinations;
      const transformedDestinations = destinationsFromApi.map((destination) => (
        [destination.name, destination]
      ));
      this.#destinations = new Map(transformedDestinations);
      console.log(this.#destinations)
    } catch (err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  };

  set points(arrayPoints) {
    this.#points = arrayPoints;
  }

  updatePoint = async (updateType, update) => {
    const index = this.points.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1)
      ];

      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can\'t update task');
    }


  };

  addPoint = async (updateType, update) => {
    console.log(update)
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [
        newPoint,
        ...this.#points
      ];
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add task');
    }
  };

  deletePoint = async (updateType, update) => {
    const index = this.points.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType);
    } catch (e) {
      throw new Error('Can\'t delete task');
    }
  };

  #adaptToClient = (point) => {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };
}
