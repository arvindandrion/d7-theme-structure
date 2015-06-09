// Jquery
(function ($, Drupal) {

  var calgaryLat = "51.0486151";
  var calgaryLng = "-114.0708459";

    //Loading the webshims libary to help older IE versions become more compatable.
      try{
        webshims.polyfill("geolocation");
      }catch(e){}

    Drupal.behaviors.czuar_frontend = {
        attach: function(context, settings) {
            var basePath = Drupal.settings.basePath;
            var pathToTheme = Drupal.settings.pathToTheme;
            var pathBase = Drupal.settings.basePath;
            var items = [];
            var domainHost = location.origin;

          var main = {
              init: function () {

                this.mobileSearch();
                this.searchMasonary();
                this.waitTime();
                this.welcomePage();
                this.checkLanguage();
                this.toggleSearch();
                this.showPhoneNumber();
                this.changeLocation();
                this.mapAllClinics();
                this.mapClinic();
                this.getPCN();

              },

              mobileSearch: function() {
                var inpt = $('.js-mobile-search .form-search-input');
                var ex = "<small>(Ex: Doctor's name, Clinic name)</small>";

                inpt.attr('placeholder', 'Enter Your Search Terms');
                inpt.after(ex);
              },
              searchMasonary:  function() {
                var $container = $('#masonary');
                // initialize
                $container.masonry({
                  itemSelector: '.js-items'
                });
                var msnry = $container.data('masonry');
              },
              waitTime:  function() {
                if($('body').is('.page-registration')){
                  var averageWaitTime  = $('.waittime-days');
                  var jsonPath  = "json/average-wait-time/scpcn";
                  $.get( basePath+jsonPath, function( data ) {
                    averageWaitTime.text(data + ' days');
                  }).fail(function() {
                    averageWaitTime.text("N/A");
                  });
                }
              },
              checkLanguage: function () {
                if($('body').is('.node-type-clinic') || $('body').is('.page-s')){
                  var cnt = $('.js-language .cnt');
                  cnt.each(function () {
                    if($(this).text().length <= 0){
                      $(this).prev().remove();
                    }
                  });
                }
              },
              welcomePage:  function() {
                if($('body').is('.front') && !$('body').is('.ie9')){
                  custom.mapResize('.js-welcome-section', 222, 'full', 'auto');
                }
                if($('body').is('.front')){
                  $('.btn-go').click(function(e) {
                      e.preventDefault();
                      //$("#addressform").submit();
                      custom.addressToLatLong($('#addressUser').val(), true,'map-pcn');
                  });
                }
                if($('body').is('.ie')){
                    $('.form-gender label').click(function() {
                        $(this).parent().parent().find('.active').removeClass('active');
                        $(this).addClass('active');
                    });
                    $('.form-age label').click(function() {
                        $(this).parent().parent().find('.active').removeClass('active');
                        $(this).addClass('active');
                    });
                }
          //On clicking the "use my location " button on the front page.
            $("#useMyLoc").click(function(){
              $("#addressUser").val("");
              $("#useMyLocSpinner").toggleClass('hide');
              $("#useMyLoc").text("Searching..");
              navigator.geolocation.getCurrentPosition(
                function(pos){
                  $("#useMyLoc").text("Found your location");
                  $("#useMyLocSpinner").toggleClass('hide');
                  $("#addresslat").val(pos.coords.latitude);
                  $("#addresslng").val(pos.coords.longitude);
                  //alert("found you! latitude: "+ pos.coords.latitude +"/longitude: " + pos.coords.longitude);
            });
      });

        $('#addressUser').on('input propertychange paste', function() {
          $("#addresslat").val('');
          $("#addresslng").val('');
          $("#useMyLoc").text("Use Current Location");

        });
              },
              toggleSearch: function() {
                $('.js-arrow-right').click(function(e) {
                    var thisParentII = $(this).parent().parent().parent();
                    if( thisParentII.hasClass('active') ){
                        thisParentII.removeClass('active');
                    }else{
                        thisParentII.addClass('active');
                        thisParentII.find('input[type=text]').focus();
                    }
                });
              },
              showPhoneNumber: function() {
                $('.btn-num-hidden').click(function(e) {
                    e.preventDefault();
                    $(this).hide();

                    //Show Number
                    $(this).next().removeClass('hide').addClass('flipInX animated');
                    $(this).next().one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                        $(this).removeClass('flipInX animated');
                    });
                });
              },
              changeLocation: function() {
                if ($('body').hasClass('page-node-514')) {
                      $('.js-change-loc').click(function(e) {
                          e.preventDefault();
                          $(this).parent().toggleClass('active');
                          $(this).prev().toggleClass('hide flipInX animated').find('.input-add').focus();
                      });

                      $('.btn-go').click(function(e) {
                          e.preventDefault();
                          // console.log("Runnng Pcn-map");
                          custom.addressToLatLong($("#addressUser").val(), true,'map-pcn');
                      });
                  }
              },
              mapAllClinics: function() {
                if(!$('body').is('.ie9')){
                  var wh = $(window).height();
                  if(wh > 777) {
                      custom.mapResize('#maps', 360, null, 'full');
                  }
                }

              },
              mapClinic: function() {

                // Get Height Function
                function getRightColHeight() {
                    var clDataHt = $('.clinic-data').height();
                    if ($(window).width() >= 1025) {
                        mapClinic.height(clDataHt);
                    } else {
                        mapClinic.height(376);
                    }
                }

                //format phone number
                $('.phone-num').each(function(){
                  var num = $(this).text();
                  var num = num.replace(/[\. (),:-]+/g, "");
                  var arr = num.split("");
                  arr.splice(3, 0, "-");
                  arr.splice(7, 0, "-");
                  $(this).text(arr.join(''));
                })

                    // Maps
                if ($('body').hasClass('node-type-clinic')) {
                    var clsName;
                    var mapClinic = $('.js-maps-clinic');
                    var clinicName = $('#section').attr('data-ttl');
                    var pcnClinicID = $('#section').attr('data-id');
                    var clinicLat = $('#section').attr('data-lat');
                    var clinicLon = $('#section').attr('data-lon');

                    try{
                      var latLongVal = $.cookie("geoLatLang").split(',');
                    } catch(err) {
                      var latLongValNotFound = true;
                    }

                    // Get PCN acronym
                    var arrPCNID = {4:'cwcpcn', 19:'hpcn', 18:'cfpcn', 14:'crpcn', 17:'scpcn', 20:'mpcn', 22:'bvpcn'};
                    $.each(arrPCNID , function(key, val) {
                        if(pcnClinicID === key){
                          clsName = val;
                          clsName = 'marker-'+clsName;
                          return false;
                        }
                    });

                    // create a map in the "map" div, set the view to a given place and zoom
                    var map = L.map('maps-clinic', {'scrollWheelZoom' : false});

                    if (latLongValNotFound) {
                      map.setView([clinicLat, clinicLon], 13);
                      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      }).addTo(map);
                    } else {
                      map.setView(latLongVal, 13);
                      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      }).addTo(map);

                      L.marker(latLongVal, {
                          icon: L.icon({
                          iconUrl: pathBase+pathToTheme+'/assets/img/icon-curr-location.png',
                          iconSize:     [15, 30], // size of the icon
                          shadowSize:   [15, 30], // size of the shadow
                          popupAnchor:  [0, -18]
                          })
                      }).addTo(map).bindPopup('<strong">You are here</strong>').openPopup();  
                    }

                    L.marker([clinicLat, clinicLon], {
                        icon: L.divIcon({
                        className: 'pin-marker '+clsName,
                        iconSize:     [27, 47], // size of the icon
                        popupAnchor:  [0, -18]
                        })
                    }).addTo(map).bindPopup('<strong">'+clinicName+'</strong>');


                    // Zoom both pin and your pin
                    map.fitBounds([
                        latLongVal,
                        [clinicLat, clinicLon]
                    ], {padding:[50,50]});
                }
              },
              getPCN: function() {
                // Grab the PCN title and paste it in the Modal
                if($('body').hasClass('node-type-clinic')) {
                  var $pcnTtl = $('.pcnTitle.pcn-bvpcn').text();
                  $('#mapModal .page-title').text($pcnTtl);
                }
              },
              searchFilter: function() {
                if($('body').hasClass('search-page')) {
                    function sticky_relocate() {
                        var window_top = $(window).scrollTop();
                        var div_top = $('.wrap2').offset().top;
                        if (window_top > div_top) {
                            $('.wrap1').addClass('sticky');
                        } else {
                            $('.wrap1').removeClass('sticky');
                        }
                    }
                    $(window).scroll(sticky_relocate);
                    sticky_relocate();
                  }
              }
            }

            var custom = {
                /**********************************************************************************
                Custom Functions
                **********************************************************************************/
                mapResize: function(elem, minusNum, wdVal, htVal){
                //Resize
                  var resizeWrapper = function(){
                    var wd = $(window).width();
                    var ht = $(window).height() - minusNum; //222  minus footer and header
                    if(wd >= 1025){
                        if(wdVal === "half"){
                            $(elem).height(ht);
                        }else if((wdVal === "full")){
                            $(elem).width(wd).height(ht);
                        }
                    }else{
                        $(elem).width(htVal).height(htVal);
                    }
                  }

                  resizeWrapper();
                  $(window).resize(function() {
                    resizeWrapper();
                  });
                },

                addressToLatLong: function(targetInput, mapAvail, pathTo){

                    var latLang, locLatLang, pathTo;
                    var geocoder = new google.maps.Geocoder();
                    var address = targetInput;

                    //Create a object with the current Lat/Lng
                    var buildLatLng = [];
                    buildLatLng[0] = $("#addresslat").val();
                    buildLatLng[1] = $("#addresslng").val();

                    // remove previous error
                    $(".spinner").fadeIn();
                    $('.js-errMsg').text('  ').fadeOut();

                    /*	Check PIN/Marker/Address if its in-bound the PCN area */
                    if(address){
                      geocoder.geocode( { 'address': address+" AB, CA"}, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                          locLatLang = results[0].geometry.location.lat()+','+results[0].geometry.location.lng();
                          latLang = locLatLang.split(',');

                          //Add the info to the hidden fields.
                          $("#addresslat").val(results[0].geometry.location.lat());
                          $("#addresslng").val(results[0].geometry.location.lng());

                          //Execute the form now that the fields are filled in.
                          //$("#addressform").submit();
                          buildLatLng[0] = results[0].geometry.location.lat();
                          buildLatLng[1] = results[0].geometry.location.lng();

                          //localStorage.setItem('geoLatLang', [latLang]);
                          //$.cookie("geoLatLang", results[0].geometry.location);

                          //alert("ADDRESS Found: " + locLatLang);
                          custom.validateAddress( buildLatLng, true,'map-pcn');
                        } else {
                          $('#errorModal').foundation('reveal','open');
                          $('.js-errMsg').fadeIn().append('Can\'t find your location. Please re-enter new address');
                          $(".spinner").fadeOut();
                        }
                      });
                    } else {
                      //No address was filled out check if the user clicked the "User my current location"
                      var checkLatLngForEmpty = $("#addresslat").val();
                      if(checkLatLngForEmpty){
                        //User clicked the "Use my current location button".
                        //$.cookie("geoLatLang", buildLatLng);
                        custom.validateAddress( buildLatLng, true,'map-pcn');
                        //$("#addressform").submit();
                      } else {
                      //User didnt fill out anything on the form, user Calgary city center and submit.
                      $("#addresslat").val(calgaryLat);
                      $("#addresslng").val(calgaryLng);
                      $("#addressform").submit();
                      }


                    }
                    // reset the form
                    // setTimeout(function(){
                    //     //console.log(latLang);
                    //     custom.validateAddress(latLang, mapAvail, pathTo);
                    // }, 2000);
                },
                /*  Check PIN/Marker/Address if its in-bound the PCN area */
                validateAddress: function(latLang, mapAvail, pathTo) {

                  if($('body').hasClass('page-node-514') || $('body').hasClass('front')) {
                    var latLang = latLang;
                    var mapAvail = mapAvail;
                    var pathTo = pathTo;
                    var outOfBound = true;
                    var pcn;
                    var i = 0;


                    var map = L.map('mapsII', {
                        'scrollWheelZoom' : false
                    });

                    var arPCN = [ "bow", "foothills", "rural", "west", "high", "mosaic", "south" ];

                    $.each(arPCN, function( i, val ) {
                        var pcn = L.polygon(pcnPolygonData[val]).getBounds().contains([latLang]);
                        if(pcn == true) {
                            outOfBound = false;
                            var circle;
                            var allClinicData = [];
                            var latLongVal = latLang;

                              if ($.cookie('radius')) {
                                  radius = $.cookie('radius');
                                  radius = parseInt(radius.replace(/"/g, ""));
                                  $("#radius").val(radius);
                              } else {
                                radius = 15000;
                              }

                            switch(radius) {
                                case 15000:
                                    map.setView(latLongVal, 11);
                                    break;
                                case 10000:
                                    map.setView(latLongVal, 11);
                                    break;
                                case 5000:
                                    map.setView(latLongVal, 12);
                                    break;
                                case 2500:
                                    map.setView(latLongVal, 13);
                                    break;
                                case 1000:
                                    map.setView(latLongVal, 14);
                                    break;
                                case 500:
                                    map.setView(latLongVal, 15);
                                    break;
                                default:
                                    map.setView(latLongVal, 11);
                            }

                            //Setter, add an OpenStreetMap tile layer
                            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            }).addTo(map);


                            return true;
                        }
                    });
                    //Remove the invisable map
                    map.remove();

                    if(outOfBound === true){
                        $('#errorModal').foundation('reveal','open');
                        $('.js-errMsg').fadeIn().append('It appears you have selected a location outside the Calgary area. Please try your search again or visit <a href="http://www.pcnpmo.ca/alberta-pcns/pages/map.aspx?redirect=edmoareadocs&zone=Edmonton&tab=doctor">www.pcnpmo.ca</a> to access these services outside the greater Calgary area.');
                        $(".spinner").fadeOut();
                        $('.btn-go, .btn-find-my-loc').removeAttr('disabled').attr('enabled', 'enabled');
                    } else {
                      var cookiez = latLang[0] + "," + latLang[1];
                      $.cookie("geoLatLang", cookiez);
                      $("#addressform").submit();
                    }
                    i++;
                  }
                }
            };

            // inititalize main and custom script
            main.init();
            custom;

            $('#radius').change(function() {
                var radius = $('#radius').val();
                $.cookie('radius', radius);
                location.reload();
            });
        }//End Attach
    };


})(jQuery, Drupal);
