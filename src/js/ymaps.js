ymaps.ready(init);
function init(){
    var myMap = new ymaps.Map("yandexMap", {
        center: [55.790139, 49.122657],
        zoom: 17,
        controls: []
    });

    var myPlacemark = new ymaps.Placemark([55.790139, 49.122657], {
        hintContent: 'Волгоградская ул., 47',
        balloonContent: 'Казань, Волгоградская ул., 47'
    });

    myMap.geoObjects.add(myPlacemark);
}
