import {iconsOfTypes} from '../utils';
import dayjs from 'dayjs';
// import {cities} from '../const';

const getrandomInteger = function (min, max) {
  min = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  max = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.floor(Math.random() * (max - min + 1)) + min;
  return result;
};

const createIdGenerator =  function () {
  let lastGeneratedId = null;
  return function () {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

const getRandomElement = function (element) {
  return element[getrandomInteger(0, element.length - 1)];
};

const generatePointId = createIdGenerator();

export const generateDescription = () => {
  const descriptionsBlanks = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna,' +
    ' non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. ' +
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, ' +
    'sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ' +
    'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. ' +
    'In rutrum ac purus sit amet tempus.';

  const createPictures = () => ({
    'src': `img/photos/${getrandomInteger(1, 5)}.jpg`,
    'description': getRandomElement(descriptionsBlanks.split('. '))
  });

  return {
    'description': getRandomElement(descriptionsBlanks.split('. ')),
    'name': getRandomElement(cities),
    'pictures': Array.from({length: getrandomInteger(1, 5)}, createPictures)
  };
};

const generateOfferId = createIdGenerator();

export const generateOffers = () => {

  const titleOffers = ['Upgrade to a business class', 'Order Uber', 'Switch to comfort', 'Add breakfast', 'Book tickets'];

  return {
    'id': generateOfferId(),
    'title': titleOffers[getrandomInteger(0, titleOffers.length - 1)],
    'price': getrandomInteger(10, 100)
  };
};

export const generateArrayOffersId = () => {
  const isExistOffers = Boolean(getrandomInteger(0, 1));

  if (!isExistOffers) {
    return null;
  }

  const arrayId = [];
  const lengthArrayId = getrandomInteger(1, 5);
  for (let i = 0; i < lengthArrayId; i++) {
    arrayId.push(getrandomInteger(1, 5));
  }

  return new Set(arrayId);
};

const generateDateFrom = () => {
  const isExistDate = Boolean(getrandomInteger(0, 1));

  if (!isExistDate) {
    return null;
  }

  const maxDateFrom = 148;
  return dayjs().add(getrandomInteger(0, maxDateFrom), 'hour').format();
};

const generateDateTo = () => {
  const maxDateTo = 200;
  return dayjs().add(getrandomInteger(100, maxDateTo), 'hour').format();
};

export const generatePoint = () => ({
  'basePrice': getrandomInteger(100, 11000),
  'dateFrom': generateDateFrom(),
  'dateTo': generateDateTo(),
  'destination': generateDescription(),
  'id': generatePointId(),
  'isFavorite': Boolean(getrandomInteger(0, 1)),
  'offers': generateArrayOffersId(),
  'type': getRandomElement(Object.keys(iconsOfTypes))
});
