import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import {FilterType, SortType, eventType} from './const';
dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const humanizeDateEvent = (date) => date !== null ? dayjs(date).format('MMM D') : '';

const humanizeTimeEvent = (date) => date !== null ? dayjs(date).format('HH:mm') : 'indicate time';

const countDurationEvent = (dateFrom, dateTo) => (dateFrom === null || dateTo === null) ? null : dayjs(dateTo).diff(dayjs(dateFrom), 'm');

const isDateNowAfterForFilters = (date) => dayjs().isAfter(date.dateTo, 'day');

const isDateNowBeforeForFilters = (date) => dayjs().isSameOrBefore(date.dateFrom, 'day');

const isDateOneBefore = (dateOne, dateTwo) => dayjs(dateOne).isBefore(dateTwo);

const isDateOneBeforeOrSame = (dateOne, dateTwo) => dayjs(dateOne).isSameOrBefore(dateTwo, 'h');

const humanizeDateEventForForm = (date) => date !== null ? dayjs(date).format('DD/MM/YY[ ]HH:mm') : '';

const isDateEqual = (dateA, dateB) => dayjs(dateA).isSame(dateB, 'h');

// const createOffersClass = (name) => {
//   let lastWord = name.split(' ').pop();
//   if (lastWord === 'class') {
//     lastWord = name.split(' ').pop();
//   }
//   return lastWord;
// };

const humanizeDurationEvent = (dateFrom, dateTo) => {
  if (!dateFrom || !dateTo) {
    return null;
  }
  const durationEventInMinute = countDurationEvent(dateFrom, dateTo);
  const anotherUnits = (durationEventInMinute < 60) ? dayjs.duration(durationEventInMinute, 'm').format('mm[M]') :
    (durationEventInMinute < 1440) ? dayjs.duration(durationEventInMinute, 'm').format('HH[H] mm[M]') :
      dayjs.duration(durationEventInMinute, 'm').format('DD[D] HH[H] mm[M]');
  return anotherUnits;
};

const iconsOfTypes = {
  [eventType.BUS]: 'img/icons/taxi.png',
  [eventType.CHECKIN]: 'img/icons/check-in.png',
  [eventType.DRIVE]: 'img/icons/drive.png',
  [eventType.FLIGHT]: 'img/icons/check-in.png',
  [eventType.RESTAURANT]: 'img/icons/check-in.png',
  [eventType.SHIP]: 'img/icons/check-in.png',
  [eventType.SIGHTSEEING]: 'img/icons/check-in.png',
  [eventType.TAXI]: 'img/icons/check-in.png',
  [eventType.TRAIN]: 'img/icons/check-in.png',
};

const chooseIcons = (type) => iconsOfTypes[type];

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.PAST]: (points) => points.filter(isDateNowAfterForFilters),
  [FilterType.FUTURE]: (points) => points.filter(isDateNowBeforeForFilters),
};

const sort = {
  [SortType.DAY]: true,
  [SortType.EVENT]: false,
  [SortType.TIME]: true,
  [SortType.PRICE]: true,
  [SortType.OFFERS]: false
};

const getWeightForNullDate = (pointA, pointB) => {
  if (pointA === null && pointB === null) {
    return 0;
  }

  if (pointA === null) {
    return 1;
  }

  if (pointB === null) {
    return -1;
  }

  return null;
};

const sortPricePointDown = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.basePrice, pointB.basePrice);
  return weight ?? pointB.basePrice - pointA.basePrice;
};

const sortDurationPointDown = (pointA, pointB) => {
  const countDurationPointA = countDurationEvent(pointA.dateFrom, pointA.dateTo);
  const countDurationPointB = countDurationEvent(pointB.dateFrom, pointB.dateTo);
  const weight = getWeightForNullDate(countDurationPointA, countDurationPointB);
  return weight ?? countDurationPointB - countDurationPointA;
};

const sortDayPointUp = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);
  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
};

const getFilterOffers = (type, offersBoard) => {

  if (offersBoard.get(type).length === 0) {
    return [];
  }

  return offersBoard.get(type);
}

export {
  humanizeDateEvent,
  humanizeTimeEvent,
  humanizeDurationEvent,
  chooseIcons,
  iconsOfTypes,
  humanizeDateEventForForm,
  isDateOneBefore,
  isDateOneBeforeOrSame,
  filter,
  sort,
  sortDurationPointDown,
  sortPricePointDown,
  sortDayPointUp,
  getFilterOffers,
  isDateEqual,
};
