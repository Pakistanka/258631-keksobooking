'use strict';

var CARDS_COUNT = 8;
var PIN_WIDTH = 62;
var PIN_HEIGHT = 84;
var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var OFFER_TYPES = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var mapSection = document.querySelector('.map');
mapSection.classList.remove('map--faded');
var mapPins = document.querySelector('.map__pins');
var pinItem = document.querySelector('#pin').content.querySelector('.map__pin');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var cardItem = document.querySelector('#card').content.querySelector('.map__card');

// get random number
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// create an avatar
var getAuthorAvatarLink = function () {
  return 'img/avatars/user0' + getRandomNumber(1, 9) + '.png';
};

// create title
var getRandomOfferTitle = function () {
  return TITLES[getRandomNumber(0, TITLES.length - 1)];
};

var getRandomOfferType = function () {
  return Object.keys(OFFER_TYPES)[getRandomNumber(0, Object.keys(OFFER_TYPES).length)];
};

//
var getRandomOfferCheckinsTime = function () {
  return CHECKINS[getRandomNumber(0, CHECKINS.length - 1)];
};

var getRandomOfferCheckoutsTime = function () {
  return CHECKOUTS[getRandomNumber(0, CHECKOUTS.length - 1)];
};

var getShuffledArray = function (array) {
  for (var i = 0; i < array.length - 1; i++) {
    var j = getRandomNumber(0, array.length);
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

var getRandomOfferFeaturesLength = function () {
  return getRandomNumber(1, FEATURES.length);
};

var getRandomOfferFeaturesArray = function () {
  return getShuffledArray(FEATURES).slice(getRandomOfferFeaturesLength() - 1, FEATURES.length - 1);
};

var getRandomOfferPhotosArray = function () {
  return getShuffledArray(PHOTOS);
};

var getOfferAdress = function () {
  return getRandomNumber(40, mapSection.offsetWidth - 40) + ', ' + getRandomNumber(130, 630);
};


// create ads pin
var generateMapPinInfo = function () {
  var pin = {};
  var author = {};
  var offer = {};
  var location = {};
  author.avatar = getAuthorAvatarLink();
  offer.title = getRandomOfferTitle();
  offer.address = getOfferAdress();
  offer.price = getRandomNumber(1000, 1000000);
  offer.type = getRandomOfferType();
  offer.rooms = getRandomNumber(1, 6);
  offer.guests = getRandomNumber(1, 21);
  offer.checkin = getRandomOfferCheckinsTime();
  offer.checkout = getRandomOfferCheckoutsTime();
  offer.features = getRandomOfferFeaturesArray();
  offer.description = '';
  offer.photos = getRandomOfferPhotosArray();
  location.x = getRandomNumber(PIN_WIDTH, mapSection.offsetWidth - PIN_WIDTH);
  location.y = getRandomNumber(130, 630);
  pin.author = author;
  pin.offer = offer;
  pin.location = location;

  return pin;
};

var renderMapPin = function (pin) {
  var mapPinElement = pinItem.cloneNode(true);

  mapPinElement.style.left = (pin.location.x - (PIN_WIDTH / 2)) + 'px';
  mapPinElement.style.top = (pin.location.y - (PIN_HEIGHT / 2)) + 'px';
  mapPinElement.querySelector('img').src = pin.author.avatar;
  mapPinElement.querySelector('img').alt = pin.offer.title;

  return mapPinElement;
};

var createMapPinNodes = function () {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < CARDS_COUNT; i++) {
    fragment.appendChild(renderMapPin(generateMapPinInfo()));
  }

  return fragment;
};

var createElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.classList.add(className);

  if (text) {
    element.textContent = text;
  }

  return element;
};

var renderOfferFeatures = function (features) {
  var offerFeature = createElement('li', 'popup__feature');

  offerFeature.classList.add('popup__feature--' + features);
  return offerFeature;
};

var renderOfferPhotos = function (photo) {
  var offerPhoto = createElement('img', 'popup__photo');

  offerPhoto.src = photo;
  offerPhoto.width = 45;
  offerPhoto.height = 40;
  offerPhoto.alt = 'Фотография жилья';

  return offerPhoto;
};

// card of ad
var renderMapCard = function (pin) {
  var mapCardElement = cardItem.cloneNode(true);

  mapCardElement.querySelector('.popup__avatar').src = pin.author.avatar;
  mapCardElement.querySelector('.popup__title').textContent = pin.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = pin.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = pin.offer.price + '₽';
  mapCardElement.querySelector('.popup__type').textContent = OFFER_TYPES[pin.offer.type];
  mapCardElement.querySelector('.popup__text--capacity').textContent = pin.offer.rooms + ' комнаты для ' + pin.offer.guests + ' гоcтей';
  mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + pin.offer.checkin + ', выезд до ' + pin.offer.checkout;
  mapCardElement.querySelector('.popup__features').textContent = '';

  for (var j = 0; j < pin.offer.features.length; j++) {
    mapCardElement.querySelector('.popup__features').appendChild(renderOfferFeatures(pin.offer.features[j]));
  }

  mapCardElement.querySelector('.popup__description').textContent = pin.offer.description;
  mapCardElement.querySelector('.popup__photos').textContent = '';

  for (var i = 0; i < pin.offer.photos.length; i++) {
    mapCardElement.querySelector('.popup__photos').appendChild(renderOfferPhotos(pin.offer.photos[i]));
  }

  return mapCardElement;
};

var createMapCardNodes = function () {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < CARDS_COUNT; i++) {
    fragment.appendChild(renderMapCard(generateMapPinInfo()));
  }

  return fragment;
};

mapSection.insertBefore(createMapCardNodes(), mapFiltersContainer);
mapPins.appendChild(createMapPinNodes());





