let map;
let markers = [];
let infoWindow;

function initMap() {
    const losAngeles = {
        lat: 34.063380,
        lng: -118.358080
    };
    const styledMapType = new google.maps.StyledMapType(
        [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#ebe3cd"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#523735"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#f5f1e6"
                }
              ]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#c9b2a6"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#dcd2be"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#ae9e90"
                }
              ]
            },
            {
              "featureType": "landscape.natural",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dfd2ae"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dfd2ae"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#93817c"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#a5b076"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#447530"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#f5f1e6"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#fdfcf8"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#f8c967"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#e9bc62"
                }
              ]
            },
            {
              "featureType": "road.highway.controlled_access",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#e98d58"
                }
              ]
            },
            {
              "featureType": "road.highway.controlled_access",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#db8555"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#806b63"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dfd2ae"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#8f7d77"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#ebe3cd"
                }
              ]
            },
            {
              "featureType": "transit.station",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#dfd2ae"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#b9d3c2"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#92998d"
                }
              ]
            }
        ],
        {name: 'Retro'}
    );
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 11,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
        }
    });
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
    infoWindow = new google.maps.InfoWindow();
    searchStores();
}

const clearLocations = () => {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}


const searchStores = () => {
    let foundStores = [];
    const zipcode = document.getElementById('zip-code-input').value;
    if(zipcode) {
        for(store of stores) {
            const postal = store.address.postalCode.substring(0,5);
            if(postal == zipcode) {
                foundStores.push(store);
            }
        }
    } else {
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    clickListStore();
}

const displayStores = (stores) => {
    let htmlStores = '';

    stores.map((store, index) => {
        const address = store.addressLines;
        const phone = store.phoneNumber;

        htmlStores += `
            <div class="store-container">
                <div class="store">
                    <div>
                        <div class="store-address">
                            <p>${ address[0] }</p>
                            <p>${ address[1] }</p>
                        </div>
                        <div class="store-phone-number">
                            ${ phone }
                        </div>
                    </div>
                    <div>
                        <div class="store-marker">
                            ${ index + 1 }
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.querySelector('.stores-list').innerHTML = htmlStores;
    });
}

const showStoresMarkers = (stores) => {
    const bounds = new google.maps.LatLngBounds();
    stores.map((store, index) => {
        const name = store.name;
        const address = store.addressLines;
        const open = store.openStatusText;
        const number = store.phoneNumber;
        const latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude
        );
        bounds.extend(latlng);
        createMarker(latlng, name, address, open, number, index+1);
    });
    map.fitBounds(bounds);
}

const createMarker = (latlng, name, address, open, number, index) => {
    // const html = "<b>" + name + "</b> <br>" + address;
    const html = `
        <div class="gmaps-window">
            <div class="card-up">
                <p class="card-name">${ name }</p>
                <p class="card-open">${ open }</p>
            </div>
            <div class="card-down">
                <p><i class="fas fa-location-arrow"></i><a href="https://google.com/maps/dir/?api=1&destination=${address[0] + ' ' + address[1]}" target="_blank" rel="noreferrer noopener">${ address[0] }</a></p>
                <p><i class="fas fa-phone-alt"></i></i>${ number }</p>
            </div>
        </div>
    `; 
    const marker = new google.maps.Marker({
        map: map,
        position: latlng,
        icon: {
            url: 'store-icon.svg',
            scaledSize: new google.maps.Size(42, 34),
            origin: new google.maps.Point(0, 0),
            labelOrigin: new google.maps.Point(22,6)
        },
        label: {
            text: String(index),
            color: '#fff',
            fontSize: '1.4em',
            fontWeight: '700'
        }
    });
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);
}

const clickListStore = () => {
    const listStore = document.querySelectorAll('.store-container');
    listStore.forEach((element, index) => {
        element.addEventListener('click', () => {
            new google.maps.event.trigger(markers[index], 'click');
        });
    });
}