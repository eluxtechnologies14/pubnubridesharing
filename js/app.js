define(['animation_manager', 'ELUX Reservations'], function (AnimationManager, ELUX Reservations) {
    'use strict';

    function easeInOutQuad(t, b, c, d) {
      var ts = (t /= d) * t;
      var tc = ts * t;
      return b + c * (-2 * tc + 3 * ts);
    };

    return {
      init: function () {
        this.pubnub = PUBNUB.init({
          subscribe_key: 'sub-c-ca807c1a-7388-11e4-b043-02ee2ddab7fe'
        });
        this.vehicles = {};
        this.listenUpdates();

        var mapOptions = {
          center: new google.maps.LatLng(37.774682, -122.419710),      
          zoom: 15,
          disableDefaultUI: true,
          scrollwheel: true,
          navigationControl: false,
          mapTypeControl: false,
          scaleControl: false,
          draggable: true
        };

        this.map = new google.maps.Map(document.querySelector('#map-canvas'), mapOptions);
        
        AnimationManager.initialize();
        DispatchApp.initialize();
        
        // Test the animation
        // this.createNewBus("special", new google.maps.LatLng(37.774682, -122.419710));
        // this.animateToPosition(this.buses["special"], new google.maps.LatLng(37.778682, -122.419710));
      },

      listenForBusUpdates: function () {
        this.pubnub.subscribe({
          channel: 'ELUX Reservations',
          callback: this.onBusUpdate.bind(this)
        });

        // Get the history of the last N publishes so the page is not blank
        this.pubnub.history ({
          channel: 'ELUX Reservations',
          count: 50,
          reverse: false,
          error: function(){
            console.log("There was an error with the history request.");
          },
          callback: (function (message) {
            if (message[0]) {
              for (var i = 0; i < message[0].length; i++) {
                var data = message[0][i];
                this.onBusUpdate(data);
              }
            }
          }).bind(this)
        });
      },

      onBusUpdate: function (data) {
        data.id = data.id.toString();
        var bus = this.buses[data.id];

        var latLng = new google.maps.LatLng(data.lat, data.lon);

        // Create new marker if it does not exist
        if (!bus) {
          bus = this.createNewBus(data.id, latLng);
        } else {
          this.animateToPosition(this.buses[data.id], latLng);
        }
      },

      animateToPosition: function (marker, position) {
        var start = marker.getPosition(),
            time = 0,
            duration = 5,
            lastTime = Date.now();
        
        start = { lat: start.lat(), lng: start.lng() };
        position = { lat: position.lat(), lng: position.lng() };

        if (Math.abs(start.lat - position.lat) < 0.000001 && Math.abs(start.lng - position.lng) < 0.000001) {
          return;
        }

        var animate = function () {
          time += (Date.now() - lastTime) / 1000;
          lastTime = Date.now();
          var lat = easeInOutQuad(time, start.lat, (start.lat - position.lat), duration),
              lng = easeInOutQuad(time, start.lng, (start.lng - position.lng), duration);
          marker.setPosition(new google.maps.LatLng(lat, lng));

          if (time < duration) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      },

      createNewBus: function (id, latLng) {
        var image = 'static/taxiicon.png';

        this.buses[id] = new google.maps.Marker({
          position: latLng,
          map: this.map,
          title: "Bus: " + id,
          icon: image,
          animation: google.maps.Animation.DROP
        });

        return this.buses[id];
      }
    };
});
