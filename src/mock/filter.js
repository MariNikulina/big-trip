import {filter} from '../utils';

const generateFilters = (points) => Object.entries(filter).map(([nameFilter, isDisabled]) =>
  ({
    name: nameFilter,
    active: isDisabled(points)
  })
);


export {generateFilters};
