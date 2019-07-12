'use strict';

//  МОДУЛЬ ФОРМЫ

(function () {
  var mapPin = document.querySelector('.map__pins');
  var formFieldAll = document.querySelector('.ad-form');
  // находим все fieldset формы обьявления
  var formFieldset = formFieldAll.querySelectorAll('fieldset');
  //  форма фильтры
  var formFilters = document.querySelector('.map__filters');
  formFilters.classList.add('ad-form--disabled');
  //  находим все select формы фильтров
  var formFiltersFieldset = formFilters.querySelectorAll('select');

  //  форма отправки обьявления
  var noticeBlock = document.querySelector('.notice');
  // форма блока отправки обьявления
  var noticeBlockForm = noticeBlock.querySelector('.ad-form');
  //  добаления атрабута ACTION
  noticeBlockForm.action = 'https://js.dump.academy/keksobooking';

  //  добавляем всем филдсетам disabled=true
  window.changeElementDisabledAtribute(formFiltersFieldset, true);
  //  добавляем всем филдсетам disabled=true
  window.changeElementDisabledAtribute(formFieldset, true);

  //  5
  //  заголовок обьявления
  var noticeTitle = noticeBlock.querySelector('#title');
  //  добавляем арибуты
  noticeTitle.setAttribute('minlength', 30);
  noticeTitle.setAttribute('maxlength', 100);
  noticeTitle.setAttribute('required', true);


  //  цена за ночь обьявления
  var noticePrice = noticeBlock.querySelector('#price');
  noticePrice.setAttribute('type', 'number');
  noticePrice.max = 1000000;
  //  прописал минимальное значение,что б при первом открытии не уходило в минусовое значение
  noticePrice.min = 0;
  noticePrice.setAttribute('required', true);
  // тип жилья обьявления
  var noticeTypeOfHousing = noticeBlock.querySelector('#type');

  //  зависимость мин цены от выбора типа жилья цепляем на событие change
  noticeTypeOfHousing.addEventListener('change', function () {

    switch (noticeTypeOfHousing.value) {
      case 'bungalo':
        noticePrice.min = '0';
        noticePrice.placeholder = '0';
        break;
      case 'flat':
        noticePrice.min = '1000';
        noticePrice.placeholder = '1000';
        break;
      case 'house':
        noticePrice.min = '5000';
        noticePrice.placeholder = '5000';
        break;
      case 'palace':
        noticePrice.min = '10000';
        noticePrice.placeholder = '10000';
        break;
    }
  });

  //  адрес обьявления
  var noticeAdress = noticeBlock.querySelector('#address');
  //  добавление атрибута координатам обьявления
  noticeAdress.setAttribute('readonly', true);
  //  время заезда
  var noticeTineOfIncom = noticeBlock.querySelector('#timein');
  //  время выезда
  var noticeTineOfOutcom = noticeBlock.querySelector('#timeout');


  //  синхронизация полей Время заезда/время выезда
  noticeTineOfIncom.addEventListener('change', function () {

    switch (noticeTineOfIncom.value) {
      case '12:00':
        noticeTineOfOutcom.value = '12:00';
        break;
      case '13:00':
        noticeTineOfOutcom.value = '13:00';
        break;
      case '14:00':
        noticeTineOfOutcom.value = '14:00';
        break;
    }
  });
  noticeTineOfOutcom.addEventListener('change', function () {

    switch (noticeTineOfOutcom.value) {
      case '12:00':
        noticeTineOfIncom.value = '12:00';
        break;
      case '13:00':
        noticeTineOfIncom.value = '13:00';
        break;
      case '14:00':
        noticeTineOfIncom.value = '14:00';
        break;
    }
  });

  //  Создание фильтров
  var housingType = formFilters.querySelector('#housing-type');

  //  фильтр типа жилья
  var typeOfHousingFilter = function (elem) {
    if (housingType.value === 'any') {
      return true;
    }
    return elem.offer.type === housingType.value;
  };

  //  фильтр стоимости
  var PriceOfHousing = formFilters.querySelector('#housing-price');
  var priceOfHousingfilter = function (elem) {
    if (PriceOfHousing.value === 'any') {
      return true;
    } else if (PriceOfHousing === 'low') {
      return elem.offer.price <= 10000;
    } else if (PriceOfHousing === 'high') {
      return elem.offer.price >= 50000;
    } else if (PriceOfHousing === 'middle') {
      return elem.offer.price >= 10000 && elem.offer.price <= 50000;
    } else {
      return false;
    }
  };

  //  фильтрация по количеству комнат
  var numOfRums = formFilters.querySelector('#housing-rooms');
  var numOfRumsFilter = function (elem) {
    if (numOfRums.value === 'any') {
      return true;
    }
    return elem.offer.rooms === Number(numOfRums.value);
  };
  //  фильтрация по количеству гостей
  var numOfGuests = formFilters.querySelector('#housing-guests');
  var numOfGuestsFilter = function (elem) {
    if (numOfGuests.value === 'any') {
      return true;
    }
    return elem.offer.guests === Number(numOfGuests.value);
  };

  var filterFeaturesCheckboxes = formFilters.querySelectorAll('#housing-features input[type=checkbox]:checked');
  //  фильтрация по чекбоксам
  var featuresFilter = function (elem) {
    var filtered = true;
    //  условие при котором проверяеться включен ли хоть один чекбокс
    if (filterFeaturesCheckboxes.length) {
      //  проверка каждого елемента массива
      filterFeaturesCheckboxes.forEach(function (chBox) {
        //  если ни один чекбокс не выбран
        if (!elem.offer.features.includes(chBox.value)) {
          filtered = false;
        }
      });
    }
    return filtered;
  };

  //  общий фильтр
  window.commonFilter = function (elem) {
    return typeOfHousingFilter(elem) && priceOfHousingfilter(elem) && numOfRumsFilter(elem) && numOfGuestsFilter(elem) && featuresFilter(elem);
  };

  window.commonFilter(window.apartmentsList);
  //  очистка карты от уже прорисованых  пинов
  debugger
  var clearAllOfPins = function () {
    mapPin.removeChild(window.pinsFragment);
  };
  console.log(window.pinsFragment);




  var onChangePinFiltersFields = function () {
    debugger
    clearAllOfPins();
    //  window.apartamentsList.filter(commonFilter).slice(0, 5);
    window.pinsFragment = window.createPinsFragment(window.apartmentsList.filter(window.commonFilter).slice(0, 5));
    //  функция отображения пинов после загрузки карты
    mapPin.appendChild(window.pinsFragment);
  };
  debugger
  //  делаеи выборку всех нажимаемых изменяемых елементов фильтров
  var pinFiltersFields = formFilters.querySelectorAll('.map__filter , .map__features');
  //  для каждого елемента массива ставим слушатель
  pinFiltersFields.forEach(function (elem) {
    elem.addEventListener('change', onChangePinFiltersFields);
  });

})();
